import db from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

async function signUp(req, res) {
    const { name, password, email } = req.body;

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
    const { password } = req.body;
    const user = res.locals.user;

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
                return res.send({ name: user.name, token });
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
        return res.send({ name: user.name, token });
    } else {
        return res.status(400).send({ message: "Email ou senha incorretos" });
    }
}

async function endSession(req, res) {
    const session = res.locals.session;
    console.log(session);
    try {
        await db.collection("sessions").deleteOne({ token: session.token });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
}

export { signUp, signIn, endSession };
