import type {
  AboutContent,
  ApproachContent,
  BlogPost,
  HomeContent,
  LegalPages,
  MediaItem,
  PageSeo,
  PublicSitePayload,
  ServiceItem,
  SiteSettings,
  TestimonialItem,
} from '../types/cms.ts';

export const IMG_HERO = '/src/assets/images/hero_wellness_sanctuary_1794934238214.jpg';
export const IMG_ABOUT = '/src/assets/images/about_calm_space_1794934237645.jpg';
export const IMG_MINDFULNESS = '/src/assets/images/service_mindfulness_1794934238363.jpg';
export const IMG_COACHING = '/src/assets/images/service_coaching_1794934239041.jpg';
export const IMG_APPROACH = '/src/assets/images/approach_balance_1794934239655.jpg';
export const IMG_BLOG = '/src/assets/images/blog_mental_clarity_1794934240056.jpg';

export const DEFAULT_SETTINGS: SiteSettings = {
  businessName: 'Lyte House Collective',
  tagline: 'Stillness, clarity, and intentional personal growth.',
  phone: '6048899050',
  email: 'jared@lytehousecollective.com',
  logoUrl: '',
  faviconUrl: '',
  brandColors: {
    canvas: '#F8F6F1',
    surface: '#F0ECE3',
    ink: '#1E241E',
    accent: '#5E7059',
    accentDeep: '#3F4F3B',
  },
  location: {
    address: 'Vancouver Wellness Corridor, BC',
    city: 'Vancouver',
    region: 'British Columbia',
    lat: 49.2827,
    lng: -123.1207,
    zoom: 13,
    markerLabel: 'Lyte House Collective',
  },
  businessHours: [
    { day: 'Monday', hours: '8:30 AM – 6:30 PM' },
    { day: 'Tuesday', hours: '8:30 AM – 6:30 PM' },
    { day: 'Wednesday', hours: '8:30 AM – 6:30 PM' },
    { day: 'Thursday', hours: '8:30 AM – 7:00 PM' },
    { day: 'Friday', hours: '9:00 AM – 5:00 PM' },
    { day: 'Saturday', hours: '10:00 AM – 3:00 PM' },
    { day: 'Sunday', hours: 'Closed', closed: true },
  ],
  socialLinks: [
    { id: 'soc-ig', platform: 'Instagram', label: 'Instagram', url: 'https://instagram.com', enabled: true },
    { id: 'soc-li', platform: 'LinkedIn', label: 'LinkedIn', url: 'https://linkedin.com', enabled: true },
    { id: 'soc-yt', platform: 'YouTube', label: 'YouTube', url: 'https://youtube.com', enabled: false },
  ],
  sectionToggles: {
    philosophy: true,
    services: true,
    whyChooseUs: true,
    transformation: true,
    testimonials: true,
    finalCta: true,
  },
  navigation: [
    { id: 'nav-home', label: 'Home', path: '/', enabled: true },
    { id: 'nav-about', label: 'About', path: '/about', enabled: true },
    { id: 'nav-services', label: 'Services', path: '/services', enabled: true },
    { id: 'nav-approach', label: 'Our Approach', path: '/approach', enabled: true },
    { id: 'nav-blog', label: 'Blog', path: '/blog', enabled: true },
    { id: 'nav-contact', label: 'Contact', path: '/contact', enabled: true },
  ],
  footer: {
    description:
      'A grounded sanctuary for mindfulness, emotional balance, and sustainable personal transformation in Vancouver and online.',
    copyright: '© 2026 Lyte House Collective. All rights reserved.',
    privacyNotice: 'Sessions are confidential and tailored to your pace of growth.',
  },
  automationSettings: {
    autoConfirmBookings: true,
    bookingConfirmationTemplate:
      'Thank you, {{name}}. Your {{service}} ({{format}}) is scheduled for {{date}} at {{time}}. Confirmation code: {{code}}. Please arrive 5 minutes early to settle in, or join from a quiet space if meeting virtually.',
    contactConfirmationTemplate:
      'Thank you for reaching out to Lyte House Collective, {{name}}. We have received your message regarding "{{subject}}" and will respond personally within one business day.',
    reminderLeadHours: 24,
  },
};

export const DEFAULT_HOME: HomeContent = {
  hero: {
    eyebrow: 'Wellness & Personal Development',
    headline: 'Return to stillness. Grow with quiet intention.',
    subheadline:
      'Lyte House Collective offers grounded mindfulness coaching, holistic wellness sessions, and guided personal development designed for lasting clarity and emotional balance.',
    primaryCtaLabel: 'Start Your Journey',
    secondaryCtaLabel: 'Explore Our Approach',
    imageUrl: IMG_HERO,
    imageAlt: 'Sunlit limestone and oak wellness sanctuary opening onto a misty botanical garden',
  },
  philosophy: {
    eyebrow: 'Our Philosophy',
    headline: 'True transformation begins when the nervous system feels safe enough to listen.',
    body: 'Modern life rewards constant acceleration, leaving little room for honest reflection. At Lyte House Collective, we create unhurried space where mind, body, and daily habits align naturally.',
    secondaryBody:
      'Rather than offering quick fixes or rigid formulas, every session combines evidence-informed mindfulness, practical self-inquiry, and steady accountability.',
    imageUrl: IMG_ABOUT,
    imageAlt: 'Minimalist studio bench with eucalyptus in a matte stoneware vessel and morning window light',
    ctaLabel: 'Read About Us',
  },
  whyChooseUs: {
    eyebrow: 'Why Lyte House Collective',
    headline: 'Thoughtful guidance built around your lived reality.',
    intro:
      'We bridge contemplative calm with practical life structure so insights from your sessions translate directly into how you work, rest, and relate.',
    items: [
      {
        id: 'why-1',
        number: '01',
        title: 'Unhurried, Human-First Pace',
        description:
          'Every program adapts to your season of life, energy capacity, and personal goals without pressure or performative hustle.',
      },
      {
        id: 'why-2',
        number: '02',
        title: 'Whole-Person Integration',
        description:
          'We connect mental clarity, emotional regulation, somatic awareness, and daily routines into one cohesive practice.',
      },
      {
        id: 'why-3',
        number: '03',
        title: 'Practical Sustainability',
        description:
          'Small, repeatable rituals replace overwhelming overhauls—creating changes that remain steady months after our work together.',
      },
      {
        id: 'why-4',
        number: '04',
        title: 'Sanctuary & Virtual Flexibility',
        description:
          'Meet in person within a calm, restorative setting or connect seamlessly online from wherever you feel most grounded.',
      },
    ],
  },
  transformation: {
    eyebrow: 'Personal Transformation',
    headline: 'From scattered reactivity to grounded self-leadership.',
    body: 'Whether navigating a career transition, recovering from prolonged burnout, or deepening everyday mindfulness, our structured sessions help you hear your own discernment clearly.',
    imageUrl: IMG_APPROACH,
    imageAlt: 'Misty coastal evergreens reflected in calm morning water at dawn',
    pillars: [
      {
        id: 'tr-1',
        title: 'Nervous System Regulation',
        detail: 'Learn breath, attention, and grounding practices that restore composure during high-demand days.',
      },
      {
        id: 'tr-2',
        title: 'Clear Boundaries & Purpose',
        detail: 'Identify what matters most and align your calendar, energy, and commitments accordingly.',
      },
      {
        id: 'tr-3',
        title: 'Reflective Accountability',
        detail: 'Turn quiet realizations into measurable, compassionate habits that last.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Begin Gently',
    headline: 'Ready to create space for what comes next?',
    body: 'Schedule an individual session, explore a wellness workshop, or reach out directly to discuss what support would serve you best.',
    buttonLabel: 'Book a Session',
  },
};

export const DEFAULT_ABOUT: AboutContent = {
  eyebrow: 'About Lyte House Collective',
  headline: 'A quiet architecture for human renewal and intentional living.',
  intro:
    'Lyte House Collective was created as an antidote to fragmented self-improvement—a calm, welcoming practice dedicated to emotional well-being, mindfulness, and meaningful personal development.',
  imageUrl: IMG_ABOUT,
  imageAlt: 'Calm wellness studio with travertine bench and soft natural daylight',
  missionTitle: 'Our Mission',
  missionBody:
    'To provide accessible, grounded guidance that helps individuals quiet chronic overwhelm, strengthen self-awareness, and build lives anchored in clarity and purpose.',
  visionTitle: 'Our Vision',
  visionBody:
    'A culture where emotional steadiness, mindful presence, and intentional personal growth are treated as everyday foundations rather than rare luxuries.',
  commitmentTitle: 'Our Commitment to You',
  commitmentBody:
    'We meet every client with warmth, confidentiality, and respect for their lived context. Your goals, pace, and boundaries remain central throughout every stage of our work.',
  values: [
    {
      id: 'val-1',
      title: 'Presence Before Performance',
      description: 'Clarity emerges when we slow down enough to observe honestly without judgment.',
    },
    {
      id: 'val-2',
      title: 'Grounded Practicality',
      description: 'Mindfulness is most valuable when it improves how you breathe, decide, and care for yourself on ordinary weekdays.',
    },
    {
      id: 'val-3',
      title: 'Compassionate Integrity',
      description: 'Sustainable growth honors both ambition and rest, replacing self-criticism with steady curiosity.',
    },
  ],
  teamSectionTitle: 'People Behind the Collective',
  teamSectionNote:
    'Team biographies and credentials below are editable templates—update them anytime in the Admin Dashboard to reflect your practitioners.',
  team: [
    {
      id: 'team-1',
      name: 'Jared — Collective Lead',
      role: 'Practitioner & Guide (Edit Bio in Admin)',
      bio: 'Placeholder practitioner profile for Lyte House Collective. Use the Admin Dashboard (/admin) to add verified background details, specialties, and personal philosophy.',
      imageUrl: IMG_COACHING,
      isPlaceholder: true,
    },
  ],
};

export const DEFAULT_APPROACH: ApproachContent = {
  eyebrow: 'Our Approach',
  headline: 'Six interconnected pillars for lasting balance and inner clarity.',
  intro:
    'Lasting personal development rarely happens through willpower alone. Our methodology integrates contemplative mindfulness, embodied awareness, and practical habit design.',
  heroImageUrl: IMG_APPROACH,
  heroImageAlt: 'Quiet misty coastal lake framed by cedar branches at sunrise',
  pillars: [
    {
      id: 'app-1',
      number: '01',
      title: 'Mind-Body Connection',
      subtitle: 'Listening to somatic signals',
      description:
        'Thoughts and physical tension continually shape one another. Through gentle breathwork and somatic check-ins, you learn to recognize early signs of stress before exhaustion sets in.',
      practiceNote: 'Guided breath pacing and body-scan grounding at the start of sessions.',
      imageUrl: IMG_MINDFULNESS,
    },
    {
      id: 'app-2',
      number: '02',
      title: 'Self-Awareness',
      subtitle: 'Observing patterns without judgment',
      description:
        'We examine recurring beliefs, emotional triggers, and habitual choices in a calm, supportive space—turning automatic reactions into conscious options.',
      practiceNote: 'Structured reflection prompts and values alignment mapping.',
      imageUrl: IMG_BLOG,
    },
    {
      id: 'app-3',
      number: '03',
      title: 'Mindfulness',
      subtitle: 'Returning attention to the present',
      description:
        'Rather than forcing an empty mind, mindfulness trains gentle, resilient attention—helping you stay steady amid uncertainty and demanding schedules.',
      practiceNote: 'Short daily anchors tailored for mornings, transitions, and evening wind-down.',
      imageUrl: IMG_HERO,
    },
    {
      id: 'app-4',
      number: '04',
      title: 'Personal Empowerment',
      subtitle: 'Ownership with self-compassion',
      description:
        'True agency comes from clear boundaries and honest priorities. Together we clarify what is yours to carry and what can be released.',
      practiceNote: 'Decision frameworks and confident communication rehearsal.',
      imageUrl: IMG_COACHING,
    },
    {
      id: 'app-5',
      number: '05',
      title: 'Sustainable Lifestyle Changes',
      subtitle: 'Rhythm over intensity',
      description:
        'Dramatic routines rarely survive busy months. We design realistic weekly rhythms for sleep, movement, focus, and rest that evolve naturally with you.',
      practiceNote: 'Micro-habit experiments reviewed gently across biweekly check-ins.',
      imageUrl: IMG_ABOUT,
    },
    {
      id: 'app-6',
      number: '06',
      title: 'Creating Balance & Purpose',
      subtitle: 'Living from what endures',
      description:
        'When daily actions reflect core values, energy returns organically. We help bridge inner quiet with meaningful contribution in work and relationships.',
      practiceNote: 'Seasonal intention reviews and personal compass planning.',
      imageUrl: IMG_APPROACH,
    },
  ],
  closingQuote:
    'Peace is not the absence of movement; it is the steadiness with which you meet each moment.',
  closingAttribution: 'Lyte House Collective Philosophy',
};

export const DEFAULT_SERVICE_CATEGORIES: string[] = [
  'Personal Development',
  'Mindfulness & Meditation',
  'Holistic Wellness',
  'Self-Discovery & Growth',
  'Stress Management',
  'Life Coaching & Guidance',
  'Wellness Workshops',
  'Individual Wellness Sessions',
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Individual Mindfulness & Breathwork',
    slug: 'individual-mindfulness-breathwork',
    category: 'Mindfulness & Meditation',
    summary: 'One-on-one guided stillness and nervous system reset tailored to your current pace.',
    description:
      'A calm, restorative 60-minute session combining guided breath regulation, present-moment awareness, and practical tools you can carry into high-pressure workdays.',
    imageUrl: IMG_MINDFULNESS,
    iconName: 'Wind',
    benefits: [
      'Lower daily mental noise and reactivity',
      'Personalized 10-minute morning or evening grounding routine',
      'Practical breath anchors for stressful transitions',
    ],
    duration: '60 min',
    format: 'In-Person or Virtual',
    priceLabel: 'Individual Session',
    ctaLabel: 'Book a Session',
    featured: true,
    active: true,
  },
  {
    id: 'srv-2',
    title: 'Personal Development & Clarity Coaching',
    slug: 'personal-development-clarity-coaching',
    category: 'Personal Development',
    summary: 'Structured partnership for life transitions, purposeful direction, and steady habits.',
    description:
      'Designed for individuals navigating change, seeking deeper alignment, or wanting thoughtful accountability to turn personal insights into consistent daily action.',
    imageUrl: IMG_COACHING,
    iconName: 'Compass',
    benefits: [
      'Clarify core priorities and personal boundaries',
      'Build sustainable weekly rhythms without burnout',
      'Navigate career or life transitions with composure',
    ],
    duration: '60 min',
    format: 'In-Person or Virtual',
    priceLabel: 'Coaching Series',
    ctaLabel: 'Book a Session',
    featured: true,
    active: true,
  },
  {
    id: 'srv-3',
    title: 'Stress Management & Restoration',
    slug: 'stress-management-restoration',
    category: 'Stress Management',
    summary: 'Evidence-informed techniques to unwind chronic tension and restore emotional equilibrium.',
    description:
      'Focused sessions exploring how stress shows up in your body, schedule, and attention—paired with gentle somatic resets and sustainable recovery habits.',
    imageUrl: IMG_ABOUT,
    iconName: 'Feather',
    benefits: [
      'Identify hidden energy drains in your routine',
      'Practice down-regulation tools for restful sleep',
      'Strengthen emotional resilience under pressure',
    ],
    duration: '60 min',
    format: 'In-Person or Virtual',
    priceLabel: 'Focused Support',
    ctaLabel: 'Book a Session',
    featured: true,
    active: true,
  },
  {
    id: 'srv-4',
    title: 'Holistic Wellness Alignment',
    slug: 'holistic-wellness-alignment',
    category: 'Holistic Wellness',
    summary: 'Whole-person check-in connecting mental clarity, rest, movement, and intentional living.',
    description:
      'A comprehensive wellness consultation reviewing your energy, rest, mindfulness practices, and environment to build a realistic, nourishing personal cadence.',
    imageUrl: IMG_HERO,
    iconName: 'Sun',
    benefits: [
      'Balanced perspective across mind, body, and environment',
      'Actionable 30-day gentle lifestyle adjustments',
      'Written reflection summary after your session',
    ],
    duration: '75 min',
    format: 'In-Person or Virtual',
    priceLabel: 'Consultation',
    ctaLabel: 'Book a Session',
    featured: false,
    active: true,
  },
  {
    id: 'srv-5',
    title: 'Self-Discovery & Values Mapping',
    slug: 'self-discovery-values-mapping',
    category: 'Self-Discovery & Growth',
    summary: 'Deep reflective inquiry to reconnect with your authentic direction and inner voice.',
    description:
      'Guided journaling, dialogue, and values distillation to help you step back from external expectations and define what fulfillment looks like for you now.',
    imageUrl: IMG_BLOG,
    iconName: 'BookOpen',
    benefits: [
      'Articulate personal guiding principles',
      'Recognize limiting narratives with clarity',
      'Create an intentional personal compass',
    ],
    duration: '75 min',
    format: 'In-Person or Virtual',
    priceLabel: 'Deep Dive',
    ctaLabel: 'Book a Session',
    featured: false,
    active: true,
  },
  {
    id: 'srv-6',
    title: 'Small-Group Wellness Workshops',
    slug: 'small-group-wellness-workshops',
    category: 'Wellness Workshops',
    summary: 'Intimate gatherings and team sessions centered on mindfulness, focus, and calm culture.',
    description:
      'Curated half-day or 90-minute workshops for small groups, studios, and organizations seeking practical stress resilience and mindful communication.',
    imageUrl: IMG_APPROACH,
    iconName: 'Users',
    benefits: [
      'Interactive guided mindfulness and reflection exercises',
      'Shared vocabulary for sustainable pace and boundaries',
      'Custom-tailored themes for your group or team',
    ],
    duration: '90 min – Half Day',
    format: 'Sanctuary or On-Site',
    priceLabel: 'Group Experience',
    ctaLabel: 'Book a Session',
    featured: false,
    active: true,
  },
  {
    id: 'srv-7',
    title: 'Life Coaching & Ongoing Guidance',
    slug: 'life-coaching-ongoing-guidance',
    category: 'Life Coaching & Guidance',
    summary: 'Biweekly continuity sessions supporting purposeful growth across changing seasons.',
    description:
      'Steady, confidential guidance over 3 or 6 months so your intentions stay anchored as real-world commitments and opportunities unfold.',
    imageUrl: IMG_COACHING,
    iconName: 'Sprout',
    benefits: [
      'Consistent biweekly space for reflection and recalibration',
      'Between-session reflective check-in prompts',
      'Measurable progress toward meaningful life goals',
    ],
    duration: '60 min · Biweekly',
    format: 'In-Person or Virtual',
    priceLabel: 'Ongoing Program',
    ctaLabel: 'Book a Session',
    featured: false,
    active: true,
  },
  {
    id: 'srv-8',
    title: 'Individual Wellness Sanctuary Session',
    slug: 'individual-wellness-sanctuary-session',
    category: 'Individual Wellness Sessions',
    summary: 'A quiet, restorative 1:1 session blending stillness, dialogue, and somatic grounding.',
    description:
      'Step away from screens and obligations for an unhurried sanctuary hour combining quiet reflection, guided grounding, and personalized next steps.',
    imageUrl: IMG_MINDFULNESS,
    iconName: 'Sparkles',
    benefits: [
      'Immediate sense of calm and mental spaciousness',
      'Zero-rush conversational and mindfulness format',
      'Tailored take-home grounding practices',
    ],
    duration: '60 min',
    format: 'In-Person Sanctuary',
    priceLabel: 'Single Session',
    ctaLabel: 'Book a Session',
    featured: false,
    active: true,
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Placeholder Client Review 01',
    context: 'Sample Placeholder — Replace with verified client feedback in Admin',
    photoUrl: '',
    content:
      '“Sample testimonial placeholder: Replace this entry in the Admin Dashboard (/admin) with genuine feedback from a Lyte House Collective client once collected and approved.”',
    rating: 5,
    active: true,
    isPlaceholder: true,
  },
  {
    id: 'test-2',
    name: 'Placeholder Client Review 02',
    context: 'Sample Placeholder — Replace with verified client feedback in Admin',
    photoUrl: '',
    content:
      '“Sample testimonial placeholder: Highlight real client reflections on mindfulness sessions, personal coaching, or workshops directly through the Testimonials manager.”',
    rating: 5,
    active: true,
    isPlaceholder: true,
  },
  {
    id: 'test-3',
    name: 'Placeholder Client Review 03',
    context: 'Sample Placeholder — Replace with verified client feedback in Admin',
    photoUrl: '',
    content:
      '“Sample testimonial placeholder: Toggle any testimonial active or hidden, upload an optional portrait, and keep social proof authentic and transparent.”',
    rating: 5,
    active: true,
    isPlaceholder: true,
  },
];

export const DEFAULT_BLOG_CATEGORIES: string[] = [
  'Mental Wellness',
  'Mindfulness',
  'Personal Growth',
  'Healthy Lifestyle',
  'Self-Improvement',
  'Motivation & Inspiration',
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'creating-quiet-morning-rituals-for-mental-clarity',
    title: 'Creating Quiet Morning Rituals for Lasting Mental Clarity',
    excerpt:
      'How reclaiming the first twenty minutes of your day before notifications arrive gently reshapes focus, mood, and emotional steadiness.',
    content:
      'Most mornings begin with urgency before our feet even touch the floor. Reaching immediately for messages pulls the nervous system into reactive mode, asking it to process dozens of external priorities before we have even checked in with ourselves.\n\nA restorative morning ritual does not require an elaborate two-hour routine. Ten to twenty unhurried minutes—paired with warm herbal tea, three slow breaths by a window, and two honest lines in a notebook—can shift the emotional tone of an entire day.\n\nStart by choosing one sensory anchor: light, warmth, or stillness. Notice how your shoulders settle when nothing is demanded of you for a few quiet minutes. Over time, consistency matters far more than duration. When stillness becomes familiar, carrying calm into busy afternoons becomes natural.',
    featuredImageUrl: IMG_BLOG,
    author: 'Lyte House Editorial',
    publishedAt: '2026-11-04',
    category: 'Mindfulness',
    readTime: '4 min read',
    seoTitle: 'Creating Quiet Morning Rituals for Mental Clarity | Lyte House Collective',
    seoDescription:
      'Learn practical, sustainable morning mindfulness rituals to calm your nervous system and cultivate mental clarity.',
    seoKeywords: 'morning ritual, mindfulness, mental clarity, wellness habits',
    published: true,
  },
  {
    id: 'post-2',
    slug: 'recognizing-subtle-burnout-before-exhaustion',
    title: 'Recognizing Subtle Burnout Before Exhaustion Takes Over',
    excerpt:
      'Emotional fatigue rarely arrives all at once. Notice the quiet signals—cynicism, decision fog, and shallow breathing—early enough to recalibrate.',
    content:
      'Burnout is often pictured as a sudden collapse, yet for thoughtful, capable people it usually begins much more quietly. Small joys start feeling like obligations. Simple decisions feel unexpectedly heavy. Even during time off, the mind continues rehearsing tomorrow’s obligations.\n\nPaying attention to early somatic cues is one of the most compassionate skills in personal development. Notice when your breath stays high in your chest, when patience thins over minor friction, or when rest leaves you strangely restless.\n\nRecalibration begins with subtraction rather than adding another productivity tool. Identify one commitment this week that can be simplified, delayed, or shared, and pair that boundary with intentional restorative time.',
    featuredImageUrl: IMG_APPROACH,
    author: 'Lyte House Editorial',
    publishedAt: '2026-10-22',
    category: 'Mental Wellness',
    readTime: '5 min read',
    seoTitle: 'Recognizing Subtle Burnout Early | Lyte House Collective',
    seoDescription:
      'Discover early somatic and emotional signs of burnout and grounded ways to restore balance before exhaustion.',
    seoKeywords: 'burnout recovery, mental wellness, stress management, emotional balance',
    published: true,
  },
  {
    id: 'post-3',
    slug: 'sustainable-personal-growth-without-perfectionism',
    title: 'Sustainable Personal Growth Without Perfectionism',
    excerpt:
      'Why gentle, repeatable daily habits consistently outlast intense self-improvement sprints—and how to measure progress humanely.',
    content:
      'Many self-improvement plans fail not because of a lack of motivation, but because they are designed for an idealized version of life with unlimited energy and zero interruptions.\n\nSustainable personal growth expects real life to happen. It asks: what is the smallest meaningful version of this habit I can keep on an ordinary Tuesday? By lowering friction and releasing all-or-nothing thinking, progress becomes steady and self-trust deepens.\n\nGrowth does not need to feel harsh to be transformative. Patience, honest reflection, and steady encouragement create room for changes that genuinely endure.',
    featuredImageUrl: IMG_COACHING,
    author: 'Lyte House Editorial',
    publishedAt: '2026-10-08',
    category: 'Personal Growth',
    readTime: '4 min read',
    seoTitle: 'Sustainable Personal Growth Without Perfectionism | Lyte House Collective',
    seoDescription:
      'Build lasting personal development habits without perfectionism or burnout through grounded daily practices.',
    seoKeywords: 'personal growth, self-improvement, sustainable habits, coaching',
    published: true,
  },
];

export const DEFAULT_SEO_PAGES: PageSeo[] = [
  {
    path: '/',
    label: 'Home',
    title: 'Lyte House Collective – Wellness & Personal Transformation',
    description:
      'Mindfulness coaching, holistic wellness sessions, and personal transformation designed for lasting clarity and emotional balance.',
    keywords: 'Lyte House Collective, wellness, mindfulness, personal development, life coaching',
    ogImageUrl: IMG_HERO,
    slug: 'home',
  },
  {
    path: '/about',
    label: 'About Us',
    title: 'About Us | Lyte House Collective',
    description:
      'Learn about the mission, values, and grounded wellness philosophy guiding Lyte House Collective.',
    keywords: 'about Lyte House Collective, wellness philosophy, mindfulness mission',
    ogImageUrl: IMG_ABOUT,
    slug: 'about',
  },
  {
    path: '/services',
    label: 'Services',
    title: 'Wellness & Coaching Services | Lyte House Collective',
    description:
      'Explore mindfulness sessions, personal development coaching, stress management, and wellness workshops.',
    keywords: 'mindfulness sessions, personal development coaching, stress management, wellness workshops',
    ogImageUrl: IMG_MINDFULNESS,
    slug: 'services',
  },
  {
    path: '/approach',
    label: 'Our Approach',
    title: 'Our Approach to Balance & Growth | Lyte House Collective',
    description:
      'Discover our six-pillar approach uniting mind-body awareness, mindfulness, and sustainable lifestyle change.',
    keywords: 'mind-body connection, self-awareness, holistic balance, personal empowerment',
    ogImageUrl: IMG_APPROACH,
    slug: 'approach',
  },
  {
    path: '/blog',
    label: 'Blog & Resources',
    title: 'Wellness Journal & Resources | Lyte House Collective',
    description:
      'Read thoughtful essays and practical guides on mindfulness, mental wellness, and intentional living.',
    keywords: 'wellness blog, mindfulness resources, mental wellness articles',
    ogImageUrl: IMG_BLOG,
    slug: 'blog',
  },
  {
    path: '/contact',
    label: 'Contact',
    title: 'Contact & Book a Session | Lyte House Collective',
    description:
      'Connect with Lyte House Collective by phone (604-889-9050), email, or online inquiry to begin your wellness journey.',
    keywords: 'contact Lyte House Collective, book wellness session, Vancouver wellness',
    ogImageUrl: IMG_HERO,
    slug: 'contact',
  },
];

export const DEFAULT_LEGAL: LegalPages = {
  privacyPolicy: {
    title: 'Privacy Policy',
    lastUpdated: 'November 2026',
    content:
      'Lyte House Collective respects your privacy and treats all personal inquiries, appointment details, and session notes with strict confidentiality.\n\n1. Information We Collect\nWhen you submit a contact inquiry or book a session, we collect your name, email address, phone number, and any message or session preferences you choose to share.\n\n2. How We Use Information\nYour details are used solely to respond to your inquiry, coordinate appointments, and send booking confirmations or requested updates. We never sell or rent personal information to third parties.\n\n3. Location & Map Services\nOur Contact page embeds Google Maps to display our studio location. Interaction with map features is subject to Google Maps End User Terms and Privacy Policy.\n\n4. Contact for Privacy Requests\nTo update or remove your stored information, please email jared@lytehousecollective.com or call (604) 889-9050.',
  },
  termsAndConditions: {
    title: 'Terms & Conditions',
    lastUpdated: 'November 2026',
    content:
      'Welcome to Lyte House Collective. By accessing this website or scheduling a wellness or personal development session, you agree to the following terms.\n\n1. Scope of Services\nLyte House Collective provides mindfulness guidance, holistic wellness consultations, workshops, and personal development coaching. Services are educational and supportive in nature and do not replace licensed medical, psychiatric, or emergency care.\n\n2. Scheduling & Rescheduling\nAppointments may be requested through our booking form. Please provide at least 24 hours notice if you need to reschedule an individual session.\n\n3. Intellectual Property\nAll original site copy, session materials, and journal resources belong to Lyte House Collective unless otherwise noted.\n\n4. Questions\nIf you have questions regarding these terms, reach out to jared@lytehousecollective.com.',
  },
};

export const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    title: 'Sanctuary Morning Hero',
    url: IMG_HERO,
    altText: 'Sunlit limestone and oak wellness sanctuary opening onto a misty botanical garden',
    category: 'Banners',
    source: 'generated',
    createdAt: '2026-11-01T09:00:00.000Z',
  },
  {
    id: 'med-2',
    title: 'Travertine Studio Corner',
    url: IMG_ABOUT,
    altText: 'Minimalist wellness studio bench with eucalyptus in stoneware vase',
    category: 'Studio',
    source: 'generated',
    createdAt: '2026-11-01T09:05:00.000Z',
  },
  {
    id: 'med-3',
    title: 'Mindfulness & Tea Mat',
    url: IMG_MINDFULNESS,
    altText: 'Woven meditation mat with linen cushion and ceramic tea bowl',
    category: 'Services',
    source: 'generated',
    createdAt: '2026-11-01T09:10:00.000Z',
  },
  {
    id: 'med-4',
    title: 'Coaching Lounge Conversation',
    url: IMG_COACHING,
    altText: 'Warm oak armchairs and open reflection journal in coaching studio',
    category: 'Services',
    source: 'generated',
    createdAt: '2026-11-01T09:15:00.000Z',
  },
  {
    id: 'med-5',
    title: 'Misty Forest Balance',
    url: IMG_APPROACH,
    altText: 'Tranquil misty forest and still water reflection at dawn',
    category: 'Approach',
    source: 'generated',
    createdAt: '2026-11-01T09:20:00.000Z',
  },
  {
    id: 'med-6',
    title: 'Morning Reflection Journal',
    url: IMG_BLOG,
    altText: 'Cloth-bound journal and chamomile tea on warm linen',
    category: 'Blog',
    source: 'generated',
    createdAt: '2026-11-01T09:25:00.000Z',
  },
];

export const DEFAULT_PUBLIC_SITE_PAYLOAD: PublicSitePayload = {
  settings: DEFAULT_SETTINGS,
  home: DEFAULT_HOME,
  about: DEFAULT_ABOUT,
  approach: DEFAULT_APPROACH,
  services: DEFAULT_SERVICES,
  serviceCategories: DEFAULT_SERVICE_CATEGORIES,
  testimonials: DEFAULT_TESTIMONIALS,
  blogPosts: DEFAULT_BLOG_POSTS,
  blogCategories: DEFAULT_BLOG_CATEGORIES,
  seoPages: DEFAULT_SEO_PAGES,
  legal: DEFAULT_LEGAL,
  media: DEFAULT_MEDIA,
};
