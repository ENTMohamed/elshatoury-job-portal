import { PrismaClient } from '@prisma/client'
import cloudinary from '../lib/cloudinary'
import { hash, compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Test admin user exists
    const admin = await prisma.admin.findUnique({
      where: { email: 'admin@elshatoury.com' }
    })
    if (admin) {
      console.log('✅ Admin user exists')
      
      // Test password hash
      const validPassword = await compare('admin123secure', admin.password)
      if (validPassword) {
        console.log('✅ Admin password is correct')
      } else {
        console.log('❌ Admin password is incorrect')
      }
    } else {
      console.log('❌ Admin user not found')
    }
  } catch (error) {
    console.error('❌ Database test failed:', error)
  }
}

async function testCloudinary() {
  try {
    // Test Cloudinary configuration
    const { cloud_name } = cloudinary.config()
    if (cloud_name === process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.log('✅ Cloudinary configuration is correct')
    } else {
      console.log('❌ Cloudinary configuration mismatch')
    }
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error)
  }
}

async function testJWT() {
  try {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined')
    }

    // Test JWT signing
    const token = jwt.sign(
      { email: 'test@example.com' },
      jwtSecret,
      { expiresIn: '7d' }
    )
    
    // Test JWT verification
    const decoded = jwt.verify(token, jwtSecret)
    if (decoded) {
      console.log('✅ JWT signing and verification working')
    }
  } catch (error) {
    console.error('❌ JWT test failed:', error)
  }
}

async function runTests() {
  console.log('🔍 Starting system checks...\n')
  
  // Test database
  console.log('Testing Database:')
  await testDatabase()
  console.log()
  
  // Test Cloudinary
  console.log('Testing Cloudinary:')
  await testCloudinary()
  console.log()
  
  // Test JWT
  console.log('Testing JWT:')
  await testJWT()
  console.log()
  
  // Cleanup
  await prisma.$disconnect()
  console.log('✨ System checks completed')
  process.exit(0)
}

runTests() 