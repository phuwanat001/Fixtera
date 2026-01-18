import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const uri = process.env.MONGODB_URL;

if (!uri) {
  console.error("Error: MONGODB_URL environment variable is not set");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log("Attempting to connect...");
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db("fixtera");
    const collections = await db.listCollections().toArray();
    console.log(
      "Collections in 'fixtera' db:",
      collections.map((c) => c.name),
    );

    // Also check default db just in case
    const dbDefault = client.db();
    console.log("Default DB name:", dbDefault.databaseName);
    const collectionsDefault = await dbDefault.listCollections().toArray();
    console.log(
      "Collections in default db:",
      collectionsDefault.map((c) => c.name),
    );
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();
