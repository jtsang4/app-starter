import dotenv from 'dotenv';

dotenv.config();

class Config {
  private _DATABASE_URL: string | null = null;

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
