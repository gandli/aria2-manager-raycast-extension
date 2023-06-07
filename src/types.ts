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
  path: string; //任务名称
  selected: string;
  uris: any[];
}

interface TaskResponse {
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
  files: File[];
  bittorrent: {
    announceList: string[][];
    info: {
      name: string; // 任务名称
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
  port: number;
  secret: string;
  path: string;
  secure: boolean;
}

export { Status };
export type { TaskResponse, Task, Preferences };
