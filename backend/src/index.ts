import { config } from 'dotenv';
config();

import express from 'express';
import { db } from './database/connection';
import { main_router } from './routes/main.routes';
import cors from 'cors';

const app = express();

process.env.TZ = 'UTC'

app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 3000;

app.use(main_router)

app.listen(PORT, () => {
  console.log(`Server is up - listening on port: ${PORT} ✅`);
});

db.query('SELECT 1')
db.query("SET TIME ZONE 'UTC'", (err, result)=>{
  db.query("SHOW TIME ZONE", (err, result)=>{
    console.log(result.rows)
  })
})
