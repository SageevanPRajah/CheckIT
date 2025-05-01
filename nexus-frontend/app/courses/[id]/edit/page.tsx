'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { authFetch } from '@/lib/api'

interface Course {
    title: string;
    description: string;
}

export default function EditCoursePage() {
    const router = useRouter()
    const params = useParams() as { id: string }
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')

    const fetchCourse = async () => {
        try {
            const data = await authFetch<Course>(`/courses/${params.id}`, { method: 'GET' })
            setTitle(data.title)
            setDescription(data.description)
        } catch (err: any) {
            setError(err.message || 'Failed to load course')
        }
    }

    useEffect(() => {
        fetchCourse()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            await authFetch(`/courses/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify({ title, description }),
            })
            router.push('/courses')
        } catch (err: any) {
            setError(err.message || 'Failed to update course')
        }
    }

    return (
        <div className="mx-auto max-w-md mt-10 p-4 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleUpdate} className="space-y-4">
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
                    Update
                </button>
            </form>
        </div>
    )
}