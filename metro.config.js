const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// @supabase/supabase-js tente un import optionnel de `@opentelemetry/api`
// (télémétrie facultative). On le neutralise pour ne pas l'embarquer.
const EMPTY = require.resolve('./src/core/empty.js');
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@opentelemetry/api') {
    return { type: 'sourceFile', filePath: EMPTY };
  }
  // expo-sqlite est natif : on le neutralise uniquement pour la preview web
  // (le fallback mémoire prend le relais, cf. db/client.ts). Mobile non affecté.
  if (platform === 'web' && moduleName === 'expo-sqlite') {
    return { type: 'sourceFile', filePath: EMPTY };
  }
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
