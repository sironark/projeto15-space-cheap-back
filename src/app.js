import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";
import dotenv from "dotenv"

const app = express();
app.use(express.json());
app.use(cors);
dotenv.config()

// conectando ao banco
const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

mongoClient.connect()
	.then(() => {
        console.log("MongoDB conected")
        db = mongoClient.db()})
	.catch((err) => console.log(err.message))


// servidor rodando na porta 5000
app.listen(process.env.PORT, () => console.log(`Running server on port ${process.env.PORT}`))