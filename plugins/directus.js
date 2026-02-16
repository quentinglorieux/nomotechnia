export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const baseURL = String(config.public.API_BASE_URL || '').replace(/\/$/, '');
  const directusEndpoint = import.meta.client ? '/api/directus' : baseURL;

  if (import.meta.dev) {
    if (import.meta.client) {
      if (!window.__NOMOTECHNIA_API_BASE_LOGGED__) {
        console.info(`[directus] API endpoint: ${directusEndpoint} (target: ${baseURL})`);
        window.__NOMOTECHNIA_API_BASE_LOGGED__ = true;
      }
    } else {
      if (!globalThis.__NOMOTECHNIA_API_BASE_LOGGED__) {
        console.info(`[directus] API endpoint: ${directusEndpoint}`);
        globalThis.__NOMOTECHNIA_API_BASE_LOGGED__ = true;
      }
    }
  }

  const normalizePath = (path = '/') => {
    if (!path) return '/';
    return path.startsWith('/') ? path : `/${path}`;
  };

  const request = async (input) => {
    if (typeof input === 'string') {
      const response = await $fetch(`${directusEndpoint}${normalizePath(input)}`);
      return response?.data ?? response;
    }

    const method = input?.method || 'GET';
    const path = normalizePath(input?.path || '/');
    const query = input?.params ?? input?.query;
    const body = input?.body ?? input?.data;

    const response = await $fetch(`${directusEndpoint}${path}`, {
      method,
      query,
      body,
      headers: input?.headers,
    });

    return response?.data ?? response;
  };

  const directus = {
    request,
  };

  return {
    provide: {
      directus
    }
  };
});
