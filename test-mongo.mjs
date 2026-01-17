import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://fixtera:L0wT5btUtbwDZ26M@cluster0.tvmjaol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
