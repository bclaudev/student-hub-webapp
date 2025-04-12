import { useRef } from "react";

export function ColorPicker({ value, onChange }) {
  const inputRef = useRef();

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="h-8 w-8 rounded-full border border-white"
        style={{ backgroundColor: value }}
      />
      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="sr-only"
      />
    </div>
  );
}
