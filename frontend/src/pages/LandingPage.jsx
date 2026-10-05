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
  LogIn,
  FileCheck,
  Check,
  ExternalLink,
  GitBranch,
  Database,
  Lock,
  Search,
  ChevronRight
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-700 selection:text-white">
      {/* Top National Civic Header Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 font-medium">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>Government of India Prototype Initiative</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Smart India Hackathon 2026 • SIH26129</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Interoperability Layer Standard: <strong className="text-teal-400 font-mono">UNIGOV-CANONICAL-v1</strong></span>
          </div>
        </div>
      </div>

      {/* Main National Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Emblems */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-950/10">
              <Building2 className="w-6 h-6 text-blue-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight text-blue-950">UNIGOV</span>
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-900 border border-blue-200">
                  National Gateway
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Unified Government Services Integration Platform
              </p>
            </div>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <span className={`w-2 h-2 rounded-full ${healthStatus?.status === 'UP' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="text-slate-600">Gateway Status:</span>
              <strong className="text-slate-900 font-mono">{healthStatus?.status || 'CHECKING'}</strong>
            </div>

            <button
              id="citizen-login-btn-header"
              onClick={() => setLoginModalOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center space-x-2"
            >
              <span>Citizen Login</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Subtle Civic Tricolor Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
      </header>

      {/* Main Hero & Content Section */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-slate-100 border-b border-slate-200 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Problem Statement Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
                <span>Smart India Hackathon 2026 • Problem Statement: SIH26129</span>
              </div>

              {/* Exact Hero Title */}
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-4">
                One Citizen. One Platform. Multiple Government Services.
              </h1>

              {/* Supporting Message */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-8">
                UNIGOV bridges fragmented municipal, state, and central government service portals through a unified citizen interface and an enterprise-grade interoperability layer—eliminating repetitive paperwork, isolated logins, and disparate tracking.
              </p>

              {/* Primary Call to Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  id="citizen-login-btn-hero"
                  onClick={() => setLoginModalOpen(true)}
                  className="px-6 py-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Citizen Login</span>
                </button>

                <button
                  onClick={() => handleQuickDemoLaunch('CID-2026-1001')}
                  className="px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-blue-950 font-bold text-sm border border-slate-300 transition-all shadow-sm flex items-center justify-center space-x-2"
                >
                  <Building2 className="w-4 h-4 text-blue-900" />
                  <span>Access Demo Citizen Portal</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Governance Telemetry Banner */}
        <section className="bg-white border-b border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Connected Departments</span>
                <div className="text-2xl font-extrabold text-blue-950 mt-1">{stats?.connectedDepartments || 6}</div>
                <span className="text-[11px] text-slate-600">Revenue, Transport, Civil, Municipal</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Unified Services</span>
                <div className="text-2xl font-extrabold text-blue-950 mt-1">{stats?.totalServices || 6}</div>
                <span className="text-[11px] text-slate-600">Standardized API Schemas</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Citizen Applications</span>
                <div className="text-2xl font-extrabold text-blue-950 mt-1">{stats?.totalApplications || 2}</div>
                <span className="text-[11px] text-slate-600">Live PostgreSQL Records</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Interoperability SLA</span>
                <div className="text-2xl font-extrabold text-emerald-700 mt-1">100% Real-time</div>
                <span className="text-[11px] text-emerald-700 font-medium">Zero duplicate KYC</span>
              </div>
            </div>
          </div>
        </section>

        {/* Architectural Pillars & Interoperability Model */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Enterprise Civic Infrastructure</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
              Solving Fragmented Public Service Delivery
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              How UNIGOV integrates diverse state and central applications without requiring departments to discard their existing legacy databases.
            </p>
          </div>

          {/* Interoperability Flow Visual Diagram */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-4">
              Canonical Interoperability Flow (SIH26129 Architecture)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm mb-2">1</div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Citizen Request</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Citizen logs in once with unified digital identity. Forms auto-fill without redundant KYC submission.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="w-8 h-8 rounded bg-blue-900 text-white flex items-center justify-center font-bold text-sm mb-2">2</div>
                <h3 className="text-sm font-bold text-blue-950 mb-1">UNIGOV Gateway</h3>
                <p className="text-xs text-blue-900 leading-relaxed">
                  Interoperability middleware converts canonical payload into destination department's legacy schema.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm mb-2">3</div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Department API</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Legacy system (Revenue, Sarathi RTO, NFSA) verifies and processes request under its own workflow.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="w-8 h-8 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-sm mb-2">4</div>
                <h3 className="text-sm font-bold text-emerald-950 mb-1">Unified Status</h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Citizen tracks end-to-end progress across all departments from one consolidated dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Three Core Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-950 mb-2">Unified Citizen Portal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Single secure entry-point for citizens to discover and apply for services across municipal, state, and central departments.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-950 mb-2">Interoperability Layer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adapters and canonical data transformers connect legacy departmental software, avoiding cost and risks of system rebuilds.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-950 mb-2">Audited & Transparent Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every application is assigned a canonical tracking number with linked department references for accountable public delivery.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Official Civic Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 border-t border-slate-800 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-wide">UNIGOV</span>
            <span>•</span>
            <span className="text-slate-400">Smart India Hackathon 2026 Prototype (SIH26129)</span>
          </div>
          <div className="text-slate-400">
            <span>Interoperability Layer: Spring Boot 3.3 • Java 21 • PostgreSQL 18</span>
          </div>
        </div>
      </footer>

      {/* Citizen Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-300 rounded-xl p-6 max-w-md w-full shadow-xl relative text-left">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 mb-4">
              <div className="w-10 h-10 rounded bg-blue-100 text-blue-900 flex items-center justify-center">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Citizen Sign-In</h3>
                <p className="text-xs text-slate-500">Access Unified Citizen Services Portal</p>
              </div>
            </div>

            <form onSubmit={handleCitizenLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Citizen Identification Number or Registered Email
                </label>
                <input
                  type="text"
                  value={citizenIdentifier}
                  onChange={(e) => setCitizenIdentifier(e.target.value)}
                  placeholder="e.g. CID-2026-1001"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-700 font-mono"
                  required
                />
              </div>

              {/* Demo Pre-fills */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="font-semibold text-slate-700 block">Select Demo Persona:</span>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setCitizenIdentifier('CID-2026-1001')}
                    className="text-left text-blue-800 hover:underline font-mono text-[11px]"
                  >
                    • CID-2026-1001 (Aarav Sharma — Delhi NCR)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCitizenIdentifier('CID-2026-1002')}
                    className="text-left text-blue-800 hover:underline font-mono text-[11px]"
                  >
                    • CID-2026-1002 (Priya Verma — Karnataka)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loggingIn}
                  className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  {loggingIn ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>Sign In</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
