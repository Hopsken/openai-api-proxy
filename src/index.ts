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

    if (request.method === 'OPTIONS') {
      const response = new Response(null, {
        status: 200,
      })
      response.headers.set(
        'Access-Control-Allow-Headers',
        'authorization,content-type'
      )
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS, POST')
      response.headers.set('Access-Control-Allow-Origin', '*')
      return response
    }

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
