import type { StartupOption, StageConfig, BuildingLocation } from '../types/game';

export const ecellConfig = {
  clubName: "INNOVATION & ENTREPRENEURSHIP CELL",
  clubShortName: "IEC SOA",
  tagline: "DRIVING IDEAS TOWARDS IMPACT",
  subtitle: "From Sparks to Stars: IEC Welcomes You",
  orientationEvent: "IEC SOA ORIENTATION 2026",
  motto: "Empowering students to transform ideas into impactful ventures.",
  ctaHeading: "Ready to Spark Your Venture?",
  ctaSubheading: "IEC SOA Welcomes You. Don't build alone.",
  qrCodeLink: "https://iecsoa.com",
  qrPlaceholderText: "Scan to Join IEC SOA or Pitch Your Idea",

  // Starting stats
  initialStats: {
    score: 50,
    money: 10000,
    time: 30,
    energy: 100,
    reputation: 50,
    users: 0,
  },

  initialVerticals: {
    mentorship: 40,
    product: 40,
    brand: 40,
    content: 40,
    marketing: 40,
    media: 30,
    pr: 30,
    funding: 25,
  },

  buildingLocations: [
    {
      id: 'stage-mentorship',
      name: 'Mentorship Center',
      sectorCode: 'ROOM-01',
      sectorTitle: 'RESEARCH & MENTORSHIP',
      tacticalDesc: 'Validation & Market Intel Matrix',
      badge: 'MENTORSHIP',
      x: 230,
      y: 590,
      doorX: 440,
      doorY: 590,
      color: '#3B82F6',
      secondaryColor: '#60A5FA',
      icon: '👩‍💼'
    },
    {
      id: 'stage-technical',
      name: 'Tech & Dev Lab',
      sectorCode: 'ROOM-02',
      sectorTitle: 'DEV & ARCHITECTURE',
      tacticalDesc: 'Architecture & Scalability Forge',
      badge: 'DEV-CORE',
      x: 860,
      y: 200,
      doorX: 860,
      doorY: 340,
      color: '#06B6D4',
      secondaryColor: '#22D3EE',
      icon: '👨‍💻'
    },
    {
      id: 'stage-design',
      name: 'Design Studio',
      sectorCode: 'ROOM-03',
      sectorTitle: 'UI & BRAND STUDIO',
      tacticalDesc: 'Visual Identity & Friction Matrix',
      badge: 'DESIGN',
      x: 1540,
      y: 200,
      doorX: 1540,
      doorY: 340,
      color: '#A855F7',
      secondaryColor: '#C084FC',
      icon: '🎨'
    },
    {
      id: 'stage-content',
      name: 'Content Room',
      sectorCode: 'ROOM-04',
      sectorTitle: 'COPY & MESSAGING',
      tacticalDesc: 'Viral Messaging & Copy Hook Station',
      badge: 'CONTENT',
      x: 2170,
      y: 590,
      doorX: 1960,
      doorY: 590,
      color: '#F59E0B',
      secondaryColor: '#FBBF24',
      icon: '✍️'
    },
    {
      id: 'stage-marketing',
      name: 'Marketing Hub',
      sectorCode: 'ROOM-05',
      sectorTitle: 'GROWTH & TRACTION',
      tacticalDesc: 'User Acquisition Radar Array',
      badge: 'GROWTH',
      x: 2170,
      y: 1010,
      doorX: 1960,
      doorY: 1010,
      color: '#10B981',
      secondaryColor: '#34D399',
      icon: '📈'
    },
    {
      id: 'stage-media',
      name: 'Media Studio',
      sectorCode: 'ROOM-06',
      sectorTitle: 'VIDEO PRODUCTION',
      tacticalDesc: 'High-Impact Brand Production',
      badge: 'MEDIA',
      x: 1540,
      y: 1400,
      doorX: 1540,
      doorY: 1260,
      color: '#EC4899',
      secondaryColor: '#F472B6',
      icon: '🎬'
    },
    {
      id: 'stage-pr',
      name: 'PR War Room',
      sectorCode: 'ROOM-07',
      sectorTitle: 'CRISIS PR & DEFENSE',
      tacticalDesc: 'Shield Protocol & Threat Remediation',
      badge: 'CRISIS',
      x: 860,
      y: 1400,
      doorX: 860,
      doorY: 1260,
      color: '#F43F5E',
      secondaryColor: '#FB7185',
      icon: '🚨'
    },
    {
      id: 'stage-sponsorship',
      name: 'Investor Suite',
      sectorCode: 'ROOM-08',
      sectorTitle: 'VENTURE TREASURY',
      tacticalDesc: 'Capital Runway & Equity Term Sheets',
      badge: 'INVESTOR',
      x: 230,
      y: 1010,
      doorX: 440,
      doorY: 1010,
      color: '#EAB308',
      secondaryColor: '#FDE047',
      icon: '🤝'
    },
    {
      id: 'stage-pitch',
      name: 'Pitch Arena',
      sectorCode: 'ROOM-09',
      sectorTitle: 'GRAND CENTRAL STAGE',
      tacticalDesc: 'The Ultimate VC Ecosystem Finale',
      badge: 'SHOWDOWN',
      x: 1200,
      y: 760,
      doorX: 1200,
      doorY: 600,
      color: '#00F0FF',
      secondaryColor: '#38BDF8',
      icon: '🏛️'
    },
  ] as BuildingLocation[],


  startups: [
    {
      id: "plantspeak",
      name: "PlantSpeak",
      tagline: "AI Plant Health Assistant",
      description: "App that scans sick hostel plants & diagnoses diseases using computer vision.",
      icon: "🌱",
      category: "AI / Agritech",
      difficulty: "MEDIUM",
      strengths: ["Tech Moat", "Viral Demo"],
      weaknesses: ["AI Accuracy Needs Work"],
      initialPerk: "+10 Tech Moat",
      brandingOptions: [
        {
          id: "botanical-zen",
          name: "Eco-Modern Zen",
          stylePreview: "from-emerald-500 to-teal-700",
          description: "Fresh emerald fonts.",
          brandDelta: 10,
          scoreDelta: -5,
          visualPreview: {
            primaryColor: "#10B981",
            accentColor: "#059669",
            vibe: "Clean & Fresh",
            fontStyle: "Modern Sans"
          }
        },
        {
          id: "cyber-botany",
          name: "Cyber Neon",
          stylePreview: "from-cyan-500 to-violet-600",
          description: "Dark mode neon cyan.",
          brandDelta: 5,
          scoreDelta: -8,
          visualPreview: {
            primaryColor: "#06B6D4",
            accentColor: "#8B5CF6",
            vibe: "Sci-Fi",
            fontStyle: "Monospace"
          }
        },
        {
          id: "corporate-sterile",
          name: "Boring Corporate",
          stylePreview: "from-slate-600 to-gray-800",
          description: "Cold gray enterprise look.",
          brandDelta: -15,
          scoreDelta: -12,
          visualPreview: {
            primaryColor: "#64748B",
            accentColor: "#334155",
            vibe: "Sterile",
            fontStyle: "Times Serif"
          }
        }
      ],
      taglineOptions: [
        {
          id: "punchy-plant",
          text: "“Your plant knows it's dying. Now you can too.”",
          style: "Punchy humor.",
          attentionDelta: 10,
          scoreDelta: -6,
          reactionText: "Got chuckles, but server crashed under initial load!"
        },
        {
          id: "generic-plant",
          text: "“AI plant health monitoring system.”",
          style: "Standard phrase.",
          attentionDelta: 5,
          scoreDelta: -8,
          reactionText: "Zero clicks. Ignored by students."
        },
        {
          id: "overly-academic-plant",
          text: "“Deep neural spectral botanical analytics.”",
          style: "Confusing academic jargon.",
          attentionDelta: -10,
          scoreDelta: -12,
          reactionText: "Students closed the tab immediately."
        }
      ],
      crisisType: {
        title: "False Diagnosis Drama!",
        description: "PlantSpeak misdiagnosed rare hostel orchids as weeds! Angry seniors are demanding refunds.",
        source: "Hostel Meme Page",
        consequences: {
          choiceA: {
            label: "Argue & defend the AI",
            repDelta: -25,
            text: "You sounded arrogant. Campus meme pages roasted you."
          },
          choiceB: {
            label: "Stay silent and hide",
            repDelta: -20,
            userDelta: -150,
            text: "Silence confirmed guilt. Mass uninstalls."
          },
          choiceC: {
            label: "Apologize and promise update",
            repDelta: -15,
            text: "Apology accepted, but as a solo founder you have no time to fix the model!"
          }
        }
      }
    },
    {
      id: "campuseats",
      name: "CampusEats",
      tagline: "15-Min Hostel Food Delivery",
      description: "Midnight canteen snacks & parathas delivered straight to hostel rooms.",
      icon: "🍔",
      category: "Logistics",
      difficulty: "EASY",
      strengths: ["Huge Demand", "Word of Mouth"],
      weaknesses: ["Thin Margins"],
      initialPerk: "+150 Initial Users",
      brandingOptions: [
        {
          id: "crave-amber",
          name: "Late-Night Neon",
          stylePreview: "from-amber-500 to-rose-600",
          description: "Fiery warm amber speed vibe.",
          brandDelta: 10,
          scoreDelta: -5,
          visualPreview: {
            primaryColor: "#F59E0B",
            accentColor: "#F43F5E",
            vibe: "Craving",
            fontStyle: "Bold Punchy"
          }
        },
        {
          id: "budget-blue",
          name: "Utility Blue",
          stylePreview: "from-blue-600 to-indigo-800",
          description: "Looks like a courier portal.",
          brandDelta: 5,
          scoreDelta: -8,
          visualPreview: {
            primaryColor: "#2563EB",
            accentColor: "#1E40AF",
            vibe: "Courier",
            fontStyle: "Basic Sans"
          }
        },
        {
          id: "luxury-gold",
          name: "Haute Cuisine Gold",
          stylePreview: "from-zinc-800 to-amber-200",
          description: "Overpriced fine-dining aesthetic.",
          brandDelta: -15,
          scoreDelta: -12,
          visualPreview: {
            primaryColor: "#27272A",
            accentColor: "#FDE68A",
            vibe: "Overpriced",
            fontStyle: "Fancy Serif"
          }
        }
      ],
      taglineOptions: [
        {
          id: "punchy-eats",
          text: "“Maggie at 3 AM shouldn't cost your kidney.”",
          style: "Relatable student pain point.",
          attentionDelta: 10,
          scoreDelta: -6,
          reactionText: "Orders flooded in, but canteen ran out of gas!"
        },
        {
          id: "generic-eats",
          text: "“Campus food whenever you crave it.”",
          style: "Safe and ordinary.",
          attentionDelta: 5,
          scoreDelta: -8,
          reactionText: "Slow traction. Barely noticed."
        },
        {
          id: "tech-eats",
          text: "“Decentralized caloric fulfillment protocol.”",
          style: "Absurd engineering jargon.",
          attentionDelta: -10,
          scoreDelta: -12,
          reactionText: "'Bro just give me my samosa'."
        }
      ],
      crisisType: {
        title: "Cold Food Strike!",
        description: "Hostel gates locked down. 80 orders arrived ice cold and late. Furious student boycott!",
        source: "Campus Reddit",
        consequences: {
          choiceA: {
            label: "Blame the delivery runners",
            repDelta: -25,
            text: "Delivery runners quit. Operations collapsed."
          },
          choiceB: {
            label: "Mute your phone and wait it out",
            repDelta: -20,
            userDelta: -180,
            text: "Students filed complaints with campus administration."
          },
          choiceC: {
            label: "Full refund from your own pocket",
            repDelta: -15,
            text: "You refunded everyone, draining your personal bank account to ₹0!"
          }
        }
      }
    },
    {
      id: "skillswap",
      name: "SkillSwap",
      tagline: "Student Skill Barter Network",
      description: "Swap skills without money: teach Python to learn Guitar or Figma.",
      icon: "⚡",
      category: "EdTech",
      difficulty: "HARD",
      strengths: ["Zero Cost", "High Loyalty"],
      weaknesses: ["Cold-Start Problem"],
      initialPerk: "+15 Student Trust",
      brandingOptions: [
        {
          id: "retro-arcade",
          name: "Skill Arcade",
          stylePreview: "from-purple-600 to-pink-500",
          description: "Gamified purple with XP badges.",
          brandDelta: 10,
          scoreDelta: -5,
          visualPreview: {
            primaryColor: "#9333EA",
            accentColor: "#EC4899",
            vibe: "Gamified",
            fontStyle: "Geometric Sans"
          }
        },
        {
          id: "study-slate",
          name: "Campus Moodle",
          stylePreview: "from-cyan-600 to-blue-700",
          description: "Boring homework portal look.",
          brandDelta: 5,
          scoreDelta: -8,
          visualPreview: {
            primaryColor: "#0891B2",
            accentColor: "#1D4ED8",
            vibe: "Academic",
            fontStyle: "System Font"
          }
        },
        {
          id: "gothic-ivy",
          name: "Ivy Crest",
          stylePreview: "from-stone-700 to-amber-950",
          description: "Old-world pretentious crests.",
          brandDelta: -15,
          scoreDelta: -12,
          visualPreview: {
            primaryColor: "#44403C",
            accentColor: "#78350F",
            vibe: "Stuffy",
            fontStyle: "Old English"
          }
        }
      ],
      taglineOptions: [
        {
          id: "punchy-swap",
          text: "“Teach Python. Learn Guitar. Pay ₹0.”",
          style: "Crisp zero-cost hook.",
          attentionDelta: 10,
          scoreDelta: -6,
          reactionText: "Lots of clicks, but users flaked after 1 day!"
        },
        {
          id: "generic-swap",
          text: "“Exchange skills with college peers.”",
          style: "Noticeboard flyer style.",
          attentionDelta: 5,
          scoreDelta: -8,
          reactionText: "Low signup conversion."
        },
        {
          id: "complex-swap",
          text: "“Decentralized cognitive barter.”",
          style: "PhD defense jargon.",
          attentionDelta: -10,
          scoreDelta: -12,
          reactionText: "Nobody understood it."
        }
      ],
      crisisType: {
        title: "Ghost Tutor Scandal!",
        description: "A student received 5 hours of Math tutoring, then ghosted the tutor. Scathing Reddit post!",
        source: "Campus Confessions",
        consequences: {
          choiceA: {
            label: "Ban the victim for complaining",
            repDelta: -25,
            text: "Community revolt! You were labeled a bad founder."
          },
          choiceB: {
            label: "Reply: 'It is peer-to-peer, deal with it'",
            repDelta: -20,
            userDelta: -120,
            text: "Trust shattered. Daily active users dropped to 0."
          },
          choiceC: {
            label: "Try to teach the class yourself",
            repDelta: -15,
            text: "You tried teaching Guitar yourself, failed midterm exam, and burnt out!"
          }
        }
      }
    }
  ] as StartupOption[],

  stages: [
    {
      id: "stage-mentorship",
      index: 0,
      departmentKey: "mentorship",
      departmentName: "Research & Mentorship",
      mentorName: "Mentorship Team",
      mentorRole: "E-Cell Mentorship Team",
      mentorAvatar: "👩‍💼",
      locationName: "Mentorship Center",
      mentorDialogue: "Can a solo student really validate market demand without falling for polite lies?",
      mentorHint: "Solo founders miss 80% of blindspots by confusing polite compliments with real demand.",
      question: "How to validate real student demand?",
      customStageType: "standard",
      choices: [
        {
          id: "talk-users",
          title: "WhatsApp Google Form Survey",
          description: "Ask classmates: 'Would you use this app?'",
          isCorrect: false,
          costMoney: 0,
          costTime: 2,
          costEnergy: 15,
          deltas: { score: -15, mentorship: 10 },
          outcomeNarrative: "92% answered 'Yes! Love it!'. But when launched, exactly 0 people actually downloaded it. Polite survey answers are fatal false positives!",
          ecellTakeaway: "Never ask people if they *would* use something. Friends lie to be polite; validate through upfront commitment or pre-orders."
        },
        {
          id: "concierge-mvp",
          title: "Pre-Sell for ₹50 Upfront",
          description: "Get 10 paid cash commitments before coding",
          isCorrect: true,
          costMoney: 200,
          costTime: 3,
          costEnergy: 20,
          deltas: { score: 20, mentorship: 30 },
          outcomeNarrative: "Brilliant! 7 students handed over cash immediately. You proved customers will pay real money before you wrote a single line of code!",
          ecellTakeaway: "Real validation is currency or commitment, not compliments. If they won't pay ₹50 now, they won't pay later."
        },
        {
          id: "skip-research",
          title: "Build in Stealth Mode",
          description: "Keep it 100% secret until launch",
          isCorrect: false,
          costMoney: 0,
          costTime: 5,
          costEnergy: 25,
          deltas: { score: -15, mentorship: -20 },
          outcomeNarrative: "You spent 2 months coding in hiding. When you finally revealed it, students were indifferent because it solved the wrong problem.",
          ecellTakeaway: "Nobody steals unvalidated ideas. Founders who hide in stealth build elaborate solutions for problems nobody has."
        }
      ]
    },
    {
      id: "stage-technical",
      index: 1,
      departmentKey: "product",
      departmentName: "Tech & Dev Lab",
      mentorName: "Tech & Dev Team",
      mentorRole: "E-Cell Technical Team",
      mentorAvatar: "👨‍💻",
      locationName: "Tech & Dev Lab",
      mentorDialogue: "Coding backend, frontend, database, and devops alone? Architecture decisions make or break you.",
      mentorHint: "Premature optimization and feature creep kill 90% of student tech startups before launch.",
      question: "How should you build your launch MVP?",
      customStageType: "standard",
      choices: [
        {
          id: "build-monolith",
          title: "Docker & Kubernetes Cluster",
          description: "Scale for 500k users on Day 1",
          isCorrect: false,
          costMoney: 3500,
          costTime: 8,
          costEnergy: 35,
          deltas: { score: -15, product: 10 },
          outcomeNarrative: "Premature optimization trap! You burned 5 weeks configuring cloud clusters for 1M users, emptying your budget before getting your first 10 users.",
          ecellTakeaway: "Premature optimization is fatal. Build simple monoliths first; scale cloud infra when you actually have traffic."
        },
        {
          id: "build-mvp",
          title: "Simple 1-Feature Web App",
          description: "Deliver core value in under 3 clicks",
          isCorrect: true,
          costMoney: 500,
          costTime: 3,
          costEnergy: 20,
          deltas: { score: 20, product: 35 },
          outcomeNarrative: "Nailed it! Shipped in 3 days. Users can complete their goal in 15 seconds with zero friction. Lightning fast iteration cycle!",
          ecellTakeaway: "An MVP is the simplest tool that delivers core value. Perfect one single user interaction before expanding."
        },
        {
          id: "feature-creep",
          title: "All-in-One 25-Feature App",
          description: "Add AI bot, crypto wallet & social feeds",
          isCorrect: false,
          costMoney: 2000,
          costTime: 7,
          costEnergy: 40,
          deltas: { score: -15, product: 5 },
          outcomeNarrative: "Feature creep nightmare! The app crashed on 60% of phones, spaghetti bugs everywhere, and users were baffled by the cluttered UI.",
          ecellTakeaway: "If you try to build everything on Day 1, you build nothing well. Win one specific use-case first."
        }
      ]
    },
    {
      id: "stage-design",
      index: 2,
      departmentKey: "brand",
      departmentName: "Design Studio",
      mentorName: "Design & UX Team",
      mentorRole: "E-Cell Design Team",
      mentorAvatar: "🎨",
      locationName: "Design Studio",
      mentorDialogue: "Designing UI without a UX team? Poor design causes 70% immediate app drop-off.",
      mentorHint: "UX is about eliminating friction, not showing off flashy graphic animations.",
      question: "Best onboarding flow for students?",
      customStageType: "standard",
      choices: [
        {
          id: "cinematic-intro",
          title: "30-Second 3D Video Intro",
          description: "Showcase startup vision & mascot",
          isCorrect: false,
          costMoney: 1000,
          costTime: 4,
          costEnergy: 20,
          deltas: { score: -15, brand: 5 },
          outcomeNarrative: "Vanity design trap! 80% of hostel students closed the app before the animation even finished loading on campus Wi-Fi.",
          ecellTakeaway: "UX is about reducing time-to-value. Never put unskippable vanity animations between a customer and their goal."
        },
        {
          id: "heavy-profile",
          title: "8-Step Mandatory Sign-Up",
          description: "Ask branch, CGPA & hostel ID first",
          isCorrect: false,
          costMoney: 0,
          costTime: 3,
          costEnergy: 15,
          deltas: { score: -15, brand: -10 },
          outcomeNarrative: "Friction overload! 85% drop-off at Step 3. Students felt like they were filling out a university exam form and uninstalled.",
          ecellTakeaway: "Delay registration until absolutely necessary. Let users experience your 'Aha!' moment before demanding personal data."
        },
        {
          id: "guest-mode-frictionless",
          title: "Instant Guest Mode",
          description: "Explore first, sign in at checkout",
          isCorrect: true,
          costMoney: 300,
          costTime: 2,
          costEnergy: 15,
          deltas: { score: 20, brand: 30 },
          outcomeNarrative: "Masterclass UX! Conversion rate jumped by 340%. Students experienced the core value in under 5 seconds with zero hesitation.",
          ecellTakeaway: "Frictionless onboarding creates immediate delight. Provide instant value first; request signups second."
        }
      ]
    },
    {
      id: "stage-content",
      index: 3,
      departmentKey: "content",
      departmentName: "Content Room",
      mentorName: "Content & Copy Team",
      mentorRole: "E-Cell Content Team",
      mentorAvatar: "✍️",
      locationName: "Content Room",
      mentorDialogue: "Attention spans on campus are under 3 seconds. Solo founders write for themselves, not the customer.",
      mentorHint: "The best copy doesn't sound intellectual; it sounds like your customer's own inner thoughts.",
      question: "Which promo headline converts best?",
      customStageType: "standard",
      choices: [
        {
          id: "corporate-jargon",
          title: "“Synergizing Cognitive Solutions”",
          description: "Sounds high-tech, academic & VC-ready",
          isCorrect: false,
          costMoney: 0,
          costTime: 2,
          costEnergy: 10,
          deltas: { score: -15, content: -10 },
          outcomeNarrative: "Zero conversions. Students scrolled past thinking it was a university research notice. Nobody understood what it did.",
          ecellTakeaway: "If a 12-year-old can't understand what you do in 5 seconds, your copywriting has failed."
        },
        {
          id: "visceral-pain-hook",
          title: "“Hot Parathas in 12 Mins at MRP”",
          description: "Direct pain point, speed & pricing",
          isCorrect: true,
          costMoney: 100,
          costTime: 1,
          costEnergy: 10,
          deltas: { score: 20, content: 35 },
          outcomeNarrative: "Viral sensation! Screenshots were shared across 45 hostel WhatsApp groups. Clear, punchy, and impossible to misunderstand.",
          ecellTakeaway: "Great copywriting doesn't sound clever; it mirrors your customer's exact urgent pain point."
        },
        {
          id: "clickbait-lottery",
          title: "“Download to win an iPhone 16!”",
          description: "Free giveaway lottery bait",
          isCorrect: false,
          costMoney: 500,
          costTime: 2,
          costEnergy: 15,
          deltas: { score: -15, content: -5 },
          outcomeNarrative: "Gimmick failure! 400 freebie hunters downloaded the app, entered the fake contest, and uninstalled 10 minutes later. Zero real users.",
          ecellTakeaway: "Incentivized downloads are vanity metrics. Acquire users who want your product, not free lottery tickets."
        }
      ]
    },
    {
      id: "stage-marketing",
      index: 4,
      departmentKey: "marketing",
      departmentName: "Marketing Hub",
      mentorName: "Marketing & Growth Team",
      mentorRole: "E-Cell Marketing Team",
      mentorAvatar: "📈",
      locationName: "Marketing Hub",
      mentorDialogue: "You have limited runway cash! How will you get your first 500 loyal campus users?",
      mentorHint: "Paid ads without organic retention is pouring water into a bucket full of holes.",
      question: "Best way to get first 500 campus users?",
      customStageType: "standard",
      choices: [
        {
          id: "paid-meta-ads",
          title: "Burn ₹5,000 on Meta Ads",
          description: "Target campus radius on Instagram",
          isCorrect: false,
          costMoney: 5000,
          costTime: 3,
          costEnergy: 15,
          deltas: { score: -15, marketing: 10 },
          outcomeNarrative: "Ad money burn! Spent all ₹5,000 in 48 hours for 42 downloads (₹120/user). Zero campus community or organic sharing.",
          ecellTakeaway: "Paid ads before product-market fit burns money. Early campus startups need guerrilla hustle, not paid ads."
        },
        {
          id: "paper-posters-night",
          title: "Paste 2,000 Paper Flyers",
          description: "Cover hostel doors & walls at night",
          isCorrect: false,
          costMoney: 2000,
          costTime: 5,
          costEnergy: 30,
          deltas: { score: -15, marketing: 5 },
          outcomeNarrative: "Campus cleaners tore down 90% of posters before breakfast, and the dean summoned you for defacing college walls.",
          ecellTakeaway: "Passive paper flyers have a <0.1% conversion rate. Campus distribution requires live human interaction."
        },
        {
          id: "hostel-esports-trojan",
          title: "Sponsor Hostel BGMI Tourney",
          description: "Free samosas + view brackets on app",
          isCorrect: true,
          costMoney: 2500,
          costTime: 3,
          costEnergy: 25,
          deltas: { score: 20, marketing: 35 },
          outcomeNarrative: "Incredible growth! 480 energetic students downloaded the app live, and word-of-mouth spread organically across every hostel wing.",
          ecellTakeaway: "Piggyback on existing high-density gatherings. Create moments where using your app is natural, social, and fun."
        }
      ]
    },
    {
      id: "stage-media",
      index: 5,
      departmentKey: "media",
      departmentName: "Media Studio",
      mentorName: "Media & Production Team",
      mentorRole: "E-Cell Media Team",
      mentorAvatar: "🎬",
      locationName: "Media Studio",
      mentorDialogue: "Holding the camera, editing video, and acting alone? Content production can easily drain your entire runway.",
      mentorHint: "Authentic, relatable humor beats high-cost corporate video production every single time.",
      question: "Which video format converts students?",
      customStageType: "standard",
      choices: [
        {
          id: "relatable-skit-reel",
          title: "20-Second Hostel Skit Reel",
          description: "Relatable humor + quick problem fix",
          isCorrect: true,
          costMoney: 400,
          costTime: 2,
          costEnergy: 20,
          deltas: { score: 20, media: 35 },
          outcomeNarrative: "Viral gold! Shared by 12 campus meme pages, racking up 22,000 views organically. 380 direct signups in 3 hours!",
          ecellTakeaway: "Entertain first, educate second. The first 3 seconds must trigger immediate empathy or humor to stop the scroll."
        },
        {
          id: "founder-ego-documentary",
          title: "8-Minute Founder Documentary",
          description: "Talk about your life philosophy",
          isCorrect: false,
          costMoney: 1500,
          costTime: 6,
          costEnergy: 35,
          deltas: { score: -15, media: -5 },
          outcomeNarrative: "Average watch time was 4 seconds. Viewers commented 'Bro thinks he is Steve Jobs' and swiped away instantly.",
          ecellTakeaway: "Customers don't care about your personal backstory until you solve their problem. Make the customer the hero, not yourself."
        },
        {
          id: "corporate-3d-agency",
          title: "Hire ₹15,000 3D Render Agency",
          description: "Sterile corporate spinning spheres",
          isCorrect: false,
          costMoney: 8000,
          costTime: 7,
          costEnergy: 20,
          deltas: { score: -15, media: 10 },
          outcomeNarrative: "Wiped out your bank balance for a clinical video that felt like a life insurance ad. Students found it robotic and cringey.",
          ecellTakeaway: "Raw human authenticity beats slick production. Relatable student creators outperform sterile agencies 10-to-1."
        }
      ]
    },
    {
      id: "stage-pr",
      index: 6,
      departmentKey: "pr",
      departmentName: "PR War Room",
      mentorName: "PR & Crisis Team",
      mentorRole: "E-Cell PR Team",
      mentorAvatar: "🚨",
      locationName: "PR War Room",
      mentorDialogue: "🚨 EMERGENCY! Negative post blowing up on campus Reddit. Public relations tests your emotional discipline.",
      mentorHint: "Solo panic replies always make PR crises 10x worse. Transparency and restitution win trust.",
      question: "User tweeted your app stole ₹200. Your move?",
      customStageType: "standard",
      choices: [
        {
          id: "aggressive-legal-threat",
          title: "Threaten Defamation Lawsuit",
          description: "Blame Razorpay & demand delete",
          isCorrect: false,
          costMoney: 0,
          costTime: 1,
          costEnergy: 20,
          deltas: { score: -15, pr: -20 },
          outcomeNarrative: "The Streisand Effect! Outraged students rallied behind the user, dubbed you 'most arrogant founder', and app ratings dropped to 1.1 stars.",
          ecellTakeaway: "Never fight a customer in public. Even if technically correct, an aggressive company always loses the PR war."
        },
        {
          id: "delete-and-block",
          title: "Delete Comments & Block User",
          description: "Stay silent and hope it blows over",
          isCorrect: false,
          costMoney: 0,
          costTime: 1,
          costEnergy: 10,
          deltas: { score: -15, pr: -15 },
          outcomeNarrative: "The influencer posted: 'They blocked me! Confirmed scam!' Trust completely evaporated, causing mass uninstalls across all 6 hostels.",
          ecellTakeaway: "Censorship is kerosene on a PR fire. Silence is always interpreted as guilt."
        },
        {
          id: "radical-public-remedy",
          title: "Public Apology + 2x Refund (₹400)",
          description: "Instant UPI refund + hotfix post",
          isCorrect: true,
          costMoney: 400,
          costTime: 1,
          costEnergy: 15,
          deltas: { score: 20, pr: 35 },
          outcomeNarrative: "Masterclass in PR! The influencer replied: 'Respect! Fastest support on campus!' and became your most vocal champion.",
          ecellTakeaway: "A handled crisis creates more customer loyalty than never having a bug. Fast, humble, generous resolution wins every time."
        }
      ]
    },
    {
      id: "stage-sponsorship",
      index: 7,
      departmentKey: "funding",
      departmentName: "Investor Suite",
      mentorName: "Investor Relations Team",
      mentorRole: "E-Cell Venture Syndicate",
      mentorAvatar: "🤝",
      locationName: "Investor Suite",
      mentorDialogue: "Investors see you have momentum! But predatory term sheets can kill your company before you even start.",
      mentorHint: "Valuation is vanity; equity dilution and control clauses are sanity. Protect founder ownership!",
      question: "Which funding offer do you take?",
      customStageType: "standard",
      choices: [
        {
          id: "shark-dilution",
          title: "Shark Angel: ₹25L for 45% Equity",
          description: "Fast cash, massive dilution",
          isCorrect: false,
          costMoney: 0,
          costTime: 2,
          costEnergy: 15,
          deltas: { score: -15, funding: 10 },
          outcomeNarrative: "Predatory dilution trap! Giving away 45% in seed left zero equity for future VC rounds. Future investors refused to invest.",
          ecellTakeaway: "Never surrender more than 15-20% in an early seed round. Severe early dilution kills founder incentive and future funding."
        },
        {
          id: "iec-incubation-grant",
          title: "IEC Grant: ₹5L at 0% Equity",
          description: "Non-dilutive grant + campus mentors",
          isCorrect: true,
          costMoney: 0,
          costTime: 2,
          costEnergy: 15,
          deltas: { score: 20, funding: 40 },
          outcomeNarrative: "Masterstroke! You retained 100% ownership, gained top-tier mentors, and leveraged campus infrastructure to reach profitability.",
          ecellTakeaway: "Non-dilutive institutional grants give you maximum freedom to iterate without sharks breathing down your neck."
        },
        {
          id: "toxic-debt-clause",
          title: "Huge Valuation + Personal Guarantee",
          description: "Owe money personally if targets miss",
          isCorrect: false,
          costMoney: 0,
          costTime: 3,
          costEnergy: 25,
          deltas: { score: -15, funding: -10 },
          outcomeNarrative: "When exam season slowed growth, the investor called in the debt personally. You faced crippling financial distress.",
          ecellTakeaway: "Never sign personal guarantees or toxic downside liquidation preferences. Terms matter much more than headline valuation."
        }
      ]
    },
    {
      id: "stage-pitch",
      index: 8,
      departmentKey: "mentorship",
      departmentName: "Grand Pitch Arena",
      mentorName: "VC Judging Panel",
      mentorRole: "Angel & VC Syndicate",
      mentorAvatar: "🏛️",
      locationName: "Grand Pitch Arena",
      mentorDialogue: "The Grand Finale! Can an idea survive as a solo student project, or does it take an entire ecosystem?",
      mentorHint: "Startups are a team sport. An idea needs an entire ecosystem to scale.",
      customStageType: "standard"
    }
  ] as StageConfig[],

  marketingChannels: [
    {
      id: "insta-campaign",
      name: "Instagram Ads",
      cost: 5000,
      icon: "📱",
      reachMultiplier: 1.1,
      userYield: 80,
      description: "Burned ₹5k on Meta ads. Low conversion."
    },
    {
      id: "campus-ambassadors",
      name: "Try Campus Reps",
      cost: 4000,
      icon: "👥",
      reachMultiplier: 1.2,
      userYield: 90,
      description: "Recruited reps, but no team to manage them."
    },
    {
      id: "posters-stickers",
      name: "Print Posters Alone",
      cost: 2000,
      icon: "🪧",
      reachMultiplier: 1.05,
      userYield: 30,
      description: "Pasted posters alone at night. Security removed them."
    },
    {
      id: "influencer-collab",
      name: "Overpriced Meme Page",
      cost: 7000,
      icon: "⭐",
      reachMultiplier: 1.15,
      userYield: 110,
      description: "Paid ₹7,000 for a 2-hour story. Most cash gone."
    }
  ],

  mediaOptions: [
    {
      id: "short-reel",
      name: "Film DIY Reel Alone",
      description: "Filmed on smartphone with poor audio.",
      reachBonus: -10,
      userMultiplier: 1.05,
      costEnergy: 25,
      icon: "⚡",
      outcome: "Shaky camera, poor lighting. Reached only 40 views."
    },
    {
      id: "founder-story",
      name: "Tired Founder Vlog",
      description: "Vlog showing how burnt out and tired you look.",
      reachBonus: -12,
      userMultiplier: 1.02,
      reputationBonus: -5,
      costEnergy: 30,
      icon: "🎥",
      outcome: "Looked stressed and exhausted. Investors worried."
    },
    {
      id: "product-demo",
      name: "Screen Recording Demo",
      description: "Boring screen capture with laggy audio.",
      reachBonus: -8,
      userMultiplier: 1.04,
      productBonus: -5,
      costEnergy: 20,
      icon: "💻",
      outcome: "Technical glitch mid-video. Users dropped off."
    }
  ],

  investorOffers: [
    {
      id: "shark-investor",
      name: "Predatory Shark Syndicate",
      amount: "₹1,00,000",
      equity: "75% Equity",
      pros: "You get cash, but lose your entire company.",
      cons: "Investors take control and fire you.",
      cashValue: 100000,
      scoreDelta: -15,
      fundingDelta: 5,
      founderOwnership: 25,
      narrative: "They took 75% equity! You are now an unpaid employee in your own idea."
    },
    {
      id: "smart-angel",
      name: "Angel Pass",
      amount: "₹0",
      equity: "0% Equity",
      pros: "Angel liked the idea, but passed: 'You have no team.'",
      cons: "Zero funding secured. Runway expired.",
      cashValue: 0,
      scoreDelta: -20,
      fundingDelta: 0,
      founderOwnership: 100,
      narrative: "Angel: 'I invest in teams, not lone students. Come back when you have an ecosystem.'"
    },
    {
      id: "corporate-sponsor",
      name: "Exploitative Sponsor",
      amount: "₹20,000",
      equity: "Total IP Rights",
      pros: "Small stipend, but they own your code.",
      cons: "Legal nightmare. You cannot launch.",
      cashValue: 20000,
      scoreDelta: -18,
      fundingDelta: 5,
      founderOwnership: 0,
      narrative: "Sponsor's legal team claimed full ownership of your startup."
    }
  ],

  endings: [
    {
      range: [0, 49],
      tier: "STARTUP FAILED",
      badge: "💀 SOLO FOUNDER BURNOUT",
      headline: "Your Startup Ran Out of Runway.",
      subheadline: "You tried to be the Coder, Designer, Marketer, Cameraman & Lawyer alone.",
      color: "rose",
      advice: "90% of college startups die because one student tries to do everything alone. A founder needs an ecosystem."
    },
    {
      range: [50, 100],
      tier: "PIVOT REQUIRED",
      badge: "⚠️ SOLO OVERLOAD",
      headline: "Exhaustion Hit Before Launch.",
      subheadline: "Great idea, but impossible to execute without a team.",
      color: "amber",
      advice: "You cannot scale alone. You need an ecosystem."
    }
  ]
};
