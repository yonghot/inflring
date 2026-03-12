'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn, formatTimeAgo } from '@/lib/utils';
import type { ApiResponse, Message } from '@/lib/types';

interface ChatMessageAreaProps {
  roomId: string | null;
  currentUserId: string;
  otherPartyName: string;
  otherPartyAvatar: string | null;
}

export function ChatMessageArea({
  roomId,
  currentUserId,
  otherPartyName,
  otherPartyAvatar,
}: ChatMessageAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }

    async function fetchMessages() {
      setLoading(true);
      try {
        const res = await fetch(`/api/chat/rooms/${roomId}/messages`);
        const result: ApiResponse<Message[]> = await res.json();
        if (result.success && result.data) {
          setMessages(result.data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend() {
    if (!roomId || !inputValue.trim() || sending) return;

    const messageText = inputValue.trim();
    setInputValue('');
    setSending(true);

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      room_id: roomId,
      sender_id: currentUserId,
      content: messageText,
      message_type: 'text',
      file_url: null,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const res = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageText }),
      });
      const result: ApiResponse<Message> = await res.json();
      if (result.success && result.data) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMessage.id ? result.data! : m))
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setInputValue(messageText);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!roomId) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <MessageSquare className="h-8 w-8 text-text-muted" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">
          대화를 선택해주세요
        </h3>
        <p className="mt-2 max-w-xs text-sm text-text-secondary">
          왼쪽에서 대화방을 선택하면 메시지가 표시됩니다.
        </p>
      </div>
    );
  }

  if (loading && messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  function groupMessagesByDate(msgs: Message[]): { date: string; messages: Message[] }[] {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';

    for (const msg of msgs) {
      const date = new Date(msg.created_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (date !== currentDate) {
        currentDate = date;
        groups.push({ date, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    }
    return groups;
  }

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
        <Avatar src={otherPartyAvatar} alt={otherPartyName} size="sm" />
        <h2 className="text-sm font-semibold text-text-primary">{otherPartyName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-6" role="log" aria-label="메시지 목록">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-text-muted">대화를 시작해보세요</p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.date}>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] text-text-muted">
                  {group.date}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-3">
                {group.messages.map((message) => {
                  const isOwn = message.sender_id === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={cn('flex items-end gap-2', isOwn ? 'justify-end' : 'justify-start')}
                    >
                      {!isOwn && (
                        <Avatar
                          src={otherPartyAvatar}
                          alt={otherPartyName}
                          size="sm"
                          className="mb-5"
                        />
                      )}
                      <div className={cn('max-w-[70%]', isOwn ? 'items-end' : 'items-start')}>
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                            isOwn
                              ? 'bg-primary text-white rounded-br-md'
                              : 'bg-slate-100 text-text-primary rounded-bl-md'
                          )}
                        >
                          {message.content}
                        </div>
                        <p className={cn(
                          'mt-1 text-[11px] text-text-muted',
                          isOwn ? 'text-right' : 'text-left'
                        )}>
                          {formatTimeAgo(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            disabled={sending}
            aria-label="메시지 입력"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim() || sending}
            aria-label="메시지 보내기"
          >
            {sending ? (
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <Send size={18} aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
