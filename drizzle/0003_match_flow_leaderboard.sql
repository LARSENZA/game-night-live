CREATE UNIQUE INDEX IF NOT EXISTS `game_content_unique` ON `game_content` (`game_type`,`prompt`,`owner_room_id`);
--> statement-breakpoint
ALTER TABLE `game_sessions` ADD `game_type` text;
--> statement-breakpoint
ALTER TABLE `game_sessions` ADD `team_a_name` text;
--> statement-breakpoint
ALTER TABLE `game_sessions` ADD `team_b_name` text;
--> statement-breakpoint
ALTER TABLE `rounds` ADD `team_name` text;
--> statement-breakpoint
ALTER TABLE `rounds` ADD `prompt` text;
--> statement-breakpoint
ALTER TABLE `rounds` ADD `answer` text;
--> statement-breakpoint
ALTER TABLE `rounds` ADD `detail` text;
--> statement-breakpoint
CREATE TABLE `event_teams` (`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,`name` text NOT NULL,`normalized_name` text NOT NULL,`total_score` integer DEFAULT 0 NOT NULL,`matches_played` integer DEFAULT 0 NOT NULL,`games_won` integer DEFAULT 0 NOT NULL,`correct_answers` integer DEFAULT 0 NOT NULL,`answers_played` integer DEFAULT 0 NOT NULL,`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_teams_name_unique` ON `event_teams` (`normalized_name`);
--> statement-breakpoint
CREATE TABLE `content_usage` (`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,`room_id` text NOT NULL,`session_id` text NOT NULL,`content_id` integer NOT NULL,`game_type` text NOT NULL,`team_name` text NOT NULL,`result` text,`used_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_usage_session_item_unique` ON `content_usage` (`session_id`,`content_id`);
