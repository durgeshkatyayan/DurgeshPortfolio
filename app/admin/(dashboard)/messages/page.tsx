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

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get("/api/messages");
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Inbox</h1>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-neutral-500">No messages in your inbox.</p>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg._id} 
                className={`p-6 rounded-xl border ${msg.isRead ? 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800' : 'bg-white dark:bg-neutral-900 border-blue-200 dark:border-blue-900/50 shadow-sm'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      {msg.name} {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mt-1">
                      <span className="flex items-center gap-1"><Mail size={14} /> {msg.email}</span>
                      {msg.phone && <span className="flex items-center gap-1"><Phone size={14} /> {msg.phone}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-4 bg-neutral-100 dark:bg-neutral-950 rounded-lg text-sm leading-relaxed">
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}