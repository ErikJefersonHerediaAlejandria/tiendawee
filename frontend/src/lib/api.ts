export const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export interface Plan {
  id: number; code: string; name: string; speedMbps: number;
  price: number; description: string; features: string[]; stock: number;
}

export async function getPlans(): Promise<Plan[]> {
  const r = await fetch(`${API}/plans`, { cache: 'no-store' });
  if (!r.ok) throw new Error('No se pudieron cargar los planes');
  return r.json();
}

export const money = (n: number) => `S/ ${n.toFixed(2)}`;