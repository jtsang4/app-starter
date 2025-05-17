# App Starter

A modern full-stack application scaffold template with the latest technologies for building web applications.

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) with App Router and React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) for utility-first styling
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/) for type-safe database access
- **AI Integration**: [AI SDK](https://sdk.vercel.ai/docs) for OpenAI integration
- **Development Tools**:
  - [TypeScript](https://www.typescriptlang.org/) for type safety
  - [Biome](https://biomejs.dev/) for linting and formatting
  - [Docker](https://www.docker.com/) for containerized development environment

## Features

- Modern React with the latest Next.js App Router
- Type-safe database operations with Drizzle ORM
- AI integration ready with OpenAI SDK
- PostgreSQL database with Docker setup
- Environment configuration with dotenv
- Clean project structure for scalability

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [Docker](https://www.docker.com/) for the development database
- [Bun](https://bun.sh/) (optional but recommended for faster package management)

### Setup

1. Clone this repository
2. Copy `.env.example` to `.env` and update the values as needed
3. Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

4. Start the development database:

```bash
npm run db:start
# or
yarn db:start
# or
pnpm db:start
# or
bun db:start
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Management

This template uses Drizzle ORM with PostgreSQL. The following commands are available:

- `db:start`: Start the PostgreSQL database in Docker
- `db:stop`: Stop the PostgreSQL database
- `db:stop:all`: Stop the PostgreSQL database and remove volumes
- `db:generate`: Generate migration files based on schema changes
- `db:migrate`: Apply migrations to the database
- `db:push`: Push schema changes to the database
- `db:studio`: Open Drizzle Studio to manage your database

## AI Integration

This template includes the AI SDK for easy integration with OpenAI. Set your API keys in the `.env` file to get started.

## Project Structure

```
app-starter/
├── src/
│   ├── app/           # Next.js App Router pages and layouts
│   ├── config/        # Application configuration
│   └── db/
│       └── schema/    # Database schema definitions
├── public/            # Static assets
├── drizzle.config.ts  # Drizzle ORM configuration
├── dev-docker-compose.yml  # Docker configuration for development
└── .env.example       # Example environment variables
```

## TODO

The following features are planned for future implementation:

1. **Docker Deployment** - Add Dockerfile to support containerized deployment

## Deployment

You can deploy this application to any platform that supports Next.js, such as Vercel, Netlify, or your own server.

For more information on deployment, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
