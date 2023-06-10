import { getApplications, showToast, Toast, open } from "@raycast/api";

export async function isAria2Installed() {
  const applications = await getApplications();
  return applications.some(({ name }) => name === "aria2");
}

export async function checkAria2Installation() {
  if (!(await isAria2Installed())) {
    const options: Toast.Options = {
      style: Toast.Style.Failure,
      title: "Aria2 is not installed.",
      message: "Install it from: https://aria2.github.io",
      primaryAction: {
        title: "Go to https://aria2.github.io",
        onAction: (toast) => {
          open("https://aria2.github.io");
          toast.hide();
        },
      },
    };

    await showToast(options);
  }
}
