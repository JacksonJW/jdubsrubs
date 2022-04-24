import { useState, createContext, useContext, useEffect } from 'react';

import { initiateCheckout } from '../lib/payments.js'

import products from '../products.json'


const defaultCart = {
  products: {}
}

export const CartContext = createContext();

export function useCartState() {

  const [cart, updateCart] = useState(defaultCart);

  useEffect(() => {
    const stateFromStorage = window.localStorage.getItem('jdubsrubs_cart');
    const data = stateFromStorage && JSON.parse(stateFromStorage);
    if (data) {
      updateCart(data);
    }
  }, [])

  useEffect(() => {
    const data = JSON.stringify(cart);
    window.localStorage.setItem('jdubsrubs_cart', data);
  }, [cart])

  const cartItems = Object.keys(cart.products).map(key => {
    const product = products.find(({ id }) => `${id}` === `${key}`);
    return {
      ...cart.products[key],
      pricePerUnit: product.price
    }
  });

  const subtotal = cartItems.reduce((accumulator, { pricePerUnit, quantity }) => {
    return accumulator + (pricePerUnit * quantity);
  }, 0);

  const totalItems = cartItems.reduce((accumulator, { quantity }) => {
    return accumulator + quantity;
  }, 0);

  function addToCart({ id }) {
    updateCart((prev) => {
      let cart1 = { ...prev };

      if (cart1.products[id]) {
        cart1.products[id].quantity = cart1.products[id].quantity + 1;
      } else {
        cart1.products[id] = {
          id,
          quantity: 1
        }
      }

      return cart1;
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
    subtotal,
    totalItems,
    addToCart,
    checkout
  };
}

export function useCart() {
  const cart = useContext(CartContext)
  return cart;
}