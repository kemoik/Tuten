import { useState, useEffect, useCallback } from "react";
import { stkPush } from './mpesa.js';
import { sendOrderEmail } from './email.js';

/* ─── GOOGLE FONTS ─── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  `}</style>
);

/* ─── PRODUCT DATA ─── */
const PRODUCTS = [
  {
    id: 1, category: "sandals",
    name: "Black mesh/net mules ", price: 2200,
    desc: "Hand-stitched leather straps, cushioned sole wear all day.",
    image: "/images/sandal1.jpeg",
    color: "#C8936E",
    badge: "Bestseller",
  },
  {
    id: 2, category: "sandals",
    name: "Black woven slide sandals ", price: 1600,
    desc: "Turquoise & coral bead embellishments on a tan leather.",
    image: "/images/sandal2.jpeg",
    color: "#A67C52",
    badge: "New",
  },
  {
    id: 3, category: "sandals",
    name: "Cage Woven Mule", price: 2500,
    desc: "Bohemian woven upper with a flat leather sole. Effortlessly chic.",
    image: "/images/sandal3.jpeg",
    color: "#8B6348",
    badge: null,
  },
  {
    id: 4, category: "sandals",
    name: "Brown flat sandals", price: 1900,
    desc: "Minimalist crisscross straps in nude  pairs with everything.",
    image: "/images/sandal4.jpeg",
    color: "#C4A882",
    badge: null,
  },
  {
    id: 5, category: "linen",
    name: "Beige woven clutch ", price: 3800,
    desc: "Hand-painted florals on a structured straw basket. A statement piece .",
    image: "/images/sandal5.jpeg",
    color: "#F5F0E8",
    badge: "Bestseller",
  },
  {
    id: 6, category: "linen",
    name: "Brown leather sandals ", price: 3800,
    desc: "Same beloved brown leather sandals on pebbles ",
    image: "/images/sandal6.jpeg",
    color: "#E8B4A0",
    badge: "New",
  },
  {
    id: 7, category: "bags",
    name: "Market Straw Tote", price: 2800,
    desc: "Wide-woven natural straw with tan leather handles. Beach-ready.",
    image: "/images/bag1.jpeg",
    color: "#D4B483",
    badge: null,
  },
  {
    id: 8, category: "bags",
    name: "Embroidered Basket", price: 2200,
    desc: "Compact straw crossbody with leather panel detail.",
    image: "/images/bag2.jpeg",
    color: "#A67C52",
    badge: "New",
  },
  {
    id: 9, category: "bags",
    name: "Embroidered Basket", price: 3200,
    desc: "Large straw tote with brown leather. A statement piece.",
    image: "/images/bag3.jpeg",
    color: "#C8936E",
    badge: null,
  },
];

/* ─── STYLES ─── */
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --sand: #E8DCC4;
    --sand-light: #F5EFE0;
    --brown: #A67C52;
    --deep: #5C3D1E;
    --cream: #FAF7F2;
    --ocean: #3A7CA5;
    --ocean-dark: #2C6285;
    --terra: #C8936E;
    --white: #FFFFFF;
    --ink: #1A1410;
    --success: #2E7D52;
    --radius: 6px;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); -webkit-font-smoothing: antialiased; }
  h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; }

  /* ── NAV ── */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 999; background: rgba(250,247,242,0.97); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(166,124,82,0.12); }
  .nav-inner { max-width: 1340px; margin: 0 auto; padding: 0 2rem; height: 68px; display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; }
  .brand-sun { font-size: 1.5rem; animation: spin 30s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .brand-name { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 400; color: var(--ocean); letter-spacing: 0.06em; }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links button { background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: var(--deep); letter-spacing: 0.04em; padding: 0.3rem 0; position: relative; transition: color .25s; }
  .nav-links button::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: var(--ocean); transition: width .3s; }
  .nav-links button:hover { color: var(--ocean); }
  .nav-links button:hover::after { width: 100%; }
  .cart-btn { position: relative; background: var(--ocean); color: #fff; border: none; cursor: pointer; border-radius: var(--radius); padding: 0.55rem 1.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; transition: background .25s, transform .2s; }
  .cart-btn:hover { background: var(--ocean-dark); transform: translateY(-1px); }
  .cart-badge { position: absolute; top: -7px; right: -7px; background: var(--terra); color: #fff; border-radius: 50%; width: 20px; height: 20px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; font-weight: 500; }

  /* ── HERO ── */
  .hero { margin-top: 68px; min-height: calc(100vh - 68px); background: linear-gradient(150deg, var(--sand-light) 0%, var(--cream) 55%, #EAF4FA 100%); display: flex; align-items: center; justify-content: center; text-align: center; position: relative; overflow: hidden; padding: 4rem 2rem; }
  .hero-blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
  .hero-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(58,124,165,0.1) 0%, transparent 70%); top: -100px; right: -100px; animation: blobFloat 18s ease-in-out infinite; }
  .hero-blob-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(200,147,110,0.12) 0%, transparent 70%); bottom: -80px; left: -80px; animation: blobFloat 22s ease-in-out infinite reverse; }
  @keyframes blobFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px,-40px) scale(1.1); } }
  .hero-content { position: relative; z-index: 2; animation: fadeUp 0.9s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
  .hero-eyebrow { font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--ocean); margin-bottom: 1rem; font-weight: 500; }
  .hero h1 { font-size: clamp(3.5rem, 8vw, 6.5rem); font-weight: 300; color: var(--deep); line-height: 1.05; margin-bottom: 1.2rem; }
  .hero h1 em { font-style: italic; color: var(--terra); }
  .hero-sub { font-size: 1.15rem; color: var(--brown); font-weight: 300; letter-spacing: 0.04em; margin-bottom: 2.5rem; }
  .hero-pills { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2.5rem; }
  .hero-pill { padding: 0.4rem 1.2rem; border: 1px solid var(--brown); border-radius: 100px; font-size: 0.85rem; color: var(--deep); letter-spacing: 0.05em; background: rgba(255,255,255,0.6); }
  .hero-cta { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2.8rem; background: var(--deep); color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 1rem; letter-spacing: 0.06em; text-transform: uppercase; border-radius: var(--radius); transition: background .3s, transform .2s, box-shadow .3s; }
  .hero-cta:hover { background: var(--ocean); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(26,20,16,0.15); }

  /* ── CATEGORY TABS ── */
  .shop-section { max-width: 1340px; margin: 0 auto; padding: 5rem 2rem; }
  .section-header { text-align: center; margin-bottom: 3rem; }
  .section-header h2 { font-size: clamp(2.2rem, 5vw, 3.5rem); color: var(--deep); font-weight: 400; margin-bottom: 0.5rem; }
  .section-header p { color: var(--brown); font-size: 1.05rem; }
  .tabs { display: flex; gap: 0.75rem; justify-content: center; margin-bottom: 3rem; flex-wrap: wrap; }
  .tab { padding: 0.6rem 1.8rem; border-radius: 100px; border: 1.5px solid rgba(166,124,82,0.3); background: transparent; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; letter-spacing: 0.04em; color: var(--deep); transition: all .25s; }
  .tab:hover { border-color: var(--ocean); color: var(--ocean); }
  .tab.active { background: var(--deep); color: #fff; border-color: var(--deep); }

  /* ── PRODUCT GRID ── */
  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
  .product-card { background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid rgba(166,124,82,0.1); transition: transform .35s, box-shadow .35s; position: relative; }
  .product-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(26,20,16,0.1); }
  .product-img { height: 220px; display: flex; align-items: center; justify-content: center; font-size: 5rem; position: relative; overflow: hidden; }
  .product-badge { position: absolute; top: 12px; left: 12px; background: var(--terra); color: #fff; font-size: 0.7rem; padding: 0.3rem 0.8rem; border-radius: 100px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 500; }
  .product-body { padding: 1.5rem; }
  .product-cat { font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ocean); margin-bottom: 0.4rem; font-weight: 500; }
  .product-name { font-size: 1.3rem; color: var(--deep); margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2; }
  .product-desc { font-size: 0.88rem; color: #7A6550; line-height: 1.6; margin-bottom: 1.2rem; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--deep); font-weight: 500; }
  .product-price span { font-size: 0.85rem; font-family: 'DM Sans', sans-serif; color: var(--brown); margin-right: 2px; }
  .add-btn { background: var(--ocean); color: #fff; border: none; cursor: pointer; border-radius: var(--radius); padding: 0.6rem 1.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; letter-spacing: 0.04em; transition: background .25s, transform .2s; }
  .add-btn:hover { background: var(--deep); transform: scale(1.05); }
  .add-btn.added { background: var(--success); }

  /* ── ABOUT ── */
  .about-section { background: var(--sand); padding: 5rem 2rem; }
  .about-inner { max-width: 860px; margin: 0 auto; text-align: center; }
  .about-inner h2 { font-size: clamp(2rem, 4vw, 3rem); color: var(--deep); margin-bottom: 1.5rem; }
  .about-inner p { font-size: 1.1rem; line-height: 1.9; color: var(--deep); font-weight: 300; margin-bottom: 1rem; }
  .about-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; margin-top: 3rem; }
  .about-card { background: #fff; padding: 2rem 1.5rem; border-radius: 8px; text-align: center; }
  .about-card-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .about-card h4 { font-size: 1.2rem; color: var(--deep); margin-bottom: 0.5rem; }
  .about-card p { font-size: 0.9rem; color: var(--brown); line-height: 1.6; }

  /* ── CONTACT ── */
  .contact-section { max-width: 1340px; margin: 0 auto; padding: 5rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .contact-info h2 { font-size: clamp(2rem,4vw,3rem); color: var(--deep); margin-bottom: 1.5rem; }
  .info-card { background: #fff; border-radius: 8px; padding: 1.8rem; border: 1px solid rgba(166,124,82,0.12); margin-bottom: 1.5rem; }
  .info-row { display: flex; gap: 1rem; align-items: flex-start; padding: 1rem 0; border-bottom: 1px solid rgba(166,124,82,0.08); }
  .info-row:last-child { border-bottom: none; padding-bottom: 0; }
  .info-icon { width: 36px; height: 36px; background: rgba(58,124,165,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .info-text h4 { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--brown); margin-bottom: 0.3rem; }
  .info-text p { font-size: 0.95rem; color: var(--deep); line-height: 1.5; }
  .wa-link { display: inline-flex; align-items: center; gap: 0.75rem; padding: 1rem 2rem; background: #25D366; color: #fff; border-radius: var(--radius); font-size: 0.95rem; font-weight: 500; text-decoration: none; transition: all .3s; }
  .wa-link:hover { background: #1EB859; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,211,102,0.3); }
  .contact-map { height: 420px; background: linear-gradient(135deg, var(--ocean) 0%, var(--terra) 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1rem; }
  .contact-map h3 { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; color: #fff; font-weight: 300; }
  .contact-map p { color: rgba(255,255,255,0.8); font-size: 1rem; }

  /* ── FOOTER ── */
  footer { background: var(--deep); color: var(--sand); padding: 3rem 2rem 1.5rem; }
  .footer-inner { max-width: 1340px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 3rem; margin-bottom: 2.5rem; }
  .footer-col h4 { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; margin-bottom: 1.2rem; color: var(--sand); font-weight: 400; }
  .footer-col p, .footer-col a { font-size: 0.9rem; color: rgba(232,220,196,0.75); line-height: 2; display: block; text-decoration: none; transition: color .25s; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; }
  .footer-col a:hover, .footer-col button:hover { color: var(--sand); }
  .footer-bottom { border-top: 1px solid rgba(232,220,196,0.15); padding-top: 1.5rem; text-align: center; font-size: 0.85rem; color: rgba(232,220,196,0.5); }

  /* ── CART DRAWER ── */
  .overlay { position: fixed; inset: 0; background: rgba(26,20,16,0.5); z-index: 1200; backdrop-filter: blur(2px); animation: fadeIn .2s; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .drawer { position: fixed; right: 0; top: 0; bottom: 0; width: min(480px, 100vw); background: var(--cream); z-index: 1300; display: flex; flex-direction: column; animation: slideIn .3s ease; box-shadow: -20px 0 60px rgba(26,20,16,0.15); }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .drawer-head { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(166,124,82,0.15); display: flex; align-items: center; justify-content: space-between; }
  .drawer-head h3 { font-size: 1.6rem; color: var(--deep); }
  .drawer-close { background: none; border: none; cursor: pointer; font-size: 1.5rem; color: var(--brown); line-height: 1; padding: 0.25rem; transition: color .2s; }
  .drawer-close:hover { color: var(--deep); }
  .drawer-body { flex: 1; overflow-y: auto; padding: 1.5rem 2rem; }
  .empty-cart { text-align: center; padding: 4rem 2rem; }
  .empty-cart p { font-size: 1rem; color: var(--brown); margin-top: 1rem; }
  .cart-item { display: flex; gap: 1rem; padding: 1.2rem 0; border-bottom: 1px solid rgba(166,124,82,0.1); }
  .cart-item-emoji { width: 70px; height: 70px; background: var(--sand-light); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 2rem; flex-shrink: 0; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: var(--deep); margin-bottom: 0.25rem; }
  .cart-item-price { font-size: 0.9rem; color: var(--brown); margin-bottom: 0.6rem; }
  .qty-ctrl { display: flex; align-items: center; gap: 0.5rem; }
  .qty-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(166,124,82,0.3); background: #fff; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all .2s; color: var(--deep); }
  .qty-btn:hover { background: var(--ocean); color: #fff; border-color: var(--ocean); }
  .qty-num { font-size: 0.95rem; color: var(--deep); min-width: 20px; text-align: center; }
  .remove-item { background: none; border: none; cursor: pointer; color: #C0897A; font-size: 0.8rem; margin-left: auto; align-self: flex-start; transition: color .2s; padding: 0; }
  .remove-item:hover { color: #a0564a; }
  .drawer-foot { padding: 1.5rem 2rem; border-top: 1px solid rgba(166,124,82,0.15); background: #fff; }
  .cart-totals { margin-bottom: 1rem; }
  .totals-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--brown); margin-bottom: 0.5rem; }
  .totals-row.total { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: var(--deep); font-weight: 500; border-top: 1px solid rgba(166,124,82,0.15); padding-top: 0.75rem; margin-top: 0.75rem; }
  .checkout-btn { width: 100%; padding: 1.1rem; background: var(--deep); color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 1rem; letter-spacing: 0.06em; text-transform: uppercase; border-radius: var(--radius); transition: background .3s, transform .2s; }
  .checkout-btn:hover { background: var(--ocean); transform: translateY(-1px); }

  /* ── CHECKOUT MODAL ── */
  .modal-wrap { position: fixed; inset: 0; z-index: 1400; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal-backdrop { position: absolute; inset: 0; background: rgba(26,20,16,0.6); backdrop-filter: blur(4px); animation: fadeIn .2s; }
  .modal { position: relative; z-index: 2; background: var(--cream); border-radius: 12px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 30px 80px rgba(26,20,16,0.2); animation: modalUp .3s ease; }
  @keyframes modalUp { from { opacity:0; transform:translateY(30px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
  .modal-header { padding: 2rem 2rem 1.5rem; border-bottom: 1px solid rgba(166,124,82,0.12); display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: var(--cream); z-index: 2; }
  .modal-header h3 { font-size: 1.7rem; color: var(--deep); }
  .modal-step { font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ocean); background: rgba(58,124,165,0.08); padding: 0.3rem 0.8rem; border-radius: 100px; }
  .modal-body { padding: 2rem; }
  .form-group { margin-bottom: 1.4rem; }
  .form-group label { display: block; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--brown); margin-bottom: 0.5rem; font-weight: 500; }
  .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.85rem 1rem; border: 1.5px solid rgba(166,124,82,0.25); border-radius: var(--radius); background: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--ink); outline: none; transition: border-color .25s; }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--ocean); }
  .form-group textarea { resize: vertical; min-height: 90px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .order-summary { background: #fff; border-radius: 8px; padding: 1.5rem; border: 1px solid rgba(166,124,82,0.12); margin-bottom: 1.5rem; }
  .order-summary h4 { font-size: 1rem; color: var(--deep); margin-bottom: 1rem; }
  .order-line { display: flex; justify-content: space-between; font-size: 0.88rem; color: #7A6550; padding: 0.35rem 0; }
  .order-line.total-line { border-top: 1px dashed rgba(166,124,82,0.2); margin-top: 0.5rem; padding-top: 0.75rem; font-weight: 500; color: var(--deep); font-size: 1rem; }
  .mpesa-box { background: #F0FFF4; border: 1.5px solid #25D366; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .mpesa-logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
  .mpesa-logo-icon { width: 42px; height: 42px; background: #25D366; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #fff; font-weight: 700; }
  .mpesa-logo span { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: #1a5c2e; }
  .mpesa-box p { font-size: 0.88rem; color: #2E7D52; line-height: 1.6; }
  .mpesa-phone-input { display: flex; align-items: center; gap: 0; border: 1.5px solid rgba(37,211,102,0.5); border-radius: var(--radius); overflow: hidden; background: #fff; }
  .phone-prefix { padding: 0.85rem 0.9rem; background: rgba(37,211,102,0.1); font-size: 0.92rem; color: #2E7D52; font-weight: 500; border-right: 1px solid rgba(37,211,102,0.3); white-space: nowrap; }
  .phone-input-inner { flex: 1; padding: 0.85rem; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; background: transparent; }
  .pay-btn { width: 100%; padding: 1.1rem; background: #25D366; color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 1rem; letter-spacing: 0.06em; border-radius: var(--radius); transition: all .3s; font-weight: 500; }
  .pay-btn:hover:not(:disabled) { background: #1EB859; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(37,211,102,0.3); }
  .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .nav-btns { display: flex; gap: 1rem; }
  .btn-back { flex: 1; padding: 0.9rem; background: transparent; border: 1.5px solid rgba(166,124,82,0.3); color: var(--deep); cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; border-radius: var(--radius); transition: all .25s; }
  .btn-back:hover { border-color: var(--ocean); color: var(--ocean); }
  .btn-next { flex: 2; padding: 0.9rem; background: var(--deep); color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; letter-spacing: 0.05em; border-radius: var(--radius); transition: background .25s, transform .2s; }
  .btn-next:hover { background: var(--ocean); transform: translateY(-1px); }

  /* ── PROCESSING ── */
  .processing { text-align: center; padding: 3rem 2rem; }
  .spinner { width: 56px; height: 56px; border: 3px solid rgba(37,211,102,0.2); border-top-color: #25D366; border-radius: 50%; animation: spin2 .8s linear infinite; margin: 0 auto 1.5rem; }
  @keyframes spin2 { to { transform: rotate(360deg); } }
  .processing h3 { font-size: 1.6rem; color: var(--deep); margin-bottom: 0.5rem; }
  .processing p { color: var(--brown); font-size: 0.95rem; line-height: 1.6; }

  /* ── SUCCESS ── */
  .success { text-align: center; padding: 3rem 2rem; }
  .success-icon { font-size: 5rem; margin-bottom: 1.5rem; animation: pop .5s cubic-bezier(0.175,0.885,0.32,1.275); }
  @keyframes pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .success h3 { font-size: 2rem; color: var(--success); margin-bottom: 0.75rem; }
  .success p { color: var(--brown); font-size: 0.95rem; line-height: 1.7; margin-bottom: 0.5rem; }
  .success-ref { display: inline-block; background: rgba(46,125,82,0.1); padding: 0.6rem 1.4rem; border-radius: 100px; font-size: 0.9rem; color: var(--success); font-weight: 500; letter-spacing: 0.06em; margin: 1rem 0; }
  .done-btn { margin-top: 1.5rem; padding: 0.9rem 2.5rem; background: var(--deep); color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; border-radius: var(--radius); transition: background .25s; }
  .done-btn:hover { background: var(--ocean); }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .about-grid { grid-template-columns: 1fr; }
    .contact-section { grid-template-columns: 1fr; }
    .footer-inner { grid-template-columns: 1fr; gap: 2rem; }
    .form-row { grid-template-columns: 1fr; }
    .modal { border-radius: 12px 12px 0 0; position: fixed; bottom: 0; left: 0; right: 0; max-width: 100%; max-height: 92vh; }
    .modal-wrap { align-items: flex-end; padding: 0; }
  }
`;

/* ─── HELPERS ─── */
const KES = (n) => `KES ${n.toLocaleString()}`;

const generateRef = () =>
  "TUT-" +
  Math.random().toString(36).substring(2, 6).toUpperCase() +
  Date.now().toString().slice(-4);

/* ─── COMPONENTS ─── */

function ProductCard({ product, onAdd, added }) {
  return (
    <div className="product-card">
<div className="product-img" style={{ position: "relative", overflow: "hidden" }}>
  <img
    src={product.image}
    alt={product.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      transition: "transform 0.5s ease",
    }}
    onError={(e) => {
      // fallback if image missing
      e.target.style.display = "none";
      e.target.parentElement.style.background =
        `linear-gradient(135deg, ${product.color}33, ${product.color}66)`;
    }}
  />
  {product.badge && <span className="product-badge">{product.badge}</span>}
</div>
      <div className="product-body">
        <div className="product-cat">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        <div className="product-footer">
          <div className="product-price">
            <span>KES </span>{product.price.toLocaleString()}
          </div>
          <button
            className={`add-btn${added ? " added" : ""}`}
            onClick={() => onAdd(product)}
          >
            {added ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onQty, onRemove, onCheckout }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = 300;
  const total = subtotal + delivery;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-head">
          <h3 className="drawer-head-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", color: "var(--deep)" }}>
            Your Cart {cart.length > 0 && <span style={{ fontSize: "1rem", color: "var(--brown)" }}>({cart.reduce((s, i) => s + i.qty, 0)} items)</span>}
          </h3>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div style={{ fontSize: "4rem" }}>🛍️</div>
              <p>Your cart is empty.<br />Discover our effortless collection!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-emoji">{item.emoji}</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{KES(item.price)} each</div>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => onQty(item.id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => onQty(item.id, +1)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => onRemove(item.id)}>✕ Remove</button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="drawer-foot">
            <div className="cart-totals">
              <div className="totals-row">
                <span>Subtotal</span><span>{KES(subtotal)}</span>
              </div>
              <div className="totals-row">
                <span>Delivery (Mombasa)</span><span>{KES(delivery)}</span>
              </div>
              <div className="totals-row total">
                <span>Total</span><span>{KES(total)}</span>
              </div>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Checkout — {KES(total)}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function CheckoutModal({ cart, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", mpesaPhone: "",
    delivery: "pickup", address: "", instructions: "",
  });
  const [status, setStatus] = useState("idle"); // idle | processing | success
  const [orderRef, setOrderRef] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = form.delivery === "pickup" ? 0 : 300;
  const total = subtotal + delivery;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const simulateMpesaPush = async () => {
  setStatus("processing");
  try {
    const ref = generateRef();

    const result = await stkPush({
      phone: form.mpesaPhone,
      amount: total,
      ref,
    });

    console.log("Daraja response:", result);

    if (result.ResponseCode === "0") {
      setOrderRef(ref);
      await sendOrderEmail(ref);   // ← we'll add this next
      setStatus("success");
      onSuccess();
    } else {
      alert("Payment failed: " + result.errorMessage);
      setStatus("idle");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
    setStatus("idle");
  }
};

  if (status === "processing") {
    return (
      <div className="modal-wrap">
        <div className="modal-backdrop" />
        <div className="modal">
          <div className="processing">
            <div className="spinner" />
            <h3>Processing Payment…</h3>
            <p>
              An M-Pesa STK Push has been sent to<br />
              <strong>+254 {form.mpesaPhone}</strong>.<br />
              Please check your phone and enter your M-Pesa PIN.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="modal-wrap">
        <div className="modal-backdrop" onClick={onClose} />
        <div className="modal">
          <div className="success">
            <div className="success-icon">🎉</div>
            <h3>Order Confirmed!</h3>
            <div className="success-ref">{orderRef}</div>
            <p>Your payment was successful. A confirmation has been sent to <strong>{form.email}</strong>.</p>
            <p style={{ marginTop: "0.5rem" }}>The Tuten team has received your order and will prepare it shortly.</p>
            <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "var(--ocean)" }}>
              {form.delivery === "pickup"
                ? "📍 Pickup at In Motion Delivery, Jundan Meru Rd, Mombasa"
                : `🚚 Delivery to: ${form.address}`}
            </p>
            <button className="done-btn" onClick={onClose}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-wrap">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal">
        <div className="modal-header">
          <h3>{step === 1 ? "Your Details" : step === 2 ? "Delivery" : "Pay with M-Pesa"}</h3>
          <span className="modal-step">Step {step} of 3</span>
        </div>
        <div className="modal-body">
          {/* STEP 1 – Contact Info */}
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input placeholder="e.g. Amina Hassan" value={form.name} onChange={set("name")} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input placeholder="07XX XXX XXX" value={form.phone} onChange={set("phone")} />
                </div>
              </div>
              <button
                className="btn-next"
                style={{ width: "100%" }}
                onClick={() => setStep(2)}
                disabled={!form.name || !form.email || !form.phone}
              >
                Continue to Delivery →
              </button>
            </>
          )}

          {/* STEP 2 – Delivery */}
          {step === 2 && (
            <>
              <div className="form-group">
                <label>Delivery Option</label>
                <select value={form.delivery} onChange={set("delivery")}>
                  <option value="pickup"> Pickup – In Motion Delivery, Mombasa (Free)</option>
                  <option value="delivery"> Home Delivery – Mombasa (KES 300)</option>
                </select>
              </div>
              {form.delivery === "delivery" && (
                <div className="form-group">
                  <label>Delivery Address</label>
                  <input placeholder="Street, Estate, Landmark, Mombasa" value={form.address} onChange={set("address")} />
                </div>
              )}
              <div className="form-group">
                <label>Special Instructions (optional)</label>
                <textarea
                  placeholder="e.g. preferred colour, size, or anything else we should know…"
                  value={form.instructions}
                  onChange={set("instructions")}
                />
              </div>
              <div className="order-summary">
                <h4>Order Summary</h4>
                {cart.map((i) => (
                  <div className="order-line" key={i.id}>
                    <span>{i.name} × {i.qty}</span>
                    <span>{KES(i.price * i.qty)}</span>
                  </div>
                ))}
                <div className="order-line">
                  <span>Delivery</span><span>{delivery === 0 ? "Free" : KES(delivery)}</span>
                </div>
                <div className="order-line total-line">
                  <span>Total</span><span>{KES(total)}</span>
                </div>
              </div>
              <div className="nav-btns">
                <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-next" onClick={() => setStep(3)}>Pay Now →</button>
              </div>
            </>
          )}

          {/* STEP 3 – M-Pesa */}
          {step === 3 && (
            <>
              <div className="order-summary">
                <h4>Amount to Pay</h4>
                <div className="order-line total-line" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
                  <span>Total</span>
                  <span style={{ fontSize: "1.4rem", color: "var(--success)" }}>{KES(total)}</span>
                </div>
              </div>

              <div className="mpesa-box">
                <div className="mpesa-logo">
                  <div className="mpesa-logo-icon">M</div>
                  <span>M-Pesa STK Push</span>
                </div>
                <p>Enter your M-Pesa number below. You will receive a push notification on your phone to confirm the payment with your PIN.</p>
              </div>

              <div className="form-group">
                <label>M-Pesa Phone Number</label>
                <div className="mpesa-phone-input">
                  <span className="phone-prefix">🇰🇪 +254</span>
                  <input
                    className="phone-input-inner"
                    placeholder="7XX XXX XXX"
                    value={form.mpesaPhone}
                    onChange={set("mpesaPhone")}
                    maxLength={9}
                    type="tel"
                  />
                </div>
              </div>

              <button
                className="pay-btn"
                onClick={simulateMpesaPush}
                disabled={form.mpesaPhone.length < 9}
              >
                 Pay {KES(total)} via M-Pesa
              </button>
              <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--brown)", marginTop: "0.75rem" }}>
                Secured by Safaricom M-Pesa · Your PIN is never shared
              </p>

              <div style={{ marginTop: "1rem" }}>
                <button className="btn-back" onClick={() => setStep(2)}>← Back</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── APP ─── */
export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [justAdded, setJustAdded] = useState({});
  const [page, setPage] = useState("home");

  const filtered = activeTab === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeTab);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setJustAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setJustAdded((prev) => ({ ...prev, [product.id]: false })), 1800);
  }, []);

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const handleSuccess = () => setCart([]);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{css}</style>
      <FontLink />

      {/* NAV */}
      <header className="nav">
        <div className="nav-inner">
          <div className="brand" onClick={() => scrollTo("home")}>
            <span className="brand-sun">☀️</span>
            <span className="brand-name">TUTEN</span>
          </div>
          <ul className="nav-links">
            <li><button onClick={() => scrollTo("shop")}>Shop</button></li>
            <li><button onClick={() => scrollTo("about")}>About</button></li>
            <li><button onClick={() => scrollTo("contact")}>Contact</button></li>
          </ul>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛍️ Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-content">
          <p className="hero-eyebrow">Mombasa, Kenya </p>
          <h1>Effortless<br /><em>Style</em></h1>
          <p className="hero-sub">Sandals · Linen · Straw Bags</p>
          <div className="hero-pills">
            <span className="hero-pill">🌊 Coastal Living</span>
            <span className="hero-pill">☀️ Natural Materials</span>
            <span className="hero-pill">✦ Curated Quality</span>
          </div>
          <button className="hero-cta" onClick={() => scrollTo("shop")}>
            Shop Collection ↓
          </button>
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" className="shop-section">
        <div className="section-header">
          <h2>Our Collection</h2>
          <p>Curated pieces for effortless coastal style</p>
        </div>
        <div className="tabs">
          {["all", "sandals", "linen", "bags"].map((t) => (
            <button
              key={t}
              className={`tab${activeTab === t ? " active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t === "all" ? "All Pieces" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={addToCart}
              added={!!justAdded[p.id]}
            />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="about-inner">
          <h2>Where Coast Meets Style</h2>
          <p>
           Tuten brings you effortless elegance for the modern, free-spirited soul. 
           Each piece is thoughtfully curated to embody relaxed sophistication and 
           timeless coastal charm.
          </p>
          <p>
            From intricately crafted sandals to flowing linen and artisan straw bags 
            we celebrate natural materials and timeless design for those who appreciate
            quality, comfort, and understated beauty.
          </p>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-card-icon">🌿</div>
              <h4>Natural Materials</h4>
              <p>Every piece made from leather, linen, and natural straw, sourced with care.</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">☀️</div>
              <h4>Coastal Inspired</h4>
              <p>Designs born from Mombasa's beaches, sun, and effortless ocean-side living.</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">✦</div>
              <h4>Curated Quality</h4>
              <p>Personally selected styles that stand the test of time and daily wear.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="contact-info">
          <h2>Find Us in Mombasa</h2>
          <div className="info-card">
            <div className="info-row">
              <div className="info-icon">📍</div>
              <div className="info-text">
                <h4>Pickup Point</h4>
                <p>In Motion Delivery<br />Jundan Meru Road, Mombasa<br />Kenya</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon">📱</div>
              <div className="info-text">
                <h4>WhatsApp Catalogue</h4>
                <p>+254 799 914 704<br />Browse the full catalogue on WhatsApp</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon">📸</div>
              <div className="info-text">
                <h4>Instagram</h4>
                <p>@tuten_ke<br />New arrivals & style inspiration daily</p>
              </div>
            </div>
          </div>
          <a href="https://wa.me/c/254799914704" className="wa-link" target="_blank" rel="noreferrer">
            <span style={{ fontSize: "1.2rem" }}>💬</span> Open WhatsApp Catalogue
          </a>
        </div>
        <div className="contact-map">
          <h3>Mombasa, Kenya</h3>
          <p>🌊 Indian Ocean Coast</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>Pickup available at In Motion Delivery</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-col">
            <h4>Tuten</h4>
            <p>Effortless style for the modern soul — curated from Mombasa's coastal heart.</p>
          </div>
          <div className="footer-col">
            <h4>Navigate</h4>
            <a onClick={() => scrollTo("shop")}>Shop Collection</a>
            <a onClick={() => scrollTo("about")}>About Tuten</a>
            <a onClick={() => scrollTo("contact")}>Contact & Location</a>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="https://www.instagram.com/tuten_ke" target="_blank" rel="noreferrer">Instagram @tuten_ke</a>
            <a href="https://wa.me/c/254799914704" target="_blank" rel="noreferrer">WhatsApp Catalogue</a>
            <p>Jundan Meru Rd, Mombasa</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Tuten · Effortless Style from Mombasa </p>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onQty={updateQty}
          onRemove={removeItem}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        />
      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
