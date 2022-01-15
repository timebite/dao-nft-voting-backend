const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const Election = require('../models/Election');

router.use(express.static('public'));

router.get('/', forwardAuthenticated, (req, res) => res.redirect("/authentication/login"));
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    const election_count = await Election.countDocuments({ is_ended: false });
    const ended_election_count = await Election.countDocuments({ is_ended: true });

    res.render('dashboard', {
        user: req.user.name,
        page_name: "Dashboard",
        elections_count: election_count,
        votes_count: 0,
        completed_elections_count: ended_election_count,
    });
})

router.get('/elections', async (req, res) => {
    const activeElections = await Election.find({ is_ended: false });
    res.send(activeElections);
})

router.get('/election/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if(id == "latest") {
            const latestElection = await Election.findOne({}).sort({ created_at: -1 });
            res.send(latestElection);
        } else {
            const election = await Election.findById(id);
            res.send(election);
        }   
    } catch (error) {
        console.log(error)
        const latestElection = await Election.findOne({}).sort({ created_at: -1 });
        res.send(latestElection);
    }
})

module.exports = router;