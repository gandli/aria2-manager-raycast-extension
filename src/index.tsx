import { useCallback, useEffect, useState } from "react";
import { DownloadStatus, DownloadItem, defaultPreferences } from "./types";
import { EmptyView } from "./components";
import { ActionPanel, Icon, List } from "@raycast/api";
import Aria2Service from "./utils/Aria2Service";
import { getDownloadIcon, formatSize, formatProgress, formatRemainingTime, formatSpeed } from "./utils/utils";

type State = {
  filter: DownloadStatus | "all";
  isLoading: boolean;
  searchText: string;
  downloads: DownloadItem[];
};

export default function Command() {
  const [state, setState] = useState<State>({
    filter: "all",
    isLoading: true,
    searchText: "",
    downloads: [],
  });

  const aria2Service = new Aria2Service(defaultPreferences);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Establish WebSocket connection with Aria2 server
        await aria2Service.connect();

        // Get status of active, waiting, and stopped downloads
        const activeDownloads = await aria2Service.tellActive();
        const waitingDownloads = await aria2Service.tellWaiting(0, 99);
        const stoppedDownloads = await aria2Service.tellStopped(0, 99);
        const downloads = [...activeDownloads, ...waitingDownloads, ...stoppedDownloads];

        // Update component state with downloaded tasks data
        setState((previous) => ({ ...previous, isLoading: false, downloads }));
      } catch (error) {
        console.error("Failed to fetch downloads:", error);
      }
    };
    fetchData();
  }, []);

  const filterDownloads = useCallback(() => {
    const filteredDownloads = state.downloads.filter((download) => {
      if (state.filter === "active" && download.status !== "active") {
        return false;
      }
      if (state.filter === "waiting" && download.status !== "waiting") {
        return false;
      }
      if (state.filter === "complete" && download.status !== "complete") {
        return false;
      }
      return true;
    });
    return filteredDownloads.filter((download) => {
      const lowerCaseSearchText = state.searchText.toLowerCase();
      const downloadTitle = download.bittorrent?.info?.name ?? download.files?.[0]?.path ?? download.gid;
      return downloadTitle.toLowerCase().includes(lowerCaseSearchText);
    });
  }, [state.downloads, state.filter, state.searchText]);

  return (
    <List
      isLoading={state.isLoading}
      navigationTitle="Aria2 Manager"
      searchBarPlaceholder="Search Task Name"
      onSearchTextChange={(newValue) => {
        setState((previous) => ({ ...previous, searchText: newValue }));
      }}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Download List"
          value={state.filter}
          onChange={(newValue) => {
            setState((previous) => ({ ...previous, filter: newValue as DownloadStatus }));
          }}
        >
          <List.Dropdown.Item title="All" value="all" />
          <List.Dropdown.Item title="Active" value="active" />
          <List.Dropdown.Item title="Waiting" value="waiting" />
          <List.Dropdown.Item title="Completed/Stopped" value="complete" />
        </List.Dropdown>
      }
    >
      <EmptyView filter={state.filter} downloads={filterDownloads()} searchText={state.searchText} />
      {filterDownloads().map((downloadItem) => (
        <List.Item
          icon={getDownloadIcon(downloadItem.status)}
          key={downloadItem.gid}
          id={downloadItem.gid}
          title={downloadItem.bittorrent?.info?.name ?? downloadItem.files?.[0]?.path ?? downloadItem.gid}
          subtitle={{ tooltip: "File Size", value: `💾${formatSize(downloadItem.totalLength)}` }}
          accessories={[
            {
              tooltip: "Progress",
              text: ` ${formatProgress(downloadItem.completedLength, downloadItem.totalLength)}`,
              icon: "⏳",
            },
            {
              tooltip: "Remaining Time",
              text: ` ${formatRemainingTime(
                (parseFloat(downloadItem.totalLength) - parseFloat(downloadItem.completedLength)) /
                  parseFloat(downloadItem.downloadSpeed)
              )}`,
              icon: "🕐",
            },
            { tooltip: "Download Speed", text: ` ${formatSpeed(downloadItem.downloadSpeed)}`, icon: "🚀" },
          ]}
        />
      ))}
    </List>
  );
}
