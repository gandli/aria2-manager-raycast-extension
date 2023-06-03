// types.ts
import { getPreferenceValues } from "@raycast/api";

export type DownloadItem = {
  gid: string;
  fileName: string;
  fileSize: string;
  progress: number;
  remainingTime: string;
  downloadSpeed: string;
  magneticLink: string;
};

export enum Filter {
  All = "All",
  Downloading = "Downloading",
  Waiting = "Waiting",
  Completed = "Completed",
  Stopped = "Stopped",
}

export interface Preferences {
  hostname: string;
  port: string;
  rpcSecret: string;
}

export const defaultPreferences: Preferences = {
  hostname: "192.168.2.1",
  port: "6800",
  rpcSecret: "f807d43b79cac52bd08c86ffc6ef33b6",
};
