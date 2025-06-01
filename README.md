# App Starter

A modern full-stack application scaffold template with the latest technologies for building web applications.

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) with App Router and React 19
- **UI Framework**: [Ant Design](https://ant.design/) for beautiful, responsive UI components
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) for utility-first styling
- **Authentication**: [Better Auth](https://github.com/better-auth/better-auth) for secure user authentication
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/) for type-safe database access
- **AI Integration**: [AI SDK](https://sdk.vercel.ai/docs) for OpenAI integration
- **Development Tools**:
  - [TypeScript](https://www.typescriptlang.org/) for type safety
  - [Biome](https://biomejs.dev/) for linting and formatting
  - [Docker](https://www.docker.com/) for containerized development environment

## Features

- Modern React with the latest Next.js App Router
- Beautiful UI components with Ant Design
- Complete authentication system with login, registration, and session management
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

## Authentication

This template includes a complete authentication system using Better Auth:

- Email and password authentication
- User registration and login
- Session management
- Protected routes
- Server-side authentication utilities
- Client-side hooks and components

## Project Structure

```
app-starter/
├── src/
│   ├── app/           # Next.js App Router pages and layouts
│   │   ├── api/       # API routes including authentication endpoints
│   │   ├── login/     # Login page
│   │   └── register/  # Registration page
│   ├── component/     # React components
│   │   ├── auth/      # Authentication components
│   ├── config/        # Application configuration
│   ├── lib/           # Utility libraries
│   │   └── auth/      # Authentication utilities
│   └── db/
│       └── schema/    # Database schema definitions
├── public/            # Static assets
├── drizzle.config.ts  # Drizzle ORM configuration
├── dev-docker-compose.yml  # Docker configuration for development
└── .env.example       # Example environment variables
```

## Docker Deployment

This template includes Docker support for containerized deployment. The Dockerfile supports multiple package managers including Bun, Yarn, npm, and pnpm.

### Building the Docker Image

When build Docker image, please run `bun run db:generate` first.

```bash
docker build -t app-starter .
```

### Running with Docker Compose

1. Copy the example environment variables:

```bash
cp .env.example .env
```

2. Update the `.env` file with your production values, especially:

   - `DATABASE_URL`: Your production database connection string
   - `BETTER_AUTH_SECRET`: A strong random secret for authentication

3. Start the application with Docker Compose:

```bash
docker compose up -d
```

This will start both the application and a PostgreSQL database.

### Environment Variables in Docker

The Docker build process uses placeholder environment variables during the build phase to prevent build failures. Real environment variables should be provided at runtime through:

- Docker Compose environment section
- Docker run `-e` flags
- External environment files
- Container orchestration platforms (Kubernetes, etc.)

**Important**: Never include real secrets in the Docker image. Always provide them at runtime.

## Deployment

You can deploy this application to:

- **Docker**: Use the included Dockerfile and docker-compose.yml
- **Vercel**: Deploy directly from your Git repository
- **Netlify**: Deploy with build command `npm run build`
- **Your own server**: Use Docker or build and run with Node.js

For more information on deployment, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
