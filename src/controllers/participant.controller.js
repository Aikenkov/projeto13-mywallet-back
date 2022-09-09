import db from "../database/db.js";
import joi from "joi";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
//import { ObjectId } from "mongodb";

const signupSchema = joi.object({
    name: joi.string().trim().min(1).max(30).required().strict(),
    email: joi.string().required().email(),
    password: joi.string().min(4).required(),
});

const now = dayjs().format("DD/MM");

async function signUp(req, res) {
    const { name, password, email } = req.body;

    const validation = signupSchema.validate(
        {
            name,
            email,
            password,
        },
        { abortEarly: false }
    );

    if (validation.error) {
        const erros = validation.error.details.map(
            (details) => details.message
        );
        return res.status(422).send(erros);
    }

    const alreadyExists = await db
        .collection("users")
        .findOne({ email: email });

    if (alreadyExists) {
        return res.status(409).send({ message: "Email já existente" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        const participant = await db
            .collection("users")
            .insertOne({ name, email, password: passwordHash });
        res.send(participant);
    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
}

export { signUp };
