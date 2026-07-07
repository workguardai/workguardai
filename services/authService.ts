/**
 * Auth service.
 *
 * Responsibility: Orchestrate Supabase Auth flows (email register/login/logout,
 * OAuth code exchange) and keep the local `User` mirror in sync. Supabase issues
 * JWTs and manages secure, http-only session cookies (including refresh-token
 * rotation) through the cookie-bound server client.
 *
 * Inputs:  validated request DTOs / OAuth code.
 * Outputs: session/user DTOs. Cookie side effects are handled by the client.
 */
import { z } from 'zod';

import { env } from '@/lib/env';
import {
  UnauthorizedError,
  ValidationError,
  ServiceUnavailableError,
  isNetworkError,
} from '@/lib/errors';
import { createServerSupabase } from '@/lib/auth/supabaseServer';
import { userRepository } from '@/lib/repositories/userRepository';
import { projectRepository } from '@/lib/repositories/projectRepository';
import { getAuthUser } from '@/lib/auth/session';
import {
  isDevAuthActive,
  devUser,
  devCredentialsMatch,
  setDevSession,
  clearDevSession,
} from '@/lib/auth/devAuth';
import type { AuthUser } from '@/types';
import type { RegisterRequest, LoginRequest } from '@/schemas/auth';

function toAuthUser(id: string, email: string | undefined, metadata: unknown): AuthUser {
  const parsed = z.object({ full_name: z.string().optional(), name: z.string().optional() }).safeParse(metadata);
  const fullName = parsed.success ? (parsed.data.full_name ?? parsed.data.name ?? null) : null;
  if (!email) {
    throw new ValidationError('Authenticated user is missing an email');
  }
  return { id, email, fullName };
}

export const authService = {
  async register(input: RegisterRequest) {
    if (isDevAuthActive()) {
      await setDevSession();
      try {
        await userRepository.upsert(devUser);
      } catch {
        // No database in pure-UI testing; session still works for the shell.
      }
      return { user: devUser, emailConfirmationRequired: false };
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: input.fullName ? { full_name: input.fullName } : undefined },
    });

    if (error || !data.user) {
      throw new ValidationError(error?.message ?? 'Registration failed');
    }

    const authUser = toAuthUser(data.user.id, data.user.email, data.user.user_metadata);

    // If a session was returned (no email confirmation), create the local mirror.
    if (data.session) {
      await userRepository.upsert(authUser);
    }

    return {
      user: authUser,
      emailConfirmationRequired: data.session === null,
    };
  },

  async login(input: LoginRequest): Promise<AuthUser> {
    if (isDevAuthActive()) {
      if (!devCredentialsMatch(input.email, input.password)) {
        throw new UnauthorizedError('Invalid email or password');
      }
      await setDevSession();
      try {
        await userRepository.upsert(devUser);
      } catch {
        // No database in pure-UI testing; session still works for the shell.
      }
      return devUser;
    }

    const supabase = await createServerSupabase();
    let result;
    try {
      result = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });
    } catch (err) {
      if (isNetworkError(err)) throw new ServiceUnavailableError();
      throw err;
    }
    const { data, error } = result;

    if (error || !data.user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const authUser = toAuthUser(data.user.id, data.user.email, data.user.user_metadata);
    await userRepository.upsert(authUser);
    return authUser;
  },

  async logout(): Promise<void> {
    if (isDevAuthActive()) {
      await clearDevSession();
      return;
    }
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  },

  /** Exchange an OAuth authorization code (e.g. Google) for a session. */
  async exchangeOAuthCode(code: string): Promise<AuthUser> {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      throw new UnauthorizedError('OAuth sign-in failed');
    }
    const authUser = toAuthUser(data.user.id, data.user.email, data.user.user_metadata);
    await userRepository.upsert(authUser);
    return authUser;
  },

  /** Build the Google OAuth authorization URL. */
  async getGoogleAuthUrl(redirectTo: string): Promise<string> {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error || !data.url) {
      throw new ValidationError(error?.message ?? 'Failed to start Google sign-in');
    }
    return data.url;
  },

  /** Current session: validated user + their project memberships. */
  async currentSession() {
    const user = await getAuthUser();
    if (!user) {
      throw new UnauthorizedError();
    }
    // Ensure the mirror exists (first login after email confirmation, etc.).
    await userRepository.upsert(user);
    const memberships = await projectRepository.listMembershipsForUser(user.id);
    return {
      user,
      memberships: memberships.map((m) => ({ projectId: m.projectId, role: m.role })),
    };
  },

  /** The site base URL used to build OAuth redirect targets. */
  oauthRedirectBase(): string {
    return env.NEXT_PUBLIC_SUPABASE_URL;
  },
};
