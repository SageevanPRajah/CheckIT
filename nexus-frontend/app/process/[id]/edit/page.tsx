'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { authFetch } from '@/lib/api'
import ProcessForm from '../../components/ProcessForm'

// the shape we get from the API
type ProgressData = {
      processName: string
      category:    string
      startDate:   string
      tasks:       { name: string; days: number }[]
    }
    
    // what the form component expects
    import type { FormValues } from '../../components/ProcessForm'

export default function EditProcessPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }

  const [initialData, setInitialData] = useState<ProgressData | null>(
        null
     )

  useEffect(() => {
    authFetch<{
      id: number
      processName: string
      category: string
      startDate: string
      tasks: { id: number; name: string; days: number; completed: boolean }[]
    }>(`/progress/${id}`)
      .then(res => {
        setInitialData({
          processName: res.processName,
          category:    res.category,
          startDate:   res.startDate,
          tasks:       res.tasks.map(t => ({ name: t.name, days: t.days })),
        })
      })
  }, [id])

  if (!initialData) return <div>Loading…</div>

  const handleUpdate = async (vals: FormValues) => {
    await authFetch(`/progress/${id}`, {
      method: 'PUT',
      body: {
        processName: vals.processName,
        category:    vals.category,
        startDate:   vals.startDate,
        tasks:       vals.tasks.map(t => ({ name: t.name, days: t.days })),
      },
    })
    router.push('/process')
  }

  return (
    <div className="max-w-xl mx-auto py-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Process</h2>
      <ProcessForm
        initialData={{
           processName: initialData.processName,
           category:    initialData.category,
           startDate:   initialData.startDate,
          tasks:       initialData.tasks.map(t => ({ name: t.name, days: String(t.days) })),
         }}
        onSubmit={async (formVals: FormValues) => {
           await handleUpdate(formVals)
         }}
       />
     </div>
  )
}
