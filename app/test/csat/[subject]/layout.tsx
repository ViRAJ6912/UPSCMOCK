export function generateStaticParams() {
  return [
    { subject: "comprehension" },
    { subject: "logical-reasoning" },
    { subject: "analytical-reasoning" },
    { subject: "quantitative" },
    { subject: "data-interpretation" },
    { subject: "mental-ability" },
  ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
