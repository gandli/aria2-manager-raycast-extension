// src/utils/aria2Client.ts

import WebSocket from "ws";

const hostname = "192.168.2.1";
const port = 6800;
const rpcSecret = "f807d43b79cac52bd08c86ffc6ef33b6";
const ws = new WebSocket(`ws://${hostname}:${port}/jsonrpc`);

function sendJsonRpcRequest(method: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    ws.on("open", () => {
      const payload = JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: `aria2.${method}`,
        params: [`token:${rpcSecret}`, ...params],
      });

      ws.send(payload);
    });

    ws.on("message", (data) => {
      try {
        const response = JSON.parse(data.toString());
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      } catch (error) {
        reject(error);
      }
    });

    ws.on("error", (error) => {
      reject(error);
    });
  });
}

export async function tellActive(): Promise<any> {
  const activeDownloads = await sendJsonRpcRequest("tellActive");
  return activeDownloads.map((item: any) => {
    const fileName = item.files[0]?.path.split("/").pop() || "";
    const fileSize = formatSize(Number(item.totalLength));
    const progress = (Number(item.completedLength) / Number(item.totalLength)) * 100;
    const remainingTime = formatTime(
      (Number(item.totalLength) - Number(item.completedLength)) / Number(item.downloadSpeed)
    );
    const downloadSpeed = formatSize(Number(item.downloadSpeed)) + "/s";

    return {
      gid: item.gid,
      fileName,
      fileSize,
      progress,
      remainingTime,
      downloadSpeed,
      magneticLink: `magnet:?xt=urn:btih:${item.infoHash}`,
    };
  });
}

export function remove(gid: string): Promise<any> {
  return sendJsonRpcRequest("forceRemove", [gid]);
}

function formatSize(bytes: number): string {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
function formatTime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  let formattedTime = "";

  if (days > 0) {
    formattedTime += `${days}d `;
  }
  if (hours > 0) {
    formattedTime += `${hours}h `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes}m `;
  }

  if (remainingSeconds > 0) {
    formattedTime += `${remainingSeconds}s`;
  }

  return formattedTime;
}
