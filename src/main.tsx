import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Heart,
  Mail,
  MapPin,
  Sparkles,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import './index.css';
import { engagementData as d } from './data/engagementData';
import couplePhoto from './assets/WhatsApp Image 2026-09-18 at 12.38.03 AM.jpeg';
import gopuramImage from './assets/temple-gopuram.png';
import { InvitationExperience } from './InvitationExperience';

type RSVPStatus = 'accept' | 'decline';
type Step = 0 | 1 | 2;

interface RSVPFormState {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  guests: number;
  dietary: string;
  breakfast: 'yes' | 'no' | '';
  lunch: 'yes' | 'no' | '';
}

interface RSVPSubmission {
  status: RSVPStatus;
  form: RSVPFormState;
}

const initialFormState: RSVPFormState = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
  guests: 0,
  dietary: '',
  breakfast: '',
  lunch: '',
};

const eventDate = new Date(d.event.iso);

function getTimeLeft(targetMs: number) {
  const diff = Math.max(targetMs - Date.now(), 0);
  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const statCardStyle =
  'rounded-2xl border border-white/80 bg-white/25 p-4 shadow-[0_10px_30px_rgba(70,44,52,0.08)] backdrop-blur-sm';
const ambientFloat = {
  duration: 10,
  repeat: Infinity,
  repeatType: 'mirror' as const,
  ease: [0.42, 0, 0.58, 1] as const,
};

const dreamyPetals = [
  { left: '12%', top: '18%', delay: 0, duration: 7, rotate: 18 },
  { left: '25%', top: '62%', delay: 1.4, duration: 8, rotate: -24 },
  { left: '72%', top: '20%', delay: 0.8, duration: 6.5, rotate: 35 },
  { left: '84%', top: '55%', delay: 2, duration: 7.5, rotate: -12 },
  { left: '58%', top: '12%', delay: 2.8, duration: 8.5, rotate: 48 },
];

function App() {
  const [activeStep, setActiveStep] = useState<Step>(0);
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus | null>(null);
  const [form, setForm] = useState<RSVPFormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof RSVPFormState, string>>>({});
  const [submitted, setSubmitted] = useState<RSVPSubmission | null>(null);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(eventDate.getTime()));
  const { scrollYProgress } = useScroll();

  const gopuramScale = useTransform(scrollYProgress, [0, 0.7], [1.35, 1]);
  const gopuramY = useTransform(scrollYProgress, [0, 1], [20, -80]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft(eventDate.getTime()));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdownItems = useMemo(
    () => [
      { label: 'Days', value: timeLeft.days },
      { label: 'Hours', value: timeLeft.hours },
      { label: 'Minutes', value: timeLeft.minutes },
      { label: 'Seconds', value: timeLeft.seconds },
    ],
    [timeLeft],
  );

  const eventDateLabel = useMemo(
    () =>
      eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [],
  );

  const updateField = (field: keyof RSVPFormState, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value } as RSVPFormState));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof RSVPFormState, string>> = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.phone.trim() || !/^\+?[0-9\s-]{8,15}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Please enter a valid phone number.';
    }

    return nextErrors;
  };

  const handleSelectStatus = (status: RSVPStatus) => {
    setRsvpStatus(status);
    setActiveStep(1);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateForm();

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload: RSVPSubmission = {
      status: rsvpStatus ?? 'accept',
      form: {
        ...form,
        guests: rsvpStatus === 'accept' ? form.guests : 0,
        dietary: rsvpStatus === 'accept' ? form.dietary : '',
        breakfast: rsvpStatus === 'accept' ? form.breakfast : '',
        lunch: rsvpStatus === 'accept' ? form.lunch : '',
      },
    };

    setSubmitted(payload);
    setActiveStep(2);
  };

  const handleBackToForm = () => {
    setActiveStep(1);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#21151f] px-4 py-5 text-slate-800 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="overflow-hidden rounded-[2.5rem] border border-[#f2d9cf]/30 bg-[#f6ede8] shadow-[0_35px_100px_rgba(0,0,0,0.3)]"
        >
          <div className="relative overflow-hidden">
            <img
              src={gopuramImage}
              alt=""
              className="pointer-events-none absolute -right-24 -top-24 z-0 h-[520px] w-[420px] object-contain opacity-[0.12] mix-blend-multiply"
            />
            <motion.div
              animate={{ x: [0, 18, 0], y: [0, -16, 0], rotate: [0, 12, 0] }}
              transition={ambientFloat}
              className="absolute -left-14 top-10 h-48 w-48 rounded-full bg-[#f7d7c5]/70 blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -22, 0], y: [0, 20, 0], rotate: [0, -10, 0] }}
              transition={{ ...ambientFloat, duration: 12 }}
              className="absolute -right-10 top-16 h-52 w-52 rounded-full bg-[#dfe3f6]/80 blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ ...ambientFloat, duration: 9 }}
              className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-[#f2d0a8]/40 blur-3xl"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute right-10 top-10 h-24 w-24 rounded-full border border-white/50"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
              className="absolute left-10 top-24 h-16 w-16 rounded-full border border-[#d7bca5]/60"
            />

            <div className="relative z-10 p-5 sm:p-8 lg:p-12">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.section
                    key="invite"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="space-y-10"
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8b5d5d]">
                      <span className="flex items-center gap-3"><span className="h-px w-8 bg-[#c28f83]" /> Dharwad · 2026</span>
                      <motion.span
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="rounded-full border border-[#cfa99b] bg-[#fff9f2]/70 px-3 py-1.5"
                      >
                        Save the date
                      </motion.span>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                      <div>
                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 }}
                          className="mb-5 text-[11px] font-semibold uppercase tracking-[0.42em] text-[#a26262]"
                        >
                          Invitation to celebrate
                        </motion.p>

                        <motion.h1
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12 }}
                          className="font-serif text-6xl leading-[0.84] text-[#321c2b] sm:text-7xl lg:text-[6.7rem]"
                        >
                          {d.couple.pavan}
                          <span className="mx-2 text-[#b56e68]">&amp;</span>
                          {d.couple.sanjana}
                        </motion.h1>

                        <motion.p
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.18 }}
                          className="mt-7 max-w-md text-sm leading-8 text-[#5d474d] sm:text-base"
                        >
                          You are warmly invited to share in the joy of our engagement celebration as we begin a beautiful new chapter together.
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.22 }}
                          className="mt-9 flex flex-col gap-3 sm:flex-row"
                        >
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => handleSelectStatus('accept')}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#321c2b] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#5c3349]"
                          >
                            Joyfully Accept
                            <ArrowRight size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => handleSelectStatus('decline')}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cda394] bg-[#fff9f2]/70 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#321c2b] transition hover:bg-white"
                          >
                            Regretfully Decline
                          </motion.button>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.14, duration: 0.55 }}
                        className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-[#fff9f2] shadow-[0_24px_60px_rgba(62,42,50,0.16)]"
                      >
                        <div className="relative h-56 overflow-hidden sm:h-72">
                          <img src={couplePhoto} alt={`${d.couple.pavan} and ${d.couple.sanjana}`} className="h-full w-full object-cover object-center" />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(38,19,31,0.02),rgba(38,19,31,0.52))]" />
                          <div className="absolute bottom-5 left-5 text-[10px] font-semibold uppercase tracking-[0.32em] text-white">Together is our favorite place</div>
                        </div>
                        <div className="p-5 sm:p-6">
                        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.32em] text-[#7d5e57]">
                          <span>{d.event.title}</span>
                          <Sparkles size={14} />
                        </div>

                        <div className="mt-5 text-4xl font-semibold tracking-tight text-[#321c2b] font-serif">
                          {d.event.date}
                        </div>

                        <div className="mt-5 space-y-4 border-t border-[#e7d8ca] pt-5 text-sm text-[#493d40]">
                          <div className="flex items-start gap-3">
                            <CalendarDays className="mt-0.5 text-[#8d6555]" size={16} />
                            <span>{eventDateLabel}</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock3 className="mt-0.5 text-[#8d6555]" size={16} />
                            <span>Saturday, 6:00 PM onwards</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 text-[#8d6555]" size={16} />
                            <span>{d.event.venue}, {d.event.city}</span>
                          </div>
                        </div>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 }}
                      className="grid gap-3 sm:grid-cols-4"
                    >
                      {countdownItems.map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 + index * 0.08 }}
                          className={statCardStyle}
                        >
                          <p className="text-[10px] uppercase tracking-[0.26em] text-[#826963]">{item.label}</p>
                          <p className="mt-3 font-serif text-3xl text-[#2d1b23]">{String(item.value).padStart(2, '0')}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.section>
                )}

                {activeStep === 1 && (
                  <motion.section
                    key="rsvp"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="rounded-[1.75rem] border border-white/70 bg-white/55 p-4 shadow-[0_18px_45px_rgba(62,42,50,0.08)] backdrop-blur-sm sm:p-6 lg:p-8"
                  >
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setActiveStep(0)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#d7bca5] bg-white/60 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#2d1b23] transition hover:bg-white"
                      >
                        <ChevronLeft size={14} />
                        Back
                      </button>

                      <div className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#8a695f]">
                        {rsvpStatus === 'accept' ? 'Accepting invitation' : 'Sending regrets'}
                      </div>
                    </div>

                    <div className="mb-8 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#8d665d]">RSVP form</p>
                      <h2 className="mt-3 font-serif text-4xl text-[#2d1b23] sm:text-5xl">We would love to hear from you</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#58474b] sm:col-span-2">
                          Full name
                          <input
                            type="text"
                            value={form.fullName}
                            onChange={(event) => updateField('fullName', event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-[#d9c8be] bg-white/70 px-4 py-3 text-sm text-[#2d1b23] outline-none transition focus:border-[#a87d6a] focus:ring-2 focus:ring-[#e6d0c4]"
                            placeholder="Your full name"
                          />
                          {errors.fullName && <span className="mt-2 block text-xs text-[#a53e3e]">{errors.fullName}</span>}
                        </label>

                        <label className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#58474b] sm:col-span-2">
                          Email
                          <input
                            type="email"
                            value={form.email}
                            onChange={(event) => updateField('email', event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-[#d9c8be] bg-white/70 px-4 py-3 text-sm text-[#2d1b23] outline-none transition focus:border-[#a87d6a] focus:ring-2 focus:ring-[#e6d0c4]"
                            placeholder="name@example.com"
                          />
                          {errors.email && <span className="mt-2 block text-xs text-[#a53e3e]">{errors.email}</span>}
                        </label>

                        <label className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#58474b] sm:col-span-2">
                          Phone no.
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(event) => updateField('phone', event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-[#d9c8be] bg-white/70 px-4 py-3 text-sm text-[#2d1b23] outline-none transition focus:border-[#a87d6a] focus:ring-2 focus:ring-[#e6d0c4]"
                            placeholder="+91 98765 43210"
                          />
                          {errors.phone && <span className="mt-2 block text-xs text-[#a53e3e]">{errors.phone}</span>}
                        </label>

                        {rsvpStatus === 'accept' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="contents"
                          >
                            <label className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#58474b]">
                              Plus-ones
                              <select
                                value={form.guests}
                                onChange={(event) => updateField('guests', Number(event.target.value))}
                                className="mt-2 w-full rounded-2xl border border-[#d9c8be] bg-white/70 px-4 py-3 text-sm text-[#2d1b23] outline-none transition focus:border-[#a87d6a] focus:ring-2 focus:ring-[#e6d0c4]"
                              >
                                {[0, 1, 2, 3].map((option) => (
                                  <option key={option} value={option}>
                                    {option} extra guest{option === 1 ? '' : 's'}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <label className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#58474b]">
                              Dietary preference
                              <input
                                type="text"
                                value={form.dietary}
                                onChange={(event) => updateField('dietary', event.target.value)}
                                className="mt-2 w-full rounded-2xl border border-[#d9c8be] bg-white/70 px-4 py-3 text-sm text-[#2d1b23] outline-none transition focus:border-[#a87d6a] focus:ring-2 focus:ring-[#e6d0c4]"
                                placeholder="Vegetarian, vegan, no onion..."
                              />
                            </label>

                            <div className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#58474b]">
                              Breakfast
                              <div className="mt-2 grid grid-cols-2 gap-3">
                                {(['yes', 'no'] as const).map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => updateField('breakfast', option)}
                                    className={`rounded-2xl border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                                      form.breakfast === option
                                        ? 'border-[#a87d6a] bg-[#f6e4de] text-[#2d1b23]'
                                        : 'border-[#d9c8be] bg-white/70 text-[#574a4d] hover:bg-white'
                                    }`}
                                  >
                                    {option === 'yes' ? 'Yes' : 'No'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#58474b]">
                              Lunch
                              <div className="mt-2 grid grid-cols-2 gap-3">
                                {(['yes', 'no'] as const).map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => updateField('lunch', option)}
                                    className={`rounded-2xl border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                                      form.lunch === option
                                        ? 'border-[#a87d6a] bg-[#f6e4de] text-[#2d1b23]'
                                        : 'border-[#d9c8be] bg-white/70 text-[#574a4d] hover:bg-white'
                                    }`}
                                  >
                                    {option === 'yes' ? 'Yes' : 'No'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <label className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#58474b]">
                        Blessings / message
                        <textarea
                          rows={5}
                          value={form.message}
                          onChange={(event) => updateField('message', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-[#d9c8be] bg-white/70 px-4 py-3 text-sm text-[#2d1b23] outline-none transition focus:border-[#a87d6a] focus:ring-2 focus:ring-[#e6d0c4]"
                          placeholder={rsvpStatus === 'accept' ? 'Share your wishes for the couple...' : 'We will miss you, but we wish you well...'}
                        />
                      </label>

                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setActiveStep(0)}
                          className="inline-flex items-center justify-center rounded-full border border-[#d7bca5] bg-white/80 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#2d1b23] transition hover:bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2d1b23] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#48313c]"
                        >
                          Submit RSVP
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </form>
                  </motion.section>
                )}

                {activeStep === 2 && submitted && (
                  <motion.section
                    key="success"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="rounded-[1.75rem] border border-[#e4d7c9] bg-white/60 p-6 shadow-[0_18px_40px_rgba(62,42,50,0.08)] backdrop-blur-sm sm:p-8"
                  >
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ecf8ef] text-[#1d7a3e]"
                    >
                      <CheckCircle2 size={44} />
                    </motion.div>

                    <div className="mt-6 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#8d665d]">Your RSVP is confirmed</p>
                      <h2 className="mt-3 font-serif text-4xl text-[#2d1b23] sm:text-5xl">Thank you, {submitted.form.fullName}</h2>
                    </div>

                    <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
                      <div className={statCardStyle}>
                        <div className="flex items-center gap-2 text-[#8d665d]">
                          <Heart size={16} />
                          <span className="text-[10px] uppercase tracking-[0.28em]">Response</span>
                        </div>
                        <p className="mt-3 text-lg font-medium text-[#2d1b23]">
                          {submitted.status === 'accept' ? 'Joyfully Accepting' : 'Regretfully Declining'}
                        </p>
                      </div>

                      <div className={statCardStyle}>
                        <div className="flex items-center gap-2 text-[#8d665d]">
                          <Mail size={16} />
                          <span className="text-[10px] uppercase tracking-[0.28em]">Email</span>
                        </div>
                        <p className="mt-3 text-sm text-[#2d1b23]">{submitted.form.email}</p>
                      </div>

                      {submitted.status === 'accept' && (
                        <div className={statCardStyle}>
                          <div className="flex items-center gap-2 text-[#8d665d]">
                            <Users size={16} />
                            <span className="text-[10px] uppercase tracking-[0.28em]">Guests</span>
                          </div>
                          <p className="mt-3 text-lg font-medium text-[#2d1b23]">{submitted.form.guests} extra guest{submitted.form.guests === 1 ? '' : 's'}</p>
                        </div>
                      )}

                      <div className={statCardStyle}>
                        <div className="flex items-center gap-2 text-[#8d665d]">
                          <Mail size={16} />
                          <span className="text-[10px] uppercase tracking-[0.28em]">Phone</span>
                        </div>
                        <p className="mt-3 text-sm text-[#2d1b23]">{submitted.form.phone || 'Not provided'}</p>
                      </div>

                      {submitted.status === 'accept' && (
                        <div className={statCardStyle}>
                          <div className="flex items-center gap-2 text-[#8d665d]">
                            <UtensilsCrossed size={16} />
                            <span className="text-[10px] uppercase tracking-[0.28em]">Diet</span>
                          </div>
                          <p className="mt-3 text-sm text-[#2d1b23]">{submitted.form.dietary || 'No preference specified'}</p>
                        </div>
                      )}

                      {submitted.status === 'accept' && (
                        <div className={statCardStyle}>
                          <div className="flex items-center gap-2 text-[#8d665d]">
                            <UtensilsCrossed size={16} />
                            <span className="text-[10px] uppercase tracking-[0.28em]">Meals</span>
                          </div>
                          <p className="mt-3 text-sm text-[#2d1b23]">
                            Breakfast: {submitted.form.breakfast === 'yes' ? 'Yes' : 'No'} · Lunch: {submitted.form.lunch === 'yes' ? 'Yes' : 'No'}
                          </p>
                        </div>
                      )}

                      {submitted.form.message && (
                        <div className="sm:col-span-2 rounded-2xl border border-[#e7d8ca] bg-[#fffaf8] p-4 text-sm leading-7 text-[#4e3f42]">
                          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8d665d]">
                            <Heart size={12} />
                            Message
                          </div>
                          {submitted.form.message}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleBackToForm}
                        className="inline-flex items-center justify-center rounded-full border border-[#d7bca5] bg-white/80 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#2d1b23] transition hover:bg-white"
                      >
                        Modify choices
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStep(0)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2d1b23] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#48313c]"
                      >
                        Back to invitation
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.section
          aria-label="Temple backdrop"
          className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,#f8e8e6,#eee6f3_48%,#f8eedf)] p-2 shadow-[0_30px_90px_rgba(77,58,68,0.14)] sm:p-3"
        >
          <div className="relative overflow-hidden rounded-[1.55rem] bg-[#eadbe2]">
            <motion.div
              style={{ scale: gopuramScale, y: gopuramY }}
              className="absolute inset-[-10%] z-0 flex items-center justify-center"
              initial={{ opacity: 0.05 }}
              whileInView={{ opacity: 0.18 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              aria-hidden="true"
            >
              <img
                src={gopuramImage}
                alt=""
                className="h-full w-auto max-w-none mix-blend-multiply opacity-70 blur-[0.2px]"
              />
            </motion.div>

            <motion.div
              style={{ scale: gopuramScale, y: gopuramY }}
              className="relative z-10 h-[360px] w-full bg-cover bg-[center_38%] sm:h-[440px]"
              initial={{ opacity: 0.7 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              aria-hidden="true"
            >
            <div
              className="absolute inset-0 bg-cover bg-[center_38%]"
              style={{
                backgroundImage: `url("${couplePhoto}")`,
              }}
            />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(246,213,214,0.26),rgba(222,216,245,0.14),rgba(255,241,213,0.22))] mix-blend-screen" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.3),transparent_42%),linear-gradient(180deg,transparent_45%,rgba(64,38,53,0.24))]" />
            </motion.div>

            <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
              {dreamyPetals.map((petal) => (
                <motion.span
                  key={`${petal.left}-${petal.top}`}
                  animate={{ y: [0, -22, 0], x: [0, 12, -4, 0], rotate: [petal.rotate, petal.rotate + 24, petal.rotate - 10, petal.rotate] }}
                  transition={{ duration: petal.duration, delay: petal.delay, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute h-3 w-2 rounded-[100%_0_100%_0] bg-[#fff3ed]/80 shadow-[0_0_16px_rgba(255,238,226,0.9)]"
                  style={{ left: petal.left, top: petal.top }}
                />
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[#3b2731]/25 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-3 px-5 py-8 text-center sm:px-10 sm:py-10">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-[10px] font-semibold uppercase tracking-[0.44em] text-[#986f76]"
            >
              Sacred beginning
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.08, duration: 0.5, ease: 'easeOut' }}
              className="font-serif text-4xl text-[#3b2731] sm:text-5xl"
            >
              A blessing for the journey ahead
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.12, duration: 0.5, ease: 'easeOut' }}
              className="max-w-xl text-sm leading-7 text-[#705c65] sm:text-base"
            >
              With grace, love, and the blessings of family, we invite you to witness this beautiful chapter of our lives.
            </motion.p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<InvitationExperience />);
