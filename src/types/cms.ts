export interface BrandColors {
  canvas: string;
  surface: string;
  ink: string;
  accent: string;
  accentDeep: string;
}

export interface BusinessHour {
  day: string;
  hours: string;
  closed?: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  enabled: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  enabled: boolean;
}

export interface SectionToggles {
  philosophy: boolean;
  services: boolean;
  whyChooseUs: boolean;
  transformation: boolean;
  testimonials: boolean;
  finalCta: boolean;
}

export interface MapLocation {
  address: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  zoom: number;
  markerLabel: string;
}

export interface AutomationSettings {
  autoConfirmBookings: boolean;
  bookingConfirmationTemplate: string;
  contactConfirmationTemplate: string;
  reminderLeadHours: number;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  logoUrl: string;
  faviconUrl: string;
  brandColors: BrandColors;
  location: MapLocation;
  businessHours: BusinessHour[];
  socialLinks: SocialLink[];
  sectionToggles: SectionToggles;
  navigation: NavItem[];
  footer: {
    description: string;
    copyright: string;
    privacyNotice: string;
  };
  automationSettings: AutomationSettings;
}

export interface HomeContent {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    videoUrl: string;
    imageUrl: string;
    imageAlt: string;
  };
  philosophy: {
    eyebrow: string;
    headline: string;
    body: string;
    secondaryBody: string;
    imageUrl: string;
    imageAlt: string;
    ctaLabel: string;
  };
  whyChooseUs: {
    eyebrow: string;
    headline: string;
    intro: string;
    items: Array<{
      id: string;
      number: string;
      title: string;
      description: string;
    }>;
  };
  transformation: {
    eyebrow: string;
    headline: string;
    body: string;
    imageUrl: string;
    imageAlt: string;
    pillars: Array<{
      id: string;
      title: string;
      detail: string;
    }>;
  };
  finalCta: {
    eyebrow: string;
    headline: string;
    body: string;
    buttonLabel: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  isPlaceholder: boolean;
}

export interface AboutContent {
  eyebrow: string;
  headline: string;
  intro: string;
  imageUrl: string;
  imageAlt: string;
  missionTitle: string;
  missionBody: string;
  visionTitle: string;
  visionBody: string;
  commitmentTitle: string;
  commitmentBody: string;
  values: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  teamSectionTitle: string;
  teamSectionNote: string;
  team: TeamMember[];
}

export interface ApproachPillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  practiceNote: string;
  imageUrl: string;
}

export interface ApproachContent {
  eyebrow: string;
  headline: string;
  intro: string;
  heroImageUrl: string;
  heroImageAlt: string;
  pillars: ApproachPillar[];
  closingQuote: string;
  closingAttribution: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  imageUrl: string;
  iconName: string;
  benefits: string[];
  duration: string;
  format: string;
  priceLabel: string;
  ctaLabel: string;
  featured: boolean;
  active: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  context: string;
  photoUrl: string;
  content: string;
  rating: number;
  active: boolean;
  isPlaceholder: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  author: string;
  publishedAt: string;
  category: string;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  published: boolean;
}

export interface PageSeo {
  path: string;
  label: string;
  title: string;
  description: string;
  keywords: string;
  ogImageUrl: string;
  slug: string;
}

export interface LegalPages {
  privacyPolicy: {
    title: string;
    lastUpdated: string;
    content: string;
  };
  termsAndConditions: {
    title: string;
    lastUpdated: string;
    content: string;
  };
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  altText: string;
  category: string;
  source: 'generated' | 'uploaded';
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  autoReplySent: boolean;
}

export type BookingStatus = 'Confirmed' | 'Pending' | 'Rescheduled' | 'Completed' | 'Cancelled';

export interface AppointmentBooking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  date: string;
  timeSlot: string;
  format: 'In-Person Sanctuary' | 'Virtual Session';
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
  confirmationCode: string;
}

export interface CommunicationLog {
  id: string;
  recipientName: string;
  recipientEmail: string;
  channel: 'Automated Email Confirmation' | 'Booking Status Update' | 'Contact Auto-Acknowledgement';
  subject: string;
  body: string;
  relatedId: string;
  sentAt: string;
}

export interface PublicSitePayload {
  settings: SiteSettings;
  home: HomeContent;
  about: AboutContent;
  approach: ApproachContent;
  services: ServiceItem[];
  serviceCategories: string[];
  testimonials: TestimonialItem[];
  blogPosts: BlogPost[];
  blogCategories: string[];
  seoPages: PageSeo[];
  legal: LegalPages;
  media: MediaItem[];
}
