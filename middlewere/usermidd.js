const jwt = require('jsonwebtoken');
const JWT_KEY_user = "key1234"
function userMiddleware(req, res, next) {
    const token = req.headers.token;
    if(!token){
        return res.status(401).json({ msg: "Unauthorized" });
    }
    try{
        const decoded = jwt.verify(token, JWT_KEY_user);
        if(decoded){
            req.userId = decoded.id;
            next();
        }else{
            res.status(403).json({ message: "You are not signed in" });
        }
    }catch(e){
        return res.status(403).json({ msg: "Invalid token" });
    }
}
module.exports = {userMiddleware};