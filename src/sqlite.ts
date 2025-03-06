import { Hono } from "hono"
import { Database } from "bun:sqlite"

const app = new Hono()

app.get("/populate", (c) => {
  const db = new Database("db.sqlite", { create: true })
  db.run("BEGIN TRANSACTION");

  try {
    const tables = [
      {
        name: "users",
        properties: [
          "id INTEGER PRIMARY KEY AUTOINCREMENT",
          "name TEXT",
        ]
      },
      {
        name: "pokemon",
        properties: [
          "id INTEGER PRIMARY KEY AUTOINCREMENT",
          "name TEXT",
        ]
      },
    ]

    for (const table of tables) {
      db.run(`CREATE TABLE IF NOT EXISTS ${table.name} (
        ${table.properties.join(", ")}
      );`)
    }

    db.run("COMMIT");
    db.exec("PRAGMA journal_mode = WAL;")

    return c.json({ success: true })
  } catch (error) {

    db.run("ROLLBACK");
    return c.json({ success: false, error })
  } finally {
    db.close();
  }
})


app.get("/seeder", (c) => {
  const db = new Database("db.sqlite")
  db.run("BEGIN TRANSACTION");

  try {
    const users = [
      { name: "Jofre" },
      { name: "Fredo" },
      { name: "Jaume" }
    ]

    const insert = db.prepare(`
      INSERT INTO users (name) 
      VALUES ($name);
    `);

    for (const user of users) {
      insert.run({
        $name: user.name,
      });
    }

    db.run("COMMIT");
    return c.json({ success: true })
  } catch (error) {
    db.run("ROLLBACK");
    return c.json({ success: false, error })
  } finally {
    db.close();
  }
})

app.get("/tables", (c) => {
  try {
    const db = new Database("db.sqlite")
    const result = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence' ORDER BY name;").all()

    return c.json({ success: true, result })
  } catch (error) {
    return c.json({ success: false, error })
  }
})

app.get("/query/:query", (c) => {
  const query = c.req.param("query")

  try {
    const db = new Database("db.sqlite")
    const result = db.query(`${query};`).all()

    return c.json({ success: true, result })
  } catch (error) {
    return c.json({ success: false, error })
  }
})

export default app
