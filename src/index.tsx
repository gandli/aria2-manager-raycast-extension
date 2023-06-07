import { useState, useEffect, useMemo } from "react";
import TasksList from "./components/TasksList";
import useAria2 from "./hooks/useAria2";
import { Task, Filter } from "./types";

export default function Command() {
  const { fetchTasks, isConnected } = useAria2();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected) {
        const tasks = await fetchTasks();
        setTasks(tasks);
      }
    };

    fetchData();
  }, [fetchTasks, isConnected]);

  const filteredTasks = useMemo(() => filterTasks(filter), [filter, tasks]);

  const handleFilterChange = (filter: Filter) => {
    setFilter(filter);
  };

  function filterTasks(filter: Filter): Task[] {
    return tasks.filter((task) => {
      if (filter === Filter.Active) {
        return task.status === "active";
      } else if (filter === Filter.Waiting) {
        return task.status === "waiting";
      } else if (filter === Filter.CompletePaused) {
        return ["complete", "paused"].includes(task.status);
      } else {
        return true;
      }
    });
  }

  return <TasksList tasks={filteredTasks} onFilterChange={handleFilterChange} />;
}
