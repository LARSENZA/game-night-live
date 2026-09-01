type CrowdCard = {
  gameType: "crowd";
  prompt: string;
  answer: string;
  category: string;
  metadata: { aliases: string[] };
};

const card = (category: string, prompt: string, answer: string, aliases: string[] = []): CrowdCard => ({
  gameType: "crowd",
  prompt,
  answer,
  category,
  metadata: { aliases },
});

const rows = (source: string): CrowdCard[] => source.trim().split("\n").map(line => {
  const [category, prompt, answer, aliasText = ""] = line.split("|");
  return card(category, prompt, answer, aliasText ? aliasText.split(";") : []);
});

const QUICK_QUESTIONS = rows(`
General Knowledge|How many days are in one week?|7|seven
General Knowledge|How many months are in one year?|12|twelve
General Knowledge|Which month comes before December?|November
General Knowledge|How many hours are in one day?|24|twenty-four
General Knowledge|What colour do red and yellow make?|Orange
General Knowledge|What colour do blue and yellow make?|Green
General Knowledge|What shape has three sides?|Triangle
General Knowledge|What shape has four equal sides?|Square
General Knowledge|How many wheels does a standard bicycle have?|2|two
General Knowledge|Which hand on a clock usually shows the minutes?|The long hand|long hand
General Knowledge|What do you call water that falls from clouds?|Rain
General Knowledge|Which season comes after winter?|Spring
General Knowledge|Which meal is usually eaten in the morning?|Breakfast
General Knowledge|What device do you use to call someone?|A phone|phone;cellphone;mobile phone
General Knowledge|Which room in a house is mainly used for cooking?|The kitchen|kitchen
General Knowledge|What do you use to unlock a door?|A key|key
General Knowledge|What do you wear on your feet before shoes?|Socks
General Knowledge|Which traffic-light colour means stop?|Red
General Knowledge|Which traffic-light colour means go?|Green
General Knowledge|What do you call a baby dog?|A puppy|puppy
Animals|What do you call a baby cat?|A kitten|kitten
Animals|Which animal says moo?|A cow|cow
Animals|Which animal says neigh?|A horse|horse
Animals|Which animal is famous for black and white stripes?|A zebra|zebra
Animals|Which animal carries its baby in a pouch?|A kangaroo|kangaroo
Animals|Which animal has a trunk?|An elephant|elephant
Animals|Which bird is unable to fly and lives in Antarctica?|A penguin|penguin
Animals|What is the fastest land animal?|The cheetah|cheetah
Animals|Which animal is known for changing its colour?|A chameleon|chameleon
Animals|How many legs does a spider have?|8|eight
Science|Which star gives Earth light and heat?|The Sun|Sun
Science|What gas do humans breathe in to survive?|Oxygen
Science|Which organ helps you think?|The brain|brain
Science|Which organ pumps blood through your body?|The heart|heart
Science|Which sense do you use with your ears?|Hearing
Science|What do plants absorb through their roots?|Water
Science|What is frozen water called?|Ice
Science|What is water vapour: solid, liquid or gas?|Gas|a gas
Science|Which planet do humans live on?|Earth
Science|What force keeps us on the ground?|Gravity
Geography|What is the largest continent?|Asia
Geography|Which continent is South Africa in?|Africa
Geography|What is the capital of France?|Paris
Geography|What is the capital of Italy?|Rome
Geography|What is the capital of Japan?|Tokyo
Geography|Which country is famous for the pyramids of Giza?|Egypt
Geography|Which ocean is the largest?|The Pacific Ocean|Pacific;Pacific Ocean
Geography|What imaginary line divides Earth into north and south?|The Equator|Equator
Geography|What direction is opposite to north?|South
Geography|What instrument helps you find direction?|A compass|compass
Language|What is the opposite of hot?|Cold
Language|What is the opposite of early?|Late
Language|What is the plural of foot?|Feet
Language|What is the plural of mouse?|Mice
Language|What is the past tense of go?|Went
Language|What letter comes after M?|N
Language|How many vowels are in the English alphabet?|5|five
Language|Which punctuation mark ends a question?|A question mark|question mark
Language|Complete the alphabet: X, Y, ...?|Z
Language|What is a word with the same meaning called?|A synonym|synonym
Sport|How many players does one football team have on the field?|11|eleven
Sport|Which sport uses a bat, ball and wickets?|Cricket
Sport|Which sport uses a racket and shuttlecock?|Badminton
Sport|In which sport would you perform a slam dunk?|Basketball
Sport|What colour card sends a football player off?|Red|red card
Sport|Which sport is played at Wimbledon?|Tennis
Sport|How many rings are on the Olympic symbol?|5|five
Sport|Which swimming stroke is named after an insect?|Butterfly|butterfly stroke
Music and Film|Which singer is known as the King of Pop?|Michael Jackson
Music and Film|Which film features a snowman named Olaf?|Frozen
Music and Film|What is the name of Simba's father in The Lion King?|Mufasa
Music and Film|Which superhero is also called the Dark Knight?|Batman
Music and Film|Which superhero carries a shield with a star?|Captain America
Music and Film|What musical instrument has black and white keys?|A piano|piano;keyboard
Music and Film|How many strings does a standard guitar have?|6|six
Music and Film|What do you call the person who directs an orchestra?|A conductor|conductor
Food|Which fruit is used to make guacamole?|Avocado
Food|Which vegetable can make your eyes water when cut?|Onion
Food|What food do bees make?|Honey
Food|What is the main ingredient in mashed potatoes?|Potatoes|potato
Food|Which drink is made by brewing tea leaves in hot water?|Tea
Food|What dairy product is commonly put on pizza?|Cheese
Food|Which fruit is yellow and curved?|Banana
Food|What is dried grape called?|A raisin|raisin
`);

const SOUTH_AFRICA = rows(`
South Africa|What is the currency of South Africa?|Rand|South African rand;ZAR
South Africa|How many provinces does South Africa have?|9|nine
South Africa|Which province is Johannesburg in?|Gauteng
South Africa|Which province is Cape Town in?|Western Cape|the Western Cape
South Africa|Which province is Durban in?|KwaZulu-Natal|KZN
South Africa|Which province is Polokwane in?|Limpopo
South Africa|Which province is Gqeberha in?|Eastern Cape|the Eastern Cape
South Africa|Which mountain overlooks Cape Town?|Table Mountain
South Africa|Which famous prison island lies near Cape Town?|Robben Island
South Africa|What is South Africa's national animal?|Springbok|the springbok
South Africa|What is South Africa's national flower?|King protea|the king protea;protea
South Africa|What is South Africa's national bird?|Blue crane|the blue crane
South Africa|What public holiday is celebrated on 24 September?|Heritage Day
South Africa|What public holiday is celebrated on 16 June?|Youth Day
South Africa|Which city is known as the City of Gold?|Johannesburg|Joburg
South Africa|What is the administrative capital of South Africa?|Pretoria
South Africa|What is the legislative capital of South Africa?|Cape Town
South Africa|Which ocean lies east of South Africa?|Indian Ocean|the Indian Ocean
South Africa|What is the nickname of South Africa's national rugby team?|The Springboks|Springboks
South Africa|Which South African leader became president in 1994?|Nelson Mandela|Mandela
`);

const PHRASES = rows(`
Complete the Phrase|Complete: A piece of ...?|Cake
Complete the Phrase|Complete: Better safe than ...?|Sorry
Complete the Phrase|Complete: Practice makes ...?|Perfect
Complete the Phrase|Complete: Time is ...?|Money
Complete the Phrase|Complete: Easy come, easy ...?|Go
Complete the Phrase|Complete: Actions speak louder than ...?|Words
Complete the Phrase|Complete: Two heads are better than ...?|One
Complete the Phrase|Complete: The early bird catches the ...?|Worm
Complete the Phrase|Complete: Don't judge a book by its ...?|Cover
Complete the Phrase|Complete: When it rains, it ...?|Pours
Complete the Phrase|Complete: No pain, no ...?|Gain
Complete the Phrase|Complete: All that glitters is not ...?|Gold
Complete the Phrase|Complete: Where there is smoke, there is ...?|Fire
Complete the Phrase|Complete: Curiosity killed the ...?|Cat
Complete the Phrase|Complete: The grass is always greener on the other ...?|Side
Complete the Phrase|Complete: A picture is worth a thousand ...?|Words
Complete the Phrase|Complete: Birds of a feather flock ...?|Together
Complete the Phrase|Complete: Too many cooks spoil the ...?|Broth
Complete the Phrase|Complete: You can't have your cake and eat it ...?|Too
Complete the Phrase|Complete: Every cloud has a silver ...?|Lining
`);

const SCRAMBLES = rows(`
Word Scramble|Unscramble: ELPPA|APPLE
Word Scramble|Unscramble: ANANAB|BANANA
Word Scramble|Unscramble: TAWER|WATER
Word Scramble|Unscramble: NOGRAE|ORANGE
Word Scramble|Unscramble: RITGE|TIGER
Word Scramble|Unscramble: OHEUS|HOUSE
Word Scramble|Unscramble: CIHRA|CHAIR
Word Scramble|Unscramble: ABLTE|TABLE
Word Scramble|Unscramble: LCSHOO|SCHOOL
Word Scramble|Unscramble: NFERID|FRIEND
Word Scramble|Unscramble: ICMSU|MUSIC
Word Scramble|Unscramble: OHNEP|PHONE
Word Scramble|Unscramble: ODKBO|BOOK
Word Scramble|Unscramble: PEHAPY|HAPPY
Word Scramble|Unscramble: TPLANE|PLANET
Word Scramble|Unscramble: CEFEOF|COFFEE
Word Scramble|Unscramble: NIGRUNN|RUNNING
Word Scramble|Unscramble: LFOBAOLT|FOOTBALL
Word Scramble|Unscramble: COMRPUTE|COMPUTER
Word Scramble|Unscramble: HCOCLOATE|CHOCOLATE
`);

const TRUE_FALSE = rows(`
True or False|True or false: The Sun is a star.|True
True or False|True or false: A triangle has four sides.|False
True or False|True or false: Penguins can naturally fly.|False
True or False|True or false: Water freezes at 0°C.|True
True or False|True or false: The Pacific is an ocean.|True
True or False|True or false: A decade has ten years.|True
True or False|True or false: Spiders have six legs.|False
True or False|True or false: Mars is known as the Red Planet.|True
True or False|True or false: An adult human normally has three lungs.|False
True or False|True or false: A square has four equal sides.|True
True or False|True or false: Johannesburg is in Gauteng.|True
True or False|True or false: South Africa has twelve provinces.|False
True or False|True or false: A violin is a string instrument.|True
True or False|True or false: The opposite of north is west.|False
True or False|True or false: A kilogram contains 1,000 grams.|True
True or False|True or false: An octagon has eight sides.|True
True or False|True or false: The Moon is a planet.|False
True or False|True or false: Bees make honey.|True
True or False|True or false: The capital of France is Rome.|False
True or False|True or false: Oxygen is needed for human breathing.|True
`);

const QUICK_MATH: CrowdCard[] = [
  ...Array.from({ length: 20 }, (_, index) => {
    const left = 12 + index * 3;
    const right = 5 + (index % 7);
    return card("Quick Maths", `What is ${left} + ${right}?`, String(left + right));
  }),
  ...Array.from({ length: 10 }, (_, index) => {
    const right = 4 + index;
    const answer = 15 + index * 2;
    return card("Quick Maths", `What is ${answer + right} − ${right}?`, String(answer));
  }),
  ...Array.from({ length: 10 }, (_, index) => {
    const left = 2 + (index % 9);
    const right = 3 + Math.floor(index / 2);
    return card("Quick Maths", `What is ${left} × ${right}?`, String(left * right));
  }),
];

export const CROWD_CLASH_BANK_V2: readonly CrowdCard[] = [
  ...QUICK_QUESTIONS,
  ...SOUTH_AFRICA,
  ...PHRASES,
  ...SCRAMBLES,
  ...TRUE_FALSE,
  ...QUICK_MATH,
];
