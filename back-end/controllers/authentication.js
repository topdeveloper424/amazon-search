

//= =======================================
// Login Route
//= =======================================
exports.login = function (req, res, next) {
    console.log('connecting...');
    let  {Username, Password } = req.body;
    if( Username !== undefined && Password !== undefined ) {
        if(Username === "admin" && Password === "admin"){
            res.status(200).send({status:"success"});
        }
    }else{
        console.log('Undefined Username or Password')
        res.status(401).send('No parameters');
    }
};
