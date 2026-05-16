import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const API = process.env.REACT_APP_API_URL || 'http://dummyjson.com';

const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/produk/${product._id}`} className="product-card-img">
        {product.image
          ? <img src={`${API}${product.image}`} alt={product.name} />
          : <div className="product-card-placeholder">🏷️</div>
        }
        <span className="badge product-cat">{product.category}</span>
      </Link>
      <div className="product-card-body">
        <Link to={`/produk/${product._id}`} className="product-card-name">{product.name}</Link>
        <div className="product-card-footer">
          <span className="product-card-price">{fmt(product.price)}</span>
          <button
            className="btn btn-primary add-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Habis' : '+'}
          </button>
        </div>
        {product.stock < 5 && product.stock > 0 && (
          <p className="stock-warning">Sisa {product.stock}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
