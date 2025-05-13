// app/feed/page.tsx
"use client";

import { useEffect, useState } from "react";
import { authFetch, getCurrentUser, BACKEND_HOST } from "@/lib/api";
import CommentSection from "@/app/posts/components/CommentSection";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
}

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
  instructorId: number;
  instructorUsername: string;
  mediaUrls: string[];
  comments: Comment[];
  likeCount: number;
  createdAt: string;
}

export default function FeedPage() {
  const [me, setMe] = useState<User | null>(null);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followedIds, setFollowedIds] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // 1) Who am I?
        const current = await getCurrentUser();
        if (!current) return;
        setMe(current);

        // 2) Fetch initial feed to derive my follows
        const feedPosts = await authFetch<Post[]>("/posts/feed", { method: "GET" });
        // Collect unique instructorIds (excluding self)
        const initFollows = Array.from(
          new Set(feedPosts.map((p) => p.instructorId))
        ).filter((id) => id !== current.id);
        setFollowedIds(initFollows);

        // 3) Fetch all users for the bar
        const allUsers = await authFetch<User[]>("/users", { method: "GET" });
        setInstructors(allUsers);

        // 4) Fetch all posts for local filtering
        const all = await authFetch<Post[]>("/posts/feed", { method: "GET" });
        // Normalize types & null arrays
        const safe = all.map((p) => ({
          ...p,
          instructorId: Number(p.instructorId),
          mediaUrls: p.mediaUrls || [],
          comments: p.comments || [],
        }));
        setPosts(safe);
      } catch (err) {
        console.error("Error loading feed data:", err);
      }
    })();
  }, []);

  const toggleFollow = (userId: number) => {
    setFollowedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Always show my posts + those of instructors I follow, newest first
  const visiblePosts = posts
    .filter(
      (p) =>
        (me && p.instructorId === me.id) ||
        followedIds.includes(p.instructorId)
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const handleLike = async (postId: number) => {
    try {
      await authFetch(`/posts/${postId}/like`, { method: "POST" });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p
        )
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      {/* — Follow bar — */}
      <div className="flex space-x-4 overflow-x-auto py-4 border-b">
        {instructors.map((u) => (
          <div key={u.id} className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold">
              {u.username.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={() => toggleFollow(u.id)}
              className={
                followedIds.includes(u.id)
                  ? "mt-1 px-3 py-1 rounded bg-green-500 text-white text-sm"
                  : "mt-1 px-3 py-1 rounded bg-blue-500 text-white text-sm"
              }
            >
              {followedIds.includes(u.id) ? "Following" : "Follow"}
            </button>
            <button
              onClick={() => router.push(`/users/${u.username}`)}
              className="mt-1 text-xs text-blue-600 underline"
            >
              {u.username}
            </button>
          </div>
        ))}
      </div>

      {/* — Filtered & sorted feed — */}
      {visiblePosts.map((p) => (
        <div key={p.id} className="p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold">
            {p.title} — {p.instructorUsername}
          </h2>
          <p className="mt-2">{p.description}</p>

          {p.mediaUrls.length > 0 && (
            <div className="mt-4 flex space-x-2 overflow-x-auto">
              {p.mediaUrls.map((path) => (
                <img
                  key={path}
                  src={`${BACKEND_HOST}${path}`}
                  alt="post media"
                  className="w-32 h-32 object-cover rounded"
                />
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handleLike(p.id)}
              className="flex items-center space-x-1"
            >
              ❤️ <span>{p.likeCount}</span>
            </button>
            <span>Comments: {p.comments.length}</span>
          </div>

          <div className="mt-6">
            <CommentSection postId={p.id} postOwnerId={p.instructorId} />
          </div>
        </div>
      ))}
    </div>
  );
}
