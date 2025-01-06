import http from "k6/http";
import { check } from "k6";

export function protocolTest(host, requestConfig) {
  const res = http.get(host + "/static/js/bundle.js", {
    headers: {
      ...requestConfig.headers,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      Host: "localhost:3001",
      Pragma: "no-cache",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": 1,
      "Upgrade-Insecure-Requests": 1,
    },
  });
  check(res, {
    "Fetch of bundle.js return status is 200": (res) => res.status === 200,
  });
}
