export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const body = await readBody(event).catch(() => null);
  const method = getMethod(event);

  const pathname = getRequestURL(event).pathname;
  const proxiedPath = pathname.replace(/^\/api\/directus/, '') || '/';
  const targetUrl = `${String(config.public.API_BASE_URL || '').replace(/\/$/, '')}${proxiedPath}`;

  try {
    const response = await $fetch.raw(targetUrl, {
      method,
      query,
      body,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
    });

    return response._data;
  } catch (error) {
    const upstreamStatus = error?.response?.status || error?.statusCode || 500;
    const upstreamStatusText =
      error?.response?.statusText || error?.statusMessage || 'Directus Proxy Error';
    const upstreamData = error?.response?._data ?? error?.data ?? null;
    const upstreamMessage =
      upstreamData?.errors?.[0]?.message ||
      upstreamData?.message ||
      error?.message ||
      'Directus request failed';

    throw createError({
      statusCode: upstreamStatus,
      statusMessage: upstreamStatusText,
      message: upstreamMessage,
      data: upstreamData,
    });
  }
});
