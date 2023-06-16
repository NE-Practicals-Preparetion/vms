const { decode } = require("jsonwebtoken");
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: "unathorized" })
        const secret = process.env.SECRET;
        const decoded = decode(token, { key: secret })
        if (!decoded) res.status(401).json({ success: false, message: "unauthorized" })
        req.user = decoded;
        console.log(req.user);

        // Check the role of the user and perform role-based authorization
        const { role } = req.user;
        if (role !== 'vehicle owner') {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        next();
    } catch (e) {
        res.status(401).json({ success: false, message: "unauthorized" })
    }
}
module.exports = authMiddleware;