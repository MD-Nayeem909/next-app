import {
  CheckCircle2,
  Circle,
  Clock,
  Package,
  Truck,
  MapPin,
} from "lucide-react";

export default function ParcelHistory({ statusHistory }) {
  const getStatusIcon = (status, isLast) => {
    if (isLast) return <CheckCircle2 className="text-primary w-6 h-6" />;
    return <Circle className="text-slate-300 w-5 h-5" />;
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm max-w-2xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-800">Tracking History</h3>
        <p className="text-slate-500 text-sm">
          Real-time updates of your shipment
        </p>
      </div>

      <div className="space-y-0">
        {statusHistory?.map((history, index) => {
          const isLast = index === 0;

          return (
            <div key={index} className="relative flex gap-6 pb-10 group">
              {/* Vertical Line */}
              {index !== statusHistory.length - 1 && (
                <div className="absolute left-[11px] top-6 w-[2px] h-full bg-slate-100 group-hover:bg-primary/30 transition-colors"></div>
              )}

              {/* Status Icon Indicator */}
              <div className="relative z-10 bg-white flex items-center justify-center">
                {getStatusIcon(history.status, isLast)}
              </div>

              {/* Status Content Card */}
              <div
                className={`flex-1 p-5 rounded-3xl border transition-all duration-300 ${
                  isLast
                    ? "bg-primary/5 border-primary/20 shadow-md translate-x-1"
                    : "bg-slate-50 border-slate-100 grayscale-[0.5] opacity-80"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4
                    className={`font-black text-lg uppercase tracking-tight ${
                      isLast ? "text-primary" : "text-slate-700"
                    }`}
                  >
                    {history.status}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow-sm">
                    <Clock size={10} />
                    {new Date(history.time || new Date()).toLocaleDateString(
                      "en-GB"
                    )}
                  </span>
                </div>

                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {history.note ||
                    "No additional notes for this status update."}
                </p>

                {/* Optional Badge for Current Status */}
                {isLast && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                    Current Location
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
