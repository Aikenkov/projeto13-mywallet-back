import joi from "joi";
import db from "../database/db.js";

const signinSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().min(4).required(),
});

async function verifySignIn(req, res, next) {
    const { password, email } = req.body;

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

    res.locals.user = user;

    next();
}

export default verifySignIn;
