// app/users/[username]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { authFetch, BACKEND_HOST } from "@/lib/api";

interface Comment {
  id: number;
  content: string;
  authorUsername: string;
}

interface Post {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  instructorUsername: string;
  mediaUrls: string[];
  comments: Comment[];
}

export default function UserPostsPage() {
  const { username } = useParams() as { username: string };
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Fetch exactly this user’s posts
        const userPosts = await authFetch<Post[]>(
          `/posts/user/${encodeURIComponent(username)}`,
          { method: "GET" }
        );

        // Normalize arrays so .map() never crashes
        const safe = userPosts.map((p) => ({
          ...p,
          mediaUrls: p.mediaUrls || [],
          comments:   p.comments   || [],
        }));
        setPosts(safe);
      } catch (err) {
        console.error("Failed to load user posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  if (loading) {
    return <div className="p-8 text-center">Loading posts…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">{username}’s Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts to show.</p>
      ) : (
        posts.map((p) => (
          <div key={p.id} className="space-y-2">
            <h3 className="font-semibold">{p.title}</h3>
            <p>{p.description}</p>

            {p.mediaUrls.length > 0 && (
              <div className="mt-2 flex space-x-2 overflow-x-auto">
                {p.mediaUrls.map((m) => (
                  <img
                    key={m}
                    src={`${BACKEND_HOST}${m}`}
                    alt="post media"
                    className="rounded max-w-full"
                  />
                ))}
              </div>
            )}

            <div className="mt-2">
              <strong>Comments:</strong>
              {p.comments.length === 0 ? (
                <p className="text-gray-500">No comments</p>
              ) : (
                <ul className="pl-4 list-disc">
                  {p.comments.map((c) => (
                    <li key={c.id}>
                      <span className="font-medium">{c.authorUsername}:</span>{" "}
                      {c.content}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
