require("dotenv").config();
const express = require("express");
const app = express();
const { Pool } = require("pg");
const pool_conf = require("../database.json");
let pool = new Pool(pool_conf["dev"]);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());

exports.Register = async (req, res) => {
  try {
    const { user_name, email, password, updated_at } = req.body;
    hashpass = await bcrypt.hash(password, 10);
    pool.connect(async (error, client) => {
      if (error) {
        res.send(error);
      }
      let search = await client.query(
        `SELECT id FROM users WHERE email='${email}'`
      );
      if (search.rows.length == 0) {
        let query = await client.query(
          `INSERT INTO users(user_name, email, password, updated_at) VALUES ('${user_name}','${email}','${hashpass}','${updated_at}');`
        );
        res.send(query.rows);
      } else {
        res.send("User Already exists.");
      }
    });
  } catch (error) {
    res.send(error);
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    pool.connect(async (error, client) => {
      if (error) {
        res.send(error);
      }
      let search = await client.query(
        `SELECT * FROM users WHERE email='${email}'`
      );
      if (search.length == 0) {
        return res.send("Please register First");
      } else {
        if (await bcrypt.compare(password, search.rows[0].password)) {
          let query = await client.query(`INSERT INTO sessionDetails (user_id)
                    VALUES ('${search.rows[0].id}')
                    RETURNING session_id;`);
          const accessToken = jwt.sign(
            {
              email: email,
              id: search.rows[0].id,
              session_id: query.rows[0].session_id,
            },
            process.env.ACCESS_TOKEN_SECRET
          );
          res.json({ accessToken: accessToken });
        } else {
          res.send("Failed.");
        }
      }
    });
  } catch (error) {
    res.send(error);
  }
};

exports.Logout = async (req, res) => {
  try {
    const session_id = req.session_id;
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    date_ob =
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    await pool.query(
      `UPDATE sessionDetails SET end_time='${date_ob}' WHERE session_id='${session_id}';`
    );
    res.send("You are logged out succesfully.");
  } catch (error) {
    res.send(error);
  }
};
