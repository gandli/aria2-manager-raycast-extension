enum Status {
  Active = "active",
  Waiting = "waiting",
  Paused = "paused",
  Error = "error",
  Complete = "complete",
  Removed = "removed",
}

interface File {
  completedLength: string;
  index: string;
  length: string;
  path: string;
  selected: string;
  uris: any[];
}

interface Download {
  gid: string;
  status: Status;
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
  files?: File[];
  bittorrent?: {
    announceList: string[][];
    info: {
      name: string;
    };
    mode: string;
  };
}

interface Task {
  gid: string;
  fileName: string;
  fileSize: string;
  progress: string;
  remainingTime?: string;
  downloadSpeed?: string;
  status: Status;
}

interface Preferences {
  host: string;
  port: string;
  rpcSecret: string;
  path: string;
  secure: boolean;
  secret: string;
}

export { Status };
export type { Download, Task, Preferences };
