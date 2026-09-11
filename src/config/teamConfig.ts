export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  badge: string;
  photoUrl: string;
  initials: string;
  position: 'center' | 'left' | 'right';
  order: number;
  accentColor: string;
  bio: string;
  linkedin?: string;
  github?: string;
}

export const teamConfig = {
  sectionTitle: "PRESENTING OUR TEAM",
  sectionSubtitle: "INNOVATION & ENTREPRENEURSHIP CELL • SIKSHA 'O' ANUSANDHAN",
  sectionDescription: "The student minds steering the startup ecosystem, venture mentorship, and entrepreneurial culture across campus.",
  
  // 10 Team Members structured as: 2 in the Center, 4 Flanking Left, 4 Flanking Right
  members: [
    // --- 2 CENTER CORE LEADS ---
    {
      id: "member-lead-1",
      name: "Rohit Kumar",
      role: "Convenor & President",
      department: "Executive Leadership",
      badge: "CORE LEAD",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      initials: "RK",
      position: "center",
      order: 1,
      accentColor: "#c084fc",
      bio: "Spearheading venture incubation, startup strategy, and institutional ecosystem growth.",
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    },
    {
      id: "member-lead-2",
      name: "Priya Sharma",
      role: "Co-Convenor & VP",
      department: "Operations & Alliances",
      badge: "CORE LEAD",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
      initials: "PS",
      position: "center",
      order: 2,
      accentColor: "#d8b4fe",
      bio: "Driving inter-department synergy, university partnerships, and high-impact founder initiatives.",
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    },

    // --- 4 LEFT FLANKING MEMBERS (Tech, Design, PR, Content) ---
    {
      id: "member-left-1",
      name: "Sujay Patel",
      role: "Head of Tech & Dev",
      department: "Engineering Lab",
      badge: "DEV CORE",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
      initials: "SP",
      position: "left",
      order: 3,
      accentColor: "#a855f7",
      bio: "Building robust web platforms, automated hackathon portals, and digital infrastructure.",
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    },
    {
      id: "member-left-2",
      name: "Aarav Mehta",
      role: "Head of UI/UX & Design",
      department: "Brand & Creative",
      badge: "DESIGN",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
      initials: "AM",
      position: "left",
      order: 4,
      accentColor: "#c084fc",
      bio: "Crafting bold visual identities, intuitive user journeys, and collegiate design systems.",
      linkedin: "https://linkedin.com"
    },
    {
      id: "member-left-3",
      name: "Sneha Roy",
      role: "Head of PR & Relations",
      department: "Corporate & Campus",
      badge: "CRISIS PR",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80",
      initials: "SR",
      position: "left",
      order: 5,
      accentColor: "#e9d5ff",
      bio: "Managing institutional partnerships, crisis defense, and campus media outreach.",
      linkedin: "https://linkedin.com"
    },
    {
      id: "member-left-4",
      name: "Vikram Aditya",
      role: "Head of Content",
      department: "Editorial & Copy",
      badge: "CONTENT",
      photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
      initials: "VA",
      position: "left",
      order: 6,
      accentColor: "#a855f7",
      bio: "Scripting viral storytelling, founder narratives, and investor pitch documentation.",
      linkedin: "https://linkedin.com"
    },

    // --- 4 RIGHT FLANKING MEMBERS (Marketing, Media, Venture, Operations) ---
    {
      id: "member-right-1",
      name: "Ananya Sen",
      role: "Head of Growth & Mktg",
      department: "Marketing Hub",
      badge: "GROWTH",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
      initials: "AS",
      position: "right",
      order: 7,
      accentColor: "#c084fc",
      bio: "Scaling campus buzz, guerrilla campaigns, and orientation turnout to new heights.",
      linkedin: "https://linkedin.com"
    },
    {
      id: "member-right-2",
      name: "Rohan Verma",
      role: "Head of Media & Prod",
      department: "Video & Media",
      badge: "MEDIA",
      photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
      initials: "RV",
      position: "right",
      order: 8,
      accentColor: "#d8b4fe",
      bio: "Directing cinematic teasers, event aftermovies, and viral video reels.",
      linkedin: "https://linkedin.com"
    },
    {
      id: "member-right-3",
      name: "Ishaan Gupta",
      role: "Head of Venture & Fund",
      department: "Investor Treasury",
      badge: "VENTURE",
      photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80",
      initials: "IG",
      position: "right",
      order: 9,
      accentColor: "#e9d5ff",
      bio: "Connecting student ventures with angel syndicates, grant pools, and seed incubators.",
      linkedin: "https://linkedin.com"
    },
    {
      id: "member-right-4",
      name: "Tanya Joshi",
      role: "Head of Operations",
      department: "Events & Logistics",
      badge: "OPERATIONS",
      photoUrl: "https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=500&auto=format&fit=crop&q=80",
      initials: "TJ",
      position: "right",
      order: 10,
      accentColor: "#a855f7",
      bio: "Seamless execution of pitch brawls, hackathons, and multi-stage university summits.",
      linkedin: "https://linkedin.com"
    }
  ] as TeamMember[]
};
