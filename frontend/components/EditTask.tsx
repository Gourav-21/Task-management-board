import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format, set } from "date-fns"
import { FilePenLine, Plus } from "lucide-react"
import { Task } from "./task-list"
import { useState } from "react"

export default function EditTask({ task, update }: { task: Task, update: (id: string, newData: Task, remove?: boolean) => void }) {
  const [newTask, setNewTask] = useState(task)
  const [open, setOpen] = useState(false)

  const updateTask = (e: React.FormEvent) => {
    e.preventDefault()
    update(task.id, newTask)
    setOpen(false)
  }

  const deleteTask = () => {
    update(task.id, task, true)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <FilePenLine className="text-gray-400 hover:text-green-700 h-4 w-4 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={updateTask}>

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


              <div className="flex space-x-2">
                <Button variant="destructive" type="button" onClick={deleteTask}>delete Task</Button>
                <Button type="submit">Save Task</Button>
              </div>
            </div>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}