import { TasksList } from "./components";
import { Status, Task } from "./Types";
import { useEffect, useState } from "react";

type State = {
  filter: Status | "all";
  isLoading: boolean;
  tasks: Task[];
  visibleTasks: Task[];
};

export default function Command() {
  const [state, setState] = useState<State>({
    filter: Status.Active,
    isLoading: true,
    tasks: [],
    visibleTasks: [],
  });

  useEffect(() => {
    const tasks: Task[] = [
      {
        gid: "1",
        fileName: "File 1",
        fileSize: "100MB",
        progress: "50%",
        status: Status.Active,
        downloadSpeed: "10MB/s",
        remainingTime: "5 minutes",
      },
      {
        gid: "2",
        fileName: "File 2",
        fileSize: "200MB",
        progress: "75%",
        status: Status.Waiting,
      },
      {
        gid: "3",
        fileName: "File 3",
        fileSize: "150MB",
        progress: "25%",
        status: Status.Paused,
      },
      {
        gid: "4",
        fileName: "File 4",
        fileSize: "300MB",
        progress: "100%",
        status: Status.Complete,
      },
      {
        gid: "5",
        fileName: "File 5",
        fileSize: "250MB",
        progress: "90%",
        status: Status.Error,
      },
      {
        gid: "6",
        fileName: "File 6",
        fileSize: "180MB",
        progress: "10%",
        status: Status.Removed,
      },
    ];

    const visibleTasks = tasks.filter((item) => {
      return item.status === state.filter;
    });

    setState((previous) => ({
      ...previous,
      tasks,
      visibleTasks,
      isLoading: false,
    }));
  }, []);

  const filterTasks = (filter: Status | "all") => {
    const { tasks } = state;
    let visibleTasks = tasks;

    if (filter !== "all") {
      visibleTasks = visibleTasks.filter((item) => item.status === filter);
    }

    setState((previous) => ({
      ...previous,
      visibleTasks,
      filter,
    }));
  };
  return (
    <TasksList
      isLoading={state.isLoading}
      tasks={state.visibleTasks}
      filter={state.filter}
      onFilterChange={filterTasks}
    />
  );
}
