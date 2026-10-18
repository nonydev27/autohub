function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="animate-fade-up">
        <p className="text-xs font-semibold tracking-[0.2em] text-orange-400 uppercase">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-zinc-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default PageHeader
