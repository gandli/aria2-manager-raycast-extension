import { showToast, Toast } from "@raycast/api";

export function showAria2NotConnectedToast() {
  showToast({
    style: Toast.Style.Failure,
    title: "You must successfully connect to the Aria2 server to use this extension.",
  });
}
