import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json({ limit: '16kb' }))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

// Routes
app.get('/test', (req, res) => {
  res.send('Test')
})

export default app
