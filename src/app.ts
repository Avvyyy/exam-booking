import { config } from './config/config';
import express from 'express';
import cors from "cors";
import type { Application } from "express";
import { swaggerDocs } from "./docs/swagger";
import { errorHandler } from './middleware/error-handler';
import authRoutes from './features/auth/routes';
import userRoutes from './features/user/routes';
import examRoutes from './features/exam/routes';
import rescheduleRoutes from './features/reschedule/routes';

const app: Application = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://exma-rr6x.onrender.com",
    "https://exma-rr6x.onrender.com/api-docs",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://localhost:5000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/exams', examRoutes);
app.use('/reschedule', rescheduleRoutes);

swaggerDocs(app);
app.use(errorHandler);

const port = config.port || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});