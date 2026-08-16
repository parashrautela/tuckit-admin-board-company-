import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('parash');
  const [password, setPassword] = useState('Tuckit@200');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid credentials or login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-surface-canvas p-4 text-ink">
      <div className="relative w-full max-w-[380px] bg-white rounded-xl border border-hairline shadow-card p-8 animate-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2 pb-6">
          <div className="h-12 w-12 mx-auto rounded-lg bg-primary flex items-center justify-center text-white font-extrabold text-2xl shadow-xs">
            T
          </div>
          <div>
            <h1 className="text-card-title text-ink font-bold tracking-tight">
              TUCK<span className="text-primary">IT</span>
            </h1>
            <p className="text-caption text-ink-muted mt-0.5">
              Admin & Operations Console
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-caption font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-caption font-semibold text-ink uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-subtle">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="parash"
                className="w-full pl-9 pr-3 h-10 bg-white border border-hairline rounded-md text-body-sm text-ink placeholder:text-ink-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-caption font-semibold text-ink uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-subtle">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Tuckit@200"
                className="w-full pl-9 pr-9 h-10 bg-white border border-hairline rounded-md text-body-sm text-ink placeholder:text-ink-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-subtle hover:text-ink transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-zinc-900 hover:bg-black text-white text-button font-medium rounded-md shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign in to console</span>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-hairline-soft text-center text-caption text-ink-subtle font-mono">
          Connected Node: AWS IoT AP-South-1
        </div>
      </div>
    </div>
  );
};
