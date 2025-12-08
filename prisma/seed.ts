import { PrismaClient, UserRole, SkillCategory, OpportunityType, MediaType, ProjectVisibility, VerificationStatus } from '@prisma/client'
import { mockLearnerProfile, mockTrendingSkills, mockOpportunities, mockProjects } from '../lib/mock-data'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Seed Skills
    console.log('Seeding skills...')
    for (const skill of mockTrendingSkills) {
        const trending = skill.trending;
        await prisma.skill.upsert({
            where: { name: skill.name },
            update: {},
            create: {
                name: skill.name,
                category: skill.category as SkillCategory,
                verified: skill.verified,
                trending: !!trending,
                trendingData: trending ? {
                    create: {
                        demandPercentage: trending.demandPercentage,
                        growthRate: trending.growthRate,
                        averageSalary: trending.averageSalary,
                        openPositions: trending.openPositions,
                    }
                } : undefined
            },
        })
    }

    // 2. Seed Main User
    console.log('Seeding main user...')
    const mainUser = await prisma.user.upsert({
        where: { email: mockLearnerProfile.email },
        update: {},
        create: {
            id: mockLearnerProfile.id,
            email: mockLearnerProfile.email,
            name: mockLearnerProfile.name,
            passwordHash: 'hashed_password_placeholder', // In real app, hash this
            role: UserRole.student,
            avatar: mockLearnerProfile.avatar,
            learnerProfile: {
                create: {
                    bio: mockLearnerProfile.bio,
                    location: mockLearnerProfile.location,
                    university: mockLearnerProfile.university,
                    major: mockLearnerProfile.major,
                    graduationYear: mockLearnerProfile.graduationYear,
                    skillsMatchPercentage: mockLearnerProfile.skillsMatchPercentage,
                    verificationStatus: VerificationStatus.verified
                }
            }
        },
    })

    // 3. Seed Opportunities
    console.log('Seeding opportunities...')
    for (const opp of mockOpportunities) {
        await prisma.opportunity.create({
            data: {
                title: opp.title,
                company: opp.company,
                companyLogo: opp.companyLogo,
                type: opp.type as OpportunityType,
                location: opp.location,
                remote: opp.remote,
                description: opp.description,
                salaryMin: opp.salary?.min,
                salaryMax: opp.salary?.max,
                postedDate: new Date(opp.postedDate),
                applicationUrl: opp.applicationUrl,
                // Connect skills if they exist, otherwise ignore for now to avoid errors
                skills: {
                    create: opp.skills.map(skillName => ({
                        skill: {
                            connectOrCreate: {
                                where: { name: skillName },
                                create: {
                                    name: skillName,
                                    category: SkillCategory.technical // Default
                                }
                            }
                        }
                    }))
                },
                requirements: {
                    create: opp.requirements.map((req, index) => ({
                        requirement: req,
                        displayOrder: index
                    }))
                }
            }
        })
    }

    // 4. Seed Projects
    console.log('Seeding projects...')
    for (const proj of mockProjects) {
        await prisma.project.create({
            data: {
                userId: mainUser.id,
                title: proj.title,
                description: proj.description,
                visibility: ProjectVisibility.public,
                verified: proj.verified,
                githubUrl: proj.githubUrl,
                liveUrl: proj.liveUrl,
                startDate: new Date(proj.startDate),
                endDate: proj.endDate ? new Date(proj.endDate) : null,
                media: {
                    create: proj.media.map(m => ({
                        type: MediaType.image,
                        url: m.url,
                        caption: m.caption
                    }))
                }
            }
        })
    }

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
