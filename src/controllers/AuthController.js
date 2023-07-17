import bcrypt, { hash } from "bcrypt";
import { v4 as uid } from "uuid";
import dotenv from "dotenv";
import conexaoDatabase from "../database/DatabaseConnection.js"

dotenv.config();

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const db = await conexaoDatabase();

    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(404).send("E-mail não cadastrado!");

    const senhaCorreta = bcrypt.compareSync(password, user.password);
    if (!senhaCorreta) return res.status(401).send("Senha incorreta!");

    const token = uid();
    await db.collection("sessions").insertOne({ token, userId: user._id });
    res.send({ token, userName: user.name });
  } catch (error) {
    console.log(error);
    res.status(500).send({ errors: ["Erro interno"] });
  }
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10)

  try {
    const db = await conexaoDatabase();
    
    const user = await db.collection("users").findOne({ email });
    if (user) return res.status(404).send("E-mail já cadastrado!");
    
    await db.collection("users").insertOne({ email, name, password: hash });
    res.send({ email, name });
  } catch (error) {
    console.log(error);
    res.status(500).send({ errors: ["Erro interno"] });
  }
}

export async function logout(req, res) {
  const { token } = res.locals.session;

  try {
    const db = await conexaoDatabase();

    await db.collection("sessions").deleteOne({ token });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}