import { connectToMongoDB } from "@/lib/mongodb"
import { User } from "@/models/user"
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
      res.status(409).json({
        status: 'fail',
        message: 'validation error'
      })
    }
  }
  // res.setHeader('Set-Cookie', 'myCookie=exampleValue; Path=/; HttpOnly')
  res.status(200).json({ name: 'John Doe' })
}
