const jwt = require("jsonwebtoken");
const { Pool } = require('pg');
const pool_conf = require('../database.json');
let pool = new Pool(pool_conf['dev']);

let authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403)
        try {
            (async () => {
                let query = await pool.query(`SELECT end_time from sessionDetails WHERE session_id='${payload.session_id}'`);
                if (!query.rows[0].end_time) {
                    req.email = payload.email;
                    req.session_id = payload.session_id;
                    req.id = payload.id;
                    next();
                } else {
                    res.sendStatus(401);
                }
            })();
        } catch (error) {
            res.send (error);
        }
    })
}

module.exports = authenticateToken;