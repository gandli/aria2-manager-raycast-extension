import { Status, TaskResponse, Task } from "../types";

export function getTaskIcon(status: Status): string {
  switch (status) {
    case "active":
      return "▶️";
    case "waiting":
      return "⌛️";
    case "paused":
      return "⏸️";
    case "error":
      return "⚠️";
    case "complete":
      return "✅";
    case "removed":
      return "🗑️";
    default:
      return "▶️";
  }
}

export function formatSize(size: string): string {
  let bytes = parseFloat(size);
  const units = ["B", "KB", "MB", "GB", "TB"];

  let index = 0;
  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024;
    index++;
  }

  return `${bytes.toFixed(2)} ${units[index]}`;
}

export function formatProgress(completedLength: string, totalLength: string): string {
  const percentage = (parseFloat(completedLength) / parseFloat(totalLength)) * 100;
  return `${percentage.toFixed(2)}%`;
}

export function formatRemainingTime(seconds: number): string {
  const remainingSeconds = Math.floor(seconds);
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const secondsLeft = remainingSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secondsLeft
    .toString()
    .padStart(2, "0")}`;
}

export function formatSpeed(speed: string): string {
  let bytesPerSecond = parseFloat(speed);
  const units = ["B/s", "KB/s", "MB/s", "GB/s", "TB/s"];

  let index = 0;
  while (bytesPerSecond >= 1024 && index < units.length - 1) {
    bytesPerSecond /= 1024;
    index++;
  }

  return `${bytesPerSecond.toFixed(2)} ${units[index]}`;
}

export function calculateRemainingTime(completedLength: string, totalLength: string, downloadSpeed: string): string {
  const remainingBytes = parseInt(totalLength) - parseInt(completedLength);
  const remainingTimeSeconds = remainingBytes / parseInt(downloadSpeed);
  return formatRemainingTime(remainingTimeSeconds);
}

export function formatTasks(tasks: TaskResponse[]): Task[] {
  return tasks.map((task) => {
    const file = task.files[0];
    const progress = formatProgress(task.completedLength, task.totalLength);
    let remainingTime: string | undefined;
    let downloadSpeed: string | undefined;
    if (task.status === "active" && progress !== "100.00%") {
      remainingTime = calculateRemainingTime(task.completedLength, task.totalLength, task.downloadSpeed);
      downloadSpeed = formatSpeed(task.downloadSpeed);
    }

    return {
      gid: task.gid,
      fileName: task.bittorrent.info?.name || file.path,
      fileSize: formatSize(task.totalLength),
      progress,
      remainingTime,
      downloadSpeed,
      status: task.status as Status,
    };
  });
}