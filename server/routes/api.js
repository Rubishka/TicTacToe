var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');


router.post('/register', function (req, res) {
    User.register(new User({username: req.body.username}),
        req.body.password, function (err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({
                    status: 'Registration successful!'
                });
            });
        });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user',

                });
            }
            res.status(200).json({
                status: 'Login successful!',
                userid: user._id
            });
        });
    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});


//return all players waiting to play
router.post('/score', function (req, res) {

    var currentDate = new Date();
    var scoreArr = [[], []];
    scoreArr[0] = [];
    scoreArr[1] = [];
    scoreArr[2] = [];
    scoreArr[3] = [];
    scoreArr[4] = [];

    User.find({}).exec(function (err, users) {
        if (err)
            console.error(err);
        users.forEach(function (user) {
            var daywon = 0;
            var weekwon = 0;
            var monthwon = 0;
            var yearwon = 0;
            var allwon = 0;

            user.won.forEach(function (gamedate) {
                allwon++;
                if (gamedate.getFullYear() === currentDate.getFullYear()) {
                    yearwon++;
                    if (gamedate.getMonth() === currentDate.getMonth()) {
                        monthwon++;
                        if (gamedate.getDate() >= (currentDate.getDate() - currentDate.getDay())) {
                            weekwon++;  //day of the month minus the day of the week is the begin of the week
                            if (gamedate.getDate() === currentDate.getDate()) {
                                daywon++;
                            }
                        }
                    }
                }
            });
            scoreArr[0].push({name: user.username, won: allwon});
            scoreArr[1].push({name: user.username, won: yearwon});
            scoreArr[2].push({name: user.username, won: monthwon});
            scoreArr[3].push({name: user.username, won: weekwon});
            scoreArr[4].push({name: user.username, won: daywon});
        });
        sortArr(scoreArr[0]);
        sortArr(scoreArr[1]);
        sortArr(scoreArr[2]);
        sortArr(scoreArr[3]);
        sortArr(scoreArr[4]);

        res.status(200).send(scoreArr);
    });
});

var sortArr = function (arr) {
    arr.sort(function (a, b) {
        return b.won - a.won;
    });
}

router.get('/cancel', function (req, res) {

    User.findOneAndUpdate({
        _id: req.user
    }, {
        $set: {
            'availability': 0
        }
    }, function (err, user) {
        if (err) {
            return res.sendStatus(500);
        }
        return res.status(200).send(user);
    });
});

router.get('/status', function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    //return res.status(200).send(user);
    return res.status(200).json({
        status: true,
        user: req.user
    });
});


router.get('/game', function (req, res) {
    User.findOneAndUpdate({
        _id: req.user
    }, {
        $set: {
            'availability': 1
        }
    }, function (err, user) {
        if (err) {
            return res.sendStatus(500);
        }
        return res.status(200).send(user);
    });
});

router.post('/against', function (req, res, next) {
    // set user availability to 1 which mean rdy
    var io = req.app.get('socketio');
    User.findOneAndUpdate({
        _id: req.user
    }, {
        $set: {
            'availability': 1
        }
    }, {
        new: true
    }, function (err, user) {
        if (err) {
            return res.sendStatus(500);
        }
        console.log(req.user);
        // match user with required player with availability is 1
        User.findOne({
            'availability': 1,
            '_id': {$ne: req.user._id} //target player
        }, function (err, rdyPlayers) {
            // once matched change the availability to 0
            // try with just two players, alter afterward.

            if (rdyPlayers !== null) {
                var playersMatchSettings = {
                    player1: user.username,
                    player2: rdyPlayers.username,
                    currentPlayer: rdyPlayers.username,
                    player1Value: 'X',
                    player2Value: 'O'
                };
                User.findOneAndUpdate({
                    _id: req.user._id
                }, {
                    $set: {
                        'availability': 0
                    }
                }, {
                    new: true
                }, function (err, user) {
                    if (err) {
                        return res.sendStatus(500);
                    }
                });
                User.findOneAndUpdate({
                    _id: rdyPlayers._id
                }, {
                    $set: {
                        'availability': 0
                    }
                }, {
                    new: true
                }, function (err, user) {
                    if (err) {
                        return res.sendStatus(500);
                    }
                });
                io.emit("rdyPlayers", playersMatchSettings);
            }
            return res.status(200).send(user);
        });
    });


});

router.get('/gameover', function (req, res) {

    User.findOneAndUpdate({
        _id: req.user
    }, {
        $push: {
            'won': new Date()
        }
    }, {
        new: true
    }, function (err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        return res.status(200).send(user);
    });
});

router.get('/profile', function (req, res) {
    User.findById(req._id, function (err, todo) {
        if (err) {
            res.send(err);
        } else {
            res.send(user);
        }
    });
});

module.exports = router;