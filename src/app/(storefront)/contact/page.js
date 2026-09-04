export const metadata = {
  title: "Contact — DevLabs",
  description: "Get in touch with the DevLabs team.",
};

const CHANNELS = [
  {
    icon: "mail",
    label: "Email",
    value: "hello@devlabs.dev",
    href: "mailto:hello@devlabs.dev",
  },
  {
    icon: "support_agent",
    label: "Order support",
    value: "support@devlabs.dev",
    href: "mailto:support@devlabs.dev",
  },
];

export default function ContactPage() {
  return (
    <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-sm">
        Contact us
      </h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mb-stack-lg">
        Questions about an order, a course, or anything else — we usually
        reply within a business day.
      </p>

      <div className="flex flex-col gap-stack-sm">
        {CHANNELS.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            className="flex items-center gap-stack-md border border-outline-variant dark:border-outline rounded-lg p-stack-md hover:border-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-secondary dark:text-secondary-fixed-dim text-[24px]">
              {channel.icon}
            </span>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
                {channel.label}
              </p>
              <p className="font-body-lg text-body-lg text-on-background dark:text-inverse-on-surface">
                {channel.value}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
