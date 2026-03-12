'use client';

import { MessageSquare } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn, formatTimeAgo } from '@/lib/utils';

export interface ChatRoomSummary {
  id: string;
  other_party_name: string;
  other_party_avatar: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

interface ChatRoomListProps {
  rooms: ChatRoomSummary[];
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  loading: boolean;
}

export function ChatRoomList({ rooms, activeRoomId, onSelectRoom, loading }: ChatRoomListProps) {
  if (loading) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg p-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-24 bg-slate-200 animate-pulse rounded" />
              <div className="h-3 w-36 bg-slate-200 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <MessageSquare className="h-6 w-6 text-text-muted" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-text-primary">대화가 없습니다</p>
        <p className="mt-1 text-xs text-text-secondary">딜이 성사되면 대화방이 생성됩니다.</p>
      </div>
    );
  }

  return (
    <nav aria-label="채팅방 목록">
      <ul role="list" className="space-y-0.5 p-2">
        {rooms.map((room) => (
          <li key={room.id}>
            <button
              onClick={() => onSelectRoom(room.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200',
                activeRoomId === room.id
                  ? 'bg-primary/10 shadow-sm'
                  : 'hover:bg-slate-50'
              )}
              aria-current={activeRoomId === room.id ? 'true' : undefined}
            >
              <Avatar
                src={room.other_party_avatar}
                alt={room.other_party_name}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn(
                    'text-sm truncate',
                    room.unread_count > 0 ? 'font-semibold text-text-primary' : 'font-medium text-text-primary'
                  )}>
                    {room.other_party_name}
                  </p>
                  {room.last_message_at && (
                    <span className="shrink-0 text-[11px] text-text-muted">
                      {formatTimeAgo(room.last_message_at)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className={cn(
                    'text-xs truncate',
                    room.unread_count > 0 ? 'text-text-primary font-medium' : 'text-text-muted'
                  )}>
                    {room.last_message ?? '대화를 시작해보세요'}
                  </p>
                  {room.unread_count > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {room.unread_count > 9 ? '9+' : room.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
