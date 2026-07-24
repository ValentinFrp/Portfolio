export type Project = {
  title: string;
  year: string;
  description: string;
  stack: string[];
  href: string | null;
  note?: string;
  image?: string;
};

export type PipelineStage = {
  label: string;
  title: string;
  description: string;
  skills: string[];
};

export const site = {
  url: "https://portfolio-navy-mu-88.vercel.app",
  name: "Valentin Frappart",
  role: "Full-stack developer & ML engineer",
  tagline:
    "I build web products end to end, and the machine-learning systems behind them.",
  email: "valou.frappart@gmail.com",
  location: "France",
  contactTitle: "Let's talk",
  contactBlurb:
    "Tell me what you want to build, from a full product to a single model in production.",
  links: [
    { label: "GitHub", href: "https://github.com/ValentinFrp" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/valentin-frappart-a73b252b4",
    },
    { label: "Malt", href: "https://www.malt.fr/profile/valentinfrappart1" },
  ],
};

export const pipeline: PipelineStage[] = [
  {
    label: "stage 01 · build",
    title: "Full-stack engineering",
    description:
      "Web applications from database to interface: robust APIs, clean data models and front ends that feel fast and considered.",
    skills: ["TypeScript", "React / Next.js", "Node.js", "Python", "SQL"],
  },
  {
    label: "stage 02 · train",
    title: "Machine learning",
    description:
      "Models that solve real product problems: from data preparation and feature work to training, evaluation and iteration.",
    skills: ["PyTorch", "scikit-learn", "Pandas", "Model evaluation"],
  },
  {
    label: "stage 03 · ship",
    title: "MLOps & deployment",
    description:
      "Getting models out of notebooks and into production: reproducible pipelines, monitoring, and infrastructure that keeps working.",
    skills: ["Docker", "CI/CD", "MLflow", "Cloud deployment", "Monitoring"],
  },
];

export const projects: Project[] = [
  {
    title: "Finexus",
    year: "2026",
    description:
      "FinOps platform for private cloud and data centers, built at Lota.Cloud. Where classic FinOps tools stop at public cloud, Finexus prices every VM on VMware, Nutanix, Proxmox or Hyper-V from real CAPEX and OPEX costs in the FOCUS standard: cost per VM split across compute, storage and network, chargeback per team or client, budgets, alerts, forecasts and capacity planning. Native multi-client support for IT teams and MSPs.",
    stack: ["FinOps", "FOCUS standard", "Multi-tenant SaaS"],
    href: "https://finexus-website-prod.s3-website.fr-par.scw.cloud/",
  },
  {
    title: "BlackHoleSimu",
    year: "2026",
    description:
      "Real-time Schwarzschild black hole renderer. Every pixel is ray-cast through curved spacetime using a precomputed deflection table, feeding a physically based accretion disk: Doppler beaming, gravitational redshift and blackbody emission, finished by an HDR pipeline with bloom, ACES and SSAA. One Rust codebase, two targets: native and WebAssembly.",
    stack: ["Rust", "wgpu", "WGSL", "WebAssembly"],
    href: "https://github.com/ValentinFrp/BlackHoleSimu",
    image: "/projects/blackholesimu.jpg",
  },
  {
    title: "Cloud Cost Anomaly Detection",
    year: "2025",
    description:
      "Multi-tenant API that forecasts cloud costs over 7, 14 and 30 days and flags spending anomalies in near real time. Hybrid detection combining statistical tests, Isolation Forest and ETS residuals, one lazily loaded model per tenant per horizon, weekly automated retraining with zero-downtime reloads. About 11% MAPE at 7 days, running in production.",
    stack: ["Python", "FastAPI", "scikit-learn", "ClickHouse", "MLflow", "Docker"],
    href: null,
    note: "internal production system",
  },
];
