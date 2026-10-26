'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { API, money } from '../../../lib/api';

function BoletaInner() {
  const { id } = useParams<{ id: string }>();
  const [o, setO] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/orders/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Pedido no encontrado'))))
      .then(setO)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="wrap page"><div className="err">{error}</div></div>;
  if (!o) return <div className="wrap page"><div className="loading"><span className="spinner" />Cargando boleta…</div></div>;

  return (
    <div className="wrap page">
      <div className="ok no-print">
        <div className="ok-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </div>
        <h1>¡Compra confirmada!</h1>
        <p className="sub">Enviaremos los detalles de instalación a <b>{o.customerEmail}</b></p>
      </div>

      <div className="boleta">
        <div className="boleta-head">
          <div className="company">
            <img src="/logo.svg" alt="WeeStore" className="logo" />
            <div><h2>WeeStore S.A.C.</h2><p>RUC 20000000001 · Lima, Perú</p></div>
          </div>
          <div className="receipt-box">BOLETA DE VENTA ELECTRÓNICA<strong>{o.receiptNumber}</strong></div>
        </div>
        <hr />
        <div className="kv">
          <div><span>Cliente</span><strong>{o.customerName}</strong></div>
          <div><span>DNI/RUC</span><strong>{o.customerDoc}</strong></div>
          <div><span>Fecha de emisión</span><strong>{new Date(o.createdAt).toLocaleString('es-PE')}</strong></div>
          <div><span>Dirección</span><strong>{o.customerAddress}</strong></div>
        </div>
        <hr />
        <div className="item">
          <div>{o.quantity} × {o.planName}<small>{o.speedMbps} Mbps · {money(o.unitPrice)} c/u</small></div>
          <strong>{money(o.unitPrice * o.quantity)}</strong>
        </div>
        <hr />
        <div className="row"><span>Subtotal</span><span>{money(o.subtotal)}</span></div>
        <div className="row"><span>IGV (18%)</span><span>{money(o.igv)}</span></div>
        <div className="row total"><span>TOTAL</span><span>{money(o.total)}</span></div>
        <hr />
        <div className="row"><span>Pago</span><span>{o.paymentMethod} •••• {o.cardLast4}</span></div>
        <div className="row"><span>Estado</span><span className="pill">{o.paymentStatus}</span></div>
        <p className="thanks">Gracias por confiar en WeeStore</p>
      </div>

      <div className="actions no-print">
        <button className="btn" onClick={() => window.print()}>Imprimir / guardar PDF</button>
        <Link className="btn ghost" href="/">Volver a planes</Link>
      </div>
    </div>
  );
}

export default function Boleta() {
  return (
    <Suspense fallback={<div className="wrap page"><div className="loading"><span className="spinner" />Cargando…</div></div>}>
      <BoletaInner />
    </Suspense>
  );
}
