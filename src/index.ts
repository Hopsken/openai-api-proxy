const upstream = 'https://api.openai.com'

export interface Env {
  OPENAI_API_KEY: string
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url)
    const upstreamUrl = new URL(upstream)

    const override_headers = new Headers(request.headers)

    // used predefined OPENAI_API_KEY
    if (!override_headers.get('Authorization') && env.OPENAI_API_KEY) {
      override_headers.set('Authorization', `Bearer ${env.OPENAI_API_KEY}`)
    }

    override_headers.set('Host', upstreamUrl.hostname)
    override_headers.set('Refer', url.origin)

    const upstreamPath = new URL(url.pathname, upstreamUrl.origin)
    const response = await fetch(upstreamPath, {
      method: request.method,
      headers: override_headers,
      body: request.body,
    })

    return response
  },
}
