/// <reference types="@cloudflare/workers-types" />

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Try to fetch the static asset
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status === 200) {
      return assetResponse;
    }

    // SPA fallback: serve index.html for client-side routing
    const indexRequest = new Request(new URL('/index.html', url.origin).toString(), {
      method: request.method,
      headers: request.headers,
    });
    return env.ASSETS.fetch(indexRequest);
  },
};
