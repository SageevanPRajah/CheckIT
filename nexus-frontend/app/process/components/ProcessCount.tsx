"use client"

import React, { useEffect, useState } from "react"
import { authFetch } from "@/lib/api"

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

export default function ProgressStatsPage() {
  const [all, setAll] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authFetch<Progress[]>("/progress")
      .then((data) => setAll(data))
      .catch((err) => console.error("Failed to load progress", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="p-8 text-center">Loading stats…</p>
  }

  // Flatten all tasks
  const tasks = all.flatMap((p) => p.tasks)

  // Total counts
  const totalCompleted = tasks.filter((t) => t.completed).length
  const totalPending   = tasks.length - totalCompleted

  // Per-category breakdown
  type CatStats = { completed: number; pending: number }
  const statsByCategory: Record<string, CatStats> = {}
  all.forEach((p) => {
    const cat = p.category || "—"
    if (!statsByCategory[cat]) {
      statsByCategory[cat] = { completed: 0, pending: 0 }
    }
    p.tasks.forEach((t) => {
      if (t.completed) statsByCategory[cat].completed += 1
      else             statsByCategory[cat].pending   += 1
    })
  })

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-green-800">Completed</h2>
          <p className="mt-2 text-4xl font-bold text-green-900">
            {totalCompleted}
          </p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-yellow-800">Pending</h2>
          <p className="mt-2 text-4xl font-bold text-yellow-900">
            {totalPending}
          </p>
        </div>
      </div>

      {/* Breakdown table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Category
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-green-600">
                Completed
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-yellow-600">
                Pending
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Object.entries(statsByCategory).map(([cat, stats]) => (
              <tr key={cat}>
                <td className="px-6 py-4 text-sm text-gray-800">{cat}</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-green-700">
                  {stats.completed}
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-yellow-700">
                  {stats.pending}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
