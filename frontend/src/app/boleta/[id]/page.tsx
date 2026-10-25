'use client';
import '../../store.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API, money } from '../../../lib/api';

export default function Boleta() {
  const { id } = useParams<{ id: string }>();
  const [o, setO] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/orders/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Pedido no encontrado'))))
      .then(setO)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="wrap"><div className="err">{error}</div></div>;
  if (!o) return <div className="wrap">Cargando…</div>;

  return (
    <div className="wrap">
      <div className="ok no-print"><div className="tick">✅</div><h1 style={{ margin: 0 }}>¡Compra confirmada!</h1>
        <p className="sub">Enviaremos los detalles de instalación a {o.customerEmail}</p></div>

      <div className="boleta">
        <img src="/logo.svg" alt="WeeStore" className="logo" /><h2>WeeStore S.A.C.</h2>
        <p className="center">RUC 20000000001 · Lima, Perú<br />BOLETA DE VENTA ELECTRÓNICA<br /><strong>{o.receiptNumber}</strong></p>
        <hr />
        <div className="row"><span>Fecha</span><span>{new Date(o.createdAt).toLocaleString('es-PE')}</span></div>
        <div className="row"><span>Cliente</span><span>{o.customerName}</span></div>
        <div className="row"><span>DNI/RUC</span><span>{o.customerDoc}</span></div>
        <div className="row"><span>Dirección</span><span>{o.customerAddress}</span></div>
        <hr />
        <div className="row"><span>{o.quantity} × {o.planName} ({o.speedMbps} Mbps)</span><span>{money(o.unitPrice * o.quantity)}</span></div>
        <hr />
        <div className="row"><span>Subtotal</span><span>{money(o.subtotal)}</span></div>
        <div className="row"><span>IGV (18%)</span><span>{money(o.igv)}</span></div>
        <div className="row total"><span>TOTAL</span><span>{money(o.total)}</span></div>
        <hr />
        <div className="row"><span>Pago</span><span>{o.paymentMethod} ****{o.cardLast4}</span></div>
        <div className="row"><span>Estado</span><span>{o.paymentStatus}</span></div>
        <p className="center">Gracias por tu compra</p>
      </div>

      <div className="actions no-print">
        <button className="btn" onClick={() => window.print()}>🖨️ Imprimir / guardar PDF</button>
        <Link className="btn ghost" href="/">Volver a planes</Link>
      </div>
    </div>
  );
}