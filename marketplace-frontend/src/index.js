import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const GA_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;
if (GA_ID) {
  const s1 = document.createElement('script');
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s1);
  const s2 = document.createElement('script');
  s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`;
  document.head.appendChild(s2);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
