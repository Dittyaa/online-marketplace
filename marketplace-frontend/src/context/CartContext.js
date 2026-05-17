import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i._id === action.item._id);
      if (existing) {
        return state.map(i => i._id === action.item._id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(i => i._id !== action.id);
    case 'UPDATE_QTY':
      return state.map(i => i._id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    try { return JSON.parse(localStorage.getItem('mk_cart')) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('mk_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item) => dispatch({ type: 'ADD', item });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE', id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
