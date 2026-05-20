export function generateStaticParams() {
  return [{ paper: "gs1" }, { paper: "csat1" }];
}

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
