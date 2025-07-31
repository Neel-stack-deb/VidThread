import {express} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


export const app = express();

app.use(cors(
  {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());