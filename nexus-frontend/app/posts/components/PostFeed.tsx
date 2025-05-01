'use client'
import { useEffect, useState } from "react"
import PostItem from './PostItem'
import { authFetch } from "@/lib/api"

interface Post {
  id: number
  title: string
  description: string
  instructorId: number 
  instructorUsername: string
  mediaUrls: string[]
}

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    async function load() {
      try {
        // Option A: if authFetch is generic
        const data = await authFetch<Post[]>("/posts", { method: "GET" })
        
        // Option B: if authFetch isn’t generic
        // const raw = await authFetch("/posts", { method: "GET" })
        // const data = raw as Post[]

        setPosts(data)
      } catch (err) {
        console.error("Failed to load posts", err)
      }
    }
    load()
  }, [])

  return (
    <div>
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  )
}
