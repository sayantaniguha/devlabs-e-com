export const metadata = {
  title: "About — DevLabs",
  description: "Building the tools and community for the next generation of engineers.",
};

const VALUES = [
  {
    icon: "code",
    title: "Made by engineers",
    body: "Every product and course is built and used by the same team shipping DevLabs — not outsourced, not guessed at.",
  },
  {
    icon: "school",
    title: "Taught, not just sold",
    body: "Our courses come from people building the product day to day, so the material stays tied to how things actually work in practice.",
  },
  {
    icon: "favorite",
    title: "Built to last",
    body: "Heavyweight fabrics, real hardware, and gear meant for daily use at a desk — not disposable merch.",
  },
];

export default function AboutPage() {
  return (
    <section className="max-w-3xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-headline-lg text-headline-lg md:text-[36px] text-on-background dark:text-inverse-on-surface mb-stack-md">
        About DevLabs
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-on-primary-container mb-stack-xl">
        DevLabs makes apparel, desk gear, and courses for developers —
        designed and taught by the same team building the product. Comfortable,
        functional, and minimal, with courses that treat engineering as a
        craft worth teaching properly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg mb-stack-xl">
        {VALUES.map((value) => (
          <div
            key={value.title}
            className="border border-outline-variant dark:border-outline rounded-lg p-stack-lg"
          >
            <span className="material-symbols-outlined text-secondary dark:text-secondary-fixed-dim text-[28px] mb-stack-sm block">
              {value.icon}
            </span>
            <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-stack-xs">
              {value.title}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
              {value.body}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-outline-variant dark:border-outline pt-stack-lg">
        <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface mb-stack-sm">
          Questions?
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container">
          Reach out any time on the{" "}
          <a href="/contact" className="text-secondary hover:underline">
            contact page
          </a>
          .
        </p>
      </div>
    </section>
  );
}
