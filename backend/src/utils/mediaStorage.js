const Media = require("../models/Media");
const MediaChunk = require("../models/MediaChunk");

/**
 * Extracts Media ID from a custom media URL
 * @param {string} url - The URL string
 * @returns {string|null} The Media ID or null if not matched
 */
const extractMediaIdFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/\/media\/([a-f0-9]{24})/i);
  return match ? match[1] : null;
};

/**
 * Deletes a media entry and all its associated chunks
 * @param {string} mediaId - The ID of the media to delete
 */
const deleteMediaById = async (mediaId) => {
  if (!mediaId) return;
  try {
    await MediaChunk.deleteMany({ media: mediaId });
    await Media.findByIdAndDelete(mediaId);
  } catch (error) {
    console.error(`Failed to delete media ${mediaId}:`, error);
  }
};

/**
 * Checks if a string is a base64 data URI, chunks it into MongoDB if so,
 * and handles clean-up of any previous media file replaced.
 * @param {string} value - The input value (could be a data URI or a standard URL)
 * @param {string} previousUrl - The previous URL to delete if a new file is uploaded
 * @param {string} filename - Optional name for the file
 * @returns {Promise<string>} The new URL if chunked, or the original value if it wasn't a data URI
 */
const processBase64Field = async (value, previousUrl = null, filename = "file") => {
  if (!value || typeof value !== "string" || !value.startsWith("data:")) {
    return value; // Not a base64 data URI, leave it as is
  }

  try {
    const match = value.match(/^data:([^;]+);base64,(.*)$/);
    if (!match) {
      return value; // Malformed data URI
    }

    const contentType = match[1];
    const base64String = match[2];

    const chunkSize = 1000000; // ~1MB chunks
    const totalChunks = Math.ceil(base64String.length / chunkSize);

    // 1. Create Media record
    const mediaObj = new Media({
      filename,
      contentType,
      totalChunks,
    });
    await mediaObj.save();

    // 2. Slice and insert chunks
    const chunksToInsert = [];
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, base64String.length);
      const chunkData = base64String.substring(start, end);

      chunksToInsert.push({
        media: mediaObj._id,
        chunkIndex: i,
        data: chunkData,
      });
    }
    await MediaChunk.insertMany(chunksToInsert);

    // 3. Clean up previous media if replaced
    if (previousUrl) {
      const prevMediaId = extractMediaIdFromUrl(previousUrl);
      if (prevMediaId) {
        await deleteMediaById(prevMediaId);
      }
    }

    // Return custom GET route URL
    return `/api/v1/profiles/media/${mediaObj._id}`;
  } catch (err) {
    console.error("Error saving base64 field as chunks:", err);
    throw err;
  }
};

module.exports = {
  processBase64Field,
  deleteMediaById,
  extractMediaIdFromUrl,
};
