import db from "../client.js";

export async function createTask(title, done, userId) {
  const sql = `
        INSERT INTO tasks
            (title, done, user_id)
        VALUES
            ($1, $2, $3)
        RETURNING *
    `;
  const { rows } = await db.query(sql, [title, done, userId]);
  return rows[0];
}
