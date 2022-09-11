import joi from "joi";
import db from "../database/db.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

const entriesSchema = joi.object({
    value: joi.number().required().min(1).precision(2),
    description: joi.string().min(1).required(),
    type: joi.string().valid("exit", "entrie").required(),
});

async function newEntrie(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const now = dayjs().format("DD/MM");
    const { value, description, type } = req.body;
    if (!token) {
        return res.sendStatus(401);
    }

    const validation = entriesSchema.validate(
        {
            value,
            description,
            type,
        },
        { abortEarly: false }
    );

    let formatValue = Number(value).toFixed(2);

    if (validation.error) {
        const erros = validation.error.details.map(
            (details) => details.message
        );
        return res.status(422).send(erros);
    }

    try {
        const session = await db.collection("sessions").findOne({ token });
        const ui = await db.collection("history").insertOne({
            userId: ObjectId(session.userId),
            value: formatValue,
            description,
            date: now,
            type,
        });
        return res.sendStatus(201);
    } catch (error) {
        return res.send(error.message);
    }
}

async function getHistory(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }
    let balance = 0;
    try {
        const session = await db.collection("sessions").findOne({ token });

        if (session === null) {
            return res.sendStatus(400);
        }

        const history = await db
            .collection("history")
            .find({
                userId: ObjectId(session.userId),
            })
            .toArray();

        history.forEach((e) => {
            console.log(e);
            let value = Number(e.value);
            if (e.type === "entrie") {
                return (balance += value);
            } else {
                return (balance -= value);
            }
        });
        balance = balance.toFixed(2);
        return res.send([{ balance, history: history }]);
    } catch (error) {
        return res.send(error.message);
    }
}

export { newEntrie, getHistory };
