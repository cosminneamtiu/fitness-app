import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.fitnessClass.createMany({
    data: [
      {
        name: 'Morning Yoga',
        description: 'Start your day with calming yoga.',
        instructorName: 'Alice Johnson',
        schedule: new Date('2025-04-15T07:00:00'),
        duration: 60,
        capacity: 20,
        location: 'Studio A',
        difficulty: 'Beginner',
        classType: 'Yoga',
      },
      {
        name: 'HIIT Blast',
        description: 'High intensity interval training.',
        instructorName: 'Mark Thompson',
        schedule: new Date('2025-04-15T18:00:00'),
        duration: 45,
        capacity: 15,
        location: 'Studio B',
        difficulty: 'Advanced',
        classType: 'HIIT',
      },
      {
        name: 'Pilates Core',
        description: 'Strengthen your core and flexibility.',
        instructorName: 'Sara Kim',
        schedule: new Date('2025-04-16T10:00:00'),
        duration: 50,
        capacity: 18,
        location: 'Studio C',
        difficulty: 'Intermediate',
        classType: 'Pilates',
      },
      {
        name: 'Zumba Dance',
        description: 'Dance your way to fitness.',
        instructorName: 'Carlos Rivera',
        schedule: new Date('2025-04-17T17:00:00'),
        duration: 55,
        capacity: 25,
        location: 'Main Hall',
        difficulty: 'All Levels',
        classType: 'Zumba',
      },
      {
        name: 'Evening Stretch',
        description: 'Relax and stretch your body.',
        instructorName: 'Luna Park',
        schedule: new Date('2025-04-17T20:00:00'),
        duration: 40,
        capacity: 10,
        location: 'Studio A',
        difficulty: 'Beginner',
        classType: 'Stretching',
      },
      {
        name: 'Box Fit',
        description: 'Boxing-inspired fitness class.',
        instructorName: 'Jake Miller',
        schedule: new Date('2025-04-18T19:00:00'),
        duration: 60,
        capacity: 16,
        location: 'Studio D',
        difficulty: 'Advanced',
        classType: 'Boxing',
      },
      {
        name: 'Power Lifting',
        description: 'Build strength with focused lifting.',
        instructorName: 'Nina Sanders',
        schedule: new Date('2025-04-19T14:00:00'),
        duration: 90,
        capacity: 12,
        location: 'Gym Room',
        difficulty: 'Advanced',
        classType: 'Strength',
      },
      {
        name: 'Cycle Burn',
        description: 'Cardio cycling workout.',
        instructorName: 'Tom Evans',
        schedule: new Date('2025-04-19T09:00:00'),
        duration: 45,
        capacity: 22,
        location: 'Cycle Room',
        difficulty: 'Intermediate',
        classType: 'Cycling',
      },
      {
        name: 'Body Balance',
        description: 'Improve posture and flexibility.',
        instructorName: 'Hannah Lee',
        schedule: new Date('2025-04-20T11:00:00'),
        duration: 50,
        capacity: 20,
        location: 'Studio C',
        difficulty: 'All Levels',
        classType: 'Stretching',
      },
      {
        name: 'Functional Training',
        description: 'Train for real-life movement.',
        instructorName: 'Chris Walker',
        schedule: new Date('2025-04-20T16:00:00'),
        duration: 60,
        capacity: 14,
        location: 'Training Zone',
        difficulty: 'Intermediate',
        classType: 'CrossFit',
      },
    ],
  })

  console.log('✅ 10 Fitness classes created!')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
