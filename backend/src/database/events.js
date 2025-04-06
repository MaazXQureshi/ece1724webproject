const {
  PrismaClient,
  PrismaClientKnownRequestError,
} = require("@prisma/client");
const prisma = new PrismaClient();

const dbOperations = {
  createEvent: async (eventData) => {
    try {
      const event = await prisma.event.create({
        data: {
          name: eventData.name,
          time: eventData.time,
          location: eventData.location,
          info: eventData.info,
          hours: eventData.hours,
          imageUrl: eventData.imageUrl,
          clubId: eventData.clubId, // assuming the orgId must be valid at this point
        },
      });

      return event;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  getAllEvents: async (filters = {}) => {
    try {
      // filters
      // - name: string (partial match)
      // - date: either date or time match
      // - location: string (partial match)
      // - hours: number
      // - tags: find all organizers associated with the tag (exact match)
      // - limit: number (default: 10)
      // - offset: number (default: 0)

      const {
        name,
        date,
        location,
        tags,
        hours,
        limit = 10,
        offset = 0,
        userId,
        clubId,
      } = filters;
      const where = {};

      if (tags && tags.length > 0) {
        let orgIdsWithTags = [];
        const tagFilter = Array.isArray(tags) ? tags : [tags];
        const orgMatches = await prisma.orgTag.findMany({
          where: {
            tag: {
              name: { in: tagFilter },
            },
          },
          select: {
            orgId: true,
          },
          distinct: ["orgId"],
        });

        orgIdsWithTags = orgMatches.map((orgMatched) => orgMatched.orgId);
        console.log(orgMatches);

        where.clubId = {
          in: orgIdsWithTags,
        };
      }

      if (clubId) {
        where.clubId = Number(clubId);
      }

      if (name) {
        where.name = {
          contains: name,
          mode: "insensitive",
        };
      }

      if (location) {
        where.location = {
          contains: location,
          mode: "insensitive",
        };
      }

      if (hours) {
        where.hours = hours;
      }

      if (date) {
        let startOfDay = new Date(date);
        let endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        where.time = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }

      // For user registrations
      if (userId) {
        where.registrations = {
          some: { userId: Number(userId) },
        };
      }

      console.log("User id to fetch events for: ", userId);

      const total = await prisma.event.count({ where });

      const events = await prisma.event.findMany({
        where,
        include: {
          organizer: {
            include: {
              orgTags: {
                include: {
                  tag: true,
                },
              },
            },
          },
          registrations: true,
        },
        take: limit,
        skip: offset,
        orderBy: { id: "asc" },
      });

      return { events, total, limit, offset };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getEventById: async (eventId) => {
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          organizer: {
            include: {
              orgTags: {
                include: {
                  tag: true,
                },
              },
            },
          },
          registrations: true,
        },
      });

      return event;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  updateEvent: async (eventId, eventData) => {
    try {
      console.log(eventData);
      const event = await prisma.event.update({
        where: { id: eventId },
        data: {
          name: eventData.name,
          time: eventData.time,
          location: eventData.location,
          info: eventData.info,
          hours: eventData.hours,
          imageUrl: eventData.imageUrl,
          clubId: eventData.clubId, // Organizer ID
        },
        include: {
          organizer: {
            include: {
              orgTags: {
                include: {
                  tag: true,
                },
              },
            },
          },
          registrations: true,
        },
      });

      return event;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteEvent: async (eventId) => {
    try {
      // delete registrations, not needed if event is deleted
      await prisma.register.deleteMany({
        where: { eventId },
      });

      // delete event
      await prisma.event.delete({
        where: { id: eventId },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  respondToEvent: async (userId, eventId) => {
    try {
      // check if the user and event ids exist
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event || !user) {
        throw new Error(`Invalid userId or eventId`);
      }

      // check if registration exists
      const registration = await prisma.register.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      if (registration) {
        throw new Error(`Registration already exists`);
      }

      const response = await prisma.register.create({
        data: { userId, eventId },
        include: {
          event: true,
          user: true,
        },
      });

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  unregisterEvent: async (userId, eventId) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event || !user) {
        throw new Error(`Invalid userId or eventId`);
      }

      // check if registration exists
      const registration = await prisma.register.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      if (!registration) {
        throw new Error(`Registration does not exist`);
      }

      const response = await prisma.register.delete({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = {
  ...dbOperations,
};
