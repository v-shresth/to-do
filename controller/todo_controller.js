const { Pool } = require("pg");
const pool_conf = require("../database.json");
let pool = new Pool(pool_conf["dev"]);

function currDate() {
  return Date.now();
}

exports.Create = async (req, res) => {
  try {
    const user_id = req.id;
    await pool.query(`INSERT
                        INTO work(task, created_on, deadline, user_id)
                        VALUES ('${req.body.task}', '${currDate()}', '${
      req.body.deadline
    }', '${user_id}')`);
    res.send("To do Added Succesfully");
  } catch (error) {
    res.status(401).send("We can't create user");
  }
};

exports.Read = async (req, res) => {
  try {
    let { offset = 0 } = req.query;
    const user_id = req.id;
    const search = await pool.query(`with cte_count as (select *
                            from work
                            where user_id = '${user_id}' and archieved = false)
            select *
            from cte_count
                inner join (select count(*) from cte_count) as sub_count on true
            order by deadline limit 5 offset '${offset}';`);
    let out = {
      total_count: Number(search.rows[0].count),
      data: search.rows,
    };
    res.send(out);
  } catch (error) {
    res.send(error);
  }
};

exports.Update = async (req, res) => {
  try {
    const user_id = req.id;
    await pool.query(`UPDATE work
                SET task='${req.body.task}',
                    updated_at='${currDate()}',
                    deadline='${req.body.deadline}',
                    work_status='${req.body.work_status}'
                WHERE work_id = ${req.params.work_id}
                and user_id = ${user_id};`);
    res.send("Updated Succesfully");
  } catch (error) {
    res.status(401).send("We can't update");
  }
};

exports.Delete = async (req, res) => {
  try {
    const user_id = req.id;
    await pool.query(`UPDATE work
                SET archieved= true,
                    archived_at='${currDate()}'
                WHERE work_id = ${req.params.work_id}
                and user_id = ${user_id}
                and archieved = false;`);
    res.send("Deleted Succesfully");
  } catch (error) {
    res.status(401).send("We can't delete");
  }
};
