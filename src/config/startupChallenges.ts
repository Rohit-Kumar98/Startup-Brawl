export interface ChallengeChoice {
  id: string;
  letter: 'A' | 'B' | 'C';
  text: string;
  ratingBadge: string;
  scoreDelta: number;
  isCorrect: boolean;
  outcomeNarrative: string;
  ecellTakeaway: string;
}

export interface RoomChallenge {
  roomKey: string;
  roomName: string;
  challengeTitle: string;
  situation: string;
  question: string;
  choices: ChallengeChoice[];
}

export const STARTUP_CHALLENGES: Record<string, Record<string, RoomChallenge>> = {
  // =========================================================================
  // 1. CAMPUSEATS
  // =========================================================================
  campuseats: {
    'stage-content': {
      roomKey: 'stage-content',
      roomName: 'Content Room',
      challengeTitle: 'The 10-Minute Promise',
      situation: 'A competitor claims 10-minute campus delivery is impossible.',
      question: 'How do you build trust?',
      choices: [
        {
          id: 'ce-c-a',
          letter: 'A',
          text: 'Show real delivery times and explain the peer-to-peer model',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Radical transparency wins! Showing peer runners stationed in each hostel proved the math works. Order trust surged across campus!',
          ecellTakeaway: 'Transparency beats hype. When skeptics doubt your speed, show the mechanics and real data behind your promise.'
        },
        {
          id: 'ce-c-b',
          letter: 'B',
          text: 'Claim “We’re the fastest” without proof',
          ratingBadge: '🟡 +45%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Some students ordered, but Reddit memes questioned whether "fastest" meant 10 mins or 40 mins. Mild traction with lingering doubt.',
          ecellTakeaway: 'Empty superlatives don\'t build trust. Claims without proof invite skepticism.'
        },
        {
          id: 'ce-c-c',
          letter: 'C',
          text: 'Stop promoting the 10-minute promise',
          ratingBadge: '🔴 −25%',
          scoreDelta: -8,
          isCorrect: false,
          outcomeNarrative: 'You surrendered your primary value proposition! Orders plummeted as students saw no difference between you and regular canteen takeout.',
          ecellTakeaway: 'Never drop your core differentiator out of fear. Defend and prove it.'
        }
      ]
    },
    'stage-technical': {
      roomKey: 'stage-technical',
      roomName: 'Tech / Dev Lab',
      challengeTitle: 'The Order Flood',
      situation: '100 orders arrive at once, overwhelming delivery partners.',
      question: 'How should orders be assigned?',
      choices: [
        {
          id: 'ce-t-a',
          letter: 'A',
          text: 'Match by distance, workload and capacity',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Algorithmic routing dispatched runners with optimal batching. All 100 orders delivered hot in an average of 8.5 minutes!',
          ecellTakeaway: 'Intelligent batching and capacity dispatching multiply fulfillment efficiency during peak bursts.'
        },
        {
          id: 'ce-t-b',
          letter: 'B',
          text: 'Let customers choose delivery partners',
          ratingBadge: '🟡 +40%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'A few popular runners got 30 orders each while others sat idle. Half the food got cold waiting in queues.',
          ecellTakeaway: 'Customer choice in dispatch creates bottleneck imbalances. Operations require centralized load-balancing.'
        },
        {
          id: 'ce-t-c',
          letter: 'C',
          text: 'Assign orders randomly',
          ratingBadge: '🔴 −45%',
          scoreDelta: -10,
          isCorrect: false,
          outcomeNarrative: 'Runners in Hostel 1 got assigned deliveries across campus in Hostel 8. Massive delays, angry calls, and food went cold.',
          ecellTakeaway: 'Random distribution ignores spatial constraints. Logistics requires location-aware optimization.'
        }
      ]
    },
    'stage-design': {
      roomKey: 'stage-design',
      roomName: 'Design Studio',
      challengeTitle: 'Too Many Clicks',
      situation: 'Students abandon orders because buying a ₹50 snack takes 7–8 taps.',
      question: 'How do you simplify ordering?',
      choices: [
        {
          id: 'ce-d-a',
          letter: 'A',
          text: 'Add animations and recommendations',
          ratingBadge: '🟡 +35%',
          scoreDelta: 2,
          isCorrect: false,
          outcomeNarrative: 'The app looked flashy, but the 8-tap checkout remained just as tedious on slow campus Wi-Fi. 65% drop-off persisted.',
          ecellTakeaway: 'Cosmetics don\'t fix UX friction. Never mask a clunky funnel with animations.'
        },
        {
          id: 'ce-d-b',
          letter: 'B',
          text: 'Minimise steps from snack selection to payment',
          ratingBadge: '🟢 +95%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: '2-tap Quick Reorder & instant UPI checkout! Cart conversion jumped by 320% as late-night ordering became effortless.',
          ecellTakeaway: 'Frictionless checkout is king for low-ticket impulse purchases. Every tap removed increases conversion.'
        },
        {
          id: 'ce-d-c',
          letter: 'C',
          text: 'Keep the design unchanged',
          ratingBadge: '🔴 −30%',
          scoreDelta: -8,
          isCorrect: false,
          outcomeNarrative: 'Students gave up and walked down to the canteen instead. Daily active orders dropped by a third.',
          ecellTakeaway: 'Ignoring friction data is fatal. When users abandon checkout, your funnel is broken.'
        }
      ]
    },
    'stage-pr': {
      roomKey: 'stage-pr',
      roomName: 'PR War Room',
      challengeTitle: 'The Missing Maggi',
      situation: 'A viral post says CAMPUSEATS took payment but never delivered; the issue was a location error.',
      question: 'How do you respond?',
      choices: [
        {
          id: 'ce-pr-a',
          letter: 'A',
          text: 'Blame the delivery partner',
          ratingBadge: '🔴 −45%',
          scoreDelta: -10,
          isCorrect: false,
          outcomeNarrative: 'Runners staged a campus strike in protest! The founder looked defensive and untrustworthy in public.',
          ecellTakeaway: 'Never throw frontline partners under the bus. Founders take extreme ownership of customer failures.'
        },
        {
          id: 'ce-pr-b',
          letter: 'B',
          text: 'Refund, acknowledge the issue and explain the fix',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Instant UPI refund + extra Maggi voucher + location pin fix deployed in 2 hours. The student updated their post praising the founder!',
          ecellTakeaway: 'Fast, generous, and transparent resolution turns critics into your most loyal brand advocates.'
        },
        {
          id: 'ce-pr-c',
          letter: 'C',
          text: 'Delete the post and offer a discount',
          ratingBadge: '🟡 +40%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'The user took screenshots before deletion and questioned your censorship. Trust took a noticeable hit.',
          ecellTakeaway: 'Deleting negative comments looks like guilt. Address mistakes openly and fix the root cause.'
        }
      ]
    },
    'stage-sponsorship': {
      roomKey: 'stage-sponsorship',
      roomName: 'Investor Suite',
      challengeTitle: 'The Unit Economics Problem',
      situation: 'An investor asks how a ₹70 order can be profitable with ₹25 delivery costs.',
      question: 'What’s your answer?',
      choices: [
        {
          id: 'ce-inv-a',
          letter: 'A',
          text: 'Subsidise delivery until you scale',
          ratingBadge: '🔴 −40%',
          scoreDelta: -10,
          isCorrect: false,
          outcomeNarrative: 'Investor passed immediately: "Subsidizing without a path to margin means you bleed cash faster as you grow."',
          ecellTakeaway: 'Growth on negative unit economics without structural density is a death spiral.'
        },
        {
          id: 'ce-inv-b',
          letter: 'B',
          text: 'Use order density, multiple nearby deliveries and fees/partnerships to improve margins',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'The investor nodded in approval! Batching 3 orders per hostel run drops per-order delivery cost to ₹8, unlocking healthy margins.',
          ecellTakeaway: 'Hyperlocal density transforms delivery economics. Bundling orders turns losses into profits.'
        },
        {
          id: 'ce-inv-c',
          letter: 'C',
          text: 'Add ₹20 to every item',
          ratingBadge: '🟡 +45%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Students rebelled against marked-up prices: "Why pay ₹70 for a ₹50 Maggi?" Order volume crashed.',
          ecellTakeaway: 'Price hikes destroy price-sensitive student demand. Margins must come from operational efficiency.'
        }
      ]
    },
    'stage-marketing': {
      roomKey: 'stage-marketing',
      roomName: 'Marketing Hub',
      challengeTitle: 'The First 1,000',
      situation: '150 users have joined, but orders remain inconsistent.',
      question: 'How do you drive campus growth?',
      choices: [
        {
          id: 'ce-m-a',
          letter: 'A',
          text: 'Give every new user ₹200 credits',
          ratingBadge: '🟡 +40%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Freebie hunters drained ₹30,000 of your runway for one free meal, then never ordered again.',
          ecellTakeaway: 'Heavy cash incentives attract discount tourists, not loyal recurring customers.'
        },
        {
          id: 'ce-m-b',
          letter: 'B',
          text: 'Target peak hours with referrals and hostel ambassadors',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Midnight study cram ambassador push! Orders spiked 400% between 11 PM and 2 AM. Word spread hostel to hostel.',
          ecellTakeaway: 'Focus marketing on your customer\'s peak acute pain point (11 PM hunger) with peer-to-peer advocates.'
        },
        {
          id: 'ce-m-c',
          letter: 'C',
          text: 'Run city-wide Instagram ads',
          ratingBadge: '🔴 −35%',
          scoreDelta: -8,
          isCorrect: false,
          outcomeNarrative: 'Wasted ad budget on people 15 km away who couldn\'t even order inside college campus.',
          ecellTakeaway: 'Hyperlocal businesses require tight geographic concentration, not broad city-wide ad spend.'
        }
      ]
    },
    'stage-mentorship': {
      roomKey: 'stage-mentorship',
      roomName: 'Mentorship Cell',
      challengeTitle: 'Should We Leave Campus?',
      situation: 'The team wants to expand to 10 colleges, but delivery density may suffer.',
      question: 'What’s the best move?',
      choices: [
        {
          id: 'ce-men-a',
          letter: 'A',
          text: 'Expand to all 10 immediately',
          ratingBadge: '🔴 −40%',
          scoreDelta: -10,
          isCorrect: false,
          outcomeNarrative: 'Premature expansion disaster! Operations diluted across 10 campuses, delivery times blew past 45 mins, and cash ran out.',
          ecellTakeaway: 'Premature scaling before dominating your home hub destroys operational quality.'
        },
        {
          id: 'ce-men-b',
          letter: 'B',
          text: 'Stop expansion completely',
          ratingBadge: '🟡 +35%',
          scoreDelta: 2,
          isCorrect: false,
          outcomeNarrative: 'The business stayed safe but stagnant. Competitors began eyeing neighboring campuses.',
          ecellTakeaway: 'Excessive caution caps your venture\'s ceiling. You must prepare a playbook to replicate.'
        },
        {
          id: 'ce-men-c',
          letter: 'C',
          text: 'Optimise the current campus, then replicate in 1–2 similar campuses',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Mentor praised the playbook! You hit 60% campus penetration and created a repeatable blueprint for 2 neighboring colleges.',
          ecellTakeaway: 'Nail your model in one sandbox first. Replicate systematically with a proven operational playbook.'
        }
      ]
    },
    'stage-media': {
      roomKey: 'stage-media',
      roomName: 'Media Studio',
      challengeTitle: 'Make Hunger Viral',
      situation: 'You need one short video to launch CAMPUSEATS across campus.',
      question: 'Which concept works best?',
      choices: [
        {
          id: 'ce-med-a',
          letter: 'A',
          text: 'Funny late-night hunger → CAMPUSEATS delivery',
          ratingBadge: '🟢 +95%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'The reel exploded with 18k views on campus meme pages! Students tagged their roommates at 1 AM and app installs surged.',
          ecellTakeaway: 'Relatable, comedic empathy with the customer\'s exact moment of need drives viral organic sharing.'
        },
        {
          id: 'ce-med-b',
          letter: 'B',
          text: 'Explain logistics and the business model',
          ratingBadge: '🟡 +40%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Students scrolled past after 3 seconds: "Why are they explaining supply chain algorithms in a reel?"',
          ecellTakeaway: 'Customers care about the food and the speed, not your backend tech stack.'
        },
        {
          id: 'ce-med-c',
          letter: 'C',
          text: 'Generic food montage without the brand or promise',
          ratingBadge: '🔴 −20%',
          scoreDelta: -6,
          isCorrect: false,
          outcomeNarrative: 'Pretty food photos, but viewers had no idea what app it was for or how fast it delivered. Zero downloads.',
          ecellTakeaway: 'A video without a clear brand identity and value hook is wasted production.'
        }
      ]
    }
  },

  // =========================================================================
  // 2. PLANTSPEAK
  // =========================================================================
  plantspeak: {
    'stage-content': {
      roomKey: 'stage-content',
      roomName: 'Content Room',
      challengeTitle: 'The Plant Panic',
      situation: 'Hostel plants show signs of infection and students are worried.',
      question: 'What content should you publish?',
      choices: [
        {
          id: 'ps-c-a',
          letter: 'A',
          text: 'Explain the AI and fungal infections',
          ratingBadge: '🟡 +40%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Too academic. Students didn\'t know whether their leaf spot was Cercospora or just dry soil.',
          ecellTakeaway: 'Academic jargon alienates beginners. Keep advice actionable.'
        },
        {
          id: 'ps-c-b',
          letter: 'B',
          text: 'Create a simple “Is your plant sick?” guide',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Massive engagement! A 3-step visual checklist was saved by 300+ students and shared in gardening circles.',
          ecellTakeaway: 'Simple diagnostic self-checks empower users and drive immediate scan app utility.'
        },
        {
          id: 'ps-c-c',
          letter: 'C',
          text: 'Wait until the infection is confirmed',
          ratingBadge: '🔴 −30%',
          scoreDelta: -8,
          isCorrect: false,
          outcomeNarrative: 'By the time you posted, dozens of plants died, and frustrated students blamed the app for being useless.',
          ecellTakeaway: 'In crises, proactive guidance builds trust; hesitation makes you irrelevant.'
        }
      ]
    },
    'stage-technical': {
      roomKey: 'stage-technical',
      roomName: 'Tech / Dev Lab',
      challengeTitle: 'The False Alarm',
      situation: 'The AI sometimes marks healthy plants as sick, hurting trust.',
      question: 'How do you respond?',
      choices: [
        {
          id: 'ps-t-a',
          letter: 'A',
          text: 'Reduce sensitivity and add a clear disclaimer',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Confidence scores with human-in-the-loop disclaimers restored user faith. Accuracy perception rose to 94%!',
          ecellTakeaway: 'Calibrated sensitivity and honest confidence ratings build user trust in AI products.'
        },
        {
          id: 'ps-t-b',
          letter: 'B',
          text: 'Keep it unchanged',
          ratingBadge: '🟡 +45%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'False alarms kept generating panic among students over normal leaf variations.',
          ecellTakeaway: 'Ignoring model drift and false positives slowly erodes user trust.'
        },
        {
          id: 'ps-t-c',
          letter: 'C',
          text: 'Shut down the AI until 100% accurate',
          ratingBadge: '🔴 −35%',
          scoreDelta: -9,
          isCorrect: false,
          outcomeNarrative: 'No AI is 100% accurate. Shutting down halted all user acquisition and killed product momentum.',
          ecellTakeaway: 'Don\'t let perfection kill good. Ship with disclaimers and iterate on real data.'
        }
      ]
    },
    'stage-design': {
      roomKey: 'stage-design',
      roomName: 'Design Studio',
      challengeTitle: 'Hostel-Friendly or Techy?',
      situation: 'Students find technical plant-health terms confusing.',
      question: 'How should you redesign the app?',
      choices: [
        {
          id: 'ps-d-a',
          letter: 'A',
          text: 'Keep the technical interface',
          ratingBadge: '🔴 −20%',
          scoreDelta: -6,
          isCorrect: false,
          outcomeNarrative: 'Students felt intimidated by botanical terms and abandoned the app after one scan.',
          ecellTakeaway: 'Designing for experts when targeting casual students kills retention.'
        },
        {
          id: 'ps-d-b',
          letter: 'B',
          text: 'Show only “Healthy” or “Sick”',
          ratingBadge: '🟡 +40%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Oversimplified! Students knew their plant was "Sick" but had no idea what to do next.',
          ecellTakeaway: 'Diagnosis without actionable treatment leaves users stranded.'
        },
        {
          id: 'ps-d-c',
          letter: 'C',
          text: 'Use simple visuals with optional detailed reports',
          ratingBadge: '🟢 +95%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Perfect progressive disclosure! A quick green/yellow/red traffic light health card with a tap for deep-dive care tips.',
          ecellTakeaway: 'Progressive disclosure satisfies both quick scanners and dedicated plant parents.'
        }
      ]
    },
    'stage-pr': {
      roomKey: 'stage-pr',
      roomName: 'PR War Room',
      challengeTitle: 'The AI Gets Blamed',
      situation: 'A viral post claims Plantspeak made a plant worse.',
      question: 'How do you handle the backlash?',
      choices: [
        {
          id: 'ps-pr-a',
          letter: 'A',
          text: 'Blame the student',
          ratingBadge: '🔴 −50%',
          scoreDelta: -12,
          isCorrect: false,
          outcomeNarrative: 'PR catastrophe! Campus dubbed the founder hostile and unsympathetic. 1-star review bombing began.',
          ecellTakeaway: 'Attacking customers in public is company suicide.'
        },
        {
          id: 'ps-pr-b',
          letter: 'B',
          text: 'Respond, investigate and clarify AI limitations',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Founder offered a free replacement plant, audited the diagnosis, and published an educational care breakdown. Praise for honesty!',
          ecellTakeaway: 'Radical empathy, investigation, and open limitation boundaries protect your brand.'
        },
        {
          id: 'ps-pr-c',
          letter: 'C',
          text: 'Delete negative comments',
          ratingBadge: '🟡 +35%',
          scoreDelta: 2,
          isCorrect: false,
          outcomeNarrative: 'Screenshots were reposted on college confession pages with allegations of coverups.',
          ecellTakeaway: 'Censorship multiplies PR backlash.'
        }
      ]
    },
    'stage-sponsorship': {
      roomKey: 'stage-sponsorship',
      roomName: 'Investor Suite',
      challengeTitle: 'The Big Pitch',
      situation: 'An investor asks why students need Plantspeak instead of Google.',
      question: 'What’s your pitch?',
      choices: [
        {
          id: 'ps-inv-a',
          letter: 'A',
          text: '“Our AI will replace plant experts.”',
          ratingBadge: '🟡 +40%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Investor scoffed: "Arrogant claim. Agronomists with 30 years experience won\'t be replaced by a campus MVP."',
          ecellTakeaway: 'Avoid grandiosity. Don\'t claim to replace industries; claim to make care accessible.'
        },
        {
          id: 'ps-inv-b',
          letter: 'B',
          text: '“We’ll figure out revenue after growing.”',
          ratingBadge: '🔴 −30%',
          scoreDelta: -8,
          isCorrect: false,
          outcomeNarrative: 'Investor passed: "No monetization hypothesis means you\'re building an expensive hobby."',
          ecellTakeaway: 'Always have a clear monetization logic (fertilizer affiliate, plant hospital subscription).'
        },
        {
          id: 'ps-inv-c',
          letter: 'C',
          text: '“We make plant diagnosis simple, instant and hostel-friendly.”',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Investor leaned in: "Google is a wall of search links. You give a 3-second instant answer tailored for hostel rooms!"',
          ecellTakeaway: 'Clear positioning against generic search engines unlocks early stage venture interest.'
        }
      ]
    },
    'stage-marketing': {
      roomKey: 'stage-marketing',
      roomName: 'Marketing Hub',
      challengeTitle: 'Where Are the Customers?',
      situation: 'You have a small budget and need to reach hostel students.',
      question: 'Which strategy works best?',
      choices: [
        {
          id: 'ps-m-a',
          letter: 'A',
          text: 'Run expensive nationwide ads',
          ratingBadge: '🔴 −40%',
          scoreDelta: -10,
          isCorrect: false,
          outcomeNarrative: 'Burned 80% of your runway in 3 days with tiny conversion across distant cities.',
          ecellTakeaway: 'Paid nationwide ads on small budgets give zero network effects.'
        },
        {
          id: 'ps-m-b',
          letter: 'B',
          text: 'Partner with colleges, hostels and gardening clubs',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Free campus adoption! Campus green clubs mandated the app for hostel balcony plants. 450 users joined in a week.',
          ecellTakeaway: 'Partnering with enthusiastic micro-communities yields high-trust, zero-cost acquisition.'
        },
        {
          id: 'ps-m-c',
          letter: 'C',
          text: 'Give permanent discounts',
          ratingBadge: '🟡 +45%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Discounts on a free diagnostic app made no sense and confused students.',
          ecellTakeaway: 'Pricing incentives only work when you have a paid transaction to discount.'
        }
      ]
    },
    'stage-mentorship': {
      roomKey: 'stage-mentorship',
      roomName: 'Mentorship Cell',
      challengeTitle: 'The Pivot Question',
      situation: 'A mentor suggests expanding from student plants to campus-wide plant management.',
      question: 'What do you do?',
      choices: [
        {
          id: 'ps-men-a',
          letter: 'A',
          text: 'Immediately switch to college-only clients',
          ratingBadge: '🟡 +45%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Abandoned the student consumer base for slow B2B university bureaucracy that took 8 months to approve.',
          ecellTakeaway: 'B2B institutional sales cycles are long and dangerous for early cash-strapped founders.'
        },
        {
          id: 'ps-men-b',
          letter: 'B',
          text: 'Run a small campus pilot alongside the current product',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Audited 100 campus botanical garden trees as a pilot while keeping the consumer app active. Campus estate signed a paid pilot!',
          ecellTakeaway: 'Explore high-value B2B pilots cautiously without killing consumer momentum.'
        },
        {
          id: 'ps-men-c',
          letter: 'C',
          text: 'Ignore the idea',
          ratingBadge: '🔴 −30%',
          scoreDelta: -8,
          isCorrect: false,
          outcomeNarrative: 'Passed on a potential ₹2L university estate contract that could have funded the entire development team.',
          ecellTakeaway: 'Don\'t ignore mentor feedback that offers non-dilutive campus revenue.'
        }
      ]
    },
    'stage-media': {
      roomKey: 'stage-media',
      roomName: 'Media Studio',
      challengeTitle: 'Make Plantspeak Go Viral',
      situation: 'You have one shot to create a video that gets students to try Plantspeak.',
      question: 'What do you create?',
      choices: [
        {
          id: 'ps-med-a',
          letter: 'A',
          text: 'Show a dying plant’s scan-to-recovery journey',
          ratingBadge: '🟢 +95%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Emotional transformation story! The 15-second time-lapse of a yellow withered pothos turning bright green got 28k views.',
          ecellTakeaway: 'Transformation stories demonstrate immediate proof of value. Before-and-after hooks captivate audience empathy.'
        },
        {
          id: 'ps-med-b',
          letter: 'B',
          text: 'Explain the AI architecture for 3 minutes',
          ratingBadge: '🔴 −20%',
          scoreDelta: -6,
          isCorrect: false,
          outcomeNarrative: 'Viewers dropped off after 5 seconds of convolutional neural network diagrams.',
          ecellTakeaway: 'Nobody cares about how your AI was built; they care about what it does for their life.'
        },
        {
          id: 'ps-med-c',
          letter: 'C',
          text: 'Have a celebrity simply promote the app',
          ratingBadge: '🟡 +40%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Expensive and felt like a generic paid endorsement. Low credibility.',
          ecellTakeaway: 'Influencer ads without product integration deliver low conversion.'
        }
      ]
    }
  },

  // =========================================================================
  // 3. SKILLSWAP
  // =========================================================================
  skillswap: {
    'stage-content': {
      roomKey: 'stage-content',
      roomName: 'Content Room',
      challengeTitle: 'The Skill Nobody Wants',
      situation: 'Popular skills get matches, but niche skills don’t.',
      question: 'How do you increase demand for overlooked skills?',
      choices: [
        {
          id: 'ss-c-a',
          letter: 'A',
          text: 'Promote popular skills more',
          ratingBadge: '🟡 +40%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Popular skills got oversaturated with Python coders while photographers and designers left the platform.',
          ecellTakeaway: 'Promoting already popular categories starves marketplace diversity.'
        },
        {
          id: 'ss-c-b',
          letter: 'B',
          text: 'Let students post skill requests',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Reverse marketplace dynamic! Students posted "Need someone to teach me video editing", and niche creators rushed to fulfill it.',
          ecellTakeaway: 'Buyer/request-led discovery balances two-sided marketplaces and unlocks dormant supply.'
        },
        {
          id: 'ss-c-c',
          letter: 'C',
          text: 'Allow unlimited skill listings',
          ratingBadge: '🔴 −25%',
          scoreDelta: -8,
          isCorrect: false,
          outcomeNarrative: 'Marketplace spam! Low-quality joke skills cluttered search and lowered trust.',
          ecellTakeaway: 'Unmoderated listings degrade marketplace trust and discoverability.'
        }
      ]
    },
    'stage-technical': {
      roomKey: 'stage-technical',
      roomName: 'Tech / Dev Lab',
      challengeTitle: 'The Ghost Exchange',
      situation: 'No-shows are causing failed exchanges.',
      question: 'How do you improve reliability?',
      choices: [
        {
          id: 'ss-t-a',
          letter: 'A',
          text: 'Add reminders and reliability scores',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Automated WhatsApp nudges + a public "On-Time Trust Score" dropped no-show rates from 40% down to 6%!',
          ecellTakeaway: 'Social accountability and timely automated nudges solve flaky user behavior without financial friction.'
        },
        {
          id: 'ss-t-b',
          letter: 'B',
          text: 'Take refundable deposits',
          ratingBadge: '🟡 +50%',
          scoreDelta: 4,
          isCorrect: false,
          outcomeNarrative: 'Reduced no-shows, but deposit friction cut new user signups by 60%.',
          ecellTakeaway: 'Monetary deposits create high friction in student barter networks.'
        },
        {
          id: 'ss-t-c',
          letter: 'C',
          text: 'Rely on manual reports',
          ratingBadge: '🔴 −35%',
          scoreDelta: -9,
          isCorrect: false,
          outcomeNarrative: 'You spent 5 hours daily reviewing student complaints and arbitrating he-said-she-said arguments.',
          ecellTakeaway: 'Manual moderation doesn\'t scale. Build automated product incentives.'
        }
      ]
    },
    'stage-design': {
      roomKey: 'stage-design',
      roomName: 'Design Studio',
      challengeTitle: 'What Are You Actually Good At?',
      situation: 'Users exaggerate skills, causing bad matches.',
      question: 'How should skill levels be shown?',
      choices: [
        {
          id: 'ss-d-a',
          letter: 'A',
          text: 'Self-rate 1–10',
          ratingBadge: '🟡 +45%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Every 1st-year coder rated themselves 9/10 in Python, leading to disappointed learners.',
          ecellTakeaway: 'Subjective numeric ratings invite vanity inflation.'
        },
        {
          id: 'ss-d-b',
          letter: 'B',
          text: 'Use Beginner/Intermediate/Advanced + feedback',
          ratingBadge: '🟢 +95%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Clear tiered benchmarks and peer verification tags created realistic expectations and stellar swap ratings!',
          ecellTakeaway: 'Standardized competency tiers paired with verified peer reviews establish marketplace authenticity.'
        },
        {
          id: 'ss-d-c',
          letter: 'C',
          text: 'Remove skill levels',
          ratingBadge: '🔴 −20%',
          scoreDelta: -6,
          isCorrect: false,
          outcomeNarrative: 'Beginners got paired with advanced learners, causing frustration and immediate drop-offs.',
          ecellTakeaway: 'Lack of skill leveling creates mismatched expectations.'
        }
      ]
    },
    'stage-pr': {
      roomKey: 'stage-pr',
      roomName: 'PR War Room',
      challengeTitle: 'The Perfect Rating',
      situation: 'A top-rated user is accused of fake skill claims.',
      question: 'How do you protect trust without losing activity?',
      choices: [
        {
          id: 'ss-pr-a',
          letter: 'A',
          text: 'Remove the user',
          ratingBadge: '🟡 +35%',
          scoreDelta: 2,
          isCorrect: false,
          outcomeNarrative: 'The user claimed unfair banning without proof, triggering drama in student WhatsApp groups.',
          ecellTakeaway: 'Banning without evidence damages platform impartiality.'
        },
        {
          id: 'ss-pr-b',
          letter: 'B',
          text: 'Investigate and verify exchanges',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Audited past reviews, held a private verification test, and added a verified skill checkmark. Community praised your fairness!',
          ecellTakeaway: 'Due process, verification, and transparent standards protect ecosystem integrity.'
        },
        {
          id: 'ss-pr-c',
          letter: 'C',
          text: 'Ignore the complaint',
          ratingBadge: '🔴 −40%',
          scoreDelta: -10,
          isCorrect: false,
          outcomeNarrative: 'Word spread that ratings are fake. Students stopped trusting 5-star profiles.',
          ecellTakeaway: 'Ignoring trust erosion is fatal for peer-to-peer barter platforms.'
        }
      ]
    },
    'stage-sponsorship': {
      roomKey: 'stage-sponsorship',
      roomName: 'Investor Suite',
      challengeTitle: 'But Where’s the Money?',
      situation: 'SkillSwap is popular but has no revenue model.',
      question: 'How do you monetise without hurting free exchanges?',
      choices: [
        {
          id: 'ss-inv-a',
          letter: 'A',
          text: 'Charge per exchange',
          ratingBadge: '🟡 +35%',
          scoreDelta: 2,
          isCorrect: false,
          outcomeNarrative: 'Charging fees killed the free barter spirit. Users simply swapped phone numbers to bypass the platform.',
          ecellTakeaway: 'Taking a toll on peer barters induces disintermediation.'
        },
        {
          id: 'ss-inv-b',
          letter: 'B',
          text: 'Offer paid premium features',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Introduced verified certificates, priority matching, and recorded masterclasses. 15% of users happily upgraded!',
          ecellTakeaway: 'Freemium value-add (credentials, priority, tooling) preserves the free core while generating healthy revenue.'
        },
        {
          id: 'ss-inv-c',
          letter: 'C',
          text: 'Allow ads inside exchanges',
          ratingBadge: '🔴 −30%',
          scoreDelta: -8,
          isCorrect: false,
          outcomeNarrative: 'Pop-up banner ads during video learning sessions caused infuriated uninstalls.',
          ecellTakeaway: 'Intrusive ads destroy collaborative educational experiences.'
        }
      ]
    },
    'stage-marketing': {
      roomKey: 'stage-marketing',
      roomName: 'Marketing Hub',
      challengeTitle: 'The Empty Marketplace',
      situation: '500 students join, but most only want to learn.',
      question: 'How do you increase available skills?',
      choices: [
        {
          id: 'ss-m-a',
          letter: 'A',
          text: 'Attract more users',
          ratingBadge: '🟡 +30%',
          scoreDelta: 2,
          isCorrect: false,
          outcomeNarrative: 'Brought in 200 more students, but they also only wanted to learn. The supply deficit worsened.',
          ecellTakeaway: 'Pouring more demand into an unbalanced supply-demand marketplace increases churn.'
        },
        {
          id: 'ss-m-b',
          letter: 'B',
          text: 'Encourage users to teach + showcase success',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Campaign: "Everyone has a skill to teach — Guitar, Sketching, Canva!" 220 students posted their first teaching slot!',
          ecellTakeaway: 'Lower the psychological barrier to teaching by celebrating accessible non-academic skills.'
        },
        {
          id: 'ss-m-c',
          letter: 'C',
          text: 'Auto-add skills from degrees',
          ratingBadge: '🔴 −35%',
          scoreDelta: -9,
          isCorrect: false,
          outcomeNarrative: 'CSE students were auto-listed as Java teachers even if they failed Java. Mismatches exploded.',
          ecellTakeaway: 'Never assume competence based on degree majors.'
        }
      ]
    },
    'stage-mentorship': {
      roomKey: 'stage-mentorship',
      roomName: 'Mentorship Cell',
      challengeTitle: 'The Currency Problem',
      situation: 'Students can’t always find direct swap partners.',
      question: 'Should SkillSwap introduce Skill Credits?',
      choices: [
        {
          id: 'ss-men-a',
          letter: 'A',
          text: 'Launch them platform-wide',
          ratingBadge: '🟡 +55%',
          scoreDelta: 4,
          isCorrect: false,
          outcomeNarrative: 'Credit inflation occurred without economic balance. Some users hoarded credits without teaching.',
          ecellTakeaway: 'Introducing platform currency across an entire user base without economic testing risks inflation.'
        },
        {
          id: 'ss-men-b',
          letter: 'B',
          text: 'Test them with a small group',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Pilot with 50 students calibrated credit issuance (1 hr teaching = 1 credit). Multi-party swaps quadrupled!',
          ecellTakeaway: 'Sandbox testing monetary and credit mechanics protects ecosystem balance before broad rollout.'
        },
        {
          id: 'ss-men-c',
          letter: 'C',
          text: 'Reject the idea',
          ratingBadge: '🔴 −25%',
          scoreDelta: -7,
          isCorrect: false,
          outcomeNarrative: 'Strict 1-to-1 direct swaps remained constrained by the "double coincidence of wants".',
          ecellTakeaway: 'Rejecting flexible barter mechanics limits marketplace liquidity.'
        }
      ]
    },
    'stage-media': {
      roomKey: 'stage-media',
      roomName: 'Media Studio',
      challengeTitle: 'The Viral Problem',
      situation: 'A SkillSwap exchange video goes viral, but comments accuse the platform of being fake.',
      question: 'How do you turn the attention into trust?',
      choices: [
        {
          id: 'ss-med-a',
          letter: 'A',
          text: 'Delete negative comments',
          ratingBadge: '🟡 +40%',
          scoreDelta: 3,
          isCorrect: false,
          outcomeNarrative: 'Commenters noticed deleted threads and called the platform dishonest.',
          ecellTakeaway: 'Censoring skepticism fuels suspicion.'
        },
        {
          id: 'ss-med-b',
          letter: 'B',
          text: 'Share real user stories and verified exchange results',
          ratingBadge: '🟢 +100%',
          scoreDelta: 10,
          isCorrect: true,
          outcomeNarrative: 'Published 30-second clips of real students playing guitar and showing Figma prototypes learned on SkillSwap. Viral trust wave!',
          ecellTakeaway: 'Social proof through tangible student learning artifacts is unarguable evidence.'
        },
        {
          id: 'ss-med-c',
          letter: 'C',
          text: 'Ignore the backlash and keep posting promotional content',
          ratingBadge: '🔴 −35%',
          scoreDelta: -9,
          isCorrect: false,
          outcomeNarrative: 'The skepticism solidified as conventional wisdom on campus. Conversion dropped to zero.',
          ecellTakeaway: 'Never ignore viral reputational doubt. Address it with authentic proof.'
        }
      ]
    }
  }
};

export function getStartupChallenge(startupId: string, stageId: string): RoomChallenge | null {
  const normId = startupId?.toLowerCase() || 'campuseats';
  const startupMap = STARTUP_CHALLENGES[normId] || STARTUP_CHALLENGES['campuseats'];
  return startupMap[stageId] || null;
}
