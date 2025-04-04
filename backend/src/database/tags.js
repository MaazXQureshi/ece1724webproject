const {
  PrismaClient,
  PrismaClientKnownRequestError,
} = require("@prisma/client");
const prisma = new PrismaClient();

const dbOperations = {
  getAllTags: async (filters = {}) => {
    try {
      // filters
      // - name: string (partial match)

      const { name, limit = 10, offset = 0 } = filters;
      const where = {};

      if (name) {
        where.name = {
          contains: name,
          mode: "insensitive",
        };
      }

      const total = await prisma.tag.count({ where });

      const events = await prisma.tag.findMany({
        where,
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
  createOrgTags: async (tags, orgId) => {
    try {
      if (tags.length > 0) {
        await prisma.orgTag.createMany({
          data: tags.map((tagId) => ({
            orgId,
            tagId,
          })),
          skipDuplicates: true,
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteOrgTags: async (id) => {
    try {
      await prisma.orgTag.deleteMany({
        where: { orgId: id },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = {
  ...dbOperations,
};
