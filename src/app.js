import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";
import dotenv from "dotenv"

const app = express();
app.use(express.json());
app.use(cors);
dotenv.config()

const PORT = 5000;
app.listen(PORT, () => console.log(`Running server on port ${PORT}`))
