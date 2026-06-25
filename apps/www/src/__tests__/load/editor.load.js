import { check, sleep } from "k6";
import http from "k6/http";

const BASE = "http://localhost:3000";


// Stefan Czepl
export const options = {
  scenarios: {
    spike_100: {
      executor: "ramping-vus",
      startTime: "0s",
      stages: [
        { duration: "30s", target: 10 },
        { duration: "1m", target: 20 },
        { duration: "30s", target: 100 },
        { duration: "30s", target: 0 },
      ],
    },
    spike_500: {
      executor: "ramping-vus",
      startTime: "2m30s",
      stages: [
        { duration: "30s", target: 50 },
        { duration: "1m", target: 100 },
        { duration: "30s", target: 500 },
        { duration: "30s", target: 0 },
      ],
    },
    spike_1000: {
      executor: "ramping-vus",
      startTime: "5m0s",
      stages: [
        { duration: "30s", target: 100 },
        { duration: "1m", target: 200 },
        { duration: "30s", target: 1000 },
        { duration: "30s", target: 0 },
      ],
    },
    spike_2000: {
      executor: "ramping-vus",
      startTime: "7m30s",
      stages: [
        { duration: "30s", target: 200 },
        { duration: "1m", target: 400 },
        { duration: "30s", target: 2000 },
        { duration: "30s", target: 0 },
      ],
    },
  },

  thresholds: {
    "http_req_failed{scenario:spike_100}": ["rate<0.01"],
    "http_req_failed{scenario:spike_500}": ["rate<0.01"],
    "http_req_failed{scenario:spike_1000}": ["rate<0.01"],
    "http_req_failed{scenario:spike_2000}": ["rate<0.01"],

    "http_req_duration{scenario:spike_100}": ["p(95)<800"],
    "http_req_duration{scenario:spike_500}": ["p(95)<800"],
    "http_req_duration{scenario:spike_1000}": ["p(95)<800"],
    "http_req_duration{scenario:spike_2000}": ["p(95)<800"],
  },
};

export default function () {
  const landing = http.get(`${BASE}/`);

  const editor = http.get(`${BASE}/editor`);
  check(editor, {
    "editor status is 200": r => r.status === 200,
    "editor served app shell": r => r.body.includes("<div"),
  });

  sleep(1);
}
