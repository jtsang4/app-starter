import dotenv from 'dotenv';

dotenv.config();

class Config {
  DATABASE_URL: string;
  NEXT_PUBLIC_APP_URL: string;
  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    if (!this.DATABASE_URL) {
      throw new Error('Environment variable DATABASE_URL is not set');
    }
    this.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';
    if (!this.NEXT_PUBLIC_APP_URL) {
      throw new Error('Environment variable NEXT_PUBLIC_APP_URL is not set');
    }
  }
}

export const config = new Config();
