// app/feed/page.tsx

"use client";

import { useEffect, useState } from "react";
import { authFetch, BACKEND_HOST } from "@/lib/api";
import CommentSection from "@/app/posts/components/CommentSection";

interface Comment {
  id: number;
  content: string;
  authorUsername: string;
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  description: string;
  mediaUrls: string[];   // e.g. "/uploads/xyz.jpg"
  comments: Comment[];
  likeCount: number;
  instructorId: number;  // newly added so we can pass it to CommentSection
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await authFetch<Post[]>("/posts/feed", { method: "GET" });
        setPosts(data);
      } catch (err) {
        console.error("Failed to load feed:", err);
      }
    })();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      await authFetch(`/posts/${postId}/like`, { method: "POST" });
      setPosts(prev =>
        prev.map(p =>
          p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p
        )
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      {posts.map(p => (
        <div key={p.id} className="p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold">{p.title}</h2>
          <p className="mt-2">{p.description}</p>

          {/* media: now no "/api" prefix */}
          {p.mediaUrls.length > 0 && (
            <div className="mt-4 flex space-x-2 overflow-x-auto">
              {p.mediaUrls.map(path => (
                <img
                  key={path}
                  src={`${BACKEND_HOST}${path}`}
                  alt="post media"
                  className="w-32 h-32 object-cover rounded"
                />
              ))}
            </div>
          )}

          {/* like & comments summary */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handleLike(p.id)}
              className="flex items-center space-x-1"
            >
              <span>❤️</span>
              <span>{p.likeCount}</span>
            </button>
            <span>Comments: {p.comments.length}</span>
          </div>

          {/* existing inline comment list */}
          {/* <div className="mt-4 space-y-2 text-sm">
            {p.comments.map(c => (
              <div key={c.id}>
                <strong>{c.authorUsername}:</strong> {c.content}
              </div>
            ))}
          </div> */}

          {/* full CommentSection UI (adds input box, re-fetching, etc.) */}
          <div className="mt-6">
            <CommentSection postId={p.id} postOwnerId={p.instructorId} />
          </div>
        </div>
      ))}
    </div>
  );
}
