import Aria2 from "aria2";
import ws from "ws";
import nodefetch from "node-fetch";
import { getPreferenceValues } from "@raycast/api";
import { Preferences } from "../Types";

export default class Aria2Service {
  private aria2: Aria2;

  constructor() {
    const preferences = getPreferenceValues<Preferences>();
    this.aria2 = new Aria2({
      host: preferences.host,
      port: Number(preferences.port),
      secure: preferences.secure,
      secret: preferences.rpcSecret,
      path: preferences.path,
      WebSocket: ws,
      fetch: nodefetch,
    });
  }

  public async open(): Promise<void> {
    await this.aria2.open();
    console.log("aria2 connection opened");
  }

  public async close(): Promise<void> {
    await this.aria2.close();
    console.log("aria2 connection closed");
  }

  public async addUri(uri: string, options?: any): Promise<string> {
    const result = await this.aria2.call("addUri", [uri], options);
    return result[0];
  }

  // 添加其他需要的方法

  public onDownloadStart(listener: (event: any) => void): void {
    this.aria2.on("onDownloadStart", listener);
  }

  public onDownloadPause(listener: (event: any) => void): void {
    this.aria2.on("onDownloadPause", listener);
  }

  public onDownloadStop(listener: (event: any) => void): void {
    this.aria2.on("onDownloadStop", listener);
  }

  public onDownloadComplete(listener: (event: any) => void): void {
    this.aria2.on("onDownloadComplete", listener);
  }

  public onDownloadError(listener: (event: any) => void): void {
    this.aria2.on("onDownloadError", listener);
  }

  public onBtDownloadComplete(listener: (event: any) => void): void {
    this.aria2.on("onBtDownloadComplete", listener);
  }
}
