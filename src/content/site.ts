export type Project = {
  title: string;
  year: string;
  description: string;
  stack: string[];
  href: string;
};

export type PipelineStage = {
  label: string;
  title: string;
  description: string;
  skills: string[];
};

export const site = {
  name: "Valentin Frappart",
  role: "Full-stack developer & ML engineer",
  tagline:
    "I build web products end to end, and the machine-learning systems behind them.",
  email: "valou.frappart@gmail.com",
  location: "France",
  availability: "Available for freelance work",
  links: [
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Malt", href: "#" },
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
    title: "Project one",
    year: "2026",
    description:
      "Placeholder: replace with a real project: what it does, who it is for, and the problem it solves.",
    stack: ["Next.js", "Python", "PostgreSQL"],
    href: "#",
  },
  {
    title: "Project two",
    year: "2025",
    description:
      "Placeholder: replace with a real project: what it does, who it is for, and the problem it solves.",
    stack: ["PyTorch", "FastAPI", "Docker"],
    href: "#",
  },
];
