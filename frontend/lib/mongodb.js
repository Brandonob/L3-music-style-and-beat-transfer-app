import { MongoClient } from 'mongodb';

const { MONGODB_DB, MONGODB_URI } = process.env;

if (!MONGODB_URI || !MONGODB_DB) {
  throw new Error('MONGO URI OR DB Not Found!');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function getDB() {
  try {
    const { db } = await connectToDB();
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}