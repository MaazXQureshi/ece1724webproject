const {PrismaClient} = require('@prisma/client');
const {faker} = require('@faker-js/faker');
const {addDays} = require('date-fns');

const prisma = new PrismaClient();

// Sample data configuration
const ORGANIZERS = [
  {name: 'Red Cross', tags: ['disaster', 'health', 'community']},
  {name: 'Habitat for Humanity', tags: ['community', 'construction']},
  {name: 'Food Bank', tags: ['hunger', 'community']},
  {name: 'Animal Shelter', tags: ['animals', 'care']},
  {name: 'Community Garden', tags: ['environment', 'gardening']},
  {name: 'Beach Cleanup Org', tags: ['environment', 'outdoors']},
  {name: 'Youth Mentorship', tags: ['education', 'children']},
  {name: 'Senior Helpers', tags: ['seniors', 'companionship']},
  {name: 'Literacy Program', tags: ['education', 'literacy']},
  {name: 'Hospital Volunteers', tags: ['health', 'care']}
];

const LOCATIONS = [
  'Main Community Center, 123 Main St',
  'Central Park, Downtown',
  'City Public Library',
  'Northside Beach',
  'Animal Care Facility',
  'Food Distribution Warehouse',
  'Lincoln High School',
  'General Hospital',
  'Golden Years Senior Center',
  'Online/Virtual'
];

const EVENT_TYPES = [
  {prefix: 'Cleanup', tags: ['environment'], hours: [2, 4]},
  {prefix: 'Food Distribution', tags: ['hunger'], hours: [3, 5]},
  {prefix: 'Tutoring', tags: ['education'], hours: [1, 2]},
  {prefix: 'Companion Visit', tags: ['seniors'], hours: [1, 3]},
  {prefix: 'Animal Care', tags: ['animals'], hours: [2, 4]},
  {prefix: 'Disaster Relief', tags: ['disaster'], hours: [4, 8]},
  {prefix: 'Health Clinic', tags: ['health'], hours: [3, 6]},
  {prefix: 'Workshop', tags: ['education'], hours: [2, 3]},
  {prefix: 'Fundraiser', tags: ['community'], hours: [2, 5]},
  {prefix: 'Mentorship', tags: ['education'], hours: [1, 2]}
];

async function clearDatabase() {
  console.log('Clearing existing data...');
  // Delete in order of foreign key dependencies
  await prisma.register.deleteMany();
  await prisma.event.deleteMany();
  await prisma.orgTag.deleteMany();
  await prisma.organizer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tag.deleteMany();
  console.log('Database cleared.');
}

async function seedDatabase() {
  console.log('Starting database seeding...');

  // 0. CLEAR EXISTING DATA
  await clearDatabase();

  // 1. Create Tags
  const allTags = Array.from(new Set(ORGANIZERS.flatMap(org => org.tags)));
  await prisma.tag.createMany({
    data: allTags.map(name => ({name})),
    skipDuplicates: true
  });
  const tags = await prisma.tag.findMany();

  // 2. Create Admin Users and Organizers
  const organizers = await Promise.all(
    ORGANIZERS.map(async orgData => {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email({firstName: orgData.name.split(' ')[0]}),
          username: faker.internet.userName({firstName: orgData.name.split(' ')[0]}),
          admin: true,
          passwordHash: '$2a$10$dummyhashforseedingonly' // In real app, hash real passwords
        }
      });

      const organizer = await prisma.organizer.create({
        data: {
          name: orgData.name,
          info: faker.lorem.paragraph(),
          email: faker.internet.email({provider: `${orgData.name.toLowerCase().replace(/\s/g, '')}.org`}),
          phone: faker.phone.number(),
          imageUrl: faker.image.urlLoremFlickr({category: 'organization'}),
          adminId: user.id
        }
      });

      // Create OrgTag relationships
      const orgTags = orgData.tags.map(tagName => {
        const tag = tags.find(t => t.name === tagName);
        return {orgId: organizer.id, tagId: tag.id};
      });

      await prisma.orgTag.createMany({
        data: orgTags
      });

      return organizer;
    })
  );

  // 3. Create Regular Users (non-admin)
  const users = await Promise.all(
    Array.from({length: 20}).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.userName(),
          admin: false,
          passwordHash: '$2a$10$dummyhashforseedingonly'
        }
      })
    )
  );

  // 4. Create 50 Events
  const events = await Promise.all(
    Array.from({length: 50}).map(async (_, i) => {
      const eventType = faker.helpers.arrayElement(EVENT_TYPES);
      const organizer = faker.helpers.arrayElement(organizers);
      const eventDate = addDays(new Date(), faker.number.int({min: 1, max: 90}));

      return prisma.event.create({
        data: {
          name: `${eventType.prefix}: ${faker.lorem.words(2)}`,
          time: eventDate,
          location: faker.helpers.arrayElement(LOCATIONS),
          info: faker.lorem.paragraphs(2),
          hours: faker.number.int({min: eventType.hours[0], max: eventType.hours[1]}),
          imageUrl: faker.image.urlLoremFlickr({category: 'volunteer'}),
          clubId: organizer.id
        }
      });
    })
  );

  // 5. Create some registrations
  const registrations = [];
  const registrationSet = new Set();

  for (let i = 0; i < 100; i++) {
    const user = faker.helpers.arrayElement(users);
    const event = faker.helpers.arrayElement(events);
    const registrationKey = `${user.id}-${event.id}`;

    if (registrationSet.has(registrationKey)) {
      continue;
    }

    try {
      const registration = await prisma.register.create({
        data: {
          userId: user.id,
          eventId: event.id
        }
      });
      registrations.push(registration);
      registrationSet.add(registrationKey);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`Skipping duplicate registration: User ${user.id} for Event ${event.id}`);
        continue;
      }
      throw error;
    }
  }

  console.log('Database seeded successfully!');
  console.log(`Created:
    - ${tags.length} tags
    - ${organizers.length} organizers with admin users
    - ${users.length} regular users
    - ${events.length} events
    - 100 event registrations`);
}

seedDatabase()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });