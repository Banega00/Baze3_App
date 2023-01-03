import { config } from 'dotenv';
config();

import express from 'express';
import { db } from './database/connection';
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is up - listening on port: ${PORT} ✅`);
});

db.query('SELECT 1')