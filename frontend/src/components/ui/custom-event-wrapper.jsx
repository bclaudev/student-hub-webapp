// frontend/src/components/ui/custom-event-wrapper.jsx
export function CustomEventWrapper({ children, event }) {
  return (
    <div
      className="rounded-[10px] px-2 h-full w-full overflow-hidden text-white"
      style={{
        backgroundColor: event.color || "#a855f7",
      }}
    >
      {children}
    </div>
  );
}
