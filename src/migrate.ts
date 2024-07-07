import pg from 'pg';
import fs from 'fs';
import path from 'path';

export async function migrate(client: pg.Client) {
  const bootSqlPath = path.join(process.cwd(), './migrations/boot.sql');
  const query = fs.readFileSync(bootSqlPath).toString();
  await client.query(query);
  console.log('Migration complete!');
}
