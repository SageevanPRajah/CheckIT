'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { API_URL, authFetch } from '@/lib/api'

interface Post {
  id: number
  title: string
  description: string
  instructorUsername: string
  mediaUrls: string[]
}

export default function EditPostPage() {
  const router = useRouter()
  const { id } = useParams()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [existingMedia, setExistingMedia] = useState<string[]>([])
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // derive backend base to prefix relative uploads
  const BACKEND_BASE = API_URL.replace(/\/api$/, '')

  useEffect(() => {
    if (!id) return
    authFetch<Post>(`/posts/${id}`, { method: 'GET' })
      .then(post => {
        setTitle(post.title)
        setDescription(post.description)
        setExistingMedia(post.mediaUrls)
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const form = new FormData()
    form.append('title', title)
    form.append('description', description)
    newMediaFiles.forEach(f => form.append('media', f))

    try {
      await authFetch(`/posts/${id}`, {
        method: 'PUT',
        body: form,
      })
      router.push('/posts')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update post')
    }
  }

  if (loading) {
    return <div className="p-4 text-center">Loading post…</div>
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit Post</h1>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
            rows={4}
          />
        </div>

        {existingMedia.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Existing Media</label>
            <div className="grid grid-cols-3 gap-2">
              {existingMedia.map((url, i) => {
                const src = url.startsWith('/uploads')
                  ? `${BACKEND_BASE}${url}`
                  : url
                return url.endsWith('.mp4') ? (
                  <video
                    key={i}
                    src={src}
                    controls
                    className="w-full rounded"
                  />
                ) : (
                  <img
                    key={i}
                    src={src}
                    alt={`media-${i}`}
                    className="w-full rounded"
                  />
                )
              })}
            </div>
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">
            Replace Media (optional, max 3 files)
          </label>
          <input
            type="file"
            accept="image/*,video/mp4"
            multiple
            onChange={e => {
              const files = e.currentTarget.files
              if (files) setNewMediaFiles(Array.from(files).slice(0, 3))
            }}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
