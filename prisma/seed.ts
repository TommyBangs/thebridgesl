import { PrismaClient, UserRole, SkillCategory, SkillLevel, CredentialType, Visibility, MediaType, OpportunityType, ApplicationStatus, ConnectionType, ConnectionRequestStatus, FeedItemType, Priority, NotificationType, VerificationStatus, EndorsementTarget } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // --- 1. Users ---
    const usersData = []
    const roles = [UserRole.STUDENT, UserRole.INSTITUTION, UserRole.EMPLOYER]

    for (let i = 1; i <= 25; i++) {
        usersData.push({
            email: `user${i}@example.com`,
            name: `User ${i}`,
            passwordHash: await bcrypt.hash('password', 10),

            role: roles[i % 3],
            onboarded: true,
            avatar: `https://i.pravatar.cc/150?u=user${i}`,
        })
    }

    // Create Users
    const users = []
    for (const u of usersData) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: u,
        })
        users.push(user)
    }
    console.log(`Created ${users.length} users`)

    // --- 2. Learner Profiles (for Students) ---
    const students = users.filter(u => u.role === UserRole.STUDENT)
    for (const student of students) {
        await prisma.learnerProfile.upsert({
            where: { userId: student.id },
            update: {},
            create: {
                userId: student.id,
                bio: `Passionate learner focused on technology and innovation. Student ID: ${student.id.substring(0, 4)}`,
                location: 'New York, USA',
                university: 'Tech University',
                major: 'Computer Science',
                graduationYear: 2024,
                skillsMatchPercentage: Math.floor(Math.random() * 100),
                verificationStatus: VerificationStatus.VERIFIED,
            }
        })
    }
    console.log(`Created profiles for ${students.length} students`)

    // --- 3. Skills ---
    const skillsData = [
        { name: 'React', category: SkillCategory.TECHNICAL },
        { name: 'Node.js', category: SkillCategory.TECHNICAL },
        { name: 'TypeScript', category: SkillCategory.TECHNICAL },
        { name: 'Python', category: SkillCategory.TECHNICAL },
        { name: 'Communication', category: SkillCategory.SOFT_SKILL },
        { name: 'Leadership', category: SkillCategory.SOFT_SKILL },
        { name: 'Project Management', category: SkillCategory.DOMAIN_KNOWLEDGE },
        { name: 'Figma', category: SkillCategory.TOOLS },
        { name: 'Spanish', category: SkillCategory.LANGUAGES },
        { name: 'PostgreSQL', category: SkillCategory.TECHNICAL },
        { name: 'Docker', category: SkillCategory.TOOLS },
        { name: 'AWS', category: SkillCategory.TECHNICAL },
        { name: 'Public Speaking', category: SkillCategory.SOFT_SKILL },
        { name: 'Data Analysis', category: SkillCategory.TECHNICAL },
        { name: 'Machine Learning', category: SkillCategory.TECHNICAL },
        { name: 'Git', category: SkillCategory.TOOLS },
        { name: 'Agile', category: SkillCategory.DOMAIN_KNOWLEDGE },
        { name: 'UI/UX Design', category: SkillCategory.TECHNICAL },
        { name: 'French', category: SkillCategory.LANGUAGES },
        { name: 'Marketing', category: SkillCategory.DOMAIN_KNOWLEDGE },
        { name: 'SEO', category: SkillCategory.TECHNICAL },
        { name: 'Content Writing', category: SkillCategory.SOFT_SKILL },
    ]

    const skills = []
    for (const s of skillsData) {
        const skill = await prisma.skill.upsert({
            where: { name: s.name },
            update: {},
            create: {
                ...s,
                trending: Math.random() > 0.5,
                verified: true,
            }
        })
        skills.push(skill)
    }
    console.log(`Created ${skills.length} skills`)

    // --- 4. User Skills ---
    for (const student of students) {
        // Assign 3-5 random skills to each student
        const numSkills = Math.floor(Math.random() * 3) + 3
        const shuffledSkills = [...skills].sort(() => 0.5 - Math.random())
        const selectedSkills = shuffledSkills.slice(0, numSkills)

        for (const skill of selectedSkills) {
            await prisma.userSkill.upsert({
                where: {
                    userId_skillId: {
                        userId: student.id,
                        skillId: skill.id
                    }
                },
                update: {},
                create: {
                    userId: student.id,
                    skillId: skill.id,
                    level: Object.values(SkillLevel)[Math.floor(Math.random() * 4)],
                    endorsements: Math.floor(Math.random() * 10),
                    verified: Math.random() > 0.3,
                }
            })
        }
    }
    console.log('Assigned skills to students')

    // --- 5. Credentials ---
    for (const student of students) {
        // Create 1-2 credentials per student
        const numCreds = Math.floor(Math.random() * 2) + 1
        for (let i = 0; i < numCreds; i++) {
            await prisma.credential.create({
                data: {
                    userId: student.id,
                    title: `Certificate in ${skills[Math.floor(Math.random() * skills.length)].name}`,
                    issuer: 'Tech University',
                    type: CredentialType.CERTIFICATION,
                    issueDate: new Date('2023-01-01'),
                    verified: true,
                    credentialSkills: {
                        create: {
                            skillId: skills[Math.floor(Math.random() * skills.length)].id
                        }
                    }
                }
            })
        }
    }
    console.log('Created credentials')

    // --- 6. Projects ---
    for (const student of students) {
        await prisma.project.create({
            data: {
                userId: student.id,
                title: `Project Alpha - ${student.name}`,
                description: 'A revolutionary app that solves real-world problems using AI and Blockchain.',
                visibility: Visibility.PUBLIC,
                verified: true,
                startDate: new Date('2023-05-01'),
                projectSkills: {
                    create: [
                        { skillId: skills[0].id },
                        { skillId: skills[1].id }
                    ]
                }
            }
        })
    }
    console.log('Created projects')

    // --- 7. Opportunities (Jobs) ---
    const employers = users.filter(u => u.role === UserRole.EMPLOYER)
    const opportunities = []

    if (employers.length > 0) {
        for (let i = 0; i < 20; i++) {
            const employer = employers[i % employers.length]
            const opp = await prisma.opportunity.create({
                data: {
                    title: `Senior Developer ${i + 1}`,
                    company: `Tech Corp ${i + 1}`,
                    type: OpportunityType.JOB,
                    location: i % 2 === 0 ? 'Remote' : 'San Francisco, CA',
                    remote: i % 2 === 0,
                    description: 'We are looking for a talented developer to join our team.',
                    salaryMin: 80000,
                    salaryMax: 150000,
                    postedDate: new Date(),
                    opportunitySkills: {
                        create: [
                            { skillId: skills[i % skills.length].id },
                            { skillId: skills[(i + 1) % skills.length].id }
                        ]
                    }
                }
            })
            opportunities.push(opp)
        }
    }
    console.log(`Created ${opportunities.length} opportunities`)

    // --- 8. Applications ---
    if (students.length > 0 && opportunities.length > 0) {
        for (let i = 0; i < 20; i++) {
            const student = students[i % students.length]
            const opp = opportunities[i % opportunities.length]

            await prisma.application.upsert({
                where: {
                    userId_opportunityId: {
                        userId: student.id,
                        opportunityId: opp.id
                    }
                },
                update: {},
                create: {
                    userId: student.id,
                    opportunityId: opp.id,
                    status: ApplicationStatus.APPLIED,
                    coverLetter: 'I am very interested in this role.',
                }
            })
        }
    }
    console.log('Created applications')

    // --- 9. Connections ---
    for (let i = 0; i < students.length - 1; i++) {
        const user1 = students[i]
        const user2 = students[i + 1]

        await prisma.connection.upsert({
            where: {
                userId_connectedUserId: {
                    userId: user1.id,
                    connectedUserId: user2.id
                }
            },
            update: {},
            create: {
                userId: user1.id,
                connectedUserId: user2.id,
                type: ConnectionType.PEER,
                mutualConnections: Math.floor(Math.random() * 10),
            }
        })

        // Create reverse connection
        await prisma.connection.upsert({
            where: {
                userId_connectedUserId: {
                    userId: user2.id,
                    connectedUserId: user1.id
                }
            },
            update: {},
            create: {
                userId: user2.id,
                connectedUserId: user1.id,
                type: ConnectionType.PEER,
                mutualConnections: Math.floor(Math.random() * 10),
            }
        })
    }
    console.log('Created connections')

    // --- 10. Feed Items ---
    for (const student of students) {
        await prisma.feedItem.create({
            data: {
                userId: student.id,
                type: FeedItemType.RECOMMENDATION,
                priority: Priority.MEDIUM,
                title: 'New Course Available',
                description: 'Check out this new React course tailored for you.',
            }
        })
    }
    console.log('Created feed items')

    // --- 11. Notifications ---
    for (const student of students) {
        await prisma.notification.create({
            data: {
                userId: student.id,
                type: NotificationType.OPPORTUNITY,
                title: 'New Job Match',
                message: 'A new job matching your skills has been posted.',
                read: false,
            }
        })
    }
    console.log('Created notifications')

    // --- 12. Career Paths ---
    for (const student of students) {
        await prisma.careerPath.create({
            data: {
                userId: student.id,
                currentRole: 'Junior Developer',
                targetRole: 'Senior Architect',
                estimatedDuration: 24,
                nodes: {
                    create: [
                        { stageNumber: 1, title: 'Mid-Level Developer', duration: 12 },
                        { stageNumber: 2, title: 'Senior Developer', duration: 12 }
                    ]
                }
            }
        })
    }
    console.log('Created career paths')

    // --- 13. Courses ---
    for (let i = 0; i < 20; i++) {
        await prisma.course.create({
            data: {
                title: `Mastering ${skills[i % skills.length].name}`,
                provider: 'Udemy',
                description: 'A comprehensive guide to mastering this skill.',
                duration: 20,
                level: SkillLevel.INTERMEDIATE,
                price: 1999, // 19.99
                url: 'https://udemy.com',
                courseSkills: {
                    create: {
                        skillId: skills[i % skills.length].id
                    }
                }
            }
        })
    }
    console.log('Created courses')

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
