import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs' // Use bcrypt to hash passwords

const prisma = new PrismaClient()

async function main(): Promise<void> {
  try {
    // Hash passwords before storing them
    const hashedUsers = await Promise.all(
      userData.map(async user => ({
        ...user,
        role: user.role === 'ADMIN' ? UserRole.ADMIN : UserRole.NORMAL,
        password: await bcrypt.hash(user.password, 10), // Hash the password
      })),
    )

    for (const user of hashedUsers) {
      await prisma.user.create({
        data: user, // Create user
      })
    }

    console.log('Seeding Data Created!')
  } catch (error) {
    console.log('Error Creating Seed User Data')
    console.error(error)
  } finally {
    await prisma.$disconnect() // Ensure Prisma disconnects
  }
}

// Seed Data
const userData = [
  {
    username: 'alex123',
    password: 'alexi1234alexi', // Will be hashed
    role: 'ADMIN',
    articles: {
      create: [
        {
          title: 'Alex Biswas: My First Article',
          content: 'Lorem ipsum dolor sit amet...',
        },
        {
          title: 'Alex Biswas: My Second Article',
          content: 'Lorem ipsum dolor sit amet...',
        },
      ],
    },
  },
  {
    username: 'bobthebuilder',
    password: 'somehashedpassword', // Will be hashed
    role: 'NORMAL',
    articles: {
      create: [
        {
          title: 'Bob The Builder: My First Article',
          content: 'Lorem ipsum dolor sit amet...',
        },
        {
          title: 'Bob The Builder: My Second Article',
          content: 'Lorem ipsum dolor sit amet...',
        },
      ],
    },
  },
]

main()
