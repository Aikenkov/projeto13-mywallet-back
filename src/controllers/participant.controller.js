import db from "../database/db.js";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
//import { ObjectId } from "mongodb";

const signupSchema = joi.object({
    name: joi.string().trim().min(1).max(30).required().strict(),
    email: joi.string().required().email(),
    password: joi.string().min(4).required(),
});

const signinSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().min(4).required(),
});

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
        await db
            .collection("users")
            .insertOne({ name, email, password: passwordHash });
        res.sendStatus(200);
    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
}

async function signIn(req, res) {
    const { email, password } = req.body;

    const validation = signinSchema.validate(
        {
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

    const user = await db.collection("users").findOne({ email });
    if (user === null) {
        return res.status(400).send({ message: "Email ou senha incorretos" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (passwordIsValid) {
        const token = uuid();

        try {
            const exist = await db.collection("sessions").findOne({
                userId: user._id,
            });

            if (exist) {
                await db
                    .collection("sessions")
                    .updateOne({ userId: user._id }, { $set: { token } });
                return res.send({ token, userId: user._id });
            }
        } catch (error) {
            console.log(error.message);
            res.sendStatus(500);
        }

        try {
            await db.collection("sessions").insertOne({
                userId: user._id,
                token,
            });
        } catch (error) {
            console.log(error.message);
            res.sendStatus(500);
        }
        res.send({ token, userId: user._id });
    } else {
        res.status(400).send({ message: "Email ou senha incorretos" });
    }
}

export { signUp, signIn };
