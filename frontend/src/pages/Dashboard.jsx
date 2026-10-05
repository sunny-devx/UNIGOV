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
  ChevronDown,
  FileCheck2,
  SlidersHorizontal,
  Info
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

  // Smart Service Recommendation state
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
    showToast(`Active citizen switched to ${cid}`);
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
      console.error('Failed to query service assistant:', err);
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
      showToast(`Application ${res.data.trackingNumber} successfully routed to ${res.data.department}!`);

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
      await axios.patch(`/api/applications/${appId}/status`, {
        status: nextStatus,
        remarks: remarks
      });
      showToast(`Application status advanced to: ${nextStatus}`);
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
      setTrackError('No record found for tracking number: ' + trackQuery.trim());
    }
  };

  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'ALL' || srv.category.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between selection:bg-blue-700 selection:text-white">
      {/* Top Official Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 font-medium">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>Government of India Prototype Initiative</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Smart India Hackathon 2026 • SIH26129</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Interoperability Layer: <strong className="text-teal-400 font-mono">ONLINE</strong></span>
            <span>PostgreSQL Status: <strong className="text-emerald-400 font-mono">CONNECTED</strong></span>
          </div>
        </div>
      </div>

      {/* Main Civic Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded bg-blue-900 flex items-center justify-center text-white shadow-sm">
                <Building2 className="w-5 h-5 text-blue-100" />
              </div>
              <span className="text-xl font-bold tracking-tight text-blue-950 font-mono">UNIGOV</span>
            </Link>
            <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded font-semibold bg-slate-100 text-slate-700 border border-slate-300">
              Citizen Services Portal
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <label htmlFor="persona-select" className="sr-only">Switch Active Citizen Persona</label>
              <select
                id="persona-select"
                value={currentUser?.citizenId || 'CID-2026-1001'}
                onChange={(e) => handleSwitchPersona(e.target.value)}
                className="appearance-none px-3 py-1.5 pr-8 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-700 cursor-pointer shadow-2xs"
              >
                {personas.map((p) => (
                  <option key={p.citizenId} value={p.citizenId}>
                    👤 {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            <button
              onClick={() => navigate('/')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Return to Landing Page"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Subtle Tricolor Accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
      </header>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-5 z-50 animate-in slide-in-from-top duration-200">
          <div className={`px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold flex items-center space-x-2 ${
            toast.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 1. CITIZEN IDENTITY CARD (Authoritative Government Digital Identity) */}
        {currentUser && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold text-xl shadow-xs flex-shrink-0">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h1 className="text-xl font-bold text-slate-950">{currentUser.fullName}</h1>
                    <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-blue-50 text-blue-900 border border-blue-200">
                      {currentUser.citizenId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      KYC Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 flex flex-wrap gap-x-5 gap-y-1">
                    <span>Email: <strong className="text-slate-800">{currentUser.email}</strong></span>
                    <span>Phone: <strong className="text-slate-800">{currentUser.phone}</strong></span>
                    <span>State: <strong className="text-slate-800">{currentUser.state}</strong></span>
                    <span>Address: <strong className="text-slate-800">{currentUser.address}</strong></span>
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 flex items-center space-x-3 text-xs max-w-sm">
                <ShieldCheck className="w-5 h-5 text-blue-800 flex-shrink-0" />
                <div>
                  <strong className="text-blue-950 block">Federated Identity Active</strong>
                  <span className="text-blue-900">Valid across all 6 integrated departments without redundant document re-submission.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. AVAILABLE GOVERNMENT SERVICES (Service Catalog) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Federated Government Services Directory</h2>
              <p className="text-xs text-slate-600">
                Official services connected via UNIGOV Interoperability Gateway
              </p>
            </div>

            {/* Department Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'Certificates', 'Transport', 'Welfare', 'Civic Services', 'Pension'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    selectedCategory.toUpperCase() === cat.toUpperCase()
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search service name, department, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700"
            />
          </div>

          {/* Service Modules Grid */}
          {loadingServices ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-900" />
              Loading service directory...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                        {srv.serviceCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        Fee: <strong className="text-slate-950">{srv.fee === 0 ? 'FREE' : `₹${srv.fee}`}</strong>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-950 mb-1">{srv.title}</h3>
                    <p className="text-xs font-semibold text-blue-900 mb-2">{srv.department}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{srv.description}</p>

                    <div className="p-2.5 rounded bg-white border border-slate-200 text-[11px] text-slate-600 mb-4">
                      <span className="font-semibold text-slate-900 block mb-0.5">Mandatory Proofs:</span>
                      {srv.requiredDocs}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Legal SLA: <strong>{srv.processingDays} days</strong></span>
                    </span>

                    <button
                      onClick={() => handleApplyClick(srv)}
                      className="px-4 py-1.5 rounded bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-2xs"
                    >
                      Apply Online
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. RECOMMENDED SERVICES (UNIGOV Service Assistant / Discovery Capability) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-800" />
            <h2 className="text-base font-bold text-slate-950">
              UNIGOV Service Assistant • Smart Service Recommendation
            </h2>
          </div>
          <p className="text-xs text-slate-600">
            Search what you need in natural language or select a common citizen scenario:
          </p>

          {/* Quick Scenario Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: '🎓 College Scholarship & Income Certificate', q: 'Income certificate for university college scholarship' },
              { label: '🚗 Driving License Renewal', q: 'Renew my expiring driving license' },
              { label: '🌾 NFSA Priority Family Ration Card', q: 'NFSA subsidized ration card for family quota' },
              { label: '💧 Municipal Water Connection', q: 'New domestic drinking water pipeline connection' },
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptChipClick(chip.q)}
                className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-blue-50 border border-slate-300 hover:border-blue-300 text-xs font-medium text-slate-700 hover:text-blue-900 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleAiSearch(); }} className="flex gap-2 pt-1">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Describe your requirement (e.g., 'need income certificate for higher studies')..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700"
              />
            </div>
            <button
              type="submit"
              disabled={loadingAi}
              className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              {loadingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Find Service</span>
            </button>
          </form>

          {/* Assistant Recommendations */}
          {aiResults && (
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="text-xs text-blue-900 font-medium bg-blue-50/70 p-2.5 rounded border border-blue-200">
                ℹ️ {aiResults.aiSummary}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiResults.recommendations.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-950 text-sm">{item.service.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                          {item.relevanceScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{item.service.department}</p>
                      <p className="text-xs text-slate-700 mb-2 leading-relaxed">{item.aiAdvice}</p>
                    </div>
                    <button
                      onClick={() => handleApplyClick(item.service)}
                      className="self-end px-3 py-1.5 rounded bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs flex items-center space-x-1 transition-colors"
                    >
                      <span>Apply with Pre-Filled KYC</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. ACTIVE APPLICATIONS & INTEROPERABILITY JOURNEY */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Active Applications & Interoperability Journey</h2>
              <p className="text-xs text-slate-600">
                End-to-end tracked lifecycle routed through UNIGOV Interoperability Gateway
              </p>
            </div>

            {/* Tracking Search */}
            <form onSubmit={handleTrackByNumber} className="flex gap-2">
              <input
                type="text"
                placeholder="Track Ref e.g. UG-2026-78412"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-700 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Track
              </button>
            </form>
          </div>

          {trackError && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {trackError}
            </div>
          )}

          {trackedApp && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950 text-sm">Tracking Result: {trackedApp.trackingNumber}</span>
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-blue-900 text-white text-[11px]">
                  {trackedApp.status}
                </span>
              </div>
              <p className="text-slate-700">Service: <strong className="text-slate-900">{trackedApp.serviceTitle}</strong> ({trackedApp.department})</p>
              <p className="text-slate-600">Department External Ref: <strong className="text-blue-900 font-mono">{trackedApp.departmentRefNumber}</strong></p>
              <p className="text-slate-600">Remarks: {trackedApp.remarks}</p>
            </div>
          )}

          {/* Applications Cards with 4-Stage Stepper */}
          {loadingApplications ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-900" />
              Loading applications ledger...
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-lg border border-slate-200">
              No applications on record for this citizen. Select a service above to submit an application.
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const isUnderReview = app.status === 'UNDER_REVIEW' || app.status === 'APPROVED';
                const isApproved = app.status === 'APPROVED';

                return (
                  <div key={app.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-blue-950 text-sm">{app.trackingNumber}</span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-xs text-slate-900 font-bold">{app.serviceTitle}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Target Department: <strong className="text-slate-800">{app.department}</strong> • Dept Acknowledgment Ref: <strong className="text-blue-900 font-mono">{app.departmentRefNumber || 'N/A'}</strong>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {app.interopPayload && (
                          <button
                            onClick={() => setInspectApp(app)}
                            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-medium flex items-center space-x-1 shadow-2xs"
                            title="Inspect canonical-to-department payload"
                          >
                            <Code className="w-3 h-3 text-blue-800" />
                            <span>View Gateway Payload</span>
                          </button>
                        )}

                        {app.status !== 'APPROVED' ? (
                          <button
                            onClick={() => handleAdvanceStatus(app.id, app.status)}
                            className="px-3 py-1 rounded bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center space-x-1 transition-colors"
                            title="Advance stage for demo reviewers"
                          >
                            <span>Advance Stage</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Certificate Dispatched</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 4-Stage Civic Stepper */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                        {/* Step 1 */}
                        <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
                          <Check className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" />
                          <span className="font-bold block">1. Form Submitted</span>
                          <span className="text-[9px] text-slate-500">UNIGOV Canonical Identity</span>
                        </div>
                        {/* Step 2 */}
                        <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
                          <Check className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" />
                          <span className="font-bold block">2. Gateway Routed</span>
                          <span className="text-[9px] text-slate-500">{app.departmentRefNumber || 'Routed'}</span>
                        </div>
                        {/* Step 3 */}
                        <div className={`p-2 rounded border ${
                          isUnderReview
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}>
                          {isUnderReview ? <Check className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-slate-400" />}
                          <span className="font-bold block">3. Officer Review</span>
                          <span className="text-[9px] text-slate-500">{isUnderReview ? 'In Progress / Passed' : 'Pending'}</span>
                        </div>
                        {/* Step 4 */}
                        <div className={`p-2 rounded border ${
                          isApproved
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}>
                          {isApproved ? <CheckCircle className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-slate-400" />}
                          <span className="font-bold block">4. Final Sanction</span>
                          <span className="text-[9px] text-slate-500">{isApproved ? 'Dispatched' : 'Pending'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. INTEROPERABILITY INFORMATION ARCHITECTURE BANNER */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Interoperability Layer Architecture (SIH26129 Compliance)
          </span>
          <p className="text-xs text-slate-600 mb-4 max-w-3xl leading-relaxed">
            UNIGOV operates as an integration middleware between heterogeneous public administration databases. Data entered by citizens is standardized under canonical schemas and transformed via departmental adapters to target endpoints.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Standard</span>
              <strong className="text-slate-900 font-mono">UNIGOV-CANONICAL-v1</strong>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Gateway Port</span>
              <strong className="text-slate-900 font-mono">8080 (REST / JSON)</strong>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Primary Store</span>
              <strong className="text-slate-900 font-mono">PostgreSQL 18.6</strong>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Connected Gateways</span>
              <strong className="text-slate-900 font-mono">{stats?.connectedDepartments || 6} Departments</strong>
            </div>
          </div>
        </div>
      </main>

      {/* Official Civic Footer */}
      <footer className="bg-slate-900 text-slate-300 py-6 border-t border-slate-800 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-wide">UNIGOV</span>
            <span>•</span>
            <span className="text-slate-400">Smart India Hackathon 2026 Prototype (SIH26129)</span>
          </div>
          <div className="text-slate-400">
            <span>Interoperability Layer Active • Spring Boot 3.3 • PostgreSQL 18</span>
          </div>
        </div>
      </footer>

      {/* Application Submission Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-300 rounded-xl p-6 max-w-lg w-full shadow-xl relative max-h-[90vh] overflow-y-auto text-left">
            {submissionSuccess ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">Application Dispatched to Department!</h3>
                <p className="text-xs text-slate-600">
                  Your application has been received, transformed, and dispatched via the <strong>UNIGOV Interoperability Gateway</strong>.
                </p>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">UNIGOV Tracking Number:</span>
                    <strong className="text-blue-950 font-mono">{submissionSuccess.trackingNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department External Ref:</span>
                    <strong className="text-slate-900 font-mono">{submissionSuccess.departmentRefNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination Department:</span>
                    <strong className="text-slate-800">{submissionSuccess.department}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <strong className="text-emerald-700 font-semibold">{submissionSuccess.status}</strong>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedService(null)}
                  className="w-full py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
                >
                  Return to Portal
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-bold text-slate-950">{selectedService.title}</h3>
                    <p className="text-xs text-slate-500">{selectedService.department}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                    SLA: {selectedService.processingDays} Days
                  </span>
                </div>

                {/* Pre-populated citizen identity banner */}
                <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-blue-950 font-semibold mb-1">
                    <ShieldCheck className="w-4 h-4 text-blue-800" />
                    <span>Auto-Populated from UNIGOV Profile (Zero Redundant KYC)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>Applicant: <strong>{currentUser?.fullName}</strong></div>
                    <div>Citizen ID: <strong className="font-mono">{currentUser?.citizenId}</strong></div>
                    <div>State: <strong>{currentUser?.state}</strong></div>
                    <div>Phone: <strong>{currentUser?.phone}</strong></div>
                  </div>
                </div>

                {/* Specific details */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Application Specific Metadata / Details
                  </label>
                  <textarea
                    rows={3}
                    value={applicationFormData}
                    onChange={(e) => setApplicationFormData(e.target.value)}
                    placeholder='e.g. {"purpose": "College Scholarship", "annualIncome": "180000"}'
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Remarks / Specific Instructions for Department
                  </label>
                  <input
                    type="text"
                    value={applicationRemarks}
                    onChange={(e) => setApplicationRemarks(e.target.value)}
                    placeholder="e.g. Expedited processing requested"
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  Fee: <strong>{selectedService.fee === 0 ? 'FREE' : `₹${selectedService.fee}`}</strong> • Dispatch Gateway: <strong>UNIGOV Canonical Adapter</strong>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingApp}
                    className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    {submittingApp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-300 rounded-xl p-6 max-w-lg w-full shadow-xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-blue-900" />
                <h3 className="text-base font-bold text-slate-950">Interoperability Gateway Payload</h3>
              </div>
              <span className="font-mono text-xs text-blue-950 font-bold">{inspectApp.trackingNumber}</span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              This payload demonstrates canonical-to-legacy schema transformation under the SIH26129 interoperability specification:
            </p>

            <pre className="p-3.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60 mb-4">
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
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
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
