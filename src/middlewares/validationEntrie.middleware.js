import joi from "joi";

const entriesSchema = joi.object({
    value: joi.number().required().min(1).precision(2),
    description: joi.string().min(1).required(),
    type: joi.string().valid("exit", "entrie").required(),
});

async function verifyEntrie(req, res, next) {
    const { value, description, type } = req.body;

    const validation = entriesSchema.validate(
        {
            value,
            description,
            type,
        },
        { abortEarly: false }
    );

    if (validation.error) {
        const erros = validation.error.details.map(
            (details) => details.message
        );
        return res.status(422).send(erros);
    }
    let formatValue = Number(value).toFixed(2);

    res.locals.body = { description, type, formatValue };

    next();
}

export default verifyEntrie;
