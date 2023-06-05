import WebSocket from "ws";
import { Preferences, DownloadItem, defaultPreferences } from "../types";

class Aria2Service {
  private readonly hostname: string;
  private readonly port: string;
  private readonly rpcSecret: string;
  private ws: WebSocket | null;

  constructor(preferences: Preferences = defaultPreferences) {
    this.hostname = preferences.hostname;
    this.port = preferences.port;
    this.rpcSecret = preferences.rpcSecret;
    this.ws = null;
  }

  private getWsUrl(): string {
    return `ws://${this.hostname}:${this.port}/jsonrpc`;
  }

  private sendRequest(method: string, params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substr(2, 9);
      const request = {
        jsonrpc: "2.0",
        id: requestId,
        method: `aria2.${method}`,
        params: [`token:${this.rpcSecret}`, ...params],
      };

      if (!this.ws) {
        reject(new Error("WebSocket 连接未建立。"));
        return;
      }

      this.ws.send(JSON.stringify(request));

      this.ws.on("message", (data: string) => {
        const response = JSON.parse(data);
        if (response.id === requestId) {
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.result);
          }
        }
      });
    });
  }

  /**
   * 建立与 Aria2 服务器的 WebSocket 连接
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws) {
        resolve();
        return;
      }

      const wsUrl = this.getWsUrl();
      this.ws = new WebSocket(wsUrl);

      this.ws.on("open", () => {
        resolve();
      });

      this.ws.on("error", (error) => {
        reject(error);
      });
    });
  }

  /**
   * 获取 Aria2 全局状态信息
   */
  async getGlobalStat(): Promise<any> {
    await this.connect();
    return this.sendRequest("getGlobalStat", []);
  }

  /**
   * 获取当前活动的下载列表
   */
  async tellActive(): Promise<any> {
    await this.connect();
    return this.sendRequest("tellActive", []);
  }

  /**
   * 获取等待的下载列表
   * @param offset 偏移量
   * @param num 获取的数量
   */
  async tellWaiting(offset: number, num: number): Promise<any> {
    await this.connect();
    return this.sendRequest("tellWaiting", [offset, num]);
  }

  /**
   * 获取停止的下载列表
   * @param offset 偏移量
   * @param num 获取的数量
   */
  async tellStopped(offset: number, num: number): Promise<any> {
    await this.connect();
    return this.sendRequest("tellStopped", [offset, num]);
  }

  /**
   * 获取指定下载任务的状态信息
   * @param gid 下载任务的 GID
   */
  async tellStatus(gid: string): Promise<any> {
    await this.connect();
    return this.sendRequest("tellStatus", [gid]);
  }

  /**
   * 添加一个使用 URI 方式下载的任务
   * @param uris 下载任务的 URI 列表
   * @param options 下载任务的选项
   */
  async addUri(uris: string[], options: any = {}): Promise<any> {
    await this.connect();
    return this.sendRequest("addUri", [[`token:${this.rpcSecret}`, ...uris], options]);
  }

  /**
   * 添加一个使用 Torrent 文件下载的任务
   * @param torrent Torrent 文件的 Base64 编码字符串
   * @param options 下载任务的选项
   */
  async addTorrent(torrent: string, options: any = {}): Promise<any> {
    await this.connect();
    return this.sendRequest("addTorrent", [`token:${this.rpcSecret}`, torrent, [], options]);
  }

  /**
   * 删除一个下载任务
   * @param gid 要删除的下载任务的 GID
   */
  async remove(gid: string): Promise<any> {
    await this.connect();
    return this.sendRequest("remove", [gid]);
  }

  /**
   * 强制删除一个下载任务
   * @param gid 要删除的下载任务的 GID
   */
  async forceRemove(gid: string): Promise<any> {
    await this.connect();
    return this.sendRequest("forceRemove", [gid]);
  }

  /**
   * 启动一个暂停的下载任务
   * @param gid 要启动的下载任务的 GID
   */
  async start(gid: string): Promise<any> {
    await this.connect();
    return this.sendRequest("unpause", [gid]);
  }

  /**
   * 暂停一个活动的下载任务
   * @param gid 要暂停的下载任务的 GID
   */
  async pause(gid: string): Promise<any> {
    await this.connect();
    return this.sendRequest("pause", [gid]);
  }

  /**
   * 修改下载任务的选项
   * @param gid 要修改的下载任务的 GID
   * @param options 新的选项
   */
  async changeOption(gid: string, options: any): Promise<any> {
    await this.connect();
    return this.sendRequest("changeOption", [gid, options]);
  }

  /**
   * 获取下载任务的对等节点信息
   * @param gid 下载任务的 GID
   */
  async getPeers(gid: string): Promise<any> {
    await this.connect();
    return this.sendRequest("getPeers", [gid]);
  }

  /**
   * 获取下载任务的文件列表
   * @param gid 下载任务的 GID
   */
  async getFiles(gid: string): Promise<any> {
    await this.connect();
    return this.sendRequest("getFiles", [gid]);
  }

  /**
   * 获取全部任务（包括活动、等待和停止状态的任务）
   */
  async getAllTasks(): Promise<DownloadItem[]> {
    await this.connect();

    const active = await this.tellActive();
    const waiting = await this.tellWaiting(0, -1);
    const stopped = await this.tellStopped(0, -1);
    const allTasks: DownloadItem[] = [];

    // 处理活动任务
    active.forEach((task: any) => {
      const downloadItem: DownloadItem = this.createDownloadItem(task, DownloadStatus.Active);
      allTasks.push(downloadItem);
    });

    // 处理等待任务
    waiting.forEach((task: any) => {
      const downloadItem: DownloadItem = this.createDownloadItem(task, DownloadStatus.Waiting);
      allTasks.push(downloadItem);
    });

    // 处理停止任务
    stopped.forEach((task: any) => {
      const downloadItem: DownloadItem = this.createDownloadItem(task, DownloadStatus.Stopped);
      allTasks.push(downloadItem);
    });

    return allTasks;
  }

  /**
   * 创建 DownloadItem 对象
   * @param task 任务信息
   * @param status 任务状态
   * @returns DownloadItem 对象
   */
  private createDownloadItem(task: any, status: DownloadStatus): DownloadItem {
    const downloadItem: DownloadItem = {
      gid: task.gid,
      status,
      totalLength: task.totalLength,
      completedLength: task.completedLength,
      uploadLength: task.uploadLength,
      downloadSpeed: task.downloadSpeed,
      uploadSpeed: task.uploadSpeed,
      bitfield: task.bitfield,
      infoHash: task.infoHash,
      numSeeders: task.numSeeders,
      seeder: task.seeder,
      connections: task.connections,
      errorCode: task.errorCode,
      errorMessage: task.errorMessage,
      followedBy: task.followedBy,
      following: task.following,
      belongsTo: task.belongsTo,
      dir: task.dir,
      files: task.files,
      bittorrent: task.bittorrent,
    };

    return downloadItem;
  }
}

export default Aria2Service;
