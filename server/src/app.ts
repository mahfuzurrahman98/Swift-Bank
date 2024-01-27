import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express, { Express, json } from 'express';
import router from './routes';
import CustomError from './utils/CustomError';

config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(json());
app.use(cors());
app.use(cookieParser());

// add publuc folder as static folder
app.use(express.static('public'));

// welcome message
app.get('/', (req: any, res: any) => {
    res.json({
        success: true,
        message: 'Welcome to the Smart banking',
    });
});

// use routes
app.use('/api/v1', router);

// add error handler
app.use((err: CustomError, req: any, res: any, next: any) => {
    res.status(err.getStatusCode() || 500).json({
        success: false,
        message: err.message || 'Something went wrong',
    });
});

app.listen(PORT, () => console.log(`app running on port ${PORT}`));

export default app;
