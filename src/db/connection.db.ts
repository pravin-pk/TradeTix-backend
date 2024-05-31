import { MongoClient } from "mongodb";

MongoClient.connect(process.env.MONGO_URI as string, {
  minPoolSize: 2,
  maxPoolSize: 10,
}).then(async (client) => {
  try {
    await client.db("tradeTix-DB").command({ ping: 1 });
    console.log("Connected to MongoDB");
  } finally {
    client.close();
  }
});
