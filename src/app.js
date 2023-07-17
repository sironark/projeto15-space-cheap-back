import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"

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


app.get('/product/:id', async (req, res) => {
        //const {id}= req.params
        
        try {
                const choiceShip = await db.collection('products').findOne({ _id: new ObjectId(id)})
                if(choiceShip) return res.status(200).send(choiceShip)
                

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

