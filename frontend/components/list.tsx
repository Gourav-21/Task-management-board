import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Calendar as CalendarIcon, CheckCircle2 } from "lucide-react"
import EditTask from "./EditTask"
import { Task } from "./task-list"
import { Badge } from "./ui/badge"

export default function List({ update, getPriorityIcon, filteredAndSortedTasks }: { update: (id: string, newData: Task, remove?: boolean) => void, getPriorityIcon: (priority: Task['priority']) => JSX.Element, filteredAndSortedTasks: Task[] }) {
  return (
    <div className="space-y-4">
      {filteredAndSortedTasks.map(task => (
        <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border bg-white relative">
          <div className="space-y-2 ">

            <h3 className="font-medium inline-flex gap-2 "> <Badge variant={"outline"} className="ml-auto font-semibold">
              {getPriorityIcon(task.priority)}
            </Badge> {task.title}</h3>
            {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
            <div className="flex space-x-3 text-sm">
              <span className="flex items-center">
                <Select value={task.status} onValueChange={(value: Task['status']) => update(task.id, { ...task, status: value })}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </span>
              <span className="flex items-center">
                <Select value={task.priority} onValueChange={(value: Task['priority']) => update(task.id, { ...task, priority: value })}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </span>
              {task.dueDate && (
                <span className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {format(task.dueDate, "PP")}
                </span>
              )}


            </div>
          </div>

          <span className="flex items-center absolute right-4 bottom-4">
            <EditTask task={task} update={update} />
          </span>

          <div className="flex items-center space-x-2 absolute right-4 top-4">
            {/* {getPriorityIcon(task.priority)} */}
            {task.status === "Completed" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          </div>
        </div>
      ))}
    </div>
  )
}
