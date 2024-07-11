import express from 'express';
import 'dotenv/config';
import  connectDb  from './utils/db.js';

const app = express();
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello Gautam');
});


const port = process.env.PORT || 8080;

connectDb().then(()=>{
    app.listen(port, () => console.log(`Server is running at port: ${port}`));
})

