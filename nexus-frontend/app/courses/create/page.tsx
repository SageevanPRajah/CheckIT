'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '@/lib/api'

export default function CreateCoursePage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            await authFetch('/courses', {
                method: 'POST',
                body: JSON.stringify({ title, description }),
            })
            router.push('/courses')
        } catch (err: any) {
            setError(err.message || 'Failed to create course')
        }
    }

    return (
        <div className="mx-auto max-w-md mt-10 p-4 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Create Course</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
                <div>
                    <label className="block mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Description</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create
                </button>
            </form>
        </div>
    )
}
