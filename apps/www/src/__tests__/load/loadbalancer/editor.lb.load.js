import { check, sleep } from "k6";
import http from "k6/http";

const BASE = "http://lb:80";

// get one type of attribute from all html elements where the selector machtes
function attrsOf(doc, selector, attr) {
  return doc
    .find(selector)
    .toArray()
    .map(e => e.attr(attr));
}

export const options = {
  discardResponseBodies: true, // so we need less memory/cpu
  scenarios: {
    ramp_up: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "5s", target: 500 },
        { duration: "25s", target: 500 },
        { duration: "5s", target: 1000 },
        { duration: "25s", target: 1000 },
        { duration: "5s", target: 2000 },
        { duration: "25s", target: 2000 },
        { duration: "5s", target: 4000 },
        { duration: "25s", target: 4000 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],   // less tan 1% should fail
    http_req_duration: ["p(95)<800"], //95% under 800ms
  },
};

export default function () {
  // load the editor page
  const page = http.get(`${BASE}/editor`, { responseType: "text" });
  check(page, {
    "editor page loaded": r => r.status === 200,
    "editor page contains content": r => r.body.includes("<div"),
  });

  // get all script and stylesheet urls
  const assetUrls = [
    ...attrsOf(page.html(), "script[src]", "src"),
    ...attrsOf(page.html(), 'link[rel="stylesheet"]', "href"),
  ];

  // remove external URLs
  const assets = [...new Set(assetUrls.filter(u => u && u.startsWith("/")))];

  // load the assets if there are some
  if (assets.length > 0) {
    const responses = http.batch(assets.map(u => ["GET", `${BASE}${u}`]));
    check(responses, {
      "all assets loaded": rs => rs.every(r => r.status === 200),
    });
  }

  sleep(1); // pause the user for 1 second
}