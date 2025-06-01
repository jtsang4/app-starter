import dotenv from 'dotenv';

dotenv.config();

class Config {
  private _DATABASE_URL: string | null = null;
  private _BETTER_AUTH_SECRET: string | null = null;
  private _OPENAI_API_KEY: string | null = null;
  private _OPENAI_BASE_URL: string | null = null;

  get DATABASE_URL(): string {
    if (this._DATABASE_URL === null) {
      this._DATABASE_URL = process.env.DATABASE_URL || '';

      // Only enforce DATABASE_URL in production runtime, not during build
      if (
        !this._DATABASE_URL &&
        process.env.NODE_ENV === 'production' &&
        !this.isBuildTime()
      ) {
        throw new Error('Environment variable DATABASE_URL is not set');
      }

      // Provide a build-time placeholder for development
      if (!this._DATABASE_URL && this.isBuildTime()) {
        this._DATABASE_URL =
          'postgres://build-placeholder:build-placeholder@build-placeholder:5432/build-placeholder';
      }
    }
    return this._DATABASE_URL;
  }

  get BETTER_AUTH_SECRET(): string {
    if (this._BETTER_AUTH_SECRET === null) {
      this._BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || '';

      // Only enforce BETTER_AUTH_SECRET in production runtime, not during build
      if (
        !this._BETTER_AUTH_SECRET &&
        process.env.NODE_ENV === 'production' &&
        !this.isBuildTime()
      ) {
        throw new Error('Environment variable BETTER_AUTH_SECRET is not set');
      }

      // Provide a build-time placeholder
      if (!this._BETTER_AUTH_SECRET && this.isBuildTime()) {
        this._BETTER_AUTH_SECRET =
          'build-time-placeholder-secret-do-not-use-in-production';
      }
    }
    return this._BETTER_AUTH_SECRET;
  }

  get OPENAI_API_KEY(): string {
    if (this._OPENAI_API_KEY === null) {
      this._OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

      if (!this._OPENAI_API_KEY && !this.isBuildTime()) {
        console.warn(
          'Warning: OPENAI_API_KEY is not set. AI features may not work.',
        );
      }
    }
    return this._OPENAI_API_KEY;
  }

  get OPENAI_BASE_URL(): string {
    if (this._OPENAI_BASE_URL === null) {
      this._OPENAI_BASE_URL =
        process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    }
    return this._OPENAI_BASE_URL;
  }

  private isBuildTime(): boolean {
    // Check if we're in a build context
    return (
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.NODE_ENV !== 'production' ||
      process.argv.includes('build')
    );
  }
}

export const config = new Config();
