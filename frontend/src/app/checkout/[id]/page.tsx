'use client';
import '../../store.css';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { API, getPlans, money, Plan } from '../../../lib/api';

export default function Checkout() {
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

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

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

  if (!plan) return <div className="wrap">{error ? <div className="err">{error}</div> : 'Cargando…'}</div>;
  const total = plan.price * quantity;

  return (
    <div className="wrap">
      <div className="top"><Link href="/" className="brand"><img src="/logo.svg" alt="WeeStore" className="logo" /> WeeStore</Link><Link href="/">← Volver a planes</Link></div>
      <h1>Finalizar compra</h1>
      <div className="two">
        <form className="card" onSubmit={submit}>
          <strong>Datos del cliente</strong>
          <div><label>Nombre completo</label><input required value={f.customerName} onChange={set('customerName')} /></div>
          <div><label>DNI o RUC</label><input required inputMode="numeric" value={f.customerDoc} onChange={set('customerDoc')} /></div>
          <div><label>Correo</label><input required type="email" value={f.customerEmail} onChange={set('customerEmail')} /></div>
          <div><label>Dirección de instalación</label><input required value={f.customerAddress} onChange={set('customerAddress')} /></div>
          <strong style={{ marginTop: 12 }}>Pago (simulado)</strong>
          <div><label>Número de tarjeta (16 dígitos)</label><input required inputMode="numeric" maxLength={19} placeholder="4111 1111 1111 1111" value={f.cardNumber} onChange={set('cardNumber')} /></div>
          <small style={{ color: '#64748b' }}>Prueba: cualquier número de 16 dígitos aprueba; uno que termine en 0000 se rechaza.</small>
          {error && <div className="err">{error}</div>}
          <button className="btn" disabled={loading}>{loading ? 'Procesando pago…' : `Pagar ${money(total)}`}</button>
        </form>

        <div className="card">
          <strong>Resumen</strong>
          <div>{plan.name} · {plan.speedMbps} Mbps</div>
          <label>Cantidad</label>
          <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}
          </select>
          <div className="row"><span>Precio unitario</span><span>{money(plan.price)}</span></div>
          <div className="row total"><span>Total</span><span>{money(total)}</span></div>
        </div>
      </div>
    </div>
  );
}