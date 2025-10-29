export default function NotFound() {
  return (
    <div className="h-[80vh] text-center flex flex-col items-center justify-center font-sans">
      <div>
        <h1 className="inline-block mr-5 pr-[23px] text-2xl font-medium align-top leading-[49px] border-r border-black/30 dark:border-white/30">
          404
        </h1>
        <div className="inline-block">
          <h2 className="text-sm font-normal leading-[49px] m-0">
            This page could not be found.
          </h2>
        </div>
      </div>
    </div>
  );
}
