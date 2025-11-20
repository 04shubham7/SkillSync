import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: any = {
  providers: (() => {
    const providers: any[] = [];
    
    // Email/Password authentication (primary)
    providers.push(
      CredentialsProvider({
        id: "credentials",
        name: "Email and Password",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "email@example.com" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials: any) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            throw new Error("Invalid email or password");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        },
      })
    );

    // Google OAuth (optional)
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (googleClientId && googleClientSecret) {
      providers.push(
        GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        })
      );
    }
    
    return providers;
  })(),
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (account && user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        try {
          await prisma.user.upsert({
            where: { email: user.email || "" },
            update: { name: user.name || undefined, image: user.image || undefined },
            create: { email: user.email || "", name: user.name || undefined, image: user.image || undefined },
          });
        } catch (error) {
          console.error("Error syncing user to database:", error);
        }
      }

      if (token.email) {
        try {
          const userData = await prisma.user.findUnique({ where: { email: token.email } });
          token.role = userData?.role || null;
        } catch (error) {
          console.error("Error fetching user role:", error);
          token.role = null;
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      if (url.startsWith(baseUrl) && !url.includes("/auth/role-selection")) {
        return url;
      }
      return url;
    },
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/role-selection",
  },
  session: {
    strategy: "jwt",
  },
};

export default authOptions;
