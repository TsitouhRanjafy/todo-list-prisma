import express from 'express';
import path, { dirname } from "node:path";
import { fileURLToPath } from 'node:url';
import routerAuth from './routes/authRoutes.js'; // .js / .mjs / .cjs
import routerToDo from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import { env } from './config/env.js';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
// Routes
app.use('/auth', routerAuth);
app.use('/todos', authMiddleware, routerToDo);
app.get("/", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public', 'salama.html'));
        return;
    }
    catch (error) {
        console.error("Erreurs lors '/'", error);
        throw error;
    }
});
app.listen(env().port, () => {
    console.log(`   on http://localhost:${env().port}`);
});
export default app;
