import React, { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './lib/firebase';
import { handleFirestoreError, OperationType } from './lib/firestoreErrors';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Lead, Job, SavedLead, SavedJob } from './types';

// Layout & Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { AuthModal } from './components/auth/AuthModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadFinderPage } from './pages/LeadFinderPage';
import { JobFinderPage } from './pages/JobFinderPage';
import { SavedLeadsPage } from './pages/SavedLeadsPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { ProfilePage } from './pages/ProfilePage';
import { DataSourcesPage } from './pages/DataSourcesPage';

const MainApp: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Firestore sync state
  const [savedLeads, setSavedLeads] = useState<SavedLead[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  // When user logs in and was on landing, switch to dashboard
  useEffect(() => {
    if (user && currentPage === 'landing') {
      setCurrentPage('dashboard');
    } else if (!user && currentPage === 'dashboard') {
      setCurrentPage('landing');
    }
  }, [user]);

  // Sync Saved Leads from Firestore
  useEffect(() => {
    if (!user) {
      setSavedLeads([]);
      return;
    }

    const q = query(collection(db, 'savedLeads'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: SavedLead[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setSavedLeads(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'savedLeads');
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Sync Saved Jobs from Firestore
  useEffect(() => {
    if (!user) {
      setSavedJobs([]);
      return;
    }

    const q = query(collection(db, 'savedJobs'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: SavedJob[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setSavedJobs(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'savedJobs');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const savedLeadIds = useMemo(
    () => new Set(savedLeads.map((s) => s.leadId)),
    [savedLeads]
  );

  const savedJobIds = useMemo(
    () => new Set(savedJobs.map((s) => s.jobId)),
    [savedJobs]
  );

  // Toggle Save Lead
  const handleToggleSaveLead = async (lead: Lead) => {
    if (!user) {
      setAuthModalMode('signup');
      setAuthModalOpen(true);
      return;
    }

    const cleanLeadId = lead.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const docId = `${user.uid}_${cleanLeadId}`;
    const docRef = doc(db, 'savedLeads', docId);

    if (savedLeadIds.has(lead.id)) {
      try {
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `savedLeads/${docId}`);
      }
    } else {
      const payload: Omit<SavedLead, 'id'> = {
        uid: user.uid,
        leadId: lead.id,
        businessName: lead.businessName,
        category: lead.category,
        location: lead.location,
        website: lead.website || '',
        email: lead.email || '',
        phone: lead.phone || '',
        description: lead.description || '',
        score: lead.score ?? 70,
        scoreReason: lead.scoreReason || '',
        opportunity: lead.opportunity || '',
        suggestedApproach: lead.suggestedApproach || '',
        savedAt: new Date().toISOString(),
      };
      try {
        await setDoc(docRef, payload);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `savedLeads/${docId}`);
      }
    }
  };

  // Toggle Save Job
  const handleToggleSaveJob = async (job: Job) => {
    if (!user) {
      setAuthModalMode('signup');
      setAuthModalOpen(true);
      return;
    }

    const cleanJobId = job.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const docId = `${user.uid}_${cleanJobId}`;
    const docRef = doc(db, 'savedJobs', docId);

    if (savedJobIds.has(job.id)) {
      try {
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `savedJobs/${docId}`);
      }
    } else {
      const payload: Omit<SavedJob, 'id'> = {
        uid: user.uid,
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        remote: job.remote,
        jobType: job.jobType,
        description: (job.description || '').slice(0, 4000),
        skills: job.skills,
        applicationUrl: job.applicationUrl,
        postedAt: job.postedAt || 'Recent',
        matchScore: job.matchScore ?? 80,
        matchReason: job.matchReason || '',
        savedAt: new Date().toISOString(),
      };
      try {
        await setDoc(docRef, payload);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `savedJobs/${docId}`);
      }
    }
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleNavigate = (page: string) => {
    // If attempting to visit protected pages while logged out, show signup modal
    if (!user && (page === 'dashboard' || page === 'saved-leads' || page === 'saved-jobs' || page === 'profile')) {
      handleOpenAuth('signup');
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Page Content
  const renderContent = () => {
    if (currentPage === 'landing' && !user) {
      return (
        <LandingPage
          onNavigate={handleNavigate}
          onOpenAuth={handleOpenAuth}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            savedLeads={savedLeads}
            savedJobs={savedJobs}
            totalLeadsSearchedCount={savedLeads.length > 0 ? savedLeads.length * 4 : 0}
            totalJobsSearchedCount={savedJobs.length > 0 ? savedJobs.length * 3 : 0}
          />
        );
      case 'leads':
        return (
          <LeadFinderPage
            onToggleSaveLead={handleToggleSaveLead}
            savedLeadIds={savedLeadIds}
          />
        );
      case 'jobs':
        return (
          <JobFinderPage
            onToggleSaveJob={handleToggleSaveJob}
            savedJobIds={savedJobIds}
          />
        );
      case 'saved-leads':
        return (
          <SavedLeadsPage
            savedLeads={savedLeads}
            onRemoveSavedLead={(leadId) => {
              const item = savedLeads.find((s) => s.leadId === leadId);
              if (item) {
                handleToggleSaveLead({
                  id: item.leadId,
                  source: 'Saved',
                  businessName: item.businessName,
                  category: item.category,
                  location: item.location,
                });
              }
            }}
            onNavigate={handleNavigate}
          />
        );
      case 'saved-jobs':
        return (
          <SavedJobsPage
            savedJobs={savedJobs}
            onRemoveSavedJob={(jobId) => {
              const item = savedJobs.find((s) => s.jobId === jobId);
              if (item) {
                handleToggleSaveJob({
                  id: item.jobId,
                  source: 'Saved',
                  title: item.title,
                  company: item.company,
                  location: item.location,
                  remote: item.remote,
                  jobType: item.jobType,
                  description: item.description,
                  skills: item.skills,
                  applicationUrl: item.applicationUrl,
                  postedAt: item.postedAt,
                });
              }
            }}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return <ProfilePage />;
      case 'sources':
        return <DataSourcesPage />;
      default:
        return (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        );
    }
  };

  const showSidebar = user || (currentPage !== 'landing');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar (visible when logged in or on tool pages) */}
        {showSidebar && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            savedLeadsCount={savedLeads.length}
            savedJobsCount={savedJobs.length}
          />
        )}

        {/* Page Content Body */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8 ${currentPage === 'landing' && !user ? 'p-0 sm:p-0 lg:p-0' : ''}`}>
          {renderContent()}
        </main>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <MobileNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
          savedTotalCount={savedLeads.length + savedJobs.length}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
