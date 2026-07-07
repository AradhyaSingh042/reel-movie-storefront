import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Button } from '../components/ui/Button';

export function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {

      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message.replace(/^Firebase:\s*/, ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <span className="font-display text-4xl tracking-wide text-marquee">REEL</span>
        <h1 className="mt-6 text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-muted">
          Sign up to start building your watchlist.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-marquee"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-marquee"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted">
          Already have an account?{' '}
          <Link to="/signin" className="text-marquee hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
