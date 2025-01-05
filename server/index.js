import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js"
import morgan from 'morgan';
import mongoConnect from './config/db.js';

dotenv.config();
const app = express();


mongoConnect();


app.use(express.json());
app.use(cors()); 
app.use(morgan('dev'));


app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to joinSphere');
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
