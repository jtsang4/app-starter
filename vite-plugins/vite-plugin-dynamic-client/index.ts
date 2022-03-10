import type { PluginOption } from 'vite';
import { normalizePath } from 'vite';

const CLIENT_ENTRY = require.resolve('vite/dist/client/client.mjs');
const ENV_ENTRY = require.resolve('vite/dist/client/env.mjs');
const normalizedClientEntry = normalizePath(CLIENT_ENTRY);
const normalizedEnvEntry = normalizePath(ENV_ENTRY);

type UserOptions = {
  port: number;
};

export default function VitePluginDynamicClient(
  userOptions: UserOptions
): PluginOption {
  return {
    name: 'vite-plugin-dynamic-client',
    transform(code, id, options) {
      if ([normalizedClientEntry, normalizedEnvEntry].includes(id)) {
        return code.replace(/__HMR_PORT__/g, JSON.stringify(userOptions.port));
      }
    },
  };
}
