import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { CalendarIcon, GripVertical } from "lucide-react";
import { Badge } from "./ui/badge";
import { AlertTriangle, Clock } from "lucide-react"
import { Task } from "./task-list";
import { format } from "date-fns"
import EditTask from "./EditTask";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  update: (id: string, newData: Task, remove?: boolean) => void
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay, update }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case "Low": return <Clock className="w-4 h-4 text-blue-500" />
      case "Medium": return <Clock className="w-4 h-4 text-yellow-500" />
      case "High": return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row  border-b-2 border-secondary relative">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
        >
          <span className="sr-only">Move task</span>
          <GripVertical />
        </Button>
        {task.dueDate && (
          <span className="text-sm ml-2 flex items-center">
            <CalendarIcon className="w-4 h-4  mr-1" />
            {format(task.dueDate, "PP")}
          </span>
        )}
        <Badge variant={"outline"} className="ml-auto font-semibold">
          {getPriorityIcon(task.priority)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 px-3 pt-3 pb-5   text-left whitespace-pre-wrap relative">
        <div className="mr-4">

        {task.title}
        {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
        </div>

        <div className="absolute top-2 right-3">
          <EditTask task={task} update={update} />
        </div>
      </CardContent>
    </Card>
  );
}
