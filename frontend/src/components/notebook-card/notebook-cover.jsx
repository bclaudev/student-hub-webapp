// components/notebook-card/notebook-cover.jsx
export default function NotebookCover({ content = "No preview" }) {
  return (
    <section className="flex justify-center items-center mt-2 w-full h-[80px]">
      <div className="bg-white rounded shadow w-[55px] h-[80px] text-[9px] text-black p-1 overflow-hidden flex items-center justify-center text-center">
        <p className="line-clamp-10">{content}</p>
      </div>
    </section>
  );
}
