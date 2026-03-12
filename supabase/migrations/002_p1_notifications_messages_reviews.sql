-- P1 테이블: 알림, 채팅, 계약, 에스크로, 리뷰, 파일업로드

-- 알림
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('match_received', 'match_accepted', 'match_rejected', 'message_received', 'review_received', 'contract_created', 'payment_received', 'payment_released', 'campaign_status_changed', 'system')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own_read" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_own_update" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- 채팅방
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id),
  brand_id UUID NOT NULL REFERENCES profiles(id),
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_chat_rooms_creator ON chat_rooms(creator_id);
CREATE INDEX idx_chat_rooms_brand ON chat_rooms(brand_id);
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_rooms_party_access" ON chat_rooms FOR ALL USING (creator_id = auth.uid() OR brand_id = auth.uid());

-- 메시지
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'system')),
  file_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_messages_room_id ON messages(room_id, created_at DESC);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_room_party" ON messages FOR ALL USING (room_id IN (SELECT id FROM chat_rooms WHERE creator_id = auth.uid() OR brand_id = auth.uid()));

-- 계약
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id),
  brand_id UUID NOT NULL REFERENCES profiles(id),
  amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL DEFAULT 0,
  content_requirements TEXT,
  delivery_deadline DATE,
  revision_count INTEGER DEFAULT 0,
  max_revisions INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_creator', 'pending_brand', 'active', 'content_submitted', 'revision_requested', 'completed', 'cancelled', 'disputed')),
  signed_by_creator BOOLEAN DEFAULT false,
  signed_by_brand BOOLEAN DEFAULT false,
  signed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contracts_party_access" ON contracts FOR ALL USING (creator_id = auth.uid() OR brand_id = auth.uid());

-- 에스크로
CREATE TABLE IF NOT EXISTS escrow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID UNIQUE REFERENCES contracts(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'held', 'released', 'refunded', 'disputed')),
  paid_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE escrow ENABLE ROW LEVEL SECURITY;
CREATE POLICY "escrow_party_access" ON escrow FOR SELECT USING (contract_id IN (SELECT id FROM contracts WHERE creator_id = auth.uid() OR brand_id = auth.uid()));

-- 리뷰
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewee_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  communication_score INTEGER CHECK (communication_score >= 1 AND communication_score <= 5),
  quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 5),
  timeliness_score INTEGER CHECK (timeliness_score >= 1 AND timeliness_score <= 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(contract_id, reviewer_id)
);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (is_public = true OR reviewer_id = auth.uid() OR reviewee_id = auth.uid());
CREATE POLICY "reviews_own_insert" ON reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- 파일 업로드
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  context TEXT NOT NULL CHECK (context IN ('media_kit', 'contract_attachment', 'message_attachment', 'content_delivery', 'profile_avatar')),
  context_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_file_uploads_user ON file_uploads(user_id);
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "file_uploads_own_access" ON file_uploads FOR ALL USING (user_id = auth.uid());
CREATE POLICY "file_uploads_public_read" ON file_uploads FOR SELECT USING (context IN ('media_kit', 'profile_avatar'));

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
