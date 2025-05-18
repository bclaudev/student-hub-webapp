export default function FileCover({ thumbnailUrl, fileType }) {
  return (
    <section className="flex gap-2.5 justify-center items-center px-11 mt-2 w-full">
      {fileType?.startsWith("image") ? (
        <img
          src={thumbnailUrl}
          alt="File cover"
          className="object-contain self-stretch my-auto aspect-[0.65] w-[55px]"
        />
      ) : (
        <div className="text-xs text-muted-foreground text-center">
          Preview unavailable
        </div>
      )}
    </section>
  );
}
