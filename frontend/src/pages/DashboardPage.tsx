function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold tracking-normal sm:text-2xl">
            Formula Track
          </h1>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">Race Weekend</h2>
          <div className="mt-5 min-h-48 rounded-md border border-dashed border-slate-700 bg-slate-950" />
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">Session Schedule</h2>
          <div className="mt-5 grid gap-3">
            <div className="h-16 rounded-md border border-dashed border-slate-700 bg-slate-950" />
            <div className="h-16 rounded-md border border-dashed border-slate-700 bg-slate-950" />
            <div className="h-16 rounded-md border border-dashed border-slate-700 bg-slate-950" />
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Session Results</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="h-40 rounded-md border border-dashed border-slate-700 bg-slate-950" />
            <div className="h-40 rounded-md border border-dashed border-slate-700 bg-slate-950" />
            <div className="h-40 rounded-md border border-dashed border-slate-700 bg-slate-950" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;
