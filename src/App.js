import React, { useState, useEffect } from 'react';

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// MOCK DATA (Simulates a database)
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const initialProducts = [
  { id: 1, name: 'Organic Watermelon', description: 'Fresh, seedless, and juicy. Perfect for summer.', category: 'Fruits', price: 5.99, stock: 100, lowStockThreshold: 10, imageUrl: 'https://placehold.co/400x400/27A659/FFFFFF?text=Watermelon' },
  { id: 2, name: 'Halal Chicken Breast', description: '1kg pack of free-range, zabihah halal chicken.', category: 'Meats', price: 12.50, stock: 50, lowStockThreshold: 10, imageUrl: 'https://placehold.co/400x400/F23D4C/FFFFFF?text=Chicken' },
  { id: 3, name: 'Fresh Mint Bunch', description: 'Aromatic mint for teas and culinary uses.', category: 'Herbs', price: 1.29, stock: 8, lowStockThreshold: 5, imageUrl: 'https://placehold.co/400x400/27A659/FFFFFF?text=Mint' },
  { id: 4, name: 'Artisan Sourdough Bread', description: 'Naturally leavened, crusty, and delicious.', category: 'Bakery', price: 4.50, stock: 30, lowStockThreshold: 8, imageUrl: 'https://placehold.co/400x400/D2B48C/FFFFFF?text=Bread' },
  { id: 5, name: 'Organic Tomatoes', description: 'Vine-ripened tomatoes, sold by the pound.', category: 'Vegetables', price: 2.99, stock: 75, lowStockThreshold: 15, imageUrl: 'https://placehold.co/400x400/F23D4C/FFFFFF?text=Tomatoes' },
  { id: 6, name: 'Medjool Dates', description: '500g pack of premium quality Medjool dates.', category: 'Pantry', price: 8.00, stock: 40, lowStockThreshold: 5, imageUrl: 'https://placehold.co/400x400/8B4513/FFFFFF?text=Dates' },
];

const initialOrders = [
    { id: 101, orderId: 'ORD-12345', items: [{ productId: 1, name: 'Organic Watermelon', quantity: 2, price: 5.99 }], totalAmount: 11.98, customerDetails: { name: 'Aisha Khan', phone: '555-123-4567', address: '123 Green St, Meadowlands' }, paymentMethod: 'cod', orderStatus: 'Pending', deliveryDate: new Date(new Date().setDate(new Date().getDate() + 1)) },
    { id: 102, orderId: 'ORD-12346', items: [{ productId: 2, name: 'Halal Chicken Breast', quantity: 1, price: 12.50 }, { productId: 3, name: 'Fresh Mint Bunch', quantity: 1, price: 1.29 }], totalAmount: 13.79, customerDetails: { name: 'Bilal Ahmed', phone: '555-987-6543', address: '456 Red Ave, Orchard Hills' }, paymentMethod: 'stripe', paymentStatus: 'Paid', orderStatus: 'Fulfilled', deliveryDate: new Date(new Date().setDate(new Date().getDate() + 1)) },
];


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// HELPER COMPONENTS
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Simple Icon component for UI clarity
const Icon = ({ name, className }) => {
    const icons = {
        cart: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.087-.835l1.858-6.493a1.125 1.125 0 00-.942-1.416H4.25L3.114 5.176A1.125 1.125 0 002.022 4.5H2.25M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.087-.835l1.858-6.493a1.125 1.125 0 00-.942-1.416H4.25L3.114 5.176A1.125 1.125 0 002.022 4.5H2.25" />,
        admin: <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.227l.26-.093c.552-.2 1.153.045 1.45.52l.298.468c.296.464.448.994.448 1.527v.923c0 .533-.152 1.064-.448 1.527l-.298.468c-.297.475-.9.72-1.45.52l-.26-.093a1.65 1.65 0 01-1.11-1.227v-2.175zM10.343 3.94c.09-.542.56-1.007 1.11-1.227l.26-.093c.552-.2 1.153.045 1.45.52l.298.468c.296.464.448.994.448 1.527v.923c0 .533-.152 1.064-.448 1.527l-.298.468c-.297.475-.9.72-1.45.52l-.26-.093a1.65 1.65 0 01-1.11-1.227v-2.175zM10.343 3.94a1.65 1.65 0 01-1.11 1.227l-.26.093c-.552.2-1.153-.045-1.45-.52l-.298-.468a2.25 2.25 0 01-.448-1.527v-.923c0-.533.152-1.064.448-1.527l.298-.468c.297-.475.9-.72 1.45-.52l.26.093a1.65 1.65 0 011.11 1.227z" />,
        shop: <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />,
        plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
        trash: <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0a48.11 48.11 0 00-7.5 0" />,
        edit: <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />,
        close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    };
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>{icons[name]}</svg>;
};

// Custom Modal component
const Modal = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Icon name="close" className="w-8 h-8"/>
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// MAIN APPLICATION COMPONENTS
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Header Component
const Header = ({ onNavigate, cartCount }) => (
    <header className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-3xl font-bold text-gray-800 cursor-pointer" onClick={() => onNavigate('shop')}>
                Halal<span className="text-green-600">Fresh</span> 🍉
            </div>
            <nav className="flex items-center space-x-4">
                <button onClick={() => onNavigate('shop')} className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                    <Icon name="shop" className="w-6 h-6" />
                    <span className="hidden sm:inline">Shop</span>
                </button>
                <button onClick={() => onNavigate('cart')} className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors relative">
                    <Icon name="cart" className="w-6 h-6" />
                    <span className="hidden sm:inline">Cart</span>
                    {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
                </button>
                <button onClick={() => onNavigate('admin')} className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                    <Icon name="admin" className="w-6 h-6" />
                    <span className="hidden sm:inline">Admin</span>
                </button>
            </nav>
        </div>
    </header>
);

// Product Card Component
const ProductCard = ({ product, onAddToCart }) => {
    const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
    const isOutOfStock = product.stock === 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
            <div className="relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/cccccc/FFFFFF?text=Image+Not+Found'; }}/>
                {isLowStock && !isOutOfStock && <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">Low Stock</span>}
                {isOutOfStock && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Out of Stock</span>}
            </div>
            <div className="p-4 flex flex-col h-full">
                <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1 flex-grow">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-black text-green-600">${product.price.toFixed(2)}</p>
                    <button 
                        onClick={() => onAddToCart(product)}
                        disabled={isOutOfStock}
                        className={`px-4 py-2 rounded-lg font-bold text-white transition-colors duration-300 ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Product List Component
const ProductList = ({ products, onAddToCart }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
    </div>
);

// Cart View Component
const CartView = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>
            {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty. Start shopping to add items!</p>
            ) : (
                <div>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center space-x-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                    <div>
                                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                                        <p className="text-gray-500">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border rounded-lg">
                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg">-</button>
                                        <span className="px-4 py-1 text-gray-800">{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg">+</button>
                                    </div>
                                    <p className="font-bold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                                        <Icon name="trash" className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-2xl font-bold text-gray-800">Total: <span className="text-green-600">${total.toFixed(2)}</span></p>
                        <button onClick={onCheckout} className="w-full md:w-auto mt-4 md:mt-0 bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Checkout Modal Component
const CheckoutModal = ({ onClose, onPlaceOrder, total }) => {
    const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', address: '' });
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (customerDetails.name && customerDetails.phone && customerDetails.address) {
            onPlaceOrder({ customerDetails, paymentMethod });
        } else {
            alert('Please fill in all delivery details.');
        }
    };

    return (
        <Modal onClose={onClose} title="Checkout">
            <form onSubmit={handleSubmit}>
                <h4 className="text-lg font-bold mb-4 text-gray-700">Delivery Details</h4>
                <div className="space-y-4">
                    <input type="text" name="name" placeholder="Full Name" value={customerDetails.name} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition" required />
                    <input type="tel" name="phone" placeholder="Phone Number" value={customerDetails.phone} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition" required />
                    <input type="text" name="address" placeholder="Delivery Address" value={customerDetails.address} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition" required />
                </div>

                <h4 className="text-lg font-bold mt-8 mb-4 text-gray-700">Payment Method</h4>
                <div className="space-y-3">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'cod' ? 'border-green-500 ring-2 ring-green-500' : ''}`}>
                        <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                        <span className="ml-3 font-semibold text-gray-800">Cash on Delivery (COD)</span>
                    </label>
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'stripe' ? 'border-green-500 ring-2 ring-green-500' : ''}`}>
                        <input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === 'stripe'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                        <span className="ml-3 font-semibold text-gray-800">Credit/Debit Card (via Stripe)</span>
                        <span className="ml-auto text-sm text-gray-500">(Not implemented)</span>
                    </label>
                </div>

                <div className="mt-8 text-right">
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300">
                        Place Order for ${total.toFixed(2)}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// ADMIN COMPONENTS
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Admin: Login View
const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would be a secure API call.
        // For this demo, any password works.
        if (password) {
            onLogin();
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
                <button type="submit" className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors">
                    Login
                </button>
            </form>
        </div>
    );
};

// Admin: Product Management
const ProductManagement = ({ products, onSaveProduct, onDeleteProduct }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleOpenModal = (product = null) => {
        setEditingProduct(product || { name: '', description: '', category: '', price: '', stock: '', lowStockThreshold: '', imageUrl: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSave = (productData) => {
        onSaveProduct(productData);
        handleCloseModal();
    };
    
    const ProductForm = ({ product, onSave, onCancel }) => {
        const [formData, setFormData] = useState(product);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(formData);
        };

        return (
            <Modal onClose={onCancel} title={product.id ? 'Edit Product' : 'Add Product'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full p-3 border rounded-lg" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-3 border rounded-lg" required />
                    <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full p-3 border rounded-lg" required />
                    <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-3 border rounded-lg" required />
                    <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" className="w-full p-3 border rounded-lg" required />
                    <input name="lowStockThreshold" type="number" value={formData.lowStockThreshold} onChange={handleChange} placeholder="Low Stock Threshold" className="w-full p-3 border rounded-lg" required />
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-3 border rounded-lg" />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold">Save Product</button>
                    </div>
                </form>
            </Modal>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Products</h3>
                <button onClick={() => handleOpenModal()} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-green-700">
                    <Icon name="plus" className="w-5 h-5" />
                    <span>Add Product</span>
                </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3">Stock</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                <td className="px-6 py-4">{p.category}</td>
                                <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                                <td className="px-6 py-4">{p.stock}</td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button onClick={() => handleOpenModal(p)} className="text-blue-600 hover:text-blue-800"><Icon name="edit" className="w-5 h-5"/></button>
                                    <button onClick={() => onDeleteProduct(p.id)} className="text-red-600 hover:text-red-800"><Icon name="trash" className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <ProductForm product={editingProduct} onSave={handleSave} onCancel={handleCloseModal} />}
        </div>
    );
};

// Admin: Order Management
const OrderManagement = ({ orders, onUpdateOrderStatus }) => (
    <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Orders</h3>
        <div className="space-y-6">
            {orders.sort((a, b) => b.id - a.id).map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-lg text-gray-900">{order.orderId}</p>
                            <p className="text-sm text-gray-500">{order.customerDetails.name} - {order.customerDetails.address}</p>
                            <p className="text-sm text-gray-500">Delivery: {order.deliveryDate.toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-lg text-green-600">${order.totalAmount.toFixed(2)}</p>
                           <p className={`text-sm font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>{order.paymentMethod.toUpperCase()} - {order.paymentStatus || 'Pending'}</p>
                        </div>
                    </div>
                    <div className="mt-4 border-t pt-4">
                        <ul className="text-sm space-y-1">
                            {order.items.map(item => (
                                <li key={item.productId}>{item.quantity} x {item.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4 flex justify-end items-center space-x-4">
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${order.orderStatus === 'Fulfilled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.orderStatus}</span>
                        {order.orderStatus === 'Pending' && (
                            <button onClick={() => onUpdateOrderStatus(order.id, 'Fulfilled')} className="bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
                                Mark as Fulfilled
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Admin: Inventory Management
const InventoryManagement = ({ products }) => (
     <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Inventory Overview</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Product</th>
                        <th scope="col" className="px-6 py-3 text-center">Stock Level</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {products.sort((a,b) => a.stock - b.stock).map(p => {
                        const isLowStock = p.stock > 0 && p.stock <= p.lowStockThreshold;
                        const isOutOfStock = p.stock === 0;
                        let statusColor = 'text-green-600';
                        let statusText = 'In Stock';
                        if (isLowStock) { statusColor = 'text-yellow-600'; statusText = 'Low Stock'; }
                        if (isOutOfStock) { statusColor = 'text-red-600'; statusText = 'Out of Stock'; }

                        return (
                            <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                <td className="px-6 py-4 text-center font-mono font-bold text-lg">{p.stock}</td>
                                <td className="px-6 py-4">
                                    <span className={`font-bold ${statusColor}`}>{statusText}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);


// Admin Dashboard Container
const AdminDashboard = ({ products, orders, onSaveProduct, onDeleteProduct, onUpdateOrderStatus, onLogout }) => {
    const [activeTab, setActiveTab] = useState('products');

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return <OrderManagement orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} />;
            case 'inventory':
                return <InventoryManagement products={products} />;
            case 'products':
            default:
                return <ProductManagement products={products} onSaveProduct={onSaveProduct} onDeleteProduct={onDeleteProduct} />;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
                <button onClick={onLogout} className="mt-4 md:mt-0 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Logout</button>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4">
                    <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                        <button onClick={() => setActiveTab('products')} className={`w-full text-left p-3 rounded-lg font-semibold transition ${activeTab === 'products' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}>Products</button>
                        <button onClick={() => setActiveTab('orders')} className={`w-full text-left p-3 rounded-lg font-semibold transition ${activeTab === 'orders' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}>Orders</button>
                        <button onClick={() => setActiveTab('inventory')} className={`w-full text-left p-3 rounded-lg font-semibold transition ${activeTab === 'inventory' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}>Inventory</button>
                    </nav>
                </aside>
                <main className="flex-1">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// MAIN APP COMPONENT
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export default function App() {
    // STATE MANAGEMENT
    const [view, setView] = useState('shop'); // shop, cart, admin
    const [products, setProducts] = useState(initialProducts);
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState(initialOrders);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [notification, setNotification] = useState('');

    // Notification Effect
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // HANDLERS
    const handleNavigate = (newView) => setView(newView);

    const handleAddToCart = (productToAdd) => {
        const productInStock = products.find(p => p.id === productToAdd.id);
        if (!productInStock || productInStock.stock <= 0) {
            setNotification('This item is out of stock.');
            return;
        }

        setCartItems(prevItems => {
            const itemInCart = prevItems.find(item => item.id === productToAdd.id);
            if (itemInCart) {
                // Check if adding another exceeds stock
                if (itemInCart.quantity >= productInStock.stock) {
                    setNotification('Cannot add more than available stock.');
                    return prevItems;
                }
                return prevItems.map(item =>
                    item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            setNotification(`${productToAdd.name} added to cart!`);
            return [...prevItems, { ...productToAdd, quantity: 1 }];
        });
    };
    
    const handleUpdateCartQuantity = (productId, newQuantity) => {
        const productInStock = products.find(p => p.id === productId);

        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
            return;
        }
        
        if (newQuantity > productInStock.stock) {
            setNotification(`Only ${productInStock.stock} items available.`);
            setCartItems(prevItems => prevItems.map(item =>
                item.id === productId ? { ...item, quantity: productInStock.stock } : item
            ));
            return;
        }

        setCartItems(prevItems => prevItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const handleRemoveFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        setNotification('Item removed from cart.');
    };


    const handleCheckout = () => {
        if (cartItems.length > 0) {
            setIsCheckoutModalOpen(true);
        }
    };

    const handlePlaceOrder = ({ customerDetails, paymentMethod }) => {
        // 1. Create the new order object
        const newOrder = {
            id: Date.now(),
            orderId: `ORD-${Date.now().toString().slice(-6)}`,
            items: cartItems.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            customerDetails,
            paymentMethod,
            paymentStatus: paymentMethod === 'stripe' ? 'Paid' : 'Pending', // Assume Stripe is pre-paid
            orderStatus: 'Pending',
            deliveryDate: new Date(new Date().setDate(new Date().getDate() + 1)) // Next day delivery
        };

        // 2. Update product stock
        setProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            cartItems.forEach(cartItem => {
                const productIndex = updatedProducts.findIndex(p => p.id === cartItem.id);
                if (productIndex !== -1) {
                    updatedProducts[productIndex].stock -= cartItem.quantity;
                }
            });
            return updatedProducts;
        });

        // 3. Add order to the list
        setOrders(prevOrders => [newOrder, ...prevOrders]);

        // 4. Clear the cart
        setCartItems([]);

        // 5. Close modal and show confirmation
        setIsCheckoutModalOpen(false);
        setNotification('Order placed successfully! Thank you!');
        setView('shop');
    };

    const handleAdminLogin = () => {
        setIsAdminLoggedIn(true);
    };
    
    const handleAdminLogout = () => {
        setIsAdminLoggedIn(false);
    }

    const handleSaveProduct = (productData) => {
        setProducts(prev => {
            if (productData.id) { // Editing existing product
                return prev.map(p => p.id === productData.id ? { ...p, ...productData, price: parseFloat(productData.price), stock: parseInt(productData.stock), lowStockThreshold: parseInt(productData.lowStockThreshold) } : p);
            } else { // Adding new product
                const newProduct = { ...productData, id: Date.now(), price: parseFloat(productData.price), stock: parseInt(productData.stock), lowStockThreshold: parseInt(productData.lowStockThreshold) };
                return [newProduct, ...prev];
            }
        });
        setNotification(productData.id ? 'Product updated!' : 'Product added!');
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(prev => prev.filter(p => p.id !== productId));
            setNotification('Product deleted.');
        }
    };
    
    const handleUpdateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
        setNotification(`Order ${orderId} marked as ${newStatus}.`);
    };

    // RENDER LOGIC
    const renderView = () => {
        switch (view) {
            case 'cart':
                return <CartView cartItems={cartItems} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />;
            case 'admin':
                return isAdminLoggedIn ? 
                    <AdminDashboard products={products} orders={orders} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct} onUpdateOrderStatus={handleUpdateOrderStatus} onLogout={handleAdminLogout} /> : 
                    <AdminLogin onLogin={handleAdminLogin} />;
            case 'shop':
            default:
                return <ProductList products={products} onAddToCart={handleAddToCart} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <Header onNavigate={handleNavigate} cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
            
            {/* Notification Popup */}
            {notification && (
                <div className="fixed top-24 right-6 bg-green-600 text-white py-3 px-6 rounded-lg shadow-2xl z-50 animate-fade-in-out">
                    {notification}
                </div>
            )}

            <main className="container mx-auto p-4 sm:p-6 md:p-8">
                {renderView()}
            </main>
            
            {isCheckoutModalOpen && <CheckoutModal onClose={() => setIsCheckoutModalOpen(false)} onPlaceOrder={handlePlaceOrder} total={cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)} />}

            <footer className="text-center py-8 mt-12 border-t">
                <p className="text-gray-500">&copy; {new Date().getFullYear()} HalalFresh. All Rights Reserved.</p>
            </footer>
            
            <style>{`
              @keyframes fade-in-out {
                0% { opacity: 0; transform: translateY(-20px); }
                15% { opacity: 1; transform: translateY(0); }
                85% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
              }
              .animate-fade-in-out {
                animation: fade-in-out 3s ease-in-out forwards;
              }
            `}</style>
        </div>
    );
}
