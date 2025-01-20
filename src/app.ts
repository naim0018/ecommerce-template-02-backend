import express, { Express, Request, Response } from "express";
import cors from "cors";
import routes from "./app/router/router";
import { errorHandler } from "./app/middleware/errorHandler";
import notFound from "./app/middleware/notFound";

const app: Express = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use("/api/v1", routes);

// Handle 404
app.use(notFound);

// Error handling
app.use(errorHandler);

export default app;