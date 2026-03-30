import express from "express"

const app = express()

//json config
app.use(express.json({ limit: "16kb" }));


//express routes
app.get("/", (req, res )=> {res.send("yooo")})

export { app }