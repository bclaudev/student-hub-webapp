// components/notebook-card/notebook-info.jsx
export default function NotebookInfo({ title, updatedAt }) {
  const date = updatedAt
    ? new Date(updatedAt).toLocaleDateString("ro-RO", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown";
  return (
    <section className="relative self-stretch mt-2 w-full flex flex-col justify-center h-[50px]">
      <h2 className="z-0 text-sm font-medium text-foreground line-clamp-2">
        {title}
      </h2>
      <p className="z-0 mt-0 text-[9px] text-muted-foreground">
        Last changed: {date}
      </p>
    </section>
  );
}
