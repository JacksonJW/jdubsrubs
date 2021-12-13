import { useState } from 'react';

import { initiateCheckout } from '../lib/payments.js'

import products from '../products.json'


const defaultCart = {
    products: {}
}

export default function useCart() {

    const [cart, updateCart] = useState(defaultCart);

    const cartItems = Object.keys(cart.products).map(key => {
        const product = products.find(({ id }) => `${id}` === `${key}`);
        return {
            ...cart.products[key],
            pricePerUnit: product.price
        }
    });

    console.log(cartItems);

    const subtotal = cartItems.reduce((accumulator, { pricePerUnit, quantity }) => {
        return accumulator + (pricePerUnit * quantity);
    }, 0);

    console.log('subtotal', subtotal);

    const totalItems = cartItems.reduce((accumulator, { quantity }) => {
        return accumulator + quantity;
    }, 0);

    function addToCart({ id }) {
        updateCart((prev) => {
            let cart = { ...prev };

            if (cart.products[id]) {
                cart.products[id].quantity = cart.products[id].quantity + 1;
            } else {
                cart.products[id] = {
                    id,
                    quantity: 1
                }
            }

            return cart;
        })
    }

    function checkout() {
        initiateCheckout({
            lineItems: cartItems.map(({ id, quantity }) => {
                return {
                    price: id,
                    quantity
                }
            })
        })
    }

    return {
        cart,
        updateCart,
        subtotal,
        totalItems,
        addToCart,
        checkout
    }
}