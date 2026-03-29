import { app } from "./src/app.js";
import { connectDB } from "./src/DB/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`App is running on https://localhost:${port}`)
    })}
)

.catch((err) => {
    console.error("app couldn't be launched...")
    console.error(err)
})

