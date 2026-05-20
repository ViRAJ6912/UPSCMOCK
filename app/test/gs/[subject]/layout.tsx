export function generateStaticParams() {
  return [
    { subject: "ancient-history" },
    { subject: "medieval-history" },
    { subject: "modern-history" },
    { subject: "art-culture" },
    { subject: "polity" },
    { subject: "economy" },
    { subject: "geography" },
    { subject: "environment" },
    { subject: "science" },
    { subject: "international-relations" },
    { subject: "current-affairs" },
  ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
