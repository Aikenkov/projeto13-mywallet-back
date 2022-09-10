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
    const { value, description, type } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const now = dayjs().format("DD/MM");

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
    formatValue = formatValue.toString().replace(".", ",");

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
        return res.send(201);
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

        res.send(history);
    } catch (error) {
        return res.send(error.message);
    }
}

export { newEntrie, getHistory };
