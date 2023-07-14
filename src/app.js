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


app.get("/carrinho", async (req,res)=>{
        try {
                res.send("ok")
        } catch (error) {
                res.status(500).send(error.message)
        }
})

// servidor rodando na porta 5000
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Running server on port ${port}`))