import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import faqRoutes from './Routes/faqRoutes.js'



const app = express();

app.use(express.json());

app.use("/api/faqs", faqRoutes)


app.listen(3000, ()=> console.log("Server is running on port 3000"));