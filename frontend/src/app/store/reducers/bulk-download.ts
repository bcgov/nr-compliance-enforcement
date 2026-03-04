import { AppThunk } from "@store/store";
import { generateApiParameters, get } from "@common/api";
import { COMSObject } from "@apptypes/coms/object";
import config from "@/config";
import { ToggleError, ToggleSuccess, ToggleWarning } from "@common/toast";
import * as zip from "@zip.js/zip.js";
import { AUTH_TOKEN } from "@/app/service/user-service";

interface FileWithPresignedUrl {
  id: string;
  name: string;
  size: number;
  url: string;
}

/**
 * Configure zip.js once when app loads
 */
export const configureZipJs = () => {
  zip.configure({
    useWebWorkers: true,
  });
};

/**
 * Main bulk download function
 */
export const bulkDownload =
  (taskId: string, taskNumber: number, attachments: COMSObject[]): AppThunk =>
  async (dispatch) => {
    // Prevent concurrent downloads
    if ((globalThis as any).__bulkDownloadInProgress) {
      ToggleError("A download is already in progress. Please wait.");
      return;
    }

    try {
      (globalThis as any).__bulkDownloadInProgress = true;

      const authToken = localStorage.getItem(AUTH_TOKEN);
      if (!authToken) {
        ToggleError("Authentication required");
        return;
      }

      // Start download
      await bulkDownloadWithZipJs(taskId, taskNumber, attachments, authToken, dispatch);
    } catch (error) {
      console.error("Bulk download error:", error);

      if (error instanceof Error) {
        if (error.message.includes("Out of memory") || error.message.includes("allocation failed")) {
          ToggleError(
            `Browser ran out of memory. Try:\n` +
              `• Close other tabs\n` +
              `• Download fewer files at once\n` +
              `• Use a desktop browser with more RAM`,
          );
        } else if (error.message.includes("quota")) {
          ToggleError("Browser storage quota exceeded. Please free up disk space.");
        } else if (error.message.includes("COMS API URL not configured")) {
          ToggleError("Configuration error: COMS API URL is missing. Please contact support.");
        } else {
          ToggleError(`Failed to download: ${error.message}`, { autoClose: false });
        }
      } else {
        ToggleError("Failed to download attachments. Please try again.", { autoClose: false });
      }
    } finally {
      (globalThis as any).__bulkDownloadInProgress = false;
    }
  };

/**
 * Download and ZIP files using zip.js
 */
async function bulkDownloadWithZipJs(
  taskId: string,
  taskNumber: number,
  attachments: COMSObject[],
  authToken: string,
  dispatch?: any,
): Promise<void> {
  // Get presigned URLs for all files concurrently
  const urlPromises = attachments.map(async (attachment, index) => {
    try {
      const url = `${config.COMS_URL}/object/${attachment.id}?download=url&expiresIn=3600`;
      const params = generateApiParameters(url);

      let presignedUrl = await get<string>(dispatch, params);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(`Failed to get URL for ${attachment.name}: HTTP ${response.status} - ${errorText ?? ""}`);
      }

      return {
        id: attachment.id,
        name: attachment.name,
        size: attachment.size || 0,
        url: presignedUrl.trim(),
      };
    } catch (error) {
      console.error(`    ✗ Failed to get presigned URL for ${attachment.name}:`, error);
      throw error;
    }
  });

  // let files: FileWithPresignedUrl[];
  let files: any[];

  try {
    files = await Promise.all(urlPromises);
  } catch (error) {
    console.error("Failed to get presigned URLs from COMS:", error);
    throw new Error(
      `Failed to get download URLs from COMS API. ${error instanceof Error ? error.message : "Please try again."}`,
    );
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const totalSizeMB = totalSize / (1024 * 1024);

  // Step 2: Create ZIP using zip.js
  await createZipWithZipJs(files, taskNumber, totalSizeMB);
}

/**
 * Create ZIP file using zip.js
 */
async function createZipWithZipJs(
  files: FileWithPresignedUrl[],
  taskNumber: number,
  totalSizeMB: number,
): Promise<void> {
  // Configuration for retry logic and memory management
  const CONFIG = {
    MAX_RETRIES: 3, // Retry failed downloads up to 3 times
    RETRY_DELAY_BASE_MS: 2000, // Base delay: 2s, 4s, 6s
    MEMORY_CLEANUP_DELAY_MS: 1500, // Pause between files for memory cleanup
    MEMORY_HIGH_THRESHOLD: 80, // Warn if memory > 80%
  };

  // Monitor memory usage
  const logMemory = () => {
    if ((performance as any).memory) {
      const mem = (performance as any).memory;
      const usedMB = (mem.usedJSHeapSize / 1024 / 1024).toFixed(0);
      const limitMB = (mem.jsHeapSizeLimit / 1024 / 1024).toFixed(0);
      const availableMB = ((mem.jsHeapSizeLimit - mem.usedJSHeapSize) / (1024 * 1024)).toFixed(0);
      const percentUsed = ((mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100).toFixed(1);

      console.log(`Memory: ${usedMB}MB / ${limitMB}MB (${percentUsed}% used, ${availableMB}MB available)`);

      if (Number.parseFloat(percentUsed) > CONFIG.MEMORY_HIGH_THRESHOLD) {
        console.warn(`Memory usage is HIGH (${percentUsed}%)`);
      }

      return {
        usedMB: Number.parseInt(usedMB),
        limitMB: Number.parseInt(limitMB),
        availableMB: Number.parseInt(availableMB),
        percentUsed: Number.parseFloat(percentUsed),
      };
    }
    return null;
  };

  // Create ZIP writer
  const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
    bufferedWrite: true,
    useCompressionStream: true,
  });

  let completedFiles = 0;
  let failedFiles = 0;
  let totalBytesProcessed = 0;
  const failedFileNames: string[] = [];
  const startTime = Date.now();

  //Retry download
  async function downloadFileWithRetry(
    file: FileWithPresignedUrl,
    fileIndex: number,
    totalFiles: number,
  ): Promise<{ success: boolean; blob?: Blob; error?: Error; attempts: number }> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
      try {
        const attemptPrefix = attempt > 1 ? `  [Retry ${attempt - 1}/${CONFIG.MAX_RETRIES - 1}] ` : "  ";

        console.log(`${attemptPrefix} Downloading (attempt ${attempt}/${CONFIG.MAX_RETRIES})`);

        // Check available memory before download
        const memInfo = logMemory();
        if (memInfo && attempt > 1) {
          const neededMB = (file.size / (1024 * 1024)) * 1.5; // Estimate with buffer

          if (memInfo.availableMB < neededMB) {
            console.warn(`${attemptPrefix} Low memory detected. Waiting 3s for cleanup...`);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            logMemory();
          }
        }

        // Download file
        const response = await fetch(file.url, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Download blob
        const blob = await response.blob();

        // Validate blob
        if (blob.size === 0) {
          throw new Error("Downloaded blob is 0 bytes");
        }

        // Verify size if expected size is known
        if (file.size > 0) {
          const sizeDiff = Math.abs(blob.size - file.size);
          const sizePercentDiff = (sizeDiff / file.size) * 100;

          if (sizePercentDiff > 5) {
            console.warn(
              `${attemptPrefix} Size mismatch: Expected ${(file.size / (1024 * 1024)).toFixed(2)}MB, got ${(blob.size / (1024 * 1024)).toFixed(2)}MB (${sizePercentDiff.toFixed(1)}% diff)`,
            );
          }
        }

        // Success!
        return { success: true, blob, attempts: attempt };
      } catch (error) {
        lastError = error as Error;

        const attemptPrefix = `  [Attempt ${attempt}/${CONFIG.MAX_RETRIES}] `;
        console.error(`${attemptPrefix}✗ Failed: ${lastError.message}`);

        // Identify error type
        const errorMsg = lastError.message.toLowerCase();
        let errorType = "UNKNOWN";
        let shouldRetry = true;

        if (errorMsg.includes("timeout") || errorMsg.includes("timed out")) {
          errorType = "TIMEOUT";
        } else if (errorMsg.includes("network") || errorMsg.includes("failed to fetch")) {
          errorType = "NETWORK";
        } else if (errorMsg.includes("403") || errorMsg.includes("forbidden")) {
          errorType = "AUTH_EXPIRED";
          shouldRetry = false; // Don't retry auth errors (URL expired)
        } else if (errorMsg.includes("404")) {
          errorType = "NOT_FOUND";
          shouldRetry = false; // Don't retry 404s
        } else if (errorMsg.includes("0 bytes") || errorMsg.includes("empty")) {
          errorType = "EMPTY_FILE";
        } else if (errorMsg.includes("memory") || errorMsg.includes("allocation")) {
          errorType = "OUT_OF_MEMORY";
        }

        console.error(`${attemptPrefix}Error type: ${errorType}`);

        // Don't retry certain error types
        if (!shouldRetry) {
          console.error(`${attemptPrefix}This error type should not be retried. Aborting.`);
          return { success: false, error: lastError, attempts: attempt };
        }

        // If not last attempt, wait before retry
        if (attempt < CONFIG.MAX_RETRIES) {
          const delayMs = CONFIG.RETRY_DELAY_BASE_MS * attempt; // 2s, 4s, 6s
          console.log(`${attemptPrefix} Waiting ${(delayMs / 1000).toFixed(1)}s before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));

          // Log memory before retry
          logMemory();
        }
      }
    }

    // All retries failed
    console.error(`All ${CONFIG.MAX_RETRIES} attempts failed for ${file.name}`);
    return { success: false, error: lastError || new Error("All retries failed"), attempts: CONFIG.MAX_RETRIES };
  }

  // ===== MAIN PROCESSING LOOP =====
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Check URL expiry
    const expiryMatch = /X-Amz-Expires=(\d+)/.exec(file.url);
    if (expiryMatch) {
      const expirySeconds = Number.parseInt(expiryMatch[1]);
      const expiryMinutes = (expirySeconds / 60).toFixed(1);

      // Warn if file might take longer than expiry
      if (file.size > 0) {
        const estimatedSeconds = file.size / (10 * 1024 * 1024); // Assume 10MB/s
        if (estimatedSeconds > expirySeconds) {
          console.warn(
            `File might take ~${(estimatedSeconds / 60).toFixed(1)} min to download, but URL expires in ${expiryMinutes} min`,
          );
        }
      }
    }

    try {
      // ===== DOWNLOAD WITH RETRY =====
      const downloadResult = await downloadFileWithRetry(file, i, files.length);

      if (!downloadResult.success || !downloadResult.blob) {
        throw downloadResult.error || new Error("Download failed");
      }

      const blob = downloadResult.blob;

      if (downloadResult.attempts > 1) {
        console.log(`Succeeded after ${downloadResult.attempts} attempts`);
      }

      // ===== ADD BLOB TO ZIP =====
      const skipCompression =
        /\.(mp4|mov|avi|mkv|flv|wmv|webm|m4v|mpg|mpeg|3gp|zip|rar|7z|gz|bz2|xz|tar|jpg|jpeg|png|gif|webp|bmp|ico|svg|mp3|m4a|aac|ogg|flac|wav|wma|pdf|epub|mobi)$/i.test(
          file.name,
        );
      const compressionLevel = skipCompression ? 0 : 1;

      await zipWriter.add(file.name, new zip.BlobReader(blob), {
        level: compressionLevel,
        bufferedWrite: true,
      });

      completedFiles++;
      totalBytesProcessed += blob.size;

      console.log(`✅ Success! Progress: ${completedFiles}/${files.length} files`);

      // Pause briefly between files to allow memory cleanup
      if (i + 1 < files.length) {
        await new Promise((resolve) => setTimeout(resolve, CONFIG.MEMORY_CLEANUP_DELAY_MS));
      }
    } catch (error) {
      failedFiles++;
      failedFileNames.push(file.name);

      console.error(`\nFAILED: ${file.name}`);
      console.error(`Final error: ${error instanceof Error ? error.message : String(error)}`);

      // Detailed error categorization
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();

        if (errorMsg.includes("timeout") || errorMsg.includes("timed out")) {
          console.error(`  → Type: TIMEOUT ERROR`);
        } else if (errorMsg.includes("network") || errorMsg.includes("failed to fetch")) {
          console.error(`  → Type: NETWORK ERROR`);
        } else if (errorMsg.includes("403") || errorMsg.includes("forbidden")) {
          console.error(`  → Type: AUTH ERROR (403 Forbidden)`);
        } else if (errorMsg.includes("404")) {
          console.error(`  → Type: NOT FOUND ERROR (404)`);
        } else if (errorMsg.includes("0 bytes") || errorMsg.includes("empty")) {
          console.error(`  → Type: EMPTY FILE ERROR`);
        } else if (errorMsg.includes("memory") || errorMsg.includes("allocation")) {
          console.error(`  → Type: OUT OF MEMORY ERROR`);
        } else {
          console.error(`  → Type: UNKNOWN ERROR`);
        }
      }

      // Add error placeholder
      try {
        const errorMessage =
          `Failed to download this file after ${CONFIG.MAX_RETRIES} attempts\n\n` +
          `Filename: ${file.name}\n` +
          `Expected Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB\n` +
          `Error: ${error instanceof Error ? error.message : String(error)}\n` +
          `Error Type: ${error instanceof Error ? error.constructor.name : typeof error}\n` +
          `Timestamp: ${new Date().toISOString()}\n` +
          `File Index: ${i + 1} of ${files.length}\n` +
          `Retry Attempts: ${CONFIG.MAX_RETRIES}\n\n`;

        await zipWriter.add(`ERROR_${file.name}.txt`, new zip.TextReader(errorMessage), { level: 0 });
      } catch (placeholderError) {
        console.error(`Could not add error placeholder:`, placeholderError);
      }

      // Pause after error to allow memory recovery
      if (i + 1 < files.length) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  // ===== SUMMARY =====
  if (failedFiles > 0) {
    console.log(`\n Failed files (after ${CONFIG.MAX_RETRIES} retry attempts each):`);
    failedFileNames.forEach((name, idx) => console.log(`    ${idx + 1}. ${name}`));

    ToggleWarning(
      `Downloaded ${completedFiles} of ${files.length} files. ` +
        `${failedFiles} failed after ${CONFIG.MAX_RETRIES} retry attempts. `,
      { autoClose: false },
    );
  } else {
    ToggleSuccess(`Successfully downloaded ${files.length} files.`, { autoClose: false });
  }

  // ===== FINALIZE ZIP =====
  const zipBlob = await zipWriter.close();

  // ===== TRIGGER DOWNLOAD =====
  const downloadUrl = globalThis.URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `Task_${taskNumber}_Attachments.zip`;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    link.remove();
    globalThis.URL.revokeObjectURL(downloadUrl);
    console.log(`Cleanup completed`);
    logMemory();
  }, 1000);
}
