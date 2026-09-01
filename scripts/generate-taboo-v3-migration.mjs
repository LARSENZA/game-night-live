import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArray(file, exportName) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const marker = `export const ${exportName}`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Cannot find ${exportName} in ${file}`);
  const declaration = source.slice(start);
  const open = declaration.indexOf("[");
  const end = declaration.indexOf("] as const;");
  if (open < 0 || end < 0) throw new Error(`Cannot parse ${exportName} in ${file}`);
  return Function(`return ${declaration.slice(open, end + 1)}`)();
}

const previous = parseArray("lib/taboo-bank.ts", "TABOO_BANK");
const replacements = parseArray("lib/taboo-bank-v3.ts", "TABOO_V3_REPLACEMENTS");
const bank = [...previous.slice(0, 55), ...replacements];

if (previous.length !== 220) throw new Error(`Expected 220 previous cards, found ${previous.length}`);
if (replacements.length !== 165) throw new Error(`Expected 165 replacement cards, found ${replacements.length}`);
if (bank.length !== 220) throw new Error(`Expected 220 final cards, found ${bank.length}`);

const prompts = new Set();
for (const [prompt, category, taboo] of bank) {
  const promptKey = String(prompt).trim().toLowerCase();
  const prohibited = taboo.map((word) => String(word).trim().toLowerCase());
  if (!promptKey || !String(category).trim()) throw new Error(`Missing prompt/category: ${prompt}`);
  if (prompts.has(promptKey)) throw new Error(`Duplicate Taboo prompt: ${prompt}`);
  if (taboo.length !== 5 || prohibited.some((word) => !word) || new Set(prohibited).size !== 5 || prohibited.includes(promptKey))
    throw new Error(`${prompt} must have exactly five unique prohibited words.`);
  prompts.add(promptKey);
}

const escapeSql = (value) => String(value).replaceAll("'", "''");
const values = bank.map(([prompt, category, taboo]) =>
  `  ('${escapeSql(prompt)}', '${escapeSql(category)}', '${escapeSql(JSON.stringify({ taboo }))}')`,
).join(",\n");

const migration = `-- Taboo bank v3: retain 55 strong cards and replace 165 cards (75%).
-- Room-specific custom cards and historical records are preserved.

DROP TABLE IF EXISTS \`_taboo_v3_seed\`;
--> statement-breakpoint
CREATE TABLE \`_taboo_v3_seed\` (\`prompt\` text PRIMARY KEY NOT NULL, \`category\` text NOT NULL, \`metadata\` text NOT NULL);
--> statement-breakpoint
INSERT INTO \`_taboo_v3_seed\` (\`prompt\`, \`category\`, \`metadata\`) VALUES
${values};
--> statement-breakpoint
UPDATE \`game_content\` SET \`is_active\` = 0 WHERE \`game_type\` = 'taboo' AND \`owner_room_id\` IS NULL;
--> statement-breakpoint
UPDATE \`game_content\`
SET
  \`category\` = (SELECT seed.\`category\` FROM \`_taboo_v3_seed\` seed WHERE lower(trim(seed.\`prompt\`)) = lower(trim(\`game_content\`.\`prompt\`))),
  \`metadata\` = (SELECT seed.\`metadata\` FROM \`_taboo_v3_seed\` seed WHERE lower(trim(seed.\`prompt\`)) = lower(trim(\`game_content\`.\`prompt\`))),
  \`answer\` = NULL,
  \`is_active\` = 1
WHERE \`game_type\` = 'taboo' AND \`owner_room_id\` IS NULL
  AND \`id\` = (SELECT min(existing.\`id\`) FROM \`game_content\` existing WHERE existing.\`game_type\` = 'taboo' AND existing.\`owner_room_id\` IS NULL AND lower(trim(existing.\`prompt\`)) = lower(trim(\`game_content\`.\`prompt\`)))
  AND EXISTS (SELECT 1 FROM \`_taboo_v3_seed\` seed WHERE lower(trim(seed.\`prompt\`)) = lower(trim(\`game_content\`.\`prompt\`)));
--> statement-breakpoint
INSERT INTO \`game_content\` (\`game_type\`, \`prompt\`, \`answer\`, \`category\`, \`metadata\`, \`is_active\`, \`owner_room_id\`)
SELECT 'taboo', seed.\`prompt\`, NULL, seed.\`category\`, seed.\`metadata\`, 1, NULL
FROM \`_taboo_v3_seed\` seed
WHERE NOT EXISTS (SELECT 1 FROM \`game_content\` existing WHERE existing.\`game_type\` = 'taboo' AND existing.\`owner_room_id\` IS NULL AND lower(trim(existing.\`prompt\`)) = lower(trim(seed.\`prompt\`)));
--> statement-breakpoint
DROP TABLE \`_taboo_v3_seed\`;
`;

fs.writeFileSync(path.join(root, "drizzle/0008_taboo_bank_v3.sql"), migration, "utf8");
console.log(`Validated ${bank.length} cards: 55 retained, ${replacements.length} replaced.`);
