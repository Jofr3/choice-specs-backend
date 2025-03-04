import { Hono } from "hono"
import imports from "./imports"
import sqlite from "./sqlite"

const app = new Hono()

app.route("/imports", imports)
app.route("/sqlite", sqlite)

export default app
