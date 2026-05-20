export function generateStaticParams() {
  return [
    { paper: "gs1" },
    { paper: "csat1" },
    { paper: "gs-ancient-history" },
    { paper: "gs-medieval-history" },
    { paper: "gs-modern-history" },
    { paper: "gs-art-culture" },
    { paper: "gs-polity" },
    { paper: "gs-economy" },
    { paper: "gs-geography" },
    { paper: "gs-environment" },
    { paper: "gs-science" },
    { paper: "gs-international-relations" },
    { paper: "gs-current-affairs" },
    { paper: "csat-comprehension" },
    { paper: "csat-logical-reasoning" },
    { paper: "csat-analytical-reasoning" },
    { paper: "csat-quantitative" },
    { paper: "csat-data-interpretation" },
    { paper: "csat-mental-ability" },
  ];
}

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
