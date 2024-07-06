import { serve } from '@hono/node-server';
import { createDependencies } from './create-dependencies';
import { createApp } from './create-app';
import { loadConfigs } from './load-configs';

const configs = await loadConfigs();
const deps = createDependencies(configs);
const app = createApp(deps);

serve(
  {
    fetch: app.fetch,
    hostname: '127.0.0.1',
    port: parseInt(configs.PORT),
  },
  (ls) => {
    console.log(`Listening on http://${ls.address}:${ls.port}`);
  }
);
