import { MongoClient } from 'mongodb';

const { MONGODB_DB, MONGODB_URI } = process.env;

if (!MONGODB_URI || !MONGODB_DB) {
  throw new Error('MONGO URI OR DB Not Found!');
}

export async function connectToDB() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName,
    });
  }
}
export async function getDB() {
  try {
    const { db } = await connectToDB();

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}