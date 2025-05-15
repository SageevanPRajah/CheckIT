'use client'
import PostForm from './components/PostForm'
import PostFeed from './components/PostFeed'
import Header from '../feed/components/Header'
import ProcessCount from '../process/components/ProcessCount'

export default function PostsPage() {
  return (
    <div className="">
      <Header />

      <div className="max-w-xl mx-auto">
        <PostForm />
        <ProcessCount />
        <PostFeed />
      </div>
    </div>
  )
}
