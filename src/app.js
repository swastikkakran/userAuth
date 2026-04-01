import express from "express"

const app = express()

//json config
app.use(express.json({ limit: "16kb" }));


//express routes
app.get("/", (req, res )=> {res.send("yooo")})

//auth
import authRouter from "./routes/auth.routes.js"
app.use("/api/v1/auth", authRouter)

//user services
import userServicesRouter from "./routes/users.routes.js"
app.use("/api/v1/users", userServicesRouter)

export { app }