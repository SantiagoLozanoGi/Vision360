"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  CalendarClock,
  Car,
  Clock,
  CreditCard,
  MapPin,
} from "lucide-react";

type Parking = {
  id: number;
  name: string;
  address: string;
  available_spaces: number;
  price_per_hour: number;
};

export default function ReservationPage() {
  const [parking, setParking] = useState<Parking | null>(null);
  const [plate, setPlate] = useState("");
  const [userName, setUserName] = useState("");
  const [duration, setDuration] = useState(1);
  const [reservationTime, setReservationTime] = useState("");
  const [loading, setLoading] = useState(false);

  const parkingId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("id")
      : null;

  const totalPrice = useMemo(() => {
    if (!parking) return 0;
    return Number(parking.price_per_hour) * duration;
  }, [parking, duration]);

  useEffect(() => {
    async function loadParking() {
      if (!parkingId) return;

      const { data, error } = await supabase
        .from("parkings")
        .select("*")
        .eq("id", parkingId)
        .single();

      if (!error) setParking(data);
    }

    loadParking();

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setReservationTime(now.toISOString().slice(0, 16));
  }, [parkingId]);

  async function handleReserve() {
    if (!parking) return;

    if (!plate || !userName || !reservationTime) {
      alert("Completa tu nombre, placa y hora de reserva.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("reservations")
      .insert({
        plate: plate.toUpperCase(),
        user_name: userName,
        parking_name: parking.name,
        parking_id: parking.id,
        reservation_time: reservationTime,
        status: "ACTIVE",
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error(error);
      alert("No se pudo crear la reserva.");
      return;
    }

    window.location.href = `/payment?reservation=${data.id}&parking=${data.parking_id}&total=${totalPrice}`;
  }

  if (!parking) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Cargando reserva...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex justify-center">
      <section className="w-full max-w-[430px] min-h-screen bg-[#0b0b0c] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(#2a2a2a_1px,transparent_1px),linear-gradient(90deg,#2a2a2a_1px,transparent_1px)] bg-[size:85px_85px]" />

        <div className="relative z-10 p-5 pb-10">
          <button onClick={() => window.history.back()} className="mb-6">
            <ArrowLeft />
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold">Reserva tu espacio</h1>
            <p className="text-gray-400 mt-2">
              Confirma los datos para asegurar tu cupo.
            </p>
          </div>

          <div className="bg-blue-600 rounded-3xl p-5 shadow-2xl mb-6">
            <p className="text-blue-100 text-sm flex items-center gap-2">
              <MapPin size={16} />
              Parqueadero seleccionado
            </p>

            <h2 className="text-2xl font-bold mt-3">{parking.name}</h2>
            <p className="text-blue-100 mt-1">{parking.address}</p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-blue-100">Disponibles</p>
                <p className="text-3xl font-bold mt-2">
                  {parking.available_spaces}
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-sm text-blue-100">Precio/hora</p>
                <p className="text-3xl font-bold mt-2">
                  ${Number(parking.price_per_hour).toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <label className="text-gray-300 text-sm flex items-center gap-2 mb-2">
                <Car size={16} />
                Placa del vehículo
              </label>

              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="Ej: ABC123"
                className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-4 outline-none uppercase"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <label className="text-gray-300 text-sm mb-2 block">
                Nombre del usuario
              </label>

              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ej: Tatiana"
                className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-4 outline-none"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <label className="text-gray-300 text-sm flex items-center gap-2 mb-2">
                <CalendarClock size={16} />
                Hora de reserva
              </label>

              <input
                type="datetime-local"
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-4 outline-none"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <div className="flex justify-between items-center mb-4">
                <label className="text-gray-300 text-sm flex items-center gap-2">
                  <Clock size={16} />
                  Duración
                </label>

                <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full">
                  {duration} hora{duration > 1 ? "s" : ""}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="8"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full"
              />

              <div className="flex justify-between text-gray-500 text-sm mt-2">
                <span>1h</span>
                <span>8h</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <CreditCard size={16} />
                Total estimado
              </p>

              <h2 className="text-4xl font-bold mt-2">
                ${totalPrice.toLocaleString("es-CO")}
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Pago simulado para la demo de VISION360.
              </p>
            </div>
          </div>

          <button
            onClick={handleReserve}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-2xl py-5 font-bold text-xl mt-6"
          >
            {loading ? "Creando reserva..." : "Continuar al pago"}
          </button>
        </div>
      </section>
    </main>
  );
}