// types.ts

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
