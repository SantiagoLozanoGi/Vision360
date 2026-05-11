"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  QrCode,
  ReceiptText,
} from "lucide-react";

type Reservation = {
  id: number;
  plate: string;
  user_name: string;
  parking_name: string;
  reservation_time: string;
  status: string;
};

export default function ConfirmationPage() {
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const reservationId = params?.get("reservation");
  const total = Number(params?.get("total") || 0);

  useEffect(() => {
    async function loadReservation() {
      if (!reservationId) return;

      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("id", reservationId)
        .single();

      if (!error) setReservation(data);
    }

    loadReservation();
  }, [reservationId]);

  if (!reservation) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Confirmando...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex justify-center">
      <section className="w-full max-w-[430px] min-h-screen bg-[#0b0b0c] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(#2a2a2a_1px,transparent_1px),linear-gradient(90deg,#2a2a2a_1px,transparent_1px)] bg-[size:85px_85px]" />

        <div className="relative z-10 p-5 pb-10">
          <div className="flex flex-col items-center text-center mt-8">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-5">
              <CheckCircle2 size={56} className="text-green-400" />
            </div>

            <h1 className="text-3xl font-bold">Reserva confirmada</h1>
            <p className="text-gray-400 mt-2">
              Tu espacio ha sido reservado exitosamente.
            </p>
          </div>

          <div className="bg-blue-600 rounded-3xl p-5 shadow-2xl mt-8">
            <p className="text-blue-100 text-sm">Código de reserva</p>
            <h2 className="text-5xl font-bold mt-2">#{reservation.id}</h2>

            <div className="bg-white rounded-3xl h-44 mt-6 flex flex-col items-center justify-center text-black">
              <QrCode size={90} />
              <p className="text-sm mt-2 font-semibold">
                QR-{reservation.id}-{reservation.plate}
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mt-6 space-y-4">
            <div className="flex gap-3">
              <MapPin className="text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Parqueadero</p>
                <p className="font-bold">{reservation.parking_name}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <ReceiptText className="text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Placa</p>
                <p className="font-bold">{reservation.plate}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Hora</p>
                <p className="font-bold">
                  {new Date(reservation.reservation_time).toLocaleString(
                    "es-CO"
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <ReceiptText className="text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Total pagado</p>
                <p className="font-bold">
                  ${total.toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-blue-600 hover:bg-blue-500 rounded-2xl py-5 font-bold text-xl mt-8 flex justify-center items-center gap-2"
          >
            <Home size={20} />
            Volver al inicio
          </button>
        </div>
      </section>
    </main>
  );
}