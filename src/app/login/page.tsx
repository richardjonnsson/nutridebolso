'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, ShieldCheck, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
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
        // Salva a sessão no localStorage
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
        // Redireciona para o app
        router.push('/');
      } else {
        setErrorMessage(
          data.message || 'Acesso não encontrado para esses dados. Verifique seu e-mail de compra.'
        );
      }
    } catch {
      setErrorMessage('Erro de conexão ao verificar acesso. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-[#d1d5db] flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Topo / Navbar */}
      <nav className="w-full max-w-md mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2fe] to-[#00ff9d] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#00f2fe]/20">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wider uppercase text-white block">
              Nutri de Bolso
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest block">
              ÁREA DE MEMBROS
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/25">
          <ShieldCheck className="w-3.5 h-3.5" /> ACESSO SEGURO
        </span>
      </nav>

      {/* Caixa de Login Centralizada */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#090e18] border border-[#1e293b] shadow-2xl relative overflow-hidden">
          {/* Luz ambiente no topo */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#00f2fe]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              Acesse seu Plano de <span className="bg-gradient-to-r from-[#00f2fe] to-[#00ff9d] bg-clip-text text-transparent">Dieta & Treino</span>
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Informe o e-mail que você utilizou na compra ou suas credenciais de acesso.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                E-mail ou Usuário:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0d1524] border border-[#1e293b] text-white text-sm focus:border-[#00f2fe] focus:outline-none focus:ring-1 focus:ring-[#00f2fe] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                <span>Senha ou Código de Acesso:</span>
                <span className="text-[10px] text-slate-500 lowercase">(opcional para alunos)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Digite sua senha ou deixe em branco"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0d1524] border border-[#1e293b] text-white text-sm focus:border-[#00f2fe] focus:outline-none focus:ring-1 focus:ring-[#00f2fe] transition-all"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center leading-relaxed">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl font-black uppercase tracking-wider font-mono text-slate-950 text-xs sm:text-sm bg-gradient-to-r from-[#00f2fe] to-[#00ff9d] shadow-lg shadow-[#00f2fe]/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>VALIDANDO ACESSO...</span>
              ) : (
                <>
                  <span>ENTRAR NA ÁREA DE MEMBROS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Destaque para Alunos */}
          <div className="mt-6 pt-5 border-t border-[#1a2538] text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d] flex-shrink-0" />
              <span>Acesso liberado instantaneamente após a compra.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#00f2fe] flex-shrink-0" />
              <span>3 Opções de cardápios na balança + ficha de treino em PDF.</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto text-center py-4 text-[11px] text-slate-500 font-mono">
        &copy; {new Date().getFullYear()} Nutri de Bolso • Plataforma Oficial de Dieta & Treino
      </footer>
    </div>
  );
}
