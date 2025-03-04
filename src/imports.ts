import { Hono } from "hono"

const app = new Hono()

app.get("/test", (c) => {
  return c.text("Import test!")
})

export default app
