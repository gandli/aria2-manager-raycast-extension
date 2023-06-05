import { getPreferenceValues } from "@raycast/api";

enum DownloadStatus {
  Active = "active",
  Waiting = "waiting",
  Paused = "paused",
  Error = "error",
  Complete = "complete",
  Removed = "removed",
}

interface DownloadItem {
  gid: string;
  status: DownloadStatus;
  totalLength: string;
  completedLength: string;
  uploadLength: string;
  downloadSpeed: string;
  uploadSpeed: string;
  bitfield?: string;
  infoHash?: string;
  numSeeders?: string;
  seeder?: boolean;
  connections?: string;
  errorCode?: string;
  errorMessage?: string;
  followedBy?: string[];
  following?: string;
  belongsTo?: string;
  dir?: string;
  files?: {
    completedLength: string;
    index: string;
    length: string;
    path: string;
    selected: string;
    uris: any[];
  }[];
  bittorrent?: {
    announceList: string[][];
    info: {
      name: string;
    };
    mode: string;
  };
}

interface Preferences {
  hostname: string;
  port: string;
  rpcSecret: string;
}

const defaultPreferences: Preferences = {
  hostname: "192.168.2.1",
  port: "6800",
  rpcSecret: "f807d43b79cac52bd08c86ffc6ef33b6",
};

export { defaultPreferences, DownloadStatus };
export type { DownloadItem, Preferences };
