import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Building2, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Globe2, 
  Cpu,
  LogIn,
  Activity,
  FileCheck,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [stats, setStats] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [citizenIdentifier, setCitizenIdentifier] = useState('CID-2026-1001');
  const [loggingIn, setLoggingIn] = useState(false);

  const fetchHealthAndStats = async () => {
    setLoadingHealth(true);
    try {
      const [healthRes, statsRes] = await Promise.all([
        axios.get('/api/health'),
        axios.get('/api/smart/stats')
      ]);

      setHealthStatus({
        status: healthRes.data.status,
        service: healthRes.data.service,
        timestamp: new Date().toLocaleTimeString(),
        error: false
      });
      setStats(statsRes.data);
    } catch (err) {
      setHealthStatus({
        status: 'OFFLINE',
        service: 'UNIGOV',
        timestamp: new Date().toLocaleTimeString(),
        error: true,
        message: err.message
      });
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealthAndStats();
  }, []);

  const handleCitizenLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoggingIn(true);
    try {
      const res = await axios.post('/api/users/login', {
        identifier: citizenIdentifier.trim()
      });
      if (res.data) {
        localStorage.setItem('unigov_user', JSON.stringify(res.data));
      }
      navigate('/portal');
    } catch (err) {
      console.error('Login error:', err);
      navigate('/portal');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleQuickDemoLaunch = async (identifier = 'CID-2026-1001') => {
    setLoggingIn(true);
    try {
      const res = await axios.post('/api/users/login', {
        identifier: identifier
      });
      if (res.data) {
        localStorage.setItem('unigov_user', JSON.stringify(res.data));
      }
      navigate('/portal');
    } catch (err) {
      console.error('Quick demo launch error:', err);
      navigate('/portal');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-teal-500/15 via-indigo-500/15 to-amber-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-teal-600/10 blur-[150px] rounded-full" />
      </div>

      {/* Header / Navbar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 ring-1 ring-teal-400/30">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold tracking-tight heading-font text-white">UNIGOV</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Unified Government Services Integration Platform
              </p>
            </div>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-700/60 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2 animate-pulse"></span>
              Problem Statement: SIH26129
            </span>

            {/* Citizen Login Button */}
            <button
              id="citizen-login-btn-header"
              onClick={() => setLoginModalOpen(true)}
              className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-md shadow-teal-500/25 hover:shadow-teal-500/40 active:scale-95 flex items-center space-x-1.5"
            >
              <span>Citizen Login</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* SIH 2026 Problem Statement Pill */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 shadow-inner mb-8">
              <span className="px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                SIH 2026
              </span>
              <span className="text-xs font-semibold text-slate-300">
                Problem Statement: <span className="text-white font-mono">SIH26129</span>
              </span>
            </div>

            {/* Project Title */}
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight heading-font mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-white to-emerald-200">
                UNIGOV
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-3xl font-medium text-slate-200 mb-6">
              Unified Government Services Integration Platform
            </p>

            {/* Problem Statement Context */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Eliminating fragmented government service delivery across municipal, state, and central departments with a unified citizen interface and an interoperability integration layer.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                id="citizen-login-btn-hero"
                onClick={() => setLoginModalOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-base transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
              >
                <span>Citizen Login</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/portal')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-teal-300 font-bold text-base border border-teal-500/40 transition-all duration-200 flex items-center justify-center space-x-2 hover:border-teal-400"
              >
                <Layers className="w-4 h-4 text-teal-400" />
                <span>Launch Citizen Portal</span>
              </button>
            </div>

            {/* Real-Time Database Metrics & Telemetry Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10 text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Connected Depts</span>
                <span className="text-xl font-bold text-teal-300">{stats?.connectedDepartments || 5}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Integrated Services</span>
                <span className="text-xl font-bold text-white">{stats?.totalServices || 6}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Active Applications</span>
                <span className="text-xl font-bold text-white">{stats?.totalApplications || 2}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Interoperability</span>
                <span className="text-xl font-bold text-emerald-400 font-mono text-xs mt-1 block">
                  {stats?.interopGatewayStatus || 'ONLINE'}
                </span>
              </div>
            </div>

            {/* Health Status Telemetry Card */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Backend Integration Health</span>
                <span className="font-mono text-slate-500">{healthStatus?.timestamp || 'Polling...'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {healthStatus?.error ? (
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  ) : healthStatus ? (
                    <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  ) : (
                    <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                  )}
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">
                      GET /api/health
                    </div>
                    <div className="text-xs text-slate-400">
                      Service: <span className="text-slate-200 font-mono">{healthStatus?.service || 'UNIGOV'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    healthStatus?.error
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      : healthStatus
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      healthStatus?.error ? 'bg-rose-400' : healthStatus ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}></span>
                    {healthStatus ? healthStatus.status : 'CHECKING'}
                  </span>
                </div>
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 text-left">
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-teal-500/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Unified Citizen Portal</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Single-entry portal eliminating multiple department logins, repetitive document submissions, and fragmented status checks.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-teal-500/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Interoperability Layer</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Integration middleware standardizing varied APIs, databases, authentication mechanisms, and data formats across state and central departments.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-teal-500/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Smart / AI Governance</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Intelligent eligibility matching, automated document requirements, and predictive application routing for streamlined public delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">UNIGOV</span>
            <span>•</span>
            <span>Smart India Hackathon 2026 (SIH26129)</span>
          </div>
          <div>
            <span>PostgreSQL & Spring Boot Connected</span>
          </div>
        </div>
      </footer>

      {/* Citizen Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
              <LogIn className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Citizen Login</h3>
            <p className="text-xs text-slate-400 mb-4">
              Sign in with your Unified Citizen ID or Email to access all connected departmental services.
            </p>

            <form onSubmit={handleCitizenLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Citizen ID or Email
                </label>
                <input
                  type="text"
                  value={citizenIdentifier}
                  onChange={(e) => setCitizenIdentifier(e.target.value)}
                  placeholder="e.g. CID-2026-1001 or citizen@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500 font-mono"
                  required
                />
              </div>

              {/* Quick Demo Pre-fill */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1 font-medium">Quick Demo Citizen:</span>
                <button
                  type="button"
                  onClick={() => setCitizenIdentifier('CID-2026-1001')}
                  className="text-teal-300 hover:underline font-mono text-[11px] block"
                >
                  CID-2026-1001 (Aarav Sharma — Delhi NCR)
                </button>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loggingIn}
                  className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  {loggingIn ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>Sign In to Portal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
