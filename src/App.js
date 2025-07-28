import React, { useState, useEffect } from 'react';

// Import Data and Config
import { initialProducts, initialOrders } from './data/mockData';
import { TAX_RATE } from './config';

// Import Components
import Header from './components/layout/Header';
import ProductList from './components/shop/ProductList';
import CartView from './components/cart/CartView';
import CheckoutModal from './components/checkout/CheckoutModal';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
    const [view, setView] = useState('shop');
    const [products, setProducts] = useState(initialProducts);
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState(initialOrders);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [checkoutTotal, setCheckoutTotal] = useState(0);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // ... (All the handle... functions from the previous version go here) ...
    // handleNavigate, handleAddToCart, handleUpdateCartQuantity, handleRemoveFromCart,
    // handleCheckout, handlePlaceOrder, handleAdminLogin, handleAdminLogout,
    // handleSaveProduct, handleDeleteProduct, handleUpdateOrderStatus

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

    const handleCheckout = (total) => {
        if (cartItems.length > 0) {
            setCheckoutTotal(total);
            setIsCheckoutModalOpen(true);
        }
    };

    const handlePlaceOrder = ({ customerDetails, paymentMethod }) => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxAmount = cartItems.reduce((sum, item) => {
            if (item.taxable) {
                return sum + (item.price * item.quantity * TAX_RATE);
            }
            return sum;
        }, 0);
        
        const newOrder = {
            id: Date.now(),
            orderId: `ORD-${Date.now().toString().slice(-6)}`,
            items: cartItems.map(item => ({ productId: item.id, name: item.name, quantity: item.quantity, price: item.price, taxable: item.taxable })),
            subtotal,
            taxAmount,
            totalAmount: subtotal + taxAmount,
            customerDetails,
            paymentMethod,
            paymentStatus: paymentMethod === 'stripe' ? 'Paid' : 'Pending',
            orderStatus: 'Pending',
            deliveryDate: new Date(new Date().setDate(new Date().getDate() + 1))
        };

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
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        setCartItems([]);
        setIsCheckoutModalOpen(false);
        setNotification('Order placed successfully! Thank you!');
        setView('shop');
    };

    const handleAdminLogin = () => setIsAdminLoggedIn(true);
    const handleAdminLogout = () => setIsAdminLoggedIn(false);

    const handleSaveProduct = (productData) => {
        setProducts(prev => {
            const parsedData = {
                ...productData,
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock),
                lowStockThreshold: parseInt(productData.lowStockThreshold),
                taxable: !!productData.taxable
            };
            if (productData.id) {
                return prev.map(p => p.id === productData.id ? parsedData : p);
            }
            return [{ ...parsedData, id: Date.now() }, ...prev];
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
        <div className="text-gray-800">
            <Header onNavigate={handleNavigate} cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
            
            {notification && (
                <div className="fixed top-20 right-5 bg-green-600 text-white py-3 px-6 rounded-lg shadow-2xl z-50 animate-fade-in-out">
                    {notification}
                </div>
            )}

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {renderView()}
            </main>
            
            {isCheckoutModalOpen && <CheckoutModal onClose={() => setIsCheckoutModalOpen(false)} onPlaceOrder={handlePlaceOrder} total={checkoutTotal} />}

            <footer className="text-center py-10 mt-16 border-t border-gray-200">
                <p className="text-gray-500">&copy; {new Date().getFullYear()} HalalFresh. Built with 💚.</p>
            </footer>
        </div>
    );
}

export default App;