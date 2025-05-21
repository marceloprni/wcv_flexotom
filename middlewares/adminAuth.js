
function usuarioAuth(req, res, next) {
    const users = req.session.user == undefined ? 0 : req.session.user;
    console.log(users)
    if(users.privilegio == 1 || users.privilegio > 1) {
        console.log('agora passou 1')
        next();
    } else {
        console.log('agora passou 2')
        res.render("users/login", { 
            privilegio1: 0,
            erro: " ",
            acionaWarmin: false
          });
    }
}

function adminAuth(req, res, next) {
    const admin = req.session.user == undefined ? 0 : req.session.user;
    if(admin) {
        if(admin.privilegio > 1) {
            console.log('agora passou')
            next();
        } else {
            res.render("users/login", { 
                privilegio1: 0,
                erro: " ",
                acionaWarmin: false
            });
        }
    } else {
        res.render("users/login", { 
            privilegio1: 0,
            erro: " ",
            acionaWarmin: false
        });
    }

}

module.exports = {
    usuarioAuth,
    adminAuth
}