import Logo from "@/components/Logo";

const Loader = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="flex flex-col items-center">
        <Logo />

        <div className="mt-6 h-0.5 w-24 overflow-hidden bg-black/10">
          <div className="h-full w-1/2 animate-pulse bg-black" />
        </div>

        <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.25em] text-black/40">
          Loading
        </p>
      </div>
    </main>
  );
};

export default Loader;