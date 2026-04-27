import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import crypto from "crypto";

const deliveryCharge = 50;
const frontend_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY;
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT;
const EASEBUZZ_BASE_URL = process.env.EASEBUZZ_BASE_URL || 'https://testpay.easebuzz.in';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5002';

const generateHash = ({ key, txnid, amount, productinfo, firstname, email, salt }) => {
    const str = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}||||||||||${salt}`;
    return crypto.createHash('sha512').update(str).digest('hex');
};

const verifyResponseHash = ({ salt, status, email, firstname, productinfo, amount, txnid, key }) => {
    const str = `${salt}|${status}|||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    return crypto.createHash('sha512').update(str).digest('hex');
};

// Place order — initiate Easebuzz payment
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const txnid = newOrder._id.toString();
        const amount = parseFloat(req.body.amount).toFixed(2);
        const productinfo = "Food Order";
        const firstname = req.body.address.firstName;
        const email = req.body.address.email;
        const phone = req.body.address.phone;

        const hash = generateHash({ key: EASEBUZZ_KEY, txnid, amount, productinfo, firstname, email, salt: EASEBUZZ_SALT });

        res.json({
            success: true,
            payment_data: {
                key: EASEBUZZ_KEY,
                txnid,
                amount,
                productinfo,
                firstname,
                email,
                phone,
                hash,
                surl: `${BACKEND_URL}/api/order/easebuzz-callback`,
                furl: `${BACKEND_URL}/api/order/easebuzz-callback`,
            },
            payment_url: `${EASEBUZZ_BASE_URL}/pay/v2/request`,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Easebuzz POSTs here after payment
const easebuzzCallback = async (req, res) => {
    try {
        const { status, txnid, amount, productinfo, firstname, email, hash } = req.body;

        const computedHash = verifyResponseHash({
            salt: EASEBUZZ_SALT,
            status,
            email,
            firstname,
            productinfo,
            amount,
            txnid,
            key: EASEBUZZ_KEY,
        });

        if (computedHash === hash && status === 'success') {
            await orderModel.findByIdAndUpdate(txnid, { payment: true });
            return res.redirect(`${frontend_URL}/verify?success=true&orderId=${txnid}`);
        }

        await orderModel.findByIdAndDelete(txnid);
        res.redirect(`${frontend_URL}/verify?success=false&orderId=${txnid}`);
    } catch (error) {
        console.log(error);
        res.redirect(`${frontend_URL}/verify?success=false&orderId=unknown`);
    }
};

const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
};

export { placeOrder, easebuzzCallback, listOrders, userOrders, updateStatus, placeOrderCod };
