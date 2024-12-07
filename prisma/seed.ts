import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const subjects = [
  { name: 'SCIENCE', description: 'Explore the fundamentals of physics, chemistry, and biology.' },
  { name: 'MANAGEMENT', description: 'Learn business strategies, leadership, and management practices.' },
  { name: 'LANGUAGE CLASSES', description: 'Enhance your communication skills in various languages.' },
  { name: 'BASIC COMPUTER CLASS', description: 'Learn the essentials of computer operation and usage.' },
  {
    name: 'OFFICE PACKAGE COMPUTER CLASS',
    description: 'Master Microsoft Office tools like Word, Excel, and PowerPoint.'
  },
  { name: 'WEB DEVELOPMENT', description: 'Build dynamic websites with HTML, CSS, JavaScript, and more.' },
  { name: 'APP DEVELOPMENT', description: 'Create mobile applications for iOS and Android platforms.' },
  { name: 'HA', description: 'Comprehensive training for health assistants.' },
  { name: 'LAB', description: 'Practical lab training for scientific and medical fields.' },
  { name: 'STAFF NURSE PREPARATION', description: 'Prepare for staff nurse certification and exams.' }
]

const seed = async () => {
  try {
    for (const subject of subjects) {
      await prisma.subject.upsert({
        where: { name: subject.name },
        update: {},
        create: subject
      })
    }

    console.log('Subjects seeded successfully.')
  } catch (error) {
    console.error('Error seeding data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
