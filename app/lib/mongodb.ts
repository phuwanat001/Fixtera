import { MongoClient, Db } from "mongodb";

const MONGODB_URL = "mongodb+srv://fixtera:L0wT5btUtbwDZ26M@cluster0.tvmjaol.mongodb.net/";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URL);
  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export { cachedClient, cachedDb };
