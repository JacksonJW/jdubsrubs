import { useState, createContext, useContext, useEffect } from 'react';
import { FaCreativeCommonsPd } from 'react-icons/fa';

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

  function updateItem({ id, quantity }) {
    updateCart((prev) => {
      let cart = { ...prev };

      if (cart.products[id]) {
        if (quantity === 0) {
          delete cart.products[id]
        } else {
          cart.products[id].quantity = quantity;
        }
      }

      return cart;
    })
  }

  function checkout() {
    if (cartItems.length > 0) {
      initiateCheckout({
        lineItems: cartItems.map(({ id, quantity }) => {
          return {
            price: id,
            quantity
          }
        })
      })
    }
  }

  return {
    cart,
    subtotal,
    totalItems,
    cartItems,
    addToCart,
    updateItem,
    checkout
  };
}

export function useCart() {
  const cart = useContext(CartContext)
  return cart;
}