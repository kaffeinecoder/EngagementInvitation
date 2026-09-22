import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Heart,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import "./index.css";
import { engagementData as d } from "./data/engagementData";
import couplePhoto from "./assets/WhatsApp Image 2026-09-18 at 12.38.03 AM.jpeg";
import page2Photo from "./assets/page2.jpeg";
import gopuramImage from "./assets/temple-gopuram.png";
import musicTrack from "./assets/music.mpeg";
import { OurStoryTimeline } from "./components/OurStoryTimeline";

// ==================== EDITABLE CONTENT CONFIGURATION ====================
const EVENT_CONFIG = [
  {
    time: "8:30 AM",
    title: "Welcome Ceremony",
    venue: "Vidya Bharati Sabha Bhavan, Dharwad",
    description: "We welcome you to begin this special day together.",
    lat: 15.4589,
    lng: 75.0078,
    startISO: "2026-10-24T08:30:00+05:30",
    endISO: "2026-10-24T09:00:00+05:30",
  },
  {
    time: "9:00 AM",
    title: "Breakfast",
    venue: "Vidya Bharati Sabha Bhavan, Dharwad",
    description:
      "Enjoy breakfast and warm conversations with family and friends.",
    lat: 15.4589,
    lng: 75.0078,
    startISO: "2026-10-24T09:00:00+05:30",
    endISO: "2026-10-24T10:00:00+05:30",
  },
  {
    time: "10:30 AM",
    title: "Ganapati Pooje",
    venue: "Vidya Bharati Sabha Bhavan, Dharwad",
    description: "A sacred prayer seeking blessings for the journey ahead.",
    lat: 15.4589,
    lng: 75.0078,
    startISO: "2026-10-24T10:30:00+05:30",
    endISO: "2026-10-24T11:30:00+05:30",
  },
  {
    time: "12:00 PM onwards",
    title: "Ring Ceremony",
    venue: "Vidya Bharati Sabha Bhavan, Dharwad",
    description:
      "Join us as we exchange rings and celebrate this beautiful beginning.",
    lat: 15.4589,
    lng: 75.0078,
    startISO: "2026-10-24T12:00:00+05:30",
    endISO: "2026-10-24T12:30:00+05:30",
  },
  {
    time: "12:30 PM onwards",
    title: "Lunch & Celebration",
    venue: "Vidya Bharati Sabha Bhavan, Dharwad",
    description:
      "Stay for lunch, joyful conversations, and more celebrating together.",
    lat: 15.4589,
    lng: 75.0078,
    startISO: "2026-10-24T12:30:00+05:30",
    endISO: "2026-10-24T14:30:00+05:30",
  },
];

const PRIMARY_EVENT = EVENT_CONFIG[0];

const WISH_PALETTE = ["#fff1eb", "#f4f0fb", "#eef6f0", "#fff7dd", "#edf4f8"];
const RSVP_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyy0Yhb9ouMe6WoqqfcAf1qrVDOypH17AkbYGuCRJFOYM5pIQlhyGwy1B3EjXfiqJJ1/exec";
const MUSIC_START_SECONDS = 29;
// ========================================================================

type RSVPStatus = "accept" | "decline";
type RSVPStep = 0 | 1 | 2 | 3 | 4;
type Wish = { id: string; name: string; message: string; color: string };
const initialForm = {
  fullName: "",
  side: "" as "pavan" | "sanjana" | "",
  attending: "" as RSVPStatus | "",
  guests: 1,
  message: "",
};
const eventDate = new Date(d.event.iso);
const statCardStyle =
  "rounded-2xl border border-white/80 bg-white/25 p-4 shadow-[0_10px_30px_rgba(70,44,52,0.08)] backdrop-blur-sm";
function sanitizeText(value: string, maxLength = 1000) {
  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}
function getTimeLeft(targetMs: number) {
  const totalSeconds = Math.floor(Math.max(targetMs - Date.now(), 0) / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}
function getStoredWishes(): Wish[] {
  try {
    const stored = window.localStorage.getItem("pavan-sanjana-wishes");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// ==================== FEATURE 1: ENVELOPE INTRO ====================
function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(
    () =>
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.sessionStorage.getItem("pavan-sanjana-envelope-opened"),
  );
  const open = () => {
    if (opened) return;
    setOpened(true);
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "auto" });
    onOpen();
    window.sessionStorage.setItem("pavan-sanjana-envelope-opened", "true");
    window.setTimeout(() => setVisible(false), 1900);
  };
  if (!visible) return null;
  return (
    <div
      className={`envelope-overlay ${opened ? "is-opening" : ""}`}
      onClick={open}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => event.key === "Enter" && open()}
      aria-label="Open invitation"
    >
      <div className="envelope-stage">
        <div className="invitation-card serif">
          Pavan <span>&amp;</span> Sanjana
          <div className="invitation-card-date">24 October 2026</div>
        </div>
        <div className="envelope-body">
          <div className="envelope-flap" />
          <div className="wax-seal">
            P <span>&amp;</span> S
          </div>
        </div>
        <p className="envelope-prompt">Tap to open</p>
      </div>
    </div>
  );
}

function MusicControls({ playRequested }: { playRequested: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  const playFromMusicOffset = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const start = () => {
      audio.currentTime = MUSIC_START_SECONDS;
      void audio.play().catch(() => undefined);
    };
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      start();
    } else {
      audio.addEventListener("loadedmetadata", start, { once: true });
      audio.load();
    }
  };

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    setMuted(false);
    playFromMusicOffset();
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !muted;
    audio.muted = nextMuted;
    setMuted(nextMuted);
    if (!nextMuted) playFromMusicOffset();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = false;
    const restartFromOffset = () => {
      if (!audio.muted) playFromMusicOffset();
    };
    audio.addEventListener("ended", restartFromOffset);
    if (!playRequested) {
      return () => audio.removeEventListener("ended", restartFromOffset);
    }
    playFromMusicOffset();
    return () => {
      audio.removeEventListener("ended", restartFromOffset);
      audio.pause();
    };
  }, [playRequested]);

  return (
    <>
      <audio ref={audioRef} src={musicTrack} preload="auto" aria-hidden="true" />
      <button
        type="button"
        className="music-toggle"
        onClick={muted ? startMusic : toggleMute}
        aria-label={muted ? "Unmute music" : "Mute music"}
        title={muted ? "Unmute music" : "Mute music"}
      >
        {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
      </button>
    </>
  );
}

// ==================== FEATURE 2: PHOTO GALLERY ====================
function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className="section-heading"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <p>{eyebrow}</p>
      <h2 className="serif">{title}</h2>
    </motion.div>
  );
}
// ==================== FEATURE 3: EVENT SCHEDULE ====================
function createCalendarFile(event: (typeof EVENT_CONFIG)[number]) {
  const toCalendarDate = (iso: string) =>
    new Date(iso)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${toCalendarDate(event.startISO)}`,
    `DTEND:${toCalendarDate(event.endISO)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.venue}`,
    `DESCRIPTION:${event.description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/calendar;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
function Schedule() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section className="feature-section" id="schedule">
      <SectionHeading eyebrow="The Celebration" title="A day to remember" />
      <div className="timeline">
        {EVENT_CONFIG.map((event, index) => (
          <motion.article
            className={`timeline-item event-card-${index}`}
            key={`${event.title}-${event.time}`}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -18 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
          >
            <div className="timeline-dot" />
            <div className="timeline-card">
              <p className="timeline-time">{event.time}</p>
              <h3 className="serif">{event.title}</h3>
              <p>{event.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

// ==================== FEATURE 4: MULTI-STEP RSVP ====================
function RSVP() {
  const [step, setStep] = useState<RSVPStep>(0);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const update = (field: keyof typeof initialForm, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };
  const advance = () => {
    if (step === 0 && !sanitizeText(form.fullName, 100))
      return setError("Please enter your full name.");
    if (step === 1 && !form.side)
      return setError("Please choose Pavan's or Sanjana's side.");
    if (step === 2 && !form.attending)
      return setError("Please choose an answer.");
    if (
      step === 3 &&
      form.attending === "accept" &&
      (form.guests < 1 || form.guests > 8)
    )
      return setError("Choose between 1 and 8 guests.");
    setStep((current) => (current === 4 ? 4 : ((current + 1) as RSVPStep)));
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (step !== 4) return advance();
    setSending(true);
    setError("");
    const payload = {
      fullName: sanitizeText(form.fullName, 100),
      side: form.side,
      attending: form.attending,
      guests: form.attending === "accept" ? form.guests : 0,
      message: sanitizeText(form.message, 500),
    };
    try {
      await fetch(RSVP_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not send your RSVP. Please check your connection and try again.",
      );
    } finally {
      setSending(false);
    }
  };
  if (submitted)
    return (
      <section className="feature-section rsvp-section">
        <div className="rsvp-success">
          <CheckCircle2 size={42} />
          <p>RSVP received</p>
          <h2 className="serif">
            Thank you, {sanitizeText(form.fullName, 100)}
          </h2>
          <span>
            You are responding from{" "}
            {form.side === "pavan" ? "Pavan's" : "Sanjana's"} side. We are so
            happy to celebrate with you.
          </span>
          {form.message && (
            <p className="confirmation-message">
              “{sanitizeText(form.message, 500)}”
            </p>
          )}
          <div className="confetti" aria-hidden="true">
            ✦ · ✧ · ✦ · ✧ · ✦
          </div>
        </div>
      </section>
    );
  const labels = [
    "Your name",
    "Whose side are you from?",
    "Will you join us?",
    "How many guests?",
    "A note for us",
  ];
  return (
    <section className="feature-section rsvp-section" id="rsvp">
      <SectionHeading eyebrow="RSVP" title="Will you celebrate with us?" />
      <div className="rsvp-panel">
        <div className="progress-track">
          <span style={{ width: `${((step + 1) / 5) * 100}%` }} />
        </div>
        <p className="progress-label">
          Step {step + 1} of 5 · {labels[step]}
        </p>
        <form onSubmit={submit} noValidate>
          {step === 0 && (
            <label>
              Full name
              <input
                autoFocus
                type="text"
                value={form.fullName}
                onChange={(event) => update("fullName", event.target.value)}
                placeholder="Your full name"
                maxLength={100}
              />
            </label>
          )}
          {step === 1 && (
            <div className="choice-grid">
              <button
                type="button"
                className={form.side === "pavan" ? "selected" : ""}
                onClick={() => update("side", "pavan")}
              >
                Pavan's side <Heart size={16} />
              </button>
              <button
                type="button"
                className={form.side === "sanjana" ? "selected" : ""}
                onClick={() => update("side", "sanjana")}
              >
                Sanjana's side <Heart size={16} />
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="choice-grid">
              <button
                type="button"
                className={form.attending === "accept" ? "selected" : ""}
                onClick={() => update("attending", "accept")}
              >
                Yes, with joy <Check size={16} />
              </button>
              <button
                type="button"
                className={form.attending === "decline" ? "selected" : ""}
                onClick={() => update("attending", "decline")}
              >
                Regretfully no <Heart size={16} />
              </button>
            </div>
          )}
          {step === 3 && form.attending === "accept" && (
            <label>
              Number of guests
              <input
                autoFocus
                type="number"
                min="1"
                max="8"
                value={form.guests}
                onChange={(event) =>
                  update("guests", Number(event.target.value))
                }
              />
            </label>
          )}
          {step === 3 && form.attending === "decline" && (
            <div className="rsvp-note">
              We will miss you, and we are grateful for your good wishes.
            </div>
          )}
          {step === 4 && (
            <label>
              Optional message
              <textarea
                autoFocus
                rows={5}
                maxLength={500}
                value={form.message}
                onChange={(event) => update("message", event.target.value)}
                placeholder="Leave a note for Pavan & Sanjana"
              />
            </label>
          )}
          {error && (
            <p className="input-error" role="alert">
              {error}
            </p>
          )}
          <div className="rsvp-actions">
            {step > 0 && (
              <button
                type="button"
                className="quiet-button"
                onClick={() => {
                  setStep((current) => (current - 1) as RSVPStep);
                  setError("");
                }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <button type="submit" className="dark-button" disabled={sending}>
              {sending ? "Sending..." : step === 4 ? "Send RSVP" : "Continue"}{" "}
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// ==================== FEATURE 5: GUEST WISHES WALL ====================
async function loadWishes(): Promise<Wish[]> {
  try {
    const response = await fetch("/api/wishes");
    if (!response.ok) throw new Error("Request failed");
    return await response.json();
  } catch {
    return getStoredWishes();
  }
}
async function saveWish(wish: Wish) {
  try {
    const response = await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wish),
    });
    if (!response.ok) throw new Error("Request failed");
  } catch {
    const current = getStoredWishes();
    window.localStorage.setItem(
      "pavan-sanjana-wishes",
      JSON.stringify([wish, ...current]),
    );
  }
}
function WishesWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    loadWishes().then(setWishes);
  }, []);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = sanitizeText(name, 80);
    const cleanMessage = sanitizeText(message, 200);
    if (!cleanName || !cleanMessage) {
      setError("Please add your name and a blessing.");
      return;
    }
    const wish = {
      id: `${Date.now()}`,
      name: cleanName,
      message: cleanMessage,
      color: WISH_PALETTE[wishes.length % WISH_PALETTE.length],
    };
    setWishes((current) => [wish, ...current]);
    setName("");
    setMessage("");
    setError("");
    await saveWish(wish);
  };
  return (
    <section className="feature-section wishes-section" id="wishes">
      <SectionHeading
        eyebrow="Blessings & Wishes"
        title="Leave a little love behind"
      />
      <form className="wish-form" onSubmit={submit} noValidate>
        <div className="wish-inputs">
          <input
            aria-label="Guest name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="Your name"
          />
          <div>
            <textarea
              aria-label="Your blessing"
              value={message}
              onChange={(event) => setMessage(event.target.value.slice(0, 200))}
              maxLength={200}
              placeholder="Write a blessing for the couple"
            />
            <span>{message.length}/200</span>
          </div>
        </div>
        <button type="submit" className="dark-button">
          <Send size={14} /> Send your blessing
        </button>
        {error && <p className="input-error">{error}</p>}
      </form>
      <div className="wishes-grid">
        {wishes.slice(0, showAll ? wishes.length : 6).map((wish) => (
          <article
            className="wish-card"
            style={{ backgroundColor: wish.color }}
            key={wish.id}
          >
            <MessageCircle size={16} />
            <p>{wish.message}</p>
            <strong>{wish.name}</strong>
          </article>
        ))}
      </div>
      {wishes.length > 6 && (
        <button
          type="button"
          className="quiet-button show-more"
          onClick={() => setShowAll((current) => !current)}
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </section>
  );
}

export function InvitationExperience() {
  const [musicStarted, setMusicStarted] = useState(false);
  const [musicRequested, setMusicRequested] = useState(() => {
    const envelopePending =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.sessionStorage.getItem("pavan-sanjana-envelope-opened");
    return envelopePending ? 0 : 1;
  });
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeLeft(eventDate.getTime()),
  );
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const gopuramScale = useTransform(scrollYProgress, [0, 0.7], [1.35, 1]);
  const gopuramY = useTransform(scrollYProgress, [0, 1], [20, -80]);
  useEffect(() => {
    const timer = window.setInterval(
      () => setTimeLeft(getTimeLeft(eventDate.getTime())),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);
  const eventDateLabel = useMemo(
    () =>
      eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );
  return (
    <>
      <EnvelopeIntro
        onOpen={() => {
          setMusicRequested((current) => current + 1);
          setMusicStarted(true);
        }}
      />
      <MusicControls playRequested={musicStarted ? 1 : 0} />
      <main className={`invitation-shell ${musicRequested ? "is-revealed" : ""} min-h-screen overflow-hidden bg-[#21151f] px-4 py-5 text-slate-800 sm:px-6 sm:py-8 lg:px-8`}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[2.5rem] border border-[#f2d9cf]/30 bg-[#f6ede8] shadow-[0_35px_100px_rgba(0,0,0,0.3)]"
          >
            <div className="relative overflow-hidden">
              <img
                src={gopuramImage}
                alt=""
                className="pointer-events-none absolute -right-24 -top-24 z-0 h-[520px] w-[420px] object-contain opacity-[0.12] mix-blend-multiply"
              />
              <div className="relative z-10 p-5 sm:p-8 lg:p-12">
                <section className="space-y-10">
                  <div className="hero-topline flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8b5d5d]">
                    <span className="flex items-center gap-3">
                      <span className="h-px w-8 bg-[#c28f83]" />
                      BAPPA'S BLESSINGS, OUR BEGINNINGS
                    </span>
                  </div>
                  <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.42em] text-[#a26262]">
                        Invitation to celebrate
                      </p>
                      <motion.h1
                        className="max-w-full break-words font-serif text-5xl leading-[0.9] text-[#321c2b] sm:text-7xl sm:leading-[0.84] lg:text-[6.7rem]"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
                        animate={shouldReduceMotion || musicRequested ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                      >
                        <motion.span
                          className="inline-block"
                          initial={shouldReduceMotion ? false : { opacity: 0, x: -18 }}
                          animate={shouldReduceMotion || musicRequested ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
                          transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
                        >
                          {d.couple.pavan}
                        </motion.span>
                        <motion.span
                          className="mx-2 inline-block text-[#b56e68]"
                          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.5, rotate: -12 }}
                          animate={shouldReduceMotion || musicRequested ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -12 }}
                          transition={{ duration: 0.6, delay: 0.42, ease: "backOut" }}
                        >
                          &amp;
                        </motion.span>
                        <motion.span
                          className="inline-block"
                          initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
                          animate={shouldReduceMotion || musicRequested ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }}
                          transition={{ duration: 0.75, delay: 0.25, ease: "easeOut" }}
                        >
                          {d.couple.sanjana}
                        </motion.span>
                      </motion.h1>
                      <p className="mt-7 max-w-md text-sm leading-8 text-[#5d474d] sm:text-base">
                        You are warmly invited to share in the joy of our
                        engagement celebration as we begin a beautiful new
                        chapter together.
                      </p>
                      <a href="#rsvp" className="dark-button mt-9 inline-flex">
                        RSVP now <ArrowRight size={14} />
                      </a>
                      <h2 className="mb-5 mt-8 pl-1 text-left text-3xl text-[#3b2731] sm:text-4xl">
                        Almost there, and we can't stop smiling
                      </h2>
                      <div className="grid max-w-xl gap-3 grid-cols-2 sm:grid-cols-4">
                        {Object.entries(timeLeft).map(([label, value], index) => (
                          <motion.div
                            className={`${statCardStyle} countdown-card`}
                            key={label}
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                            animate={shouldReduceMotion ? undefined : musicRequested ? { opacity: 1, y: [18, 0, 0] } : { opacity: 0, y: 18 }}
                            transition={shouldReduceMotion ? undefined : { duration: 0.7, delay: index * 0.12, ease: "easeOut" }}
                          >
                            <p className="text-[10px] uppercase tracking-[0.26em] text-[#826963]">
                              {label}
                            </p>
                            <p className="countdown-value mt-3 font-serif text-3xl text-[#2d1b23]">
                              {String(value).padStart(2, "0")}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-[#fff9f2] shadow-[0_24px_60px_rgba(62,42,50,0.16)]">
                      <div className="relative h-56 overflow-hidden sm:h-72">
                        <motion.img
                          src={couplePhoto}
                          alt={`${d.couple.pavan} and ${d.couple.sanjana}`}
                          className="hero-photo h-full w-full object-cover"
                          animate={shouldReduceMotion ? undefined : { scale: [1.02, 1.07, 1.02], y: [0, -5, 0] }}
                          transition={shouldReduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(38,19,31,0.02),rgba(38,19,31,0.52))]" />
                        <div className="absolute bottom-5 left-5 text-[10px] font-semibold uppercase tracking-[0.32em] text-white">
                          Together is our favorite place
                        </div>
                      </div>
                      <div className="p-5 sm:p-6">
                        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.32em] text-[#7d5e57]">
                          <span>{d.event.title}</span>
                          <Sparkles size={14} />
                        </div>
                        <div className="mt-5 font-serif text-4xl font-semibold tracking-tight text-[#321c2b]">
                          {d.event.date}
                        </div>
                        <div className="mt-5 space-y-4 border-t border-[#e7d8ca] pt-5 text-sm text-[#493d40]">
                          <div className="flex items-start gap-3">
                            <CalendarDays size={16} />
                            <span>{eventDateLabel}</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock3 size={16} />
                            <span>Saturday, 8:30 AM onwards</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin size={16} />
                            <span>
                              {d.event.venue}, {d.event.city}
                            </span>
                          </div>
                          <div className="timeline-actions hero-event-actions">
                            <a
                              href="https://maps.app.goo.gl/EWBvKF1si1SpuZ8n8"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <MapPin size={14} /> View on Map
                            </a>
                            <button
                              type="button"
                              onClick={() => createCalendarFile(PRIMARY_EVENT)}
                            >
                              <Download size={14} /> Add to Calendar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
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
              >
                <img
                  src={gopuramImage}
                  alt=""
                  className="h-full w-auto max-w-none mix-blend-multiply opacity-70"
                />
              </motion.div>
              <motion.div
                style={{
                  scale: gopuramScale,
                  y: gopuramY,
                  backgroundImage: `url("${page2Photo}")`,
                }}
                className="relative z-10 h-[360px] w-full bg-cover bg-center sm:h-[440px]"
              />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-3 px-5 py-8 text-center sm:px-10 sm:py-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.44em] text-[#986f76]">
                Sacred beginning
              </p>
              <h3 className="font-serif text-4xl text-[#3b2731] sm:text-5xl">
                A blessing for the journey ahead
              </h3>
              <p className="max-w-xl text-sm leading-7 text-[#705c65] sm:text-base">
                With grace, love, and the blessings of family, we invite you to
                witness this beautiful chapter of our lives.
              </p>
            </div>
          </motion.section>
          <OurStoryTimeline />
          <Schedule />
          <RSVP />
          <WishesWall />
        </div>
      </main>
    </>
  );
}
