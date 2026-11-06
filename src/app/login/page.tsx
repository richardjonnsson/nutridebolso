'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Dumbbell, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Utensils, 
  Flame, 
  FileText,
  BadgeCheck,
  Eye,
  EyeOff
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#04060a] text-slate-100 flex flex-col justify-between selection:bg-[#00f2fe]/30 selection:text-white relative overflow-hidden font-sans">
      
      {/* Background Glows Holográficos Profissionais */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#00f2fe]/12 via-[#00ff9d]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#8b5cf6]/8 rounded-full blur-[130px] pointer-events-none" />

      {/* HEADER ELEGANTE */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00f2fe] to-[#00ff9d] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#00f2fe]/25 ring-1 ring-white/20">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight uppercase text-white block font-mono">
              Nutri de Bolso
            </span>
            <span className="text-[10px] text-[#00f2fe] font-mono tracking-widest uppercase font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
              ÁREA DE MEMBROS OFICIAL
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c1322] border border-[#1e293b] text-slate-300 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-[#00ff9d]" />
          <span>Ambiente Criptografado</span>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL (SPLIT PROFISSIONAL EM DESKTOP) */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 my-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* COLUNA ESQUERDA: APRESENTAÇÃO INSTITUCIONAL & BENEFÍCIOS */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/25 text-[#00f2fe] text-[11px] font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              SISTEMA INTELIGENTE DE DIETA & TREINO
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-[1.1]">
              Sua Transformação Começa <span className="bg-gradient-to-r from-[#00f2fe] via-[#00e5c0] to-[#00ff9d] bg-clip-text text-transparent">Agora</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Acesse seu portal exclusivo para calcular suas calorias exatas, gerar seus 3 cardápios populares na balança e baixar sua ficha de treino oficial.
            </p>

            {/* Badges de Garantia e Conteúdo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left max-w-md mx-auto lg:mx-0">
              <div className="p-3.5 rounded-xl bg-[#090f1a]/80 border border-[#1a2538] flex items-start gap-3 backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-[#00f2fe]/10 text-[#00f2fe] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">3 Cardápios no Grama</span>
                  <span className="text-[11px] text-slate-400">Comidas baratas, populares e de feira.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090f1a]/80 border border-[#1a2538] flex items-start gap-3 backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-[#00ff9d]/10 text-[#00ff9d] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Ficha de Treino & HIIT</span>
                  <span className="text-[11px] text-slate-400">Estruturada para academia ou casa.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090f1a]/80 border border-[#1a2538] flex items-start gap-3 backdrop-blur-md sm:col-span-2">
                <div className="w-8 h-8 rounded-lg bg-[#a855f7]/10 text-[#c084fc] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Exportação em PDF Oficial</span>
                  <span className="text-[11px] text-slate-400">Download pronto para imprimir ou abrir no WhatsApp.</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: CARD DE LOGIN HIGH-TECH & MINIMALISTA */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="relative p-7 sm:p-9 rounded-3xl bg-[#080d18]/90 border border-[#1e2a42] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden">
              
              {/* Brilho Superior */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-36 bg-gradient-to-r from-[#00f2fe]/20 to-[#00ff9d]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="mb-6 pb-4 border-b border-[#162032] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black uppercase text-white tracking-tight">
                    Portal do Aluno
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Identifique-se para liberar o acesso
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#0c1424] border border-[#1e293b] flex items-center justify-center text-[#00f2fe]">
                  <BadgeCheck className="w-5 h-5" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo Login / Email */}
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                    E-mail da Compra ou Usuário:
                  </label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#00f2fe]" />
                    <input
                      type="text"
                      required
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder="Ex: seunome@email.com ou ticto"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#040812] border border-[#1c273c] text-white text-sm placeholder:text-slate-600 focus:border-[#00f2fe] focus:bg-[#060b17] focus:outline-none focus:ring-1 focus:ring-[#00f2fe]/40 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Senha de Acesso:</span>
                    <span className="text-[10px] text-slate-500 lowercase font-sans">(para revisores/admin)</span>
                  </label>
                  <div className="relative group">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#00f2fe]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Digite sua senha ou deixe em branco"
                      className="w-full pl-10 pr-11 py-3.5 rounded-xl bg-[#040812] border border-[#1c273c] text-white text-sm placeholder:text-slate-600 focus:border-[#00f2fe] focus:bg-[#060b17] focus:outline-none focus:ring-1 focus:ring-[#00f2fe]/40 transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Mensagem de Erro com Animação */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center leading-relaxed font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Botão de Entrada High-End */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-xl font-black uppercase tracking-wider font-mono text-slate-950 text-xs sm:text-sm bg-gradient-to-r from-[#00f2fe] via-[#00e5c0] to-[#00ff9d] shadow-lg shadow-[#00f2fe]/25 hover:shadow-[#00f2fe]/40 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3 border border-white/20"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      AUTENTICANDO ACESSO...
                    </span>
                  ) : (
                    <>
                      <span>ACESSAR NUTRI DE BOLSO</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>

              {/* Dica de Acesso */}
              <div className="mt-6 pt-5 border-t border-[#162032] flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d]" /> Comprou na Ticto? Acesso liberado.
                </span>
                <span className="font-mono text-[#00f2fe] font-bold">V 4.2</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER DISCRETO */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-[#121a2a] text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
        <span>&copy; {new Date().getFullYear()} Nutri de Bolso • Todos os direitos reservados.</span>
        <span className="text-slate-400">Plataforma Segura Integrada via Ticto</span>
      </footer>

    </div>
  );
}
