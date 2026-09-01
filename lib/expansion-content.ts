type ExpansionCard = {gameType:"top_answers"|"moji"|"rapid_fire"|"crowd";prompt:string;answer:string|null;category:string;metadata:Record<string,unknown>};

const top = (prompt:string,category:string,answers:Array<[string,number,string[]?]>):ExpansionCard => ({
  gameType:"top_answers",prompt,answer:null,category,metadata:{answers:answers.map(([text,points,aliases=[]])=>({text,points,aliases}))},
});
const moji = (prompt:string,answer:string,category:string,hint:string,aliases:string[]=[]):ExpansionCard => ({
  gameType:"moji",prompt,answer,category,metadata:{hint,aliases},
});
const rapid = (prompt:string,answer:string,category:string,aliases:string[]=[]):ExpansionCard => ({
  gameType:"rapid_fire",prompt,answer,category,metadata:{aliases},
});
const crowd = (prompt:string,answer:string,category:string,aliases:string[]=[]):ExpansionCard => ({
  gameType:"crowd",prompt,answer,category,metadata:{aliases},
});

export const EXPANSION_CONTENT:ExpansionCard[] = [
  top("Name something people often forget when leaving home.","Everyday Life",[["Phone",30,["cellphone","mobile phone"]],["Keys",25],["Wallet",20,["purse"]],["Umbrella",15],["Lunch",10,["lunchbox","food"]]]),
  top("Name something people do immediately after waking up.","Everyday Life",[["Check their phone",30,["look at phone"]],["Use the bathroom",25,["go to the toilet"]],["Brush their teeth",20],["Drink water",15],["Make the bed",10]]),
  top("Name something you would find at a braai.","South Africa",[["Meat",30,["boerewors","steak"]],["Fire",25,["flames"]],["Charcoal",20,["coal"]],["Salad",15],["Friends",10,["family","people"]]]),
  top("Name a reason someone might be late.","Everyday Life",[["Traffic",30],["Overslept",25,["slept late"]],["Transport delay",20,["bus delay","train delay"]],["Could not find something",15],["Bad weather",10]]),
  top("Name something people take to the beach.","Travel",[["Towel",30],["Sunscreen",25,["sunblock"]],["Swimsuit",20,["bathing suit"]],["Umbrella",15,["beach umbrella"]],["Water",10,["drinks"]]]),
  top("Name something found in a classroom.","School",[["Desks",30,["tables"]],["Teacher",25],["Students",20,["learners"]],["Books",15],["Whiteboard",10,["blackboard","board"]]]),
  top("Name something people do at a wedding.","Celebrations",[["Dance",30],["Eat",25],["Take photos",20,["pictures"]],["Give speeches",15,["speech"]],["Cry",10]]),
  top("Name something you might order with a burger.","Food",[["Chips",30,["fries"]],["Cold drink",25,["soda"]],["Onion rings",20],["Milkshake",15],["Salad",10]]),
  top("Name something people complain about at work.","Work",[["Pay",30,["salary"]],["Boss",25,["manager"]],["Long hours",20,["hours"]],["Coworkers",15,["colleagues"]],["Meetings",10]]),
  top("Name something that can ruin a holiday.","Travel",[["Bad weather",30,["rain"]],["Lost luggage",25,["missing bags"]],["Illness",20,["getting sick"]],["Cancelled travel",15,["cancelled flight"]],["Running out of money",10,["no money"]]]),

  moji("🐍✈️","Snakes on a Plane","Movie","A dangerous flight"),
  moji("🦁👑","The Lion King","Movie","An animated royal story",["Lion King"]),
  moji("👻🔫","Ghostbusters","Movie","Who are you going to call?",["Ghost Busters"]),
  moji("🚢🧊💔","Titanic","Movie","A famous voyage ends in tragedy"),
  moji("🕷️👨","Spider-Man","Movie","A web-slinging hero",["Spiderman"]),
  moji("🏠👦","Home Alone","Movie","A child is left behind"),
  moji("🔍🐠","Finding Nemo","Movie","An ocean search"),
  moji("😈👗","The Devil Wears Prada","Movie","Fashion and a demanding boss",["Devil Wears Prada"]),
  moji("🌧️🐈🐕","Raining Cats and Dogs","Phrase","Very heavy weather",["It's raining cats and dogs"]),
  moji("⏰💰","Time is Money","Phrase","A phrase about valuable minutes"),
  moji("💔","Broken Heart","Phrase","Emotional pain",["Heartbreak"]),
  moji("👁️❤️🇿🇦","I Love South Africa","Place","A patriotic message",["I love SA"]),
  moji("🗽🍎","New York City","Place","The Big Apple",["New York"]),
  moji("🗼🥐","Paris","Place","A European capital known for its tower"),
  moji("🏜️🐫","Sahara Desert","Place","A vast African desert",["Sahara"]),
  moji("👑🕺","Dancing Queen","Song","An ABBA classic"),
  moji("☂️","Umbrella","Song","A Rihanna hit"),
  moji("🔥💍","Ring of Fire","Song","A Johnny Cash title"),
  moji("🛣️🏠","Take Me Home, Country Roads","Song","A road leading home",["Country Roads"]),
  moji("🙏➡️","Lean on Me","Song","A song about support"),

  rapid("What is the capital of France?","Paris","Geography"),
  rapid("Which planet is known as the Red Planet?","Mars","Science"),
  rapid("How many days are in a leap year?","366","General Knowledge",["three hundred and sixty-six"]),
  rapid("What colour do you get by mixing blue and yellow?","Green","General Knowledge"),
  rapid("Who painted the Mona Lisa?","Leonardo da Vinci","Art",["Da Vinci"]),
  rapid("What is the largest ocean on Earth?","Pacific Ocean","Geography",["Pacific"]),
  rapid("How many provinces does South Africa have?","9","South Africa",["nine"]),
  rapid("What is South Africa's currency?","Rand","South Africa",["South African Rand","ZAR"]),
  rapid("Which animal is called the king of the jungle?","Lion","Animals"),
  rapid("How many sides does an octagon have?","8","Maths",["eight"]),
  rapid("What gas do humans need to breathe?","Oxygen","Science"),
  rapid("Which sport uses a shuttlecock?","Badminton","Sport"),
  rapid("What is the freezing point of water in Celsius?","0 degrees","Science",["0","zero degrees"]),
  rapid("Which continent is Egypt in?","Africa","Geography"),
  rapid("What is the opposite of victory?","Defeat","Language",["loss"]),
  rapid("How many minutes are in one hour?","60","General Knowledge",["sixty"]),
  rapid("Which instrument has black and white keys?","Piano","Music",["keyboard"]),
  rapid("What is the tallest land animal?","Giraffe","Animals"),
  rapid("Which month comes after September?","October","General Knowledge"),
  rapid("What is five squared?","25","Maths",["twenty-five"]),

  crowd("🦁👑","The Lion King","Moji",["Lion King"]),
  crowd("What is the capital of Kenya?","Nairobi","Rapid Fire"),
  crowd("🌧️🐈🐕","Raining Cats and Dogs","Moji",["It's raining cats and dogs"]),
  crowd("Unscramble: NELSO NMADELA","Nelson Mandela","Word Scramble"),
  crowd("Complete the phrase: Better late than…","Never","Phrase"),
  crowd("How many provinces does South Africa have?","9","South Africa",["nine"]),
  crowd("🚢🧊💔","Titanic","Moji"),
  crowd("What colour do blue and red make?","Purple","General Knowledge"),
  crowd("Unscramble: FRIACA","Africa","Word Scramble"),
  crowd("What is 12 × 12?","144","Maths",["one hundred and forty-four"]),
];
