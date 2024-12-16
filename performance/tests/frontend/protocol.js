import http from "k6/http";
import { check } from "k6";

export function protocolTest() {
  const res = http.get("http://localhost:3001/");
  check(res, {
    "status is 200": (res) => res.status === 200,
  });
}
