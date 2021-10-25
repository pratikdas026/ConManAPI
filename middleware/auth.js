const jwt = require('jsonwebtoken');
const secretKey = "MeanStack-2021"

const auth = async(req, res, next) => {
    if (req.header('x-auth-token')) {
        const token = req.header('x-auth-token');
        try {
            const match = await jwt.verify(token, secretKey);
            next();
        } catch (error) {
            res.status(401).json({
                message: "Unauthorized Request|!Bad Token"
            })
        }
    } else {
        res.status(401).json({
            message: "Unauthorized Request|!Token Missing"
        })
    }
}
module.exports = auth;