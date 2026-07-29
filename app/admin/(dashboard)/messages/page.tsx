"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Calendar, Phone } from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      setLoading(true);

      const res = await axios.get("/api/messages");

      setMessages(res.data.data ?? []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Inbox</h1>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
            />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500 dark:border-neutral-700">
          No messages found.
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`rounded-xl border p-6 transition ${
                msg.isRead
                  ? "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50"
                  : "border-blue-300 bg-white shadow-sm dark:border-blue-900 dark:bg-neutral-900"
              }`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{msg.name}</h2>

                    {!msg.isRead && (
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {msg.email}
                    </span>

                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {msg.phone}
                      </span>
                    )}
                  </div>
                </div>

                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <Calendar size={12} />
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="rounded-lg bg-neutral-100 p-4 text-sm leading-7 dark:bg-neutral-950">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}