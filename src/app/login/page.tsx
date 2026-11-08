'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Loader2, ArrowRight, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Captura automática de e-mail via URL se redirecionado direto da Ticto (?email=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get('email') || params.get('e');
      if (urlEmail) {
        setEmailInput(urlEmail.trim().toLowerCase());
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: emailInput.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.authorized) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'nutridebolso_user',
            JSON.stringify({
              email: data.email || emailInput,
              name: data.name,
              role: data.role,
              authorizedAt: new Date().toISOString(),
            })
          );
        }
        router.push('/');
      } else {
        setErrorMessage(
          data.message || 'Nenhuma compra aprovada encontrada para este e-mail. Verifique se digitou o mesmo e-mail cadastrado na Ticto.'
        );
      }
    } catch {
      setErrorMessage('Erro de conexão ao verificar acesso. Tente novamente em alguns segundos.');
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

      {/* CONTAINER TÁTICO CENTRALIZADO */}
      <main className="tactical-container flex-1 flex flex-col justify-center items-center my-auto py-10">
        <div className="w-full max-w-[460px]">
          
          {/* Tag de Status */}
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/25">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ff9d]" /> ACESSO LIBERADO VIA TICTO
            </span>
          </div>

          <h1 className="section-title">
            Entrar no <span>App</span>
          </h1>

          <p className="subtitle">
            Informe o mesmo e-mail que você utilizou ao realizar a compra para acessar instantaneamente seu plano de dieta e treinos.
          </p>

          {/* CARD NO FORMATO CALC-WRAPPER DO APP */}
          <div className="calc-wrapper">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-5">
                <label>E-mail da Compra:</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    autoComplete="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Ex: seuemail@gmail.com"
                  />
                </div>
                <span className="text-[11px] text-slate-500 font-mono mt-1.5 block">
                  Insira o e-mail cadastrado na Ticto no momento do pagamento.
                </span>
              </div>

              {errorMessage && (
                <div className="p-3.5 mb-5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono text-center leading-relaxed">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !emailInput.trim()}
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

            <div className="mt-5 pt-4 border-t border-[#1a2538] flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d]" />
              <span>Acesso liberado 100% automático após o pagamento.</span>
            </div>
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
