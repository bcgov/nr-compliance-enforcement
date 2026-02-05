import { Inject, Injectable, Logger } from "@nestjs/common";
import { CdogsService } from "../../external_api/cdogs/cdogs.service";
import { ComplaintService } from "../complaint/complaint.service";
import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";
import { Attachment, AttachmentType } from "../../types/models/general/attachment";
import archiver from "archiver";
import { get } from "../../helpers/axios-api";
import axios from "axios";
import https from "https";
import http from "http";
import { URL } from "url";

interface AttachmentInfo {
  id: string;
  name: string;
  size: number;
}

interface BulkDownloadRequest {
  taskId: string;
  taskNumber: number;
  attachments: AttachmentInfo[];
}

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  @Inject(CdogsService)
  private readonly cdogs: CdogsService;

  @Inject(ComplaintService)
  private readonly ceds: ComplaintService;

  exportComplaint = async (id: string, type: COMPLAINT_TYPE, fileName: string, tz, attachments, token) => {
    const complaintsAttachments = attachments?.complaintsAttachments ?? [];
    const outcomeAttachments = attachments?.outcomeAttachments ?? [];

    const combinedAttachments: Attachment[] = [
      ...complaintsAttachments.map((item, index) => {
        return {
          type: AttachmentType.COMPLAINT_ATTACHMENT,
          user: item.createdBy,
          name: decodeURIComponent(item.name),
          date: item.createdAt,
          sequenceId: index,
        } as Attachment;
      }),
      ...outcomeAttachments.map((item, index) => {
        return {
          type: AttachmentType.OUTCOME_ATTACHMENT,
          date: item.createdAt,
          name: decodeURIComponent(item.name),
          user: item.createdBy,
          sequenceId: index,
        } as Attachment;
      }),
    ];

    try {
      //-- get the complaint from the system, but do not include anything other
      //-- than the base complaint. no maps, no attachments, no outcome data
      const data = await this.ceds.getReportData(id, type, tz, token, combinedAttachments);

      //--
      return await this.cdogs.generate(fileName, data, type);
    } catch (error) {
      this.logger.error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
      throw new Error(`exception: unable to export document for complaint: ${id} - error: ${error}`);
    }
  };

  taskBulkDownload = async (req, res, token) => {
    const { taskId, taskNumber, attachments }: BulkDownloadRequest = req.body;

    try {
      if (!attachments || attachments.length === 0) {
        return res.status(400).json({ error: "No attachments provided" });
      }

      // Set streaming headers
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="Task_${taskNumber}_Attachments.zip"`);
      res.setHeader("Transfer-Encoding", "chunked");

      // Create archiver
      const archive = archiver("zip", {
        zlib: { level: 1 },
      });

      archive.on("error", (err) => {
        console.error("Archive error:", err);
        if (!res.headersSent) {
          res.status(500).end();
        }
      });

      archive.pipe(res); // Stream archive data to the response

      let successCount = 0;
      let failureCount = 0;

      // Stream each file - Process sequentially and wait for each file
      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];

        try {
          this.logger.log(
            `\n[${i + 1}/${attachments.length}] Processing: ${attachment.name} (${(
              attachment.size /
              (1024 * 1024)
            ).toFixed(2)} MB)`,
          );

          // Get presigned URL
          const presignedUrl = await this.getDownloadUrl(token, attachment.id);
          this.logger.log("Got presigned URL");

          // Get file stream
          this.logger.log("Starting file download...");
          const fileStream = await this.downloadFileAsStream(presignedUrl);
          this.logger.log("File stream obtained");
          const skipCompression = /\.(mp4|mov|avi|mkv|zip|rar|7z|jpg|jpeg|png|gif|mp3|m4a|pdf)$/i.test(attachment.name);

          // Track bytes for progress logging
          let bytesProcessed = 0;
          const totalBytes = attachment.size || 0;
          let lastLogTime = Date.now();

          // Add to archive first, wait for completion
          await new Promise<void>((resolve, reject) => {
            // Set up stream event listeners before adding to archive
            fileStream.on("data", (chunk) => {
              bytesProcessed += chunk.length;

              // Log progress every 5 seconds for large files
              const now = Date.now();
              if (now - lastLogTime > 5000 && totalBytes > 0) {
                const percentComplete = ((bytesProcessed / totalBytes) * 100).toFixed(1);
                const mbProcessed = (bytesProcessed / (1024 * 1024)).toFixed(2);
                const mbTotal = (totalBytes / (1024 * 1024)).toFixed(2);
                this.logger.log(`Progress: ${percentComplete}% (${mbProcessed}/${mbTotal} MB)`);
                lastLogTime = now;
              }
            });

            fileStream.on("end", () => {
              const mbProcessed = (bytesProcessed / (1024 * 1024)).toFixed(2);
              this.logger.log(`✓ Stream completed for ${attachment.name} (${mbProcessed} MB processed)`);
              resolve();
            });

            fileStream.on("error", (error) => {
              this.logger.error(`✗ Stream error for ${attachment.name}: ${error.message}`);
              reject(error);
            });

            // NOW add to archive - this starts the data flow
            this.logger.log("Adding to archive...");
            archive.append(fileStream, {
              name: attachment.name,
              store: skipCompression,
            });
            this.logger.log("Added to archive, waiting for stream to complete...");
          });

          successCount++;
          this.logger.log(`✓ Successfully added ${attachment.name} (${successCount}/${attachments.length})\n`);
        } catch (error) {
          failureCount++;
          this.logger.error(`Failed to add ${attachment.name}: ${error.message}`);
          // Continue with other files
        }
      }

      await archive.finalize();
      console.log(`Bulk download completed: Task ${taskId}`);
    } catch (error) {
      console.error("Bulk download error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to generate download" });
      }
    }
  };

  getDownloadUrl = async (token, objectId: string) => {
    const COMS_URL = process.env.OBJECTSTORE_API_URL;
    const url = `${COMS_URL}/object/${objectId}?download=url`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  /**
   * Download file from S3 presigned URL as a stream
   * Uses native Node.js http/https for reliable streaming
   */
  downloadFileAsStream = (presignedUrl: string): Promise<NodeJS.ReadableStream> => {
    return new Promise((resolve, reject) => {
      try {
        const parsedUrl = new URL(presignedUrl);
        const protocol = parsedUrl.protocol === "https:" ? https : http;

        this.logger.log(`Downloading from: ${parsedUrl.hostname}${parsedUrl.pathname.substring(0, 50)}...`);

        const request = protocol.get(presignedUrl, (response) => {
          // Handle redirects
          if (response.statusCode === 301 || response.statusCode === 302) {
            const redirectUrl = response.headers.location;
            if (redirectUrl) {
              this.logger.log(`Following redirect...`);
              this.downloadFileAsStream(redirectUrl).then(resolve).catch(reject);
              return;
            }
          }

          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
            return;
          }

          this.logger.log(`✓ Stream started, status: ${response.statusCode}`);

          // Return the stream
          resolve(response as NodeJS.ReadableStream);
        });

        request.on("error", (error) => {
          this.logger.error(`Request error: ${error.message}`);
          reject(error);
        });

        // Connection timeout only (30 seconds to establish connection)
        request.setTimeout(30000, () => {
          request.destroy();
          reject(new Error("Connection timeout"));
        });
      } catch (error) {
        this.logger.error(`Error creating request: ${error.message}`);
        reject(error);
      }
    });
  };
}
