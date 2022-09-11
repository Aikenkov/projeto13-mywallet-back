import joi from "joi";
import db from "../database/db.js";

const signupSchema = joi.object({
    name: joi.string().trim().min(1).max(30).required().strict(),
    email: joi.string().required().email(),
    password: joi.string().min(4).required(),
});

async function verifySignUp(req, res, next) {
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

    next();
}

export default verifySignUp;
