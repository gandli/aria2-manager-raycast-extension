import { ActionPanel, List } from "@raycast/api";
import { DownloadStatus, DownloadItem } from "../types";
import CreateDownloadAction from "./CreateDownloadAction";

function EmptyView(props: { downloads: DownloadItem[]; filter: DownloadStatus | "all"; searchText: string }) {
  const { downloads, filter, searchText } = props;

  if (downloads.length > 0) {
    return (
      <List.EmptyView
        icon="😕"
        title="未找到匹配的下载任务"
        description={`找不到与 ${searchText} 匹配的下载任务。\n立即创建它！`}
        actions={
          <ActionPanel>
            <CreateDownloadAction />
          </ActionPanel>
        }
      />
    );
  }

  switch (filter) {
    case DownloadStatus.Stopped:
    case DownloadStatus.Complete:
      return (
        <List.EmptyView
          icon="⏹️"
          title="没有停止/已完成的下载任务"
          description="当前没有任何停止或已完成的下载任务。"
          actions={
            <ActionPanel>
              <CreateDownloadAction />
            </ActionPanel>
          }
        />
      );
    case DownloadStatus.Active:
      return (
        <List.EmptyView
          icon="⏳"
          title="没有正在进行的下载任务"
          description="当前没有任何正在进行的下载任务。"
          actions={
            <ActionPanel>
              <CreateDownloadAction />
            </ActionPanel>
          }
        />
      );
    case DownloadStatus.Waiting:
      return (
        <List.EmptyView
          icon="⌛️"
          title="没有等待的下载任务"
          description="当前没有任何等待的下载任务。"
          actions={
            <ActionPanel>
              <CreateDownloadAction />
            </ActionPanel>
          }
        />
      );
    default:
      return (
        <List.EmptyView
          icon="📂"
          title="未找到任何下载任务"
          description="你还没有添加下载任务。"
          actions={
            <ActionPanel>
              <CreateDownloadAction />
            </ActionPanel>
          }
        />
      );
  }
}

export default EmptyView;
