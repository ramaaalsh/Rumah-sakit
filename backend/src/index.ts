import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config()
const app = express()

const PORT = process.env.PORT || 5000

app.use(cors()) // biar frontend bisa ngirim req ke backend dan ngembaliin res ke frontend
app.use(express.json()) // biar bisa ngirim payload 

app.get('/', (req,res) => {
    res.json({message : 'API rumah sakit berjalan!'})
})

app.listen(PORT, () => {
    console.log(`server berjalan di http://localhost:${PORT}`)
})

