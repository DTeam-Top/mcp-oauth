'use client';

import { signIn, signOut, useSession } from '@/lib/auth-client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session, isPending: loading } = useSession();
  const [socialLoading, setSocialLoading] = useState(false);
  const searchParams = useSearchParams();
  const user = session?.user;
  const callbackUrl = searchParams.get('callbackUrl');

  const handleSocialLogin = (provider: 'github' | 'google' | 'discord') => {
    signIn.social(
      {
        provider,
        callbackURL: callbackUrl || '/', // Use callbackUrl if present, otherwise default to home
      },
      {
        onRequest: () => {
          console.log(`Initiating ${provider} login...`);
          setSocialLoading(true);
        },
        onResponse: () => {
          console.log(`Initiating ${provider} login...`);
          setSocialLoading(false);
        },
        onError: (ctx) => {
          setSocialLoading(false);
          console.error(`Error with ${provider} login:`, ctx.error);
        },
      }
    );
  };

  // Redirect to callback URL after successful authentication
  useEffect(() => {
    if (user && callbackUrl) {
      // Small delay to ensure the session is fully established
      const timer = setTimeout(() => {
        window.location.href = callbackUrl;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, callbackUrl]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // No need to manually setUser(null) - useSession hook will update automatically
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show redirect message if user is authenticated and there's a callback URL
  if (user && callbackUrl) {
    return (
      <div className="container">
        <div className="loading">
          <p>Redirecting to authorization page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {user ? (
        <div className="auth-container">
          <div className="welcome-section">
            <h1>Welcome Back! 🎉</h1>
            <div className="user-info">
              <p>
                <strong>Name:</strong> {user.name || 'Not provided'}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`verification-badge ${user.emailVerified ? 'verified' : 'unverified'}`}
                >
                  {user.emailVerified ? '✅ Verified' : '⏳ Unverified'}
                </span>
              </p>
            </div>
            <button type="button" onClick={handleSignOut} className="button button-danger">
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="auth-container">
          <h1>{callbackUrl ? 'Authentication Required' : 'Sign In'}</h1>
          {callbackUrl && (
            <p className="mb-4 text-gray-600 text-center">
              Please sign in to continue with the authorization request.
            </p>
          )}

          {/* Social Login */}
          <div className="auth-section">
            <div className="social-buttons">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="button button-google"
                disabled={socialLoading}
              >
                {socialLoading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <title>Loading</title>
                      <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <title>Google</title>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                className="button button-github"
                disabled={socialLoading}
              >
                {socialLoading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <title>Loading</title>
                      <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <title>GitHub</title>
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Continue with GitHub
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('discord')}
                className="button button-discord"
                disabled={socialLoading}
              >
                {socialLoading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <title>Loading</title>
                      <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <title>Discord</title>
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.197.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    Continue with Discord
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
