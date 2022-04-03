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

  console.log('cartItems: ');
  console.log(cartItems);

  const subtotal = cartItems.reduce((accumulator, { pricePerUnit, quantity }) => {
    return accumulator + (pricePerUnit * quantity);
  }, 0);

  // console.log('subtotal', subtotal);

  const totalItems = cartItems.reduce((accumulator, { quantity }) => {
    return accumulator + quantity;
  }, 0);

  function addToCart({ id }) {
    updateCart((prev) => {
      let cart1 = { ...prev };

      if (cart1.products[id]) {
        console.log('cart1 before addtoCart():')
        console.log(cart1)
        cart1.products[id].quantity = cart1.products[id].quantity + 1;
        console.log('cart1 after addtoCart():')
        console.log(cart1)
      } else {
        console.log('cart1 before addtoCart():')
        console.log(cart1)
        cart1.products[id] = {
          id,
          quantity: 1
        }
        console.log('cart1 after addtoCart():')
        console.log(cart1)
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
  }
}