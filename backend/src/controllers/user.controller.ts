import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import asyncHandler from '../../utils/asyncHandler'
import ApiError from '../../utils/ApiError'
import ApiResponse from '../../utils/ApiResponse'

const prisma = new PrismaClient()

interface RegisterRequest extends Request {
  body: {
    name: string
    email: string
    username: string
    password: string
  }
}

const registerUser = asyncHandler(
  async (req: RegisterRequest, res: Response) => {
    const { name, email, username, password } = req.body

    if (!(name && email && username && password)) {
      throw new ApiError(400, 'Please enter all required fields')
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      throw new ApiError(400, 'User Already exists')
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
    })

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'aFallbackSecret',
      { expiresIn: '1d' }
    )

    res
      .status(201)
      .json(new ApiResponse(true, 'User Created Successfully', { user, token }))
  }
)

export { registerUser }
