import { Action, Icon } from "@raycast/api";
import CreateDownloadForm from "./CreateDownloadForm";

function CreateDownloadAction() {
  return (
    <Action.Push
      icon={Icon.Pencil}
      title="新增下载"
      shortcut={{ modifiers: ["cmd"], key: "n" }}
      target={<CreateDownloadForm />}
    />
  );
}

export default CreateDownloadAction;
