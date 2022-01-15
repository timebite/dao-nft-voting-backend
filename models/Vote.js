const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  candidate_id: {
    type: String,
    required: true
  },
  election_id:{
    type: String,
    required: true
  },
  voter_address:{
    type: String,
    required: true
  },
  vote_date: {
    type: Date,
    default: Date.now
  }
});

VoteSchema.index({ candidate_id: 1, election_id: 1, voter_address: 1 }, { unique: true })

const Vote = mongoose.model('Vote', VoteSchema);
module.exports = Vote;