import express, { Application, urlencoded, Request, Response } from 'express'
import  path, { dirname }  from "node:path"
import { fileURLToPath } from 'node:url';
import routerAuth from './routes/authRoutes.js'; // .js / .mjs / .cjs
import routerToDo from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import dotenv from "dotenv"

dotenv.config()
const app: Application = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);  


// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'../public')))



app.get("/",(req: Request, res: Response) => {
    res.sendFile(path.join(__dirname,'../public','index.html'));
})

// Routes
app.use('/auth',routerAuth);
app.use('/todos',authMiddleware,routerToDo);


app.listen(PORT, () => {
    console.log(` server running on http://localhost:${PORT}`);
})