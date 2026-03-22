import Link from "next/link";

type SeoLandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: {
    href: string;
    label: string;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
  benefits: string[];
  sections: Array<{
    title: string;
    body: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

export default function SeoLandingPage({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  benefits,
  sections,
  faq,
}: SeoLandingPageProps) {
  return (
    <main className="min-h-screen text-white">
      <section className="container mx-auto px-4 pb-16 pt-28 md:pt-36">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            {eyebrow}
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300 md:text-xl">
            {description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={primaryCta.href}
              className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="rounded-lg border border-sky-500/70 px-8 py-3 text-sm font-medium text-sky-300 transition-all duration-300 hover:bg-blue-800/30 hover:text-white"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="rounded-2xl border border-blue-700/50 bg-gradient-to-br from-blue-900/30 to-blue-950/20 p-6 shadow-xl shadow-blue-900/20 backdrop-blur-sm"
            >
              <p className="text-lg font-medium text-slate-100">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-800 bg-slate-950/40 p-8"
            >
              <h2 className="text-2xl font-semibold text-white">
                {section.title}
              </h2>
              <p className="mt-4 leading-7 text-slate-300">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24 pt-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-blue-700/50 bg-gradient-to-br from-blue-900/30 to-slate-950/40 p-8 md:p-10">
          <h2 className="text-3xl font-bold text-white">Frequently asked questions</h2>
          <div className="mt-8 space-y-5">
            {faq.map((item) => (
              <div key={item.question} className="border-b border-slate-800 pb-5 last:border-none">
                <h3 className="text-lg font-semibold text-slate-100">
                  {item.question}
                </h3>
                <p className="mt-2 leading-7 text-slate-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
