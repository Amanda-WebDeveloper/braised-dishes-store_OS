var express = require('express');
let connPool = require('../config/mysql');
let mailTransport = require('../config/outlook');

var router = express.Router();


/* GET pages. */
router.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

router.get('/index', function(req, res) {
    res.sendfile('./public/index.html');
});

router.get('/news', function(req, res) {
    res.sendfile('./public/news.html');
});

router.get('/stores', function(req, res) {
    res.sendfile('./public/stores.html');
});

router.get('/items', function(req, res) {
    res.sendfile('./public/items.html');
});

router.get('/cart', function(req, res) {
    res.sendfile('./public/cart.html');
});

router.get('/member', function(req, res) {
    res.sendfile('./public/member.html');
});

router.get('/qa', function(req, res) {
    res.sendfile('./public/qa.html');
});

router.get('/privacy', function(req, res) {
    res.sendfile('./public/privacy.html');
});



//傳送訂單資料
router.post('/data',  function (req, res, next) {
    let items = req.body.item;
    let counts = req.body.count;
    let data = {
        memberName: req.body.member_name,
        memberTel: req.body.member_tel,
        store: req.body.store,
        takeDate: req.body.take_date,
        takeName: req.body.take_name,
        takeTel: req.body.take_tel,
        totalCost: req.body.total_cost,
        type: req.body.type
    }; 
    
    if (Array.isArray(items)) {
        for (i = 0; i < items.length; i++) {
            data[items[i]] = counts[i]; 
        }
    } else data[items] = counts;
    
    addOrder(data);
    next();
    
}, function (req, res) {
    res.sendfile('./routes/data.html');

});



//會員email驗證
router.post('/email_check', function (req, res) {
    let email = req.body.email;
    let code = Math.floor(Math.random() * 9999);
    let options = {
        from: 'O滷味 <O@hotmail.com>',
        to: email,
        subject: 'O滷味會員驗證碼',
        html: '<p>您的驗證碼為：'+ code +'，請於驗證頁面輸入以完成會員註冊，若關閉驗證畫面請重新進行註冊。</p>' 
    };

    mailTransport.sendMail(options, (err) => {
        if (err) {
            console.log('The mail is failed to send.');
            throw err;
            res.sendfile('./routes/member_register_failed.html');

        } else {
            console.log('The mail is sended.');
            res.json(code);
        }
    });
});



//會員註冊
router.post('/member_register', function (req, res) {
    let info = {
        account: req.body.account, 
        password: req.body.password,
        name: req.body.name,
        birthday: req.body.birthday,
        IDNumber: req.body.id,
        email: req.body.email,
        privacy: req.body.privacy,
        gettingAd: req.body.getting_ad,
    };
    
    addMember(info);

    res.sendfile('./routes/member_register_success.html');
});



//會員登入
router.post('/login_check', function (req, res) {
    let accountEntered = req.body.account;
    let passwordEntered = req.body.password;

    connPool.getConnection((err, connection) => {
        if (err) {
            console.log('The connPool is failed to getConnection.');
            throw err;
        } else {
            connection.query('SELECT * FROM member_list WHERE account=? AND password=?', [accountEntered, passwordEntered], function (err, row, fields) {
                if (err) {
                    throw err;
                    console.log(`Member ${accountEntered} failed to log in.`);
                    res.end();
                    
                } else {
                    let tokens = {
                        "name": row[0].name,
                        "birthday": `${row[0].birthday.getFullYear()}\-${row[0].birthday.getMonth() + 1}\-${row[0].birthday.getDate()}`,
                        "tel": row[0].account
                    };

                    res.json(tokens);
                }
            }); 
        }
    });
});


//忘記密碼
router.post('/forgot_password', function (req, res, next) {
    let accountEntered = req.body.account;
    let emailEntered = req.body.email;
    let code = Math.floor(Math.random() * 9999);
    
    connPool.getConnection((err, connection) => {
        if (err) {
            console.log('The connPool is failed to getConnection.');
            throw err;
        } else {
            connection.query('SELECT * FROM member_list WHERE account=? AND email=?', [accountEntered, emailEntered], function (err, row, fields) {
                if (err) {
                    throw err;
                    console.log(`Member ${accountEntered} forgot his password and do not pass the check.`);
                    res.end();
                } else {
                    console.log(`Member ${accountEntered} forgot his password and passed the check.`);

                    connection.query('UPDATE member_list SET passwordReset=? WHERE account=?', [code, accountEntered], function (err, results, fields) {
                        if (err) {
                            console.log('There is some error in UPDATE query of password-reseting availability.');
                            throw err;
                        } else {
                            console.log(`Member ${accountEntered} got the password-reseting availability.`);
                            
                        }
                    });

                    setTimeout(function () {
                        connection.query('UPDATE member_list SET passwordReset=? WHERE account=?', [0, accountEntered], function (err, results, fields) {
                            if (err) {
                                console.log('There is some error in UPDATE query of password-reseting disavailability.');
                                throw err;
                            } else {
                                console.log(`Member ${accountEntered} loses the password-reseting availability.`);
                            }
                        });
                    }, 600000);

                    let options = {
                        from: 'O滷味 <O@hotmail.com>',
                        to: emailEntered,
                        subject: 'O滷味會員密碼重設',
                        html: '<p>親愛的滷客您好：</p><br><p>您的密碼重設驗證碼為' + code + '請在10分鐘內完成密碼重設，逾時請重新輸入會員資料，謝謝您！</p>'
                    }
                    sendEmail(options);

                    let token = {
                        "code": code,
                        "account": accountEntered
                    };

                    console.log(`Member ${accountEntered} got the password-reseting code.`);

                    res.json(token);

                    connection.release();
                }
            });

            
        }
    });
});
                            
                            

//密碼重設
router.post('/password_reset', function (req, res, next) {
    let account = req.body.account;
    let password = req.body.password;
    
    connPool.getConnection((err, connection) => {
        if (err) {
            console.log('The connPool is failed to get connection.');
            throw err;
        } else {
            connection.query('SELECT * FROM member_list WHERE account=?', account, function (err, row, field) {
                if (err) {
                    console.log('There is some error in SELECT query of password resetting.');
                    throw err;
                    res.end();
                } else {
                    connection.query('UPDATE member_list SET password=?,passwordReset=? WHERE account=?', [password, 0, account], function (err, row, field) {
                        if (err) {
                            throw err;
                            console.log('There is some error in UPDATE query of password resetting.');
                        } else {
                            console.log(`Member ${account} reseted his password.`);

                            res.sendfile('./routes/password_reset_success.html');

                            connection.release();
                        }
                    });
                }
            });  
        }
    });
});



//忘記帳號
router.post('/forgot_account', function (req, res, next) {
    let idEntered = req.body.id;
    let emailEntered = req.body.email;
    
    connPool.getConnection((err, connection) => {
        if (err) {
            console.log('The connPool is failed to getConnection.');
            throw err;
        } else {
            connection.query('SELECT * FROM member_list WHERE IDNumber=? AND email=?', [idEntered, emailEntered], function (err, row, fields) {
                if (err) {
                    throw err;
                    console.log(`Member ${emailEntered} forgot his account and do not pass the check.`);
                    res.end();
                } else {
                    console.log(`Member ${emailEntered} forgot his account and passed the check.`);
                    let account = row[0].account;
                    let options = {
                        from: 'O滷味 <O@hotmail.com>',
                        to: emailEntered,
                        subject: 'O滷味會員帳號提醒',
                        html:
                            '<p>親愛的滷客您好：</p><br><p>您的會員帳號為 ' + account + ' ，謝謝您！</p><br><a href="http://localhost:3000/member.html">O滷味會員登入</a>'
                    };

                    sendEmail(options);        
                            
                    res.redirect('/member');
                }
                connection.release();
            });
            
        }
    });
});



/* Functions */

function addOrder (data) {
    connPool.getConnection((err, connection) => {
        if (err) {
            console.log('The connPool is failed to getConnection.');
            throw err; 
        } else {
            connection.query('INSERT INTO order_list SET?', data, function (err, results, fields) {
                if (err) {
                    console.log('There is some error in INSERT query.');
                    throw err; 
                } else {
                    let id = results.insertId;
                    console.log(`The new order ${id} is added.`);
                }
                connection.release();
            });
            
        }
    });
}

function addMember (info) {
    connPool.getConnection((err, connection) => {
        if (err) {
            console.log('The connPool is failed to getConnection.');
            throw err; 
        } else {
            connection.query('INSERT INTO member_list SET?', info, function (err, results, fields) {
                if (err) {
                    console.log('There is some error in INSERT query.');
                    throw err; 
                } else {
                    let id = results.insertId;
                    console.log(`The new member ${id} is added.`);
                }
                connection.release();
            });
            
        }
    });
}

function sendEmail (options) {
    mailTransport.sendMail(options, (err) => {
        if (err) {
            console.log('The mail is failed to send.');
            throw err;
            res.send('email寄送失敗');
        } else {
            console.log('The mail is sended.');
        }
    });
}







module.exports = router;
