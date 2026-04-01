import express from "express"
import authRouter from "./routes/auth.routes.js"
import userServicesRouter from "./routes/users.routes.js"

const app = express()

//json config
app.use(express.json({ limit: "16kb" }));


//express routes
app.get("/", (req, res )=> {res.send("yooo")})

//auth
app.use("/api/v1/auth", authRouter)

//user services
app.use("/api/v1/users", userServicesRouter)


//global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        success: false,
        statusCode,
        message: err.message || "something went wrong",
        errors: err.errors || []
    })
})

export { app }