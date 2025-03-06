import { Hono } from "hono"

const app = new Hono()

import neo4j from "neo4j-driver"

const URI = 'neo4j://localhost:7687'
const USER = 'neo4j'
const PASSWORD = '12345678'

app.get("/conn", async (c) => {

  try {
    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    const info = await driver.getServerInfo()

    driver.close()
    return c.json({ success: true, result: info })
  } catch (error) {
    return c.json({ success: false, error: error })
  }
})

app.get("/adduser/:name", async (c) => {
  const name = c.req.param("name")

  try {
    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    const session = driver.session({ database: 'neo4j' })
    await session.executeWrite(async t => {
      await t.run(
        'CREATE (p:User {name: $name})',
        { name: name }
      )
    })

    session.close()
    driver.close()
    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: error })
  }
})

app.get("/user/:name", async (c) => {
  const name = c.req.param("name")

  try {
    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    const { records } = await driver.executeQuery(
      'MATCH (p:User {name: $name}) RETURN p.name AS name',
      { name: name },
      { database: 'neo4j' }
    )

    driver.close()
    return c.json({ success: true, records })
  } catch (error) {
    return c.json({ success: false, error: error })
  }
})

app.get("/users", async (c) => {
  try {
    const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    const { records } = await driver.executeQuery(
      'MATCH (p:User) RETURN p.name AS name',
      { database: 'neo4j' }
    )

    driver.close()
    return c.json({ success: true, records })
  } catch (error) {
    return c.json({ success: false, error: error })
  }
})


export default app
