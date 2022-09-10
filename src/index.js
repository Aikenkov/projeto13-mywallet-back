import express from "express";
import cors from "cors";
import participantRouter from "./routers/participant.router.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(participantRouter);

app.listen(5000, () => console.log("escutando na porta 5000"));
