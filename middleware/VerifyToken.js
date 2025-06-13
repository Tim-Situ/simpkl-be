var jwt = require("jsonwebtoken")

async function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
  
    if(token == null){
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    if(token == process.env.TES_TOKEN_SISWA){
        req.userId = "dd2fb196-9457-4acc-b847-7632a67e6beb"
        req.username = "1302223127"
        req.role = "SISWA"
        return next()
    }

    if(token == process.env.TES_TOKEN_GURU){
        req.userId = "b207928c-46ff-4689-a63b-bbac730c2009"
        req.username = "20920040"
        req.role = "PEMBIMBING"
        return next()
    }

    if(token == process.env.TES_TOKEN_GURU_TIDAK_AKSES){
        req.userId = "82b022aa-2ab7-470a-a5a6-aace9706aafd"
        req.username = "22910008"
        req.role = "PEMBIMBING"
        return next()
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(403).json({
                success: false,
                message: 'Forbidden'
            });
        }
        
        req.userId = decoded.userId
        req.username = decoded.username
        req.role = decoded.role
        next()
    })
}

module.exports = {
    verifyToken
}

