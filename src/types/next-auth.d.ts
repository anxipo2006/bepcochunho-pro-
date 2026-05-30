import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
    isApproved: boolean;
    companyName: string;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      isApproved: boolean;
      companyName: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    isApproved: boolean;
    companyName: string;
  }
}
