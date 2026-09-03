CREATE INDEX IF NOT EXISTS `game_sessions_room_id_idx`
ON `game_sessions` (`room_id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `rounds_session_created_idx`
ON `rounds` (`session_id`, `created_at` DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `room_content_settings_room_id_idx`
ON `room_content_settings` (`room_id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `content_usage_room_game_id_idx`
ON `content_usage` (`room_id`, `game_type`, `id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `game_content_type_active_owner_idx`
ON `game_content` (`game_type`, `is_active`, `owner_room_id`);
