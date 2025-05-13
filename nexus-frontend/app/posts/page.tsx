'use client'
import PostForm from './components/PostForm'
import PostFeed from './components/PostFeed'

export default function PostsPage() {
  return (
    <div className="max-w-xl mx-auto">
      <PostForm />
      <PostFeed />
    </div>
  )
}
