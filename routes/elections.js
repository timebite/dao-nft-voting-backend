const express = require('express');
const router = express.Router();
const Election = require('../models/Election');

const { textLike } = require('../util/utils');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
router.use(express.static('public'));

router.get('/create-election', ensureAuthenticated, async (req, res) => {
    res.render('create-election', {
        user: req.user.name,
        page_name: "create-election"
    });
})

router.get('/manage-elections', ensureAuthenticated, async (req, res) => {
    res.render('manage-elections', {
        user: req.user.name,
        page_name: "manage-elections"
    });
})

router.get('/manage-election/:id', ensureAuthenticated, async (req, res) => {
    const id = req.params.id;
    const election = await Election.findById(id);
    const election_name = election.name_of_election;
    let candidatesArr = []
    for(const candidate of election.candidates) {
        candidatesArr.push(candidate.name);
    }
    res.render('manage-election', {
        user: req.user.name,
        page_name: "manage-elections",
        election_name: election_name,
        candidates: candidatesArr.join(","),
        election_id: id
    });
})

router.get('/list-all', ensureAuthenticated, async (req, res) => {
    const active = (req.query.active != undefined) ? true : false;
    let elections;
    if(active == true) {
        elections = await Election.find({ is_ended: false });
    } else {
        elections = await Election.find({});
    }
    res.send(elections);
})

router.get('/end-election/:id', ensureAuthenticated, async (req, res) => {
    const id = req.params.id;
    const election = await Election.findById(id);
    election.is_ended = true;
    await election.save();
    req.flash('success_msg', 'Election ended successfully');
    res.redirect('/dashboard');
})

router.get('/delete-election/:id', ensureAuthenticated, async (req, res) => {
    const id = req.params.id;
    await Election.findByIdAndDelete(id);
    req.flash('success_msg', 'Election deleted successfully');
    res.redirect('/elections/manage-elections');
})

router.get('/find-election/:name', ensureAuthenticated, async (req, res) => {
    const name = req.params.name;
    const elections = await Election.find({ name_of_election: textLike(name) });
    res.send(elections);
})


router.post('/create-election', ensureAuthenticated, async (req, res) => {
    try {
        const { election_title, candidate_names } = req.body;
        let candidateArr = [];
        let candidate_names_arr = candidate_names.split(',');
        let hasDuplicate = candidate_names_arr.some((val, i) => candidate_names_arr.indexOf(val) !== i);

        if(hasDuplicate) {
            req.flash('error_msg', 'Duplicate candidates are not allowed');
            res.redirect('/dashboard');
            return;
        }

        for (let i = 0; i < candidate_names_arr.length; i++) {
            candidateArr.push({
                name: candidate_names_arr[i],
                vote_count: 0
            })
        }
        const election = new Election({
            name_of_election: election_title,
            candidates: candidateArr,
        })
        election.save()
        req.flash("success_msg", "Election created successfully")
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        req.flash("error_msg", "Something went wrong")
        res.redirect('/dashboard')
    }
})

module.exports = router;