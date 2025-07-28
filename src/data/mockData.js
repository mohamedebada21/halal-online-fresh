export const initialProducts = [
  { id: 1, name: 'Organic Watermelon', description: 'Fresh, seedless, and juicy. Perfect for summer.', category: 'Fruits', price: 5.99, stock: 100, lowStockThreshold: 10, imageUrl: 'https://placehold.co/400x400/27A659/FFFFFF?text=Watermelon', unit: 'each', taxable: true },
  { id: 2, name: 'Halal Chicken Breast', description: '1kg pack of free-range, zabihah halal chicken.', category: 'Meats', price: 12.50, stock: 50, lowStockThreshold: 10, imageUrl: 'https://placehold.co/400x400/F23D4C/FFFFFF?text=Chicken', unit: 'kg', taxable: false },
  { id: 3, name: 'Fresh Mint Bunch', description: 'Aromatic mint for teas and culinary uses.', category: 'Herbs', price: 1.29, stock: 8, lowStockThreshold: 5, imageUrl: 'https://placehold.co/400x400/27A659/FFFFFF?text=Mint', unit: 'bunch', taxable: false },
  { id: 4, name: 'Artisan Sourdough Bread', description: 'Naturally leavened, crusty, and delicious.', category: 'Bakery', price: 4.50, stock: 30, lowStockThreshold: 8, imageUrl: 'https://placehold.co/400x400/D2B48C/FFFFFF?text=Bread', unit: 'loaf', taxable: false },
  { id: 5, name: 'Organic Tomatoes', description: 'Vine-ripened tomatoes, sold by the pound.', category: 'Vegetables', price: 2.99, stock: 75, lowStockThreshold: 15, imageUrl: 'https://placehold.co/400x400/F23D4C/FFFFFF?text=Tomatoes', unit: 'kg', taxable: false },
  { id: 6, name: 'Medjool Dates', description: '500g pack of premium quality Medjool dates.', category: 'Pantry', price: 8.00, stock: 40, lowStockThreshold: 5, imageUrl: 'https://placehold.co/400x400/8B4513/FFFFFF?text=Dates', unit: 'pack', taxable: true },
];

export const initialOrders = [
    { id: 101, orderId: 'ORD-12345', items: [{ productId: 1, name: 'Organic Watermelon', quantity: 2, price: 5.99, taxable: true }], subtotal: 11.98, taxAmount: 1.06, totalAmount: 13.04, customerDetails: { name: 'Aisha Khan', phone: '555-123-4567', address: '123 Green St, Meadowlands' }, paymentMethod: 'cod', orderStatus: 'Pending', deliveryDate: new Date(new Date().setDate(new Date().getDate() + 1)) },
    { id: 102, orderId: 'ORD-12346', items: [{ productId: 2, name: 'Halal Chicken Breast', quantity: 1, price: 12.50, taxable: false }, { productId: 3, name: 'Fresh Mint Bunch', quantity: 1, price: 1.29, taxable: false }], subtotal: 13.79, taxAmount: 0, totalAmount: 13.79, customerDetails: { name: 'Bilal Ahmed', phone: '555-987-6543', address: '456 Red Ave, Orchard Hills' }, paymentMethod: 'stripe', paymentStatus: 'Paid', orderStatus: 'Fulfilled', deliveryDate: new Date(new Date().setDate(new Date().getDate() + 1)) },
];
