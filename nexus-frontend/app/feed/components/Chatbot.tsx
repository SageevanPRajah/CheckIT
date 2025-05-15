"use client";

import { useState, useEffect, useRef } from "react";
import { authFetch } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: "user", content: text }]);
    setInput("");

    try {
      // note: authFetch will call `${API_URL}/chat`
      const { reply } = await authFetch<{ reply: string }>("/chat", {
        method: "POST",
        body: { message: text, history: messages },
      });
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat error", err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setOpen(o => !o)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        {open ? "×" : "Chat"}
      </button>
      {open && (
        <div className="mt-2 w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col">
          <div className="p-2 flex-1 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 ${
                  m.role === "assistant" ? "text-left" : "text-right"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded ${
                    m.role === "assistant" ? "bg-gray-200" : "bg-blue-200"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="p-2 border-t flex">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded px-2 py-1 mr-2"
              placeholder="Type a message…"
            />
            <button
              onClick={sendMessage}
              className="px-3 bg-blue-600 text-white rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
