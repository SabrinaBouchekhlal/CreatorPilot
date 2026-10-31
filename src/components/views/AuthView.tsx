import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, User, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthView: React.FC<{ mode: 'login' | 'signup' }> = ({ mode }) => {
  const { setRoute, loginWithEmail, signupWithEmail, t, direction } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await signupWithEmail(email, password, fullName);
      } else {
        await loginWithEmail(email, password);
      }
    } catch {
      // Error toast already displayed in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF5A6E] to-[#E8465A] flex items-center justify-center text-white font-extrabold text-lg mx-auto shadow-sm">
            CP
          </div>
          <h2 className="text-xl font-bold text-[#0E1633]">
            {mode === 'signup' ? t.nav.signUp : t.nav.signIn}
          </h2>
          <p className="text-xs text-slate-500">
            {t.brand} · مساحة العمل الاستراتيجية الموثقة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.auth.fullNameLabel}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute top-2.5 start-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.auth.fullNamePlaceholder}
                  className="w-full ps-9 pe-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.auth.emailLabel}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute top-2.5 start-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.emailPlaceholder}
                className="w-full ps-9 pe-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.auth.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute top-2.5 start-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-9 pe-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 text-xs font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{isSubmitting ? t.common.saving : (mode === 'signup' ? t.nav.signUp : t.nav.signIn)}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          {mode === 'signup' ? (
            <p>
              {t.auth.haveAccount}{' '}
              <button 
                onClick={() => setRoute('login')}
                className="text-[#FF5A6E] font-bold hover:underline"
              >
                {t.nav.signIn}
              </button>
            </p>
          ) : (
            <p>
              {t.auth.noAccount}{' '}
              <button 
                onClick={() => setRoute('signup')}
                className="text-[#FF5A6E] font-bold hover:underline"
              >
                {t.nav.signUp}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
