"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const reservationId = searchParams.get("reservation");
  const parkingId = searchParams.get("parking");
  const total = Number(searchParams.get("total") || 0);

  const formattedTotal = useMemo(() => {
    return total.toLocaleString("es-CO");
  }, [total]);

  function handlePayment() {
    setLoading(true);

    setTimeout(() => {
      window.location.href = `/confirmation?reservation=${reservationId}&parking=${parkingId}&total=${total}`;
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex justify-center">
      <section className="w-full max-w-[430px] min-h-screen bg-[#0b0b0c] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(#2a2a2a_1px,transparent_1px),linear-gradient(90deg,#2a2a2a_1px,transparent_1px)] bg-[size:85px_85px]" />

        <div className="relative z-10 p-5 pb-10">
          <button onClick={() => window.history.back()} className="mb-6">
            <ArrowLeft />
          </button>

          <h1 className="text-3xl font-bold">Pago seguro</h1>
          <p className="text-gray-400 mt-2">
            Simulación de pago para confirmar tu reserva.
          </p>

          <div className="bg-blue-600 rounded-3xl p-5 shadow-2xl mt-8">
            <p className="text-blue-100 text-sm">Total a pagar</p>
            <h2 className="text-5xl font-bold mt-2">${formattedTotal}</h2>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-blue-100 text-sm">Reserva</p>
                <p className="text-xl font-bold mt-2">#{reservationId}</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-blue-100 text-sm">Estado</p>
                <p className="text-xl font-bold mt-2">Pendiente</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <button className="w-full bg-white/5 border border-blue-500 rounded-3xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-2xl">
                  <CreditCard />
                </div>
                <div className="text-left">
                  <p className="font-bold">Tarjeta de crédito/débito</p>
                  <p className="text-gray-400 text-sm">Método seleccionado</p>
                </div>
              </div>
              <CheckCircle2 className="text-blue-400" />
            </button>

            <button className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center gap-4 opacity-60">
              <div className="bg-white/10 p-3 rounded-2xl">
                <Wallet />
              </div>
              <div className="text-left">
                <p className="font-bold">Billetera digital</p>
                <p className="text-gray-400 text-sm">Próximamente</p>
              </div>
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mt-6">
            <p className="text-gray-300 flex gap-2 items-center">
              <ShieldCheck className="text-green-400" />
              Pago protegido
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Esta pantalla simula un pago automático para demostrar el flujo
              completo de VISION360.
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-2xl py-5 font-bold text-xl mt-8 flex justify-center items-center gap-2"
          >
            <Lock size={18} />
            {loading ? "Procesando pago..." : "Pagar y confirmar"}
          </button>
        </div>
      </section>
    </main>
  );
}