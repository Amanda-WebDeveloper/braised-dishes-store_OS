var express = require('express');
let connPool = require('../config/mysql');
let mailTransport = require('../config/gmail');

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


//會員註冊
router.post('/member_register', function (req, res, next) {
    let info = {
        account: req.body.account, 
        password: req.body.password,
        name: req.body.name,
        birthday: req.body.birthday,
        IDNumber: req.body.id,
        email: req.body.email,
        privacy: req.body.privacy,
        gettingAd: req.body.getting_ad,
        mailCheckPass: 0
    };
    
    addMember(info);
    next();
    
}, function (req, res, next) {
    let email = req.body.email;
    let account = req.body.account;
    let options = {
        from: '蘭姨滷味',
        to: email,
        subject: '蘭姨滷味會員註冊成功，請驗證您的email',
        html: 
        '<form action="http://localhost:3000/email_check" method="post"><h1>歡迎加入蘭姨滷味滷客！</h1><p>親愛的滷客您好：</p><br><p>請點擊下方確認按鈕，以完成email驗證及啟用會員帳號，謝謝您！</p><input type="hidden" name="account" value='+ account +'><button type="submit" style="background-color: blue; color: white; width: 100px; line-height: 30px; font-size: 25px;">確認</button></form>'
    };
    
    sendEmail(options);
    next();
    
}, function (req, res) {
    res.sendfile('./routes/member_register_success.html');

});


//會員email驗證
router.post('/email_check', function (req, res, next) {
    let account = req.body.account;
    connPool.getConnection((err, connection) => {
        if (err) {
            console.log('The connPool is failed to getConnection.');
            throw err;
        } else {
            connection.query('UPDATE member_list SET mailCheckPass=? WHERE account=?', [1, account], function (err, results, fields) {
                if (err) {
                    console.log('There is some error in UPDATE query.');
                    throw err;
                } else {
                    console.log(`Member ${account} passed the mailcheck.`);
                }
                connection.release();
            });
        }
    });
    next();
    
}, function (req, res) {
    res.sendfile('./public/member.html');
    
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
            connection.query('SELECT * FROM member_list', function (err, rows, fields) {
                if (err) {
                    console.log('There is some error in SELECT query.');
                    throw err;
                } else {
                    for (i = 0; i < rows.length; i++) {
                        let row = rows[i];
                        if (row.mailCheckPass === 1 && accountEntered === row.account && passwordEntered === row.password) {
                            console.log(`Member ${accountEntered} logged in.`);
                            
                            let tokens = {
                                "name": row.name,
                                "birthday": `${row.birthday.getFullYear()}\-${row.birthday.getMonth()+1}\-${row.birthday.getDate()}`,
                                "tel": row.account
                            };
        
                            res.json(tokens);
                            
                            
                        } else {
                            console.log(`Member ${accountEntered} failed to log in.`);
                            res.redirect('/member');
                        }
                    }
                }
            });
            connection.release();
        }                 
    });
});


//忘記密碼
router.post('/forgot_password', function (req, res, next) {
    let accountEntered = req.body.account;
    let emailEntered = req.body.email;
    
    connPool.getConnection((err, connection) => {
        if (err) {
            console.log('The connPool is failed to getConnection.');
            throw err;
        } else {
            connection.query('SELECT * FROM member_list', function (err, rows, fields) {
                if (err) {
                    console.log('There is some error in SELECT query.');
                    throw err;
                } else {
                    for (i = 0; i < rows.length; i++) {
                        let row = rows[i];
                        if (row.mailCheckPass === 1 && accountEntered === row.account && emailEntered === row.email) {
                            console.log(`Member ${accountEntered} forgot his password and passed the check.`);
                            
                            connection.query('UPDATE member_list SET passwordReset=? WHERE account=?', [1, accountEntered], function (err, results, fields) {
                                if (err) {
                                    console.log('There is some error in UPDATE query.');
                                    throw err;
                                } else {
                                    console.log(`Member ${accountEntered} gets the password-reseting availability.`);
                                }
                            });
                            
                            setTimeout(function () {
                                connection.query('UPDATE member_list SET passwordReset=? WHERE account=?', [0, accountEntered], function (err, results, fields) {
                                    if (err) {
                                        console.log('There is some error in UPDATE query.');
                                        throw err;
                                    } else {
                                        console.log(`Member ${accountEntered} loses the password-reseting availability.`);
                                    }
                                });
                                connection.release();
                                console.log('Connection released.');
                            }, 600000);
                            
                            next('route');
                            
                        } else {
                            console.log(`Member ${accountEntered} forgot his password and do not pass the check.`);
                            connection.release();
                            res.end();
                        }
                    } 
                }
            });
        }
    });
       
});

router.post('/forgot_password', function (req, res, next) {
    let accountEntered = req.body.account;
    let emailEntered = req.body.email;
    
    let options = {
        from: '蘭姨滷味',
        to: emailEntered,
        subject: '蘭姨滷味會員密碼重設',
        html: '<form action="http://localhost:3000/password_reset" method="post"><p>親愛的滷客您好：</p><br><p>請在10分鐘內點擊下方設定密碼按鈕，以完成密碼重設，謝謝您！</p><button type="submit" style="background-color: blue; color: white; width: 140px; line-height: 30px; font-size: 25px;">設定密碼</button></form>'
    };
                            
    sendEmail(options);
    
    next();
    
}, function (req, res) {
    console.log(`Memeber ${req.body.account} gets the token.`);
    
    let token = {
        "account": req.body.account
    };
    
    res.json(token);
    
});
                            
                            

//密碼重設
router.post('/password_reset', function (req, res, next) {
    res.sendfile('./routes/password_reset.html');
});

router.post('/password_reset_submit', function (req, res, next) {
    let account = req.body.account;
    let password = req.body.password;
    
    connPool.getConnection((err, connection) => {
        if (err) {
            console.log('The connPool is failed to get connection.');
            throw err;
        } else {
            connection.query('SELECT * FROM member_list', function (err, rows, fields) {
                if (err) {
                    console.log('There is some error in SELECT query.');
                    throw err;
                } else {
                    for (i = 0; i < rows.length; i++) {
                        let row = rows[i];
                        if (row.passwordReset === 1 && row.account === account) {
                            console.log(`Member ${account} is resetting his password.`);
                            
                            connection.query('UPDATE member_list SET password=?,passwordReset=? WHERE account=?', [password, 0,  account], function (err, row, field) {
                                if (err) {
                                    console.log('There is some error in UPDATE query.');
                                    throw err;
                                } else {
                                    console.log(`Member ${account} reseted his password.`);
                                    
                                    res.sendfile('./routes/password_reset_success.html');
                                }
                            });

                        } else if (row.passwordReset !== 1 && row.account === account) {
                            console.log(`Member ${account} dosen't have the availability of password-reseting.`);
                            
                            res.send('Error.');
                            
                        } else {
                            console.log('Non-existent member.');
                            
                            res.send('Error.');
                        }
                    };
                }
            });  
            connection.release();
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
            connection.query('SELECT * FROM member_list', function (err, rows, fields) {
                if (err) {
                    console.log('There is some error in SELECT query.');
                    throw err;
                } else {
                    for (i = 0; i < rows.length; i++) {
                        let row = rows[i];
                        
                        if (row.mailCheckPass === 1 && idEntered === row.IDNumber && emailEntered === row.email) {
                            console.log(`Member ${emailEntered} forgot his account and passed the check.`);
                            let account = row.account;
                            let options = {
                                from: '蘭姨滷味',
                                to: emailEntered,
                                subject: '蘭姨滷味會員帳號提醒',
                                html: 
                                '<p>親愛的滷客您好：</p><br><p>您的會員帳號為 '+ account +' ，謝謝您！</p><br><a href="http://localhost:3000/member.html">蘭姨滷味會員登入</a>'
                            };
                            sendEmail(options);
                            
                            connection.release();
                            
                            next('route');
                            
                        } else {
                            console.log(`Member ${emailEntered} forgot his account and do not pass the check.`);
                            connection.release();
                            
                            res.end();
                        }
                    }
                }
            });
        }
    });
});

router.post('/forgot_account', function (req, res) {
    res.send('會員驗證成功，請至註冊之email收取會員信！');
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
        } else {
            console.log('The mail is sended.');
        }
    });
}







module.exports = router;
