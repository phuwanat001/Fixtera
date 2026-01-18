import { MongoClient, Db } from "mongodb";

function getMongoUrl(): string {
  const url = process.env.MONGODB_URL;
  if (!url) {
    throw new Error("MONGODB_URL environment variable is not configured");
  }
  return url;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(getMongoUrl());
  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export { cachedClient, cachedDb };
