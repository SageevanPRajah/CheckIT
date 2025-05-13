'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL, authFetch } from '@/lib/api'
import { MoreVertical } from 'lucide-react'
import CommentSection from './CommentSection'

interface Post {
  id: number
  title: string
  description: string
  instructorUsername: string
  mediaUrls: string[]
  instructorId: number
}

export default function PostItem({ post }: { post: Post }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const BACKEND_BASE = API_URL.replace(/\/api$/, '')

  const confirmDelete = async () => {
    try {
      await authFetch<void>(`/posts/${post.id}`, { method: 'DELETE' })
      window.location.reload()
    } catch (err) {
      console.error('Failed to delete post', err)
      alert('Could not delete post.')
    }
  }

  return (
    <div className="relative mb-8 bg-white p-4 rounded-lg shadow">
      {/* Settings button */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
      >
        <MoreVertical size={20} />
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute top-8 right-2 bg-white border rounded shadow-md z-10">
          <button
            onClick={() => router.push(`/posts/${post.id}/edit`)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setShowDeleteModal(true)
              setMenuOpen(false)
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            Delete
          </button>
        </div>
      )}

      {/* Avatar + content */}
      <div className="flex items-start">
        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white mr-4">
          {post.instructorUsername.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{post.title}</h3>
          <p className="mt-1 text-gray-700">{post.description}</p>

          {/* Media */}
          {post.mediaUrls.length > 0 && (
            <div className="mt-4 space-y-2">
              {post.mediaUrls.map((url, i) => {
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
                    alt=""
                    className="w-full rounded"
                  />
                )
              })}
            </div>
          )}

          {/* Comments */}
          <div className="mt-6">
            <CommentSection
              postId={post.id}
              postOwnerId={post.instructorId}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this post?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  confirmDelete()
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
