const Cart = require('../models/cart');
const Commodity = require('../models/commodity');

// Add item to cart
const addItemToCart = async (req, res) => {
    const userId = req.session.userId;
    const { commodityId, quantity } = req.body;

    // Default quantity to 1 if not provided or invalid
    const validQuantity = quantity && quantity > 0 ? quantity : 1;

    if (!commodityId || validQuantity < 1) {
        return res.status(400).json({ message: 'Invalid commodity or quantity' });
    }

    try {
        const commodity = await Commodity.findById(commodityId);

        if (!commodity) {
            return res.status(404).json({ message: 'Commodity not found' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.commodity.equals(commodityId));

        if (itemIndex > -1) {  // Update quantity if item already exists in the cart
            cart.items[itemIndex].quantity += validQuantity;
        } else { // Add new items to cart
            cart.items.push({
                commodity: commodityId,
                quantity: validQuantity,
                price: commodity.price,
            });
        }

        cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();

        res.status(200).json({ message: 'Item added to cart', cart });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get cart
const getCart = async (req, res) => {
    const userId = req.session.userId;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.commodity', 'name price');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//update cart
const updateCartItem = async (req, res) => {
    const userId = req.session.userId;
    const { itemId } = req.params;
    const { quantity } = req.body;


    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
    }

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => item._id.equals(itemId));

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update the item's quantity
        cart.items[itemIndex].quantity = quantity;

        // Recalculate the total amount
        cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        // Save the updated cart
        await cart.save();

        // Send response
        res.status(200).json({ message: 'Cart item updated', cart });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//remove from cart
const removeCartItem = async (req, res) => {
    const userId = req.session.userId;
    const { itemId } = req.params;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.equals(itemId));

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);

        cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();

        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//clear cart
const clearCart = async (req, res) => {
    const userId = req.session.userId;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.totalAmount = 0;

        await cart.save();

        res.status(200).json({ message: 'Cart cleared', cart });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    addItemToCart, clearCart, removeCartItem, updateCartItem, getCart
};
