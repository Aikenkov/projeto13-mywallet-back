import db from "../database/db.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { hashSync } from "bcrypt";

async function newEntrie(req, res) {
    const session = res.locals.session;
    const { description, type, formatValue } = res.locals.body;
    const now = dayjs().format("DD/MM");

    try {
        await db.collection("history").insertOne({
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
    const session = res.locals.session;
    let balance = 0;
    try {
        const history = await db
            .collection("history")
            .find({
                userId: ObjectId(session.userId),
            })
            .toArray();

        history.forEach((e) => {
            let value = Number(e.value);
            if (e.type === "entrie") {
                return (balance += value);
            } else {
                return (balance -= value);
            }
        });
        balance = balance.toFixed(2);
        return res.send({ balance, history });
    } catch (error) {
        return res.send(error.message);
    }
}

export { newEntrie, getHistory };
