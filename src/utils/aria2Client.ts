import { Preferences, defaultPreferences } from "../types";
import WebSocket from "ws";

const preferences: Preferences = { ...defaultPreferences };
const { hostname, port, rpcSecret } = preferences;
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

export async function tellActive(): Promise<any[]> {
  const activeDownloads = await sendJsonRpcRequest("tellActive");
  return activeDownloads.map((item: any) => {
    const fileName = item.files[0]?.path.split("/").pop() || "";
    const fileSize = formatSize(item.totalLength);
    const progress = (item.completedLength / item.totalLength) * 100;
    const remainingTime = formatTime((item.totalLength - item.completedLength) / item.downloadSpeed);
    const downloadSpeed = formatSize(item.downloadSpeed) + "/s";

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
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

function formatTime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedTimeParts = [];
  if (days > 0) formattedTimeParts.push(`${days}d`);
  if (hours > 0) formattedTimeParts.push(`${hours}h`);
  if (minutes > 0) formattedTimeParts.push(`${minutes}m`);
  if (remainingSeconds > 0) formattedTimeParts.push(`${remainingSeconds}s`);

  return formattedTimeParts.join(" ");
}
