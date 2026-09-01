type BankCard={gameType:"top_answers"|"moji"|"rapid_fire"|"crowd";prompt:string;answer:string|null;category:string;metadata:Record<string,unknown>};

const points=[30,25,20,15,10];
const topRows=`
Name something found in a hotel room.|Travel|Bed|Television|Towels|Telephone|Mini fridge
Name something people do while waiting in a queue.|Everyday Life|Check their phone|Talk|Complain|Look around|Leave the queue
Name something you keep in a refrigerator.|Food|Milk|Eggs|Vegetables|Leftovers|Cold drinks
Name something people lose regularly.|Everyday Life|Keys|Phone|Wallet|Socks|Remote control
Name something that wakes people up.|Everyday Life|Alarm|Noise|Children|Sunlight|Phone call
Name something people do on a first date.|Relationships|Talk|Eat dinner|Watch a movie|Have drinks|Take a walk
Name something associated with birthdays.|Celebrations|Cake|Presents|Candles|Party|Balloons
Name something people carry in a handbag.|Everyday Life|Phone|Wallet|Keys|Makeup|Tissues
Name something that makes a baby cry.|Family|Hunger|Dirty nappy|Tiredness|Pain|Loud noise
Name something people check before travelling.|Travel|Passport|Tickets|Weather|Luggage|Money
Name something you might see at a taxi rank.|South Africa|Taxis|Commuters|Drivers|Queues|Vendors
Name something associated with load shedding.|South Africa|Darkness|Candles|Eskom|Generators|Power banks
Name a popular South African takeaway food.|South Africa|Kota|Chicken|Pizza|Burger|Fish and chips
Name something people do during a braai.|South Africa|Cook meat|Talk|Drink|Play music|Dance
Name something found at a South African rugby match.|South Africa|Fans|Springbok jerseys|Flags|Beer|Vuvuzelas
Name something people buy at a spaza shop.|South Africa|Bread|Milk|Cold drinks|Airtime|Sweets
Name something associated with a traditional wedding.|South Africa|Dancing|Traditional clothes|Food|Music|Family
Name something tourists visit in Cape Town.|South Africa|Table Mountain|V&A Waterfront|Robben Island|Beaches|Cape Point
Name something people complain about during winter.|Weather|Cold|Dark mornings|Heating bills|Dry skin|Short days
Name something people do when it starts raining.|Weather|Open an umbrella|Run for shelter|Close windows|Bring washing inside|Cancel plans
Name something you might see during a thunderstorm.|Weather|Lightning|Rain|Dark clouds|Flooding|Hail
Name something people wear in hot weather.|Clothing|Shorts|T-shirt|Sandals|Hat|Sunglasses
Name something associated with Christmas.|Celebrations|Presents|Tree|Family|Food|Santa Claus
Name something served at a party.|Celebrations|Cake|Cold drinks|Chips|Pizza|Sweets
Name something people do at New Year.|Celebrations|Count down|Party|Watch fireworks|Make resolutions|Toast
Name something that could spoil a party.|Celebrations|Bad weather|No music|Arguments|Not enough food|Power cut
Name something children ask for as a present.|Family|Phone|Toys|Bicycle|Video game|Clothes
Name something parents tell children to do.|Family|Clean their room|Do homework|Go to bed|Eat vegetables|Be quiet
Name something families argue about.|Family|Money|Housework|Television|Food|Being late
Name something found in a school bag.|School|Books|Pens|Lunch|Notebook|Calculator
Name something students do before an exam.|School|Study|Pray|Revise notes|Drink coffee|Panic
Name an excuse for not doing homework.|School|Forgot|Too busy|Did not understand|Lost the book|Internet problem
Name something a teacher writes on.|School|Whiteboard|Paper|Notebook|Computer|Chalkboard
Name something people do during a boring lesson.|School|Sleep|Check their phone|Talk|Doodle|Daydream
Name something used in an office.|Work|Computer|Printer|Desk|Telephone|Stapler
Name a reason someone may quit a job.|Work|Low pay|Bad boss|Stress|Long hours|New opportunity
Name something people do during a meeting.|Work|Take notes|Talk|Listen|Check their phone|Drink coffee
Name something a boss might complain about.|Work|Lateness|Poor performance|Missed deadline|Phone use|Absence
Name something people keep on their desk.|Work|Computer|Phone|Notebook|Water bottle|Photograph
Name something people do at the gym.|Fitness|Lift weights|Run|Stretch|Cycle|Take selfies
Name something people take on a run.|Fitness|Phone|Water|Watch|Earphones|Keys
Name a reason someone skips exercise.|Fitness|Tired|Busy|Lazy|Injured|Bad weather
Name something associated with football.|Sport|Ball|Goal|Players|Referee|Fans
Name something associated with cricket.|Sport|Bat|Ball|Wickets|Bowler|Umpire
Name something a sports fan wears.|Sport|Team jersey|Cap|Scarf|Face paint|Flag
Name something found in a kitchen.|Home|Stove|Fridge|Sink|Microwave|Kettle
Name something people clean every week.|Home|Floors|Bathroom|Kitchen|Laundry|Bedroom
Name something that can break in a house.|Home|Television|Window|Tap|Light bulb|Door
Name something people keep beside their bed.|Home|Phone|Lamp|Water|Alarm clock|Book
Name something found in a bathroom.|Home|Toilet|Shower|Soap|Towel|Toothbrush
Name something people put on toast.|Food|Butter|Jam|Cheese|Egg|Peanut butter
Name something commonly eaten for breakfast.|Food|Eggs|Cereal|Bread|Porridge|Fruit
Name a pizza topping.|Food|Cheese|Pepperoni|Mushrooms|Chicken|Pineapple
Name something people add to coffee.|Food|Sugar|Milk|Cream|Syrup|Ice
Name something served at a fast-food restaurant.|Food|Burger|Chips|Chicken|Cold drink|Milkshake
Name something people do at the cinema.|Entertainment|Watch the movie|Eat popcorn|Drink|Talk|Use their phone
Name something associated with superheroes.|Entertainment|Cape|Powers|Mask|Villain|Costume
Name something found at a concert.|Entertainment|Music|Singer|Crowd|Stage|Lights
Name something people watch on television.|Entertainment|News|Movies|Sport|Series|Reality shows
Name something a celebrity might have.|Entertainment|Fans|Money|Bodyguard|Fame|Luxury car
Name something people post on social media.|Technology|Photos|Videos|Status updates|Memes|Food
Name something people use a phone for.|Technology|Messaging|Calling|Social media|Photos|Internet
Name something that causes slow internet.|Technology|Weak signal|Too many users|Bad weather|Old router|Data limit
Name something people forget to charge.|Technology|Phone|Laptop|Power bank|Earphones|Watch
Name something found on a computer desktop.|Technology|Folders|Recycle bin|Browser|Documents|Shortcuts
Name something people do when they cannot sleep.|Everyday Life|Use their phone|Watch television|Read|Drink water|Count sheep
Name something people do when they are nervous.|Emotions|Shake|Sweat|Talk quickly|Bite nails|Pace
Name something that makes people laugh.|Emotions|Jokes|Funny videos|Friends|Comedy|Mistakes
Name something people fear.|Emotions|Spiders|Heights|Snakes|Darkness|Failure
Name something people do after receiving good news.|Emotions|Smile|Celebrate|Call someone|Cry|Post online
Name something found at an airport.|Travel|Planes|Passengers|Luggage|Security|Shops
Name something people buy before a road trip.|Travel|Fuel|Snacks|Water|A map|Airtime
Name something that delays a flight.|Travel|Bad weather|Technical problem|Late passengers|Security|Crew delay
Name something people photograph on holiday.|Travel|Landmarks|Food|Beach|Family|Sunset
Name something people forget to pack.|Travel|Toothbrush|Charger|Underwear|Passport|Sunscreen
Name something found in a hospital.|Health|Doctors|Nurses|Beds|Medicine|Patients
Name something people do when they have a cold.|Health|Rest|Take medicine|Drink tea|Blow their nose|Visit a doctor
Name something a doctor may ask about.|Health|Symptoms|Pain|Medication|Medical history|Diet
Name something people do to stay healthy.|Health|Exercise|Eat well|Drink water|Sleep|Visit a doctor
Name something that causes a headache.|Health|Stress|Dehydration|Loud noise|Lack of sleep|Screen time
Name something found in a garden.|Nature|Flowers|Grass|Trees|Soil|Insects
Name something people do at a park.|Outdoors|Walk|Picnic|Play|Exercise|Relax
Name something seen in the night sky.|Nature|Moon|Stars|Clouds|Planets|Aeroplanes
Name something animals need.|Animals|Food|Water|Shelter|Space|Care
Name a pet people keep at home.|Animals|Dog|Cat|Fish|Bird|Rabbit
Name something a dog likes to do.|Animals|Eat|Play|Walk|Sleep|Bark
Name something associated with a farm.|Animals|Cows|Tractor|Crops|Farmer|Barn
Name something people do after losing their phone.|Everyday Life|Call it|Search pockets|Track it|Ask someone|Panic
Name something people borrow from a neighbour.|Everyday Life|Sugar|Tools|Money|Charger|Ladder
Name something that makes a room smell good.|Home|Air freshener|Flowers|Candles|Perfume|Cleaning products
Name something people do before taking a photograph.|Everyday Life|Smile|Pose|Fix their hair|Check lighting|Move closer
Name something people save money for.|Money|House|Car|Holiday|Education|Emergency
`.trim().split("\n").map(line=>{const [prompt,category,...answers]=line.split("|");return {gameType:"top_answers" as const,prompt,answer:null,category,metadata:{answers:answers.map((text,index)=>({text,points:points[index],aliases:[]}))}}}).slice(0,90);

const mojiRows=`
🐈⬛🦸|Black Panther|Movie|A Wakandan superhero
❄️👭⛄|Frozen|Movie|Two royal sisters and a snowman
🦈🌊|Jaws|Movie|A dangerous ocean predator
🎈🏠⬆️|Up|Movie|A flying house adventure
🚗🏁|Cars|Movie|Animated racing vehicles
🤠🧸🚀|Toy Story|Movie|Toys come alive
🦇👨|Batman|Movie|A masked hero from Gotham
🦸‍♂️🔵🔴|Superman|Movie|A hero from another planet
🦸‍♀️🦸‍♂️🌍|The Avengers|Movie|Heroes assemble to save the world
🦖🏞️|Jurassic Park|Movie|Dinosaurs return in a theme park
💊🕶️💻|The Matrix|Movie|Choose between two pills
👽📞🏠|E.T.|Movie|An alien wants to phone home
🥊🏃|Rocky|Movie|A boxer trains for a major fight
👨‍👨‍👦🌹|The Godfather|Movie|A powerful crime family
🟢👹👸|Shrek|Movie|An ogre rescues a princess
💀🎸🌼|Coco|Movie|Music and the land of the dead
🌊🛶👧|Moana|Movie|A young voyager crosses the ocean
⚔️🏟️|Gladiator|Movie|A warrior fights in an arena
🏝️📦🏐|Cast Away|Movie|A survivor and a volleyball
🦍🏙️|King Kong|Movie|A giant ape reaches the city
🐒🌍|Planet of the Apes|Movie|Apes rule the world
🥋👦|The Karate Kid|Movie|A student learns martial arts
👧👧📓|Mean Girls|Movie|A high-school popularity battle
📓❤️|The Notebook|Movie|A romantic story remembered in writing
🍻🌃🤕|The Hangover|Movie|Friends forget a wild night
🐺💰🏢|The Wolf of Wall Street|Movie|A wealthy stockbroker
👥📘💻|The Social Network|Movie|The creation of a famous website
🏃‍♂️😊|The Pursuit of Happyness|Movie|A father chases a better life
🇮🇳🐶💰|Slumdog Millionaire|Movie|A game show changes a young man's life
🚗💨😡|Fast and Furious|Movie|Cars family and action
🕵️‍♂️💣❌|Mission Impossible|Movie|A spy accepts dangerous missions
👨🏿‍💼👽|Men in Black|Movie|Agents monitor aliens
👸🌹🦁|Beauty and the Beast|Movie|A cursed prince and a magical rose
🧜‍♀️🌊|The Little Mermaid|Movie|A mermaid dreams of life on land
👠🎃👸|Cinderella|Movie|A glass slipper and a royal ball
🍎👸7️⃣|Snow White and the Seven Dwarfs|Movie|A princess and seven miners
🐀👨‍🍳|Ratatouille|Movie|A rat becomes a chef
👨‍👩‍👧‍👦🦸|The Incredibles|Movie|A family with superpowers
🐼🥋|Kung Fu Panda|Movie|A panda becomes a warrior
🦁🦓🦒🏝️|Madagascar|Movie|Zoo animals reach an island
🧊🐿️🥜|Ice Age|Movie|Animals survive a frozen world
🏴‍☠️🌊🏝️|Pirates of the Caribbean|Movie|Pirates curses and the sea
⚡👓🪄|Harry Potter|Movie|A young wizard attends magic school
💍🌋🧙|The Lord of the Rings|Movie|A dangerous ring must be destroyed
🏹🔥🎮|The Hunger Games|Movie|A deadly televised competition
🧛❤️🐺|Twilight|Movie|A vampire romance and a werewolf
🎶⛰️👨‍👩‍👧‍👦|The Sound of Music|Movie|A singing family in the mountains
🏫🎸|School of Rock|Movie|A substitute teacher starts a band
👦🍫🏭|Charlie and the Chocolate Factory|Movie|A child tours a magical factory
🌪️🏠👠|The Wizard of Oz|Movie|A storm carries a girl to a magical land
👮‍♂️👶|Kindergarten Cop|Movie|A police officer teaches young children
👰‍♀️👰‍♀️💀|Corpse Bride|Movie|A groom accidentally marries the dead
👁️🐅|Eye of the Tiger|Song|A famous motivational rock anthem
💃🌙|Dancing in the Moonlight|Song|Moving to music after dark
🛣️🔥|Life Is a Highway|Song|Life compared with a road
👧🔥|Girl on Fire|Song|An Alicia Keys anthem
💎🌌|Diamonds|Song|Shining brightly in the sky
☀️🌻|Here Comes the Sun|Song|Sunshine finally arrives
🏨🌴|Hotel California|Song|A famous hotel in a western state
🟣🌧️|Purple Rain|Song|A Prince classic
🙋‍♀️❤️|I Will Always Love You|Song|A powerful promise of lasting love
🕺👑|Smooth Criminal|Song|A stylish lawbreaker
👶🔙|Baby Got Back|Song|A famous hip-hop title
📞🤙|Call Me Maybe|Song|A phone number offered to a crush
👋👋👋|Bye Bye Bye|Song|A repeated farewell
💔🏨|Heartbreak Hotel|Song|A lonely place for broken hearts
🌍👩|Man in the Mirror|Song|Change begins with your reflection
🚶‍♀️☀️|Walking on Sunshine|Song|Feeling extremely happy
🖤🪄👩|Black Magic Woman|Song|A mysterious magical woman
🏃‍♂️🌎|Run the World Girls|Song|A Beyoncé anthem about women
💵💵💵|Money Money Money|Song|An ABBA song about wealth
🧊🧊👶|Ice Ice Baby|Song|A cold repeated title
🔒❤️|Locked Out of Heaven|Song|Unable to enter paradise
🧨🧨|Firework|Song|A Katy Perry anthem
🐎🏘️🛣️|Old Town Road|Song|A horse ride on a country road
7️⃣💍|7 Rings|Song|An Ariana Grande title
🙈🙉🙊|Say My Name|Song|A Destiny's Child demand
📸✨|Picture Perfect|Song|Ready for a photograph
🌧️☔|Set Fire to the Rain|Song|Two opposite elements
👑❤️|Queen of My Heart|Song|Royal romance
🌊👀|Ocean Eyes|Song|A Billie Eilish title
🩸💧|Blood Sweat and Tears|Song|Three signs of hard work
⛓️🎶|Unchained Melody|Song|A classic romantic melody
🌉💧|Bridge Over Troubled Water|Song|Support through hard times
🚫😭|No Woman No Cry|Song|Bob Marley offers comfort
1️⃣❤️|One Love|Song|A Bob Marley unity anthem
🕛🌃|Midnight City|Song|A city late at night
🏠🌅|House of the Rising Sun|Song|A famous song about a house in New Orleans
🌹👄|Kiss from a Rose|Song|A Seal hit involving a flower
🚀👨|Rocket Man|Song|A space traveller in an Elton John song
🧍‍♂️🌧️|Standing in the Rain|Song|Remaining outside in wet weather
❤️📖|Love Story|Song|A Taylor Swift romantic title
👎🩸|Bad Blood|Song|A feud described through the body
🐦✋2️⃣|A Bird in the Hand|Phrase|Something owned is worth more than possibility
🍎📅👨‍⚕️|An Apple a Day Keeps the Doctor Away|Phrase|Fruit as daily medicine
🐊😭|Crocodile Tears|Phrase|Insincere sadness
😎🥒|Cool as a Cucumber|Phrase|Extremely calm
🐝🧎|The Bee's Knees|Phrase|Something considered excellent
🐘🏠|The Elephant in the Room|Phrase|An obvious issue nobody discusses
🐷✈️|When Pigs Fly|Phrase|Something that will never happen
🍰🧩|Piece of Cake|Phrase|Something very easy
💰🌳|Money Does Not Grow on Trees|Phrase|Resources are limited
🛢️🔥|Add Fuel to the Fire|Phrase|Make a bad situation worse
🫘🤫|Spill the Beans|Phrase|Reveal a secret
🦵💥|Break a Leg|Phrase|A theatrical wish for good luck
📚🐛|Bookworm|Phrase|Someone who loves reading
🦋🫄|Butterflies in My Stomach|Phrase|Feeling nervous
2️⃣🐦1️⃣🪨|Kill Two Birds with One Stone|Phrase|Solve two problems at once
🌙1️⃣🔵|Once in a Blue Moon|Phrase|Something that happens rarely
🐴👄|Straight from the Horse's Mouth|Phrase|Information from the original source
⏰✈️|Time Flies|Phrase|Hours seem to pass quickly
🙈❤️|Love Is Blind|Phrase|Affection overlooks faults
🧠🍽️|Food for Thought|Phrase|Something worth considering
🌊🐟|Plenty of Fish in the Sea|Phrase|There are many possible partners
👂🎶|Music to My Ears|Phrase|Very welcome news
🤐🔒|My Lips Are Sealed|Phrase|I will keep the secret
🧱⬆️|Hit a Wall|Phrase|Reach a point where progress stops
🪙2️⃣➡️|Two Sides of the Same Coin|Phrase|Closely related opposites
🌉➡️|Cross That Bridge When We Come to It|Phrase|Handle a problem later
🌾📍|Needle in a Haystack|Phrase|Something extremely hard to find
🐕📅|Dog Days|Phrase|A very hot period
🌧️✨|Every Cloud Has a Silver Lining|Phrase|Something positive exists in hardship
🥚🧺1️⃣|Do Not Put All Your Eggs in One Basket|Phrase|Do not risk everything in one place
🔥👅|Tongue of Fire|Phrase|Powerful or heated speech
👀👀|See Eye to Eye|Phrase|Agree completely
🦶🧊|Cold Feet|Phrase|Sudden nervousness before a decision
🪵👊|Knock on Wood|Phrase|A gesture hoping luck continues
🔨📍|Hit the Nail on the Head|Phrase|Describe something exactly
🐈📤💼|Let the Cat Out of the Bag|Phrase|Accidentally reveal a secret
🛏️🥔|Couch Potato|Phrase|Someone who watches television all day
🔥💧|Out of the Frying Pan into the Fire|Phrase|Move from bad to worse
🦷🦷|Fight Tooth and Nail|Phrase|Fight with maximum effort
🌙🔥🕯️|Burn the Midnight Oil|Phrase|Work very late
👋🧊|Break the Ice|Phrase|Make people feel comfortable
🇿🇦🏛️|Pretoria|Place|South Africa's administrative capital
🏔️🇿🇦|Cape Town|Place|A South African city beneath a flat mountain
🏙️💰🇿🇦|Johannesburg|Place|South Africa's city of gold
🌊🏄🇿🇦|Durban|Place|A warm coastal South African city
🌉🌁|San Francisco|Place|An American city with a famous red bridge
🎰🏜️|Las Vegas|Place|A desert city known for casinos
🗿🌊|Easter Island|Place|A remote island with giant stone heads
🐪🔺|Egypt|Place|A country famous for pyramids
🦘🌏|Australia|Place|A country associated with kangaroos
🍁🏒|Canada|Place|A maple leaf and ice hockey
🍣🗻|Japan|Place|Sushi and Mount Fuji
🍕👢|Italy|Place|A boot-shaped country famous for pizza
🐂💃|Spain|Place|Bullfighting and flamenco
🕌🎈|Turkey|Place|Mosques and Cappadocia balloons
☘️🌧️|Ireland|Place|A green island associated with shamrocks
🧀⌚|Switzerland|Place|A country known for cheese and watches
🦁🏃🇰🇪|Kenya|Place|East African safaris and runners
🏜️🏙️|Dubai|Place|A luxury city rising from the desert
🗼🍣🏙️|Tokyo|Place|A huge Japanese capital
☕🌧️👑|London|Place|Tea rain and royalty
🗿☀️|Mexico|Place|Ancient ruins and bright sunshine
⚽🎭🇧🇷|Brazil|Place|Football carnival and South America
🐘🌶️🇹🇭|Thailand|Place|Elephants spicy food and beaches
🧊🌋|Iceland|Place|Glaciers and volcanoes
🏰🍺🇩🇪|Germany|Place|Castles beer and central Europe
🏛️🫒🇬🇷|Greece|Place|Ancient temples and olives
🌷🚲|Amsterdam|Place|Tulips bicycles and canals
🕷️🕸️🦸|Spider-Man|Character|A web-slinging superhero
🦇🌃🦸|Batman|Character|Gotham's dark knight
👓⚡🧙|Harry Potter|Character|A young wizard with a lightning scar
🟢👹|Shrek|Character|A green ogre
🐭🔴⚫|Mickey Mouse|Character|A famous cartoon mouse
🍯🐻|Winnie the Pooh|Character|A bear who loves honey
⚡🔨|Thor|Character|A hero with a powerful hammer
🟢💪|The Hulk|Character|A giant green superhero
🤖🚗|Optimus Prime|Character|A transforming robot leader
👸❄️|Elsa|Character|A queen with ice powers
🧽👖|SpongeBob SquarePants|Character|A yellow sea sponge
🐢🥷|Teenage Mutant Ninja Turtles|Character|Four martial-arts reptiles
👻🍴|Pac-Man|Character|A game character who eats dots
🎮🔧👨|Mario|Character|A video-game plumber
🔵🦔💨|Sonic the Hedgehog|Character|A very fast blue character
🧞‍♂️🪔|The Genie|Character|A magical character from a lamp
🤠🧸|Woody|Character|A cowboy toy
🚀🧑‍🚀|Buzz Lightyear|Character|A space ranger toy
🃏😈|The Joker|Character|Batman's laughing enemy
👑🦁|Simba|Character|The young lion king
`.trim().split("\n").map(line=>{const [prompt,answer,category,hint]=line.split("|");return {gameType:"moji" as const,prompt,answer,category,metadata:{hint,aliases:[]}}}).slice(0,180);

const countries:Array<[string,string,string,string]>=[
  ["France","Paris","Euro","Europe"],["Germany","Berlin","Euro","Europe"],["Italy","Rome","Euro","Europe"],["Spain","Madrid","Euro","Europe"],["Portugal","Lisbon","Euro","Europe"],
  ["United Kingdom","London","Pound sterling","Europe"],["Ireland","Dublin","Euro","Europe"],["Norway","Oslo","Norwegian krone","Europe"],["Sweden","Stockholm","Swedish krona","Europe"],["Finland","Helsinki","Euro","Europe"],
  ["Denmark","Copenhagen","Danish krone","Europe"],["Poland","Warsaw","Zloty","Europe"],["Greece","Athens","Euro","Europe"],["Hungary","Budapest","Forint","Europe"],["Austria","Vienna","Euro","Europe"],
  ["Switzerland","Bern","Swiss franc","Europe"],["Netherlands","Amsterdam","Euro","Europe"],["Belgium","Brussels","Euro","Europe"],["Romania","Bucharest","Romanian leu","Europe"],["Czechia","Prague","Czech koruna","Europe"],
  ["United States","Washington DC","US dollar","North America"],["Canada","Ottawa","Canadian dollar","North America"],["Mexico","Mexico City","Mexican peso","North America"],["Brazil","Brasilia","Brazilian real","South America"],["Argentina","Buenos Aires","Argentine peso","South America"],
  ["Chile","Santiago","Chilean peso","South America"],["Colombia","Bogota","Colombian peso","South America"],["Peru","Lima","Sol","South America"],["Jamaica","Kingston","Jamaican dollar","North America"],["Cuba","Havana","Cuban peso","North America"],
  ["Kenya","Nairobi","Kenyan shilling","Africa"],["Nigeria","Abuja","Naira","Africa"],["Ghana","Accra","Cedi","Africa"],["Egypt","Cairo","Egyptian pound","Africa"],["Morocco","Rabat","Moroccan dirham","Africa"],
  ["Ethiopia","Addis Ababa","Birr","Africa"],["Tanzania","Dodoma","Tanzanian shilling","Africa"],["Uganda","Kampala","Ugandan shilling","Africa"],["Botswana","Gaborone","Pula","Africa"],["Namibia","Windhoek","Namibian dollar","Africa"],
  ["Zambia","Lusaka","Zambian kwacha","Africa"],["Mozambique","Maputo","Metical","Africa"],["Angola","Luanda","Kwanza","Africa"],["India","New Delhi","Indian rupee","Asia"],["China","Beijing","Renminbi","Asia"],
  ["Japan","Tokyo","Yen","Asia"],["South Korea","Seoul","Won","Asia"],["Thailand","Bangkok","Baht","Asia"],["Indonesia","Jakarta","Rupiah","Asia"],["Philippines","Manila","Philippine peso","Asia"],
];

const countryRapid:BankCard[]=countries.flatMap(([country,capital,currency,continent])=>[
  {gameType:"rapid_fire" as const,prompt:`Which city is the capital of ${country}?`,answer:capital,category:"Geography",metadata:{aliases:[]}},
  {gameType:"rapid_fire" as const,prompt:`What currency is used in ${country}?`,answer:currency,category:"Geography",metadata:{aliases:[]}},
  {gameType:"rapid_fire" as const,prompt:`On which continent is ${country}?`,answer:continent,category:"Geography",metadata:{aliases:[]}},
]);

const factRows=`
What is the largest planet in our solar system?|Jupiter|Science
What is the closest planet to the Sun?|Mercury|Science
Which planet is famous for its rings?|Saturn|Science
What star is at the centre of our solar system?|The Sun|Science
What force pulls objects toward Earth?|Gravity|Science
What gas do plants release during photosynthesis?|Oxygen|Science
What gas do plants absorb during photosynthesis?|Carbon dioxide|Science
What is H2O commonly called?|Water|Science
How many bones are in the adult human body?|206|Science
Which organ pumps blood through the body?|Heart|Science
Which organs are mainly used for breathing?|Lungs|Science
What is the largest organ of the human body?|Skin|Science
Which blood cells help fight infection?|White blood cells|Science
What part of a plant absorbs water from soil?|Roots|Science
What is the process by which plants make food?|Photosynthesis|Science
What is the boiling point of water in Celsius?|100 degrees|Science
What is the hardest natural substance?|Diamond|Science
What instrument measures temperature?|Thermometer|Science
What instrument is used to view tiny objects?|Microscope|Science
Which animal changes from a caterpillar?|Butterfly|Animals
What is a baby dog called?|Puppy|Animals
What is a baby cat called?|Kitten|Animals
What is a group of lions called?|Pride|Animals
What is the fastest land animal?|Cheetah|Animals
Which mammal can truly fly?|Bat|Animals
What is the largest animal on Earth?|Blue whale|Animals
Which bird cannot fly and lives in Antarctica?|Penguin|Animals
Which animal is known for black and white stripes?|Zebra|Animals
What do pandas mainly eat?|Bamboo|Animals
How many legs does a spider have?|8|Animals
How many hearts does an octopus have?|3|Animals
What is a male chicken called?|Rooster|Animals
What is a female deer called?|Doe|Animals
Which animal carries its baby in a pouch?|Kangaroo|Animals
What is the tallest mountain in the world?|Mount Everest|Geography
What is the longest river in Africa?|Nile|Geography
What is the largest hot desert in the world?|Sahara Desert|Geography
Which ocean lies east of South Africa?|Indian Ocean|South Africa
Which ocean lies west of South Africa?|Atlantic Ocean|South Africa
What is the legislative capital of South Africa?|Cape Town|South Africa
What is the judicial capital of South Africa?|Bloemfontein|South Africa
Which South African city is called the City of Gold?|Johannesburg|South Africa
Which mountain overlooks Cape Town?|Table Mountain|South Africa
Which South African province contains Durban?|KwaZulu-Natal|South Africa
Which South African province contains Polokwane?|Limpopo|South Africa
What are South Africa's national rugby team called?|Springboks|South Africa
What is South Africa's national flower?|King protea|South Africa
Who was South Africa's first democratically elected president?|Nelson Mandela|South Africa
On what date is Freedom Day celebrated?|27 April|South Africa
In what year was South Africa's first democratic election?|1994|South Africa
How many players are on a football team on the field?|11|Sport
How many points is a rugby try worth?|5|Sport
Which sport uses a bat wickets and a ball?|Cricket|Sport
In which sport would you perform a slam dunk?|Basketball|Sport
Which sport is played at Wimbledon?|Tennis|Sport
How many rings are on the Olympic symbol?|5|Sport
What colour card sends a football player off?|Red|Sport
How many holes are in a standard golf round?|18|Sport
Which chess piece moves in an L shape?|Knight|Games
How many squares are on a chessboard?|64|Games
What is the highest possible score with one dart?|60|Games
Which board game includes Boardwalk and Park Place?|Monopoly|Games
How many dots are on a standard pair of dice?|42|Games
Which instrument usually has six strings?|Guitar|Music
Which singer is known as the King of Pop?|Michael Jackson|Music
Which group sang Dancing Queen?|ABBA|Music
Which South African music style is associated with log drums?|Amapiano|Music
What musical symbol means silence?|Rest|Music
How many keys are on a standard piano?|88|Music
What do we call the speed of a song?|Tempo|Music
Who sings the song Umbrella?|Rihanna|Music
Who lives in a pineapple under the sea?|SpongeBob SquarePants|Entertainment
What is Superman's home planet?|Krypton|Entertainment
What is Batman's city called?|Gotham City|Entertainment
What colour is Shrek?|Green|Entertainment
What is the name of Simba's father?|Mufasa|Entertainment
Which princess loses a glass slipper?|Cinderella|Entertainment
Which superhero carries a hammer called Mjolnir?|Thor|Entertainment
What school does Harry Potter attend?|Hogwarts|Entertainment
What is the cowboy's name in Toy Story?|Woody|Entertainment
`.trim().split("\n").map(line=>{const [prompt,answer,category]=line.split("|");return {gameType:"rapid_fire" as const,prompt,answer,category,metadata:{aliases:[]}}});

const multiplicationPairs:Array<[number,number]>=[[2,7],[3,8],[4,6],[5,9],[6,7],[7,7],[8,8],[9,9],[11,4],[12,3],[3,12],[4,11],[6,9],[7,8],[8,9],[12,6],[11,7],[12,8],[9,12],[11,11],[12,12],[6,6],[7,9],[8,12],[4,12]];
const additionPairs:Array<[number,number]>=[[17,8],[24,19],[35,16],[42,29],[58,17],[63,28],[74,19],[86,15],[47,36],[39,44],[125,25],[150,75],[220,80],[99,22],[46,27],[68,24],[57,38],[83,16],[92,18],[144,56],[250,50],[175,25],[320,180],[49,49],[76,34]];
const mathsRapid:BankCard[]=[
  ...multiplicationPairs.map(([a,b])=>({gameType:"rapid_fire" as const,prompt:`What is ${a} × ${b}?`,answer:String(a*b),category:"Maths",metadata:{aliases:[]}})),
  ...additionPairs.map(([a,b])=>({gameType:"rapid_fire" as const,prompt:`What is ${a} + ${b}?`,answer:String(a+b),category:"Maths",metadata:{aliases:[]}})),
];

const rapidRows:BankCard[]=[...countryRapid,...factRows,...mathsRapid];
const crowdRows:BankCard[]=[
  ...rapidRows.slice(0,70).map(card=>({...card,gameType:"crowd" as const,category:`Crowd · ${card.category}`})),
  ...mojiRows.slice(0,70).map(card=>({...card,gameType:"crowd" as const,category:`Crowd · ${card.category}`})),
];

export const EXPANSION_BANK_V2:BankCard[]=[...topRows,...mojiRows,...rapidRows,...crowdRows];
