import express from 'express';
import 'dotenv/config';
import  connectDb  from './utils/db.js';
import router from './routers/userRoutes.js';

const app = express();
app.use(express.json());

app.use('/api',router)


const port = process.env.PORT || 8080;

connectDb().then(()=>{
    app.listen(port, () => console.log(`Server is running at port: ${port}`));
})


