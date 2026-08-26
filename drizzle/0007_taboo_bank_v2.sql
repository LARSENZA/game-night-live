-- Replace dictionary-derived global Taboo cards with the curated Game Night ZA bank.
-- Custom room cards and historical round/content usage records are preserved.

DROP TABLE IF EXISTS `_taboo_v2_seed`;
--> statement-breakpoint
CREATE TABLE `_taboo_v2_seed` (
  `prompt` text PRIMARY KEY NOT NULL,
  `category` text NOT NULL,
  `metadata` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `_taboo_v2_seed` (`prompt`, `category`, `metadata`) VALUES
  ('Square', 'Objects & Shapes', '{"taboo":["four","equal","sides","corners","box"]}'),
  ('Circle', 'Objects & Shapes', '{"taboo":["round","shape","ring","ball","centre"]}'),
  ('Triangle', 'Objects & Shapes', '{"taboo":["three","sides","corners","shape","angle"]}'),
  ('Rectangle', 'Objects & Shapes', '{"taboo":["four","sides","long","shape","opposite"]}'),
  ('Pencil', 'Everyday Objects', '{"taboo":["write","draw","eraser","sharpener","lead"]}'),
  ('Eraser', 'Everyday Objects', '{"taboo":["rubber","pencil","mistake","remove","school"]}'),
  ('Scissors', 'Everyday Objects', '{"taboo":["cut","blades","paper","sharp","pair"]}'),
  ('Umbrella', 'Everyday Objects', '{"taboo":["rain","wet","cover","handle","open"]}'),
  ('Mirror', 'Everyday Objects', '{"taboo":["reflection","glass","look","face","image"]}'),
  ('Pillow', 'Everyday Objects', '{"taboo":["sleep","head","bed","soft","cushion"]}'),
  ('Blanket', 'Everyday Objects', '{"taboo":["warm","bed","cover","sleep","cold"]}'),
  ('Toothbrush', 'Everyday Objects', '{"taboo":["teeth","paste","clean","bathroom","bristles"]}'),
  ('Candle', 'Everyday Objects', '{"taboo":["wax","flame","light","burn","wick"]}'),
  ('Clock', 'Everyday Objects', '{"taboo":["time","hours","hands","wall","tick"]}'),
  ('Key', 'Everyday Objects', '{"taboo":["lock","door","open","metal","unlock"]}'),
  ('Wallet', 'Everyday Objects', '{"taboo":["money","cards","pocket","cash","leather"]}'),
  ('Backpack', 'Everyday Objects', '{"taboo":["bag","school","shoulders","carry","zip"]}'),
  ('Ladder', 'Everyday Objects', '{"taboo":["climb","steps","height","roof","rungs"]}'),
  ('Hammer', 'Everyday Objects', '{"taboo":["nail","hit","tool","wood","build"]}'),
  ('Screwdriver', 'Everyday Objects', '{"taboo":["screw","tool","turn","handle","tighten"]}'),
  ('Broom', 'Everyday Objects', '{"taboo":["sweep","floor","clean","dust","bristles"]}'),
  ('Bucket', 'Everyday Objects', '{"taboo":["water","handle","carry","container","plastic"]}'),
  ('Fridge', 'Everyday Objects', '{"taboo":["cold","food","kitchen","freezer","door"]}'),
  ('Microwave', 'Everyday Objects', '{"taboo":["heat","food","kitchen","seconds","oven"]}'),
  ('Kettle', 'Everyday Objects', '{"taboo":["boil","water","tea","hot","kitchen"]}'),
  ('Washing Machine', 'Everyday Objects', '{"taboo":["clothes","laundry","wash","spin","detergent"]}'),
  ('Remote Control', 'Everyday Objects', '{"taboo":["television","buttons","channel","volume","battery"]}'),
  ('Sunglasses', 'Everyday Objects', '{"taboo":["sun","eyes","dark","wear","shades"]}'),
  ('Headphones', 'Everyday Objects', '{"taboo":["music","ears","listen","sound","wireless"]}'),
  ('Camera', 'Everyday Objects', '{"taboo":["photo","picture","lens","take","flash"]}'),
  ('Pizza', 'Food & Drink', '{"taboo":["cheese","slice","toppings","dough","Italian"]}'),
  ('Burger', 'Food & Drink', '{"taboo":["bun","patty","beef","cheese","fast food"]}'),
  ('Sandwich', 'Food & Drink', '{"taboo":["bread","filling","lunch","slices","toast"]}'),
  ('Chocolate', 'Food & Drink', '{"taboo":["sweet","cocoa","bar","brown","dessert"]}'),
  ('Ice Cream', 'Food & Drink', '{"taboo":["cold","scoop","cone","melt","flavour"]}'),
  ('Popcorn', 'Food & Drink', '{"taboo":["cinema","movie","corn","snack","butter"]}'),
  ('Coffee', 'Food & Drink', '{"taboo":["drink","caffeine","beans","cup","morning"]}'),
  ('Tea', 'Food & Drink', '{"taboo":["drink","cup","bag","hot","milk"]}'),
  ('Milk', 'Food & Drink', '{"taboo":["cow","white","drink","cereal","dairy"]}'),
  ('Bread', 'Food & Drink', '{"taboo":["loaf","slice","toast","sandwich","bake"]}'),
  ('Cheese', 'Food & Drink', '{"taboo":["dairy","milk","yellow","slice","melt"]}'),
  ('Egg', 'Food & Drink', '{"taboo":["chicken","shell","yolk","breakfast","boil"]}'),
  ('Banana', 'Food & Drink', '{"taboo":["yellow","fruit","peel","monkey","bunch"]}'),
  ('Apple', 'Food & Drink', '{"taboo":["fruit","red","green","tree","bite"]}'),
  ('Watermelon', 'Food & Drink', '{"taboo":["fruit","green","red","seeds","summer"]}'),
  ('Lemon', 'Food & Drink', '{"taboo":["yellow","sour","fruit","juice","citrus"]}'),
  ('Potato', 'Food & Drink', '{"taboo":["chips","vegetable","mash","peel","starch"]}'),
  ('Rice', 'Food & Drink', '{"taboo":["grain","white","cook","bowl","staple"]}'),
  ('Pasta', 'Food & Drink', '{"taboo":["Italian","noodles","sauce","spaghetti","boil"]}'),
  ('Soup', 'Food & Drink', '{"taboo":["bowl","liquid","hot","spoon","broth"]}'),
  ('Salad', 'Food & Drink', '{"taboo":["lettuce","healthy","vegetables","bowl","dressing"]}'),
  ('Cake', 'Food & Drink', '{"taboo":["birthday","icing","bake","slice","candles"]}'),
  ('Doughnut', 'Food & Drink', '{"taboo":["round","hole","sweet","fried","icing"]}'),
  ('Biscuit', 'Food & Drink', '{"taboo":["cookie","crunchy","tea","snack","bake"]}'),
  ('Honey', 'Food & Drink', '{"taboo":["bee","sweet","sticky","hive","golden"]}'),
  ('Salt', 'Food & Drink', '{"taboo":["seasoning","white","pepper","taste","shaker"]}'),
  ('Sugar', 'Food & Drink', '{"taboo":["sweet","white","tea","spoon","baking"]}'),
  ('Braai', 'South African Food', '{"taboo":["meat","fire","barbecue","grill","charcoal"]}'),
  ('Boerewors', 'South African Food', '{"taboo":["sausage","braai","meat","coil","farmer"]}'),
  ('Bunny Chow', 'South African Food', '{"taboo":["Durban","curry","bread","loaf","Indian"]}'),
  ('Teacher', 'People & Jobs', '{"taboo":["school","students","classroom","lesson","teach"]}'),
  ('Doctor', 'People & Jobs', '{"taboo":["hospital","patient","sick","medicine","health"]}'),
  ('Nurse', 'People & Jobs', '{"taboo":["hospital","patient","doctor","care","uniform"]}'),
  ('Police Officer', 'People & Jobs', '{"taboo":["crime","arrest","law","uniform","station"]}'),
  ('Firefighter', 'People & Jobs', '{"taboo":["fire","hose","rescue","truck","flames"]}'),
  ('Chef', 'People & Jobs', '{"taboo":["cook","kitchen","food","restaurant","hat"]}'),
  ('Pilot', 'People & Jobs', '{"taboo":["plane","fly","cockpit","airport","captain"]}'),
  ('Farmer', 'People & Jobs', '{"taboo":["crops","animals","tractor","land","farm"]}'),
  ('Mechanic', 'People & Jobs', '{"taboo":["car","repair","engine","garage","tools"]}'),
  ('Dentist', 'People & Jobs', '{"taboo":["teeth","mouth","drill","cavity","braces"]}'),
  ('Lawyer', 'People & Jobs', '{"taboo":["court","judge","law","client","case"]}'),
  ('Barber', 'People & Jobs', '{"taboo":["hair","cut","clippers","salon","shave"]}'),
  ('Cashier', 'People & Jobs', '{"taboo":["till","shop","money","pay","receipt"]}'),
  ('Waiter', 'People & Jobs', '{"taboo":["restaurant","table","order","food","serve"]}'),
  ('DJ', 'People & Jobs', '{"taboo":["music","club","mix","party","turntable"]}'),
  ('Photographer', 'People & Jobs', '{"taboo":["camera","pictures","photos","lens","shoot"]}'),
  ('Plumber', 'People & Jobs', '{"taboo":["pipes","water","leak","toilet","repair"]}'),
  ('Electrician', 'People & Jobs', '{"taboo":["wires","power","electricity","lights","repair"]}'),
  ('Coach', 'People & Jobs', '{"taboo":["team","sport","train","players","manager"]}'),
  ('Referee', 'People & Jobs', '{"taboo":["whistle","match","rules","official","foul"]}'),
  ('Baby', 'People & Jobs', '{"taboo":["cry","nappy","small","mother","newborn"]}'),
  ('Grandmother', 'People & Jobs', '{"taboo":["granny","family","old","mother","grandchildren"]}'),
  ('Twin', 'People & Jobs', '{"taboo":["two","same","born","identical","siblings"]}'),
  ('Celebrity', 'People & Jobs', '{"taboo":["famous","star","fans","public","Hollywood"]}'),
  ('President', 'People & Jobs', '{"taboo":["country","leader","government","election","office"]}'),
  ('School', 'Places & Travel', '{"taboo":["students","teacher","classroom","learn","education"]}'),
  ('Hospital', 'Places & Travel', '{"taboo":["doctor","nurse","patient","sick","emergency"]}'),
  ('Airport', 'Places & Travel', '{"taboo":["plane","flight","passport","luggage","terminal"]}'),
  ('Beach', 'Places & Travel', '{"taboo":["sand","ocean","waves","swim","sun"]}'),
  ('Restaurant', 'Places & Travel', '{"taboo":["food","menu","waiter","eat","table"]}'),
  ('Hotel', 'Places & Travel', '{"taboo":["room","sleep","guest","reception","holiday"]}'),
  ('Library', 'Places & Travel', '{"taboo":["books","read","quiet","borrow","shelves"]}'),
  ('Supermarket', 'Places & Travel', '{"taboo":["groceries","shopping","trolley","aisles","food"]}'),
  ('Cinema', 'Places & Travel', '{"taboo":["movie","screen","popcorn","film","seats"]}'),
  ('Stadium', 'Places & Travel', '{"taboo":["sport","crowd","match","seats","field"]}'),
  ('Church', 'Places & Travel', '{"taboo":["pray","God","worship","pastor","Sunday"]}'),
  ('Bank', 'Places & Travel', '{"taboo":["money","account","cash","loan","deposit"]}'),
  ('Prison', 'Places & Travel', '{"taboo":["jail","cell","criminal","bars","sentence"]}'),
  ('Museum', 'Places & Travel', '{"taboo":["history","art","exhibits","old","gallery"]}'),
  ('Zoo', 'Places & Travel', '{"taboo":["animals","cages","visit","wild","park"]}'),
  ('Farm', 'Places & Travel', '{"taboo":["animals","crops","tractor","farmer","land"]}'),
  ('Mountain', 'Places & Travel', '{"taboo":["high","climb","peak","hill","rock"]}'),
  ('Desert', 'Places & Travel', '{"taboo":["sand","dry","hot","camel","water"]}'),
  ('Island', 'Places & Travel', '{"taboo":["water","ocean","land","beach","surrounded"]}'),
  ('Forest', 'Places & Travel', '{"taboo":["trees","woods","animals","green","nature"]}'),
  ('Waterfall', 'Places & Travel', '{"taboo":["water","fall","river","cliff","flow"]}'),
  ('Bus Stop', 'Places & Travel', '{"taboo":["bus","wait","transport","route","shelter"]}'),
  ('Taxi Rank', 'Places & Travel', '{"taboo":["minibus","transport","driver","queue","fare"]}'),
  ('Petrol Station', 'Places & Travel', '{"taboo":["fuel","car","diesel","pump","garage"]}'),
  ('Shopping Mall', 'Places & Travel', '{"taboo":["shops","stores","buy","food court","centre"]}'),
  ('Elephant', 'Animals & Nature', '{"taboo":["trunk","tusks","grey","large","animal"]}'),
  ('Lion', 'Animals & Nature', '{"taboo":["king","roar","mane","cat","Africa"]}'),
  ('Giraffe', 'Animals & Nature', '{"taboo":["neck","tall","spots","animal","Africa"]}'),
  ('Zebra', 'Animals & Nature', '{"taboo":["stripes","black","white","horse","animal"]}'),
  ('Dog', 'Animals & Nature', '{"taboo":["bark","pet","puppy","tail","bone"]}'),
  ('Cat', 'Animals & Nature', '{"taboo":["meow","pet","kitten","whiskers","purr"]}'),
  ('Horse', 'Animals & Nature', '{"taboo":["ride","saddle","gallop","stable","pony"]}'),
  ('Cow', 'Animals & Nature', '{"taboo":["milk","moo","farm","beef","horns"]}'),
  ('Chicken', 'Animals & Nature', '{"taboo":["egg","bird","farm","cluck","wings"]}'),
  ('Penguin', 'Animals & Nature', '{"taboo":["ice","bird","black","white","Antarctica"]}'),
  ('Dolphin', 'Animals & Nature', '{"taboo":["ocean","swim","intelligent","mammal","flipper"]}'),
  ('Shark', 'Animals & Nature', '{"taboo":["ocean","teeth","fin","dangerous","fish"]}'),
  ('Snake', 'Animals & Nature', '{"taboo":["slither","venom","long","reptile","bite"]}'),
  ('Spider', 'Animals & Nature', '{"taboo":["eight","legs","web","insect","bite"]}'),
  ('Butterfly', 'Animals & Nature', '{"taboo":["wings","colourful","caterpillar","fly","insect"]}'),
  ('Bee', 'Animals & Nature', '{"taboo":["honey","sting","hive","buzz","yellow"]}'),
  ('Mosquito', 'Animals & Nature', '{"taboo":["bite","blood","buzz","itch","insect"]}'),
  ('Crocodile', 'Animals & Nature', '{"taboo":["teeth","river","reptile","dangerous","alligator"]}'),
  ('Monkey', 'Animals & Nature', '{"taboo":["banana","tree","ape","swing","animal"]}'),
  ('Kangaroo', 'Animals & Nature', '{"taboo":["Australia","jump","pouch","joey","animal"]}'),
  ('Volcano', 'Animals & Nature', '{"taboo":["lava","erupt","mountain","ash","hot"]}'),
  ('Rainbow', 'Animals & Nature', '{"taboo":["colours","sky","rain","arc","seven"]}'),
  ('Thunder', 'Animals & Nature', '{"taboo":["storm","sound","lightning","loud","sky"]}'),
  ('Lightning', 'Animals & Nature', '{"taboo":["flash","storm","thunder","sky","electric"]}'),
  ('Snow', 'Animals & Nature', '{"taboo":["white","cold","winter","ice","flakes"]}'),
  ('Rain', 'Animals & Nature', '{"taboo":["water","clouds","wet","umbrella","weather"]}'),
  ('Sun', 'Animals & Nature', '{"taboo":["hot","sky","light","day","star"]}'),
  ('Moon', 'Animals & Nature', '{"taboo":["night","sky","space","full","orbit"]}'),
  ('Star', 'Animals & Nature', '{"taboo":["sky","night","space","shine","sun"]}'),
  ('Ocean', 'Animals & Nature', '{"taboo":["water","sea","waves","deep","salt"]}'),
  ('Football', 'Sport & Entertainment', '{"taboo":["goal","kick","ball","pitch","soccer"]}'),
  ('Rugby', 'Sport & Entertainment', '{"taboo":["ball","tackle","try","scrum","Springboks"]}'),
  ('Cricket', 'Sport & Entertainment', '{"taboo":["bat","ball","wicket","bowler","runs"]}'),
  ('Basketball', 'Sport & Entertainment', '{"taboo":["ball","hoop","dribble","court","shoot"]}'),
  ('Tennis', 'Sport & Entertainment', '{"taboo":["racket","ball","court","serve","net"]}'),
  ('Golf', 'Sport & Entertainment', '{"taboo":["club","ball","hole","course","swing"]}'),
  ('Boxing', 'Sport & Entertainment', '{"taboo":["gloves","fight","ring","punch","round"]}'),
  ('Swimming', 'Sport & Entertainment', '{"taboo":["water","pool","stroke","race","dive"]}'),
  ('Marathon', 'Sport & Entertainment', '{"taboo":["run","race","distance","kilometres","finish"]}'),
  ('Gym', 'Sport & Entertainment', '{"taboo":["exercise","weights","fitness","workout","train"]}'),
  ('Trophy', 'Sport & Entertainment', '{"taboo":["win","prize","cup","champion","award"]}'),
  ('Whistle', 'Sport & Entertainment', '{"taboo":["blow","sound","referee","mouth","loud"]}'),
  ('Guitar', 'Sport & Entertainment', '{"taboo":["strings","instrument","play","chords","electric"]}'),
  ('Piano', 'Sport & Entertainment', '{"taboo":["keys","instrument","play","music","black"]}'),
  ('Drum', 'Sport & Entertainment', '{"taboo":["beat","sticks","instrument","rhythm","hit"]}'),
  ('Microphone', 'Sport & Entertainment', '{"taboo":["sing","voice","sound","stage","speak"]}'),
  ('Movie', 'Sport & Entertainment', '{"taboo":["film","cinema","watch","actor","screen"]}'),
  ('Television', 'Sport & Entertainment', '{"taboo":["screen","watch","channel","remote","show"]}'),
  ('Netflix', 'Sport & Entertainment', '{"taboo":["stream","watch","series","movies","subscription"]}'),
  ('TikTok', 'Sport & Entertainment', '{"taboo":["video","app","live","scroll","social media"]}'),
  ('Selfie', 'Sport & Entertainment', '{"taboo":["photo","phone","yourself","camera","picture"]}'),
  ('Video Game', 'Sport & Entertainment', '{"taboo":["play","console","controller","computer","gaming"]}'),
  ('Puzzle', 'Sport & Entertainment', '{"taboo":["pieces","solve","picture","jigsaw","fit"]}'),
  ('Magic', 'Sport & Entertainment', '{"taboo":["trick","illusion","magician","wand","disappear"]}'),
  ('Dance', 'Sport & Entertainment', '{"taboo":["music","move","rhythm","steps","body"]}'),
  ('Karaoke', 'Sport & Entertainment', '{"taboo":["sing","lyrics","microphone","music","screen"]}'),
  ('Wedding', 'Sport & Entertainment', '{"taboo":["bride","groom","marriage","ring","ceremony"]}'),
  ('Birthday', 'Sport & Entertainment', '{"taboo":["cake","candles","party","age","celebrate"]}'),
  ('Christmas', 'Sport & Entertainment', '{"taboo":["December","Santa","gifts","tree","holiday"]}'),
  ('Concert', 'Sport & Entertainment', '{"taboo":["music","stage","crowd","singer","live"]}'),
  ('Smartphone', 'Technology', '{"taboo":["mobile","call","apps","screen","device"]}'),
  ('Laptop', 'Technology', '{"taboo":["computer","keyboard","screen","portable","battery"]}'),
  ('Internet', 'Technology', '{"taboo":["online","website","connect","web","Wi-Fi"]}'),
  ('Wi-Fi', 'Technology', '{"taboo":["internet","wireless","router","password","connect"]}'),
  ('Password', 'Technology', '{"taboo":["login","secret","account","characters","access"]}'),
  ('Email', 'Technology', '{"taboo":["message","inbox","send","address","electronic"]}'),
  ('WhatsApp', 'Technology', '{"taboo":["message","chat","phone","status","green"]}'),
  ('Google', 'Technology', '{"taboo":["search","internet","website","browser","engine"]}'),
  ('Robot', 'Technology', '{"taboo":["machine","automatic","human","metal","programmed"]}'),
  ('Drone', 'Technology', '{"taboo":["fly","camera","remote","air","pilot"]}'),
  ('Printer', 'Technology', '{"taboo":["paper","ink","computer","print","document"]}'),
  ('Charger', 'Technology', '{"taboo":["battery","phone","cable","power","plug"]}'),
  ('Battery', 'Technology', '{"taboo":["power","charge","energy","positive","negative"]}'),
  ('Keyboard', 'Technology', '{"taboo":["keys","type","computer","letters","spacebar"]}'),
  ('Mouse', 'Technology', '{"taboo":["computer","click","cursor","scroll","device"]}'),
  ('Screenshot', 'Technology', '{"taboo":["screen","picture","capture","phone","image"]}'),
  ('Emoji', 'Technology', '{"taboo":["face","symbol","message","smiley","reaction"]}'),
  ('Hashtag', 'Technology', '{"taboo":["symbol","social media","trend","number sign","post"]}'),
  ('Online Shopping', 'Technology', '{"taboo":["internet","buy","delivery","cart","website"]}'),
  ('Social Media', 'Technology', '{"taboo":["online","posts","followers","apps","share"]}'),
  ('Load Shedding', 'South Africa', '{"taboo":["Eskom","electricity","power","outage","lights"]}'),
  ('Springboks', 'South Africa', '{"taboo":["rugby","green","gold","national","team"]}'),
  ('Bafana Bafana', 'South Africa', '{"taboo":["football","soccer","national","team","yellow"]}'),
  ('Proteas', 'South Africa', '{"taboo":["cricket","national","team","South Africa","flower"]}'),
  ('Nelson Mandela', 'South Africa', '{"taboo":["president","prison","apartheid","Madiba","Robben Island"]}'),
  ('Table Mountain', 'South Africa', '{"taboo":["Cape Town","flat","cable car","landmark","peak"]}'),
  ('Kruger National Park', 'South Africa', '{"taboo":["animals","safari","wildlife","game reserve","Mpumalanga"]}'),
  ('Johannesburg', 'South Africa', '{"taboo":["Gauteng","city","Joburg","gold","Sandton"]}'),
  ('Cape Town', 'South Africa', '{"taboo":["Western Cape","Table Mountain","city","ocean","Mother City"]}'),
  ('Durban', 'South Africa', '{"taboo":["KwaZulu-Natal","beach","city","warm","Indian Ocean"]}'),
  ('Soweto', 'South Africa', '{"taboo":["Johannesburg","township","Orlando","Vilakazi Street","Gauteng"]}'),
  ('Mzansi', 'South Africa', '{"taboo":["South Africa","country","home","nickname","nation"]}'),
  ('Rand', 'South Africa', '{"taboo":["money","currency","South Africa","R","coins"]}'),
  ('Minibus Taxi', 'South Africa', '{"taboo":["transport","driver","rank","fare","commute"]}'),
  ('Gautrain', 'South Africa', '{"taboo":["train","Gauteng","Johannesburg","Pretoria","rapid"]}'),
  ('Vuvuzela', 'South Africa', '{"taboo":["horn","football","loud","blow","stadium"]}'),
  ('Pap', 'South African Food', '{"taboo":["maize","porridge","stiff","mealie meal","food"]}'),
  ('Chakalaka', 'South African Food', '{"taboo":["spicy","relish","vegetables","beans","pap"]}'),
  ('Biltong', 'South African Food', '{"taboo":["dried","meat","beef","snack","spice"]}'),
  ('Koeksister', 'South African Food', '{"taboo":["sweet","syrup","twisted","fried","dessert"]}'),
  ('Rooibos', 'South African Food', '{"taboo":["tea","red","drink","herbal","Cederberg"]}'),
  ('Vetkoek', 'South African Food', '{"taboo":["fried","dough","bread","mince","fat cake"]}'),
  ('Kota', 'South African Food', '{"taboo":["bread","chips","township","filling","quarter"]}'),
  ('Shisanyama', 'South African Food', '{"taboo":["meat","braai","fire","township","grill"]}'),
  ('Ubuntu', 'South Africa', '{"taboo":["humanity","people","together","community","African"]}'),
  ('Heritage Day', 'South Africa', '{"taboo":["September","culture","tradition","holiday","braai"]}'),
  ('Freedom Day', 'South Africa', '{"taboo":["April","democracy","election","holiday","1994"]}'),
  ('Lobola', 'South Africa', '{"taboo":["marriage","bride","cattle","family","payment"]}'),
  ('Matric', 'South Africa', '{"taboo":["Grade 12","school","exams","final year","certificate"]}'),
  ('Stokvel', 'South Africa', '{"taboo":["money","save","group","monthly","contribution"]}');
--> statement-breakpoint
UPDATE `game_content`
SET `is_active` = 0
WHERE `game_type` = 'taboo' AND `owner_room_id` IS NULL;
--> statement-breakpoint
UPDATE `game_content`
SET
  `prompt` = (
    SELECT seed.`prompt` FROM `_taboo_v2_seed` seed
    WHERE lower(trim(seed.`prompt`)) = lower(trim(`game_content`.`prompt`))
  ),
  `category` = (
    SELECT seed.`category` FROM `_taboo_v2_seed` seed
    WHERE lower(trim(seed.`prompt`)) = lower(trim(`game_content`.`prompt`))
  ),
  `metadata` = (
    SELECT seed.`metadata` FROM `_taboo_v2_seed` seed
    WHERE lower(trim(seed.`prompt`)) = lower(trim(`game_content`.`prompt`))
  ),
  `answer` = NULL,
  `is_active` = 1
WHERE
  `game_type` = 'taboo'
  AND `owner_room_id` IS NULL
  AND `id` = (
    SELECT min(existing.`id`)
    FROM `game_content` existing
    WHERE
      existing.`game_type` = 'taboo'
      AND existing.`owner_room_id` IS NULL
      AND lower(trim(existing.`prompt`)) = lower(trim(`game_content`.`prompt`))
  )
  AND EXISTS (
    SELECT 1 FROM `_taboo_v2_seed` seed
    WHERE lower(trim(seed.`prompt`)) = lower(trim(`game_content`.`prompt`))
  );
--> statement-breakpoint
INSERT INTO `game_content` (
  `game_type`, `prompt`, `answer`, `category`, `metadata`, `is_active`, `owner_room_id`
)
SELECT 'taboo', seed.`prompt`, NULL, seed.`category`, seed.`metadata`, 1, NULL
FROM `_taboo_v2_seed` seed
WHERE NOT EXISTS (
  SELECT 1 FROM `game_content` existing
  WHERE
    existing.`game_type` = 'taboo'
    AND existing.`owner_room_id` IS NULL
    AND lower(trim(existing.`prompt`)) = lower(trim(seed.`prompt`))
);
--> statement-breakpoint
DROP TABLE `_taboo_v2_seed`;
