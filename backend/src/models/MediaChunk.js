const mongoose = require("mongoose");

const mediaChunkSchema = new mongoose.Schema({
  media: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    required: true,
  },
  chunkIndex: {
    type: Number,
    required: true,
  },
  data: {
    type: String, // Base64 data chunk
    required: true,
  },
});

// Compound index for fast ordered queries
mediaChunkSchema.index({ media: 1, chunkIndex: 1 }, { unique: true });

module.exports = mongoose.model("MediaChunk", mediaChunkSchema);
