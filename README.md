# OAuth 2.1 MCP Server as a Next.js app on Vercel

Note: it was forked from: <https://github.com/run-llama/mcp-nextjs> with the following changes:

- prisma replaced with drizzle ORM
- next-auth replaced with better-auth

This is a Next.js-based application that provides an MCP (Model Context Protocol) server with OAuth 2.1 authentication support. It is intended as a model for building your own MCP server in a Next.js context. It uses the [@vercel/mcp-adapter](https://github.com/vercel/mcp-adapter) to handle the MCP protocol, in order to support both SSE and Streamable HTTP transports.

In addition to being an OAuth server, it also requires the user authenticate. This is currently configured to use Google as a provider, but you could authenticate users however you want (X, GitHub, your own user/password database etc.) without breaking the OAuth flow.

## Using with

### [Claude Desktop](https://www.anthropic.com/products/claude-desktop) and [Claude.ai](https://claude.ai)

Claude currently supports only the older SSE transport, so you need to give it a different URL to all the other clients listed here.

Use the "Connect Apps" button and select "Add Integration". Provide the URL like `https://example.com/mcp/sse` (the `/sse` at the end is important!). Note that Claude Desktop and Web will not accept a `localhost` URL.

### [Cursor](https://cursor.com/)

Edit your `mcp.json` to look like this:

```
{
  "mcpServers": {
      "MyServer": {
        "name": "MCP OAuth Demo",
        "url": "https://example.com/mcp/mcp",
        "transport": "http-stream"
      },
  }
}
```

### [VSCode](https://code.visualstudio.com/)

VSCode currently [doesn't properly evict the client ID](https://github.com/microsoft/vscode/issues/250960), so client registration fails if you accidentally delete the client (the workaround in that issue will resolve it). Otherwise, it works fine. Add this to your settings.json:

```
"mcp": {
    "servers": {
        "My Server": {
            "url": "https://example.com/mcp/mcp"
        }
    }
}
```

If you deleted the client, [you need to open the Command Palette and run `Authentication: Remove Dynamic Authentication Providers` to evict the client ID from VSCode](https://github.com/microsoft/vscode/issues/250960#issuecomment-2954481336).

### [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)

Tell Inspector to connect to `https://example.com/mcp/mcp`, with Streamable HTTP transport.

Note, open the link with `MCP_PROXY_AUTH_TOKEN`:

```
🔗 Open inspector with token pre-filled:
   http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=...
   (Auto-open is disabled when authentication is enabled)
```

You can also use the SSE transport by connecting to `https://example.com/mcp/sse` instead.

## Running the server

```
pnpm install
pnpm run db:generate
pnpm run dev
```

The very first time you will also need to run `pnpm run db:push` to create the database tables.

### Environment variables

Required environment variables should be in `.env`:

```
DATABASE_URL="postgresql://user:pass@server/database"
BETTER_AUTH_SECRET="any random string"
GOOGLE_CLIENT_ID="a Google OAuth client ID"
GOOGLE_CLIENT_SECRET="a Google OAuth client secret"
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
REDIS_URL="redis://user:pass@host:6379"
```

`DATABASE_URL` is required for OAuth authentication to work, this is where sessions etc. live.

`REDIS_URL` is required if you need SSE transport to work (i.e. you want to support Claude Desktop and Web).

### Database Commands

Common Drizzle ORM commands:

- `pnpm run db:generate` - Generate database client from schema
- `pnpm run db:push` - Push schema changes to database (development)
- `pnpm run db:migrate` - Generate and run migrations (production)
- `pnpm run db:studio` - Open Drizzle Studio to view/edit data

## Architecture

If you're using this as a template for your own Next.js app, the important parts are:

- `/src/app/api/oauth/*` - these implement oauth client registration and token exchange
- `/src/app/oauth/authorize/page.tsx` - this implements the oauth consent screen (it's extremely basic right now)
- `/src/mcp/[transport]/route.ts` - this implements the MCP server itself. Your tools, resources, etc. should be defined here.

To handle OAuth your app needs to be able to persist clients, access tokens, etc.. To do this it's using a PostgreSQL database accessed via Drizzle ORM. You can swap this for some other database if you want (it will be easiest if it's another Drizzle-supported database).

### Database Schema

The database schema is defined in `src/lib/db/schema.ts` using Drizzle ORM. The main tables are:

- `accounts` - NextAuth.js account information
- `sessions` - user sessions
- `users` - user accounts
- `verificationTokens` - email verification tokens  
- `oauthClients` - registered OAuth clients
- `oauthAccessTokens` - issued access tokens
- `oauthAuthCodes` - authorization codes for the OAuth flow

You'll also notice:

- `src/app/auth.ts` - this implements Auth.js authentication to your app itself. It's configured to use Google as a provider, but you can change it to use any other provider supports by Auth.js. This is not required for the MCP server to work, but it's a good idea to have it in place for your own app.
- `src/app/api/auth/[...nextauth]/route.ts` - this plumbs in the Auth.js authentication, and is again not part of the OAuth implementation.

## Deploying to production

This app only works if deployed to Vercel currently, due to its dependence on the `@vercel/mcp-adapter` package, which in turn is required to support the old SSE transport. We didn't feel like implementing a whole extra protocol just for Claude Desktop.

Deploy as usual. You'll need to add `pnpm run db:generate` to your build command, and of course you'll need all the same environment variables as in the development environment.
