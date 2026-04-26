import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    const token = req.headers.token;
    if (!token) return res.json({ success: false, message: 'Not authorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') throw new Error('Not admin');
        next();
    } catch {
        res.json({ success: false, message: 'Not authorized' });
    }
};

export default adminAuth;
