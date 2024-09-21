'use client'

import { useAuth } from "@/components/AuthProvider";
import { TaskList } from "@/components/task-list";


export default function Home() {
  const { user } = useAuth()

  if (user)
    return (
      <div className="min-h-screen flex flex-col items-center gap-3 justify-center">
        <div className="flex flex-row gap-2">
        </div>
        <TaskList />
      </div>
    );
}
