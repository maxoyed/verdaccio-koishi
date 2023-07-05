import { Config } from "@verdaccio/types";

export interface KoishiAdapterConfig extends Config {
  verdaccioUrl: string;
  koishiRegistryUrl: string;
  scope: string;
  email: string;
}

export interface User {
  name?: string;
  email: string;
  url?: string;
  username?: string;
}

export interface IPackage {
  package: {
    name: string;
    scope: string;
    version: string;
    description: string;
    keywords: string[];
    date: string;
    links: {
      npm: string;
      homepage: string;
      repository: string;
      bugs: string;
    };
    publisher: User;
    maintainers: User[];
    contributors?: User[];
  };
  score: {
    final: number;
  };
  shortname: string;
  verified: boolean;
  manifest: {
    description: string;
    locales: string[];
    service: {
      required: string[];
      optional: string[];
      implements: string[];
    };
  };
  insecure: boolean;
  ignored?: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  portable: boolean;
  installSize: number;
  publishSize: number;
}
