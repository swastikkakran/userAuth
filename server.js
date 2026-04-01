import dotenv from "dotenv";
import { connectDB } from "./src/DB/index.js";
import { app } from "./src/app.js";

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 3000

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`App is running on http://localhost:${port}`)
    })}
)

.catch((err) => {
    console.error("app couldn't be launched...")
    console.error(err)
    process.exit(1)
})

