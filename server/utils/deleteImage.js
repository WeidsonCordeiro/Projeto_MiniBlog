const fs = require("fs");
const path = require("path");

const deleteImage = async (folder, filename) => {
  if (!filename) return;

  const imagePath = path.join(__dirname, `../uploads/${folder}`, filename);

  if (fs.existsSync(imagePath)) {
    await fs.promises.unlink(imagePath);
  }
};

module.exports = deleteImage;
