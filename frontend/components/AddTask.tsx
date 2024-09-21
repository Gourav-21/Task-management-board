import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { Task } from "./task-list"
import { useState } from "react"

export default function AddTask({ newTask, setNewTask, setTasks }: { newTask: Task, setNewTask: React.Dispatch<React.SetStateAction<Task>>, setTasks: React.Dispatch<React.SetStateAction<Task[]>> }) {
  const [open, setOpen] = useState(false)
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.title) {

      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+'/task/add', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      const data = await response.json();
      console.log(data)

      setTasks(tasks => [{ dueDate: data.dueDate ? new Date(data.dueDate) : null, ...data as Task,id: data._id }, ...tasks])
      setNewTask({ id: "", title: "", description: "", status: "To Do", priority: "Medium", dueDate: null })
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 mr-2"><Plus className="w-4 h-4 mr-2" /> Add Task</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={addTask} >

          <div className="space-y-4">
            <Input
              placeholder="Task Title"
              value={newTask.title}
              required
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <Textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <div className="flex space-x-2">
              <Select value={newTask.status} onValueChange={(value: Task['status']) => setNewTask({ ...newTask, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newTask.priority} onValueChange={(value: Task['priority']) => setNewTask({ ...newTask, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 w-full justify-between">

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    {newTask.dueDate ? format(newTask.dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTask.dueDate || undefined}
                    onSelect={(date) => setNewTask({ ...newTask, dueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button type="submit">Add Task</Button>
            </div>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  )
}