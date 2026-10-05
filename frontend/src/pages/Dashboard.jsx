import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Building2,
  Layers,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  RefreshCw,
  LogOut,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Code,
  Users,
  Check,
  ChevronDown
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  // Citizen Profile state
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Platform Statistics
  const [stats, setStats] = useState(null);

  // Services Directory
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingServices, setLoadingServices] = useState(true);

  // AI Assistant Query & Recommendations
  const [aiQuery, setAiQuery] = useState('');
  const [aiResults, setAiResults] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Citizen's Applications
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);

  // Application Modal state
  const [selectedService, setSelectedService] = useState(null);
  const [applicationFormData, setApplicationFormData] = useState('');
  const [applicationRemarks, setApplicationRemarks] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Interoperability Inspector Modal
  const [inspectApp, setInspectApp] = useState(null);

  // Track Application Search
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedApp, setTrackedApp] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Toast message
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Demo personas
  const personas = [
    { citizenId: 'CID-2026-1001', name: 'Aarav Sharma', label: 'Aarav Sharma (Delhi NCR — General Citizen)' },
    { citizenId: 'CID-2026-1002', name: 'Priya Verma', label: 'Priya Verma (Karnataka — Student / Scholarship)' }
  ];

  // Initial load
  useEffect(() => {
    initCitizenSession();
    fetchPlatformStats();
    fetchServices();
  }, []);

  const initCitizenSession = async (overrideIdentifier = null) => {
    setLoadingUser(true);
    try {
      let identifier = overrideIdentifier;

      if (!identifier) {
        // Check localStorage for persisted user
        const cachedUserStr = localStorage.getItem('unigov_user');
        if (cachedUserStr) {
          try {
            const cached = JSON.parse(cachedUserStr);
            if (cached && (cached.citizenId || cached.email)) {
              identifier = cached.citizenId || cached.email;
            }
          } catch (e) {
            console.error('Failed to parse cached user:', e);
          }
        }
      }

      if (!identifier) {
        identifier = 'CID-2026-1001';
      }

      const res = await axios.post('/api/users/login', {
        identifier: identifier
      });

      setCurrentUser(res.data);
      localStorage.setItem('unigov_user', JSON.stringify(res.data));
      fetchUserApplications(res.data.citizenId);
    } catch (err) {
      console.error('Failed to load citizen profile:', err);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleSwitchPersona = async (cid) => {
    await initCitizenSession(cid);
    showToast(`Switched active citizen to ${cid}`);
  };

  const fetchPlatformStats = async () => {
    try {
      const res = await axios.get('/api/smart/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await axios.get('/api/services');
      setServices(res.data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchUserApplications = async (citizenId) => {
    setLoadingApplications(true);
    try {
      const res = await axios.get(`/api/applications?citizenId=${citizenId}`);
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleAiSearch = async (queryText = null) => {
    const q = queryText !== null ? queryText : aiQuery;
    if (!q || !q.trim()) return;

    setLoadingAi(true);
    try {
      const res = await axios.post('/api/smart/recommend', {
        query: q.trim()
      });
      setAiResults(res.data);
    } catch (err) {
      console.error('Failed to query smart assistant:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handlePromptChipClick = (promptText) => {
    setAiQuery(promptText);
    handleAiSearch(promptText);
  };

  const handleApplyClick = (service) => {
    setSelectedService(service);
    setApplicationFormData('');
    setApplicationRemarks('');
    setSubmissionSuccess(null);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedService || !currentUser) return;

    setSubmittingApp(true);
    try {
      const payload = {
        userId: currentUser.id,
        citizenId: currentUser.citizenId,
        serviceId: selectedService.id,
        applicantName: currentUser.fullName,
        formData: applicationFormData || `{"serviceCode":"${selectedService.serviceCode}","applicantAddress":"${currentUser.address}"}`,
        remarks: applicationRemarks || 'Application submitted via UNIGOV Interoperability Gateway'
      };

      const res = await axios.post('/api/applications', payload);
      setSubmissionSuccess(res.data);
      showToast(`Application ${res.data.trackingNumber} dispatched to ${res.data.department}!`);

      // Refresh applications & stats
      fetchUserApplications(currentUser.citizenId);
      fetchPlatformStats();
    } catch (err) {
      console.error('Application submission failed:', err);
      showToast('Application submission failed. Please try again.', 'error');
    } finally {
      setSubmittingApp(false);
    }
  };

  const handleAdvanceStatus = async (appId, currentStatus) => {
    let nextStatus = 'UNDER_REVIEW';
    let remarks = 'Interoperability verification completed by department gateway.';
    if (currentStatus === 'SUBMITTED') {
      nextStatus = 'UNDER_REVIEW';
      remarks = 'Document cross-verification passed. Tahsildar / Officer review initiated.';
    } else if (currentStatus === 'UNDER_REVIEW') {
      nextStatus = 'APPROVED';
      remarks = 'Final departmental approval granted. Digitally signed certificate/license dispatched.';
    }

    try {
      const res = await axios.patch(`/api/applications/${appId}/status`, {
        status: nextStatus,
        remarks: remarks
      });
      showToast(`Application updated to stage: ${nextStatus}`);
      if (currentUser) {
        fetchUserApplications(currentUser.citizenId);
      }
      fetchPlatformStats();
    } catch (err) {
      console.error('Failed to advance application stage:', err);
    }
  };

  const handleTrackByNumber = async (e) => {
    if (e) e.preventDefault();
    if (!trackQuery.trim()) return;
    setTrackError('');
    setTrackedApp(null);

    try {
      const res = await axios.get(`/api/applications/track/${trackQuery.trim()}`);
      setTrackedApp(res.data);
    } catch (err) {
      setTrackError('No application found with tracking number: ' + trackQuery.trim());
    }
  };

  // Filter services by category and search query
  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'ALL' || srv.category.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-teal-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-indigo-500/10 blur-[150px] rounded-full" />
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center space-x-2 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500 text-rose-200'
              : 'bg-teal-950/90 border-teal-500 text-teal-200'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-teal-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-500/20">
                <Building2 className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-mono">UNIGOV</span>
            </Link>
            <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-teal-300 font-semibold">
              Citizen Portal • SIH26129
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Gateway Status Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-slate-400 hidden sm:inline">Gateway:</span>
              <span className="font-semibold text-emerald-300 font-mono">
                {stats?.interopGatewayStatus || 'ONLINE'}
              </span>
            </div>

            {/* Persona Switcher Selector for Hackathon Presentation */}
            <div className="relative">
              <select
                aria-label="Active Demo Persona"
                value={currentUser?.citizenId || 'CID-2026-1001'}
                onChange={(e) => handleSwitchPersona(e.target.value)}
                className="appearance-none px-3 py-1.5 pr-8 rounded-lg bg-teal-500/10 border border-teal-500/30 text-xs font-semibold text-teal-200 focus:outline-none focus:border-teal-400 cursor-pointer"
              >
                {personas.map((p) => (
                  <option key={p.citizenId} value={p.citizenId} className="bg-slate-900 text-white">
                    👤 {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-teal-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            <button
              onClick={() => navigate('/')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Return to Landing Page"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Citizen Profile Banner (SIH26129 Core Proposition: Unified Identity) */}
        {currentUser && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-teal-500/20 flex-shrink-0">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h1 className="text-2xl font-bold text-white">{currentUser.fullName}</h1>
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {currentUser.citizenId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Email: <strong className="text-slate-200">{currentUser.email}</strong></span>
                    <span>Phone: <strong className="text-slate-200">{currentUser.phone}</strong></span>
                    <span>State: <strong className="text-slate-200">{currentUser.state}</strong></span>
                    <span>Address: <strong className="text-slate-200">{currentUser.address}</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-teal-500/20 flex items-center space-x-3 text-xs">
                  <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Unified Interoperability Active</span>
                    <span className="text-slate-400">Zero duplicate KYC required across 6 departments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Federated Services</span>
            <div className="text-2xl font-bold text-white mt-1">{stats?.totalServices || 6}</div>
            <span className="text-[11px] text-teal-400 font-medium">Cross-department catalog</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Connected Depts</span>
            <div className="text-2xl font-bold text-teal-300 mt-1">{stats?.connectedDepartments || 5}</div>
            <span className="text-[11px] text-slate-400">Revenue, Transport, Civil, ULB</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active In PostgreSQL</span>
            <div className="text-2xl font-bold text-white mt-1">{applications.length}</div>
            <span className="text-[11px] text-slate-400">Tracked for current citizen</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interoperability SLA</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">100% Real-time</div>
            <span className="text-[11px] text-emerald-400">Zero manual KYC steps</span>
          </div>
        </div>

        {/* AI Smart Governance Assistant Section */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/30 border border-teal-500/30 shadow-xl">
          <div className="flex items-center space-x-2 text-teal-400 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">AI-Powered Governance Assistant</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Find Services & Check Eligibility Instantly
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Type what you need in natural language or click a preset prompt chip below:
          </p>

          {/* Preset Chips for SIH Demo Presentation */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { label: '🎓 College Scholarship & Income Certificate', q: 'Income certificate for university college scholarship' },
              { label: '🚗 Expedited Driving License Renewal', q: 'Renew my expiring driving license' },
              { label: '🌾 NFSA Priority Family Ration Card', q: 'NFSA subsidized ration card for family quota' },
              { label: '💧 Domestic Water Supply Sanction', q: 'New domestic drinking water pipeline connection' },
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptChipClick(chip.q)}
                className="px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-teal-500/10 border border-slate-800 hover:border-teal-500/40 text-xs text-slate-300 hover:text-teal-300 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleAiSearch(); }} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask UNIGOV AI assistant..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loadingAi}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              {loadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Ask AI</span>
            </button>
          </form>

          {/* AI Search Results */}
          {aiResults && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
              <div className="text-xs text-teal-300 font-medium">
                💡 {aiResults.aiSummary}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiResults.recommendations.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-teal-500/30 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-sm">{item.service.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          {item.relevanceScore}% Match
                        </span>
                      </div>
                      <p className="text-slate-400 mb-2">{item.service.department}</p>
                      <p className="text-slate-300 italic mb-3">{item.aiAdvice}</p>
                    </div>
                    <button
                      onClick={() => handleApplyClick(item.service)}
                      className="self-end px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-semibold text-xs flex items-center space-x-1 transition-colors"
                    >
                      <span>Apply with UNIGOV KYC</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Federated Services Directory */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Federated Government Services</h2>
              <p className="text-xs text-slate-400">
                Connected departmental portals with standardized schema & unified application gateway
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'Certificates', 'Transport', 'Welfare', 'Civic Services', 'Pension'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCategory.toUpperCase() === cat.toUpperCase()
                      ? 'bg-teal-500 text-slate-950'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {loadingServices ? (
            <div className="p-8 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-400" />
              Loading federated government catalog...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {srv.serviceCode}
                      </span>
                      <span className="text-[11px] font-semibold text-teal-400">
                        Fee: {srv.fee === 0 ? 'FREE' : `₹${srv.fee}`}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{srv.title}</h3>
                    <p className="text-xs font-medium text-slate-400 mb-2">{srv.department}</p>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{srv.description}</p>

                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 mb-4">
                      <span className="font-semibold text-slate-300 block mb-0.5">Required Proofs:</span>
                      {srv.requiredDocs}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>SLA: {srv.processingDays} days</span>
                    </span>

                    <button
                      onClick={() => handleApplyClick(srv)}
                      className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real-Time Citizen Applications & Interoperability Journey */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Your Interoperability Journey</h2>
              <p className="text-xs text-slate-400">
                Live applications routed through the UNIGOV Interoperability Gateway
              </p>
            </div>

            {/* Quick Track by number */}
            <form onSubmit={handleTrackByNumber} className="flex gap-2">
              <input
                type="text"
                placeholder="Track e.g. UG-2026-78412"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
              >
                Track
              </button>
            </form>
          </div>

          {trackError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {trackError}
            </div>
          )}

          {trackedApp && (
            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Tracking Result: {trackedApp.trackingNumber}</span>
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-teal-500 text-slate-950 text-[11px]">
                  {trackedApp.status}
                </span>
              </div>
              <p className="text-slate-300">Service: <strong className="text-white">{trackedApp.serviceTitle}</strong> ({trackedApp.department})</p>
              <p className="text-slate-400">Department External Ref: <strong className="text-teal-300 font-mono">{trackedApp.departmentRefNumber}</strong></p>
              <p className="text-slate-400">Remarks: {trackedApp.remarks}</p>
            </div>
          )}

          {/* Applications Visual Flow Cards */}
          {loadingApplications ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-400" />
              Loading live applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800/80">
              No applications submitted yet for this citizen profile. Select a service above to experience the unified application flow!
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const isUnderReview = app.status === 'UNDER_REVIEW' || app.status === 'APPROVED';
                const isApproved = app.status === 'APPROVED';

                return (
                  <div key={app.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-teal-300 text-sm">{app.trackingNumber}</span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-xs text-slate-300 font-semibold">{app.serviceTitle}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Department: <strong className="text-slate-300">{app.department}</strong> • External Ref: <strong className="text-teal-300 font-mono">{app.departmentRefNumber || 'N/A'}</strong>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {app.interopPayload && (
                          <button
                            onClick={() => setInspectApp(app)}
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] flex items-center space-x-1"
                            title="Inspect canonical-to-department payload"
                          >
                            <Code className="w-3 h-3 text-teal-400" />
                            <span>View Gateway Payload</span>
                          </button>
                        )}

                        {app.status !== 'APPROVED' ? (
                          <button
                            onClick={() => handleAdvanceStatus(app.id, app.status)}
                            className="px-3 py-1 rounded bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold flex items-center space-x-1 transition-colors"
                            title="Advance stage for demo reviewers"
                          >
                            <span>Advance Stage</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Certificate Dispatched</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 4-Stage Visual Stepper */}
                    <div className="pt-2 border-t border-slate-850">
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                        {/* Step 1 */}
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                          <Check className="w-3.5 h-3.5 mx-auto mb-1" />
                          <span className="font-bold block">1. Form Submitted</span>
                          <span className="text-[9px] text-slate-400">Canonical UNIGOV KYC</span>
                        </div>
                        {/* Step 2 */}
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                          <Check className="w-3.5 h-3.5 mx-auto mb-1" />
                          <span className="font-bold block">2. Interop Routed</span>
                          <span className="text-[9px] text-slate-400">{app.departmentRefNumber || 'Routed'}</span>
                        </div>
                        {/* Step 3 */}
                        <div className={`p-2 rounded-lg border ${
                          isUnderReview
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          {isUnderReview ? <Check className="w-3.5 h-3.5 mx-auto mb-1" /> : <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-slate-500" />}
                          <span className="font-bold block">3. Officer Review</span>
                          <span className="text-[9px] text-slate-400">{isUnderReview ? 'In Progress / Passed' : 'Pending'}</span>
                        </div>
                        {/* Step 4 */}
                        <div className={`p-2 rounded-lg border ${
                          isApproved
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          {isApproved ? <CheckCircle className="w-3.5 h-3.5 mx-auto mb-1" /> : <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-slate-500" />}
                          <span className="font-bold block">4. Final Sanction</span>
                          <span className="text-[9px] text-slate-400">{isApproved ? 'Dispatched' : 'Pending'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">UNIGOV</span>
            <span>•</span>
            <span>Smart India Hackathon 2026 (SIH26129)</span>
          </div>
          <div>
            <span>Interoperability Layer Active • Java 21 • Spring Boot • PostgreSQL</span>
          </div>
        </div>
      </footer>

      {/* Application Submission Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {submissionSuccess ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Application Dispatched Successfully!</h3>
                <p className="text-xs text-slate-300">
                  Your application has been validated and dispatched via the <strong>UNIGOV Interoperability Gateway</strong> to the target department.
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">UNIGOV Tracking Number:</span>
                    <strong className="text-teal-300 font-mono">{submissionSuccess.trackingNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department External Ref:</span>
                    <strong className="text-slate-200 font-mono">{submissionSuccess.departmentRefNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Department:</span>
                    <strong className="text-slate-200">{submissionSuccess.department}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Initial Status:</span>
                    <strong className="text-emerald-400">{submissionSuccess.status}</strong>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedService(null)}
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-colors"
                >
                  Done & Return to Portal
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedService.title}</h3>
                    <p className="text-xs text-slate-400">{selectedService.department}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    SLA: {selectedService.processingDays} Days
                  </span>
                </div>

                {/* Pre-populated citizen identity banner */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-teal-500/30 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-teal-300 font-semibold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Auto-Populated from UNIGOV Unified Profile</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>Applicant: <strong>{currentUser?.fullName}</strong></div>
                    <div>Citizen ID: <strong className="font-mono">{currentUser?.citizenId}</strong></div>
                    <div>State: <strong>{currentUser?.state}</strong></div>
                    <div>Phone: <strong>{currentUser?.phone}</strong></div>
                  </div>
                </div>

                {/* Specific Application details */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Application Specific Metadata / Details
                  </label>
                  <textarea
                    rows={3}
                    value={applicationFormData}
                    onChange={(e) => setApplicationFormData(e.target.value)}
                    placeholder='e.g. {"purpose": "Higher Education", "annualIncome": "350000"}'
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Remarks / Specific Instructions for Department
                  </label>
                  <input
                    type="text"
                    value={applicationRemarks}
                    onChange={(e) => setApplicationRemarks(e.target.value)}
                    placeholder="e.g. Urgent processing requested for university deadline"
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400">
                  Fee: <strong className="text-white">{selectedService.fee === 0 ? 'FREE' : `₹${selectedService.fee}`}</strong> • Dispatch Method: <strong>UNIGOV Canonical Adapter</strong>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingApp}
                    className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    {submittingApp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit to Department</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Interoperability Inspector Modal */}
      {inspectApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Gateway Interoperability Payload</h3>
              </div>
              <span className="font-mono text-xs text-teal-300 font-bold">{inspectApp.trackingNumber}</span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              This payload proves the SIH26129 canonical data transformation. UNIGOV converts citizen input into the destination department's legacy schema:
            </p>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-teal-300 font-mono overflow-x-auto max-h-60 mb-4">
              {(() => {
                try {
                  return JSON.stringify(JSON.parse(inspectApp.interopPayload || '{}'), null, 2);
                } catch (e) {
                  return inspectApp.interopPayload || 'No payload recorded';
                }
              })()}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectApp(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
