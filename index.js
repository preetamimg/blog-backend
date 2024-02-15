import express from 'express'
import bodyParser from 'body-parser'
import './db/config.js'
import dotenv from 'dotenv'
import cors from 'cors'
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import CategoryRoutes from './router/CategoryRoutes.js'
import AuthRoutes from './router/AuthRoutes.js'
import AdminRoutes from './router/AdminRoutes.js'
import BlogUserRoutes from './router/BlogUserRoutes.js'
import TagRoutes from './router/TagRoutes.js'
import BlogRoutes from './router/BlogRoutes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors())
// app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(join(__dirname, 'public')));

// middlewares
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))


app.listen(8000,()=> console.log('listining to server on port 8000'))

app.use('/category', CategoryRoutes)
app.use('/auth', AuthRoutes)
app.use('/admin', AdminRoutes)
app.use('/blogUser', BlogUserRoutes)
app.use('/tag', TagRoutes)
app.use('/blog', BlogRoutes)


