'use client'

import { useState } from 'react'
import { authFetch } from "@/lib/api"

interface Post {
  createdAt: string
  likeCount: number
  comments: never[]
  instructorId(instructorId: any): number
  id: number
  title: string
  description: string
  instructorUsername: string
  mediaUrls: string[]
}

export default function PostForm({
  onNewPost,
}: {
  onNewPost?: (post: Post) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const form = new FormData()
    form.append('title', title)
    form.append('description', description)
    mediaFiles.forEach(f => form.append('media', f))

    try {
      // POST → /api/posts via Next proxy, throws on non-2xx, returns PostResponse
      const newPost = await authFetch<Post>("/posts", {
        method: "POST",
        body: form,
      })

      // Clear form on success
      setTitle('')
      setDescription('')
      setMediaFiles([])
      
      // Notify parent (e.g. PostFeed) to prepend this post
      if (onNewPost) onNewPost(newPost)

    } catch (err: any) {
      console.error("Failed to create post:", err)
      setError(err.message || "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      {error && <div className="mb-2 text-red-600">{error}</div>}

      <input
        type="text"
        placeholder="Title"
        required
        className="w-full border px-2 py-1 rounded mb-2"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="What's on your mind?"
        required
        className="w-full border px-2 py-1 rounded mb-2"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <input
        type="file"
        accept="image/*,video/mp4"
        multiple
        className="mb-2"
        onChange={e => {
          const files = e.currentTarget.files
          if (files) setMediaFiles(Array.from(files).slice(0, 3))
        }}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Post
      </button>
    </form>
  )
}
