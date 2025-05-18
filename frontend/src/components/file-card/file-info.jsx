export default function FileInfo({ fileName, author }) {
  return (
    <section className="relative self-stretch mt-2 w-full flex flex-col justify-center h-[50px]">
      <h2 className="z-0 text-sm font-medium text-stone-950 dark:text-white line-clamp-2">
        {fileName}
      </h2>
      <p className="z-0 mt-0 text-[9px] text-stone-400 dark:text-stone-300">
        {author}
      </p>
    </section>
  );
}
