'use client'
import React, { useState } from 'react'
import { authFetch } from '@/lib/api'
import { MoreHorizontal } from 'lucide-react'

interface Comment {
  id: number
  content: string
  authorId: number
  authorUsername: string
  createdAt: string
}

export default function CommentItem({
  postId,
  comment,
  postOwnerId,
  currentUser,
  onDelete,
  onUpdate,
}: {
  postId: number
  comment: Comment
  postOwnerId: number
  currentUser: { id: number } | null
  onDelete: () => void
  onUpdate: (c: Comment) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(comment.content)

  const isAuthor = currentUser?.id === comment.authorId
  const isPostOwner = currentUser?.id === postOwnerId

  const save = async () => {
    const updated = await authFetch<Comment>(
      `/posts/${postId}/comments/${comment.id}`,
      { method: 'PUT', body: { content: text } }
    )
    onUpdate(updated)
    setEditing(false)
  }

  const del = async () => {
    await authFetch<void>(
      `/posts/${postId}/comments/${comment.id}`,
      { method: 'DELETE' }
    )
    onDelete()
  }

  return (
    <div className="flex items-start space-x-3">
      {/* commenter avatar */}
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
        {comment.authorUsername.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1">
        <div className="relative bg-gray-100 px-4 py-2 rounded-2xl">
          <strong className="block">{comment.authorUsername}</strong>

          {editing ? (
            <>
              <textarea
                rows={2}
                className="w-full mt-1 border rounded p-2"
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <div className="mt-1 flex gap-2">
                <button
                  onClick={save}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className="mt-1">{comment.content}</p>
          )}

          {/* settings */}
          {(isAuthor || isPostOwner) && !editing && (
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="absolute top-1 right-1 p-1 rounded hover:bg-gray-200"
            >
              <MoreHorizontal size={16} />
            </button>
          )}

          {menuOpen && (
            <div className="absolute top-8 right-1 bg-white border rounded shadow z-10">
              {isAuthor && (
                <button
                  onClick={() => { setEditing(true); setMenuOpen(false) }}
                  className="block px-3 py-1 hover:bg-gray-100"
                >
                  Edit
                </button>
              )}
              {(isAuthor || isPostOwner) && (
                <button
                  onClick={() => { setMenuOpen(false); del() }}
                  className="block px-3 py-1 text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
        <span className="text-gray-500 text-xs mt-1 block">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  )
}
