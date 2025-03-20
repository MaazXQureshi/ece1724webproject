const {
    PrismaClient,
    PrismaClientKnownRequestError,
} = require("@prisma/client");
const prisma = new PrismaClient();

// TODO: Implement User related database operations
const dbOperations = {
    createUser: async (userData) => {
        try {
            const user = await prisma.user.create({
                data: {
                    email: userData.email,
                    username: userData.username,
                    admin: userData.admin,
                    password_hash: userData.password
                }
            });
            return user;
        } catch (err) {
            console.error(err);
        }
    }
};

module.exports = {
    ...dbOperations,
};
