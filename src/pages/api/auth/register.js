import { connectToMongoDB } from "@/lib/mongodb"
import { User } from "@/models/user"
import jwt from "jsonwebtoken"
import { JWT_EXPIRES, JWT_SECRET } from "@/utils/config"
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(
  req,
  res
) {
  await connectToMongoDB().catch(err => res.json({ err }))

  if (req.method === 'POST') {
    if (!req.body) return res.status(400).json({ error: 'Missing credentials' })

    const { name, email, password, passwordChanged } = req.body

    const user = new User()
    user.name = name
    user.email = email
    user.password = password
    // user.passwordChangedAt = passwordChangedAt
    user.avatar = {
      public_id: 'avataaars_rkyikx',
      url: 'https://res.cloudinary.com/diggungrj/image/upload/v1668579345/avataaars_rkyikx.svg'
    }
    await user.save()

    if (!user) {
      return res.status(409).json({
        status: 'fail',
        message: 'validation error'
      })
    }
    // send token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES
    })

    return res.status(201).json({
      success: true,
      message: 'User created',
      data: {
        name: user.name,
        email: user.email,
        photo: user.photo,
        token
      }
    })
  } else {
    // res.setHeader('Set-Cookie', 'myCookie=exampleValue; Path=/; HttpOnly')
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
