export default function Footer() {
  return (
    <footer className="px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <p className="font-display text-xl uppercase tracking-[0.3em] text-white">AI & DS - B Batch 2022-2026</p>
          <p className="mt-2 text-sm text-white/60">Made with WayZen Tech </p>
        </div>
        <div className="flex gap-4 text-sm text-white/60">
          <a className="transition hover:text-white" href="https://www.instagram.com/way_zentech/reels/">Instagram</a>
          <a className="transition hover:text-white" href="https://www.linkedin.com/in/wayzentech/">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
