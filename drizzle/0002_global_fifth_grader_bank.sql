INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 6 × 7?', '42', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 6 × 7?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 8 × 9?', '72', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 8 × 9?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 12 × 4?', '48', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 12 × 4?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 11 × 6?', '66', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 11 × 6?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 7 × 8?', '56', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 7 × 8?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 9 × 9?', '81', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 9 × 9?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 12 × 12?', '144', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 12 × 12?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 5 × 13?', '65', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 5 × 13?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 14 × 3?', '42', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 14 × 3?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 15 × 4?', '60', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 15 × 4?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 16 × 5?', '80', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 16 × 5?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 18 × 3?', '54', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 18 × 3?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 25 × 4?', '100', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 25 × 4?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 21 × 5?', '105', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 21 × 5?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 24 × 6?', '144', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 24 × 6?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 32 × 3?', '96', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 32 × 3?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 13 × 7?', '91', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 13 × 7?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 17 × 5?', '85', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 17 × 5?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 19 × 4?', '76', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 19 × 4?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 23 × 3?', '69', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 23 × 3?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 84 ÷ 7?', '12', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 84 ÷ 7?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 96 ÷ 8?', '12', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 96 ÷ 8?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 144 ÷ 12?', '12', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 144 ÷ 12?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 126 ÷ 9?', '14', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 126 ÷ 9?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 225 ÷ 15?', '15', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 225 ÷ 15?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 156 ÷ 12?', '13', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 156 ÷ 12?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 132 ÷ 11?', '12', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 132 ÷ 11?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 180 ÷ 12?', '15', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 180 ÷ 12?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 216 ÷ 9?', '24', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 216 ÷ 9?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 250 ÷ 10?', '25', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 250 ÷ 10?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 347 + 128?', '475', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 347 + 128?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 625 + 249?', '874', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 625 + 249?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 809 + 176?', '985', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 809 + 176?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 1200 + 475?', '1675', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 1200 + 475?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 999 + 333?', '1332', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 999 + 333?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 754 + 268?', '1022', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 754 + 268?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 432 + 389?', '821', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 432 + 389?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 1500 + 725?', '2225', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 1500 + 725?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 2048 + 952?', '3000', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 2048 + 952?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 681 + 319?', '1000', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 681 + 319?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 900 − 475?', '425', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 900 − 475?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 1000 − 368?', '632', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 1000 − 368?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 745 − 289?', '456', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 745 − 289?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 632 − 197?', '435', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 632 − 197?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 1500 − 875?', '625', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 1500 − 875?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 2048 − 999?', '1049', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 2048 − 999?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 800 − 356?', '444', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 800 − 356?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 963 − 427?', '536', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 963 − 427?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 1200 − 648?', '552', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 1200 − 648?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 707 − 308?', '399', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 707 − 308?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is half of 96?', '48', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is half of 96?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is one quarter of 80?', '20', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is one quarter of 80?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is three quarters of 100?', '75', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is three quarters of 100?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is one third of 60?', '20', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is one third of 60?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is two thirds of 90?', '60', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is two thirds of 90?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 25% of 200?', '50', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 25% of 200?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 10% of 450?', '45', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 10% of 450?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 50% of 74?', '37', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 50% of 74?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 20% of 150?', '30', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 20% of 150?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is 75% of 40?', '30', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is 75% of 40?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many centimetres are in 2 metres?', '200', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many centimetres are in 2 metres?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many metres are in 3 kilometres?', '3000', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many metres are in 3 kilometres?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many minutes are in 2 hours?', '120', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many minutes are in 2 hours?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many seconds are in 3 minutes?', '180', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many seconds are in 3 minutes?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many grams are in 2 kilograms?', '2000', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many grams are in 2 kilograms?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many millilitres are in 1 litre?', '1000', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many millilitres are in 1 litre?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many days are in 3 weeks?', '21', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many days are in 3 weeks?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many months are in 2 years?', '24', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many months are in 2 years?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many millimetres are in 5 centimetres?', '50', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many millimetres are in 5 centimetres?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many hours are in 2 days?', '48', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many hours are in 2 days?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many sides does a hexagon have?', '6', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many sides does a hexagon have?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many sides does an octagon have?', '8', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many sides does an octagon have?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the perimeter of a 5 cm square?', '20 cm', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the perimeter of a 5 cm square?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the area of a 6 cm by 4 cm rectangle?', '24 cm²', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the area of a 6 cm by 4 cm rectangle?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many degrees are in a right angle?', '90 degrees', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many degrees are in a right angle?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many degrees are in a straight angle?', '180 degrees', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many degrees are in a straight angle?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What do you call a triangle with three equal sides?', 'Equilateral triangle', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What do you call a triangle with three equal sides?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What do you call a shape with five sides?', 'Pentagon', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What do you call a shape with five sides?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the next prime number after 7?', '11', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the next prime number after 7?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the Roman numeral for 10?', 'X', 'Maths', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the Roman numeral for 10?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''child''?', 'children', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''child''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''mouse''?', 'mice', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''mouse''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''tooth''?', 'teeth', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''tooth''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''foot''?', 'feet', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''foot''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''person''?', 'people', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''person''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''goose''?', 'geese', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''goose''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''woman''?', 'women', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''woman''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''man''?', 'men', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''man''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''knife''?', 'knives', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''knife''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''leaf''?', 'leaves', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''leaf''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''potato''?', 'potatoes', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''potato''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''tomato''?', 'tomatoes', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''tomato''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''baby''?', 'babies', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''baby''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''city''?', 'cities', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''city''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''sheep''?', 'sheep', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''sheep''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''deer''?', 'deer', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''deer''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''ox''?', 'oxen', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''ox''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''life''?', 'lives', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''life''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''box''?', 'boxes', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''box''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the plural of ''church''?', 'churches', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the plural of ''church''?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''ancient''.', 'modern', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''ancient''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''generous''.', 'selfish', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''generous''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''expand''.', 'contract', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''expand''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''victory''.', 'defeat', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''victory''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''noisy''.', 'quiet', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''noisy''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''arrive''.', 'depart', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''arrive''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''include''.', 'exclude', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''include''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''maximum''.', 'minimum', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''maximum''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''optimistic''.', 'pessimistic', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''optimistic''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''accept''.', 'reject', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''accept''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''permanent''.', 'temporary', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''permanent''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''increase''.', 'decrease', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''increase''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''visible''.', 'invisible', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''visible''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''frequent''.', 'rare', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''frequent''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give an antonym for ''complex''.', 'simple', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give an antonym for ''complex''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''happy''.', 'joyful', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''happy''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''large''.', 'big', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''large''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''quick''.', 'fast', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''quick''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''begin''.', 'start', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''begin''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''silent''.', 'quiet', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''silent''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''brave''.', 'courageous', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''brave''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''angry''.', 'furious', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''angry''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''clever''.', 'intelligent', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''clever''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''tiny''.', 'small', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''tiny''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''finish''.', 'complete', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''finish''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''reply''.', 'answer', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''reply''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''select''.', 'choose', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''select''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''strange''.', 'unusual', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''strange''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''beautiful''.', 'pretty', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''beautiful''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Give a synonym for ''difficult''.', 'hard', 'English', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Give a synonym for ''difficult''.'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of South Africa?', 'Pretoria', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of South Africa?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Botswana?', 'Gaborone', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Botswana?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Namibia?', 'Windhoek', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Namibia?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Zimbabwe?', 'Harare', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Zimbabwe?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Mozambique?', 'Maputo', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Mozambique?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Lesotho?', 'Maseru', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Lesotho?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Eswatini?', 'Mbabane', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Eswatini?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Zambia?', 'Lusaka', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Zambia?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Malawi?', 'Lilongwe', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Malawi?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Angola?', 'Luanda', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Angola?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Kenya?', 'Nairobi', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Kenya?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Tanzania?', 'Dodoma', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Tanzania?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Uganda?', 'Kampala', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Uganda?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Rwanda?', 'Kigali', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Rwanda?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Ethiopia?', 'Addis Ababa', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Ethiopia?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Egypt?', 'Cairo', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Egypt?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Nigeria?', 'Abuja', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Nigeria?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Ghana?', 'Accra', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Ghana?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Senegal?', 'Dakar', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Senegal?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Morocco?', 'Rabat', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Morocco?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of France?', 'Paris', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of France?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Spain?', 'Madrid', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Spain?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Portugal?', 'Lisbon', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Portugal?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Italy?', 'Rome', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Italy?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Germany?', 'Berlin', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Germany?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Belgium?', 'Brussels', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Belgium?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Netherlands?', 'Amsterdam', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Netherlands?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Ireland?', 'Dublin', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Ireland?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Norway?', 'Oslo', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Norway?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Sweden?', 'Stockholm', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Sweden?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Finland?', 'Helsinki', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Finland?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Poland?', 'Warsaw', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Poland?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Greece?', 'Athens', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Greece?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Türkiye?', 'Ankara', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Türkiye?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of India?', 'New Delhi', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of India?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of China?', 'Beijing', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of China?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Japan?', 'Tokyo', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Japan?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of South Korea?', 'Seoul', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of South Korea?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Thailand?', 'Bangkok', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Thailand?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Australia?', 'Canberra', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Australia?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of New Zealand?', 'Wellington', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of New Zealand?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Canada?', 'Ottawa', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Canada?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of United States?', 'Washington, D.C.', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of United States?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Mexico?', 'Mexico City', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Mexico?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Brazil?', 'Brasília', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Brazil?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Argentina?', 'Buenos Aires', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Argentina?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Chile?', 'Santiago', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Chile?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Peru?', 'Lima', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Peru?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Colombia?', 'Bogotá', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Colombia?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the capital of Cuba?', 'Havana', 'Geography', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the capital of Cuba?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which planet is closest to the Sun?', 'Mercury', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which planet is closest to the Sun?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which planet is known as the Red Planet?', 'Mars', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which planet is known as the Red Planet?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the largest planet in our solar system?', 'Jupiter', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the largest planet in our solar system?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What force pulls objects towards Earth?', 'Gravity', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What force pulls objects towards Earth?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What gas do plants take in during photosynthesis?', 'Carbon dioxide', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What gas do plants take in during photosynthesis?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What gas do humans need to breathe?', 'Oxygen', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What gas do humans need to breathe?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is H2O commonly called?', 'Water', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is H2O commonly called?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'At sea level, at what temperature does water freeze in Celsius?', '0°C', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('At sea level, at what temperature does water freeze in Celsius?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'At sea level, at what temperature does water boil in Celsius?', '100°C', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('At sea level, at what temperature does water boil in Celsius?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the centre of an atom called?', 'The nucleus', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the centre of an atom called?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which organ pumps blood around the human body?', 'The heart', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which organ pumps blood around the human body?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which organs allow humans to breathe?', 'The lungs', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which organs allow humans to breathe?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the largest organ of the human body?', 'The skin', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the largest organ of the human body?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many bones are in a typical adult human body?', '206', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many bones are in a typical adult human body?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which part of a plant absorbs water from the soil?', 'The roots', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which part of a plant absorbs water from the soil?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What green pigment helps plants absorb light?', 'Chlorophyll', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What green pigment helps plants absorb light?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What process do plants use to make food from light?', 'Photosynthesis', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What process do plants use to make food from light?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What do we call an animal that eats only plants?', 'Herbivore', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What do we call an animal that eats only plants?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What do we call an animal that eats only other animals?', 'Carnivore', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What do we call an animal that eats only other animals?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What do we call an animal that eats both plants and animals?', 'Omnivore', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What do we call an animal that eats both plants and animals?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the change from liquid water to water vapour called?', 'Evaporation', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the change from liquid water to water vapour called?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the change from water vapour to liquid called?', 'Condensation', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the change from water vapour to liquid called?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What are the three common states of matter?', 'Solid, liquid and gas', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What are the three common states of matter?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What instrument measures temperature?', 'Thermometer', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What instrument measures temperature?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What instrument is used to look at very small objects?', 'Microscope', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What instrument is used to look at very small objects?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the natural satellite of Earth?', 'The Moon', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the natural satellite of Earth?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How long does Earth take to orbit the Sun?', 'About 365 days', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How long does Earth take to orbit the Sun?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What causes day and night?', 'Earth rotating on its axis', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What causes day and night?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which simple machine is a sloping surface?', 'An inclined plane', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which simple machine is a sloping surface?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which metal is liquid at room temperature?', 'Mercury', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which metal is liquid at room temperature?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the hardest natural substance?', 'Diamond', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the hardest natural substance?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is molten rock beneath Earth''s surface called?', 'Magma', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is molten rock beneath Earth''s surface called?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is molten rock on Earth''s surface called?', 'Lava', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is molten rock on Earth''s surface called?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which layer of Earth do we live on?', 'The crust', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which layer of Earth do we live on?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What type of energy comes from the Sun?', 'Solar energy', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What type of energy comes from the Sun?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What renewable energy uses moving air?', 'Wind energy', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What renewable energy uses moving air?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is an animal without a backbone called?', 'An invertebrate', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is an animal without a backbone called?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which blood cells help fight infection?', 'White blood cells', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which blood cells help fight infection?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What vitamin can the body make when skin is exposed to sunlight?', 'Vitamin D', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What vitamin can the body make when skin is exposed to sunlight?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the closest star to Earth?', 'The Sun', 'Natural Science', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the closest star to Earth?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many provinces does South Africa have?', '9', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many provinces does South Africa have?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is South Africa''s administrative capital?', 'Pretoria', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is South Africa''s administrative capital?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is South Africa''s legislative capital?', 'Cape Town', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is South Africa''s legislative capital?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is South Africa''s judicial capital?', 'Bloemfontein', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is South Africa''s judicial capital?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the currency of South Africa?', 'The rand', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the currency of South Africa?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the name of South Africa''s national anthem?', 'Nkosi Sikelel'' iAfrika', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the name of South Africa''s national anthem?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'How many official languages does South Africa have?', '12', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('How many official languages does South Africa have?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which ocean lies to the east of South Africa?', 'Indian Ocean', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which ocean lies to the east of South Africa?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which ocean lies to the west of South Africa?', 'Atlantic Ocean', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which ocean lies to the west of South Africa?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the largest city in South Africa by population?', 'Johannesburg', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the largest city in South Africa by population?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'On which island was Nelson Mandela imprisoned for many years?', 'Robben Island', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('On which island was Nelson Mandela imprisoned for many years?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'In which year did South Africa hold its first democratic national election?', '1994', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('In which year did South Africa hold its first democratic national election?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Who became South Africa''s first democratically elected president in 1994?', 'Nelson Mandela', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Who became South Africa''s first democratically elected president in 1994?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What public holiday is celebrated in South Africa on 27 April?', 'Freedom Day', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What public holiday is celebrated in South Africa on 27 April?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What public holiday is celebrated on 16 June?', 'Youth Day', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What public holiday is celebrated on 16 June?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What public holiday is celebrated on 24 September?', 'Heritage Day', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What public holiday is celebrated on 24 September?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which province contains Durban?', 'KwaZulu-Natal', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which province contains Durban?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which province contains Cape Town?', 'Western Cape', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which province contains Cape Town?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which province contains Johannesburg?', 'Gauteng', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which province contains Johannesburg?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which province contains Gqeberha?', 'Eastern Cape', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which province contains Gqeberha?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which province contains Polokwane?', 'Limpopo', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which province contains Polokwane?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which province contains Mbombela?', 'Mpumalanga', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which province contains Mbombela?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which province contains Kimberley?', 'Northern Cape', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which province contains Kimberley?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which province contains Mahikeng?', 'North West', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which province contains Mahikeng?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which province contains Bloemfontein?', 'Free State', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which province contains Bloemfontein?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is South Africa''s highest mountain peak?', 'Mafadi', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is South Africa''s highest mountain peak?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What famous flat-topped mountain overlooks Cape Town?', 'Table Mountain', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What famous flat-topped mountain overlooks Cape Town?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which major river forms part of South Africa''s northern border?', 'Limpopo River', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which major river forms part of South Africa''s northern border?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which river is the longest in South Africa?', 'Orange River', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which river is the longest in South Africa?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the name of the large national park in north-eastern South Africa?', 'Kruger National Park', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the name of the large national park in north-eastern South Africa?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What are South Africa''s national rugby team commonly called?', 'The Springboks', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What are South Africa''s national rugby team commonly called?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is South Africa''s national cricket team commonly called?', 'The Proteas', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is South Africa''s national cricket team commonly called?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is South Africa''s men''s national football team called?', 'Bafana Bafana', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is South Africa''s men''s national football team called?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which South African city hosted the 2010 FIFA World Cup final?', 'Johannesburg', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which South African city hosted the 2010 FIFA World Cup final?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What does the abbreviation SA stand for?', 'South Africa', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What does the abbreviation SA stand for?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the national animal of South Africa?', 'Springbok', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the national animal of South Africa?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the national bird of South Africa?', 'Blue crane', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the national bird of South Africa?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the national flower of South Africa?', 'King protea', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the national flower of South Africa?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the national tree of South Africa?', 'Real yellowwood', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the national tree of South Africa?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is the national fish of South Africa?', 'Galjoen', 'South Africa', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is the national fish of South Africa?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which ancient civilisation built the pyramids at Giza?', 'Ancient Egyptians', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which ancient civilisation built the pyramids at Giza?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which ancient civilisation developed democracy in Athens?', 'Ancient Greeks', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which ancient civilisation developed democracy in Athens?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Who was the first person to walk on the Moon?', 'Neil Armstrong', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Who was the first person to walk on the Moon?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'In which year did humans first land on the Moon?', '1969', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('In which year did humans first land on the Moon?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What was the name of the ship on which the Pilgrims sailed to North America in 1620?', 'Mayflower', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What was the name of the ship on which the Pilgrims sailed to North America in 1620?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Who invented the movable-type printing press in Europe?', 'Johannes Gutenberg', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Who invented the movable-type printing press in Europe?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which empire was ruled from Rome?', 'Roman Empire', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which empire was ruled from Rome?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What title was given to rulers of ancient Egypt?', 'Pharaoh', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What title was given to rulers of ancient Egypt?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which wall once divided East and West Berlin?', 'Berlin Wall', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which wall once divided East and West Berlin?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'In which year did the Berlin Wall fall?', '1989', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('In which year did the Berlin Wall fall?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which war ended in 1918?', 'First World War', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which war ended in 1918?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which war ended in 1945?', 'Second World War', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which war ended in 1945?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Who was the British prime minister for much of the Second World War?', 'Winston Churchill', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Who was the British prime minister for much of the Second World War?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What was the Renaissance?', 'A revival of art and learning in Europe', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What was the Renaissance?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which explorer''s 1492 voyage crossed the Atlantic from Spain?', 'Christopher Columbus', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which explorer''s 1492 voyage crossed the Atlantic from Spain?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'Which ancient people used hieroglyphics?', 'Ancient Egyptians', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('Which ancient people used hieroglyphics?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What invention allowed people to preserve events in photographs?', 'The camera', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What invention allowed people to preserve events in photographs?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What do historians call an object made or used by people in the past?', 'An artefact', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What do historians call an object made or used by people in the past?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is a timeline used to show?', 'Events in chronological order', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is a timeline used to show?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What does BCE mean in historical dates?', 'Before Common Era', 'History', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What does BCE mean in historical dates?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What does CPU stand for?', 'Central Processing Unit', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What does CPU stand for?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What does USB stand for?', 'Universal Serial Bus', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What does USB stand for?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What does URL stand for?', 'Uniform Resource Locator', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What does URL stand for?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What does HTML stand for?', 'HyperText Markup Language', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What does HTML stand for?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What does Wi-Fi allow devices to do?', 'Connect to a network wirelessly', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What does Wi-Fi allow devices to do?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What device is commonly used to move a pointer on a desktop computer?', 'Mouse', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What device is commonly used to move a pointer on a desktop computer?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is software?', 'Programs and instructions used by a computer', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is software?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is hardware?', 'The physical parts of a computer', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is hardware?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is a strong password designed to protect?', 'An account or data', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is a strong password designed to protect?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What should you do with a suspicious email link?', 'Do not click it', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What should you do with a suspicious email link?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What does it mean to download a file?', 'Copy it from another system to your device', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What does it mean to download a file?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What does it mean to upload a file?', 'Send it from your device to another system', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What does it mean to upload a file?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What type of program is used to visit websites?', 'A web browser', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What type of program is used to visit websites?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is a computer virus?', 'Malicious software', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is a computer virus?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What does GPS help determine?', 'Location', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What does GPS help determine?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What converts sunlight into electrical energy?', 'A solar panel', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What converts sunlight into electrical energy?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is coding?', 'Writing instructions for a computer', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is coding?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is an algorithm?', 'A step-by-step set of instructions', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is an algorithm?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What does a keyboard allow a user to enter?', 'Text and commands', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What does a keyboard allow a user to enter?'))
);
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'trivia', 'What is cloud storage?', 'Saving files on remote internet-connected servers', 'Technology', '{}', 1, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content`
  WHERE `game_type` = 'trivia'
    AND `owner_room_id` IS NULL
    AND lower(trim(`prompt`)) = lower(trim('What is cloud storage?'))
);
