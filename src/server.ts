import express, { Express } from "express";
import uploadRouter from "./controllers/upload-file.controller";
import employeeRouter from "./controllers/crud.controller";
import cityRouter from "./controllers/cities-crud.controller";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv'
dotenv.config();

const app: Express = express();
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    res.send('Firebase demo App of nodejs-db-demo Project.')
})

app.use('/upload', uploadRouter);
app.use('/employee', employeeRouter);
app.use('/city', cityRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
})