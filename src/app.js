import express from "express"
import cors from "cors"
import { ObjectId } from "mongodb";
import dotenv from "dotenv"
import { login, register } from "./controllers/AuthController.js";
import conexaoDatabase from "./database/DatabaseConnection.js";
import ships from "./products/products.js";


const app = express();
app.use(express.json());
app.use(cors());        
dotenv.config()


app.post('/sign-up', register) 

app.post('/login', login)

app.get('/products', async (req, res) => {
        const db = await conexaoDatabase();
        try {
                const allShips = await db.collection('products').find().toArray()
                console.log(allShips)
                if(!allShips){
                await db.collection('products').insertMany(ships)
                }
                const products = await db.collection("products").find().toArray()
                return res.status(200).send(products)
        } catch (error) {
                return res.status(500).send(error)
        }

})

app.get('/product/:shipId', async (req, res) => {
        const db = await conexaoDatabase();
        const {shipId}= req.params
        console.log(shipId)
        
        try {
        
                const choiceShip = await db.collection('products').findOne({_id:new ObjectId(shipId)})
                if(choiceShip) return res.status(200).send(choiceShip)
        } catch (error) {
                return res.status(500).send(error)
        }

})

app.get("/cart/:userId", async (req,res)=>{
        const db = await conexaoDatabase();
        const userId = req.params.userId
        //const userId = {id: 123456789} // ide será passado no params
        console.log(userId)
        try {
                const userCart = await db.collection("cart").find({ id: userId }).toArray()
                res.send(userCart)
        } catch (error) {
                res.status(500).send(error.message)
        }
})

app.delete("/purchase/:userId", async (req,res)=>{
        const db = await conexaoDatabase();
        const { userId } = req.params
        if (!userId) return res.sendStatus(404)

        try {
                const result = await db
                        .collection("cart")
                        .deleteMany({ id: userId })
                if (result.deletedCount === 0) return res.sendStatus(404)
                res.sendStatus(202)
        } catch (error) { res.send(error.message).status(500) }
})

// servidor rodando na porta 5000
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Running server on port ${port}`))

