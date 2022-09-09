import express from "express";
import cors from "cors";
import { signUp, signIn } from "./controllers/participant.controller.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signUp", signUp);
app.post("/signIn", signIn);

app.listen(5000, () => console.log("escutando na porta 5000"));
