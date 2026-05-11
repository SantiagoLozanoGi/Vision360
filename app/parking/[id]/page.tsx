"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Star,
  Navigation,
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
};

export default function ParkingDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [parking, setParking] = useState<Parking | null>(null);

  useEffect(() => {
    async function loadParking() {
      const { data, error } = await supabase
        .from("parkings")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setParking(data);
      }
    }

    loadParking();
  }, [id]);

  if (!parking) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Cargando...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex justify-center">
      <section className="w-full max-w-[430px] min-h-screen bg-[#0b0b0c] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(#2a2a2a_1px,transparent_1px),linear-gradient(90deg,#2a2a2a_1px,transparent_1px)] bg-[size:85px_85px]" />

        <div className="relative z-10 p-5">
          <button
            onClick={() => window.history.back()}
            className="mb-6"
          >
            <ArrowLeft />
          </button>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-bold">
                  {parking.estimated_time_min} min
                </h2>

                <p className="text-gray-400 mt-2">
                  {parking.distance_km} km
                </p>
              </div>

              <div className="flex flex-col gap-3 items-end">
                <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                  Óptima
                </span>

                <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm">
                  Tráfico medio
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h1 className="text-3xl font-bold">{parking.name}</h1>

            <p className="text-gray-400 mt-2">{parking.address}</p>
          </div>

          <div className="bg-blue-600 rounded-3xl p-5 mt-8 shadow-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-blue-100">Llegada</p>

                <h3 className="text-3xl font-bold mt-2">
                  {parking.estimated_time_min} min
                </h3>
              </div>

              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-blue-100">Distancia</p>

                <h3 className="text-3xl font-bold mt-2">
                  {parking.distance_km} km
                </h3>
              </div>

              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-blue-100">Precio/h</p>

                <h3 className="text-3xl font-bold mt-2">
                  ${parking.price_per_hour / 1000}k
                </h3>
              </div>

              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-blue-100">Rating</p>

                <h3 className="text-3xl font-bold mt-2 flex items-center gap-2">
                  <Star
                    className="text-yellow-400 fill-yellow-400"
                    size={24}
                  />
                  {parking.rating}
                </h3>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 mt-4">
              <p className="text-sm text-blue-100">Disponibles</p>

              <h3 className="text-4xl font-bold mt-2">
                {parking.available_spaces}
              </h3>
            </div>

            <button
              onClick={() =>
                (window.location.href = `/reservation?id=${parking.id}`)
              }
              className="w-full bg-white text-blue-600 font-bold py-5 rounded-2xl mt-6 text-xl"
            >
              Reservar ahora
            </button>
          </div>

          <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-5">
            <h3 className="text-xl font-bold mb-4">
              Rutas alternativas
            </h3>

            <div className="space-y-3">
              <div className="bg-white/5 rounded-2xl p-4 flex justify-between">
                <div>
                  <p className="font-semibold">Ruta principal</p>
                  <p className="text-gray-400 text-sm">
                    Menor tiempo estimado
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">3 min</p>
                  <p className="text-gray-400 text-sm">0.8 km</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 flex justify-between">
                <div>
                  <p className="font-semibold">Ruta secundaria</p>
                  <p className="text-gray-400 text-sm">
                    Menos tráfico
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">5 min</p>
                  <p className="text-gray-400 text-sm">1.1 km</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}