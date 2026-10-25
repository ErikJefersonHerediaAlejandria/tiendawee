'use client';
import './store.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPlans, money, Plan } from '../lib/api';

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getPlans().then(setPlans).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="wrap">
      <div className="top"><Link href="/" className="brand"><img src="/logo.svg" alt="WeeStore" className="logo" /> WeeStore</Link></div>
      <h1>Elige tu plan de Wi-Fi</h1>
      <p className="sub">Internet de fibra sin permanencia. Precios mensuales con IGV incluido.</p>
      {error && <div className="err">{error}. ¿Está encendido el backend en el puerto 3000?</div>}
      <div className="grid">
        {plans.map((p) => (
          <div key={p.id} className={`card ${p.code === 'PREMIUM' ? 'hot' : ''}`}>
            {p.code === 'PREMIUM' && <span className="badge">Más popular</span>}
            <strong>{p.name}</strong>
            <div className="speed">{p.speedMbps} <small>Mbps</small></div>
            <div className="price">{money(p.price)} <small>/mes</small></div>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>{p.description}</p>
            <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
            <Link className="btn" href={`/checkout/${p.id}`}>Comprar plan</Link>
          </div>
        ))}
      </div>
    </div>
  );
}