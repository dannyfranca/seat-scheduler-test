import pg from 'pg';
import fs from 'fs';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export async function migrate(client: pg.Client) {
  const bootSqlPath = path.join(__dirname, '../migrations/boot.sql');
  const query = fs.readFileSync(bootSqlPath).toString();
  await client.query(query);
  console.log('Migration complete!');
}
