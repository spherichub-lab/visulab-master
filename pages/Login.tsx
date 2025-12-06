import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4 md:p-6 relative bg-slate-50 overflow-y-auto">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-900 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[40vw] h-[40vw] bg-accent-purple/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl text-primary mb-4">
              <Icon name="visibility" className="!text-4xl" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">VisuLab</h1>
            <p className="text-slate-300 mt-2 font-medium">Sistema de Gerenciamento para Laboratórios Ópticos</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-10 transition-all duration-300">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h2>
                <p className="text-slate-500 mt-1 text-sm">Por favor, insira seus dados para entrar.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 ml-1" htmlFor="email">Endereço de Email</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icon name="mail" className="!text-lg" />
                        </span>
                        <input 
                            id="email"
                            type="text" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@visulab.com"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 ml-1" htmlFor="password">Senha</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icon name="lock" className="!text-lg" />
                        </span>
                        <input 
                            id="password"
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex justify-end mt-2">
                        <a href="#" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">Esqueceu a senha?</a>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                            <span>Entrar</span>
                            <Icon name="arrow_forward" className="!text-lg" />
                        </>
                    )}
                </button>
            </form>

             <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                    Não tem uma conta? <a href="#" className="font-bold text-slate-900 hover:text-primary transition-colors">Contate o Admin</a>
                </p>
            </div>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-400 font-medium opacity-60">
                &copy; 2024 VisuLab Systems v2.0
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;