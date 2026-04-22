export interface Project {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  website: string;
  logoUrl: string;
  twitter?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  projects: Project[];
}

export interface EcosystemData {
  categories: Category[];
}
