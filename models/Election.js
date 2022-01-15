const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({ name: String, vote_count: Number });
const ElectionSchema = new mongoose.Schema({
  name_of_election: {
    type: String,
    required: true,
    unique: true
  },
  candidates: [CandidateSchema],
  is_ended: {
    type: Boolean,
    required: true,
    default: false
  },
  creation_date: {
    type: Date,
    default: Date.now
  }
});

const Election = mongoose.model('Election', ElectionSchema);
module.exports = Election;