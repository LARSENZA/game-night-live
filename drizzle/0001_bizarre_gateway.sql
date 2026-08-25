CREATE TABLE `room_content_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` text NOT NULL,
	`content_id` integer NOT NULL,
	`enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE `game_content` ADD `owner_room_id` text;