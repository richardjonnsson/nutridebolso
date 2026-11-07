'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Eye, EyeOff, Loader2, ArrowRight, Lock } from 'lucide-react';

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
    <div className="min-h-screen bg-[#06080e] text-[#d1d5db] flex flex-col justify-between">
      {/* NAVBAR OFICIAL IDENTICA AO RESTO DO APP */}
      <nav className="tactical-navbar">
        <div className="tactical-logo">
          <Dumbbell className="w-5 h-5 text-[#00f2fe]" />
          <span>Nutri<strong className="text-white"> de Bolso</strong></span>
        </div>

        <div className="text-xs font-bold uppercase tracking-wider flex items-center">
          <span className="text-[#00f2fe] flex items-center gap-2 font-mono bg-[#00f2fe]/10 border border-[#00f2fe]/25 px-3 py-1.5 rounded-full shadow-sm shadow-[#00f2fe]/10">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
            Área de Acesso
          </span>
        </div>
      </nav>

      {/* CONTAINER TÁTICO CENTRALIZADO (LAYOUT & CORES IDÊNTICOS) */}
      <main className="tactical-container flex-1 flex flex-col justify-center items-center my-auto py-8">
        <div className="w-full max-w-[480px]">
          
          {/* Header Centralizado */}
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/25">
              <Lock className="w-3 h-3 text-[#00f2fe]" /> ACESSO RESTRITO
            </span>
          </div>

          <h1 className="section-title">
            Entrar no <span>App</span>
          </h1>

          <p className="subtitle">
            Informe seu e-mail de compra ou usuário para acessar seu plano de dieta e treinos.
          </p>

          {/* CARD NO FORMATO CALC-WRAPPER DO APP */}
          <div className="calc-wrapper">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>E-mail da Compra ou Usuário:</label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Ex: seu@email.com ou ticto"
                />
              </div>

              <div className="form-group">
                <label>Senha:</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    style={{ paddingRight: '45px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#00f2fe] transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono text-center">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>VERIFICANDO ACESSO...</span>
                  </>
                ) : (
                  <>
                    <span>ACESSAR NUTRI DE BOLSO</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </main>

      {/* FOOTER OFICIAL DO APP */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Nutri de Bolso | Sistema Inteligente de Dieta & Treino • Todos os direitos reservados.
      </footer>
    </div>
  );
}
