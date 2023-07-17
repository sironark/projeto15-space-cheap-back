import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.DATABASE_URL);

export default async function conexaoDatabase() {
  try {
    await client.connect();
    console.log("Conectado ao banco de dados");
    return client.db();
  } catch (error) {
    console.log(error);
    throw new Error("Falha ao conectar ao banco de dados");
  }
}


export const db = client.db();