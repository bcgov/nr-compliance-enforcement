import axios, { AxiosRequestConfig } from "axios";

const generateConfig = (apiToken: string, headers?: any, options?: { suppressErrorLog?: boolean }): AxiosRequestConfig => {
  const config: AxiosRequestConfig = {
    timeout: 30000,
  };

  if (!!headers) {
    config.headers = headers;
    config.headers.Authorization = `Bearer ${apiToken}`;
  } else {
    config.headers = {
      Authorization: `Bearer ${apiToken}`,
    };
  }

  if (options?.suppressErrorLog) {
    (config as any).suppressErrorLog = true;
  }

  return config;
};

export const get = async (apiToken: string, url: string, headers?: any) => {
  const config = generateConfig(apiToken, headers);

  return axios.get(url, config);
};

export const post = async (apiToken: string, url: string, data: any, headers?: any) => {
  const config = generateConfig(apiToken, headers);
  return axios.post(url, data, config);
};

export const put = async (
  apiToken: string,
  url: string,
  data: any,
  headers?: any,
  options?: { suppressErrorLog?: boolean },
) => {
  const config = generateConfig(apiToken, headers, options);
  return axios.put(url, data, config);
};
