'use client'

import Avatarwithlogout from "@/components/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import AddTask from "./AddTask"
import { KanbanBoard } from "./KanbanBoard"
import List from "./list"
import { ScrollArea } from "./ui/scroll-area"

export type Task = {
  id: string
  title: string
  description?: string
  status: "To Do" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High"
  dueDate?: Date | null
}

export type SortOption = "asc" | "desc" | "default";

type Data = Task & { _id: string }

export function TaskList() {
  const [list, setList] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([
    // { id: "1", title: "Design new landing page", description: "Create a modern and engaging landing page for our product", status: "In Progress", priority: "High", dueDate: new Date(2023, 5, 30) },
    // { id: "2", title: "Fix login bug", description: "Users are experiencing issues with the login process", status: "To Do", priority: "Medium", dueDate: new Date(2023, 5, 25) },
    // { id: '3', title: "Update privacy policy", status: "Completed", priority: "Low", dueDate: new Date(2023, 6, 10) },
  ])

  const [newTask, setNewTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: null
  })

  const [filterStatus, setFilterStatus] = useState<Task['status'] | 'All'>('All')
  const [filterPriority, setFilterPriority] = useState<Task['priority'] | 'All'>('All')
  const [sortBy, setSortBy] = useState<SortOption>('default')

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/task', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data: Data[] = await response.json();

        setTasks(data.map(item => ({ ...item, id: item._id })));
      } catch (error) {
        console.error(error)
      }
    };
    getTodos();
  }, []);

  async function update(id: string, newData: Task, remove: boolean = false) {
    if (remove) {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/task/' + id, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data._id) {
        setTasks(tasks.filter(task => task.id === data._id ? false : true))
      } else {
        console.log(data)
      }

      return
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/task/' + id, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      const data = await response.json();

      setTasks(tasks.map(task => task.id === id ? { ...task, ...data } : task))

      if (!response.ok) {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case "Low": return <Clock className="w-4 h-4 text-blue-500" />
      case "Medium": return <Clock className="w-4 h-4 text-yellow-500" />
      case "High": return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  const filteredAndSortedTasks = tasks
    .filter(task => filterStatus === 'All' || task.status === filterStatus)
    .filter(task => filterPriority === 'All' || task.priority === filterPriority)
    .filter(task => {
      if (sortBy === 'default') return true;
      return task.dueDate !== null && task.dueDate !== undefined;
    })
    .sort((a, b) => {
      if (sortBy === 'default') {
        return 0;
      } else {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return sortBy === 'asc' ? aTime - bTime : bTime - aTime;
      }
    });

  return (
    <div className="mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <Avatarwithlogout />
      </div>

      <div className="flex justify-between items-end flex-wrap space-y-2">
        <AddTask newTask={newTask} setNewTask={setNewTask} setTasks={setTasks} />
        <Button className="h-9 ml-2 md:hidden" variant='outline' onClick={() => setList(!list)}>
          {list ? 'Switch to Kanban' : 'Switch to List'}
        </Button>

        {list && (
          <div className="flex space-x-2">
            <Select value={filterStatus} onValueChange={(value: Task['status'] | 'All') => setFilterStatus(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={(value: Task['priority'] | 'All') => setFilterPriority(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort By Due Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">All Due Date</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button className="h-9 ml-2 hidden md:block" variant='outline' onClick={() => setList(!list)}>
          {list ? 'Switch to Kanban' : 'Switch to List'}
        </Button>
      </div>

      {list ? (
        <ScrollArea className="h-[80vh] md:h-[70vh] rounded-md">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="flex justify-center items-center text-5xl h-[50vh] p-4 border rounded-lg">
              <h1>No tasks</h1>
            </div>
          ) : (
            <List update={update} getPriorityIcon={getPriorityIcon} filteredAndSortedTasks={filteredAndSortedTasks} />
          )}
        </ScrollArea>
      ) : (
        <div className="space-y-4">
          <KanbanBoard tasks={tasks} update={update} setTasks={setTasks} />
        </div>
      )}
    </div>
  )
}