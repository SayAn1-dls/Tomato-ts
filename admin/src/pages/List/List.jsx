import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';
import getImageUrl from '../../utils/imageUrl';

const CATEGORIES = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"]

const List = () => {
    const [list, setList] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [editData, setEditData] = useState({});
    const [editImage, setEditImage] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchList = async () => {
        const response = await axios.get(`${url}/api/food/list`)
        if (response.data.success) {
            setList(response.data.data);
        } else {
            toast.error("Failed to load menu items")
        }
    }

    const removeFood = async (foodId) => {
        if (!window.confirm('Delete this item?')) return;
        const token = localStorage.getItem('adminToken');
        const response = await axios.post(`${url}/api/food/remove`, { id: foodId }, { headers: { token } })
        await fetchList();
        if (response.data.success) {
            toast.success(response.data.message);
        } else {
            toast.error("Error deleting item")
        }
    }

    const openEdit = (item) => {
        setEditItem(item);
        setEditData({ name: item.name, description: item.description, price: item.price, category: item.category });
        setEditImage(null);
    }

    const closeEdit = () => {
        setEditItem(null);
        setEditImage(null);
    }

    const onEditChange = (e) => {
        setEditData(d => ({ ...d, [e.target.name]: e.target.value }))
    }

    const saveEdit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('id', editItem._id);
            formData.append('name', editData.name);
            formData.append('description', editData.description);
            formData.append('price', editData.price);
            formData.append('category', editData.category);
            if (editImage) formData.append('image', editImage);

            const response = await axios.put(`${url}/api/food/update`, formData, { headers: { token } });
            if (response.data.success) {
                toast.success('Item updated');
                closeEdit();
                fetchList();
            } else {
                toast.error(response.data.message || 'Update failed');
            }
        } catch {
            toast.error('Server error');
        }
        setSaving(false);
    }

    useEffect(() => {
        fetchList();
    }, [])

    return (
        <div className='list add flex-col'>
            <p>All Menu Items ({list.length})</p>
            <div className='list-table'>
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Actions</b>
                </div>
                {list.map((item, index) => (
                    <div key={index} className='list-table-format'>
                        <img src={getImageUrl(url, item.image)} alt="" />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>{currency}{item.price}</p>
                        <div className='list-actions'>
                            <button className='edit-btn' onClick={() => openEdit(item)}>Edit</button>
                            <button className='delete-btn' onClick={() => removeFood(item._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {editItem && (
                <div className='edit-overlay' onClick={closeEdit}>
                    <div className='edit-modal' onClick={e => e.stopPropagation()}>
                        <div className='edit-modal-header'>
                            <h3>Edit: {editItem.name}</h3>
                            <button className='close-btn' onClick={closeEdit}>×</button>
                        </div>
                        <form onSubmit={saveEdit} className='edit-form'>
                            <div className='edit-image-section'>
                                <img
                                    src={editImage ? URL.createObjectURL(editImage) : getImageUrl(url, editItem.image)}
                                    alt=""
                                    className='edit-preview'
                                />
                                <label className='change-image-btn'>
                                    Change Image
                                    <input type="file" accept="image/*" hidden onChange={e => setEditImage(e.target.files[0])} />
                                </label>
                            </div>
                            <div className='edit-field'>
                                <label>Name</label>
                                <input name="name" value={editData.name} onChange={onEditChange} required />
                            </div>
                            <div className='edit-field'>
                                <label>Description</label>
                                <textarea name="description" value={editData.description} onChange={onEditChange} rows={3} required />
                            </div>
                            <div className='edit-row'>
                                <div className='edit-field'>
                                    <label>Category</label>
                                    <select name="category" value={editData.category} onChange={onEditChange}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className='edit-field'>
                                    <label>Price (₹)</label>
                                    <input type="number" name="price" value={editData.price} onChange={onEditChange} min="1" required />
                                </div>
                            </div>
                            <div className='edit-actions'>
                                <button type="button" className='cancel-btn' onClick={closeEdit}>Cancel</button>
                                <button type="submit" className='save-btn' disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default List
