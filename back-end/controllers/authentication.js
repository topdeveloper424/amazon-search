

//= =======================================
// Login Route
//= =======================================

// user authentication:  username: admin, userpassword: admin
exports.login = function (req, res, next) {
    console.log('connecting...');
    let username  = req.body.username;
    let password  = req.body.password;
    console.log("password",password)
    if(typeof username !== undefined && typeof password !== undefined ) {
        if(username === "admin" && password === "admin"){
            res.end(JSON.stringify({status:"success"}));
        }else{
            res.end(JSON.stringify({status:"failed"}));
        }
    }else{
        res.end(JSON.stringify({status:"error"}));
    }

};
