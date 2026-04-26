import React, { useEffect, useState } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';
import formatPrice from '../../utils/formatPrice';

const FILTERS = ['All', 'Food Processing', 'Out for delivery', 'Delivered'];

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('All');

    const fetchAllOrders = async () => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${url}/api/order/list`, { headers: { token } })
        if (response.data.success) {
            setOrders(response.data.data.reverse());
        } else {
            toast.error("Failed to load orders")
        }
    }

    const statusHandler = async (event, orderId) => {
        const token = localStorage.getItem('adminToken');
        const response = await axios.post(`${url}/api/order/status`, {
            orderId,
            status: event.target.value
        }, { headers: { token } })
        if (response.data.success) {
            await fetchAllOrders();
        } else {
            toast.error("Failed to update status")
        }
    }

    useEffect(() => {
        fetchAllOrders();
    }, [])

    const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className='order add'>
            <div className='orders-header'>
                <h3>Orders ({filtered.length})</h3>
                <div className='order-filters'>
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>
            <div className="order-list">
                {filtered.length === 0 && <p className='no-orders'>No orders found</p>}
                {filtered.map((order, index) => (
                    <div key={index} className='order-item'>
                        <img src={assets.parcel_icon} alt="" />
                        <div>
                            <p className='order-item-food'>
                                {order.items.map((item, i) =>
                                    i === order.items.length - 1
                                        ? `${item.name} x ${item.quantity}`
                                        : `${item.name} x ${item.quantity}, `
                                )}
                            </p>
                            <p className='order-item-name'>{order.address.firstName} {order.address.lastName}</p>
                            <div className='order-item-address'>
                                <p>{order.address.street},</p>
                                <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                            </div>
                            <p className='order-item-phone'>{order.address.phone}</p>
                        </div>
                        <p>Items: {order.items.length}</p>
                        <div className='order-amount-col'>
                            <p className='order-amount'>{formatPrice(order.amount, currency)}</p>
                            <span className={`payment-badge ${order.payment ? 'paid' : 'unpaid'}`}>
                                {order.payment ? 'Paid' : 'Unpaid'}
                            </span>
                        </div>
                        <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                            <option value="Food Processing">Food Processing</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Order
