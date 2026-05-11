"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Sparkles,
  SlidersHorizontal,
  AlertCircle,
  Navigation,
  Star,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";

type Parking = {
  id: number;
  name: string;
  address: string;
  available_spaces: number;
  price_per_hour: number;
  rating: number;
  distance_km: number;
  estimated_time_min: number;
  demand_level: string;
};

export default function Home() {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadParkings() {
      const { data, error } = await supabase
        .from("parkings")
        .select("*")
        .order("available_spaces", { ascending: false });
        

      if (error) {
        console.error(error);
      } else {
        setParkings(data || []);
      }

      setLoading(false);
    }

    loadParkings();
   
  }, []);

  const recommended = parkings[0];

  return (
    <main className="min-h-screen bg-[#050505] text-white flex justify-center">
      <section className="w-full max-w-[430px] min-h-screen bg-[#0b0b0c] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(#2a2a2a_1px,transparent_1px),linear-gradient(90deg,#2a2a2a_1px,transparent_1px)] bg-[size:85px_85px]" />

        <div className="relative z-10 px-5 pt-8 pb-8">
          <header className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-400" />
                <h1 className="text-2xl font-bold">VISION360</h1>
              </div>
              <p className="text-gray-400 text-sm mt-1">Navegación inteligente</p>
            </div>

            <button className="w-12 h-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
              <SlidersHorizontal />
            </button>
          </header>

          <div className="bg-orange-500 rounded-2xl p-4 mb-4 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <AlertCircle />
                <div>
                  <h2 className="font-semibold">Zona con alta demanda</h2>
                  <p className="text-sm">
                    Te sugerimos Parking Central Plaza como alternativa óptima
                  </p>
                </div>
              </div>
              <span className="text-xl">×</span>
            </div>
          </div>

          {recommended && (
            <div className="bg-blue-600 rounded-3xl p-5 mb-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles />
                </div>
                <div>
                  <div className="flex gap-2 items-center">
                    <h2 className="font-semibold">Recomendación IA</h2>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                      95% match
                    </span>
                  </div>
                  <p className="text-sm text-blue-100">Mejor opción para ti</p>
                </div>
              </div>

              <div className="border border-white/20 rounded-2xl p-4">
                <h3 className="text-xl font-bold">{recommended.name}</h3>
                <p className="text-sm text-blue-100 mt-1">{recommended.address}</p>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs text-blue-100 flex gap-1 items-center">
                      <Clock size={14} /> Tiempo
                    </p>
                    <p className="text-lg mt-2">{recommended.estimated_time_min} min</p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs text-blue-100 flex gap-1 items-center">
                      <DollarSign size={14} /> Precio
                    </p>
                    <p className="text-lg mt-2">
                      ${Number(recommended.price_per_hour).toLocaleString("es-CO")}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xs text-blue-100 flex gap-1 items-center">
                      <TrendingUp size={14} /> Espacios
                    </p>
                    <p className="text-lg mt-2">{recommended.available_spaces}</p>
                  </div>
                </div>

                <button
                  onClick={() => (window.location.href = `/parking/${recommended.id}`)}
                  className="w-full mt-5 bg-white text-blue-600 font-bold rounded-2xl py-4 flex items-center justify-center gap-2"
                >
                  <Navigation size={18} />
                  Ver ruta y reservar
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">Parqueaderos cercanos</h2>
              <p className="text-gray-400 text-sm">
                {loading ? "Cargando..." : `${parkings.length} opciones disponibles`}
              </p>
            </div>

            <button className="border border-white/20 bg-white/10 rounded-xl px-4 py-2">
              IA
            </button>
          </div>

          <div className="space-y-4">
            {parkings.map((parking) => (
              <button
                key={parking.id}
                onClick={() => (window.location.href = `/parking/${parking.id}`)}
                className="w-full text-left bg-[#18264b] border border-blue-500/40 rounded-2xl p-4"
              >
                <div className="flex justify-between">
                  <p className="text-blue-400 text-sm flex gap-1 items-center">
                    <Sparkles size={14} /> Recomendado por IA
                  </p>

                  <span className="bg-white/10 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    {parking.rating}
                  </span>
                </div>

                <h3 className="text-lg font-bold mt-3">{parking.name}</h3>

                <p className="text-gray-400 text-sm mt-2 flex gap-1 items-center">
                  <MapPin size={14} />
                  {parking.address}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                  <div className="bg-white/10 rounded-xl p-2">
                    <p className="text-gray-400">Llegada</p>
                    <p>{parking.estimated_time_min} min</p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-2">
                    <p className="text-gray-400">Precio</p>
                    <p>${Number(parking.price_per_hour).toLocaleString("es-CO")}</p>
                  </div>

                  <div className="bg-green-500/20 text-green-300 rounded-xl p-2">
                    <p>Disponibles</p>
                    <p>{parking.available_spaces}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}