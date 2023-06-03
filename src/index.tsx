// src/index.tsx
import { ActionPanel, Action, List, Icon, Color } from "@raycast/api";
import { useEffect, useState } from "react";
import { tellActive } from "./utils/aria2Client";
import { DownloadItem } from "./types";

export default function Command() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const activeDownloads = await tellActive();
        setDownloads(activeDownloads);
      } catch (error) {
        console.error("Failed to fetch downloads:", error);
      }
    };

    fetchDownloads();
  }, []);

  return (
    <List searchBarPlaceholder="Filter downloads by gid or status">
      {downloads.map((download) => (
        <DownloadListItem key={download.gid} download={download} />
      ))}
    </List>
  );
}

function DownloadListItem({ download }: { download: DownloadItem }) {
  const progress = download.progress;
  const remainingTime = download.remainingTime;

  return (
    <List.Item
      id={download.gid}
      keywords={[download.fileName]}
      icon={{
        source: Icon.Download,
        tintColor: Color.Green,
      }}
      title={download.fileName}
      subtitle={`大小: ${download.fileSize} `}
      accessories={[
        {
          text: {
            value: `进度:${progress.toFixed(2)}% 剩余时间: ${remainingTime} 下载速度: ${download.downloadSpeed}`,
            color: Color.Orange,
          },
        },
      ]}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy magneticLink" content={download.magneticLink} />
        </ActionPanel>
      }
    />
  );
}
