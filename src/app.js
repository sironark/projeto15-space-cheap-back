import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";
import dotenv from "dotenv"
import ships from "./products/products.js"

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config()

// conectando ao banco
const mongoClient = new MongoClient(process.env.DATABASE_URL);
export let db;

mongoClient.connect()
        .then(() => {
                console.log("MongoDB conected")
                db = mongoClient.db()
        })
        .catch((err) => console.log(err.message))


app.get('/products', async (req, res) => {
        
        try {
                const list = await db.collection('products').find().toArray()
               
                if (list.length === 0) {
                        await db.collection('products').insertMany(ships)
                        return res.status(200).send(ships)
                        
                } else {
                       
                        return res.status(200).send(list)
                }

        } catch (error) {
                return res.status(500).send(error)
        }
})

app.get("/cart/:userId", async (req,res)=>{
        const userId = req.params.userId
        //const userId = {id: 123456789} // ide será passado no params
        console.log(userId)
        try {   
                const userCart = await db.collection("cart").find({id: userId}).toArray()
                res.send(userCart)
        } catch (error) {
                res.status(500).send(error.message)
        }
})

// servidor rodando na porta 5000
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Running server on port ${port}`))

