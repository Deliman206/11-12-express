'use strict';

import mongoose from 'mongoose';

const doodadSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  usage: {
    type: String,
    minlength: 15,
  },
});

export default mongoose.model('doodad', doodadSchema);
