'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPlans, money, Plan } from '../lib/api';

const PERKS = ['Sin permanencia', 'Instalación gratis', 'Router incluido', 'Soporte 24/7'];

export default function Home() {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getPlans().then(setPlans).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow">100% fibra óptica</span>
          <h1>Internet rápido y <em>sin complicaciones</em></h1>
          <p className="sub">Elige tu plan, paga en línea y recibe la instalación en tu casa. Precios mensuales con IGV incluido.</p>
          <ul className="perks">
            {PERKS.map((p) => <li key={p}><i className="check" />{p}</li>)}
          </ul>
        </div>
      </section>

      <section id="planes" className="page">
        <div className="wrap">
          <div className="section-title">
            <h2>Elige tu plan de Wi‑Fi</h2>
            <p>Puedes cambiar de plan cuando quieras</p>
          </div>

          {error && <div className="err">{error}. ¿Está encendido el backend en el puerto 3000?</div>}

          <div className="grid">
            {!plans && !error && [0, 1, 2, 3].map((i) => (
              <div key={i} className="card skeleton">
                <div className="sk" style={{ height: 14, width: '50%' }} />
                <div className="sk" style={{ height: 44, width: '70%' }} />
                <div className="sk" style={{ height: 26, width: '55%' }} />
                <div className="sk" style={{ height: 60 }} />
                <div className="sk" style={{ flex: 1 }} />
                <div className="sk" style={{ height: 46 }} />
              </div>
            ))}

            {plans?.map((p) => {
              const hot = p.code === 'PREMIUM';
              return (
                <article key={p.id} className={`card plan ${hot ? 'hot' : ''}`}>
                  {hot && <span className="badge">★ Más popular</span>}
                  <div className="plan-name">{p.name}</div>
                  <div className="speed">{p.speedMbps}<small>Mbps</small></div>
                  <div className="price">{money(p.price)} <small>/mes</small></div>
                  <p className="desc">{p.description}</p>
                  <div className="divider" />
                  <ul className="features">
                    {p.features.map((f) => <li key={f}><i className="check" />{f}</li>)}
                  </ul>
                  {p.stock <= 10 && (
                    <div className={`stock ${p.stock <= 3 ? 'low' : ''}`}>
                      {p.stock > 0 ? `Quedan ${p.stock} instalaciones este mes` : 'Agotado por ahora'}
                    </div>
                  )}
                  {p.stock > 0
                    ? <Link className={`btn block ${hot ? '' : 'ghost'}`} href={`/checkout/${p.id}`}>Contratar plan</Link>
                    : <button className="btn block ghost" disabled>Agotado</button>}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
