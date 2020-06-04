var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var ObjectId = require('mongoose').Types.ObjectId;

// db connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/db_quiz', { useUnifiedTopology: true, useNewUrlParser: true });
var ObjectId = require('mongoose').Types.ObjectId;

var Question = require('../model/Question');
var QuestionSet = require('../model/QuestionSet');
var Candidate = require('../model/Candidate');
var CandidateQueAns = require('../model/CandidateQueAns');

var mailtrap_username= "7c1b8d1ec2f36c";
var mailtrap_password= "4684c8d57f19e9";


router.get('/', (req, res, next) => {
    res.render('index');
});

//--------------------------------------
// question API
//--------------------------------------

//get questions
router.get('/get_questions', (req, res) => {
    Question.find({}, (error, result) => {
        if (error) return res.status(500).send({ msg: "There was a problem finding questions.\nError: " + error });
        res.status(200).send(result);
    });
});

//get question by id
router.post('/get_question_by_id', (req, res) => {
    Question.findById(req.body.id, (error, result) => {
        if (error) return res.status(500).send({ msg: "There was a problem finding question details.\nError: " + error });
        res.status(200).send(result);
    });
});

// save question
router.post('/save_question', (req, res) => {
    Question.create({
        question: req.body.question,
        answer_options: req.body.answer_options 
    }, function (err, result) {
        if (err) return res.status(500).send("There was a problem saving question.\nError: " + err);
        res.status(200).send(result);
    });
});

// update question
router.put('/update_question', (req, res) => {
    Question.update({ _id: req.body.id }, {
        $set: {
            question: req.body.question,
            answer_options: req.body.answer_options 
        }
    }, { upsert: false }, (err, result) => {
        if (err) return res.status(500).send("There was a problem updating question.\nError: " + err);
        res.status(200).send(result);
    });
});

//delete question
router.delete('/delete_question/:id', (req, res) => {
    Question.deleteOne({ _id: req.params.id }, (err, result) => {
        if (err) return res.status(500).send("There was a problem deleting question.\nError: " + err);
        res.status(200).send(result);
    });
});


//--------------------------------------
// candidate API
//--------------------------------------
//get all candidates
router.post('/candidate_login', (req, res) => {
    Candidate.find({"email": req.body.email, "password": req.body.password}, (error, result) => {
        if (error) return res.status(500).send({ msg: "Something went wrong.\nError: " + error });
        if(result.length > 0)
            res.status(200).send(result);
        else
            res.status(401).send("Invalid email or password");
    });
});
//save candidate
router.post('/save_candidate', (req, res) => {
    Candidate.find({ email: req.body.email }, (error, data) => {
        if (error) return res.status(500).send("There was a problem fetching the candidate data.");
        if (data.length > 0) {
            return res.status(403).send({ msg: "candidate with email: " + req.body.email + " already exists.Error: " + error });
        }
        else {
            Candidate.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }, function (err, result) {
                if (err) return res.status(500).send("There was a problem saving candidate.\nError: " + err);
                res.status(200).send(result);
            });
        }
    });
});

//get all candidates
router.get('/get_candidates', (req, res) => {
    Candidate.find({}, (error, result) => {
        if (error) return res.status(500).send({ msg: "There was a problem finding candidates.\nError: " + error });
            res.status(200).send(result);
    });
});

//get candidate by id
router.post('/get_candidate_by_id', (req, res) => {
    Candidate.findById(req.body.id, (error, result) => {
        if (error) return res.status(500).send({ msg: "There was a problem finding data.\nError: " + error });
        res.status(200).send(result);
    });
});

//--------------------------------------
// question set API
//--------------------------------------

//get question set sets
router.get('/get_question_sets', (req, res) => {
    console.log(req.body);
    QuestionSet.aggregate([
        {
            $unwind:
            {
                "path": "$questions",
                "preserveNullAndEmptyArrays": true
            }
        }, {
            $lookup:
            {
                from: "cl_question",
                localField: "questions",
                foreignField: "_id",
                as: "questions_data"
            }
        },
        {
            $group:
            {
                _id: "$_id",
                questions: { $addToSet: { $arrayElemAt: ["$questions_data", 0] } }
            }
        }
    ], (error, result) => {
        console.log(result)
        if (error) return res.status(500).send({ msg: "There was a problem finding question sets.\nError: " + error });
        if (result.length > 0) {
            res.status(200).send(result);
        } else {
            res.status(404).send('No data found.');
        }
    });
});

//get question set by id
router.post('/get_question_set_by_id', (req, res) => {
    QuestionSet.findById(req.body.id, (error, result) => {
        if (error) return res.status(500).send({ msg: "There was a problem finding question set details.\nError: " + error });
        res.status(200).send(result);
    });
});

// save question set
router.post('/save_question_set', (req, res) => {
    var questions_array = [];
    for (var i = 0; i < req.body.questions.length; i++) {
        questions_array.push(new ObjectId(req.body.questions[i]));
    }
    QuestionSet.create({
        questions: questions_array 
    }, function (err, result) {
        if (err) return res.status(500).send("There was a problem saving question set.\nError: " + err);
        res.status(200).send(result);
    });
});

// update question set
router.put('/update_question_set', (req, res) => {
    var questions_array = [];
    for (var i = 0; i < req.body.questions.length; i++) {
        questions_array.push(new ObjectId(req.body.questions[i]));
    }
    QuestionSet.update({ _id: req.body.id }, {
        $set: {
            questions: questions_array
        }
    }, { upsert: false }, (err, result) => {
        if (err) return res.status(500).send("There was a problem updating question set.\nError: " + err);
        res.status(200).send(result);
    });
});

//delete question set
router.delete('/delete_question_set/:id', (req, res) => {
    QuestionSet.deleteOne({ _id: req.params.id }, (err, result) => {
        if (err) return res.status(500).send("There was a problem deleting question set.\nError: " + err);
        res.status(200).send(result);
    });
});


//Candidate Question Answer API

// save candidate_que_answer
router.post('/save_candidate_que_answer', (req, res) => {
    CandidateQueAns.create({
        candidate_id: new ObjectId(req.body.candidate_id),
        que_set_id: new ObjectId(req.body.que_set_id),
        questionAnswers: req.body.questionAnswers,
        time_taken: req.body.time_taken,
        attempted: req.body.attempted,
        obtained_marks: req.body.obtained_marks
    }, function (err, result) {
        if (err) return res.status(500).send("There was a problem saving Candidate Question Answer.\nError: " + err);
        
        email_msg = '<h3>Quiz Result:</h3><table></tr><tr><td>Total Questions:</td><td>' 
        + req.body.total_questions + '</td></tr><tr><td>Attempted:</td><td>'
        + req.body.attempted + '</td></tr><td>Obtained Marks:</td><td>'
        + req.body.obtained_marks  + '</td></tr><td>Time Taken:</td><td>'
        + req.body.time_taken + '(h:m:s)</td></tr></table>';

        var transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: mailtrap_username, //generated by mailtrap
                pass: mailtrap_password  //generated by mailtrap
            }
        });

        var mailOptions = {
            from: '36c1e041fa-950339@inbox.mailtrap.io',
            to: "kanan@gmail.com",
            subject: 'Quiz Result',
            text: 'Quiz Result',
            html: email_msg
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.status(200).send(result);
    });
});

//get all candidate_que_answer
router.get('/get_candidate_que_ans', (req, res) => {
    CandidateQueAns.find({}, (error, result) => {
        if (error) return res.status(500).send({ msg: "There was a problem finding data.\nError: " + error });
            res.status(200).send(result);
    });
});

//get candidate by candidate_que_answer id
router.post('/get_candidate_que_ans_by_id', (req, res) => {
    CandidateQueAns.findById(req.body.id, (error, result) => {
        if (error) return res.status(500).send({ msg: "There was a problem finding data.\nError: " + error });
        res.status(200).send(result);
    });
});

module.exports = router;
