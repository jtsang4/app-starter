import dotenv from "dotenv";

dotenv.config();

class Config {
	JINA_API_KEY: string;
	OPENAI_API_KEY: string;
	OPENAI_BASE_URL: string;
	DATABASE_URL: string;
	NEXT_PUBLIC_APP_URL: string;
	constructor() {
		this.JINA_API_KEY = process.env.JINA_API_KEY || "";
		if (!this.JINA_API_KEY) {
			throw new Error("Environment variable JINA_API_KEY is not set");
		}
		this.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
		if (!this.OPENAI_API_KEY) {
			throw new Error("Environment variable OPENAI_API_KEY is not set");
		}
		this.OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "";
		if (!this.OPENAI_BASE_URL) {
			throw new Error("Environment variable OPENAI_BASE_URL is not set");
		}
		this.DATABASE_URL = process.env.DATABASE_URL || "";
		if (!this.DATABASE_URL) {
			throw new Error("Environment variable DATABASE_URL is not set");
		}
		this.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";
		if (!this.NEXT_PUBLIC_APP_URL) {
			throw new Error("Environment variable NEXT_PUBLIC_APP_URL is not set");
		}
	}
}

export const config = new Config();
