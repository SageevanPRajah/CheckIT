'use client'

import React, { useEffect, useState } from 'react'
import { authFetch } from '@/lib/api'

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
  const [items, setItems] = useState<Progress[]>([])

  useEffect(() => {
    async function load() {
      try {
        const data = await authFetch<Progress[]>('/progress')
        setItems(data)
      } catch (err) {
        console.error('Failed to load progress', err)
      }
    }
    load()
  }, [])

  return (
    <div>
      {items.map(sp => (
        <div
          key={sp.id}
          className="mb-4 p-4 border rounded shadow-sm"
        >
          <h3 className="font-bold text-lg">
            {sp.processName}{' '}
            <span className="text-gray-500">({sp.category})</span>
          </h3>
          <p className="text-sm">
            Start: {new Date(sp.startDate).toLocaleDateString()}
          </p>
          <ul className="list-disc ml-5 mt-2">
            {sp.tasks.map(t => (
              <li key={t.id}>
                {t.name} – {t.days}d –{' '}
                {t.completed ? (
                  <span className="text-green-600">Complete</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
