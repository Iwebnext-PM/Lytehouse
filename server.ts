import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express, { type NextFunction, type Request, type Response } from 'express';
import { DEFAULT_PUBLIC_SITE_PAYLOAD } from './src/data/defaultSiteData.ts';
import type {
  AppointmentBooking,
  BlogPost,
  BookingStatus,
  CommunicationLog,
  ContactInquiry,
  MediaItem,
  PublicSitePayload,
  ServiceItem,
  TestimonialItem,
} from './src/types/cms.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const AUTH_PATH = path.join(DATA_DIR, 'auth.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

interface DatabaseSchema extends PublicSitePayload {
  inquiries: ContactInquiry[];
  bookings: AppointmentBooking[];
  communications: CommunicationLog[];
}

interface AuthConfig {
  email: string;
  passwordSalt: string;
  passwordHash: string;
  sessionSecret: string;
  updatedAt: string;
}

const DEFAULT_TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
];

function cloneDefaultDb(): DatabaseSchema {
  return {
    ...structuredClone(DEFAULT_PUBLIC_SITE_PAYLOAD),
    inquiries: [],
    bookings: [],
    communications: [],
  };
}

function readDb(): DatabaseSchema {
  if (!fs.existsSync(DB_PATH)) {
    const initial = cloneDefaultDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    const defaults = cloneDefaultDb();
    return {
      settings: parsed.settings ?? defaults.settings,
      home: parsed.home ?? defaults.home,
      about: parsed.about ?? defaults.about,
      approach: parsed.approach ?? defaults.approach,
      services: Array.isArray(parsed.services) ? parsed.services : defaults.services,
      serviceCategories: Array.isArray(parsed.serviceCategories)
        ? parsed.serviceCategories
        : defaults.serviceCategories,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaults.testimonials,
      blogPosts: Array.isArray(parsed.blogPosts) ? parsed.blogPosts : defaults.blogPosts,
      blogCategories: Array.isArray(parsed.blogCategories)
        ? parsed.blogCategories
        : defaults.blogCategories,
      seoPages: Array.isArray(parsed.seoPages) ? parsed.seoPages : defaults.seoPages,
      legal: parsed.legal ?? defaults.legal,
      media: Array.isArray(parsed.media) ? parsed.media : defaults.media,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
      communications: Array.isArray(parsed.communications) ? parsed.communications : [],
    };
  } catch {
    const initial = cloneDefaultDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

function writeDb(data: DatabaseSchema): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function readAuthConfig(): AuthConfig | null {
  if (fs.existsSync(AUTH_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(AUTH_PATH, 'utf8')) as AuthConfig;
      if (parsed.email && parsed.passwordHash && parsed.passwordSalt && parsed.sessionSecret) {
        return parsed;
      }
    } catch {
      return null;
    }
  }
  if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim().length >= 6) {
    const salt = crypto.randomBytes(16).toString('hex');
    const cfg: AuthConfig = {
      email: (process.env.ADMIN_EMAIL || 'jared@lytehousecollective.com').toLowerCase(),
      passwordSalt: salt,
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD.trim(), salt),
      sessionSecret: process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(AUTH_PATH, JSON.stringify(cfg, null, 2), 'utf8');
    return cfg;
  }
  return null;
}

function writeAuthConfig(cfg: AuthConfig): void {
  fs.writeFileSync(AUTH_PATH, JSON.stringify(cfg, null, 2), 'utf8');
}

function createSessionToken(email: string, secret: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string | undefined, cfg: AuthConfig | null): string | null {
  if (!token || !cfg) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', cfg.sessionSecret).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      email?: string;
      exp?: number;
    };
    if (!decoded.email || !decoded.exp || decoded.exp < Date.now()) {
      return null;
    }
    return decoded.email;
  } catch {
    return null;
  }
}

function extractToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith('lhc_admin_session=')) {
      return decodeURIComponent(cookie.slice('lhc_admin_session='.length));
    }
  }
  return undefined;
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const cfg = readAuthConfig();
  const token = extractToken(req);
  const email = verifySessionToken(token, cfg);
  if (!email) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function applyTemplate(template: string, vars: Record<string, string>): string {
  let output = template;
  for (const [k, v] of Object.entries(vars)) {
    output = output.replaceAll(`{{${k}}}`, v);
  }
  return output;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeXml(str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.use('/uploads', express.static(UPLOADS_DIR));

  // Public site payload
  app.get('/api/site', (_req, res) => {
    const db = readDb();
    const payload: PublicSitePayload = {
      settings: db.settings,
      home: db.home,
      about: db.about,
      approach: db.approach,
      services: db.services,
      serviceCategories: db.serviceCategories,
      testimonials: db.testimonials,
      blogPosts: db.blogPosts,
      blogCategories: db.blogCategories,
      seoPages: db.seoPages,
      legal: db.legal,
      media: db.media,
    };
    res.json(payload);
  });

  app.get('/api/config/maps', (_req, res) => {
    const apiKey =
      process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
    res.json({ apiKey });
  });

  // Booking availability
  app.get('/api/bookings/slots', (req, res) => {
    const date = typeof req.query.date === 'string' ? req.query.date.trim() : '';
    if (!date) {
      res.json({ slots: DEFAULT_TIME_SLOTS.map((time) => ({ time, available: true })) });
      return;
    }
    const db = readDb();
    const taken = new Set(
      db.bookings
        .filter((b) => b.date === date && b.status !== 'Cancelled')
        .map((b) => b.timeSlot)
    );
    res.json({
      slots: DEFAULT_TIME_SLOTS.map((time) => ({
        time,
        available: !taken.has(time),
      })),
    });
  });

  // Contact submission + automated client acknowledgement
  app.post('/api/contact', (req, res) => {
    const body = req.body as Partial<ContactInquiry>;
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const subject = (body.subject || '').trim();
    const message = (body.message || '').trim();

    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: 'Please complete all required fields.' });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const db = readDb();
    const inquiry: ContactInquiry = {
      id: `inq-${crypto.randomUUID().slice(0, 8)}`,
      name: name.slice(0, 120),
      email: email.slice(0, 160),
      phone: phone.slice(0, 40),
      subject: subject.slice(0, 180),
      message: message.slice(0, 4000),
      read: false,
      createdAt: new Date().toISOString(),
      autoReplySent: true,
    };

    const autoReplyText = applyTemplate(db.settings.automationSettings.contactConfirmationTemplate, {
      name: inquiry.name,
      subject: inquiry.subject,
    });

    const commLog: CommunicationLog = {
      id: `comm-${crypto.randomUUID().slice(0, 8)}`,
      recipientName: inquiry.name,
      recipientEmail: inquiry.email,
      channel: 'Contact Auto-Acknowledgement',
      subject: `We received your message — ${db.settings.businessName}`,
      body: autoReplyText,
      relatedId: inquiry.id,
      sentAt: new Date().toISOString(),
    };

    db.inquiries.unshift(inquiry);
    db.communications.unshift(commLog);
    writeDb(db);

    res.status(201).json({
      success: true,
      inquiry,
      autoReply: commLog,
    });
  });

  // Appointment booking + automated confirmation
  app.post('/api/bookings', (req, res) => {
    const body = req.body as Partial<AppointmentBooking>;
    const serviceId = (body.serviceId || '').trim();
    const date = (body.date || '').trim();
    const timeSlot = (body.timeSlot || '').trim();
    const format =
      body.format === 'Virtual Session' ? 'Virtual Session' : 'In-Person Sanctuary';
    const clientName = (body.clientName || '').trim();
    const clientEmail = (body.clientEmail || '').trim();
    const clientPhone = (body.clientPhone || '').trim();
    const notes = (body.notes || '').trim();

    if (!serviceId || !date || !timeSlot || !clientName || !clientEmail) {
      res.status(400).json({ error: 'Please complete all required booking fields.' });
      return;
    }
    if (!isValidEmail(clientEmail)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    const db = readDb();
    const service = db.services.find((s) => s.id === serviceId && s.active);
    if (!service) {
      res.status(404).json({ error: 'Selected service is unavailable.' });
      return;
    }

    const conflict = db.bookings.some(
      (b) => b.date === date && b.timeSlot === timeSlot && b.status !== 'Cancelled'
    );
    if (conflict) {
      res.status(409).json({ error: 'That time slot has just been reserved. Please choose another.' });
      return;
    }

    const confirmationCode = `LHC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const initialStatus: BookingStatus = db.settings.automationSettings.autoConfirmBookings
      ? 'Confirmed'
      : 'Pending';

    const booking: AppointmentBooking = {
      id: `bk-${crypto.randomUUID().slice(0, 8)}`,
      serviceId: service.id,
      serviceTitle: service.title,
      date,
      timeSlot,
      format,
      clientName: clientName.slice(0, 120),
      clientEmail: clientEmail.slice(0, 160),
      clientPhone: clientPhone.slice(0, 40),
      notes: notes.slice(0, 2000),
      status: initialStatus,
      createdAt: new Date().toISOString(),
      confirmationCode,
    };

    const confirmationBody = applyTemplate(
      db.settings.automationSettings.bookingConfirmationTemplate,
      {
        name: booking.clientName,
        service: booking.serviceTitle,
        format: booking.format,
        date: booking.date,
        time: booking.timeSlot,
        code: booking.confirmationCode,
      }
    );

    const commLog: CommunicationLog = {
      id: `comm-${crypto.randomUUID().slice(0, 8)}`,
      recipientName: booking.clientName,
      recipientEmail: booking.clientEmail,
      channel: 'Automated Email Confirmation',
      subject: `Session ${initialStatus}: ${booking.serviceTitle} (${booking.confirmationCode})`,
      body: confirmationBody,
      relatedId: booking.id,
      sentAt: new Date().toISOString(),
    };

    db.bookings.unshift(booking);
    db.communications.unshift(commLog);
    writeDb(db);

    res.status(201).json({
      success: true,
      booking,
      confirmation: commLog,
    });
  });

  // Auth status & login
  app.get('/api/auth/status', (req, res) => {
    const cfg = readAuthConfig();
    const token = extractToken(req);
    const verifiedEmail = verifySessionToken(token, cfg);
    res.json({
      configured: Boolean(cfg),
      authenticated: Boolean(verifiedEmail),
      email: verifiedEmail || cfg?.email || 'jared@lytehousecollective.com',
    });
  });

  app.post('/api/auth/setup', (req, res) => {
    const existing = readAuthConfig();
    if (existing) {
      res.status(409).json({ error: 'Admin account is already configured. Please sign in.' });
      return;
    }
    const body = req.body as { email?: string; password?: string };
    const email = (body.email || 'jared@lytehousecollective.com').trim().toLowerCase();
    const password = (body.password || '').trim();
    if (!isValidEmail(email) || password.length < 6) {
      res.status(400).json({ error: 'Provide a valid email and a password of at least 6 characters.' });
      return;
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const cfg: AuthConfig = {
      email,
      passwordSalt: salt,
      passwordHash: hashPassword(password, salt),
      sessionSecret: process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
      updatedAt: new Date().toISOString(),
    };
    writeAuthConfig(cfg);
    const token = createSessionToken(cfg.email, cfg.sessionSecret);
    res.setHeader(
      'Set-Cookie',
      `lhc_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
    res.status(201).json({ authenticated: true, email: cfg.email, token });
  });

  app.post('/api/auth/login', (req, res) => {
    const cfg = readAuthConfig();
    if (!cfg) {
      res.status(400).json({ error: 'Admin password not initialized yet.' });
      return;
    }
    const body = req.body as { email?: string; password?: string };
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();
    const attemptedHash = hashPassword(password, cfg.passwordSalt);
    const matchesPassword =
      attemptedHash.length === cfg.passwordHash.length &&
      crypto.timingSafeEqual(Buffer.from(attemptedHash), Buffer.from(cfg.passwordHash));
    if (email !== cfg.email || !matchesPassword) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }
    const token = createSessionToken(cfg.email, cfg.sessionSecret);
    res.setHeader(
      'Set-Cookie',
      `lhc_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
    res.json({ authenticated: true, email: cfg.email, token });
  });

  app.post('/api/auth/logout', (_req, res) => {
    res.setHeader('Set-Cookie', 'lhc_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    res.json({ authenticated: false });
  });

  // Protected Admin Routes
  app.get('/api/admin/dashboard', requireAdmin, (_req, res) => {
    const db = readDb();
    res.json(db);
  });

  app.post('/api/admin/password', requireAdmin, (req, res) => {
    const cfg = readAuthConfig();
    if (!cfg) {
      res.status(400).json({ error: 'Admin auth not configured.' });
      return;
    }
    const body = req.body as { currentPassword?: string; newPassword?: string; email?: string };
    const current = (body.currentPassword || '').trim();
    const nextPass = (body.newPassword || '').trim();
    const attemptedHash = hashPassword(current, cfg.passwordSalt);
    const matches =
      attemptedHash.length === cfg.passwordHash.length &&
      crypto.timingSafeEqual(Buffer.from(attemptedHash), Buffer.from(cfg.passwordHash));
    if (!matches) {
      res.status(401).json({ error: 'Current password is incorrect.' });
      return;
    }
    if (nextPass.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters.' });
      return;
    }
    const newSalt = crypto.randomBytes(16).toString('hex');
    const nextEmail = body.email && isValidEmail(body.email.trim())
      ? body.email.trim().toLowerCase()
      : cfg.email;
    const updated: AuthConfig = {
      email: nextEmail,
      passwordSalt: newSalt,
      passwordHash: hashPassword(nextPass, newSalt),
      sessionSecret: cfg.sessionSecret,
      updatedAt: new Date().toISOString(),
    };
    writeAuthConfig(updated);
    const token = createSessionToken(updated.email, updated.sessionSecret);
    res.json({ success: true, email: updated.email, token });
  });

  app.put('/api/admin/settings', requireAdmin, (req, res) => {
    const db = readDb();
    db.settings = req.body;
    writeDb(db);
    res.json(db.settings);
  });

  app.put('/api/admin/home', requireAdmin, (req, res) => {
    const db = readDb();
    db.home = req.body;
    writeDb(db);
    res.json(db.home);
  });

  app.put('/api/admin/about', requireAdmin, (req, res) => {
    const db = readDb();
    db.about = req.body;
    writeDb(db);
    res.json(db.about);
  });

  app.put('/api/admin/approach', requireAdmin, (req, res) => {
    const db = readDb();
    db.approach = req.body;
    writeDb(db);
    res.json(db.approach);
  });

  app.put('/api/admin/legal', requireAdmin, (req, res) => {
    const db = readDb();
    db.legal = req.body;
    writeDb(db);
    res.json(db.legal);
  });

  app.put('/api/admin/seo', requireAdmin, (req, res) => {
    const db = readDb();
    db.seoPages = req.body;
    writeDb(db);
    res.json(db.seoPages);
  });

  app.put('/api/admin/service-categories', requireAdmin, (req, res) => {
    const db = readDb();
    const cats = Array.isArray(req.body?.categories) ? req.body.categories : [];
    db.serviceCategories = cats.map((c: unknown) => String(c).trim()).filter(Boolean);
    writeDb(db);
    res.json(db.serviceCategories);
  });

  app.post('/api/admin/services', requireAdmin, (req, res) => {
    const db = readDb();
    const body = req.body as Partial<ServiceItem>;
    const title = (body.title || '').trim();
    if (!title) {
      res.status(400).json({ error: 'Service title is required.' });
      return;
    }
    const item: ServiceItem = {
      id: `srv-${crypto.randomUUID().slice(0, 8)}`,
      title,
      slug: body.slug ? slugify(body.slug) : slugify(title),
      category: body.category || db.serviceCategories[0] || 'Holistic Wellness',
      summary: body.summary || '',
      description: body.description || '',
      imageUrl: body.imageUrl || DEFAULT_PUBLIC_SITE_PAYLOAD.services[0].imageUrl,
      iconName: body.iconName || 'Wind',
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      duration: body.duration || '60 min',
      format: body.format || 'In-Person or Virtual',
      priceLabel: body.priceLabel || 'Individual Session',
      ctaLabel: body.ctaLabel || 'Book a Session',
      featured: Boolean(body.featured),
      active: body.active !== false,
    };
    db.services.push(item);
    writeDb(db);
    res.status(201).json(item);
  });

  app.put('/api/admin/services/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.services.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Service not found.' });
      return;
    }
    const body = req.body as Partial<ServiceItem>;
    const updated: ServiceItem = {
      ...db.services[idx],
      ...body,
      id: db.services[idx].id,
      slug: body.slug ? slugify(body.slug) : slugify(body.title || db.services[idx].title),
    };
    db.services[idx] = updated;
    writeDb(db);
    res.json(updated);
  });

  app.delete('/api/admin/services/:id', requireAdmin, (req, res) => {
    const db = readDb();
    db.services = db.services.filter((s) => s.id !== req.params.id);
    writeDb(db);
    res.json({ deleted: true });
  });

  app.post('/api/admin/testimonials', requireAdmin, (req, res) => {
    const db = readDb();
    const body = req.body as Partial<TestimonialItem>;
    const item: TestimonialItem = {
      id: `test-${crypto.randomUUID().slice(0, 8)}`,
      name: (body.name || 'Client').trim(),
      context: (body.context || '').trim(),
      photoUrl: (body.photoUrl || '').trim(),
      content: (body.content || '').trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      active: body.active !== false,
      isPlaceholder: Boolean(body.isPlaceholder),
    };
    db.testimonials.unshift(item);
    writeDb(db);
    res.status(201).json(item);
  });

  app.put('/api/admin/testimonials/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.testimonials.findIndex((t) => t.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Testimonial not found.' });
      return;
    }
    db.testimonials[idx] = {
      ...db.testimonials[idx],
      ...(req.body as Partial<TestimonialItem>),
      id: db.testimonials[idx].id,
    };
    writeDb(db);
    res.json(db.testimonials[idx]);
  });

  app.delete('/api/admin/testimonials/:id', requireAdmin, (req, res) => {
    const db = readDb();
    db.testimonials = db.testimonials.filter((t) => t.id !== req.params.id);
    writeDb(db);
    res.json({ deleted: true });
  });

  app.put('/api/admin/blog-categories', requireAdmin, (req, res) => {
    const db = readDb();
    const cats = Array.isArray(req.body?.categories) ? req.body.categories : [];
    db.blogCategories = cats.map((c: unknown) => String(c).trim()).filter(Boolean);
    writeDb(db);
    res.json(db.blogCategories);
  });

  app.post('/api/admin/blog', requireAdmin, (req, res) => {
    const db = readDb();
    const body = req.body as Partial<BlogPost>;
    const title = (body.title || '').trim();
    if (!title) {
      res.status(400).json({ error: 'Post title is required.' });
      return;
    }
    const post: BlogPost = {
      id: `post-${crypto.randomUUID().slice(0, 8)}`,
      slug: body.slug ? slugify(body.slug) : slugify(title),
      title,
      excerpt: body.excerpt || '',
      content: body.content || '',
      featuredImageUrl: body.featuredImageUrl || DEFAULT_PUBLIC_SITE_PAYLOAD.blogPosts[0].featuredImageUrl,
      author: body.author || 'Lyte House Editorial',
      publishedAt: body.publishedAt || new Date().toISOString().slice(0, 10),
      category: body.category || db.blogCategories[0] || 'Mindfulness',
      readTime: body.readTime || '4 min read',
      seoTitle: body.seoTitle || `${title} | Lyte House Collective`,
      seoDescription: body.seoDescription || body.excerpt || '',
      seoKeywords: body.seoKeywords || '',
      published: body.published !== false,
    };
    db.blogPosts.unshift(post);
    writeDb(db);
    res.status(201).json(post);
  });

  app.put('/api/admin/blog/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.blogPosts.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Article not found.' });
      return;
    }
    const body = req.body as Partial<BlogPost>;
    db.blogPosts[idx] = {
      ...db.blogPosts[idx],
      ...body,
      id: db.blogPosts[idx].id,
      slug: body.slug ? slugify(body.slug) : slugify(body.title || db.blogPosts[idx].title),
    };
    writeDb(db);
    res.json(db.blogPosts[idx]);
  });

  app.delete('/api/admin/blog/:id', requireAdmin, (req, res) => {
    const db = readDb();
    db.blogPosts = db.blogPosts.filter((p) => p.id !== req.params.id);
    writeDb(db);
    res.json({ deleted: true });
  });

  // Media Library Upload / Replace / Delete
  app.post('/api/admin/media/upload', requireAdmin, (req, res) => {
    const body = req.body as {
      dataUrl?: string;
      filename?: string;
      title?: string;
      altText?: string;
      category?: string;
    };
    const dataUrl = body.dataUrl || '';
    const match = /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,([A-Za-z0-9+/=]+)$/.exec(
      dataUrl
    );
    if (!match) {
      res.status(400).json({ error: 'Unsupported image format. Please upload PNG, JPG, WebP, GIF, or SVG.' });
      return;
    }
    const rawExt = match[1];
    const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt;
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length > 8 * 1024 * 1024) {
      res.status(413).json({ error: 'Image must be smaller than 8 MB.' });
      return;
    }
    const baseName = slugify(path.parse(body.filename || 'upload').name) || 'image';
    const fileName = `${baseName}-${crypto.randomUUID().slice(0, 6)}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, fileName), buffer);

    const db = readDb();
    const item: MediaItem = {
      id: `med-${crypto.randomUUID().slice(0, 8)}`,
      title: (body.title || body.filename || 'Uploaded Image').trim(),
      url: `/uploads/${fileName}`,
      altText: (body.altText || body.title || 'Lyte House Collective wellness imagery').trim(),
      category: (body.category || 'Uploads').trim(),
      source: 'uploaded',
      createdAt: new Date().toISOString(),
    };
    db.media.unshift(item);
    writeDb(db);
    res.status(201).json(item);
  });

  app.put('/api/admin/media/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.media.findIndex((m) => m.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Media item not found.' });
      return;
    }
    const body = req.body as { title?: string; altText?: string; category?: string; dataUrl?: string };
    const existing = db.media[idx];
    let nextUrl = existing.url;

    if (body.dataUrl) {
      const match = /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,([A-Za-z0-9+/=]+)$/.exec(
        body.dataUrl
      );
      if (!match) {
        res.status(400).json({ error: 'Invalid replacement image.' });
        return;
      }
      const rawExt = match[1];
      const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt;
      const fileName = `replaced-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      fs.writeFileSync(path.join(UPLOADS_DIR, fileName), Buffer.from(match[2], 'base64'));
      nextUrl = `/uploads/${fileName}`;
    }

    db.media[idx] = {
      ...existing,
      title: body.title?.trim() || existing.title,
      altText: body.altText?.trim() || existing.altText,
      category: body.category?.trim() || existing.category,
      url: nextUrl,
      source: body.dataUrl ? 'uploaded' : existing.source,
    };
    writeDb(db);
    res.json(db.media[idx]);
  });

  app.delete('/api/admin/media/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const target = db.media.find((m) => m.id === req.params.id);
    if (target && target.source === 'uploaded' && target.url.startsWith('/uploads/')) {
      const filePath = path.join(UPLOADS_DIR, path.basename(target.url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    db.media = db.media.filter((m) => m.id !== req.params.id);
    writeDb(db);
    res.json({ deleted: true });
  });

  // Inquiries management
  app.patch('/api/admin/inquiries/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.inquiries.findIndex((i) => i.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }
    const body = req.body as { read?: boolean };
    db.inquiries[idx].read = Boolean(body.read);
    writeDb(db);
    res.json(db.inquiries[idx]);
  });

  app.delete('/api/admin/inquiries/:id', requireAdmin, (req, res) => {
    const db = readDb();
    db.inquiries = db.inquiries.filter((i) => i.id !== req.params.id);
    writeDb(db);
    res.json({ deleted: true });
  });

  // Bookings management + automated status notification log
  app.patch('/api/admin/bookings/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.bookings.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    const body = req.body as { status?: BookingStatus; date?: string; timeSlot?: string };
    const prev = db.bookings[idx];
    const nextStatus = body.status || prev.status;
    db.bookings[idx] = {
      ...prev,
      status: nextStatus,
      date: body.date || prev.date,
      timeSlot: body.timeSlot || prev.timeSlot,
    };

    const updated = db.bookings[idx];
    const comm: CommunicationLog = {
      id: `comm-${crypto.randomUUID().slice(0, 8)}`,
      recipientName: updated.clientName,
      recipientEmail: updated.clientEmail,
      channel: 'Booking Status Update',
      subject: `Session Update (${updated.status}): ${updated.serviceTitle}`,
      body: `Hello ${updated.clientName}, your booking (${updated.confirmationCode}) for ${updated.serviceTitle} on ${updated.date} at ${updated.timeSlot} is now marked as ${updated.status}.`,
      relatedId: updated.id,
      sentAt: new Date().toISOString(),
    };
    db.communications.unshift(comm);
    writeDb(db);
    res.json({ booking: updated, communication: comm });
  });

  app.delete('/api/admin/bookings/:id', requireAdmin, (req, res) => {
    const db = readDb();
    db.bookings = db.bookings.filter((b) => b.id !== req.params.id);
    writeDb(db);
    res.json({ deleted: true });
  });

  // Dynamic XML Sitemap & Robots.txt
  app.get('/sitemap.xml', (req, res) => {
    const db = readDb();
    const baseUrl =
      process.env.APP_URL?.replace(/\/$/, '') ||
      `${req.protocol}://${req.get('host')}`;
    const urls = [
      ...db.seoPages.map((p) => `${baseUrl}${p.path === '/' ? '' : p.path}`),
      ...db.blogPosts
        .filter((p) => p.published)
        .map((p) => `${baseUrl}/blog/${p.slug}`),
      `${baseUrl}/privacy`,
      `${baseUrl}/terms`,
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${escapeXml(u)}</loc><changefreq>weekly</changefreq></url>`)
      .join('\n')}\n</urlset>`;
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  });

  app.get('/robots.txt', (req, res) => {
    const baseUrl =
      process.env.APP_URL?.replace(/\/$/, '') ||
      `${req.protocol}://${req.get('host')}`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });

  // Vite dev middleware or production static assets
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Lyte House Collective server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
