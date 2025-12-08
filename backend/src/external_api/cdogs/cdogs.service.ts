import { Inject, Injectable, Logger } from "@nestjs/common";
import { ExternalApiService } from "../external-api-service";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { get, post } from "../../helpers/axios-api";
import { ConfigurationService } from "../../v1/configuration/configuration.service";
import { COMPLAINT_TYPE } from "../../types/models/complaints/complaint-type";
import { CONFIGURATION_CODES } from "../../types/configuration-codes";
import { constants } from "http2";
import FormData = require("form-data");
import fs = require("fs");
import { join } from "path";

@Injectable()
export class CdogsService implements ExternalApiService {
  private readonly logger = new Logger(CdogsService.name);

  readonly authApi: string;
  readonly baseUri: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly grantType: string;

  @Inject(ConfigurationService)
  readonly configService: ConfigurationService;

  constructor() {
    this.authApi = process.env.COMS_JWT_AUTH_URI;
    this.baseUri = process.env.CDOGS_URI;
    this.clientId = process.env.CDOGS_CLIENT_ID;
    this.clientSecret = process.env.CDOGS_CLIENT_SECRET;
    this.grantType = "client_credentials";
  }

  private _isCachedTemplateValid = async (apiToken: string, uid: string): Promise<boolean> => {
    let url = `${this.baseUri}/api/v2/template/${uid}`;
    const headers: any = {
      "Content-Type": "application/json",
    };

    try {
      const response: AxiosResponse = await get(apiToken, url, headers);
      const { status } = response;
      if (status === constants.HTTP_STATUS_OK) {
        return true;
      }
    } catch (error) {
      this.logger.log(`Template not cached: ${error}`);
      return false;
    }
  };

  private _getTemplateId = async (code: string) => {
    try {
      const config = await this.configService.findByCode(code);

      if (config) {
        return config.configurationValue;
      }
    } catch (error) {
      this.logger.error(`Unable to retrieve template ${code} hash`);
      throw Error(`Unable to retrieve template ${code} hash`);
    }
  };

  private _applyData = async (data: any, name: string) => {
    return {
      data: {
        ...data,
      },
      options: {
        cacheReport: false,
        convertTo: "pdf",
        overwrite: true,
        reportName: name,
      },
    };
  };

  authenticate = async (): Promise<string> => {
    const response: AxiosResponse = await axios.post(
      this.authApi,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: this.grantType,
      },
      {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return response?.data?.access_token;
  };

  //--
  //-- check the cdogs service to see if the template requred
  //-- is cached, if it is not, upload the template and update
  //-- the system configuration hash for the template
  //--
  isTemplateCached = async (apiToken: string, templateCode: string): Promise<boolean> => {
    let result = false;
    const config = await this.configService.findByCode(templateCode);

    //-- if there's a value for the template double check
    //-- that the the template hash is still valid
    if (config?.configurationValue) {
      result = await this._isCachedTemplateValid(apiToken, config.configurationValue);
    }

    return result;
  };

  //--
  //-- upload a template to the CDOGS api, if the template exists
  //-- the system will return the template hash, and this will
  //-- need to be stored for the next time the document needs to be
  //-- generated
  //--
  upload = async (apiToken: string, type: string, templateCode: string) => {
    const url = `${this.baseUri}/api/v2/template`;

    let template: string;

    switch (templateCode) {
      case "HWCTMPLATE":
        template = "templates/complaint/CDOGS-HWCR-COMPLAINT-TEMPLATE-v1.docx";
        break;
      case "ERSTMPLATE":
        template = "templates/complaint/CDOGS-ERS-COMPLAINT-TEMPLATE-v1.docx";
        break;
      case "CEEBTMPLAT":
        template = "templates/complaint/CDOGS-CEEB-COMPLAINT-TEMPLATE-v1.docx";
        break;
      case "GIRTMPLATE":
        template = "templates/complaint/CDOGS-GIR-COMPLAINT-TEMPLATE-v1.docx";
        break;
      case "PRKHWCTMPT":
        template = "templates/complaint/CDOGS-PARKS-HWCR-COMPLAINT-TEMPLATE-v1.docx";
        break;
      case "PRKERSTMPT":
        template = "templates/complaint/CDOGS-PARKS-ERS-COMPLAINT-TEMPLATE-v1.docx";
        break;
      case "PRKGIRTMPT":
        template = "templates/complaint/CDOGS-PARKS-GIR-COMPLAINT-TEMPLATE-v1.docx";
        break;

      case "EXTCEEBT":
        template = "templates/complaint/CDOGS-EXT-CEEB-COMPLAINT-TEMPLATE-v1.docx";
        break;
      case "EXTPRKERST":
        template = "templates/complaint/CDOGS-EXT-PARKS-ERS-COMPLAINT-TEMPLATE-v1.docx";
        break;
      case "EXTERSTMPT":
        template = "templates/complaint/CDOGS-EXT-ERS-COMPLAINT-TEMPLATE-v1.docx";
        break;
      case "EXTPRKGIRT":
        template = "templates/complaint/CDOGS-EXT-PARKS-GIR-COMPLAINT-TEMPLATE-v1.docx";
        break;
      case "EXTGIRT":
        template = "templates/complaint/CDOGS-EXT-GIR-COMPLAINT-TEMPLATE-v1.docx";
        break;
      default:
        this.logger.error(`exception: unable to find template: ${template}`);
        break;
    }

    const path = join(process.cwd(), template);

    try {
      const bodyFormData = new FormData();
      bodyFormData.append("template", fs.createReadStream(path));
      const headers: any = {
        ...bodyFormData.getHeaders(),
      };

      const response: AxiosResponse = await post(apiToken, url, bodyFormData, headers);

      //-- update the system with the hash provided by the CDGOS api
      const { data: hash } = response;
      await this.configService.updateByCode(templateCode, hash);
    } catch (error) {
      //-- if CDOGS already has a template cached the api will throw an error
      //-- with the existing template hash, this will need to be saved for
      //-- the next time the document is generated
      const {
        response: {
          data: { status, hash },
        },
      } = error;

      if (status === constants.HTTP_STATUS_METHOD_NOT_ALLOWED) {
        //-- existing template
        await this.configService.updateByCode(templateCode, hash);
      } else {
        //-- valid error
        this.logger.error(`exception: unable to upload template: ${template} - error: ${error}`);
        throw new Error(`exception: unable to upload template: ${template} - error: ${error}`);
      }
    }
  };

  _getExternalTemplateCode = (data: any, complaintType: string): string => {
    const prevAgency = data.updates
      .sort((a, b) => b.updateTime.getTime() - a.updateTime.getTime())
      .find((item) => item.updateType === "REFERRAL" && ["COS", "EPO", "PARKS"].includes(item?.referral.previousAgency))
      ?.referral?.previousAgency;

    const extTemplateMap = {
      ERS: {
        EPO: CONFIGURATION_CODES.EXTCEEBT,
        PARKS: CONFIGURATION_CODES.EXTPRKERST,
        default: CONFIGURATION_CODES.EXTERSTMPT,
      },
      GIR: {
        PARKS: CONFIGURATION_CODES.EXTPRKGIRT,
        default: CONFIGURATION_CODES.EXTGIRT,
      },
    };
    const extTemplateCode = extTemplateMap[complaintType]?.[prevAgency] ?? extTemplateMap[complaintType]?.default;
    return extTemplateCode;
  };

  //--
  //-- render complaint to pdf
  //--
  generate = async (documentName: string, data: any, type: COMPLAINT_TYPE): Promise<AxiosResponse> => {
    //-- Determine template to use
    let templateCode: string;
    const templateMap = {
      HWCR: {
        PARKS: CONFIGURATION_CODES.PRKHWCTMPT,
        default: CONFIGURATION_CODES.HWCTMPLATE,
      },
      ERS: {
        EPO: CONFIGURATION_CODES.CEEBTMPLATE,
        PARKS: CONFIGURATION_CODES.PRKERSTMPT,
        ECCC: this._getExternalTemplateCode(data, type),
        DFO: this._getExternalTemplateCode(data, type),
        NROS: this._getExternalTemplateCode(data, type),
        NRS: this._getExternalTemplateCode(data, type),
        OTH: this._getExternalTemplateCode(data, type),
        POL: this._getExternalTemplateCode(data, type),
        default: CONFIGURATION_CODES.ERSTMPLATE,
      },
      GIR: {
        PARKS: CONFIGURATION_CODES.PRKGIRTMPT,
        ECCC: this._getExternalTemplateCode(data, type),
        DFO: this._getExternalTemplateCode(data, type),
        NROS: this._getExternalTemplateCode(data, type),
        NRS: this._getExternalTemplateCode(data, type),
        OTH: this._getExternalTemplateCode(data, type),
        POL: this._getExternalTemplateCode(data, type),
        default: CONFIGURATION_CODES.GIRTMPLATE,
      },
    };

    templateCode = templateMap[type]?.[data.ownedBy] ?? templateMap[type]?.default;

    try {
      const apiToken = await this.authenticate();

      if (!(await this.isTemplateCached(apiToken, templateCode))) {
        await this.upload(apiToken, type, templateCode);
      }

      const uid = await this._getTemplateId(templateCode);
      const url = `${this.baseUri}/api/v2/template/${uid}/render`;

      const config: AxiosRequestConfig = {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      };

      const documentData = await this._applyData(data, documentName);

      const response = await axios.post(url, documentData, config);
      return response;
    } catch (error) {
      this.logger.error(`exception: unable to export document for complaint: ${data.id} - error: ${error}`);
      throw new Error(`exception: unable to export document for complaint: ${data.id} - error: ${error}`);
    }
  };
}
