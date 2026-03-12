'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/components/features/auth/auth-provider';
import { ChatRoomList, type ChatRoomSummary } from '@/components/features/chat/chat-room-list';
import { ChatMessageArea } from '@/components/features/chat/chat-message-area';
import { FadeIn } from '@/components/shared/motion-wrapper';
import type { ApiResponse } from '@/lib/types';

export default function BrandMessagesPage() {
  const { profile } = useAuthContext();
  const [rooms, setRooms] = useState<ChatRoomSummary[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/rooms');
      const result: ApiResponse<ChatRoomSummary[]> = await res.json();
      if (result.success && result.data) {
        setRooms(result.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, [fetchRooms]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  return (
    <div className="space-y-4">
      <FadeIn>
        <h1 className="text-2xl font-bold text-text-primary">메시지</h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          {/* Room list sidebar */}
          <div className="w-full sm:w-80 shrink-0 border-r border-border overflow-y-auto">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-text-primary">대화 목록</h2>
            </div>
            <ChatRoomList
              rooms={rooms}
              activeRoomId={activeRoomId}
              onSelectRoom={setActiveRoomId}
              loading={loading}
            />
          </div>

          {/* Message area - hidden on mobile when no room selected */}
          <div className={`flex-1 ${activeRoomId ? 'flex' : 'hidden sm:flex'} flex-col`}>
            <ChatMessageArea
              roomId={activeRoomId}
              currentUserId={profile?.id ?? ''}
              otherPartyName={activeRoom?.other_party_name ?? ''}
              otherPartyAvatar={activeRoom?.other_party_avatar ?? null}
            />
          </div>

          {/* Mobile back button when room is active */}
          {activeRoomId && (
            <button
              onClick={() => setActiveRoomId(null)}
              className="sm:hidden fixed top-[4.5rem] left-4 z-10 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-primary shadow-md border border-border"
              aria-label="대화 목록으로 돌아가기"
            >
              &larr; 목록
            </button>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
