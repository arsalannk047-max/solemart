'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { adminSignInAction } from '@/actions/auth';

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

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(adminSignInAction, { error: null });

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="bg-surface rounded-2xl p-8 w-full max-w-sm">
        <div className="font-display text-2xl text-center mb-1">
          SOLE<span className="text-volt bg-ink px-1">MART</span>
        </div>
        <p className="text-center text-muted text-xs mb-6">Admin panel</p>
        {state?.error && <div className="bg-rose-100 text-crimson text-sm font-semibold rounded-lg px-4 py-3 mb-4">{state.error}</div>}
        <form action={formAction}>
          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Email</label>
          <input name="email" type="email" required className="w-full border border-line rounded-lg px-3.5 py-2.5 mb-4 text-sm" />
          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Password</label>
          <input name="password" type="password" required className="w-full border border-line rounded-lg px-3.5 py-2.5 mb-4 text-sm" />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
