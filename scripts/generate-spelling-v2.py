from pathlib import Path
from collections import Counter
import gzip
import re

ROOT = Path(__file__).resolve().parents[1]
MIGRATION = ROOT / "drizzle/0004_global_word_banks.sql"

# Read only seed blocks whose INSERT selects the spelling game type.
source = MIGRATION.read_text(encoding="utf-8")
previous = []
seen = set()
blocks = re.findall(r"WITH seed\(prompt, category\) AS \(VALUES(.*?)\)\s*INSERT.*?SELECT 'spelling'", source, re.S)
for block in blocks:
    for prompt, category in re.findall(r"\('([^']+)', '(Easy|Medium|Hard)'\)", block):
        key = prompt.casefold()
        if key not in seen:
            previous.append((prompt, category))
            seen.add(key)
if len(previous) != 1000:
    raise RuntimeError(f"Expected 1,000 previous spelling words, found {len(previous)}")

# Keep exactly 25% of each difficulty profile (rounding to 250 total).
keep_counts = {"Easy": 139, "Medium": 89, "Hard": 22}
retained = []
for category, count in keep_counts.items():
    retained.extend([item for item in previous if item[1] == category][:count])

# High-value spellings are considered before corpus-ranked words. These are
# familiar words with silent letters, doubled consonants, vowel traps or
# British/South African variants.
priority = """
aisle answer awkward biscuit boundary breathe business ceiling cemetery choir
column cupboard debris discipline eighth environment exaggerate familiar
fascinating February foreign forty gauge grammar guarantee height immediately
independent interrupt island knowledge lightning leisure library marriage
medieval mischievous mortgage muscle neighbour noticeable occasion parallel
parliament persuade possession preferred pronunciation queue receive recommend
referred restaurant rhyme rhythm scissors separate sincerely stationery
stationary subtle successful surprise temperature thorough tongue twelfth vacuum
vegetable Wednesday weird yacht accommodation acquaintance amateur apparent
argument auxiliary bureaucracy camouflage Caribbean category chauffeur
colleague conscience conscious consensus convenience courteous criticism
definite desperate dictionary dilemma embarrass existence fluorescent government
harass hierarchy humorous hygiene jewellery liaison maintenance millennium
miniature necessary nuisance occurred occurrence perseverance personnel pneumonia
privilege questionnaire receipt relevant restaurant schedule silhouette supersede
threshold tomorrow unnecessary vengeance vulnerable archaeology arithmetic
asthma catastrophic choreography circumference collaboration colonel
communication compatibility conscientious entrepreneur extraordinary
handkerchief idiosyncrasy indispensable kaleidoscope manoeuvre miscellaneous
onomatopoeia pharmaceutical phenomenon pseudonym psychology reconnaissance
refrigerator responsibility schizophrenia simultaneously sophisticated
surveillance susceptibility tranquillity unequivocal
colour favourite behaviour centre theatre travelling cancelled defence licence
analyse apologise catalogue dialogue enrolment fulfilment organisation programme
recognise tyre
""".split()

old_keys = {word.casefold() for word, _ in previous}
blocked = set("""
debian ubuntu linux fortran python mozilla gnupg clang runtime boolean checksum
allocator superblock microcode firmware pathname localhost filesystem namespace
symlink ioctl errno argv ascii typedef struct enum malloc socket daemon distro
launchpad upstream patch diff commit merge module package copyright warranty
licensee contributor repository changelog readme config configure compile
installation directory command terminal script snapshot payload callback
frontend backend plugin semaphore mutex kernel buffer cache debug logging
this that with from have will would should could there their they them then than
into also been were when where which while using used user users file files
source public code data name such shall must your more other make work free
system value values option options function output input default
init decl exec stub dump crypt tiff meta byte oracle yahoo mesa
andres adrian alexander andrew benjamin christian christophe daniel dirk felix
frank franklin graham jeremy joey marc marco matthias mike murray nathan olivier
rene ryan samuel santiago stefan steven sven wang yang
""".split())

# Rank ordinary candidate words by how often they occur across locally
# installed English documentation, then require a lowercase Hunspell entry.
valid = set()
dictionary = Path("/usr/share/hunspell/en_US.dic")
for line in dictionary.read_text(encoding="utf-8", errors="ignore").splitlines()[1:]:
    word = line.split("/", 1)[0]
    if re.fullmatch(r"[a-z]{4,16}", word):
        valid.add(word)

frequency = Counter()
for path in Path("/usr/share/doc").rglob("*"):
    if not path.is_file() or path.stat().st_size > 2_000_000 or path.suffix not in ("", ".txt", ".md", ".html", ".gz"):
        continue
    try:
        text = gzip.open(path, "rt", errors="ignore").read() if path.suffix == ".gz" else path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        continue
    for raw in re.findall(r"[A-Za-z]{4,16}", text):
        word = raw.lower()
        if word in valid and word not in old_keys and word not in blocked:
            frequency[word] += 1

# Vocabulary already used elsewhere in Game Night ZA is a useful quality
# signal: it favours concrete, playable words over package names and jargon.
game_vocabulary = Counter()
for relative in ("lib/taboo-bank.ts", "lib/taboo-bank-v3.ts", "lib/expansion-bank-v2.ts", "lib/expansion-content.ts", "lib/default-content.ts"):
    text = (ROOT / relative).read_text(encoding="utf-8")
    for word in re.findall(r"[A-Za-z]{4,18}", text):
        word = word.lower()
        if word in valid and word not in old_keys and word not in blocked:
            game_vocabulary[word] += 1

def difficulty(word):
    hard_patterns = ("ough", "eigh", "ph", "rh", "mn", "sch", "gue", "que", "scious", "cious", "tionnaire")
    if len(word) >= 12 or any(pattern in word for pattern in hard_patterns):
        return "Hard"
    if len(word) >= 7:
        return "Medium"
    return "Easy"

ordered = []
candidate_seen = set()
for word in priority + [word for word, _ in game_vocabulary.most_common()] + [word for word, _ in frequency.most_common()]:
    word = word.strip().lower()
    if not re.fullmatch(r"[a-z]{4,18}", word) or word in old_keys or word in blocked or word in candidate_seen:
        continue
    candidate_seen.add(word)
    ordered.append(word)

new_counts = {"Easy": 416, "Medium": 266, "Hard": 68}
replacements = []
for category, count in new_counts.items():
    pool = [word for word in ordered if difficulty(word) == category]
    if len(pool) < count:
        raise RuntimeError(f"Not enough {category} candidates: need {count}, found {len(pool)}")
    replacements.extend((word, category) for word in pool[:count])

bank = retained + replacements
keys = [word.casefold() for word, _ in bank]
if len(bank) != 1000 or len(set(keys)) != 1000:
    raise RuntimeError("Final spelling bank must contain 1,000 unique words")
if len(set(keys) & (old_keys - {word.casefold() for word, _ in retained})):
    raise RuntimeError("A replacement accidentally reuses a retired word")

def quote(value):
    return value.replace("'", "''")

ts_rows = "\n".join(f'  ["{word}", "{category}"],' for word, category in bank)
(ROOT / "lib/spelling-bank-v2.ts").write_text(
    "export type SpellingWord = readonly [word: string, difficulty: \"Easy\" | \"Medium\" | \"Hard\"];\n\n"
    "// 1,000-word bank: 250 retained and 750 new words.\n"
    "export const SPELLING_BANK_V2: readonly SpellingWord[] = [\n"
    + ts_rows + "\n] as const;\n",
    encoding="utf-8",
)

sql_rows = ",\n".join(f"  ('{quote(word)}', '{category}')" for word, category in bank)
sql = f"""-- Spelling Bee bank v2: retain 250 words and replace 750 words (75%).
-- Custom room content and historical game records are preserved.

DROP TABLE IF EXISTS `_spelling_v2_seed`;
--> statement-breakpoint
CREATE TABLE `_spelling_v2_seed` (`prompt` text PRIMARY KEY NOT NULL, `category` text NOT NULL);
--> statement-breakpoint
INSERT INTO `_spelling_v2_seed` (`prompt`, `category`) VALUES
{sql_rows};
--> statement-breakpoint
UPDATE `game_content` SET `is_active` = 0 WHERE `game_type` = 'spelling' AND `owner_room_id` IS NULL;
--> statement-breakpoint
UPDATE `game_content`
SET
  `category` = (SELECT seed.`category` FROM `_spelling_v2_seed` seed WHERE lower(trim(seed.`prompt`)) = lower(trim(`game_content`.`prompt`))),
  `answer` = `prompt`, `metadata` = '{{}}', `is_active` = 1
WHERE `game_type` = 'spelling' AND `owner_room_id` IS NULL
  AND `id` = (SELECT min(existing.`id`) FROM `game_content` existing WHERE existing.`game_type` = 'spelling' AND existing.`owner_room_id` IS NULL AND lower(trim(existing.`prompt`)) = lower(trim(`game_content`.`prompt`)))
  AND EXISTS (SELECT 1 FROM `_spelling_v2_seed` seed WHERE lower(trim(seed.`prompt`)) = lower(trim(`game_content`.`prompt`)));
--> statement-breakpoint
INSERT INTO `game_content` (`game_type`,`prompt`,`answer`,`category`,`metadata`,`is_active`,`owner_room_id`)
SELECT 'spelling', seed.`prompt`, seed.`prompt`, seed.`category`, '{{}}', 1, NULL
FROM `_spelling_v2_seed` seed
WHERE NOT EXISTS (SELECT 1 FROM `game_content` existing WHERE existing.`game_type` = 'spelling' AND existing.`owner_room_id` IS NULL AND lower(trim(existing.`prompt`)) = lower(trim(seed.`prompt`)));
--> statement-breakpoint
DROP TABLE `_spelling_v2_seed`;
"""
(ROOT / "drizzle/0009_spelling_bank_v2.sql").write_text(sql, encoding="utf-8")
print(f"Validated {len(bank)} words: {len(retained)} retained, {len(replacements)} replaced.")
print("Final levels:", Counter(category for _, category in bank))
