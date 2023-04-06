import Order from '../models/orderSchema.js'
import jwt from 'jsonwebtoken';


export const orders_get = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const orders_post = async (req, res) => {
    const { items } = req.body;
    try {

        const token = req.headers['auth-token'];
        if (token) {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET || 'secret');
            const userId = decoded._id;

            const order = new Order({
                user: userId,
                items,
            });

            const newOrder = await order.save();


            res.status(201).json({ success: true, data: newOrder });
        } else {
            res.status(403).json({ error: 'You have no token, please log in' })
        }

    } catch (error) {
        console.error(error.stack);
        console.log(error.name);

        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: 'Invalid or expired token' });
        }
        if (error.name === 'ValidationError' && error.message.includes('items')) {
            return res.status(400).json({ success: false, error: 'Invalid format for items field' });
        }

        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const orders_delete = async (req, res) => {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Order deleted" });
};
export const order_put = async (req, res) => {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: "Order Updated" });
};
