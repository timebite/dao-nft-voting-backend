const { verifyOwner } = require('../services/solana.js');

const express = require('express');
const router = express.Router();

const Vote = require('../models/Vote');
const Election = require('../models/Election');

router.post('/submit-vote', async (req, res) => {
    try {
        const { candidate_id, election_id, voter_address, voter_signature } = req.body;
        
        if(!candidate_id || !election_id || !voter_address) {
            return res.status(400).json({
                error: 'Invalid request'
            });
        }

        const isOwnerVerified = await verifyOwner(voter_address, voter_signature);
        if(isOwnerVerified) {
            let findElection = await Election.findOne({_id: election_id});
            let candidate = findElection.candidates.filter(candidate => candidate.id === candidate_id); 
            let currentCount = parseInt(candidate[0].vote_count);
            
            const newVote = new Vote({
                candidate_id,
                election_id,
                voter_address
            });
            await newVote.save();
            await Election.updateOne(
                {"candidates._id": candidate[0]._id},
                {
                    $set: {
                        "candidates.$.vote_count": (currentCount + 1)
                    }
            })
            return res.status(200).json({
                success: 'Vote submitted'
            });
        } else {
            return res.send({
                error: 'Owner Verification Failed'
            });
        }
    } catch (error) {
        if(error.code === 11000) {
            return res.send({
                error: 'Vote already submitted'
            });
        }
        console.log({"erorr": error.message})
    }
});

router.get('/count/:id', async (req, res) => {
    try {
        const electionId = (req.params.id == undefined || req.params.id == "") ? "latest" : req.params.id;
        let voteCount;
        if(electionId == "latest") {
            /* get latest election */
            const election = await Vote.findOne({}, {}, { sort: { 'creation_date' : -1 } });
            voteCount = await Vote.countDocuments({ election_id: election.election_id });
        } else {
            voteCount = await Vote.countDocuments({ election_id: electionId });
        }
    
        res.send({count: voteCount});   
    } catch (error) {
        res.send({count: 0});
    }
})

router.get('/count-candidate/:id', async (req, res) => {
    try {
        const candidateId = req.params.id;
        const voteCount = await Vote.countDocuments({ candidate_id: candidateId });
        res.send({count: voteCount});   
    } catch (error) {
        res.send({count: 0});
    }
})

module.exports = router;