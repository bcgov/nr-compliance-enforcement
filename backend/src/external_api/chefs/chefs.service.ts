import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { UUID } from "node:crypto";

@Injectable()
export class ChefsService {
  getFile = (fileId: UUID): Promise<AxiosResponse<Buffer>> => {
    const url = `${process.env.CHEFS_API_URL}/files/${fileId}`;
    // CHEFS API keys use basic auth: the username is the form id and the password is the form's API key.
    const config: AxiosRequestConfig = {
      responseType: "arraybuffer",
      auth: {
        username: process.env.CHEFS_FORM_ID,
        password: process.env.CHEFS_API_KEY,
      },
      proxy: false,
    };
    return axios.get(url, config);
  };
}
