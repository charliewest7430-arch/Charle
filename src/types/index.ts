export interface Lead {
  id: string;
  source: string;
  businessName: string;
  category: string;
  location: string;
  website?: string;
  email?: string;
  phone?: string;
  description?: string;
  score?: number;
  scoreReason?: string;
  opportunity?: string;
  suggestedApproach?: string;
  aiPowered?: boolean;
}

export interface Job {
  id: string;
  source: string;
  title: string;
  company: string;
  location: string;
  remote: string;
  jobType: string;
  description: string;
  skills: string;
  applicationUrl: string;
  postedAt: string;
  matchScore?: number;
  matchReason?: string;
  strengths?: string[];
  gaps?: string[];
  applicationTip?: string;
  aiPowered?: boolean;
}

export interface SavedLead {
  id: string; // Firestore doc ID
  uid: string;
  leadId: string;
  businessName: string;
  category: string;
  location: string;
  website?: string;
  email?: string;
  phone?: string;
  description?: string;
  score?: number;
  scoreReason?: string;
  opportunity?: string;
  suggestedApproach?: string;
  savedAt: string;
}

export interface SavedJob {
  id: string; // Firestore doc ID
  uid: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  remote: string;
  jobType: string;
  description: string;
  skills: string;
  applicationUrl: string;
  postedAt: string;
  matchScore?: number;
  matchReason?: string;
  savedAt: string;
}

export interface FreelancerProfile {
  uid: string;
  skills: string;
  category: string;
  experienceLevel: string;
  preferredLocations: string;
  remotePreference: string;
  bio: string;
  updatedAt?: string;
}

export interface UserAccount {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SearchQuery {
  id?: string;
  uid: string;
  type: 'lead' | 'job';
  query: string;
  filters: Record<string, any>;
  createdAt: string;
}
