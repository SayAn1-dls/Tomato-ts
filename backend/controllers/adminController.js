import jwt from 'jsonwebtoken';
import orderModel from '../models/orderModel.js';
import foodModel from '../models/foodModel.js';

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
        const [orders, menuItems] = await Promise.all([
            orderModel.find({}),
            foodModel.countDocuments()
        ]);

        const totalOrders = orders.length;
        const paidOrders = orders.filter(o => o.payment);
        const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
        const pendingOrders = orders.filter(o => o.status === 'Food Processing').length;
        const outForDelivery = orders.filter(o => o.status === 'Out for delivery').length;
        const delivered = orders.filter(o => o.status === 'Delivered').length;

        res.json({
            success: true,
            data: { totalOrders, totalRevenue, pendingOrders, outForDelivery, delivered, menuItems, paidOrders: paidOrders.length }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error' });
    }
};

export { adminLogin, adminStats };
