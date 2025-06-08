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
        req.userId = "d978b8b3-b2b0-4293-8ba0-b0e65d60de2c"
        req.username = "11111111"
        req.role = "SISWA"
        return next()
    }

    if(token == process.env.TES_TOKEN_GURU){
        req.userId = "dcaa3bf0-f7cd-46f7-af10-d4a7d8995183"
        req.username = "999999"
        req.role = "PEMBIMBING"
        return next()
    }

    if(token == process.env.TES_TOKEN_GURU_TIDAK_AKSES){
        req.userId = "1030dfe5-d650-4657-94fe-0b85cc53c8b7"
        req.username = "20920040"
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

