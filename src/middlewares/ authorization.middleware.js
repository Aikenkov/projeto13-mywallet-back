import db from "../database/db.js";

async function verifySession(req, res, next) {
    // let db = await db();
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

        res.locals.session = session;
        next();
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export default verifySession;
