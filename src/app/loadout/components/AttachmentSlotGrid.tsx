type AttachmentSlotCard = {
  id: string;
  label: string;
  value: string;
  modifierText?: string;
  supported: boolean;
};

type AttachmentSlotGridProps = {
  slots: AttachmentSlotCard[];
};

export default function AttachmentSlotGrid({ slots }: AttachmentSlotGridProps) {
  const visibleSlots = slots.filter((slot) => slot.supported || slot.value !== "Empty");

  if (visibleSlots.length === 0) {
    return (
      <div className="rounded border border-dashed border-zinc-800 bg-zinc-950 px-3 py-4 text-center">
        <p className="text-sm text-zinc-600">No attachment slots.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {visibleSlots.map((slot) => (
        <div
          key={slot.id}
          className={`rounded border px-3 py-2 ${
            slot.value === "Empty"
              ? "border-zinc-800 bg-zinc-950"
              : "border-emerald-900/70 bg-emerald-950/20"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            {slot.label}
          </p>
          <p className="mt-1 truncate text-sm font-black text-zinc-100">
            {slot.value}
          </p>
          {slot.modifierText && slot.value !== "Empty" && (
            <p className="mt-1 truncate text-xs text-zinc-500">
              {slot.modifierText}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
