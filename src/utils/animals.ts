import { DailyAnimal, AnimalOverride } from '../types';

export const DAILY_ANIMALS: DailyAnimal[] = [
  { name: "León Africano", emoji: "🦁", bg: "#fef3c7", photo: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=400&q=80", fact: "Su rugido puede escucharse hasta a 8 km de distancia." },
  { name: "Delfín Mular", emoji: "🐬", bg: "#e0f2fe", photo: "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&w=400&q=80", fact: "Duerme con un ojo abierto y la mitad de su cerebro activo." },
  { name: "Panda Gigante", emoji: "🐼", bg: "#dcfce7", photo: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=400&q=80", fact: "Dedica hasta 12 horas al día a comer bambú fresco." },
  { name: "Zorro Rojo", emoji: "🦊", bg: "#ffedd5", photo: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=400&q=80", fact: "Usa el campo magnético de la Tierra para orientarse y cazar." },
  { name: "Búho Real", emoji: "🦉", bg: "#f3e8ff", photo: "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?auto=format&fit=crop&w=400&q=80", fact: "Puede girar su cabeza hasta 270 grados sin mover el cuerpo." },
  { name: "Tortuga Marina", emoji: "🐢", bg: "#ccfbf1", photo: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=400&q=80", fact: "Regresa exactamente a la misma playa donde nació." },
  { name: "Tigre de Bengala", emoji: "🐯", bg: "#ffedd5", photo: "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&w=400&q=80", fact: "Las rayas de cada tigre son únicas, como nuestras huellas." },
  { name: "Koala Australiano", emoji: "🐨", bg: "#f1f5f9", photo: "https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?auto=format&fit=crop&w=400&q=80", fact: "Sus huellas dactilares son casi idénticas a las humanas." },
  { name: "Elefante Africano", emoji: "🐘", bg: "#e2e8f0", photo: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=400&q=80", fact: "Tiene el cerebro más grande del mundo animal terrestre." },
  { name: "Pingüino Emperador", emoji: "🐧", bg: "#dbeafe", photo: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=400&q=80", fact: "Puede sumergirse a más de 500 metros de profundidad." },
  { name: "Lobo Gris", emoji: "🐺", bg: "#e2e8f0", photo: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=400&q=80", fact: "Recorre hasta 60 kilómetros en un solo día con su manada." },
  { name: "Caballo Salvaje", emoji: "🐎", bg: "#fef3c7", photo: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=400&q=80", fact: "Tiene un campo de visión de casi 360 grados a su alrededor." },
  { name: "Águila Real", emoji: "🦅", bg: "#fef9c3", photo: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=400&q=80", fact: "Su vista es hasta 8 veces más aguda que la del ser humano." },
  { name: "Nutria Marina", emoji: "🦦", bg: "#e0e7ff", photo: "https://images.unsplash.com/photo-1579380656108-f98e4df8ea62?auto=format&fit=crop&w=400&q=80", fact: "Se toman de las patas al dormir para no separarse en el agua." },
  { name: "Jirafa Reticulada", emoji: "🦒", bg: "#fef08a", photo: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=400&q=80", fact: "Su corazón pesa 11 kilos para impulsar sangre hasta su cabeza." },
  { name: "Guacamayo Rojo", emoji: "🦜", bg: "#fee2e2", photo: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80", fact: "Puede vivir más de 60 años y recordar cientos de sonidos." },
  { name: "Ciervo Rojo", emoji: "🦌", bg: "#dcfce7", photo: "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=400&q=80", fact: "Renueva su cornamenta completa cada año en primavera." },
  { name: "Gato Montés", emoji: "🐱", bg: "#f3e8ff", photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80", fact: "Salta hasta 6 veces su propia longitud de un solo impulso." },
  { name: "Perro Pastor", emoji: "🐶", bg: "#ffedd5", photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80", fact: "Su olfato es hasta 100.000 veces más potente que el nuestro." },
  { name: "Cebra de Llanura", emoji: "🦓", bg: "#f1f5f9", photo: "https://images.unsplash.com/photo-1501706362039-c06b2d715385?auto=format&fit=crop&w=400&q=80", fact: "Sus rayas ayudan a refrescar su piel bajo el sol africano." },
  { name: "Cisne Blanco", emoji: "🦢", bg: "#e0f2fe", photo: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=400&q=80", fact: "Cuenta con más de 25.000 plumas en todo su cuerpo." },
  { name: "Oso Pardo", emoji: "🐻", bg: "#fef3c7", photo: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&q=80", fact: "A pesar de su tamaño, puede correr a 50 km/h." },
  { name: "Flamenco Rosado", emoji: "🦩", bg: "#fce7f3", photo: "https://images.unsplash.com/photo-1497206365907-f5e630693df0?auto=format&fit=crop&w=400&q=80", fact: "Su color rosado proviene de los carotenoides de su dieta." },
  { name: "Conejo Silvestre", emoji: "🐰", bg: "#dcfce7", photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80", fact: "Sus orejas giran de forma independiente para detectar sonidos." },
  { name: "Ballena Jorobada", emoji: "🐋", bg: "#dbeafe", photo: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=400&q=80", fact: "Sus cantos submarinos duran horas y viajan cientos de kilómetros." },
  { name: "Mariposa Monarca", emoji: "🦋", bg: "#ffedd5", photo: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=400&q=80", fact: "Realiza migraciones de más de 4.000 km cada año." },
  { name: "Erizo Europeo", emoji: "🦔", bg: "#fef9c3", photo: "https://images.unsplash.com/photo-1584553421349-3557471bed79?auto=format&fit=crop&w=400&q=80", fact: "Tiene entre 5.000 y 7.000 púas protectoras en su dorso." },
  { name: "Camaleón Velado", emoji: "🦎", bg: "#d1fae5", photo: "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?auto=format&fit=crop&w=400&q=80", fact: "Mueve sus dos ojos en direcciones distintas al mismo tiempo." },
  { name: "Ardilla Roja", emoji: "🐿️", bg: "#ffedd5", photo: "https://images.unsplash.com/photo-1507666405895-422eee7d517f?auto=format&fit=crop&w=400&q=80", fact: "Ayuda a renovar los bosques al enterrar semillas que luego brotan." },
  { name: "Pavo Real", emoji: "🦚", bg: "#ccfbf1", photo: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=400&q=80", fact: "Sus plumas tienen microestructuras que reflejan la luz como cristales." },
  { name: "Leopardo de las Nieves", emoji: "🐆", bg: "#f1f5f9", photo: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=400&q=80", fact: "Su larga cola le sirve de abrigo y timón en las montañas." }
];

export function createOfflineAnimalSvg(emoji: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="28" fill="${bg || '#e0e7ff'}"/>
    <circle cx="60" cy="60" r="46" fill="rgba(255,255,255,0.7)"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="52">${emoji || '🐾'}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export function getAnimalIndexForDate(dateStr: string, overrides: Record<string, AnimalOverride>): number {
  const override = overrides[dateStr];
  if (override && typeof override.index === 'number') {
    return Math.abs(override.index) % DAILY_ANIMALS.length;
  }
  const parts = dateStr.split('-').map(Number);
  const y = parts[0] || 2026;
  const m = parts[1] || 1;
  const d = parts[2] || 1;
  const dayOfYear = Math.floor((new Date(y, m - 1, d).getTime() - new Date(y, 0, 0).getTime()) / 86400000);
  return Math.abs(y * 3 + dayOfYear) % DAILY_ANIMALS.length;
}
