import { Action, Icon } from "@raycast/api";

function DeleteTaskAction(props: { onDelete: () => void }) {
  return (
    <Action
      icon={Icon.Trash}
      title="Delete Download Task"
      shortcut={{ modifiers: ["ctrl"], key: "d" }}
      onAction={props.onDelete}
    />
  );
}

export default DeleteTaskAction;
