import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from "crypto"
import { AddressSchema } from './address'
import { CardSchema } from './card'
import { JWT_SECRET, JWT_EXPIRES } from '@/utils/config'

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [30, 'Your name cannot exceed 30 characters'],
  },
  googleId: String,
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    maxlength: 200,
    unique: true,
    validate: [validator.isEmail, 'Please enter valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [5, 'Password cannot be less than 5 characters'],
    select: false
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  passwordChangedAt: Date, // this property is created on the document object when the user changes their password
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  refreshToken: {
    type: String
  },
  deliveryAddress: [AddressSchema],
  creditCards: [CardSchema]
})

// note: the pre save hook does not run for functions like findAndUpdate() even if the password was modified
UserSchema.pre('save', async function (next) {
  // if the password is not modified then I dont't have to encrypt it
  // scenario 1: registering for the first time, (!1) = 0 means the password is going to be hased
  // scenario 2: updating the user password, (!1) = means that the user password should be hashed or encrypted
  // scenario 3: resetting the user password, (!1) = means that the user password should be hashed
  // scenario 4: I saved a document / modified a user document, (!0) = means that nothing should happen to the password
  if (!this.isModified('password')) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// note: the pre save hook does not run for functions like findAndUpdate() even if the password was modified
UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()
  // scenario 1: registering for the first time, (!1 || 1) = (0 || 1) = 1 exit the function
  // scenario 2: updating the user password, (!1 || 0) = (0 || 0) = 0 update the passwordChangedAt property
  // scenario 3: resetting user password, (!1 || 0) = (0 || 0) = 0 means update the passwordChangedAt property
  // scenario 4: the password is not modified (!0 || 0) = (1 || 0) = 1 means the passwordChangedAt 

  /**
   * if isModified is true then continue running the code
   * isNew means is the document new
   * if the password has not been modified then( !false = true) || isNew = true
   *
   * exit the function (if the password has not been modified or the document is new )
   */

  /**
   * some times the token would be issued to the user before the passwordChangedAt property is saved to the DB, so this code here is to make sure that atleast 1.5seconds is subtracted from the passwordChangedAt time because if the jwt < passwordChangedAt then it means that the user changed the password after the token was issued
   * */
  this.passwordChangedAt = new Date(Date.now() - 1500)
  next()
})

// /^find/ means that any query that starts with find
UserSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.find({ active: { $ne: false } })

  next()
})

UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  })
}

UserSchema.methods.comparePassword = async function (password) {
  const auth = await bcrypt.compare(password, this.password)

  return auth
}

// check if the user changed thier password after the token was issued
UserSchema.methods.changedPasswordAfter = function (JwtTimestamp) {
  if (this.passwordChangedAt) {

    // @ts-ignore
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

    // logger.info(JwtTimestamp, changedTimestamp)
    return JwtTimestamp < changedTimestamp
  }

  return false
}

// generate password reset token
UserSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

  return resetToken
}


export const User = mongoose.models.User ? mongoose.models.User : mongoose.model('User', UserSchema)