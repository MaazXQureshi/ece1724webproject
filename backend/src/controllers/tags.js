const {getAllTags} = require('../database/tags')

const tagsController = {
  getTags: async (req, res) => {
    try {
      const filters = {
        name: req.query.name,
        limit: parseInt(req.query.limit, 10) || 10,
        offset: parseInt(req.query.offset, 10) || 0
      }; // Extract filters from query parameters

      const tags = await getAllTags(filters);

      return res.status(200).json(tags);
    } catch (error) {
      return res.status(500);
    }
  },
};

module.exports = {
  ...tagsController,
};
