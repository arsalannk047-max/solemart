'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { signInAction } from '@/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-volt text-voltink font-bold uppercase text-sm tracking-wide px-7 py-3.5 rounded-full shadow-volt disabled:opacity-50"
    >
      {pending ? 'Logging in…' : 'Log in'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(signInAction, { error: null });

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl uppercase text-center mb-8">Log in</h1>
      <div className="bg-surface border border-line rounded-2xl p-7">
        {state?.error && <div className="bg-rose-100 text-crimson text-sm font-semibold rounded-lg px-4 py-3 mb-4">{state.error}</div>}
        <form action={formAction}>
          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Email</label>
          <input name="email" type="email" required className="w-full border border-line rounded-lg px-3.5 py-2.5 mb-4 text-sm" />
          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Password</label>
          <input name="password" type="password" required className="w-full border border-line rounded-lg px-3.5 py-2.5 mb-4 text-sm" />
          <SubmitButton />
        </form>
        <p className="text-center text-sm mt-4">
          New here? <Link href="/signup" className="text-azure font-semibold underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
