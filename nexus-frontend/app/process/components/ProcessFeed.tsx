"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authFetch } from "@/lib/api"
import { Edit2, Trash2, CheckCircle, Clock } from "lucide-react"

interface Task {
  id: number
  name: string
  days: number
  completed: boolean
}

interface Progress {
  id: number
  processName: string
  category: string
  startDate: string
  tasks: Task[]
}

export default function ProcessFeed() {
  const router = useRouter()
  const [items, setItems] = useState<Progress[]>([])

  useEffect(() => {
    async function load() {
      try {
        const data = await authFetch<Progress[]>("/progress")
        setItems(data)
      } catch (err) {
        console.error("Failed to load progress", err)
      }
    }
    load()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Really delete this process?")) return
    try {
      await authFetch(`/progress/${id}`, { method: "DELETE" })
      setItems((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Failed to delete process", err)
      alert("Failed to delete process")
    }
  }

  return (
    <div className="space-y-6">
      {items.map((p) => (
        <div
          key={p.id}
          className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-md transition-shadow"
        >
          {/* header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {p.processName}
              </h3>
              <p className="mt-0.5 text-sm text-gray-500">
                Category: {p.category}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/process/${p.id}/edit`)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* start date */}
          <p className="mt-2 text-sm text-gray-600">
            Start Date:{" "}
            <time dateTime={p.startDate}>
              {new Date(p.startDate).toLocaleDateString()}
            </time>
          </p>

          {/* tasks */}
          <ul className="mt-4 space-y-2">
            {p.tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-700">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.days} day{t.days !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {t.completed ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <Clock className="text-yellow-500" size={20} />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      t.completed ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {t.completed ? "Complete" : "Pending"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
