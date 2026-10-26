'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState, Suspense } from 'react';
import { API, getPlans, money, Plan } from '../../../lib/api';

const IGV_RATE = 0.18;
const MAX_QTY = 5;

const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

function CheckoutInner() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ customerName: '', customerDoc: '', customerEmail: '', customerAddress: '', cardNumber: '' });

  useEffect(() => {
    getPlans().then((ps) => setPlan(ps.find((p) => p.id === Number(id)) ?? null)).catch((e) => setError(e.message));
  }, [id]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (k === 'cardNumber') v = formatCard(v);
    if (k === 'customerDoc') v = v.replace(/\D/g, '').slice(0, 11);
    setF({ ...f, [k]: v });
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const r = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: Number(id), quantity, ...f }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message);
      router.push(`/boleta/${data.id}`);
    } catch (err: any) {
      setError(err.message ?? 'Error al procesar el pago');
      setLoading(false);
    }
  }

  if (!plan) {
    return (
      <div className="wrap page">
        {error ? <div className="err">{error}</div> : <div className="loading"><span className="spinner" />Cargando plan…</div>}
      </div>
    );
  }

  const maxQty = Math.min(MAX_QTY, plan.stock);
  const total = plan.price * quantity;
  const subtotal = total / (1 + IGV_RATE);

  return (
    <div className="wrap page">
      <Link href="/#planes" className="back">← Volver a planes</Link>
      <div className="page-head">
        <h1>Finalizar compra</h1>
        <p>Completa tus datos y confirma el pago. Te tomará menos de un minuto.</p>
      </div>

      <div className="steps">
        <span className="step done"><span className="num">✓</span>Plan</span>
        <span className="bar" />
        <span className="step active"><span className="num">2</span>Datos y pago</span>
        <span className="bar" />
        <span className="step"><span className="num">3</span>Boleta</span>
      </div>

      <div className="two">
        <form className="card" onSubmit={submit} style={{ gap: 20 }}>
          <h3 className="block-title"><span className="ico">👤</span>Datos del cliente</h3>
          <div className="fields">
            <div className="field full"><label htmlFor="name">Nombre completo</label>
              <input id="name" required autoComplete="name" placeholder="Ej. María Pérez" value={f.customerName} onChange={set('customerName')} /></div>
            <div className="field"><label htmlFor="doc">DNI o RUC</label>
              <input id="doc" required inputMode="numeric" placeholder="8 u 11 dígitos" value={f.customerDoc} onChange={set('customerDoc')} /></div>
            <div className="field"><label htmlFor="email">Correo</label>
              <input id="email" required type="email" autoComplete="email" placeholder="tu@correo.com" value={f.customerEmail} onChange={set('customerEmail')} /></div>
            <div className="field full"><label htmlFor="addr">Dirección de instalación</label>
              <input id="addr" required autoComplete="street-address" placeholder="Av., número, distrito" value={f.customerAddress} onChange={set('customerAddress')} /></div>
          </div>

          <div className="divider" />

          <h3 className="block-title"><span className="ico">💳</span>Pago <span className="pill" style={{ marginLeft: 4 }}>Simulado</span></h3>
          <div className="field"><label htmlFor="card">Número de tarjeta</label>
            <input id="card" required inputMode="numeric" autoComplete="cc-number" placeholder="4111 1111 1111 1111" value={f.cardNumber} onChange={set('cardNumber')} /></div>
          <div className="hint">Modo de prueba: cualquier número de 16 dígitos se aprueba. Uno que termine en <b>0000</b> se rechaza.</div>

          {error && <div className="err">{error}</div>}

          <button className="btn block" disabled={loading}>
            {loading ? <><span className="spinner" />Procesando pago…</> : `Pagar ${money(total)}`}
          </button>
          <div className="secure">🔒 Tus datos viajan cifrados</div>
        </form>

        <aside className="card sticky">
          <h3 className="block-title">Resumen del pedido</h3>
          <div className="summary-plan">
            <div className="speed-chip">{plan.speedMbps}<small>Mbps</small></div>
            <div><strong>{plan.name}</strong><span>{money(plan.price)} / mes</span></div>
          </div>
          <div className="qty">
            <span className="qty-label">Cantidad</span>
            <div className="stepper">
              <button type="button" aria-label="Quitar" disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)}>−</button>
              <output>{quantity}</output>
              <button type="button" aria-label="Agregar" disabled={quantity >= maxQty} onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>
          <div>
            <div className="row"><span>Precio unitario</span><span>{money(plan.price)}</span></div>
            <div className="row muted"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="row muted"><span>IGV (18%)</span><span>{money(total - subtotal)}</span></div>
            <div className="row muted"><span>Instalación</span><span>Gratis</span></div>
            <div className="row total"><span>Total</span><span>{money(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div className="wrap page"><div className="loading"><span className="spinner" />Cargando…</div></div>}>
      <CheckoutInner />
    </Suspense>
  );
}
