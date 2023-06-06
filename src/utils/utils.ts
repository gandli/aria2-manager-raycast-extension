import { Status } from "../Types";

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
