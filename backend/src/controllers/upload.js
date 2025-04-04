const uploadController = {
  uploadImage: async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "File upload failed" });
    }
    res.json({ imageUrl: req.file.location });
  },
};

module.exports = {
  ...uploadController,
};
