import { Hono } from "hono"
import imports from "./imports"
import sqlite from "./sqlite"
import neo4j from "./neo4j"

const app = new Hono()

app.route("/imports", imports)
app.route("/sqlite", sqlite)
app.route("/neo4j", neo4j)

export default app
