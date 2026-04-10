import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, Bell, Receipt, Plus, Minus, X, Check, ArrowRight } from 'lucide-react';
import { mockMenu, categories } from '../data/mockData';
import './Menu.css';

export default function Menu() {
  const { tableId } = useParams();
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Local state for items in cart
  const [cart, setCart] = useState({});
  
  // "Running Bill" - items already officially ordered
  const [orders, setOrders] = useState([]);
  
  // UI states
  const [view, setView] = useState('menu'); // 'menu', 'cart', 'bill'
  const [toast, setToast] = useState('');

  const cartKeys = Object.keys(cart);
  const totalCartItems = cartKeys.reduce((acc, id) => acc + cart[id].qty, 0);
  const totalCartPrice = cartKeys.reduce((acc, id) => acc + (cart[id].price * cart[id].qty), 0);
  
  const totalBillPrice = orders.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAdd = (item) => {
    setCart(prev => {
      const existing = prev[item.id] || { ...item, qty: 0 };
      return { ...prev, [item.id]: { ...existing, qty: existing.qty + 1 } };
    });
  };

  const handleMinus = (item) => {
    setCart(prev => {
      if (!prev[item.id]) return prev;
      const nextQty = prev[item.id].qty - 1;
      const newState = { ...prev };
      if (nextQty <= 0) {
        delete newState[item.id];
      } else {
        newState[item.id] = { ...prev[item.id], qty: nextQty };
      }
      return newState;
    });
  };

  const placeOrder = () => {
    if (totalCartItems === 0) return;
    const newItems = Object.values(cart);
    setOrders(prev => [...prev, ...newItems]);
    setCart({});
    setView('menu');
    showToast('Order placed successfully! Kitchen is preparing your food.');
  };

  const handleCallWaiter = () => {
    showToast('Waiter has been notified and is on the way!');
  };

  const filteredMenu = activeCategory === 'All' 
    ? mockMenu 
    : mockMenu.filter(m => m.category === activeCategory);

  return (
    <div style={{ paddingBottom: '80px' }}>
      {toast && <div className="toast">{toast}</div>}

      <div className="menu-hero glass-header">
        <h1 className="text-gradient">Welcome To Grand Royale</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Table {tableId}</p>
      </div>

      <div className="category-scroll">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="container">
        <div className="menu-grid">
          {filteredMenu.map(item => (
            <div key={item.id} className="menu-card glass-panel animate-fade-in">
              <div className="menu-img-wrapper">
                <img src={item.image} alt={item.name} className="menu-img" loading="lazy" />
              </div>
              <div className="menu-content">
                <div className="menu-title">{item.name}</div>
                <div className="menu-desc">{item.description}</div>
                <div className="menu-footer">
                  <div className="menu-price">${item.price.toFixed(2)}</div>
                  {!cart[item.id] ? (
                    <button className="add-btn" onClick={() => handleAdd(item)}>
                      <Plus size={20} />
                    </button>
                  ) : (
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => handleMinus(item)}>
                        <Minus size={16} />
                      </button>
                      <span style={{ fontWeight: 'bold', width: '20px', textAlign:'center' }}>
                        {cart[item.id].qty}
                      </span>
                      <button className="qty-btn" onClick={() => handleAdd(item)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="floating-bar">
        <button 
          className={`action-item ${view === 'menu' ? 'active' : ''}`}
          onClick={() => setView('menu')}
        >
          <div className="action-icon">
             <Receipt size={24} style={{opacity:0}} /> {/* Spacer */}
             <div style={{position:'absolute', top:0, display:'flex', justifyContent:'center', width:'100%'}}>
               <img src="https://api.iconify.design/lucide:menu.svg?color=currentColor" width="24" alt="Menu" />
             </div>
          </div>
          <span>Menu</span>
        </button>

        <button 
          className="action-item"
          onClick={handleCallWaiter}
        >
          <div className="action-icon">
             <Bell size={24} />
          </div>
          <span>Waiter</span>
        </button>

        <button 
          className="action-item"
          onClick={() => setView('bill')}
        >
          <div className="action-icon">
             <Receipt size={24} />
             {orders.length > 0 && <span className="badge" style={{background: 'var(--color-accent)'}}>{orders.length}</span>}
          </div>
          <span>Bill</span>
        </button>

        <button 
          className={`action-item ${view === 'cart' || totalCartItems > 0 ? 'active' : ''}`}
          onClick={() => setView('cart')}
        >
          <div className="action-icon">
             <ShoppingBag size={24} />
             {totalCartItems > 0 && <span className="badge">{totalCartItems}</span>}
          </div>
          <span>Cart</span>
        </button>
      </div>

      {/* Cart Modal / Sheet */}
      {view === 'cart' && (
        <div className="modal-overlay" onClick={() => setView('menu')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Your Order</h2>
              <button className="btn-icon-only" onClick={() => setView('menu')} style={{background: 'transparent', color: 'var(--color-text)', border: 'none'}}>
                <X size={24} />
              </button>
            </div>

            {totalCartItems === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem 0' }}>Your cart is empty.</p>
            ) : (
              <div>
                {Object.values(cart).map(item => (
                  <div key={item.id} className="cart-item">
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>${item.price.toFixed(2)} x {item.qty}</div>
                    </div>
                    <div>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => handleMinus(item)}>
                          <Minus size={16} />
                        </button>
                        <span style={{ fontWeight: 'bold', width: '20px', textAlign:'center' }}>
                          {item.qty}
                        </span>
                        <button className="qty-btn" onClick={() => handleAdd(item)}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="cart-total">
                  <span>Subtotal</span>
                  <span>${totalCartPrice.toFixed(2)}</span>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={placeOrder}>
                  Place Order <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Running Bill Modal / Sheet */}
      {view === 'bill' && (
        <div className="modal-overlay" onClick={() => setView('menu')}>
          <div className="modal-content glass-panel" style={{border: '1px solid var(--color-accent)'}} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="text-gradient">Running Bill</h2>
              <button className="btn-icon-only" onClick={() => setView('menu')} style={{background: 'transparent', color: 'var(--color-text)', border: 'none'}}>
                <X size={24} />
              </button>
            </div>

            {orders.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem 0' }}>You haven't ordered anything yet.</p>
            ) : (
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  These items have been sent to the kitchen.
                </p>
                {orders.map((item, idx) => (
                  <div key={idx} className="cart-item">
                    <div>
                      <div style={{ fontWeight: 'bold', display: 'flex', alignItems:'center', gap:'0.5rem' }}>
                        <Check size={16} color="var(--color-success)" /> {item.name}
                      </div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                        {item.qty}x ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                <div className="cart-total" style={{ borderTop: '2px dashed var(--color-border)' }}>
                  <span>Total Due</span>
                  <span style={{ color: 'var(--color-accent)' }}>${totalBillPrice.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleCallWaiter}>
                    Call Waiter
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => showToast('Staff has been notified. They will bring the card terminal to Table ' + tableId)}>
                    Request Bill
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
