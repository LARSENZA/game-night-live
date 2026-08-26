import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let source = fs.readFileSync(path.join(root, "lib/taboo-bank.ts"), "utf8");

source = source
  .slice(source.indexOf("export const TABOO_BANK"))
  .replace(
    /^export const TABOO_BANK:\s*readonly TabooCard\[\]\s*=\s*/,
    "const TABOO_BANK = ",
  )
  .replace(/\]\s+as const;\s*$/, "];");

const bank = Function(`${source}; return TABOO_BANK;`)();
const prompts = new Set();
for (const [prompt, category, taboo] of bank) {
  const promptKey = String(prompt).trim().toLowerCase();
  const prohibited = taboo.map((word) => String(word).trim().toLowerCase());
  if (!promptKey || !String(category).trim())
    throw new Error("Every Taboo card needs a prompt and category.");
  if (prompts.has(promptKey))
    throw new Error(`Duplicate Taboo prompt: ${prompt}`);
  if (
    taboo.length !== 5 ||
    prohibited.some((word) => !word) ||
    new Set(prohibited).size !== 5 ||
    prohibited.includes(promptKey)
  )
    throw new Error(
      `${prompt} must have exactly five unique, non-empty prohibited words.`,
    );
  prompts.add(promptKey);
}

const escapeSql = (value) => String(value).replaceAll("'", "''");
const values = bank
  .map(
    ([prompt, category, taboo]) =>
      `  ('${escapeSql(prompt)}', '${escapeSql(category)}', '${escapeSql(
        JSON.stringify({ taboo }),
      )}')`,
  )
  .join(",\n");

const migration = `-- Replace dictionary-derived global Taboo cards with the curated Game Night ZA bank.
-- Custom room cards and historical round/content usage records are preserved.

DROP TABLE IF EXISTS \`_taboo_v2_seed\`;
--> statement-breakpoint
CREATE TABLE \`_taboo_v2_seed\` (
  \`prompt\` text PRIMARY KEY NOT NULL,
  \`category\` text NOT NULL,
  \`metadata\` text NOT NULL
);
--> statement-breakpoint
INSERT INTO \`_taboo_v2_seed\` (\`prompt\`, \`category\`, \`metadata\`) VALUES
${values};
--> statement-breakpoint
UPDATE \`game_content\`
SET \`is_active\` = 0
WHERE \`game_type\` = 'taboo' AND \`owner_room_id\` IS NULL;
--> statement-breakpoint
UPDATE \`game_content\`
SET
  \`prompt\` = (
    SELECT seed.\`prompt\` FROM \`_taboo_v2_seed\` seed
    WHERE lower(trim(seed.\`prompt\`)) = lower(trim(\`game_content\`.\`prompt\`))
  ),
  \`category\` = (
    SELECT seed.\`category\` FROM \`_taboo_v2_seed\` seed
    WHERE lower(trim(seed.\`prompt\`)) = lower(trim(\`game_content\`.\`prompt\`))
  ),
  \`metadata\` = (
    SELECT seed.\`metadata\` FROM \`_taboo_v2_seed\` seed
    WHERE lower(trim(seed.\`prompt\`)) = lower(trim(\`game_content\`.\`prompt\`))
  ),
  \`answer\` = NULL,
  \`is_active\` = 1
WHERE
  \`game_type\` = 'taboo'
  AND \`owner_room_id\` IS NULL
  AND \`id\` = (
    SELECT min(existing.\`id\`)
    FROM \`game_content\` existing
    WHERE
      existing.\`game_type\` = 'taboo'
      AND existing.\`owner_room_id\` IS NULL
      AND lower(trim(existing.\`prompt\`)) = lower(trim(\`game_content\`.\`prompt\`))
  )
  AND EXISTS (
    SELECT 1 FROM \`_taboo_v2_seed\` seed
    WHERE lower(trim(seed.\`prompt\`)) = lower(trim(\`game_content\`.\`prompt\`))
  );
--> statement-breakpoint
INSERT INTO \`game_content\` (
  \`game_type\`, \`prompt\`, \`answer\`, \`category\`, \`metadata\`, \`is_active\`, \`owner_room_id\`
)
SELECT 'taboo', seed.\`prompt\`, NULL, seed.\`category\`, seed.\`metadata\`, 1, NULL
FROM \`_taboo_v2_seed\` seed
WHERE NOT EXISTS (
  SELECT 1 FROM \`game_content\` existing
  WHERE
    existing.\`game_type\` = 'taboo'
    AND existing.\`owner_room_id\` IS NULL
    AND lower(trim(existing.\`prompt\`)) = lower(trim(seed.\`prompt\`))
);
--> statement-breakpoint
DROP TABLE \`_taboo_v2_seed\`;
`;

fs.writeFileSync(
  path.join(root, "drizzle/0007_taboo_bank_v2.sql"),
  migration,
  "utf8",
);

console.log(`Generated ${bank.length} curated Taboo cards.`);
