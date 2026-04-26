import jwt from 'jsonwebtoken';
import orderModel from '../models/orderModel.js';
import foodModel from '../models/foodModel.js';
import userModel from '../models/userModel.js';

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@tomato.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({ success: true, token });
    }
    res.json({ success: false, message: 'Invalid credentials' });
};

const adminStats = async (req, res) => {
    try {
        const [orders, menuItems, totalUsers] = await Promise.all([
            orderModel.find({}),
            foodModel.countDocuments(),
            userModel.countDocuments()
        ]);

        const paidOrders = orders.filter(o => o.payment);
        const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

        res.json({
            success: true,
            data: {
                totalOrders: orders.length,
                paidOrders: paidOrders.length,
                totalRevenue,
                pendingOrders: orders.filter(o => o.status === 'Food Processing').length,
                outForDelivery: orders.filter(o => o.status === 'Out for delivery').length,
                delivered: orders.filter(o => o.status === 'Delivered').length,
                menuItems,
                totalUsers
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error' });
    }
};

const listUsers = async (req, res) => {
    try {
        const [users, orders] = await Promise.all([
            userModel.find({}).select('-password -cartData'),
            orderModel.find({})
        ]);

        const ordersByUser = orders.reduce((acc, o) => {
            if (!acc[o.userId]) acc[o.userId] = { count: 0, spent: 0 };
            acc[o.userId].count += 1;
            if (o.payment) acc[o.userId].spent += o.amount;
            return acc;
        }, {});

        const enriched = users.map(u => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
            orderCount: ordersByUser[u._id]?.count || 0,
            totalSpent: ordersByUser[u._id]?.spent || 0
        }));

        res.json({ success: true, data: enriched });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error' });
    }
};

export { adminLogin, adminStats, listUsers };
