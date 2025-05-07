'use client'
import React, { useState, useEffect, KeyboardEvent } from 'react'
import { authFetch, getCurrentUser } from '@/lib/api'
import CommentItem from './CommentItem'
import { Send } from 'lucide-react'

interface Comment {
  id: number
  content: string
  authorId: number
  authorUsername: string
  createdAt: string
}

export default function CommentSection({
  postId,
  postOwnerId,
}: {
  postId: number
  postOwnerId: number
}) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newContent, setNewContent] = useState('')
  const [me, setMe] = useState<{ id: number; username: string } | null>(null)

  // load comments + current user
  useEffect(() => {
    authFetch<Comment[]>(`/posts/${postId}/comments`, { method: 'GET' })
      .then(setComments)
      .catch(console.error)

    getCurrentUser()
      .then(setMe)
      .catch(() => null)
  }, [postId])

  const submitComment = async () => {
    if (!newContent.trim()) return
    const c = await authFetch<Comment>(
      `/posts/${postId}/comments`,
      { method: 'POST', body: { content: newContent.trim() } }
    )
    setComments(prev => [...prev, c])
    setNewContent('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitComment()
    }
  }

  return (
    <div className="mt-4 space-y-3">
      {/* existing comments */}
      {comments.map(c => (
        <CommentItem
          key={c.id}
          postId={postId}
          postOwnerId={postOwnerId}
          comment={c}
          currentUser={me}
          onDelete={() =>
            setComments(prev => prev.filter(x => x.id !== c.id))
          }
          onUpdate={updated =>
            setComments(prev =>
              prev.map(x => (x.id === updated.id ? updated : x))
            )
          }
        />
      ))}

      {/* input bar like FB */}
      {me && (
        <div className="flex items-center space-x-3 pt-2 border-t">
          {/* use first letter of username as avatar */}
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
            {me.username.charAt(0).toUpperCase()}
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Write a comment..."
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={submitComment}
              disabled={!newContent.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
