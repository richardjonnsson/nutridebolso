'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: loginInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();

      if (res.ok && data.authorized) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'nutridebolso_user',
            JSON.stringify({
              email: data.email || loginInput,
              name: data.name,
              role: data.role,
              authorizedAt: new Date().toISOString(),
            })
          );
        }
        router.push('/');
      } else {
        setErrorMessage(
          data.message || 'Acesso não encontrado. Verifique seu login e senha.'
        );
      }
    } catch {
      setErrorMessage('Erro de conexão ao verificar acesso. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Brilho sutil no fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,242,254,0.06),transparent_60%)] pointer-events-none" />

      {/* Card Minimalista */}
      <div className="relative w-full max-w-[360px] rounded-2xl bg-[#0c1017] border border-white/10 p-7 sm:p-8 shadow-2xl shadow-black/80">
        
        {/* Logo do App */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00f2fe] to-[#00ff9d] p-[1.5px] shadow-lg shadow-[#00f2fe]/20 mb-3.5">
            <div className="w-full h-full bg-[#080d18] rounded-[14px] flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-[#00f2fe]" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Nutri <span className="text-[#00f2fe]">de Bolso</span>
          </h1>
        </div>

        {/* Formulário de Login e Senha */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              E-mail ou Usuário
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-3.5 py-3 rounded-xl bg-[#06080e] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-3 pr-10 rounded-xl bg-[#06080e] border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs text-center font-medium leading-relaxed">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#00f2fe] to-[#00ff9d] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-[#00f2fe]/20 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Entrando...</span>
              </>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
