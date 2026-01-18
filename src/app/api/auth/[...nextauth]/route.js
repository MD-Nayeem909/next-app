import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await dbConnect();
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id || user._id;
        token.role = user.role;
        token.phone = user.phone;
        token.address = user.address;
        token.name = user.name;
        token.image = user.image;
      }
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.address = token.address;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
