import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import AzureAd from "next-auth/providers/azure-ad";
import type { NextAuthConfig } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export interface EnrichedSession extends DefaultSession {
  providers: {
    [provider: string]: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpiresAt: number;
      accessTokenIssuedAt: number;
    };
  };
}

interface EnrichedJWT extends JWT {
  providers?: EnrichedSession['providers'];
}

export const config = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar"
        }
      }
    }),
    AzureAd({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
      authorization: {
        params: {
          scope: "openid profile email User.Read Calendars.ReadWrite"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }: { token: EnrichedJWT; account: any; profile?: any }): Promise<EnrichedJWT> {
      if (account) {
        token.providers = token.providers || {};
        token.providers[account.provider] = {
          accessToken: account.access_token!,
          refreshToken: account.refresh_token!,
          accessTokenExpiresAt: account.expires_at! * 1000,
          accessTokenIssuedAt: Date.now(),
        };
      }
      return token;
    },
    async session({ session, token }: { session: EnrichedSession; token: EnrichedJWT }): Promise<EnrichedSession> {
      return {
        ...session,
        providers: token.providers || {},
      };
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);