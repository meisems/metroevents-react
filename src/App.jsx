import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

if (typeof document !== "undefined") {
  const id = "me-fonts";
  if (!document.getElementById(id)) {
    const l = document.createElement("link");
    l.id = id; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
    document.head.appendChild(l);
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.name || "Client",
          role: "client",
          id: session.user.id
        });
      }
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.name || "Client",
          role: "client",
          id: session.user.id
        });
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

// ─── BREAKPOINT HOOK ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const get = () => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    return w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
  };
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const h = () => setBp(get());
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return bp;
}

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  navy: "#12122a", navyMid: "#1a1a38", gold: "#c9a86c", goldDark: "#a8843f",
  cream: "#f5f0e6", white: "#ffffff", bg: "#f8f7f4", border: "#e8e4dc",
  text: "#1c1c30", muted: "#888880",
  success: "#2d6b4a", successBg: "#e8f5ee",
  warning: "#b87514", warningBg: "#fef5e4",
  danger: "#a83030", dangerBg: "#fdf0f0",
  info: "#2a5ca8", infoBg: "#eef3fc",
  purple: "#5a3ea0", purpleBg: "#f0eeff",
};

// ─── PHASE 1 DATA ─────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { email: "admin@metroevents.ph", password: "admin123", role: "admin", name: "Admin" },
  { email: "coordinator@metroevents.ph", password: "coord123", role: "coordinator", name: "Maria Santos" },
  { email: "designer@metroevents.ph", password: "design123", role: "designer", name: "Luis Reyes" },
  { email: "warehouse@metroevents.ph", password: "wh123", role: "warehouse", name: "Marco Tan" },
  { email: "ana@client.com", password: "client123", role: "client", name: "Ana Reyes" },
  { email: "juan@client.com", password: "client123", role: "client", name: "Juan dela Cruz" },
];

const STAGES = ["New Inquiry", "Ocular Scheduled", "Proposal Sent", "Reserved", "Fully Booked", "Done"];
const NEXT_ACTIONS = {
  "New Inquiry": { label: "Schedule Ocular", icon: "📅", next: "Ocular Scheduled" },
  "Ocular Scheduled": { label: "Send Proposal", icon: "📄", next: "Proposal Sent" },
  "Proposal Sent": { label: "Mark Reserved", icon: "🔒", next: "Reserved" },
  "Reserved": { label: "Confirm Booking", icon: "✅", next: "Fully Booked" },
  "Fully Booked": { label: "Mark Done", icon: "🎉", next: "Done" },
  "Done": null,
};

const INITIAL_EVENTS = [
  { id: 1, client: "Reyes-Santos Wedding", type: "Wedding", date: "Jul 15, 2025", stage: "Fully Booked", value: 285000, venue: "The Ruins, Taguig", coordinator: "Maria Santos" },
  { id: 2, client: "BDO Annual Summit", type: "Corporate", date: "Jun 30, 2025", stage: "Proposal Sent", value: 450000, venue: "SMX Convention Center", coordinator: "Maria Santos" },
  { id: 3, client: "Garcia Debut", type: "Birthday", date: "Aug 20, 2025", stage: "Reserved", value: 95000, venue: "Palacio de Maynila", coordinator: "Admin" },
  { id: 4, client: "Cruz-Lim Wedding", type: "Wedding", date: "Sep 12, 2025", stage: "New Inquiry", value: null, venue: "TBD", coordinator: null },
  { id: 5, client: "Ayala Land Forum", type: "Corporate", date: "Jul 8, 2025", stage: "Ocular Scheduled", value: 320000, venue: "Makati Shangri-La", coordinator: "Maria Santos" },
  { id: 6, client: "Dela Cruz 50th Anniv", type: "Birthday", date: "Aug 5, 2025", stage: "Done", value: 180000, venue: "Heritage Hotel", coordinator: "Admin" },
];

const MEETINGS_DATA = [
  { id: 1, title: "Initial Consultation — Reyes-Santos", date: "May 20, 2025", time: "2:00 PM", location: "Zoom", attendees: ["Admin", "Maria Santos", "Ana Reyes"], status: "Scheduled", agenda: "Package options and date availability", linkedEvent: "Reyes-Santos Wedding", packageAvailed: "Grand Affair", files: [] },
  { id: 2, title: "Venue Ocular — BDO Summit", date: "May 22, 2025", time: "10:00 AM", location: "SMX Convention Center", attendees: ["Admin", "BDO Events Team"], status: "Scheduled", agenda: "Venue walkthrough and floor plan discussion", linkedEvent: "BDO Annual Summit", packageAvailed: "Corporate Premium", files: ["BDO Summit Stage Layout.png"] },
  { id: 3, title: "Design Presentation — Garcia Debut", date: "May 18, 2025", time: "3:00 PM", location: "Metro Events Office", attendees: ["Admin", "Luis Reyes", "Garcia Family"], status: "Done", agenda: "Moodboard and palette approval", outcome: "Client approved Garden Florals theme", linkedEvent: "Garcia Debut", packageAvailed: "Debut Grand", files: ["Moodboard_Garcia_GardenFlorals.pdf"] },
];

const CLIENTS_DATA = [
  { id: 1, name: "Ana Reyes", email: "ana@client.com", phone: "+63 917 555 0123", events: 1, status: "Active", joined: "Mar 2025", type: "Wedding" },
  { id: 2, name: "BDO Events Team", email: "events@bdo.ph", phone: "+63 2 8888 0000", events: 1, status: "Active", joined: "Apr 2025", type: "Corporate" },
  { id: 3, name: "Garcia Family", email: "garcia@gmail.com", phone: "+63 918 222 3344", events: 1, status: "Active", joined: "Feb 2025", type: "Birthday" },
  { id: 4, name: "Cruz-Lim Family", email: "cruzlim@gmail.com", phone: "+63 919 777 4455", events: 1, status: "Inquiry", joined: "May 2025", type: "Wedding" },
  { id: 5, name: "Dela Cruz Family", email: "delacruz@gmail.com", phone: "+63 917 888 5566", events: 1, status: "Past", joined: "Jan 2025", type: "Birthday" },
];

const ACTIVITY_DATA = [
  { id: 1, icon: "📩", text: "New inquiry received from Cruz-Lim Family", time: "Today, 10:23 AM", color: C.infoBg },
  { id: 2, icon: "✅", text: "Reyes-Santos Wedding moved to Fully Booked", time: "Today, 9:15 AM", color: C.successBg },
  { id: 3, icon: "🤝", text: "Meeting scheduled: BDO Summit Ocular", time: "Yesterday, 4:00 PM", color: C.warningBg },
  { id: 4, icon: "💳", text: "Downpayment received — Garcia Debut", time: "Yesterday, 2:30 PM", color: C.successBg },
  { id: 5, icon: "📦", text: "Inventory check-out: 150 Chiavari Chairs → Reyes-Santos", time: "May 16, 11:00 AM", color: C.purpleBg },
  { id: 6, icon: "🚛", text: "Metro Logistics truck confirmed for Jul 14", time: "May 15, 3:45 PM", color: C.infoBg },
];

const PACKAGES = [
  { id: 1, name: "Classic Elegance", type: "Wedding", price: 150000, tag: "Popular", inclusions: ["Full on-the-day coordination", "Ceremony & reception florals", "Basic pin lighting", "Bridal car ribbon & corsages"] },
  { id: 2, name: "Grand Affair", type: "Wedding", price: 285000, tag: "Best Value", inclusions: ["Full coordination (3 coordinators)", "Premium florals + candelabras", "Full lighting & audio production", "Entourage corsages & boutonnieres", "Photo wall + custom monogram", "Bridal car deco"] },
  { id: 3, name: "Corporate Standard", type: "Corporate", price: 80000, tag: null, inclusions: ["Venue dressing", "Stage backdrop (printed)", "Basic AV setup", "Registration area styling"] },
  { id: 4, name: "Corporate Premium", type: "Corporate", price: 200000, tag: "Popular", inclusions: ["Full venue dressing + florals", "Custom stage & LED wall", "Full AV production", "Photo booth", "Cocktail table styling"] },
  { id: 5, name: "Debut Essentials", type: "Birthday", price: 60000, tag: null, inclusions: ["Theme décor (1 concept)", "Cotillion coordination", "Custom backdrop", "Photo wall"] },
  { id: 6, name: "Debut Grand", type: "Birthday", price: 120000, tag: "Best Value", inclusions: ["Premium theme décor", "Cotillion coordination", "Full florals", "Balloon ceiling installation", "Photo booth + custom monogram", "Welcome signage"] },
];

const ADDONS = [
  { id: "flowers", label: "Premium Floral Upgrade", price: 25000 },
  { id: "photo", label: "Photo Booth (4hrs)", price: 12000 },
  { id: "lights", label: "Canopy Lighting", price: 18000 },
  { id: "hosting", label: "Events Host / Emcee", price: 8000 },
  { id: "sound", label: "Full Sound System", price: 15000 },
];

const TAGLISH_TEMPLATES = [
  { id: 1, title: "New Inquiry Auto-Reply", type: "New Inquiry", body: "Hi [Client Name]! 😊 Salamat sa inyong inquiry sa Metro Events! Natanggap na namin ang inyong mensahe at excited na kaming marinig ang inyong mga plano.\n\nOur team will be in touch within 24 hours para sa further details. In the meantime, feel free to browse our packages sa aming website!\n\nMabuhay at maraming salamat! 🌟\n— Metro Events Team" },
  { id: 2, title: "Ocular Confirmation", type: "Ocular Scheduled", body: "Hi [Client Name]! 🎉 Confirmed na ang inyong venue ocular!\n\n📅 Date: [Date]\n🕐 Time: [Time]\n📍 Location: [Venue]\n\nHuwag kalimutang magdala ng inyong mga tanong at inspiration pegs. Looking forward to meeting you soon!\n\n— Metro Events Team" },
  { id: 3, title: "Proposal Sent Follow-up", type: "Proposal Sent", body: "Hi [Client Name]! Ipinadala na namin ang inyong customized proposal. 📄\n\nNaglalaman ito ng:\n✅ Package breakdown\n✅ Add-on options\n✅ Payment schedule\n\nPlease review at huwag mag-atubiling mag-reach out kung may questions kayo.\n\n— Metro Events Team" },
  { id: 4, title: "Reservation Confirmation", type: "Reserved", body: "🎊 Maligayang araw, [Client Name]! Officially RESERVED na ang inyong event date!\n\nNext steps:\n1. Review and sign the contract\n2. Settle the initial downpayment (30%)\n3. Schedule your design consultation\n\nSobrang excited kami para sa inyo! 💛\n\n— Metro Events Team" },
];

const MOODBOARD_PEGS = [
  { id: 1, label: "Garden Florals", palette: ["#e8c4b8", "#d4a49a", "#c49080", "#8b6060"], tags: ["Wedding", "Outdoor", "Romantic"], emoji: "🌸" },
  { id: 2, label: "Modern Luxe", palette: ["#1a1a2e", "#c9a86c", "#e8e4dc", "#f5f0e6"], tags: ["Corporate", "Upscale", "Gold"], emoji: "✨" },
  { id: 3, label: "Tropical Bloom", palette: ["#2d6b4a", "#5a9e6f", "#f5e642", "#ff7b47"], tags: ["Birthday", "Vibrant", "Fun"], emoji: "🌺" },
  { id: 4, label: "Pearl & Ivory", palette: ["#f5f0e6", "#e8ddd0", "#d4c4b0", "#b8a898"], tags: ["Wedding", "Elegant", "Classic"], emoji: "🤍" },
];

const INITIAL_REVIEWS = [
  { id: 1, name: "Patricia L.", event: "Wedding, May 2025", rating: 5, text: "Metro Events exceeded all expectations! The florals, the coordination, everything was flawless." },
  { id: 2, name: "Engr. Ramon C.", event: "Corporate Gala, Mar 2025", rating: 5, text: "Highly professional team. They handled 300 guests with zero issues. Will definitely book again." },
  { id: 3, name: "Camille M.", event: "18th Birthday, Apr 2025", rating: 5, text: "My debut was a dream come true! Sobrang satisfied kami ng family ko!" },
];

// ─── PHASE 2 DATA ─────────────────────────────────────────────────────────────
const CHECKLIST_CATEGORIES = ["Pre-Production", "Fabrication", "Supplier", "Load-in", "Load-out"];

const INITIAL_CHECKLIST = [
  { id: 1, category: "Pre-Production", task: "Finalize floor plan with venue coordinator", event: "Reyes-Santos Wedding", assignee: "Maria Santos", dueDate: "Jul 1, 2025", status: "Done", priority: "High" },
  { id: 2, category: "Pre-Production", task: "Confirm final guest count with client", event: "Reyes-Santos Wedding", assignee: "Maria Santos", dueDate: "Jul 3, 2025", status: "In Progress", priority: "High" },
  { id: 3, category: "Pre-Production", task: "Secure venue permits and clearances", event: "Garcia Debut", assignee: "Admin", dueDate: "Aug 1, 2025", status: "Done", priority: "High" },
  { id: 4, category: "Pre-Production", task: "Prepare run-of-show document", event: "BDO Annual Summit", assignee: "Maria Santos", dueDate: "Jun 27, 2025", status: "In Progress", priority: "Medium" },
  { id: 5, category: "Fabrication", task: "Fabricate 20 arch floral arrangements", event: "Reyes-Santos Wedding", assignee: "Luis Reyes", dueDate: "Jul 10, 2025", status: "In Progress", priority: "High" },
  { id: 6, category: "Fabrication", task: "Print 5x8 stage backdrop (BDO branding)", event: "BDO Annual Summit", assignee: "Luis Reyes", dueDate: "Jun 25, 2025", status: "Pending", priority: "High" },
  { id: 7, category: "Fabrication", task: "Assemble 18 aisle flower poles", event: "Reyes-Santos Wedding", assignee: "Luis Reyes", dueDate: "Jul 12, 2025", status: "Pending", priority: "Medium" },
  { id: 8, category: "Fabrication", task: "Debut signage and welcome board", event: "Garcia Debut", assignee: "Luis Reyes", dueDate: "Aug 15, 2025", status: "Pending", priority: "Medium" },
  { id: 9, category: "Supplier", task: "Confirm floral delivery — Bulacan Florist", event: "Reyes-Santos Wedding", assignee: "Admin", dueDate: "Jul 13, 2025", status: "Pending", priority: "High" },
  { id: 10, category: "Supplier", task: "Get AV specs and setup time — AudioPro", event: "BDO Annual Summit", assignee: "Admin", dueDate: "Jun 28, 2025", status: "Done", priority: "Medium" },
  { id: 11, category: "Supplier", task: "Follow up on printed materials — Printo Express", event: "BDO Annual Summit", assignee: "Maria Santos", dueDate: "Jun 27, 2025", status: "In Progress", priority: "Medium" },
  { id: 12, category: "Supplier", task: "Get balloon delivery schedule", event: "Garcia Debut", assignee: "Admin", dueDate: "Aug 18, 2025", status: "Pending", priority: "Low" },
  { id: 13, category: "Load-in", task: "Truck load-in at The Ruins (Day before)", event: "Reyes-Santos Wedding", assignee: "Marco Tan", dueDate: "Jul 14, 2025", status: "Pending", priority: "High" },
  { id: 14, category: "Load-in", task: "Stage and AV equipment delivery at SMX", event: "BDO Annual Summit", assignee: "Marco Tan", dueDate: "Jun 29, 2025", status: "Pending", priority: "High" },
  { id: 15, category: "Load-in", task: "Inventory check-out and labeling", event: "Reyes-Santos Wedding", assignee: "Marco Tan", dueDate: "Jul 14, 2025", status: "Pending", priority: "High" },
  { id: 16, category: "Load-out", task: "Pull out all rentals after BDO Summit", event: "BDO Annual Summit", assignee: "Marco Tan", dueDate: "Jul 1, 2025", status: "Pending", priority: "High" },
  { id: 17, category: "Load-out", task: "Inventory check-in and condition report", event: "BDO Annual Summit", assignee: "Marco Tan", dueDate: "Jul 1, 2025", status: "Pending", priority: "High" },
  { id: 18, category: "Load-out", task: "Return florals to supplier (dry ice pack)", event: "Reyes-Santos Wedding", assignee: "Marco Tan", dueDate: "Jul 16, 2025", status: "Pending", priority: "Medium" },
];

const CREW_DATA = [
  { id: 1, name: "Maria Santos", role: "Coordinator", email: "coordinator@metroevents.ph", phone: "+63 917 111 2222", avatar: "MS", events: ["Reyes-Santos Wedding", "BDO Annual Summit", "Ayala Land Forum"],
    tasks: [
      { id: 1, task: "Full on-the-day coordination", event: "Reyes-Santos Wedding", callTime: "6:00 AM", endTime: "10:00 PM", status: "Upcoming" },
      { id: 2, task: "Venue briefing & run-of-show", event: "BDO Annual Summit", callTime: "8:00 AM", endTime: "12:00 PM", status: "Upcoming" },
    ]},
  { id: 2, name: "Luis Reyes", role: "Designer/Stylist", email: "designer@metroevents.ph", phone: "+63 918 333 4444", avatar: "LR", events: ["Reyes-Santos Wedding", "Garcia Debut"],
    tasks: [
      { id: 3, task: "Ceremony floral styling & arch setup", event: "Reyes-Santos Wedding", callTime: "5:00 AM", endTime: "2:00 PM", status: "Upcoming" },
      { id: 4, task: "Debut theme décor installation", event: "Garcia Debut", callTime: "9:00 AM", endTime: "5:00 PM", status: "Upcoming" },
    ]},
  { id: 3, name: "Marco Tan", role: "Warehouse/Logistics", email: "warehouse@metroevents.ph", phone: "+63 919 555 6666", avatar: "MT", events: ["Reyes-Santos Wedding", "BDO Annual Summit"],
    tasks: [
      { id: 5, task: "Truck load-in & inventory check-out", event: "Reyes-Santos Wedding", callTime: "4:00 AM", endTime: "8:00 AM", status: "Upcoming" },
      { id: 6, task: "Stage equipment & AV delivery", event: "BDO Annual Summit", callTime: "5:00 AM", endTime: "9:00 AM", status: "Upcoming" },
    ]},
  { id: 4, name: "Bea Cruz", role: "Coordinator", email: "bea@metroevents.ph", phone: "+63 917 777 8888", avatar: "BC", events: ["Garcia Debut"],
    tasks: [
      { id: 7, task: "Cotillion coordination & guest flow", event: "Garcia Debut", callTime: "4:00 PM", endTime: "10:00 PM", status: "Upcoming" },
    ]},
  { id: 5, name: "Karen Dizon", role: "Coordinator", email: "karen@metroevents.ph", phone: "+63 916 999 0000", avatar: "KD", events: ["Ayala Land Forum"],
    tasks: [
      { id: 8, task: "Registration area & guest management", event: "Ayala Land Forum", callTime: "7:00 AM", endTime: "6:00 PM", status: "Upcoming" },
    ]},
];

const INITIAL_INVENTORY = [
  { id: 1, name: "Gold Chiavari Chairs", category: "Furniture", emoji: "🪑", qty: 200, unit: "pcs", condition: "Good", conditionNote: "", reservations: [{ event: "Reyes-Santos Wedding", date: "Jul 15, 2025", qty: 150 }, { event: "Garcia Debut", date: "Aug 20, 2025", qty: 80 }], location: "Warehouse A" },
  { id: 2, name: "Round Tables (5ft)", category: "Furniture", emoji: "⬤", qty: 30, unit: "pcs", condition: "Good", conditionNote: "", reservations: [{ event: "Reyes-Santos Wedding", date: "Jul 15, 2025", qty: 20 }], location: "Warehouse A" },
  { id: 3, name: "Arch Structure (Large)", category: "Structures", emoji: "🌿", qty: 5, unit: "sets", condition: "Good", conditionNote: "", reservations: [{ event: "Reyes-Santos Wedding", date: "Jul 15, 2025", qty: 2 }, { event: "Garcia Debut", date: "Aug 20, 2025", qty: 1 }], location: "Warehouse B" },
  { id: 4, name: "Pin Lighting Sets", category: "Lighting", emoji: "💡", qty: 10, unit: "sets", condition: "Good", conditionNote: "", reservations: [{ event: "BDO Annual Summit", date: "Jun 30, 2025", qty: 8 }], location: "Warehouse C" },
  { id: 5, name: "Backdrop Stands", category: "Structures", emoji: "🖼", qty: 8, unit: "pcs", condition: "Damaged", conditionNote: "1 stand has bent leg — needs repair before next event", reservations: [{ event: "BDO Annual Summit", date: "Jun 30, 2025", qty: 3 }], location: "Warehouse B" },
  { id: 6, name: "Cocktail Tables (high)", category: "Furniture", emoji: "🍸", qty: 15, unit: "pcs", condition: "Good", conditionNote: "", reservations: [], location: "Warehouse A" },
  { id: 7, name: "Candelabras (gold)", category: "Décor", emoji: "🕯", qty: 40, unit: "pcs", condition: "Chipped", conditionNote: "3 pcs have chipped base — can still be used, document condition on loan", reservations: [{ event: "Reyes-Santos Wedding", date: "Jul 15, 2025", qty: 30 }], location: "Warehouse C" },
  { id: 8, name: "Photo Booth Unit", category: "Equipment", emoji: "📸", qty: 2, unit: "units", condition: "Good", conditionNote: "", reservations: [{ event: "BDO Annual Summit", date: "Jun 30, 2025", qty: 1 }], location: "Warehouse D" },
  { id: 9, name: "LED Uplights", category: "Lighting", emoji: "🔦", qty: 24, unit: "pcs", condition: "Good", conditionNote: "", reservations: [{ event: "Reyes-Santos Wedding", date: "Jul 15, 2025", qty: 20 }], location: "Warehouse C" },
  { id: 10, name: "Fabric Draping (white)", category: "Décor", emoji: "🤍", qty: 60, unit: "meters", condition: "Good", conditionNote: "", reservations: [], location: "Warehouse B" },
];

const SUPPLIER_DATA = [
  { id: 1, name: "Bulacan Florist Supply", category: "Florals", contact: "+63 917 100 2222", email: "bulacan@florist.ph", contractStatus: "Signed", paymentStatus: "Partial", downpayment: "₱12,000", balance: "₱18,000", deliveryWindow: "Jul 13, 2025 · 6:00–8:00 AM", linkedEvent: "Reyes-Santos Wedding", rating: 5, notes: "Fresh flowers — confirm 48hrs before event" },
  { id: 2, name: "AudioPro Events", category: "AV / Sound", contact: "+63 918 200 3333", email: "audio@audiopro.ph", contractStatus: "Signed", paymentStatus: "Fully Paid", downpayment: "₱30,000", balance: "—", deliveryWindow: "Jun 29, 2025 · 7:00 AM", linkedEvent: "BDO Annual Summit", rating: 4, notes: "LED wall setup requires 3hr lead time" },
  { id: 3, name: "Fabric & Foam PH", category: "Fabrication", contact: "+63 919 300 4444", email: "sales@fabricfoam.ph", contractStatus: "Pending", paymentStatus: "Unpaid", downpayment: "—", balance: "₱25,000", deliveryWindow: "Jul 12, 2025 · TBD", linkedEvent: "Reyes-Santos Wedding", rating: 4, notes: "Waiting for signed PO before starting production" },
  { id: 4, name: "Metro Logistics Trucking", category: "Logistics", contact: "+63 917 400 5555", email: "dispatch@metrologistics.ph", contractStatus: "Signed", paymentStatus: "Fully Paid", downpayment: "₱8,000", balance: "—", deliveryWindow: "Jul 14, 2025 · 4:00 AM", linkedEvent: "Reyes-Santos Wedding", rating: 5, notes: "2 trucks confirmed — 6-ton capacity each" },
  { id: 5, name: "Printo Express", category: "Printing", contact: "+63 918 500 6666", email: "orders@printo.ph", contractStatus: "Signed", paymentStatus: "Partial", downpayment: "₱5,000", balance: "₱7,500", deliveryWindow: "Jun 28, 2025 · 9:00 AM", linkedEvent: "BDO Annual Summit", rating: 3, notes: "Had 1-day delay on previous order — monitor closely" },
];

const INITIAL_FILES = [
  { id: 1, name: "Reyes-Santos Floor Plan v2.pdf", type: "pdf", linkedEvent: "Reyes-Santos Wedding", uploadedBy: "Maria Santos", date: "May 15, 2025", size: "2.4 MB", category: "Floor Plan" },
  { id: 2, name: "BDO Summit Stage Layout.png", type: "image", linkedEvent: "BDO Annual Summit", uploadedBy: "Luis Reyes", date: "May 12, 2025", size: "1.1 MB", category: "Layout" },
  { id: 3, name: "Garcia Debut Venue Permit.pdf", type: "pdf", linkedEvent: "Garcia Debut", uploadedBy: "Admin", date: "May 10, 2025", size: "450 KB", category: "Permit" },
  { id: 4, name: "Loading List — BDO Summit.xlsx", type: "spreadsheet", linkedEvent: "BDO Annual Summit", uploadedBy: "Marco Tan", date: "May 18, 2025", size: "180 KB", category: "Logistics" },
  { id: 5, name: "Moodboard_ReyesSantos_Garden.pdf", type: "pdf", linkedEvent: "Reyes-Santos Wedding", uploadedBy: "Luis Reyes", date: "May 14, 2025", size: "5.2 MB", category: "Moodboard" },
  { id: 6, name: "BDO Summit Production Schedule.xlsx", type: "spreadsheet", linkedEvent: "BDO Annual Summit", uploadedBy: "Admin", date: "May 17, 2025", size: "220 KB", category: "Production" },
];

const PRODUCTION_SCHEDULE = [
  { id: 1, event: "BDO Annual Summit", eventDate: "Jun 30, 2025", color: C.infoBg, colorBorder: "#c0d4f0",
    items: [
      { task: "Stage backdrop print — Printo Express", dueDate: "Jun 25", assignee: "Luis Reyes", status: "In Progress" },
      { task: "AV equipment dry run & check", dueDate: "Jun 28", assignee: "Marco Tan", status: "Pending" },
      { task: "Registration table layout & materials", dueDate: "Jun 29", assignee: "Maria Santos", status: "Pending" },
      { task: "Truck load-in at SMX", dueDate: "Jun 29", assignee: "Marco Tan", status: "Pending" },
    ]},
  { id: 2, event: "Reyes-Santos Wedding", eventDate: "Jul 15, 2025", color: "#fdf4e0", colorBorder: "#f0dba0",
    items: [
      { task: "Arch floral arrangement fabrication", dueDate: "Jul 10", assignee: "Luis Reyes", status: "In Progress" },
      { task: "Aisle flower poles assembly", dueDate: "Jul 12", assignee: "Luis Reyes", status: "Pending" },
      { task: "Confirm floral delivery — Bulacan", dueDate: "Jul 13", assignee: "Admin", status: "Pending" },
      { task: "Truck load-in at The Ruins", dueDate: "Jul 14", assignee: "Marco Tan", status: "Pending" },
    ]},
  { id: 3, event: "Garcia Debut", eventDate: "Aug 20, 2025", color: C.successBg, colorBorder: "#b8d9c8",
    items: [
      { task: "Debut signage & welcome board design", dueDate: "Aug 10", assignee: "Luis Reyes", status: "Pending" },
      { task: "Balloon ceiling delivery schedule", dueDate: "Aug 18", assignee: "Admin", status: "Pending" },
      { task: "Cotillion rehearsal coordination", dueDate: "Aug 19", assignee: "Bea Cruz", status: "Pending" },
    ]},
];

const SMART_REMINDERS = [
  { id: 1, icon: "💳", type: "warning", title: "Balance Due Soon", body: "Garcia Debut: ₱47,500 balance due in 5 days (Aug 15, 2025)", event: "Garcia Debut" },
  { id: 2, icon: "📥", type: "danger", title: "Downpayment Pending", body: "Cruz-Lim Wedding: No downpayment received. Inquiry stage — follow up ASAP", event: "Cruz-Lim Wedding" },
  { id: 3, icon: "📅", type: "info", title: "Ocular Tomorrow", body: "BDO Summit: Venue ocular at SMX Convention Center, 10:00 AM (May 22)", event: "BDO Annual Summit" },
  { id: 4, icon: "📦", type: "danger", title: "Inventory Conflict", body: "Arch Structures: 3 sets reserved across 2 events — only 5 total. Check availability!", event: null },
  { id: 5, icon: "🚛", type: "info", title: "Load-in in 56 Days", body: "Reyes-Santos Wedding: Truck load-in scheduled Jul 14 at 4:00 AM — confirm Metro Logistics", event: "Reyes-Santos Wedding" },
  { id: 6, icon: "🧾", type: "warning", title: "Contract Pending", body: "Fabric & Foam PH: Supplier contract still unsigned for Reyes-Santos Wedding", event: "Reyes-Santos Wedding" },
];

// ─── PHASE 3 DATA ─────────────────────────────────────────────────────────────
const EVENT_DAY_TIMELINE = [
  { id: 1, time: "4:00 AM", label: "Truck Load-in Departs", assignee: "Marco Tan", category: "Logistics", status: "done", notes: "2 trucks confirmed, left warehouse on time" },
  { id: 2, time: "5:00 AM", label: "Team Arrives at Venue", assignee: "All Crew", category: "General", status: "done", notes: "" },
  { id: 3, time: "5:30 AM", label: "Venue Layout & Setup Begins", assignee: "Luis Reyes", category: "Setup", status: "done", notes: "Floor plan confirmed with venue coordinator" },
  { id: 4, time: "7:00 AM", label: "Floral Delivery — Bulacan Florist", assignee: "Admin", category: "Supplier", status: "done", notes: "All 20 arch arrangements delivered in good condition" },
  { id: 5, time: "8:00 AM", label: "Ceremony Arch & Aisle Setup", assignee: "Luis Reyes", category: "Setup", status: "in-progress", notes: "" },
  { id: 6, time: "9:00 AM", label: "AV & Lighting Dry Run", assignee: "Marco Tan", category: "Technical", status: "pending", notes: "" },
  { id: 7, time: "10:00 AM", label: "Candelabra & Table Styling", assignee: "Luis Reyes", category: "Setup", status: "pending", notes: "" },
  { id: 8, time: "11:00 AM", label: "Coordinator Briefing with Entourage", assignee: "Maria Santos", category: "Coordination", status: "pending", notes: "" },
  { id: 9, time: "12:00 PM", label: "Venue Inspection & Client Walk-through", assignee: "Maria Santos", category: "Coordination", status: "pending", notes: "" },
  { id: 10, time: "1:00 PM", label: "Photo Booth Setup & Test", assignee: "Marco Tan", category: "Technical", status: "pending", notes: "" },
  { id: 11, time: "3:00 PM", label: "Final Crew Briefing", assignee: "Maria Santos", category: "General", status: "pending", notes: "" },
  { id: 12, time: "4:00 PM", label: "Guest Arrival & Registration", assignee: "Bea Cruz", category: "Coordination", status: "pending", notes: "" },
  { id: 13, time: "5:00 PM", label: "Ceremony Begins", assignee: "Maria Santos", category: "Ceremony", status: "pending", notes: "" },
  { id: 14, time: "5:45 PM", label: "Cocktail Hour", assignee: "Bea Cruz", category: "Coordination", status: "pending", notes: "" },
  { id: 15, time: "7:00 PM", label: "Reception Program Starts", assignee: "Maria Santos", category: "Reception", status: "pending", notes: "" },
  { id: 16, time: "9:00 PM", label: "Cake Cutting & Dessert", assignee: "Bea Cruz", category: "Reception", status: "pending", notes: "" },
  { id: 17, time: "10:00 PM", label: "Program End / Guest Farewell", assignee: "Maria Santos", category: "General", status: "pending", notes: "" },
  { id: 18, time: "11:00 PM", label: "Load-out Begins", assignee: "Marco Tan", category: "Logistics", status: "pending", notes: "" },
];

const CREW_CHECKIN = [
  { id: 1, name: "Maria Santos", role: "Lead Coordinator", avatar: "MS", callTime: "5:00 AM", checkedIn: true, checkinTime: "4:52 AM", status: "present" },
  { id: 2, name: "Luis Reyes", role: "Designer/Stylist", avatar: "LR", callTime: "5:00 AM", checkedIn: true, checkinTime: "5:10 AM", status: "present" },
  { id: 3, name: "Marco Tan", role: "Warehouse/Logistics", avatar: "MT", callTime: "4:00 AM", checkedIn: true, checkinTime: "3:55 AM", status: "present" },
  { id: 4, name: "Bea Cruz", role: "Coordinator", avatar: "BC", callTime: "3:00 PM", checkedIn: false, checkinTime: null, status: "upcoming" },
  { id: 5, name: "Karen Dizon", role: "Coordinator", avatar: "KD", callTime: "3:00 PM", checkedIn: false, checkinTime: null, status: "upcoming" },
  { id: 6, name: "Jun Bautista", role: "Florist Assistant", avatar: "JB", callTime: "7:00 AM", checkedIn: false, checkinTime: null, status: "late" },
];

const INITIAL_INCIDENTS = [
  { id: 1, time: "6:15 AM", category: "Logistics", severity: "medium", description: "One chiavari chair arrived with cracked back. Replaced from spare stock on-site.", costImpact: 0, resolvedBy: "Marco Tan", status: "Resolved", signedOff: true, signedBy: "Maria Santos" },
  { id: 2, time: "7:30 AM", category: "Supplier", severity: "low", description: "Bulacan Florist delivered 3 fewer aisle arrangements than ordered (17 vs 20). Team improvised using corsage stems.", costImpact: 0, resolvedBy: "Luis Reyes", status: "Resolved", signedOff: true, signedBy: "Maria Santos" },
];

const AFTER_EVENTS_DATA = [
  {
    id: 1, event: "Dela Cruz 50th Anniversary", type: "Birthday", date: "Aug 5, 2025", venue: "Heritage Hotel", coordinator: "Admin",
    totalValue: 180000, amountPaid: 162000, balance: 18000, balanceStatus: "Pending",
    feedbackSubmitted: true, feedbackRating: 5, feedbackText: "Absolutely wonderful event! Everything was perfect from start to finish.",
    photosUploaded: 48, incidentsLogged: 0,
    bookNextPrompted: false,
  },
  {
    id: 2, event: "BDO Annual Summit", type: "Corporate", date: "Jun 30, 2025", venue: "SMX Convention Center", coordinator: "Maria Santos",
    totalValue: 450000, amountPaid: 450000, balance: 0, balanceStatus: "Settled",
    feedbackSubmitted: false, feedbackRating: null, feedbackText: "",
    photosUploaded: 0, incidentsLogged: 1,
    bookNextPrompted: false,
  },
];

const REPORTS_MONTHLY = [
  { month: "Jan", bookings: 3, inquiries: 8, revenue: 340000, feedback: 4.8 },
  { month: "Feb", bookings: 5, inquiries: 12, revenue: 520000, feedback: 4.9 },
  { month: "Mar", bookings: 4, inquiries: 10, revenue: 480000, feedback: 4.7 },
  { month: "Apr", bookings: 6, inquiries: 14, revenue: 695000, feedback: 5.0 },
  { month: "May", bookings: 5, inquiries: 11, revenue: 580000, feedback: 4.8 },
  { month: "Jun", bookings: 4, inquiries: 9, revenue: 510000, feedback: 4.6 },
  { month: "Jul", bookings: 7, inquiries: 16, revenue: 820000, feedback: null },
  { month: "Aug", bookings: 3, inquiries: 8, revenue: 360000, feedback: null },
];

const PACKAGE_PERFORMANCE = [
  { name: "Grand Affair", type: "Wedding", bookings: 8, revenue: 2280000, avgFeedback: 4.9, utilization: 82 },
  { name: "Corporate Premium", type: "Corporate", bookings: 6, revenue: 1200000, avgFeedback: 4.7, utilization: 70 },
  { name: "Classic Elegance", type: "Wedding", bookings: 12, revenue: 1800000, avgFeedback: 4.8, utilization: 90 },
  { name: "Debut Grand", type: "Birthday", bookings: 9, revenue: 1080000, avgFeedback: 4.9, utilization: 78 },
  { name: "Corporate Standard", type: "Corporate", bookings: 7, revenue: 560000, avgFeedback: 4.5, utilization: 65 },
  { name: "Debut Essentials", type: "Birthday", bookings: 5, revenue: 300000, avgFeedback: 4.6, utilization: 60 },
];

const INVENTORY_UTILIZATION = [
  { name: "Gold Chiavari Chairs", utilization: 87, events: 12, totalQty: 200, avgUsed: 174 },
  { name: "Round Tables (5ft)", utilization: 72, events: 10, totalQty: 30, avgUsed: 22 },
  { name: "Arch Structure (Large)", utilization: 58, events: 8, totalQty: 5, avgUsed: 3 },
  { name: "Pin Lighting Sets", utilization: 94, events: 15, totalQty: 10, avgUsed: 9 },
  { name: "LED Uplights", utilization: 79, events: 11, totalQty: 24, avgUsed: 19 },
  { name: "Photo Booth Unit", utilization: 65, events: 9, totalQty: 2, avgUsed: 1 },
];

// ─── PHASE 4 DATA ─────────────────────────────────────────────────────────────
const PRICING_RULES = [
  { id: 1, name: "Early Bird Discount", type: "percent", value: 10, trigger: "Booked 6+ months before event", active: true, applied: 3, color: "green" },
  { id: 2, name: "Referral Reward", type: "percent", value: 8, trigger: "Referred by past client", active: true, applied: 5, color: "blue" },
  { id: 3, name: "Multi-Event Bundle", type: "percent", value: 15, trigger: "2 or more events booked same client", active: true, applied: 2, color: "purple" },
  { id: 4, name: "Off-Peak Season", type: "percent", value: 12, trigger: "Events in Jan, Feb, Aug, Sep", active: false, applied: 0, color: "amber" },
  { id: 5, name: "Corporate Annual Contract", type: "fixed", value: 50000, trigger: "Signed annual retainer agreement", active: true, applied: 1, color: "gold" },
  { id: 6, name: "Last-Minute Slot", type: "percent", value: 20, trigger: "Booked within 30 days of event", active: false, applied: 0, color: "red" },
];

const ADDON_PERFORMANCE = [
  { id: "flowers", label: "Premium Floral Upgrade", price: 25000, timesBooked: 34, totalRevenue: 850000, margin: 62, trend: "up" },
  { id: "photo", label: "Photo Booth (4hrs)", price: 12000, timesBooked: 51, totalRevenue: 612000, margin: 74, trend: "up" },
  { id: "lights", label: "Canopy Lighting", price: 18000, timesBooked: 28, totalRevenue: 504000, margin: 58, trend: "stable" },
  { id: "hosting", label: "Events Host / Emcee", price: 8000, timesBooked: 19, totalRevenue: 152000, margin: 45, trend: "down" },
  { id: "sound", label: "Full Sound System", price: 15000, timesBooked: 22, totalRevenue: 330000, margin: 55, trend: "stable" },
];

const INVENTORY_FULL = [
  { id: 1, name: "Gold Chiavari Chairs", category: "Furniture", emoji: "🪑", qty: 200, replacementCost: 2800, lastUsed: "Jul 15, 2025", daysSinceUse: 3, deadStock: false, location: "Warehouse A · Rack 1-4" },
  { id: 2, name: "Round Tables (5ft)", category: "Furniture", emoji: "⬤", qty: 30, replacementCost: 4500, lastUsed: "Jun 30, 2025", daysSinceUse: 18, deadStock: false, location: "Warehouse A · Rack 5" },
  { id: 3, name: "Arch Structure (Large)", category: "Structures", emoji: "🌿", qty: 5, replacementCost: 18000, lastUsed: "Jul 15, 2025", daysSinceUse: 3, deadStock: false, location: "Warehouse B · Bay 1" },
  { id: 4, name: "Pin Lighting Sets", category: "Lighting", emoji: "💡", qty: 10, replacementCost: 12000, lastUsed: "Jun 30, 2025", daysSinceUse: 18, deadStock: false, location: "Warehouse C · Shelf 2" },
  { id: 5, name: "Backdrop Stands", category: "Structures", emoji: "🖼", qty: 8, replacementCost: 3500, lastUsed: "Jun 30, 2025", daysSinceUse: 18, deadStock: false, location: "Warehouse B · Bay 2" },
  { id: 6, name: "Cocktail Tables (high)", category: "Furniture", emoji: "🍸", qty: 15, replacementCost: 6000, lastUsed: "Mar 22, 2025", daysSinceUse: 120, deadStock: true, location: "Warehouse A · Rack 6" },
  { id: 7, name: "Candelabras (gold)", category: "Décor", emoji: "🕯", qty: 40, replacementCost: 2200, lastUsed: "Jul 15, 2025", daysSinceUse: 3, deadStock: false, location: "Warehouse C · Shelf 1" },
  { id: 8, name: "Photo Booth Unit", category: "Equipment", emoji: "📸", qty: 2, replacementCost: 85000, lastUsed: "Jun 30, 2025", daysSinceUse: 18, deadStock: false, location: "Warehouse D · Storage" },
  { id: 9, name: "LED Uplights", category: "Lighting", emoji: "🔦", qty: 24, replacementCost: 8500, lastUsed: "Jul 15, 2025", daysSinceUse: 3, deadStock: false, location: "Warehouse C · Shelf 3" },
  { id: 10, name: "Fabric Draping (white)", category: "Décor", emoji: "🤍", qty: 60, replacementCost: 450, lastUsed: "Jan 10, 2025", daysSinceUse: 190, deadStock: true, location: "Warehouse B · Bay 3" },
  { id: 11, name: "Vintage Birdcages", category: "Décor", emoji: "🪺", qty: 12, replacementCost: 1800, lastUsed: "Nov 5, 2024", daysSinceUse: 253, deadStock: true, location: "Warehouse B · Bay 4" },
];

const SUPPLIER_PERFORMANCE_DATA = [
  { id: 1, name: "Bulacan Florist Supply", category: "Florals", totalOrders: 28, onTimeDeliveries: 26, lateDeliveries: 2, avgQuality: 4.9, avgResponseHrs: 2.1, totalSpend: 840000, lastDelivery: "Jul 15, 2025", badge: "Gold Partner", trend: "up",
    history: [{ date: "Jul 15, 2025", event: "Reyes-Santos Wedding", onTime: true, quality: 5, note: "Perfect florals, delivered 30min early" }, { date: "Jun 30, 2025", event: "BDO Summit", onTime: true, quality: 5, note: "Stage arrangements flawless" }, { date: "May 10, 2025", event: "Santos Debut", onTime: false, quality: 4, note: "1hr late — traffic from Bulacan" }] },
  { id: 2, name: "AudioPro Events", category: "AV / Sound", totalOrders: 15, onTimeDeliveries: 14, lateDeliveries: 1, avgQuality: 4.7, avgResponseHrs: 3.4, totalSpend: 1200000, lastDelivery: "Jun 30, 2025", badge: "Preferred Supplier", trend: "stable",
    history: [{ date: "Jun 30, 2025", event: "BDO Summit", onTime: true, quality: 5, note: "LED wall setup flawless" }, { date: "Apr 20, 2025", event: "Garcia Debut", onTime: false, quality: 4, note: "Technician arrived 45min late" }] },
  { id: 3, name: "Fabric & Foam PH", category: "Fabrication", totalOrders: 12, onTimeDeliveries: 9, lateDeliveries: 3, avgQuality: 3.9, avgResponseHrs: 8.2, totalSpend: 360000, lastDelivery: "Jul 12, 2025", badge: null, trend: "down",
    history: [{ date: "Jul 12, 2025", event: "Reyes-Santos Wedding", onTime: false, quality: 4, note: "2-day delay on backdrop — material shortage" }, { date: "May 15, 2025", event: "Cruz Anniversary", onTime: false, quality: 3, note: "Quality issues on printed fabric" }] },
  { id: 4, name: "Metro Logistics Trucking", category: "Logistics", totalOrders: 42, onTimeDeliveries: 42, lateDeliveries: 0, avgQuality: 5.0, avgResponseHrs: 1.2, totalSpend: 630000, lastDelivery: "Jul 15, 2025", badge: "Gold Partner", trend: "up",
    history: [{ date: "Jul 15, 2025", event: "Reyes-Santos Wedding", onTime: true, quality: 5, note: "2 trucks, 4AM sharp, zero issues" }, { date: "Jun 30, 2025", event: "BDO Summit", onTime: true, quality: 5, note: "Perfectly coordinated load-out" }] },
  { id: 5, name: "Printo Express", category: "Printing", totalOrders: 18, onTimeDeliveries: 14, lateDeliveries: 4, avgQuality: 3.8, avgResponseHrs: 6.5, totalSpend: 270000, lastDelivery: "Jun 28, 2025", badge: null, trend: "down",
    history: [{ date: "Jun 28, 2025", event: "BDO Summit", onTime: false, quality: 4, note: "1-day delay on banners" }, { date: "May 20, 2025", event: "Santos 25th Anniv", onTime: false, quality: 3, note: "Color mismatch on printed materials" }] },
];

const AUDIT_LOG_DATA = [
  { id: 1, timestamp: "Jul 18, 2025 · 2:14 PM", user: "Admin", action: "Updated pricing rule", details: "Early Bird Discount: 8% → 10%", category: "Pricing", icon: "💰" },
  { id: 2, timestamp: "Jul 18, 2025 · 11:42 AM", user: "Maria Santos", action: "Stage advanced", details: "BDO Annual Summit: Proposal Sent → Reserved", category: "Pipeline", icon: "📋" },
  { id: 3, timestamp: "Jul 17, 2025 · 4:55 PM", user: "Marco Tan", action: "Inventory check-out", details: "150 Chiavari Chairs — Reyes-Santos Wedding", category: "Inventory", icon: "📦" },
  { id: 4, timestamp: "Jul 17, 2025 · 3:20 PM", user: "Admin", action: "Quote sent", details: "Grand Affair v2 — Cruz-Lim Wedding — ₱285,000", category: "Quotation", icon: "📄" },
  { id: 5, timestamp: "Jul 16, 2025 · 10:00 AM", user: "Luis Reyes", action: "Moodboard updated", details: "Garcia Debut — Garden Florals theme approved", category: "Design", icon: "🎨" },
  { id: 6, timestamp: "Jul 15, 2025 · 11:59 PM", user: "Maria Santos", action: "Event Day completed", details: "Reyes-Santos Wedding — 18/18 timeline items done", category: "Event Day", icon: "🎯" },
  { id: 7, timestamp: "Jul 15, 2025 · 8:00 AM", user: "Admin", action: "Incident logged", details: "1 Chiavari chair damaged — replaced from spare stock", category: "Incident", icon: "⚠️" },
  { id: 8, timestamp: "Jul 14, 2025 · 5:30 PM", user: "Marco Tan", action: "Supplier confirmed", details: "Metro Logistics: 2 trucks confirmed for Jul 15 · 4AM", category: "Supplier", icon: "🚛" },
  { id: 9, timestamp: "Jul 12, 2025 · 2:10 PM", user: "Admin", action: "Role permission updated", details: "Designer role: Inventory access — Read-only enabled", category: "Permissions", icon: "🔐" },
  { id: 10, timestamp: "Jul 10, 2025 · 11:00 AM", user: "Luis Reyes", action: "File uploaded", details: "Arch floral reference — Reyes-Santos Wedding", category: "Files", icon: "📁" },
  { id: 11, timestamp: "Jul 8, 2025 · 9:15 AM", user: "Maria Santos", action: "Task created", details: "Pre-prod: Confirm final guest count — Reyes-Santos Wedding", category: "Checklist", icon: "✅" },
  { id: 12, timestamp: "Jul 5, 2025 · 3:44 PM", user: "Admin", action: "New client registered", details: "Cruz-Lim Family — Wedding inquiry", category: "CRM", icon: "👥" },
];

const NOTIFICATIONS_DATA = [
  { id: 1, type: "danger", icon: "⚠️", title: "Dead Stock Alert", body: "3 inventory items unused 90+ days — review for disposal or rental", time: "Just now", read: false, category: "Inventory" },
  { id: 2, type: "warning", icon: "📋", title: "Quote Awaiting Approval", body: "Cruz-Lim Wedding: Grand Affair v2 sent 3 days ago — no client response", time: "2hrs ago", read: false, category: "Quotation" },
  { id: 3, type: "success", icon: "✅", title: "Supplier Delivery Confirmed", body: "Metro Logistics confirmed trucks for Garcia Debut — Aug 20, 3AM", time: "3hrs ago", read: false, category: "Supplier" },
  { id: 4, type: "info", icon: "💰", title: "Balance Due in 5 Days", body: "Garcia Debut: ₱47,500 balance due Aug 15, 2025", time: "Today, 8:00 AM", read: true, category: "Finance" },
  { id: 5, type: "info", icon: "📊", title: "Monthly Report Ready", body: "July 2025 performance report is ready — 7 bookings, ₱820K revenue", time: "Yesterday", read: true, category: "Reports" },
  { id: 6, type: "warning", icon: "🔧", title: "Inventory Needs Repair", body: "Backdrop Stand: bent leg flagged by Marco Tan — schedule repair before BDO Summit", time: "Yesterday", read: true, category: "Inventory" },
  { id: 7, type: "success", icon: "⭐", title: "New Client Review", body: "Patricia L. left a 5-star review for Reyes-Santos Wedding", time: "2 days ago", read: true, category: "Feedback" },
];

const PERMISSION_MATRIX = {
  admin: { crm: "full", events: "full", clients: "full", meetings: "full", checklist: "full", crew: "full", inventory: "full", suppliers: "full", files: "full", quotation: "full", moodboard: "full", templates: "full", eventday: "full", afterevent: "full", reports: "full", analytics: "full", advanced_quotation: "full", full_inventory: "full", supplier_perf: "full", automation: "full", audit: "full", permissions: "full" },
  coordinator: { crm: "full", events: "full", clients: "full", meetings: "full", checklist: "full", crew: "full", inventory: "read", suppliers: "full", files: "full", quotation: "full", moodboard: "full", templates: "none", eventday: "full", afterevent: "full", reports: "none", analytics: "none", advanced_quotation: "read", full_inventory: "read", supplier_perf: "read", automation: "read", audit: "none", permissions: "none" },
  designer: { crm: "none", events: "read", clients: "none", meetings: "none", checklist: "full", crew: "none", inventory: "read", suppliers: "none", files: "full", quotation: "none", moodboard: "full", templates: "none", eventday: "read", afterevent: "none", reports: "none", analytics: "none", advanced_quotation: "none", full_inventory: "none", supplier_perf: "none", automation: "none", audit: "none", permissions: "none" },
  warehouse: { crm: "none", events: "read", clients: "none", meetings: "none", checklist: "full", crew: "none", inventory: "full", suppliers: "none", files: "full", quotation: "none", moodboard: "none", templates: "none", eventday: "full", afterevent: "none", reports: "none", analytics: "none", advanced_quotation: "none", full_inventory: "full", supplier_perf: "none", automation: "read", audit: "none", permissions: "none" },
};

const ANALYTICS_MONTHLY = [
  { month: "Jan", revenue: 340000, events: 3, inquiries: 8, conversion: 37.5, avgValue: 113333 },
  { month: "Feb", revenue: 520000, events: 5, inquiries: 12, conversion: 41.7, avgValue: 104000 },
  { month: "Mar", revenue: 480000, events: 4, inquiries: 10, conversion: 40.0, avgValue: 120000 },
  { month: "Apr", revenue: 695000, events: 6, inquiries: 14, conversion: 42.9, avgValue: 115833 },
  { month: "May", revenue: 580000, events: 5, inquiries: 11, conversion: 45.5, avgValue: 116000 },
  { month: "Jun", revenue: 510000, events: 4, inquiries: 9, conversion: 44.4, avgValue: 127500 },
  { month: "Jul", revenue: 820000, events: 7, inquiries: 16, conversion: 43.8, avgValue: 117143 },
  { month: "Aug", revenue: 360000, events: 3, inquiries: 8, conversion: 37.5, avgValue: 120000 },
];

const AUTOMATION_TEMPLATES = [
  { id: 1, name: "Auto Loading List", icon: "🚛", desc: "Generates complete truck loading list from inventory reservations + checklist", trigger: "1 week before event", lastRun: "Jul 14, 2025 · Auto", status: "active", runsTotal: 28 },
  { id: 2, name: "Balance Due Reminder", icon: "💳", desc: "Sends Taglish payment reminder to client 7 days before balance due date", trigger: "7 days before due date", lastRun: "Aug 8, 2025 · Auto", status: "active", runsTotal: 45 },
  { id: 3, name: "Post-Event Feedback Request", icon: "⭐", desc: "Auto-sends feedback form link to client 24hrs after event end", trigger: "24hrs after event", lastRun: "Jul 16, 2025 · Auto", status: "active", runsTotal: 32 },
  { id: 4, name: "Supplier Delivery Reminder", icon: "📦", desc: "Sends delivery confirmation request to supplier 48hrs before delivery window", trigger: "48hrs before delivery", lastRun: "Jul 13, 2025 · Auto", status: "active", runsTotal: 61 },
  { id: 5, name: "Dead Stock Alert", icon: "⚠️", desc: "Flags inventory items unused for 90+ days for review", trigger: "Weekly · Mondays", lastRun: "Jul 18, 2025 · Auto", status: "active", runsTotal: 12 },
  { id: 6, name: "Book Next Event Prompt", icon: "🎊", desc: "Sends 'book your next event' message 30 days after completed event", trigger: "30 days after event", lastRun: "Jul 5, 2025 · Auto", status: "inactive", runsTotal: 8 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Badge({ children, color = "gray" }) {
  const map = {
    gold: { bg: "#fdf4e0", text: C.goldDark, border: "#f0dba0" },
    green: { bg: C.successBg, text: C.success, border: "#b8d9c8" },
    blue: { bg: C.infoBg, text: C.info, border: "#c0d4f0" },
    gray: { bg: "#f0f0ee", text: C.muted, border: C.border },
    red: { bg: C.dangerBg, text: C.danger, border: "#e0b8b8" },
    amber: { bg: C.warningBg, text: C.warning, border: "#f0d090" },
    rose: { bg: "#fdf0f4", text: "#a83058", border: "#f0b8cc" },
    purple: { bg: C.purpleBg, text: C.purple, border: "#c8b8f0" },
  };
  const col = map[color] || map.gray;
  return <span style={{ background: col.bg, color: col.text, border: `1px solid ${col.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3, whiteSpace: "nowrap" }}>{children}</span>;
}

function stageBadge(stage) {
  const map = { "New Inquiry": "gray", "Ocular Scheduled": "blue", "Proposal Sent": "amber", "Reserved": "gold", "Fully Booked": "green", "Done": "gray" };
  return <Badge color={map[stage] || "gray"}>{stage}</Badge>;
}
function typeColor(t) { return t === "Wedding" ? "gold" : t === "Corporate" ? "blue" : "amber"; }
function statusColor(s) {
  return s === "Done" ? "green" : s === "In Progress" ? "blue" : s === "Pending" ? "gray" : "gray";
}
function conditionColor(c) {
  return c === "Good" ? "green" : c === "Damaged" ? "red" : c === "Chipped" ? "amber" : "gray";
}
function paymentColor(p) {
  return p === "Fully Paid" ? "green" : p === "Partial" ? "amber" : p === "Unpaid" ? "red" : "gray";
}
function contractColor(c) { return c === "Signed" ? "green" : "amber"; }
function fileIcon(type) {
  return type === "pdf" ? "📄" : type === "image" ? "🖼" : type === "spreadsheet" ? "📊" : "📁";
}

const inp = (extra = {}) => ({ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", color: C.text, outline: "none", background: C.white, ...extra });
const lbl = { fontSize: 11, color: C.muted, display: "block", marginBottom: 6, letterSpacing: 0.8, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" };

function Btn({ children, onClick, variant = "primary", style: sx = {}, disabled }) {
  const base = { fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: disabled ? "default" : "pointer", borderRadius: 6, padding: "10px 22px", border: "none", letterSpacing: 0.3, fontWeight: 500, transition: "opacity 0.15s", opacity: disabled ? 0.5 : 1 };
  const variants = {
    primary: { background: C.navy, color: C.white },
    gold: { background: C.gold, color: C.navy },
    outline: { background: "transparent", color: C.muted, border: `1px solid ${C.border}` },
    danger: { background: C.dangerBg, color: C.danger, border: `1px solid #e0b8b8` },
    success: { background: C.successBg, color: C.success, border: `1px solid #b8d9c8` },
    purple: { background: C.purpleBg, color: C.purple, border: `1px solid #c8b8f0` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...sx }}>{children}</button>;
}

function SectionHeader({ title, sub, action }) {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  return (
    <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexWrap: "wrap", gap: 10 }}>
      <div>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: C.text, margin: 0 }}>{title}</h1>
        {sub && <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({ onClose, onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // For registration
  const [reg, setReg] = useState({ name: "", email: "", password: "", confirm: "" });
  const [regDone, setRegDone] = useState(false);

  // LOGIN FUNCTION
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError(err.message);
    } else {
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || email.split("@")[0],
        role: "client",           // You can enhance this later with user roles
      };
      onLogin(userData);
      onClose();
    }
    setLoading(false);
  }

  // REGISTER FUNCTION
  async function register(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!reg.name || !reg.email || !reg.password) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }
    if (reg.password !== reg.confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (reg.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase.auth.signUp({
      email: reg.email,
      password: reg.password,
      options: {
        data: { name: reg.name }
      }
    });

    if (err) {
      setError(err.message);
    } else {
      setRegDone(true);
      setError("");
      // Optional: auto switch to login tab after success
      // setTab("login");
    }
    setLoading(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,10,28,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 18, padding: "40px 36px", width: "100%", maxWidth: 420, boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: C.navy, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Metro Events</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4, letterSpacing: 0.5 }}>Events Management Portal · Phase 4</div>
          <div style={{ width: 40, height: 2, background: C.gold, margin: "12px auto 0" }} />
        </div>
        <div style={{ display: "flex", background: C.bg, borderRadius: 8, padding: 4, marginBottom: 24, gap: 4 }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} style={{ flex: 1, padding: "8px", background: tab === t ? C.white : "transparent", border: "none", borderRadius: 6, fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer", color: tab === t ? C.navy : C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>
        {tab === "login" && (
          <form onSubmit={submit}>
            <div style={{ marginBottom: 14 }}><label style={lbl}>Email</label><input value={email} onChange={e => setEmail(e.target.value)} style={inp()} placeholder="your@email.com" /></div>
            <div style={{ marginBottom: 20 }}><label style={lbl}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inp()} placeholder="••••••••" /></div>
            {error && <div style={{ fontSize: 12, color: C.danger, marginBottom: 12 }}>{error}</div>}
            <button type="submit" style={{ width: "100%", padding: 12, background: C.navy, color: C.white, border: "none", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer" }}>Sign In</button>
            <div style={{ marginTop: 18, padding: 14, background: C.bg, borderRadius: 8, fontSize: 11, color: C.muted, lineHeight: 2 }}>
              <div style={{ fontWeight: 500, color: C.text, marginBottom: 6 }}>Demo Accounts</div>
              <div>🔑 Admin: admin@metroevents.ph / admin123</div>
              <div>🔑 Coordinator: coordinator@metroevents.ph / coord123</div>
              <div>🎨 Designer: designer@metroevents.ph / design123</div>
              <div>🚛 Warehouse: warehouse@metroevents.ph / wh123</div>
              <div>👤 Client: ana@client.com / client123</div>
            </div>
          </form>
        )}
        {tab === "register" && (
          regDone ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>🎉</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: C.navy, marginBottom: 10 }}>Welcome to Metro Events!</div>
              <Btn onClick={() => { setTab("login"); setEmail(reg.email); setRegDone(false); }}>Go to Sign In</Btn>
            </div>
          ) : (
            <form onSubmit={register}>
              {[{ lbl: "Full Name", key: "name", type: "text", ph: "Your full name" }, { lbl: "Email", key: "email", type: "email", ph: "your@email.com" }, { lbl: "Password", key: "password", type: "password", ph: "Min. 6 chars" }, { lbl: "Confirm Password", key: "confirm", type: "password", ph: "Re-enter" }].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}><label style={lbl}>{f.lbl}</label><input type={f.type} value={reg[f.key]} onChange={e => setReg(p => ({ ...p, [f.key]: e.target.value }))} style={inp()} placeholder={f.ph} /></div>
              ))}
              {error && <div style={{ fontSize: 12, color: C.danger, marginBottom: 12 }}>{error}</div>}
              <button type="submit" style={{ width: "100%", padding: 12, background: C.gold, color: C.navy, border: "none", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer" }}>Create Account</button>
            </form>
          )
        )}
      </div>
    </div>
  );
}

// ─── LANDING NAV ──────────────────────────────────────────────────────────────
function LandingNav({ user, onLoginClick, onLogoutClick, onPortalClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const bp = useBreakpoint();
  const compact = bp !== "desktop";

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: compact ? "0 20px" : "0 64px", height: 72, background: scrolled ? "rgba(18,18,42,0.98)" : "rgba(18,18,42,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,168,108,0.12)", transition: "background 0.3s" }}>
        {!compact && (
          <div style={{ display: "flex", gap: 32 }}>
            {["About", "Services", "Gallery"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)", textDecoration: "none", letterSpacing: 1.8, textTransform: "uppercase" }}>{item}</a>
            ))}
          </div>
        )}
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: compact ? 22 : 26, fontWeight: 600, color: C.gold, letterSpacing: compact ? 2 : 4, textTransform: "uppercase", position: compact ? "static" : "absolute", left: compact ? "auto" : "50%", transform: compact ? "none" : "translateX(-50%)" }}>Metro Events</div>
        {!compact ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="#contact" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)", textDecoration: "none", letterSpacing: 1.8, textTransform: "uppercase" }}>Contact</a>
            {user ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={onPortalClick} style={{ padding: "8px 18px", background: C.gold, color: C.navy, border: "none", borderRadius: 4, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" }}>My Portal</button>
                <button onClick={onLogoutClick} style={{ padding: "8px 14px", background: "transparent", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, fontFamily: "'DM Sans', sans-serif", fontSize: 11, cursor: "pointer" }}>Sign Out</button>
              </div>
            ) : (
              <button onClick={onLoginClick} style={{ padding: "8px 22px", background: "transparent", color: C.gold, border: `1px solid rgba(201,168,108,0.6)`, borderRadius: 4, fontFamily: "'DM Sans', sans-serif", fontSize: 11, cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase" }}>Login</button>
            )}
          </div>
        ) : (
          <button onClick={() => setMobileMenu(p => !p)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", fontSize: 22, cursor: "pointer", padding: "4px 8px" }}>{mobileMenu ? "✕" : "☰"}</button>
        )}
      </nav>
      {compact && mobileMenu && (
        <div style={{ position: "fixed", top: 72, left: 0, right: 0, background: "rgba(18,18,42,0.98)", backdropFilter: "blur(12px)", zIndex: 99, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, borderBottom: "1px solid rgba(201,168,108,0.15)" }}>
          {["About", "Services", "Gallery", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenu(false)} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", textDecoration: "none", letterSpacing: 1.8, textTransform: "uppercase", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{item}</a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {user ? (
              <>
                <button onClick={() => { onPortalClick(); setMobileMenu(false); }} style={{ flex: 1, padding: "10px", background: C.gold, color: C.navy, border: "none", borderRadius: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>My Portal</button>
                <button onClick={() => { onLogoutClick(); setMobileMenu(false); }} style={{ flex: 1, padding: "10px", background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 12, cursor: "pointer" }}>Sign Out</button>
              </>
            ) : (
              <button onClick={() => { onLoginClick(); setMobileMenu(false); }} style={{ flex: 1, padding: "10px", background: "transparent", color: C.gold, border: `1px solid rgba(201,168,108,0.6)`, borderRadius: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 12, cursor: "pointer" }}>Login / Register</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── LANDING SECTIONS (condensed) ─────────────────────────────────────────────
function Hero({ onLoginClick }) {
  const bp = useBreakpoint(); const isMobile = bp === "mobile"; const isTablet = bp === "tablet";
  return (
    <div id="about" style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #0d0d22 0%, #1a1230 40%, #0f0e20 100%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "18%", left: "12%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,108,0.18) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "55%", right: "10%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,108,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `repeating-linear-gradient(45deg, ${C.gold} 0, ${C.gold} 1px, transparent 0, transparent 30px)`, backgroundSize: "42px 42px" }} />
      </div>
      <div style={{ position: "relative", textAlign: "center", maxWidth: 780, padding: isMobile ? "100px 24px 40px" : "0 40px", zIndex: 2 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 7, color: C.gold, textTransform: "uppercase", marginBottom: 26, opacity: 0.85 }}>Premium Event Management · Metro Manila</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 52 : isTablet ? 68 : 86, color: "#ffffff", fontWeight: 300, lineHeight: 1.0, margin: "0 0 22px" }}>Crafting<br /><em style={{ color: C.gold }}>Unforgettable</em><br />Moments</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.48)", lineHeight: 1.9, margin: "0 0 48px", fontWeight: 300 }}>From intimate celebrations to grand corporate affairs, we bring your vision to life.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onLoginClick} style={{ padding: isMobile ? "13px 32px" : "15px 44px", background: C.gold, color: C.navy, border: "none", borderRadius: 2, fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", fontWeight: 600 }}>Book a Consultation</button>
          <a href="#gallery" style={{ padding: isMobile ? "13px 28px" : "15px 40px", background: "transparent", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 2, fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>View Gallery</a>
        </div>
      </div>
    </div>
  );
}

function Services() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const items = [
    { icon: "💍", title: "Weddings", desc: "Bespoke wedding design—from intimate ceremonies to grand receptions. Full coordination, florals, and styling.", stat: "200+ Events" },
    { icon: "🏢", title: "Corporate", desc: "Professional event management for conferences, product launches, galas, and team engagements.", stat: "150+ Events" },
    { icon: "🎉", title: "Celebrations", desc: "Birthdays, debuts, anniversaries—every milestone deserves a beautifully designed celebration.", stat: "300+ Events" },
  ];
  return (
    <section id="services" style={{ padding: isMobile ? "60px 20px" : "100px 80px", background: C.white }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 5, color: C.gold, textTransform: "uppercase", marginBottom: 14 }}>What We Do</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 38 : 52, fontWeight: 400, color: C.navy, margin: 0 }}>Our Services</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 28, maxWidth: 1020, margin: "0 auto" }}>
        {items.map(s => (
          <div key={s.title} style={{ padding: isMobile ? "28px 22px" : "44px 32px", borderTop: `3px solid ${C.gold}`, background: C.bg }}>
            <div style={{ fontSize: 36, marginBottom: 20 }}>{s.icon}</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, color: C.navy, margin: "0 0 12px" }}>{s.title}</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.75, margin: "0 0 20px", fontWeight: 300 }}>{s.desc}</p>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.gold, letterSpacing: 1, fontWeight: 500 }}>{s.stat}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const items = [
    { label: "Weddings", events: "80+ this year", gradient: "linear-gradient(135deg, #1a0e04 0%, #3a2008 60%, #251508 100%)", tag: "💍" },
    { label: "Corporate Events", events: "45+ this year", gradient: "linear-gradient(135deg, #040e1e 0%, #0a1e3a 60%, #061428 100%)", tag: "🏢" },
    { label: "Debuts & Birthdays", events: "55+ this year", gradient: "linear-gradient(135deg, #1a0410 0%, #3a0820 60%, #281018 100%)", tag: "🎉" },
    { label: "Anniversaries", events: "30+ this year", gradient: "linear-gradient(135deg, #0e0820 0%, #1e1038 60%, #140c28 100%)", tag: "💜" },
  ];
  return (
    <section id="gallery" style={{ padding: isMobile ? "60px 20px" : "100px 80px", background: C.navy }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 5, color: C.gold, textTransform: "uppercase", marginBottom: 14 }}>Our Work</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 38 : 52, fontWeight: 400, color: C.white, margin: 0 }}>Recent Events</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16, maxWidth: 1040, margin: "0 auto" }}>
        {items.map((item, i) => (
          <div key={item.label} style={{ position: "relative", height: isMobile ? 200 : 260, borderRadius: 4, overflow: "hidden", background: item.gradient }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.8) 0, rgba(255,255,255,0.8) 1px, transparent 0, transparent 20px)`, backgroundSize: "28px 28px" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "48px 28px 24px", background: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%)" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.tag}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: C.white }}>{item.label}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{item.events}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsBand() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const items = [{ num: "650+", label: "Events Completed" }, { num: "12", label: "Years Experience" }, { num: "98%", label: "Client Satisfaction" }, { num: "50+", label: "Trusted Suppliers" }];
  return (
    <section style={{ padding: isMobile ? "48px 24px" : "72px 80px", background: "linear-gradient(135deg, #0d0d22 0%, #1a1a38 100%)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 32 : 40, maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        {items.map(s => (
          <div key={s.label}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 42 : 54, fontWeight: 300, color: C.gold }}>{s.num}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2.5, textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PublicReviews({ reviews }) {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  return (
    <section style={{ padding: isMobile ? "60px 20px" : "100px 80px", background: C.cream }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 5, color: C.gold, textTransform: "uppercase", marginBottom: 14 }}>Testimonials</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 38 : 52, fontWeight: 400, color: C.navy, margin: 0 }}>What Our Clients Say</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 24, maxWidth: 1060, margin: "0 auto" }}>
        {reviews.slice(0, 6).map((r, i) => (
          <div key={i} style={{ background: C.white, padding: "32px 28px", borderBottom: `3px solid ${C.gold}` }}>
            <div style={{ color: "#f0b429", fontSize: 15, marginBottom: 16, letterSpacing: 3 }}>{"★".repeat(r.rating)}</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: C.text, lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>"{r.text}"</p>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: C.navy }}>{r.name}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: C.muted, marginTop: 3 }}>{r.event}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InquiryCTA({ onLoginClick }) {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", event: "", date: "", message: "" });
  return (
    <section id="contact" style={{ padding: isMobile ? "60px 20px" : "100px 80px", background: C.white }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 80, maxWidth: 1040, margin: "0 auto", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: 5, color: C.gold, textTransform: "uppercase", marginBottom: 16 }}>Start Planning</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 36 : 48, fontWeight: 400, color: C.navy, margin: "0 0 20px", lineHeight: 1.1 }}>Let's Create Something Beautiful</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.9, fontWeight: 300, margin: "0 0 32px" }}>Whether it's your dream wedding or a flagship corporate event—we'd love to hear from you.</p>
          {[{ icon: "📧", label: "hello@metroevents.ph" }, { icon: "📞", label: "+63 917 XXX XXXX" }, { icon: "📍", label: "Makati City, Metro Manila" }].map(c => (
            <div key={c.label} style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: C.navy, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{c.icon}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.text }}>{c.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: C.bg, padding: "36px 32px", borderRadius: 8, border: `1px solid ${C.border}` }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>✨</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: C.navy, marginBottom: 12 }}>Salamat!</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.muted }}>We'll get back within 24 hours.</div>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", event: "", date: "", message: "" }); }} style={{ marginTop: 20, padding: "10px 24px", background: C.navy, color: C.white, border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (form.name && form.email) setSent(true); }}>
              <div style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif", color: C.navy, fontWeight: 500, marginBottom: 22 }}>Quick Inquiry</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div><label style={lbl}>Name</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inp({ fontSize: 13 })} placeholder="Full name" /></div>
                <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inp({ fontSize: 13 })} placeholder="your@email.com" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div><label style={lbl}>Event Type</label>
                  <select value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))} style={inp({ fontSize: 13 })}>
                    <option value="">Select...</option>
                    {["Wedding", "Corporate", "Birthday/Debut", "Anniversary", "Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Event Date</label><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={inp({ fontSize: 13 })} /></div>
              </div>
              <div style={{ marginBottom: 18 }}><label style={lbl}>Message</label><textarea rows={3} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ ...inp({ fontSize: 13 }), resize: "vertical" }} placeholder="Tell us about your vision..." /></div>
              <button type="submit" style={{ width: "100%", padding: "12px", background: C.navy, color: C.white, border: "none", borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer" }}>Send Inquiry</button>
              <div style={{ textAlign: "center", marginTop: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.muted }}>
                Already have an account? <button onClick={onLoginClick} type="button" style={{ background: "none", border: "none", color: C.goldDark, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Sign in</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  return (
    <footer style={{ padding: isMobile ? "40px 20px" : "52px 80px", background: "#08081a", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "flex-start", gap: isMobile ? 32 : 0 }}>
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: C.gold, letterSpacing: 3, textTransform: "uppercase" }}>Metro Events</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 10, lineHeight: 2 }}>Premium Event Management<br />Metro Manila, Philippines</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 20 }}>© 2025 Metro Events. All rights reserved.</div>
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 2.2 }}>
        <div style={{ fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 4, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" }}>Get In Touch</div>
        <div>📧 hello@metroevents.ph</div>
        <div>📞 +63 917 XXX XXXX</div>
        <div>📍 Makati City, Metro Manila</div>
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 2.2 }}>
        <div style={{ fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 4, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" }}>Services</div>
        <div>Wedding Coordination</div><div>Corporate Events</div><div>Debuts & Celebrations</div><div>Anniversary Packages</div>
      </div>
    </footer>
  );
}

// ─── CLIENT PORTAL PANEL ──────────────────────────────────────────────────────
function ClientPanel({ user, onClose, onAddReview }) {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [tab, setTab] = useState("overview");
  const [rating, setRating] = useState(0); const [reviewText, setReviewText] = useState(""); const [reviewEvent, setReviewEvent] = useState(""); const [reviewDone, setReviewDone] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ eventType: "", date: "", venue: "", guestCount: "", budget: "", notes: "" }); const [inquiryDone, setInquiryDone] = useState(false);
  const [changeReq, setChangeReq] = useState({ type: "", desc: "", urgency: "Normal" }); const [changeSent, setChangeSent] = useState(false);
  const [approved, setApproved] = useState(null);
  const [profile, setProfile] = useState({ name: user.name, email: user.email, phone: "+63 917 555 0123", address: "Makati City, Metro Manila" }); const [profileSaved, setProfileSaved] = useState(false);

  const tabs = [{ id: "overview", label: "My Events" }, { id: "inquiry", label: "Inquire" }, { id: "changes", label: "Request Change" }, { id: "reviews", label: "Review" }, { id: "profile", label: "Profile" }];
  const iStyle = inp({ fontSize: 13 });

  const panelStyle = isMobile ? { position: "fixed", inset: 0, background: C.white, zIndex: 500, display: "flex", flexDirection: "column" } : { position: "fixed", top: 0, right: 0, bottom: 0, width: 430, background: C.white, zIndex: 500, boxShadow: "-8px 0 60px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" };

  return (
    <div style={panelStyle}>
      <div style={{ padding: "20px 24px 16px", background: C.navy }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.gold, fontWeight: 600, letterSpacing: 1 }}>Client Portal</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Welcome back, {user.name}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 16, borderRadius: 4, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flexShrink: 0, padding: "10px 12px", background: "transparent", border: "none", borderBottom: tab === t.id ? `2px solid ${C.gold}` : "2px solid transparent", fontSize: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer", color: tab === t.id ? C.navy : C.muted, letterSpacing: 0.6, textTransform: "uppercase", whiteSpace: "nowrap" }}>{t.label}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
        {tab === "overview" && (
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 18 }}>Your upcoming and past events</div>
            <div style={{ padding: 18, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>Reyes-Santos Wedding</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>📅 Jul 15, 2025 · The Ruins, Taguig</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>👤 Coordinator: Maria Santos</div>
                </div>
                {stageBadge("Fully Booked")}
              </div>
              <div style={{ padding: "10px 12px", background: C.bg, borderRadius: 6, fontSize: 12, color: C.muted, marginBottom: 12 }}>
                <span style={{ color: C.text }}>Package: </span>Grand Affair · <span style={{ color: C.success, fontWeight: 500 }}>₱285,000</span>
              </div>
              <div style={{ padding: "12px 14px", background: "#fffbf0", borderRadius: 8, border: `1px solid #f0dba0`, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: C.goldDark, marginBottom: 10 }}>⏳ AWAITING YOUR APPROVAL</div>
                <div style={{ fontSize: 12, color: C.text, marginBottom: 12 }}>Proposal v2 — Garden Florals theme with Premium Floral Upgrade has been sent for review.</div>
                {approved === null ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="success" style={{ flex: 1, fontSize: 12, padding: "8px" }} onClick={() => setApproved(true)}>✓ Approve</Btn>
                    <Btn variant="danger" style={{ flex: 1, fontSize: 12, padding: "8px" }} onClick={() => setApproved(false)}>✗ Request Changes</Btn>
                  </div>
                ) : approved ? (
                  <div style={{ padding: "8px 12px", background: C.successBg, color: C.success, borderRadius: 6, fontSize: 12, fontWeight: 500 }}>✓ Proposal Approved!</div>
                ) : (
                  <div style={{ padding: "8px 12px", background: C.dangerBg, color: C.danger, borderRadius: 6, fontSize: 12, fontWeight: 500 }}>Change request noted. See "Request Change" tab.</div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="outline" style={{ fontSize: 11, padding: "6px 14px" }}>View Details</Btn>
                <Btn variant="outline" style={{ fontSize: 11, padding: "6px 14px", color: C.goldDark, borderColor: C.gold }}>Moodboard</Btn>
              </div>
            </div>
            <div style={{ textAlign: "center", padding: "24px 16px", border: `1px dashed ${C.border}`, borderRadius: 10 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.navy, marginBottom: 8 }}>Planning your next event?</div>
              <div style={{ fontSize: 12, marginBottom: 16, color: C.muted }}>We'd love to make more memories with you.</div>
              <Btn onClick={() => setTab("inquiry")}>Book Your Next Event →</Btn>
            </div>
          </div>
        )}
        {tab === "inquiry" && (
          <div>
            {inquiryDone ? (
              <div style={{ textAlign: "center", padding: "44px 16px" }}>
                <div style={{ fontSize: 44, marginBottom: 16 }}>✨</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: C.navy, marginBottom: 10 }}>Inquiry Submitted!</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>Our team will reach out within 24 hours.</div>
                <Btn onClick={() => { setInquiryDone(false); setInquiryForm({ eventType: "", date: "", venue: "", guestCount: "", budget: "", notes: "" }); }} style={{ marginTop: 22 }}>Submit Another</Btn>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Tell us about your dream event</div>
                <div style={{ marginBottom: 14 }}><label style={lbl}>Event Type</label>
                  <select value={inquiryForm.eventType} onChange={e => setInquiryForm(p => ({ ...p, eventType: e.target.value }))} style={iStyle}>
                    <option value="">Select...</option>
                    {["Wedding", "Corporate", "Birthday / Debut", "Anniversary", "Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}><label style={lbl}>Event Date</label><input type="date" value={inquiryForm.date} onChange={e => setInquiryForm(p => ({ ...p, date: e.target.value }))} style={iStyle} /></div>
                <div style={{ marginBottom: 14 }}><label style={lbl}>Preferred Venue</label><input value={inquiryForm.venue} onChange={e => setInquiryForm(p => ({ ...p, venue: e.target.value }))} placeholder="e.g. Makati Shangri-La" style={iStyle} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div><label style={lbl}>Guest Count</label><input type="number" value={inquiryForm.guestCount} onChange={e => setInquiryForm(p => ({ ...p, guestCount: e.target.value }))} placeholder="Est. guests" style={iStyle} /></div>
                  <div><label style={lbl}>Budget Range</label>
                    <select value={inquiryForm.budget} onChange={e => setInquiryForm(p => ({ ...p, budget: e.target.value }))} style={iStyle}>
                      <option value="">Select...</option>
                      {["Below ₱50K", "₱50K–₱150K", "₱150K–₱300K", "₱300K–₱500K", "Above ₱500K"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}><label style={lbl}>Additional Notes</label><textarea value={inquiryForm.notes} onChange={e => setInquiryForm(p => ({ ...p, notes: e.target.value }))} rows={3} style={{ ...iStyle, resize: "vertical" }} placeholder="Special requests, themes, or ideas..." /></div>
                <Btn onClick={() => setInquiryDone(true)} style={{ width: "100%" }}>Submit Inquiry</Btn>
              </div>
            )}
          </div>
        )}
        {tab === "changes" && (
          <div>
            {changeSent ? (
              <div style={{ textAlign: "center", padding: "44px 16px" }}>
                <div style={{ fontSize: 44, marginBottom: 16 }}>📋</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: C.navy, marginBottom: 10 }}>Request Sent!</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>Natanggap na namin ang inyong change request. Updated proposal within 48 hours. Salamat!</div>
                <Btn onClick={() => { setChangeSent(false); setChangeReq({ type: "", desc: "", urgency: "Normal" }); }} style={{ marginTop: 22 }}>New Request</Btn>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>May gusto kang baguhin? Let us know!</div>
                <div style={{ marginBottom: 14 }}><label style={lbl}>Change Type</label>
                  <select value={changeReq.type} onChange={e => setChangeReq(p => ({ ...p, type: e.target.value }))} style={iStyle}>
                    <option value="">Select type...</option>
                    {["Package / Add-on", "Venue / Date", "Theme / Moodboard", "Guest Count", "Timeline", "Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}><label style={lbl}>Urgency</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Normal", "Urgent", "ASAP"].map(u => (
                      <button key={u} onClick={() => setChangeReq(p => ({ ...p, urgency: u }))} style={{ flex: 1, padding: "8px", borderRadius: 6, border: `1.5px solid ${changeReq.urgency === u ? C.gold : C.border}`, background: changeReq.urgency === u ? "#fdf4e0" : C.white, color: changeReq.urgency === u ? C.goldDark : C.muted, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{u}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}><label style={lbl}>Description</label><textarea value={changeReq.desc} onChange={e => setChangeReq(p => ({ ...p, desc: e.target.value }))} rows={5} placeholder="Ipaliwanag ang gusto mong baguhin. The more detail, the better!" style={{ ...iStyle, resize: "vertical" }} /></div>
                <Btn onClick={() => setChangeSent(true)} disabled={!changeReq.type || !changeReq.desc} style={{ width: "100%" }}>Submit Change Request</Btn>
              </div>
            )}
          </div>
        )}
        {tab === "reviews" && (
          <div>
            {reviewDone ? (
              <div style={{ textAlign: "center", padding: "44px 16px" }}>
                <div style={{ fontSize: 44, marginBottom: 16 }}>🌟</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: C.navy, marginBottom: 10 }}>Salamat!</div>
                <div style={{ fontSize: 13, color: C.muted }}>Your review has been submitted. We truly appreciate your feedback!</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>Share your experience with Metro Events</div>
                <div style={{ marginBottom: 18 }}><label style={lbl}>Event Name</label><input value={reviewEvent} onChange={e => setReviewEvent(e.target.value)} style={iStyle} placeholder="e.g. Wedding, Jul 2025" /></div>
                <div style={{ marginBottom: 22 }}>
                  <label style={lbl}>Your Rating</label>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    {[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => setRating(n)} style={{ fontSize: 32, background: "transparent", border: "none", cursor: "pointer", padding: 0, color: n <= rating ? "#f0b429" : "#e0e0d8" }}>★</button>)}
                  </div>
                  {rating > 0 && <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>{["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}</div>}
                </div>
                <div style={{ marginBottom: 20 }}><label style={lbl}>Your Review</label><textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={5} placeholder="Tell us about your experience..." style={{ ...iStyle, resize: "vertical" }} /></div>
                <Btn onClick={() => { if (rating > 0 && reviewText) { onAddReview({ name: user.name, event: reviewEvent || "Event, 2025", rating, text: reviewText }); setReviewDone(true); } }} disabled={rating === 0 || !reviewText} style={{ width: "100%" }}>Submit Review</Btn>
              </div>
            )}
          </div>
        )}
        {tab === "profile" && (
          <div>
            {profileSaved && <div style={{ padding: "10px 14px", background: C.successBg, color: C.success, borderRadius: 6, fontSize: 12, marginBottom: 18, border: `1px solid #b8d9c8` }}>✓ Profile updated!</div>}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26, padding: 16, background: C.bg, borderRadius: 10 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600, color: C.gold }}>{profile.name.charAt(0)}</div>
              <div><div style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{profile.name}</div><div style={{ fontSize: 12, color: C.muted }}>Client Account</div></div>
            </div>
            {[{ label: "Full Name", key: "name" }, { label: "Email Address", key: "email" }, { label: "Phone Number", key: "phone" }, { label: "Address", key: "address" }].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}><label style={lbl}>{f.label}</label><input value={profile[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} style={iStyle} /></div>
            ))}
            <Btn onClick={() => { setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000); }} style={{ width: "100%", marginTop: 6 }}>Save Changes</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ user, onLogout }) {
  const [section, setSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const bp = useBreakpoint();
  const compact = bp !== "desktop";
  const unreadCount = notifications.filter(n => !n.read).length;

  const allNavItems = [
    { id: "overview", label: "Dashboard", icon: "📊", roles: ["admin", "coordinator", "designer", "warehouse"] },
    { id: "pipeline", label: "CRM Pipeline", icon: "📋", roles: ["admin", "coordinator"] },
    { id: "events", label: "All Events", icon: "🗓", roles: ["admin", "coordinator"] },
    { id: "clients", label: "Clients", icon: "👥", roles: ["admin", "coordinator"] },
    { id: "meetings", label: "Meetings", icon: "🤝", roles: ["admin", "coordinator"] },
    { id: "checklist", label: "Checklist", icon: "✅", roles: ["admin", "coordinator", "designer", "warehouse"], phase: 2 },
    { id: "crew", label: "Crew & Tasks", icon: "👷", roles: ["admin", "coordinator"], phase: 2 },
    { id: "inventory", label: "Inventory & Rentals", icon: "📦", roles: ["admin", "coordinator", "warehouse"], phase: 2 },
    { id: "suppliers", label: "Supplier Hub", icon: "🤲", roles: ["admin", "coordinator"], phase: 2 },
    { id: "files", label: "Files", icon: "📁", roles: ["admin", "coordinator", "designer", "warehouse"], phase: 2 },
    { id: "production", label: "Production Scheduler", icon: "🚛", roles: ["admin", "coordinator", "warehouse"], phase: 2 },
    { id: "quotation", label: "Quotation", icon: "💰", roles: ["admin", "coordinator"] },
    { id: "moodboard", label: "Moodboard & Pegs", icon: "🎨", roles: ["admin", "coordinator", "designer"] },
    { id: "templates", label: "Auto-Reply Templates", icon: "💬", roles: ["admin"] },
    { id: "eventday", label: "Event Day", icon: "🎯", roles: ["admin", "coordinator", "warehouse"], phase: 3 },
    { id: "afterevent", label: "After Event", icon: "🎊", roles: ["admin", "coordinator"], phase: 3 },
    { id: "reports", label: "Reports", icon: "📈", roles: ["admin"], phase: 3 },
    { id: "analytics", label: "Analytics Dashboard", icon: "🔮", roles: ["admin"], phase: 4 },
    { id: "advquotation", label: "Advanced Quotation", icon: "💎", roles: ["admin", "coordinator"], phase: 4 },
    { id: "fullinventory", label: "Full Inventory Mgmt", icon: "🏭", roles: ["admin", "warehouse"], phase: 4 },
    { id: "supplierperf", label: "Supplier Performance", icon: "📊", roles: ["admin", "coordinator"], phase: 4 },
    { id: "automation", label: "Automation Center", icon: "⚙️", roles: ["admin"], phase: 4 },
    { id: "auditlog", label: "Audit Log", icon: "🔐", roles: ["admin"], phase: 4 },
    { id: "permissions", label: "Permissions", icon: "🛡", roles: ["admin"], phase: 4 },
  ];

  const navItems = allNavItems.filter(n => n.roles.includes(user.role));

  const roleLabel = { admin: "Administrator", coordinator: "Coordinator", designer: "Designer / Stylist", warehouse: "Warehouse / Logistics" };

  const sidebarContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "24px 22px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: C.gold, letterSpacing: 2, textTransform: "uppercase" }}>Metro Events</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4, letterSpacing: 1.2 }}>Events Portal · Phase 4</div>
      </div>
      <nav style={{ padding: "10px 8px", flex: 1, overflowY: "auto" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => { setSection(item.id); if (compact) setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 10px", background: section === item.id ? "rgba(201,168,108,0.13)" : "transparent", border: "none", borderRadius: 6, cursor: "pointer", textAlign: "left", borderLeft: section === item.id ? `3px solid ${C.gold}` : "3px solid transparent", color: section === item.id ? C.gold : item.phase === 4 ? "rgba(255,160,80,0.75)" : item.phase === 3 ? "rgba(100,220,160,0.65)" : item.phase === 2 ? "rgba(160,200,255,0.6)" : "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginBottom: 1, transition: "all 0.15s", letterSpacing: 0.2 }}>
            <span style={{ fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.phase === 2 && section !== item.id && <span style={{ fontSize: 9, background: "rgba(100,160,255,0.2)", color: "rgba(160,200,255,0.8)", borderRadius: 8, padding: "1px 5px", letterSpacing: 0.3 }}>P2</span>}
            {item.phase === 3 && section !== item.id && <span style={{ fontSize: 9, background: "rgba(100,220,160,0.2)", color: "rgba(100,220,160,0.9)", borderRadius: 8, padding: "1px 5px", letterSpacing: 0.3 }}>P3</span>}
            {item.phase === 4 && section !== item.id && <span style={{ fontSize: 9, background: "rgba(255,160,80,0.2)", color: "rgba(255,160,80,0.9)", borderRadius: 8, padding: "1px 5px", letterSpacing: 0.3 }}>P4</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(201,168,108,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: C.gold, fontWeight: 600 }}>{user.name.charAt(0)}</div>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{user.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{roleLabel[user.role] || user.role}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>Sign Out →</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.bg }}>
      {!compact && (
        <div style={{ width: 236, background: C.navy, display: "flex", flexDirection: "column", flexShrink: 0, position: "relative" }}>
          <button onClick={() => setShowNotifications(p => !p)} style={{ position: "absolute", top: 22, right: 16, background: "transparent", border: "none", color: "rgba(255,255,255,0.45)", fontSize: 14, cursor: "pointer", padding: "2px 4px", display: "flex", alignItems: "center", gap: 2, zIndex: 10 }}>
            🔔{unreadCount > 0 && <span style={{ fontSize: 9, background: C.danger, color: C.white, borderRadius: 10, padding: "1px 4px", fontWeight: 700 }}>{unreadCount}</span>}
          </button>
          {sidebarContent}
        </div>
      )}
      {showNotifications && <NotificationPanel notifications={notifications} onClose={() => setShowNotifications(false)} onMarkRead={(id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n))} onMarkAllRead={() => setNotifications(p => p.map(n => ({ ...n, read: true })))} compact={compact} />}
      {compact && (
        <>
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 56, background: C.navy, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={() => setSidebarOpen(p => !p)} style={{ background: "transparent", border: "none", color: C.gold, fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>☰</button>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: C.gold, letterSpacing: 2, textTransform: "uppercase" }}>Metro Events</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setShowNotifications(p => !p)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 18, cursor: "pointer", position: "relative", padding: "4px" }}>
                🔔{unreadCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, width: 14, height: 14, background: C.danger, borderRadius: "50%", fontSize: 8, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{unreadCount}</span>}
              </button>
              <button onClick={onLogout} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", background: "transparent", border: "none", cursor: "pointer" }}>Sign Out</button>
            </div>
          </div>
          {sidebarOpen && <>
            <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300 }} />
            <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 260, background: C.navy, zIndex: 400 }}>{sidebarContent}</div>
          </>}
        </>
      )}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: compact ? 56 : 0 }}>
        {section === "overview" && <DashboardOverview />}
        {section === "pipeline" && <PipelineView />}
        {section === "events" && <EventsView />}
        {section === "clients" && <ClientsView />}
        {section === "meetings" && <MeetingsView />}
        {section === "checklist" && <ChecklistView />}
        {section === "crew" && <CrewView />}
        {section === "inventory" && <InventoryView />}
        {section === "suppliers" && <SupplierView />}
        {section === "files" && <FilesView />}
        {section === "production" && <ProductionView />}
        {section === "quotation" && <QuotationView />}
        {section === "moodboard" && <MoodboardView />}
        {section === "templates" && <TemplatesView />}
        {section === "eventday" && <EventDayView />}
        {section === "afterevent" && <AfterEventView />}
        {section === "reports" && <ReportsView />}
        {section === "analytics" && <AnalyticsDashboard />}
        {section === "advquotation" && <AdvancedQuotationView />}
        {section === "fullinventory" && <FullInventoryView />}
        {section === "supplierperf" && <SupplierPerformanceView />}
        {section === "automation" && <AutomationView />}
        {section === "auditlog" && <AuditLogView />}
        {section === "permissions" && <PermissionsView />}
      </div>
    </div>
  );
}

// ─── DASHBOARD OVERVIEW ───────────────────────────────────────────────────────
function DashboardOverview() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const totalRev = INITIAL_EVENTS.filter(e => e.value).reduce((s, e) => s + e.value, 0);
  const stats = [
    { label: "Total Revenue", value: `₱${Math.round(totalRev / 1000)}K`, sub: "Confirmed pipeline", icon: "💰" },
    { label: "Active Events", value: INITIAL_EVENTS.filter(e => e.stage !== "Done").length, sub: "In progress", icon: "🗓" },
    { label: "Confirmed Bookings", value: INITIAL_EVENTS.filter(e => ["Reserved", "Fully Booked", "Done"].includes(e.stage)).length, sub: "Reserved & above", icon: "✅" },
    { label: "Pending Follow-up", value: INITIAL_EVENTS.filter(e => ["New Inquiry", "Ocular Scheduled"].includes(e.stage)).length, sub: "Action needed", icon: "⚡" },
  ];
  const pad = isMobile ? "20px 16px" : "32px 36px";
  const reminderColors = { info: C.infoBg, warning: C.warningBg, danger: C.dangerBg };
  const reminderBorders = { info: "#c0d4f0", warning: "#f0d090", danger: "#e0b8b8" };
  const reminderTextColors = { info: C.info, warning: C.warning, danger: C.danger };

  return (
    <div style={{ padding: pad }}>
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: C.text, margin: 0 }}>Dashboard</h1>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Overview · May 2025</div>
      </div>

      {/* Smart Reminders */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, marginBottom: 12, fontWeight: 500 }}>🔔 Smart Reminders</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SMART_REMINDERS.map(r => (
            <div key={r.id} style={{ padding: "12px 16px", background: reminderColors[r.type], border: `1px solid ${reminderBorders[r.type]}`, borderRadius: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: reminderTextColors[r.type], marginBottom: 2 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: C.text }}>{r.body}</div>
              </div>
              {r.event && <div style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap", marginTop: 2 }}>{r.event}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
        {[{ icon: "📩", label: "New Inquiry" }, { icon: "🗓", label: "Add Event" }, { icon: "🤝", label: "Schedule Meeting" }, { icon: "💎", label: "Smart Quote" }, { icon: "⚙️", label: "Automation" }].map(a => (
          <button key={a.label} style={{ padding: isMobile ? "10px 6px" : "14px 10px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 10 : 11, color: C.text, fontWeight: 500 }}>
            <div style={{ fontSize: isMobile ? 18 : 20 }}>{a.icon}</div>{a.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: C.white, padding: "18px 20px", borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 0.3, lineHeight: 1.3 }}>{s.label}</div>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 500, color: C.text }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "3fr 2fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Recent Events */}
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>Recent Events</div>
              <Badge color="gray">{INITIAL_EVENTS.length} Total</Badge>
            </div>
            {INITIAL_EVENTS.slice(0, 5).map((ev, i) => (
              <div key={ev.id} style={{ padding: "12px 20px", borderBottom: i < 4 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                  {ev.type === "Wedding" ? "💍" : ev.type === "Corporate" ? "🏢" : "🎉"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.client}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{ev.date}</div>
                </div>
                {stageBadge(ev.stage)}
                <div style={{ fontSize: 12, color: C.muted, minWidth: 52, textAlign: "right", fontWeight: 500 }}>{ev.value ? `₱${Math.round(ev.value / 1000)}K` : "—"}</div>
              </div>
            ))}
          </div>

          {/* Production Snapshot */}
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>🚛 Production Snapshot</div>
            </div>
            {PRODUCTION_SCHEDULE.map(p => (
              <div key={p.id} style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{p.event}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>📅 {p.eventDate}</div>
                </div>
                {p.items.filter(i => i.status !== "Done").slice(0, 2).map((item, j) => (
                  <div key={j} style={{ fontSize: 11, color: C.muted, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.status === "In Progress" ? C.info : C.border, flexShrink: 0 }} />
                    {item.task} <span style={{ color: C.warning }}>· due {item.dueDate}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, height: "fit-content" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>Activity Stream</div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.success }} />
          </div>
          {ACTIVITY_DATA.map((a, i) => (
            <div key={a.id} style={{ padding: "10px 18px", borderBottom: i < ACTIVITY_DATA.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.text, lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 4 Highlights */}
      <div style={{ marginTop: 20, padding: "18px 20px", background: "linear-gradient(135deg, #12122a 0%, #1a1a38 100%)", borderRadius: 14, border: "1px solid rgba(201,168,108,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.gold, fontWeight: 600 }}>⚡ Phase 4 Modules Active</div>
          <span style={{ fontSize: 10, background: "rgba(255,160,80,0.15)", color: "rgba(255,160,80,0.9)", border: "1px solid rgba(255,160,80,0.25)", borderRadius: 20, padding: "3px 10px", fontWeight: 600, letterSpacing: 0.5 }}>NEW</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 10 }}>
          {[
            { icon: "🔮", label: "Analytics Dashboard", desc: "Revenue trends, conversion funnel, add-on performance" },
            { icon: "💎", label: "Advanced Quotation", desc: "Dynamic pricing rules, discount engine, margin analysis" },
            { icon: "🏭", label: "Full Inventory Mgmt", desc: "Replacement costs, dead stock alerts, asset tracking" },
            { icon: "📊", label: "Supplier Performance", desc: "Scorecards, on-time rates, quality tracking" },
            { icon: "⚙️", label: "Automation Center", desc: "Loading list generator, auto-reminders, scheduled tasks" },
            { icon: "🔐", label: "Audit Log + Permissions", desc: "Full action trail & role-based access matrix" },
          ].map(m => (
            <div key={m.label} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.75)", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function PipelineView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const grouped = {};
  STAGES.forEach(s => { grouped[s] = events.filter(e => e.stage === s); });
  function advanceStage(id, next) { setEvents(prev => prev.map(e => e.id === id ? { ...e, stage: next } : e)); }
  const pad = isMobile ? "20px 12px" : "32px 36px";
  return (
    <div style={{ padding: pad }}>
      <SectionHeader title="CRM Pipeline" sub="New Inquiry → Ocular → Proposal → Reserved → Fully Booked → Done" />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 12 }}>
        {STAGES.map(stage => (
          <div key={stage} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ padding: "11px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: C.text }}>{stage}</div>
              <Badge color="gray">{grouped[stage].length}</Badge>
            </div>
            <div style={{ padding: 10, minHeight: 60 }}>
              {grouped[stage].length === 0 ? <div style={{ padding: 14, textAlign: "center", fontSize: 12, color: C.muted }}>—</div>
                : grouped[stage].map(ev => {
                    const action = NEXT_ACTIONS[ev.stage];
                    return (
                      <div key={ev.id} style={{ padding: "11px 12px", background: C.bg, borderRadius: 8, marginBottom: 8, border: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 4 }}>{ev.client}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>📅 {ev.date}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: action ? 8 : 0 }}>
                          <Badge color={typeColor(ev.type)}>{ev.type}</Badge>
                          <div style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{ev.value ? `₱${Math.round(ev.value / 1000)}K` : "TBD"}</div>
                        </div>
                        {action && <button onClick={() => advanceStage(ev.id, action.next)} style={{ width: "100%", padding: "7px 10px", background: C.navy, color: C.white, border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>{action.icon} {action.label}</button>}
                      </div>
                    );
                  })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EVENTS VIEW ──────────────────────────────────────────────────────────────
function EventsView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [filter, setFilter] = useState("All");
  const types = ["All", "Wedding", "Corporate", "Birthday"];
  const filtered = filter === "All" ? INITIAL_EVENTS : INITIAL_EVENTS.filter(e => e.type === filter);
  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="All Events" sub={`${INITIAL_EVENTS.length} events this cycle`} action={<Btn style={{ fontSize: isMobile ? 12 : 13, padding: isMobile ? "8px 14px" : "10px 22px" }}>+ New Event</Btn>} />
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {types.map(t => <button key={t} onClick={() => setFilter(t)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: filter === t ? C.navy : C.white, color: filter === t ? C.white : C.muted, border: `1px solid ${filter === t ? C.navy : C.border}` }}>{t}</button>)}
      </div>
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflowX: "auto" }}>
        {filtered.map((ev, i) => (
          <div key={ev.id} style={{ padding: "13px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none", display: isMobile ? "block" : "grid", gridTemplateColumns: "2fr 1fr 1fr 1.2fr 1fr", alignItems: "center", gap: 8, minWidth: isMobile ? "auto" : 560 }}>
            <div style={{ marginBottom: isMobile ? 8 : 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{ev.client}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>📍 {ev.venue} · {ev.date}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: isMobile ? 4 : 0, flexWrap: "wrap" }}>
              <Badge color={typeColor(ev.type)}>{ev.type}</Badge>
              {isMobile && stageBadge(ev.stage)}
            </div>
            {!isMobile && <div style={{ fontSize: 12, color: C.muted }}>{ev.date}</div>}
            {!isMobile && stageBadge(ev.stage)}
            <div style={{ fontSize: 13, color: C.text, textAlign: isMobile ? "left" : "right", fontWeight: 500 }}>{ev.value ? `₱${Math.round(ev.value / 1000)}K` : "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CLIENTS VIEW ─────────────────────────────────────────────────────────────
function ClientsView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [search, setSearch] = useState("");
  const filtered = CLIENTS_DATA.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));
  const scMap = { Active: "green", Inquiry: "blue", Past: "gray" };
  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="Clients" sub={`${CLIENTS_DATA.length} registered clients`} action={<Btn style={{ fontSize: isMobile ? 12 : 13, padding: isMobile ? "8px 14px" : "10px 22px" }}>+ Add Client</Btn>} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14, marginBottom: 22 }}>
        {[{ label: "Active Clients", value: CLIENTS_DATA.filter(c => c.status === "Active").length, icon: "✅", color: C.successBg }, { label: "Inquiries", value: CLIENTS_DATA.filter(c => c.status === "Inquiry").length, icon: "📩", color: C.infoBg }, { label: "Past Clients", value: CLIENTS_DATA.filter(c => c.status === "Past").length, icon: "📁", color: "#f0f0ee" }].map(s => (
          <div key={s.label} style={{ background: s.color, borderRadius: 10, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 10, color: C.muted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div><div style={{ fontSize: 28, fontWeight: 500, color: C.text }}>{s.value}</div></div>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 14 }}><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." style={{ ...inp(), maxWidth: 320, fontSize: 13 }} /></div>
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
        {filtered.map((c, i) => (
          <div key={c.id} style={{ padding: "14px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.gold, flexShrink: 0 }}>{c.name.charAt(0)}</div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{c.email} · {c.phone}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge color={typeColor(c.type)}>{c.type}</Badge>
              <Badge color={scMap[c.status] || "gray"}>{c.status}</Badge>
            </div>
            <div style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{c.joined}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MEETINGS VIEW ────────────────────────────────────────────────────────────
function MeetingsView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [showForm, setShowForm] = useState(false);
  const [meetings, setMeetings] = useState(MEETINGS_DATA);
  const [form, setForm] = useState({ title: "", datetime: "", location: "", linkedEvent: "", packageAvailed: "", agenda: "", attendees: "", linkedTask: "" });
  const iStyle = inp({ fontSize: 13 });

  function save() {
    if (!form.title) return;
    setMeetings(prev => [...prev, { id: prev.length + 1, title: form.title, date: form.datetime ? form.datetime.split("T")[0] : "TBD", time: form.datetime ? form.datetime.split("T")[1] : "", location: form.location, attendees: form.attendees.split(",").map(a => a.trim()).filter(Boolean), status: "Scheduled", agenda: form.agenda, linkedEvent: form.linkedEvent, packageAvailed: form.packageAvailed, linkedTask: form.linkedTask, files: [] }]);
    setShowForm(false);
    setForm({ title: "", datetime: "", location: "", linkedEvent: "", packageAvailed: "", agenda: "", attendees: "", linkedTask: "" });
  }

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="Meeting Schedules" sub="Consultations, oculars, and design presentations" action={<Btn onClick={() => setShowForm(!showForm)} style={{ fontSize: isMobile ? 12 : 13, padding: isMobile ? "8px 14px" : "10px 22px" }}>+ Schedule Meeting</Btn>} />
      {showForm && (
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 18 }}>New Meeting</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div><label style={lbl}>Meeting Title</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Venue Ocular — Garcia Debut" style={iStyle} /></div>
            <div><label style={lbl}>Date & Time</label><input type="datetime-local" value={form.datetime} onChange={e => setForm(p => ({ ...p, datetime: e.target.value }))} style={iStyle} /></div>
            <div><label style={lbl}>Location / Platform</label><input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Zoom / Venue Address" style={iStyle} /></div>
            <div><label style={lbl}>Linked Event</label>
              <select value={form.linkedEvent} onChange={e => setForm(p => ({ ...p, linkedEvent: e.target.value }))} style={iStyle}>
                <option value="">Select event...</option>
                {INITIAL_EVENTS.map(e => <option key={e.id}>{e.client}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Package Availed</label>
              <select value={form.packageAvailed} onChange={e => setForm(p => ({ ...p, packageAvailed: e.target.value }))} style={iStyle}>
                <option value="">Select package...</option>
                {PACKAGES.map(p => <option key={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Link to Checklist Task</label>
              <select value={form.linkedTask} onChange={e => setForm(p => ({ ...p, linkedTask: e.target.value }))} style={iStyle}>
                <option value="">Select task (optional)...</option>
                {INITIAL_CHECKLIST.map(c => <option key={c.id}>{c.task}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 14 }}><label style={lbl}>Attendees (comma-separated)</label><input value={form.attendees} onChange={e => setForm(p => ({ ...p, attendees: e.target.value }))} placeholder="Admin, Maria Santos, Client" style={iStyle} /></div>
          <div style={{ marginTop: 14 }}><label style={lbl}>Agenda / Notes</label><textarea value={form.agenda} onChange={e => setForm(p => ({ ...p, agenda: e.target.value }))} rows={2} style={{ ...iStyle, resize: "vertical" }} /></div>
          <div style={{ marginTop: 14 }}>
            <label style={lbl}>Attach Files</label>
            <div style={{ padding: "12px 16px", border: `2px dashed ${C.border}`, borderRadius: 8, textAlign: "center", color: C.muted, fontSize: 12, cursor: "pointer" }}>📎 Click to attach files (floor plan, moodboard, etc.)</div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <Btn onClick={save}>Save Meeting</Btn>
            <Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </div>
      )}
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
        {meetings.map((m, i) => (
          <div key={m.id} style={{ padding: "20px 24px", borderBottom: i < meetings.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{m.title}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>📅 {m.date} at {m.time} &nbsp;·&nbsp; 📍 {m.location}</div>
              </div>
              <Badge color={m.status === "Done" ? "green" : "blue"}>{m.status}</Badge>
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}><span style={{ color: C.text }}>Agenda: </span>{m.agenda}{m.outcome && <><span style={{ margin: "0 8px" }}>·</span><span style={{ color: C.success }}>✓ {m.outcome}</span></>}</div>
            {(m.linkedEvent || m.packageAvailed) && (
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>
                {m.linkedEvent && <><span style={{ color: C.text }}>Event: </span>{m.linkedEvent}</>}
                {m.packageAvailed && <><span style={{ margin: "0 8px" }}>·</span><span style={{ color: C.text }}>Package: </span><span style={{ color: C.goldDark, fontWeight: 500 }}>{m.packageAvailed}</span></>}
              </div>
            )}
            {m.files && m.files.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                {m.files.map(f => (
                  <div key={f} style={{ padding: "3px 10px", background: C.infoBg, borderRadius: 20, fontSize: 11, color: C.info, border: `1px solid #c0d4f0`, display: "flex", alignItems: "center", gap: 4 }}>📎 {f}</div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {m.attendees.map(a => <div key={a} style={{ padding: "3px 10px", background: C.bg, borderRadius: 20, fontSize: 11, color: C.muted, border: `1px solid ${C.border}` }}>{a}</div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHECKLIST VIEW (PHASE 2) ─────────────────────────────────────────────────
function ChecklistView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterEvent, setFilterEvent] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ category: "Pre-Production", task: "", event: "", assignee: "", dueDate: "", priority: "Medium" });

  const events = ["All", ...new Set(INITIAL_EVENTS.map(e => e.client))];
  const categories = ["All", ...CHECKLIST_CATEGORIES];

  const filtered = checklist.filter(c =>
    (activeCategory === "All" || c.category === activeCategory) &&
    (filterEvent === "All" || c.event === filterEvent)
  );

  function toggleStatus(id) {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "Done" ? "Pending" : "Done" } : c));
  }

  function addItem() {
    if (!newItem.task || !newItem.event) return;
    setChecklist(prev => [...prev, { ...newItem, id: prev.length + 1, status: "Pending" }]);
    setShowForm(false);
    setNewItem({ category: "Pre-Production", task: "", event: "", assignee: "", dueDate: "", priority: "Medium" });
  }

  const categoryColors = { "Pre-Production": "blue", "Fabrication": "purple", "Supplier": "amber", "Load-in": "green", "Load-out": "gray" };
  const priorityColors = { High: "red", Medium: "amber", Low: "gray" };
  const iStyle = inp({ fontSize: 13 });

  const doneCount = filtered.filter(c => c.status === "Done").length;
  const pct = filtered.length ? Math.round((doneCount / filtered.length) * 100) : 0;

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="Checklist" sub="Pre-production, fabrication, supplier, load-in/out tasks" action={<Btn onClick={() => setShowForm(!showForm)} style={{ fontSize: isMobile ? 12 : 13, padding: isMobile ? "8px 14px" : "10px 22px" }}>+ Add Task</Btn>} />

      {/* Progress bar */}
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "16px 20px", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{doneCount} of {filtered.length} tasks completed</div>
          <div style={{ fontSize: 12, color: C.muted }}>{pct}%</div>
        </div>
        <div style={{ height: 8, background: C.bg, borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}` }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.success}, #5a9e6f)`, borderRadius: 4, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "6px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: activeCategory === cat ? C.navy : C.white, color: activeCategory === cat ? C.white : C.muted, border: `1px solid ${activeCategory === cat ? C.navy : C.border}` }}>{cat}</button>
        ))}
      </div>
      <div style={{ marginBottom: 18 }}>
        <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} style={{ ...inp({ fontSize: 12 }), maxWidth: 280 }}>
          {events.map(e => <option key={e}>{e}</option>)}
        </select>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 14 }}>New Checklist Task</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            <div><label style={lbl}>Category</label>
              <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))} style={iStyle}>
                {CHECKLIST_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Linked Event</label>
              <select value={newItem.event} onChange={e => setNewItem(p => ({ ...p, event: e.target.value }))} style={iStyle}>
                <option value="">Select event...</option>
                {INITIAL_EVENTS.map(e => <option key={e.id}>{e.client}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}><label style={lbl}>Task Description</label><input value={newItem.task} onChange={e => setNewItem(p => ({ ...p, task: e.target.value }))} placeholder="What needs to be done?" style={iStyle} /></div>
            <div><label style={lbl}>Assignee</label>
              <select value={newItem.assignee} onChange={e => setNewItem(p => ({ ...p, assignee: e.target.value }))} style={iStyle}>
                <option value="">Select...</option>
                {CREW_DATA.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Due Date</label><input type="date" value={newItem.dueDate} onChange={e => setNewItem(p => ({ ...p, dueDate: e.target.value }))} style={iStyle} /></div>
            <div><label style={lbl}>Priority</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["High", "Medium", "Low"].map(p => (
                  <button key={p} onClick={() => setNewItem(prev => ({ ...prev, priority: p }))} style={{ flex: 1, padding: "8px", borderRadius: 6, border: `1.5px solid ${newItem.priority === p ? C.gold : C.border}`, background: newItem.priority === p ? "#fdf4e0" : C.white, color: newItem.priority === p ? C.goldDark : C.muted, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}><Btn onClick={addItem}>Save Task</Btn><Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn></div>
        </div>
      )}

      {/* Task list grouped by category */}
      {(activeCategory === "All" ? CHECKLIST_CATEGORIES : [activeCategory]).map(cat => {
        const items = filtered.filter(c => c.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Badge color={categoryColors[cat] || "gray"}>{cat}</Badge>
              <div style={{ fontSize: 11, color: C.muted }}>{items.filter(i => i.status === "Done").length}/{items.length} done</div>
            </div>
            <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
              {items.map((item, i) => (
                <div key={item.id} style={{ padding: "14px 18px", borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <button onClick={() => toggleStatus(item.id)} style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${item.status === "Done" ? C.success : C.border}`, background: item.status === "Done" ? C.success : "transparent", flexShrink: 0, marginTop: 2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.status === "Done" && <span style={{ color: "white", fontSize: 12, lineHeight: 1 }}>✓</span>}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: item.status === "Done" ? C.muted : C.text, textDecoration: item.status === "Done" ? "line-through" : "none", fontWeight: 500, marginBottom: 4 }}>{item.task}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ fontSize: 11, color: C.muted }}>👤 {item.assignee || "Unassigned"}</div>
                      {item.dueDate && <div style={{ fontSize: 11, color: C.muted }}>📅 {item.dueDate}</div>}
                      <Badge color={priorityColors[item.priority] || "gray"}>{item.priority}</Badge>
                      <div style={{ fontSize: 11, color: C.muted }}>📌 {item.event}</div>
                    </div>
                  </div>
                  <Badge color={statusColor(item.status)}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CREW VIEW (PHASE 2) ──────────────────────────────────────────────────────
function CrewView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterEvent, setFilterEvent] = useState("All");

  const roleColors = { "Coordinator": "blue", "Designer/Stylist": "purple", "Warehouse/Logistics": "amber" };

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="Crew & Assignments" sub="Tasks, call times, and event assignments per crew member" action={<Btn onClick={() => setShowAddForm(p => !p)} style={{ fontSize: isMobile ? 12 : 13, padding: isMobile ? "8px 14px" : "10px 22px" }}>+ Add Crew</Btn>} />

      {/* Event filter */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", ...INITIAL_EVENTS.map(e => e.client)].map(ev => (
            <button key={ev} onClick={() => setFilterEvent(ev)} style={{ padding: "6px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: filterEvent === ev ? C.navy : C.white, color: filterEvent === ev ? C.white : C.muted, border: `1px solid ${filterEvent === ev ? C.navy : C.border}` }}>{ev === "All" ? "All Events" : ev.split(" ").slice(0, 2).join(" ")}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : selectedCrew ? "1fr 1.2fr" : "repeat(2, 1fr)", gap: 16 }}>
        {/* Crew cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CREW_DATA.filter(c => filterEvent === "All" || c.events.includes(filterEvent)).map(crew => (
            <div key={crew.id} onClick={() => setSelectedCrew(selectedCrew?.id === crew.id ? null : crew)} style={{ background: C.white, borderRadius: 12, border: `2px solid ${selectedCrew?.id === crew.id ? C.gold : C.border}`, padding: "16px 18px", cursor: "pointer", transition: "border-color 0.15s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: C.gold, flexShrink: 0 }}>{crew.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{crew.name}</div>
                  <div style={{ marginTop: 4 }}><Badge color={roleColors[crew.role] || "gray"}>{crew.role}</Badge></div>
                </div>
                <div style={{ fontSize: 12, color: C.muted, textAlign: "right" }}>
                  <div>{crew.tasks.length} task{crew.tasks.length !== 1 ? "s" : ""}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>{crew.email} · {crew.phone}</div>
              <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {crew.events.map(ev => <div key={ev} style={{ padding: "2px 8px", background: C.bg, borderRadius: 20, fontSize: 10, color: C.muted, border: `1px solid ${C.border}` }}>{ev.split(" ").slice(0, 2).join(" ")}</div>)}
              </div>
            </div>
          ))}
        </div>

        {/* Task detail panel */}
        {selectedCrew && (
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, background: C.navy }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(201,168,108,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.gold }}>{selectedCrew.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.white }}>{selectedCrew.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{selectedCrew.role}</div>
                </div>
              </div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>Assigned Tasks</div>
              {selectedCrew.tasks.map((task, i) => (
                <div key={task.id} style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, marginBottom: 10, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 6 }}>{task.task}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>📌 {task.event}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 12, color: C.navy, fontWeight: 500, background: C.infoBg, padding: "4px 10px", borderRadius: 20, border: `1px solid #c0d4f0` }}>🕐 {task.callTime} – {task.endTime}</div>
                    <Badge color={task.status === "Done" ? "green" : "blue"}>{task.status}</Badge>
                  </div>
                </div>
              ))}
              <Btn style={{ width: "100%", marginTop: 6, fontSize: 12 }}>+ Assign New Task</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INVENTORY VIEW (PHASE 2) ─────────────────────────────────────────────────
function InventoryView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [filterCat, setFilterCat] = useState("All");
  const [selected, setSelected] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({ event: "", qty: "", conditionNote: "" });
  const [checkedOut, setCheckedOut] = useState(false);

  const categories = ["All", ...new Set(INITIAL_INVENTORY.map(i => i.category))];
  const filtered = filterCat === "All" ? inventory : inventory.filter(i => i.category === filterCat);

  function getAvailableQty(item) {
    const reserved = item.reservations.reduce((s, r) => s + r.qty, 0);
    return item.qty - reserved;
  }

  function availabilityColor(item) {
    const avail = getAvailableQty(item);
    if (avail <= 0) return "red";
    if (avail < item.qty * 0.3) return "amber";
    return "green";
  }

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="Inventory & Rentals" sub="Catalog, reservations, check-in/out, and condition tracking" action={<Btn style={{ fontSize: isMobile ? 12 : 13, padding: isMobile ? "8px 14px" : "10px 22px" }}>+ Add Item</Btn>} />

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Items", value: inventory.length, icon: "📦", color: C.bg },
          { label: "Available Now", value: inventory.filter(i => getAvailableQty(i) > 0).length, icon: "✅", color: C.successBg },
          { label: "Fully Reserved", value: inventory.filter(i => getAvailableQty(i) <= 0).length, icon: "🔒", color: C.dangerBg },
          { label: "Needs Attention", value: inventory.filter(i => i.condition !== "Good").length, icon: "⚠️", color: C.warningBg },
        ].map(s => (
          <div key={s.label} style={{ background: s.color, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 500, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>{s.value} <span style={{ fontSize: 18 }}>{s.icon}</span></div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {categories.map(cat => <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: filterCat === cat ? C.navy : C.white, color: filterCat === cat ? C.white : C.muted, border: `1px solid ${filterCat === cat ? C.navy : C.border}` }}>{cat}</button>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : selected ? "1fr 1fr" : "repeat(2, 1fr)", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(item => {
            const avail = getAvailableQty(item);
            return (
              <div key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)} style={{ background: C.white, borderRadius: 10, border: `2px solid ${selected?.id === item.id ? C.gold : C.border}`, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ fontSize: 24 }}>{item.emoji}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>📍 {item.location} · {item.category}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.qty} {item.unit}</div>
                    <div style={{ fontSize: 11, color: avail > 0 ? C.success : C.danger, fontWeight: 500 }}>{avail} available</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Badge color={availabilityColor(item)}>{avail <= 0 ? "Fully Reserved" : avail < item.qty * 0.3 ? "Low Stock" : "Available"}</Badge>
                  <Badge color={conditionColor(item.condition)}>{item.condition}</Badge>
                  {item.reservations.length > 0 && <div style={{ fontSize: 11, color: C.muted }}>{item.reservations.length} reservation{item.reservations.length !== 1 ? "s" : ""}</div>}
                </div>
                {item.conditionNote && <div style={{ marginTop: 8, fontSize: 11, color: C.warning, background: C.warningBg, padding: "6px 10px", borderRadius: 6, border: `1px solid #f0d090` }}>⚠️ {item.conditionNote}</div>}
                {/* Reservation bar */}
                {item.qty > 0 && (
                  <div style={{ marginTop: 10, height: 4, background: C.bg, borderRadius: 2, overflow: "hidden", border: `1px solid ${C.border}` }}>
                    <div style={{ height: "100%", width: `${Math.min(100, ((item.qty - avail) / item.qty) * 100)}%`, background: avail <= 0 ? C.danger : C.gold, borderRadius: 2 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected && (
          <div>
            <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, background: C.navy }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{selected.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: C.white }}>{selected.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{selected.category} · {selected.location}</div>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>Reservations</div>
                {selected.reservations.length === 0 ? (
                  <div style={{ fontSize: 12, color: C.muted, padding: "16px", textAlign: "center", background: C.bg, borderRadius: 8 }}>No reservations yet — item is fully available</div>
                ) : selected.reservations.map((r, i) => (
                  <div key={i} style={{ padding: "10px 14px", background: C.bg, borderRadius: 8, marginBottom: 8, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{r.event}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>📅 {r.date}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{r.qty} {selected.unit}</div>
                  </div>
                ))}

                {/* Check-out form */}
                <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 12 }}>📤 Check Out</div>
                  {checkedOut ? (
                    <div style={{ padding: "10px 14px", background: C.successBg, color: C.success, borderRadius: 8, fontSize: 12, fontWeight: 500 }}>✓ Checked out successfully! Inventory updated.</div>
                  ) : (
                    <>
                      <div style={{ marginBottom: 10 }}>
                        <label style={lbl}>Linked Event</label>
                        <select value={checkoutForm.event} onChange={e => setCheckoutForm(p => ({ ...p, event: e.target.value }))} style={inp({ fontSize: 12 })}>
                          <option value="">Select event...</option>
                          {INITIAL_EVENTS.map(e => <option key={e.id}>{e.client}</option>)}
                        </select>
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <label style={lbl}>Quantity</label>
                        <input type="number" value={checkoutForm.qty} onChange={e => setCheckoutForm(p => ({ ...p, qty: e.target.value }))} style={inp({ fontSize: 12 })} placeholder={`Max: ${getAvailableQty(selected)}`} />
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <label style={lbl}>Condition Notes</label>
                        <textarea value={checkoutForm.conditionNote} onChange={e => setCheckoutForm(p => ({ ...p, conditionNote: e.target.value }))} rows={2} placeholder="Note any existing damage before check-out..." style={{ ...inp({ fontSize: 12 }), resize: "vertical" }} />
                      </div>
                      <Btn onClick={() => setCheckedOut(true)} style={{ width: "100%", fontSize: 12 }} disabled={!checkoutForm.event || !checkoutForm.qty}>Confirm Check-out</Btn>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SUPPLIER VIEW (PHASE 2) ──────────────────────────────────────────────────
function SupplierView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [selected, setSelected] = useState(null);
  const [filterEvent, setFilterEvent] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const events = ["All", ...new Set(SUPPLIER_DATA.map(s => s.linkedEvent))];
  const filtered = filterEvent === "All" ? SUPPLIER_DATA : SUPPLIER_DATA.filter(s => s.linkedEvent === filterEvent);

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="Supplier Hub" sub="Contacts, contracts, delivery windows, and payment tracking" action={<Btn onClick={() => setShowForm(p => !p)} style={{ fontSize: isMobile ? 12 : 13, padding: isMobile ? "8px 14px" : "10px 22px" }}>+ Add Supplier</Btn>} />

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Suppliers", value: SUPPLIER_DATA.length, icon: "🤲", color: C.bg },
          { label: "Contracts Signed", value: SUPPLIER_DATA.filter(s => s.contractStatus === "Signed").length, icon: "✅", color: C.successBg },
          { label: "Pending Contract", value: SUPPLIER_DATA.filter(s => s.contractStatus === "Pending").length, icon: "⏳", color: C.warningBg },
          { label: "Payment Due", value: SUPPLIER_DATA.filter(s => s.paymentStatus !== "Fully Paid").length, icon: "💳", color: C.dangerBg },
        ].map(s => (
          <div key={s.label} style={{ background: s.color, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 500, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>{s.value} <span style={{ fontSize: 18 }}>{s.icon}</span></div>
          </div>
        ))}
      </div>

      {/* Event filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {events.map(ev => <button key={ev} onClick={() => setFilterEvent(ev)} style={{ padding: "6px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: filterEvent === ev ? C.navy : C.white, color: filterEvent === ev ? C.white : C.muted, border: `1px solid ${filterEvent === ev ? C.navy : C.border}` }}>{ev === "All" ? "All Events" : ev.split(" ").slice(0, 2).join(" ")}</button>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : selected ? "1fr 1fr" : "1fr", gap: 16 }}>
        <div>
          {filtered.map((s, i) => (
            <div key={s.id} onClick={() => setSelected(selected?.id === s.id ? null : s)} style={{ background: C.white, borderRadius: 10, border: `2px solid ${selected?.id === s.id ? C.gold : C.border}`, padding: "16px 18px", marginBottom: 10, cursor: "pointer", transition: "border-color 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.category} · {s.email}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                  <Badge color={contractColor(s.contractStatus)}>{s.contractStatus}</Badge>
                  <Badge color={paymentColor(s.paymentStatus)}>{s.paymentStatus}</Badge>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11 }}>
                <div style={{ color: C.muted }}>📞 {s.contact}</div>
                <div style={{ color: C.muted }}>🚛 {s.deliveryWindow}</div>
                <div style={{ color: C.muted }}>📌 {s.linkedEvent}</div>
              </div>
              {s.notes && <div style={{ marginTop: 8, fontSize: 11, color: C.muted, fontStyle: "italic", padding: "6px 10px", background: C.bg, borderRadius: 6 }}>💬 {s.notes}</div>}
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <div style={{ fontSize: 11, color: C.muted }}>Down: <strong style={{ color: C.text }}>{s.downpayment}</strong></div>
                <div style={{ fontSize: 11, color: C.muted }}>Balance: <strong style={{ color: s.balance === "—" ? C.success : C.danger }}>{s.balance}</strong></div>
                <div style={{ marginLeft: "auto" }}>
                  {[1, 2, 3, 4, 5].map(n => <span key={n} style={{ color: n <= s.rating ? "#f0b429" : "#e0e0d8", fontSize: 12 }}>★</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && !isMobile && (
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", height: "fit-content" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, background: C.navy }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: C.white }}>{selected.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{selected.category}</div>
            </div>
            <div style={{ padding: 20 }}>
              {[["Contact", selected.contact], ["Email", selected.email], ["Linked Event", selected.linkedEvent], ["Delivery Window", selected.deliveryWindow], ["Contract", selected.contractStatus], ["Payment", selected.paymentStatus], ["Downpayment", selected.downpayment], ["Balance", selected.balance]].map(([label, val]) => (
                <div key={label} style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <div style={{ color: C.muted }}>{label}</div>
                  <div style={{ color: C.text, fontWeight: 500 }}>{val}</div>
                </div>
              ))}
              {selected.notes && <div style={{ marginTop: 14, padding: "12px", background: C.warningBg, borderRadius: 8, fontSize: 12, color: C.warning, border: `1px solid #f0d090` }}>⚠️ {selected.notes}</div>}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>Upload Proof of Payment</div>
                <div style={{ padding: "16px", border: `2px dashed ${C.border}`, borderRadius: 8, textAlign: "center", color: C.muted, fontSize: 12, cursor: "pointer" }}>📎 Click to upload (receipt, bank transfer, etc.)</div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <Btn style={{ flex: 1, fontSize: 12, padding: "10px" }}>Mark Paid</Btn>
                <Btn variant="outline" style={{ fontSize: 12, padding: "10px 14px" }}>Edit</Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FILES VIEW (PHASE 2) ─────────────────────────────────────────────────────
function FilesView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [files, setFiles] = useState(INITIAL_FILES);
  const [filterEvent, setFilterEvent] = useState("All");
  const [filterCat, setFilterCat] = useState("All");
  const [dragOver, setDragOver] = useState(false);

  const events = ["All", ...new Set(INITIAL_EVENTS.map(e => e.client))];
  const categories = ["All", ...new Set(INITIAL_FILES.map(f => f.category))];
  const filtered = files.filter(f =>
    (filterEvent === "All" || f.linkedEvent === filterEvent) &&
    (filterCat === "All" || f.category === filterCat)
  );

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="Files" sub="Layouts, floor plans, permits, loading lists, and more" action={<Btn style={{ fontSize: isMobile ? 12 : 13, padding: isMobile ? "8px 14px" : "10px 22px" }}>+ Upload File</Btn>} />

      {/* Drop zone */}
      <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); }} style={{ padding: "24px", border: `2px dashed ${dragOver ? C.gold : C.border}`, borderRadius: 12, textAlign: "center", background: dragOver ? "#fffbf0" : C.bg, marginBottom: 20, transition: "all 0.2s", cursor: "pointer" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4 }}>Drag and drop files here</div>
        <div style={{ fontSize: 12, color: C.muted }}>Supports PDF, images, spreadsheets, and documents · Linked to events automatically</div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {events.map(ev => <button key={ev} onClick={() => setFilterEvent(ev)} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: filterEvent === ev ? C.navy : C.white, color: filterEvent === ev ? C.white : C.muted, border: `1px solid ${filterEvent === ev ? C.navy : C.border}` }}>{ev === "All" ? "All Events" : ev.split(" ").slice(0, 2).join(" ")}</button>)}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {categories.map(cat => <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: filterCat === cat ? C.gold : C.white, color: filterCat === cat ? C.navy : C.muted, border: `1px solid ${filterCat === cat ? C.gold : C.border}` }}>{cat}</button>)}
      </div>

      {/* File table */}
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
        {!isMobile && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 0.6fr", padding: "10px 20px", borderBottom: `1px solid ${C.border}`, fontSize: 10, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", gap: 8 }}>
            <div>File Name</div><div>Category</div><div>Linked Event</div><div>Uploaded</div><div style={{ textAlign: "right" }}>Size</div>
          </div>
        )}
        {filtered.map((f, i) => (
          <div key={f.id} style={{ padding: isMobile ? "14px 16px" : "13px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none", display: isMobile ? "block" : "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 0.6fr", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: isMobile ? 6 : 0 }}>
              <div style={{ fontSize: 22, flexShrink: 0 }}>{fileIcon(f.type)}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{f.name}</div>
                {isMobile && <div style={{ fontSize: 11, color: C.muted }}>{f.category} · {f.linkedEvent.split(" ").slice(0, 2).join(" ")} · {f.date}</div>}
              </div>
            </div>
            {!isMobile && <div><Badge color="gray">{f.category}</Badge></div>}
            {!isMobile && <div style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.linkedEvent}</div>}
            {!isMobile && <div style={{ fontSize: 11, color: C.muted }}>{f.uploadedBy}<br />{f.date}</div>}
            <div style={{ fontSize: 11, color: C.muted, textAlign: isMobile ? "left" : "right" }}>{f.size}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCTION SCHEDULER (PHASE 2) ───────────────────────────────────────────
function ProductionView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [schedule, setSchedule] = useState(PRODUCTION_SCHEDULE);

  function toggleItemStatus(eventId, taskIdx) {
    setSchedule(prev => prev.map(p => p.id === eventId ? {
      ...p,
      items: p.items.map((item, i) => i === taskIdx ? { ...item, status: item.status === "Done" ? "Pending" : "Done" } : item)
    } : p));
  }

  const statusColors = { Done: C.success, "In Progress": C.info, Pending: C.muted };
  const statusBgs = { Done: C.successBg, "In Progress": C.infoBg, Pending: C.bg };

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="Production Scheduler" sub="Fabrication due dates, supplier timelines, and truck loading lists" action={<Btn style={{ fontSize: isMobile ? 12 : 13, padding: isMobile ? "8px 14px" : "10px 22px" }}>+ Add Event Schedule</Btn>} />

      {/* Loading list export */}
      <div style={{ background: C.navy, borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.gold, fontWeight: 600 }}>🚛 Truck Loading List</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Auto-generated from design + rentals — export for warehouse team</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="gold" style={{ fontSize: 12, padding: "8px 16px" }}>Export PDF</Btn>
          <Btn variant="outline" style={{ fontSize: 12, padding: "8px 16px", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}>Export Excel</Btn>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {schedule.map(event => {
          const doneCount = event.items.filter(i => i.status === "Done").length;
          const pct = Math.round((doneCount / event.items.length) * 100);
          return (
            <div key={event.id} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", background: event.color, borderBottom: `1px solid ${event.colorBorder}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{event.event}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>📅 Event Date: {event.eventDate}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 12, color: C.muted }}>{doneCount}/{event.items.length} done</div>
                  <div style={{ width: 80, height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? C.success : C.gold, borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>{pct}%</div>
                </div>
              </div>
              <div>
                {event.items.map((item, i) => (
                  <div key={i} style={{ padding: "12px 20px", borderBottom: i < event.items.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => toggleItemStatus(event.id, i)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${item.status === "Done" ? C.success : C.border}`, background: item.status === "Done" ? C.success : "transparent", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.status === "Done" && <span style={{ color: "white", fontSize: 11 }}>✓</span>}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: item.status === "Done" ? C.muted : C.text, textDecoration: item.status === "Done" ? "line-through" : "none" }}>{item.task}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>👤 {item.assignee}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: C.warning }}>Due {item.dueDate}</div>
                      <div style={{ marginTop: 4 }}>
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: statusBgs[item.status], color: statusColors[item.status], fontWeight: 500, border: `1px solid ${item.status === "Done" ? "#b8d9c8" : item.status === "In Progress" ? "#c0d4f0" : C.border}` }}>{item.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── QUOTATION VIEW ───────────────────────────────────────────────────────────
function QuotationView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [filterType, setFilterType] = useState("All");
  const [selected, setSelected] = useState(null);
  const [addOns, setAddOns] = useState({});
  const [revision, setRevision] = useState("v1");
  const [sentVersions, setSentVersions] = useState({ v1: false, v2: false, v3: false });
  const types = ["All", "Wedding", "Corporate", "Birthday"];
  const filtered = filterType === "All" ? PACKAGES : PACKAGES.filter(p => p.type === filterType);
  const total = selected ? selected.price + ADDONS.filter(a => addOns[a.id]).reduce((s, a) => s + a.price, 0) : 0;
  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="Quotation & Packages" sub="Build and send quotes to clients" />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: 20 }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {types.map(t => <button key={t} onClick={() => setFilterType(t)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: filterType === t ? C.navy : C.white, color: filterType === t ? C.white : C.muted, border: `1px solid ${filterType === t ? C.navy : C.border}` }}>{t}</button>)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(pkg => (
              <div key={pkg.id} onClick={() => setSelected(pkg)} style={{ padding: "16px 18px", background: C.white, borderRadius: 10, border: `2px solid ${selected?.id === pkg.id ? C.gold : C.border}`, cursor: "pointer", position: "relative" }}>
                {pkg.tag && <div style={{ position: "absolute", top: 12, right: 12 }}><Badge color="gold">{pkg.tag}</Badge></div>}
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 6, paddingRight: pkg.tag ? 80 : 0 }}>{pkg.name}</div>
                <div style={{ fontSize: 20, fontFamily: "'Cormorant Garamond', serif", color: C.navy, marginBottom: 10 }}>₱{pkg.price.toLocaleString()}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {pkg.inclusions.map(inc => <div key={inc} style={{ fontSize: 11, padding: "3px 10px", background: C.bg, borderRadius: 20, color: C.muted, border: `1px solid ${C.border}` }}>✓ {inc}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 10 }}>Quote Builder</div>
              <div style={{ display: "flex", background: C.bg, borderRadius: 6, padding: 3, gap: 3 }}>
                {["v1", "v2", "v3"].map(v => (
                  <button key={v} onClick={() => setRevision(v)} style={{ flex: 1, padding: "5px 8px", background: revision === v ? C.white : "transparent", border: "none", borderRadius: 4, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: revision === v ? C.navy : C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    {v.toUpperCase()} {sentVersions[v] && <span style={{ fontSize: 9, color: C.success }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: "18px 20px" }}>
              {!selected ? (
                <div style={{ textAlign: "center", padding: "32px 16px", color: C.muted, fontSize: 13 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>💰</div>Select a package to start
                </div>
              ) : (
                <div>
                  <div style={{ padding: "12px 14px", background: C.bg, borderRadius: 8, marginBottom: 16, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{selected.name}</div>
                    <div style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", color: C.navy, marginTop: 6 }}>₱{selected.price.toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>Add-ons</div>
                  {ADDONS.map(a => (
                    <div key={a.id} onClick={() => setAddOns(p => ({ ...p, [a.id]: !p[a.id] }))} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${addOns[a.id] ? C.gold : C.border}`, background: addOns[a.id] ? C.gold : "transparent", flexShrink: 0 }} />
                        <div style={{ fontSize: 12, color: C.text }}>{a.label}</div>
                      </div>
                      <div style={{ fontSize: 12, color: C.muted }}>+₱{a.price.toLocaleString()}</div>
                    </div>
                  ))}
                  <div style={{ marginTop: 18, padding: "14px", background: C.navy, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Total — {revision.toUpperCase()}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.gold }}>₱{total.toLocaleString()}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <Btn onClick={() => setSentVersions(p => ({ ...p, [revision]: true }))} style={{ flex: 1, padding: "10px", fontSize: 12 }}>{sentVersions[revision] ? "Resend" : "Send to Client"}</Btn>
                    <Btn variant="outline" style={{ padding: "10px 14px", fontSize: 12 }}>PDF</Btn>
                  </div>
                  {sentVersions[revision] && <div style={{ marginTop: 10, padding: "8px 12px", background: C.successBg, color: C.success, borderRadius: 6, fontSize: 11, fontWeight: 500 }}>✓ {revision.toUpperCase()} sent for client approval</div>}
                  <div style={{ marginTop: 10 }}><label style={lbl}>Linked Event</label>
                    <select style={inp({ fontSize: 12 })}><option value="">Select event...</option>{INITIAL_EVENTS.map(e => <option key={e.id}>{e.client}</option>)}</select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MOODBOARD VIEW ───────────────────────────────────────────────────────────
function MoodboardView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [uploadDone, setUploadDone] = useState(false);
  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="Moodboard & Pegs" sub="Theme palettes, inspiration pegs, and client uploads" action={<Btn style={{ fontSize: isMobile ? 12 : 13, padding: isMobile ? "8px 14px" : "10px 22px" }}>+ New Moodboard</Btn>} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>Preset Theme Boards</div>
          {MOODBOARD_PEGS.map(board => (
            <div key={board.id} onClick={() => setSelectedBoard(board)} style={{ padding: "16px 18px", background: C.white, borderRadius: 10, border: `2px solid ${selectedBoard?.id === board.id ? C.gold : C.border}`, cursor: "pointer", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{board.emoji} {board.label}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>{board.tags.map(tag => <Badge key={tag} color="gray">{tag}</Badge>)}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontSize: 11, color: C.muted }}>Palette:</div>
                {board.palette.map((color, j) => <div key={j} style={{ width: 28, height: 28, borderRadius: 6, background: color, border: `1px solid ${C.border}` }} title={color} />)}
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>Client Peg Upload Area</div>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 12 }}>
            {selectedBoard ? (
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  {selectedBoard.palette.map((color, j) => <div key={j} style={{ width: 20, height: 20, borderRadius: 4, background: color, border: `1px solid ${C.border}` }} />)}
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{selectedBoard.emoji} {selectedBoard.label}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                  {[...selectedBoard.palette, "#e8ddd0"].map((color, j) => (
                    <div key={j} style={{ aspectRatio: "1", borderRadius: 8, background: `linear-gradient(135deg, ${color}dd, ${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `1px solid ${C.border}` }}>
                      {["🌸", "✨", "🌿", "💐"][j] || "📌"}
                    </div>
                  ))}
                  <div style={{ aspectRatio: "1", borderRadius: 8, border: `2px dashed ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 4 }}>
                    <div style={{ fontSize: 22, opacity: 0.4 }}>+</div>
                    <div style={{ fontSize: 10, color: C.muted }}>Add Peg</div>
                  </div>
                </div>
                {uploadDone ? (
                  <div style={{ padding: "10px 14px", background: C.successBg, color: C.success, borderRadius: 6, fontSize: 12, fontWeight: 500 }}>✓ Moodboard shared with client</div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn onClick={() => setUploadDone(true)} style={{ flex: 1, fontSize: 12, padding: "10px" }}>Share with Client</Btn>
                    <Btn variant="outline" style={{ padding: "10px 14px", fontSize: 12 }}>Export PDF</Btn>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: "48px 24px", textAlign: "center", color: C.muted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎨</div>
                <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>Select a theme board to get started</div>
                <div style={{ fontSize: 12 }}>Or create a new custom moodboard</div>
              </div>
            )}
          </div>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 12 }}>📤 Client-Submitted Pegs</div>
            <div style={{ padding: "14px", background: "#fffbf0", borderRadius: 8, border: `1px solid #f0dba0`, display: "flex", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f5e6d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📎</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>Ana Reyes uploaded 3 inspiration photos</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Today, 11:45 AM · Reyes-Santos Wedding</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontStyle: "italic" }}>"Gusto namin 'yung garden feel with fairy lights."</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <Btn style={{ fontSize: 11, padding: "6px 12px" }}>View Uploads</Btn>
                  <Btn variant="outline" style={{ fontSize: 11, padding: "6px 12px" }}>Add to Board</Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TEMPLATES VIEW ───────────────────────────────────────────────────────────
function TemplatesView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [selected, setSelected] = useState(TAGLISH_TEMPLATES[0]);
  const [editBody, setEditBody] = useState(TAGLISH_TEMPLATES[0].body);
  const [saved, setSaved] = useState(false);
  function selectTemplate(t) { setSelected(t); setEditBody(t.body); setSaved(false); }
  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <SectionHeader title="Auto-Reply Templates" sub="Taglish message templates for each pipeline stage" />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.6fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TAGLISH_TEMPLATES.map(t => (
            <div key={t.id} onClick={() => selectTemplate(t)} style={{ padding: "14px 16px", background: C.white, borderRadius: 10, border: `2px solid ${selected?.id === t.id ? C.gold : C.border}`, cursor: "pointer" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4 }}>{t.title}</div>
              <div style={{ display: "flex", gap: 8 }}><Badge color="blue">{t.type}</Badge></div>
            </div>
          ))}
          <button style={{ padding: "12px", background: C.bg, border: `2px dashed ${C.border}`, borderRadius: 10, cursor: "pointer", fontSize: 12, color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>+ Add New Template</button>
        </div>
        {selected && (
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{selected.title}</div><div style={{ fontSize: 11, color: C.muted }}>Triggered on: <strong>{selected.type}</strong></div></div>
              <Badge color="amber">Taglish</Badge>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Message Body</label>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Placeholders: [Client Name], [Date], [Time], [Venue]</div>
                <textarea value={editBody} onChange={e => setEditBody(e.target.value)} rows={10} style={{ ...inp({ fontSize: 12 }), resize: "vertical", lineHeight: 1.7 }} />
              </div>
              <div style={{ marginBottom: 16, padding: 14, background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>Preview</div>
                <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {editBody.replace("[Client Name]", "Ana Reyes").replace("[Date]", "May 20, 2025").replace("[Time]", "2:00 PM").replace("[Venue]", "Zoom")}
                </div>
              </div>
              {saved && <div style={{ padding: "8px 12px", background: C.successBg, color: C.success, borderRadius: 6, fontSize: 12, marginBottom: 12, fontWeight: 500 }}>✓ Template saved!</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} style={{ flex: 1, fontSize: 12 }}>Save Template</Btn>
                <Btn variant="outline" style={{ fontSize: 12, padding: "10px 14px" }}>Test Send</Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EVENT DAY COMMAND CENTER ─────────────────────────────────────────────────
function EventDayView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [activeEvent, setActiveEvent] = useState("Reyes-Santos Wedding");
  const [timeline, setTimeline] = useState(EVENT_DAY_TIMELINE);
  const [crew, setCrew] = useState(CREW_CHECKIN);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [tab, setTab] = useState("timeline");
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [newIncident, setNewIncident] = useState({ category: "Logistics", severity: "low", description: "", costImpact: 0 });
  const [incidentSaved, setIncidentSaved] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(null); // timeline item id
  const [noteText, setNoteText] = useState("");

  const doneCount = timeline.filter(t => t.status === "done").length;
  const totalCount = timeline.length;
  const progress = Math.round((doneCount / totalCount) * 100);

  function tickTimeline(id) {
    setTimeline(prev => prev.map(t => t.id === id ? { ...t, status: t.status === "done" ? "in-progress" : "done" } : t));
  }
  function checkInCrew(id) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true });
    setCrew(prev => prev.map(c => c.id === id ? { ...c, checkedIn: true, checkinTime: timeStr, status: "present" } : c));
  }
  function saveIncident() {
    if (!newIncident.description) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true });
    setIncidents(prev => [...prev, { id: prev.length + 1, time: timeStr, ...newIncident, resolvedBy: "", status: "Open", signedOff: false, signedBy: "" }]);
    setNewIncident({ category: "Logistics", severity: "low", description: "", costImpact: 0 });
    setIncidentSaved(true);
    setTimeout(() => { setIncidentSaved(false); setShowIncidentForm(false); }, 1800);
  }

  const pad = isMobile ? "16px 14px" : "32px 36px";
  const timelineTabs = ["timeline", "crew", "incidents", "changereq"];
  const tabLabels = { timeline: "📋 Timeline", crew: "👷 Crew", incidents: "⚠️ Incidents", changereq: "🔄 Change Req." };

  const catColors = { Logistics: "blue", Setup: "purple", Technical: "amber", Coordination: "green", Supplier: "gold", General: "gray", Ceremony: "rose", Reception: "rose" };
  const severityColors = { low: "green", medium: "amber", high: "red" };

  return (
    <div style={{ padding: pad }}>
      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.success, boxShadow: `0 0 0 3px ${C.successBg}` }} />
            <span style={{ fontSize: 11, color: C.success, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Event Day Live</span>
          </div>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: C.text, margin: 0 }}>Command Center</h1>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Reyes-Santos Wedding · Jul 15, 2025 · The Ruins, Taguig</div>
        </div>
        <select value={activeEvent} onChange={e => setActiveEvent(e.target.value)} style={{ padding: "8px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: C.text, background: C.white, cursor: "pointer" }}>
          {INITIAL_EVENTS.filter(e => ["Fully Booked", "Reserved"].includes(e.stage)).map(e => <option key={e.id}>{e.client}</option>)}
        </select>
      </div>

      {/* Progress bar */}
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>Day Progress</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>{progress}% · {doneCount}/{totalCount} done</div>
        </div>
        <div style={{ height: 8, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.gold} 0%, ${C.goldDark} 100%)`, borderRadius: 99, transition: "width 0.4s ease" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
          {[
            { label: "Done", val: doneCount, color: C.success, bg: C.successBg },
            { label: "In Progress", val: timeline.filter(t => t.status === "in-progress").length, color: C.info, bg: C.infoBg },
            { label: "Pending", val: timeline.filter(t => t.status === "pending").length, color: C.muted, bg: C.bg },
          ].map(s => (
            <div key={s.label} style={{ padding: "10px 12px", background: s.bg, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, color: s.color, marginTop: 2, letterSpacing: 0.5, textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 4, marginBottom: 18, background: C.white, padding: 5, borderRadius: 10, border: `1px solid ${C.border}`, overflowX: "auto" }}>
        {timelineTabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flexShrink: 0, flex: 1, padding: "8px 10px", background: tab === t ? C.navy : "transparent", color: tab === t ? C.white : C.muted, border: "none", borderRadius: 7, fontSize: isMobile ? 11 : 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>{tabLabels[t]}</button>
        ))}
      </div>

      {/* Timeline tab */}
      {tab === "timeline" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {timeline.map(item => (
            <div key={item.id} style={{ background: C.white, borderRadius: 10, border: `1px solid ${item.status === "done" ? "#c0d8c0" : C.border}`, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", opacity: item.status === "done" ? 0.85 : 1, transition: "all 0.2s" }}>
              {/* Tick button */}
              <button onClick={() => tickTimeline(item.id)} style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${item.status === "done" ? C.success : item.status === "in-progress" ? C.info : C.border}`, background: item.status === "done" ? C.success : item.status === "in-progress" ? C.infoBg : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: item.status === "done" ? C.white : C.info, flexShrink: 0, marginTop: 1, transition: "all 0.2s" }}>
                {item.status === "done" ? "✓" : item.status === "in-progress" ? "●" : ""}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 500, color: item.status === "done" ? C.muted : C.text, textDecoration: item.status === "done" ? "line-through" : "none" }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>👤 {item.assignee}</div>
                    {item.notes && <div style={{ fontSize: 11, color: C.success, marginTop: 4, fontStyle: "italic" }}>📝 {item.notes}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    <Badge color={catColors[item.category] || "gray"}>{item.category}</Badge>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.gold, fontFamily: "'Cormorant Garamond', serif" }}>{item.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crew tab */}
      {tab === "crew" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3,1fr)" : "repeat(6,1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Present", val: crew.filter(c => c.status === "present").length, color: C.success, bg: C.successBg },
              { label: "Late", val: crew.filter(c => c.status === "late").length, color: C.danger, bg: C.dangerBg },
              { label: "Upcoming", val: crew.filter(c => c.status === "upcoming").length, color: C.muted, bg: C.bg },
            ].map(s => (
              <div key={s.label} style={{ padding: "10px 12px", background: s.bg, borderRadius: 8, textAlign: "center", gridColumn: isMobile ? "span 1" : "span 2" }}>
                <div style={{ fontSize: 22, fontWeight: 600, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 10, color: s.color, letterSpacing: 0.5, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
          {crew.map(c => (
            <div key={c.id} style={{ background: C.white, borderRadius: 10, border: `1px solid ${c.status === "late" ? "#e0b8b8" : C.border}`, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: c.status === "present" ? C.successBg : c.status === "late" ? C.dangerBg : C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: c.status === "present" ? C.success : c.status === "late" ? C.danger : C.muted, flexShrink: 0 }}>{c.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{c.role} · Call: {c.callTime}</div>
                {c.checkedIn && <div style={{ fontSize: 11, color: C.success, marginTop: 2 }}>✓ Checked in at {c.checkinTime}</div>}
                {c.status === "late" && <div style={{ fontSize: 11, color: C.danger, marginTop: 2 }}>⚠️ Not yet checked in — contact crew member</div>}
              </div>
              {!c.checkedIn && c.status !== "upcoming" && (
                <Btn variant="success" style={{ fontSize: 11, padding: "7px 14px", flexShrink: 0 }} onClick={() => checkInCrew(c.id)}>Check In</Btn>
              )}
              {!c.checkedIn && c.status === "upcoming" && <Badge color="gray">Upcoming</Badge>}
              {c.checkedIn && <Badge color="green">Present</Badge>}
            </div>
          ))}
        </div>
      )}

      {/* Incidents tab */}
      {tab === "incidents" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{incidents.length} Incident{incidents.length !== 1 ? "s" : ""} Logged</div>
            <Btn onClick={() => setShowIncidentForm(p => !p)} style={{ fontSize: 12, padding: "8px 16px" }}>{showIncidentForm ? "Cancel" : "+ Log Incident"}</Btn>
          </div>

          {showIncidentForm && (
            <div style={{ background: C.dangerBg, border: `1px solid #e0b8b8`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.danger, marginBottom: 16 }}>⚠️ New Incident Report</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={lbl}>Category</label>
                  <select value={newIncident.category} onChange={e => setNewIncident(p => ({ ...p, category: e.target.value }))} style={{ ...inp({ fontSize: 12 }) }}>
                    {["Logistics", "Technical", "Supplier", "Crew", "Client", "Weather", "Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Severity</label>
                  <select value={newIncident.severity} onChange={e => setNewIncident(p => ({ ...p, severity: e.target.value }))} style={{ ...inp({ fontSize: 12 }) }}>
                    {["low", "medium", "high"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={lbl}>Description</label>
                <textarea value={newIncident.description} onChange={e => setNewIncident(p => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inp({ fontSize: 12, resize: "vertical" }) }} placeholder="Describe what happened and how it was addressed..." />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Cost Impact (₱)</label>
                <input type="number" value={newIncident.costImpact} onChange={e => setNewIncident(p => ({ ...p, costImpact: Number(e.target.value) }))} style={{ ...inp({ fontSize: 12 }) }} placeholder="0 if no cost impact" />
              </div>
              {incidentSaved && <div style={{ fontSize: 12, color: C.success, fontWeight: 500, marginBottom: 10 }}>✓ Incident logged successfully!</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={saveIncident} style={{ flex: 1, fontSize: 12 }}>Log Incident</Btn>
                <Btn variant="outline" onClick={() => setShowIncidentForm(false)} style={{ fontSize: 12 }}>Cancel</Btn>
              </div>
            </div>
          )}

          {incidents.length === 0 && !showIncidentForm && (
            <div style={{ padding: "40px 20px", textAlign: "center", background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>No incidents logged</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>Everything running smoothly. Log any issues as they arise.</div>
            </div>
          )}

          {incidents.map(inc => (
            <div key={inc.id} style={{ background: C.white, borderRadius: 10, border: `1px solid ${inc.severity === "high" ? "#e0b8b8" : inc.severity === "medium" ? "#f0d090" : C.border}`, padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>🕐 {inc.time}</span>
                  <Badge color={severityColors[inc.severity]}>{inc.severity.toUpperCase()}</Badge>
                  <Badge color={catColors[inc.category] || "gray"}>{inc.category}</Badge>
                </div>
                <Badge color={inc.status === "Resolved" ? "green" : "amber"}>{inc.status}</Badge>
              </div>
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, marginBottom: 10 }}>{inc.description}</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                {inc.costImpact > 0 && <span style={{ fontSize: 11, color: C.danger, fontWeight: 500 }}>💸 Cost Impact: ₱{inc.costImpact.toLocaleString()}</span>}
                {inc.resolvedBy && <span style={{ fontSize: 11, color: C.muted }}>Resolved by: {inc.resolvedBy}</span>}
                {inc.signedOff && <span style={{ fontSize: 11, color: C.success }}>✓ Signed off by {inc.signedBy}</span>}
                {!inc.signedOff && inc.status === "Resolved" && (
                  <button style={{ fontSize: 11, color: C.info, background: C.infoBg, border: `1px solid #c0d4f0`, borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Sign Off</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Change Request tab */}
      {tab === "changereq" && (
        <div>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>🔄 On-Day Change Request</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>Use this form to document any last-minute changes requested by the client. Each request will be logged with timestamp and cost impact for sign-off.</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><label style={lbl}>Change Type</label>
                <select style={inp({ fontSize: 12 })}>
                  {["Add-on Service", "Décor Modification", "Timeline Adjustment", "Guest Count Change", "Venue Layout Change", "Supplier Swap", "Other"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Urgency</label>
                <select style={inp({ fontSize: 12 })}>
                  {["Immediate", "Before Ceremony", "Before Reception", "Non-urgent"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}><label style={lbl}>Description of Change</label><textarea rows={3} style={{ ...inp({ fontSize: 12, resize: "vertical" }) }} placeholder="What needs to change and why?" /></div>
            <div style={{ marginBottom: 16 }}><label style={lbl}>Cost Impact (₱)</label><input type="number" placeholder="0 if no additional cost" style={inp({ fontSize: 12 })} /></div>
            <div style={{ padding: "12px 14px", background: C.warningBg, borderRadius: 8, border: `1px solid #f0d090`, fontSize: 12, color: C.warning, marginBottom: 16, lineHeight: 1.6 }}>
              ⚠️ All on-day change requests require client sign-off. Any additional costs must be agreed to in writing before services are rendered.
            </div>
            <Btn style={{ width: "100%", fontSize: 12 }}>Submit Change Request</Btn>
          </div>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>Previous Change Requests</div>
            <div style={{ padding: "12px 14px", background: C.bg, borderRadius: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.successBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✓</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>Add 2 extra photo booth hours</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Requested at 11:30 AM · +₱6,000</div>
                <div style={{ fontSize: 11, color: C.success, marginTop: 3 }}>✓ Approved by client (Ana Reyes) · 12:05 PM</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AFTER EVENT VIEW ─────────────────────────────────────────────────────────
function AfterEventView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [events, setEvents] = useState(AFTER_EVENTS_DATA);
  const [selectedId, setSelectedId] = useState(1);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, text: "", eventName: "", respondentName: "" });
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [balanceNote, setBalanceNote] = useState("");
  const [balanceSaved, setBalanceSaved] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [bookNextDone, setBookNextDone] = useState(false);

  const event = events.find(e => e.id === selectedId);
  const pad = isMobile ? "16px 14px" : "32px 36px";

  function submitFeedback() {
    if (!feedbackForm.rating) return;
    setEvents(prev => prev.map(e => e.id === selectedId ? { ...e, feedbackSubmitted: true, feedbackRating: feedbackForm.rating, feedbackText: feedbackForm.text } : e));
    setFeedbackDone(true);
  }

  function markSettled() {
    setEvents(prev => prev.map(e => e.id === selectedId ? { ...e, balanceStatus: "Settled", balance: 0 } : e));
    setBalanceSaved(true);
    setTimeout(() => setBalanceSaved(false), 2000);
  }

  return (
    <div style={{ padding: pad }}>
      <SectionHeader title="After Event" sub="Post-event wrap-up, feedback, and balance settlement" />

      {/* Event selector */}
      <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
        {events.map(e => (
          <button key={e.id} onClick={() => { setSelectedId(e.id); setFeedbackDone(false); setBookNextDone(false); }} style={{ padding: "10px 18px", background: selectedId === e.id ? C.navy : C.white, color: selectedId === e.id ? C.white : C.muted, border: `1px solid ${selectedId === e.id ? C.navy : C.border}`, borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: selectedId === e.id ? 500 : 400 }}>
            {e.event}
          </button>
        ))}
        <button style={{ padding: "10px 18px", background: C.bg, border: `2px dashed ${C.border}`, borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", color: C.muted }}>+ Add Completed Event</button>
      </div>

      {event && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>

          {/* Event Summary */}
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, gridColumn: isMobile ? "1" : "1 / -1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>{event.event}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>📅 {event.date} · 📍 {event.venue} · 👤 {event.coordinator}</div>
              </div>
              <Badge color={typeColor(event.type)}>{event.type}</Badge>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
              {[
                { label: "Total Package", val: `₱${event.totalValue.toLocaleString()}`, color: C.text },
                { label: "Amount Paid", val: `₱${event.amountPaid.toLocaleString()}`, color: C.success },
                { label: "Balance", val: event.balance > 0 ? `₱${event.balance.toLocaleString()}` : "Settled", color: event.balance > 0 ? C.danger : C.success },
                { label: "Incidents", val: event.incidentsLogged, color: event.incidentsLogged > 0 ? C.warning : C.muted },
              ].map(s => (
                <div key={s.label} style={{ padding: "12px 14px", background: C.bg, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Balance Settlement */}
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>💳 Balance Settlement</div>
            {event.balance > 0 ? (
              <>
                <div style={{ padding: "12px 14px", background: C.dangerBg, border: `1px solid #e0b8b8`, borderRadius: 8, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.danger }}>₱{event.balance.toLocaleString()} Outstanding</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Balance must be settled within 7 days of event</div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={lbl}>Settlement Notes</label><textarea value={balanceNote} onChange={e => setBalanceNote(e.target.value)} rows={2} style={{ ...inp({ fontSize: 12, resize: "none" }) }} placeholder="Payment method, reference #, etc." /></div>
                {balanceSaved && <div style={{ fontSize: 12, color: C.success, marginBottom: 8, fontWeight: 500 }}>✓ Balance marked as settled!</div>}
                <Btn variant="success" onClick={markSettled} style={{ width: "100%", fontSize: 12 }}>Mark Balance as Settled</Btn>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.success }}>Fully Settled</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>All payments received. Account cleared.</div>
              </div>
            )}
          </div>

          {/* Photo Gallery */}
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>📸 Event Photos</div>
            {event.photosUploaded > 0 ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 14 }}>
                  {Array.from({ length: Math.min(8, event.photosUploaded) }).map((_, i) => (
                    <div key={i} style={{ aspectRatio: "1", borderRadius: 6, background: `hsl(${(i * 37 + 30) % 360}, 25%, ${75 + (i % 3) * 5}%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      {["📷", "🌸", "💍", "🥂", "🎊", "🌺", "✨", "💐"][i]}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{event.photosUploaded} photos uploaded</div>
              </>
            ) : (
              <div style={{ padding: "24px 20px", background: C.bg, borderRadius: 8, textAlign: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 12, color: C.muted }}>No photos uploaded yet</div>
              </div>
            )}
            <Btn variant="outline" style={{ width: "100%", fontSize: 12 }}>+ Upload Photos</Btn>
          </div>

          {/* Client Feedback */}
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>⭐ Client Feedback</div>
            {event.feedbackSubmitted || feedbackDone ? (
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ fontSize: 24, color: i < (event.feedbackRating || feedbackForm.rating) ? "#f0b429" : C.border }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", marginBottom: 10 }}>"{event.feedbackText || feedbackForm.text || "Great event!"}"</div>
                <Badge color="green">Feedback Received</Badge>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>Collect client feedback after the event to improve future services.</div>
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Overall Rating</label>
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} onMouseEnter={() => setHoverRating(i + 1)} onMouseLeave={() => setHoverRating(0)} onClick={() => setFeedbackForm(p => ({ ...p, rating: i + 1 }))} style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", color: i < (hoverRating || feedbackForm.rating) ? "#f0b429" : C.border, transition: "color 0.1s" }}>★</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={lbl}>Client Comments</label><textarea value={feedbackForm.text} onChange={e => setFeedbackForm(p => ({ ...p, text: e.target.value }))} rows={3} style={{ ...inp({ fontSize: 12, resize: "none" }) }} placeholder="How did we do? Any comments or suggestions..." /></div>
                <Btn onClick={submitFeedback} disabled={!feedbackForm.rating} style={{ width: "100%", fontSize: 12 }}>Submit Feedback</Btn>
              </>
            )}
          </div>

          {/* Book Next Event CTA */}
          <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #1e1e40 100%)`, borderRadius: 12, padding: "24px 22px", gridColumn: isMobile ? "1" : "1 / -1" }}>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: isMobile ? 18 : 24, justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif", color: C.gold, marginBottom: 6 }}>Ready for their next celebration?</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>Past clients who rebook within 3 months receive a 5% loyalty discount. Send a warm follow-up to {event.event.split(" ")[0]}.</div>
              </div>
              <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                {!bookNextDone ? (
                  <>
                    <Btn variant="gold" onClick={() => setBookNextDone(true)} style={{ fontSize: 12, padding: "10px 20px", whiteSpace: "nowrap" }}>Book Next Event 🎉</Btn>
                    <Btn variant="outline" style={{ fontSize: 12, padding: "10px 16px", color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>Send Follow-up</Btn>
                  </>
                ) : (
                  <div style={{ padding: "10px 18px", background: "rgba(201,168,108,0.15)", border: `1px solid rgba(201,168,108,0.3)`, borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: C.gold, fontWeight: 500 }}>✓ New booking initiated!</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Added to CRM pipeline</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REPORTS VIEW ─────────────────────────────────────────────────────────────
function ReportsView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [period, setPeriod] = useState("2025");
  const [tab, setTab] = useState("overview");
  const pad = isMobile ? "16px 14px" : "32px 36px";

  const totalRevenue = REPORTS_MONTHLY.filter(m => m.revenue).reduce((s, m) => s + m.revenue, 0);
  const totalBookings = REPORTS_MONTHLY.reduce((s, m) => s + m.bookings, 0);
  const totalInquiries = REPORTS_MONTHLY.reduce((s, m) => s + m.inquiries, 0);
  const convRate = Math.round((totalBookings / totalInquiries) * 100);
  const avgFeedback = (REPORTS_MONTHLY.filter(m => m.feedback).reduce((s, m) => s + m.feedback, 0) / REPORTS_MONTHLY.filter(m => m.feedback).length).toFixed(1);
  const maxRevenue = Math.max(...REPORTS_MONTHLY.map(m => m.revenue));

  const tabs = ["overview", "packages", "inventory", "feedback"];
  const tabLabels = { overview: "📊 Overview", packages: "📦 Packages", inventory: "🏭 Inventory", feedback: "⭐ Feedback" };

  return (
    <div style={{ padding: pad }}>
      <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: C.text, margin: 0 }}>Reports & Analytics</h1>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Performance insights and business metrics</div>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: "8px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: C.text, background: C.white }}>
          {["2025", "Q1 2025", "Q2 2025", "Q3 2025"].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Revenue", val: `₱${(totalRevenue / 1000000).toFixed(2)}M`, sub: "YTD", icon: "💰", trend: "+18% vs last year", trendUp: true },
          { label: "Total Bookings", val: totalBookings, sub: `from ${totalInquiries} inquiries`, icon: "📋", trend: "+12% vs last year", trendUp: true },
          { label: "Conversion Rate", val: `${convRate}%`, sub: "Inquiry → Booked", icon: "📈", trend: `+4pp vs last year`, trendUp: true },
          { label: "Avg Feedback Score", val: avgFeedback, sub: "out of 5.0", icon: "⭐", trend: "+0.2 vs last year", trendUp: true },
        ].map(s => (
          <div key={s.label} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 0.3 }}>{s.label}</div>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 600, color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>{s.val}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.sub}</div>
            <div style={{ fontSize: 10, color: s.trendUp ? C.success : C.danger, marginTop: 6, fontWeight: 500 }}>{s.trendUp ? "↑" : "↓"} {s.trend}</div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 4, marginBottom: 18, background: C.white, padding: 5, borderRadius: 10, border: `1px solid ${C.border}`, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flexShrink: 0, flex: 1, padding: "8px 10px", background: tab === t ? C.navy : "transparent", color: tab === t ? C.white : C.muted, border: "none", borderRadius: 7, fontSize: isMobile ? 11 : 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>{tabLabels[t]}</button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Monthly Revenue Chart */}
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 20 }}>Monthly Revenue (₱)</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: isMobile ? 6 : 10, height: 140 }}>
              {REPORTS_MONTHLY.map(m => {
                const h = m.revenue ? Math.round((m.revenue / maxRevenue) * 130) : 0;
                const isMax = m.revenue === maxRevenue;
                return (
                  <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: isMobile ? 9 : 10, color: isMax ? C.gold : C.muted, fontWeight: isMax ? 600 : 400 }}>
                      {m.revenue ? `${Math.round(m.revenue / 1000)}K` : "—"}
                    </div>
                    <div style={{ width: "100%", height: h, background: m.revenue ? (isMax ? `linear-gradient(180deg, ${C.gold} 0%, ${C.goldDark} 100%)` : `linear-gradient(180deg, ${C.navy} 0%, #2a2a50 100%)`) : C.bg, borderRadius: "4px 4px 0 0", minHeight: 4, transition: "height 0.3s ease" }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 10, marginTop: 8 }}>
              {REPORTS_MONTHLY.map(m => <div key={m.month} style={{ flex: 1, textAlign: "center", fontSize: isMobile ? 9 : 10, color: C.muted }}>{m.month}</div>)}
            </div>
          </div>

          {/* Bookings vs Inquiries */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
            <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 18 }}>Bookings vs Inquiries</div>
              {REPORTS_MONTHLY.map(m => (
                <div key={m.month} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
                    <span>{m.month}</span>
                    <span style={{ color: C.text }}>{m.bookings}/{m.inquiries} booked</span>
                  </div>
                  <div style={{ position: "relative", height: 6, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(m.inquiries / 16) * 100}%`, background: C.infoBg, borderRadius: 99 }} />
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(m.bookings / 16) * 100}%`, background: C.gold, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted }}><div style={{ width: 10, height: 6, borderRadius: 3, background: C.infoBg, border: `1px solid #c0d4f0` }} />Inquiries</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted }}><div style={{ width: 10, height: 6, borderRadius: 3, background: C.gold }} />Booked</div>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 18 }}>Conversion Funnel (YTD)</div>
              {[
                { label: "New Inquiries", val: totalInquiries, pct: 100, color: C.navy },
                { label: "Oculars Scheduled", val: Math.round(totalInquiries * 0.72), pct: 72, color: "#2a5ca8" },
                { label: "Proposals Sent", val: Math.round(totalInquiries * 0.58), pct: 58, color: C.info },
                { label: "Reserved", val: Math.round(totalBookings * 1.15), pct: 46, color: C.gold },
                { label: "Fully Booked", val: totalBookings, pct: convRate, color: C.success },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: C.muted }}>{f.label}</span>
                    <span style={{ color: C.text, fontWeight: 500 }}>{f.val} · {f.pct}%</span>
                  </div>
                  <div style={{ height: 8, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${f.pct}%`, background: f.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Packages tab */}
      {tab === "packages" && (
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Package Performance</div>
            <Badge color="gray">{PACKAGE_PERFORMANCE.length} packages</Badge>
          </div>
          {PACKAGE_PERFORMANCE.sort((a, b) => b.revenue - a.revenue).map((pkg, i) => (
            <div key={pkg.name} style={{ padding: "14px 20px", borderBottom: i < PACKAGE_PERFORMANCE.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr 1fr", alignItems: "center", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{pkg.name}</div>
                  <div style={{ marginTop: 4 }}><Badge color={typeColor(pkg.type)}>{pkg.type}</Badge></div>
                </div>
                <div style={{ textAlign: isMobile ? "left" : "center" }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>Bookings</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{pkg.bookings}</div>
                </div>
                <div style={{ textAlign: isMobile ? "left" : "center" }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>Revenue</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>₱{(pkg.revenue / 1000000).toFixed(2)}M</div>
                </div>
                <div style={{ textAlign: isMobile ? "left" : "center" }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>Avg Rating</div>
                  <div style={{ fontSize: 13, color: "#f0b429", fontWeight: 600 }}>★ {pkg.avgFeedback}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Utilization</div>
                  <div style={{ height: 6, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pkg.utilization}%`, background: pkg.utilization >= 80 ? C.success : pkg.utilization >= 60 ? C.gold : C.danger, borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2, textAlign: "right" }}>{pkg.utilization}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inventory tab */}
      {tab === "inventory" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 18 }}>Inventory Utilization Rate</div>
            {INVENTORY_UTILIZATION.sort((a, b) => b.utilization - a.utilization).map(item => (
              <div key={item.name} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{item.events} events · avg {item.avgUsed}/{item.totalQty} units/event</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: item.utilization >= 80 ? C.success : item.utilization >= 60 ? C.warning : C.danger }}>{item.utilization}%</div>
                </div>
                <div style={{ height: 10, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.utilization}%`, background: item.utilization >= 80 ? `linear-gradient(90deg, ${C.success} 0%, #3a9060 100%)` : item.utilization >= 60 ? `linear-gradient(90deg, ${C.gold} 0%, ${C.goldDark} 100%)` : `linear-gradient(90deg, ${C.danger} 0%, #c03030 100%)`, borderRadius: 99, transition: "width 0.3s" }} />
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
              {[{ label: "High (80%+)", color: C.success }, { label: "Mid (60–79%)", color: C.gold }, { label: "Low (<60%)", color: C.danger }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted }}>
                  <div style={{ width: 10, height: 6, borderRadius: 3, background: l.color }} />{l.label}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "16px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>Inventory Health Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
              {[
                { label: "Avg Utilization", val: `${Math.round(INVENTORY_UTILIZATION.reduce((s, i) => s + i.utilization, 0) / INVENTORY_UTILIZATION.length)}%`, color: C.success },
                { label: "High Performers", val: INVENTORY_UTILIZATION.filter(i => i.utilization >= 80).length, color: C.success },
                { label: "Needs Attention", val: INVENTORY_UTILIZATION.filter(i => i.utilization < 60).length, color: C.danger },
                { label: "Items Tracked", val: INITIAL_INVENTORY.length, color: C.text },
              ].map(s => (
                <div key={s.label} style={{ padding: "12px 14px", background: C.bg, borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feedback tab */}
      {tab === "feedback" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 18 }}>Monthly Feedback Score</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: isMobile ? 8 : 14, height: 110, marginBottom: 8 }}>
              {REPORTS_MONTHLY.map(m => {
                const h = m.feedback ? Math.round(((m.feedback - 4.4) / 0.6) * 90 + 20) : 10;
                return (
                  <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: isMobile ? 9 : 10, color: m.feedback ? "#f0b429" : C.muted, fontWeight: 600 }}>
                      {m.feedback ? m.feedback : "—"}
                    </div>
                    <div style={{ width: "100%", height: h, background: m.feedback ? `linear-gradient(180deg, #f5c842 0%, #e0a820 100%)` : C.bg, borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 14, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
              {REPORTS_MONTHLY.map(m => <div key={m.month} style={{ flex: 1, textAlign: "center", fontSize: isMobile ? 9 : 10, color: C.muted }}>{m.month}</div>)}
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>Coordinator Performance</div>
            {[
              { name: "Maria Santos", role: "Coordinator", events: 8, avgRating: 4.9, totalRevenue: 1840000 },
              { name: "Bea Cruz", role: "Coordinator", events: 5, avgRating: 4.8, totalRevenue: 620000 },
              { name: "Karen Dizon", role: "Coordinator", events: 4, avgRating: 4.7, totalRevenue: 490000 },
              { name: "Admin", role: "Admin/Coordinator", events: 6, avgRating: 4.8, totalRevenue: 920000 },
            ].sort((a, b) => b.avgRating - a.avgRating).map((coord, i) => (
              <div key={coord.name} style={{ padding: "12px 14px", background: i === 0 ? "#fffbf0" : C.bg, borderRadius: 8, marginBottom: 10, border: `1px solid ${i === 0 ? "#f0dba0" : C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: i === 0 ? "#fdf4e0" : C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: i === 0 ? C.goldDark : C.muted, border: `1px solid ${i === 0 ? "#f0dba0" : C.border}` }}>
                      {coord.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{coord.name} {i === 0 && <span style={{ fontSize: 11, color: C.goldDark }}>🏆 Top Performer</span>}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{coord.role} · {coord.events} events</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#f0b429" }}>★ {coord.avgRating}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>Avg Rating</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>₱{(coord.totalRevenue / 1000000).toFixed(2)}M</div>
                      <div style={{ fontSize: 10, color: C.muted }}>Revenue</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>Recent Client Feedback</div>
            {INITIAL_REVIEWS.map((r, i) => (
              <div key={i} style={{ padding: "12px 14px", background: C.bg, borderRadius: 8, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#f0b429", marginBottom: 4 }}>{"★".repeat(r.rating)}</div>
                    <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>"{r.text}"</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{r.name} · {r.event}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PHASE 4: NOTIFICATION PANEL ─────────────────────────────────────────────
function NotificationPanel({ notifications, onClose, onMarkRead, onMarkAllRead, compact }) {
  const typeColors = { danger: C.dangerBg, warning: C.warningBg, success: C.successBg, info: C.infoBg };
  const typeBorders = { danger: "#e0b8b8", warning: "#f0d090", success: "#b8d9c8", info: "#c0d4f0" };
  const typeText = { danger: C.danger, warning: C.warning, success: C.success, info: C.info };
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div style={{ position: "fixed", top: compact ? 56 : 0, right: 0, bottom: 0, width: compact ? "100%" : 380, background: C.white, boxShadow: "-4px 0 40px rgba(0,0,0,0.15)", zIndex: 500, display: "flex", flexDirection: "column", maxWidth: "100vw" }}>
      <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.navy }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: C.gold, fontWeight: 600 }}>🔔 Notifications</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{unread} unread</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {unread > 0 && <button onClick={onMarkAllRead} style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Mark all read</button>}
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 16, borderRadius: 4, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        {notifications.map(n => (
          <div key={n.id} onClick={() => onMarkRead(n.id)} style={{ padding: "13px 14px", background: n.read ? C.bg : typeColors[n.type], border: `1px solid ${n.read ? C.border : typeBorders[n.type]}`, borderRadius: 10, marginBottom: 8, cursor: "pointer", transition: "all 0.15s", opacity: n.read ? 0.7 : 1 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: n.read ? C.text : typeText[n.type] }}>{n.title}</div>
                  {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: typeText[n.type], flexShrink: 0, marginTop: 3 }} />}
                </div>
                <div style={{ fontSize: 12, color: C.text, marginTop: 3, lineHeight: 1.5 }}>{n.body}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
                  <span>{n.time}</span> · <Badge color="gray">{n.category}</Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PHASE 4: ANALYTICS DASHBOARD ────────────────────────────────────────────
function AnalyticsDashboard() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [period, setPeriod] = useState("YTD");
  const totalRev = ANALYTICS_MONTHLY.reduce((s, m) => s + m.revenue, 0);
  const totalEvents = ANALYTICS_MONTHLY.reduce((s, m) => s + m.events, 0);
  const totalInquiries = ANALYTICS_MONTHLY.reduce((s, m) => s + m.inquiries, 0);
  const avgConversion = (ANALYTICS_MONTHLY.reduce((s, m) => s + m.conversion, 0) / ANALYTICS_MONTHLY.length).toFixed(1);
  const maxRevenue = Math.max(...ANALYTICS_MONTHLY.map(m => m.revenue));
  const pad = isMobile ? "20px 16px" : "32px 36px";

  return (
    <div style={{ padding: pad }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,160,80,0.9)", letterSpacing: 1, textTransform: "uppercase", background: "rgba(255,160,80,0.1)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,160,80,0.25)" }}>⚡ Phase 4</span>
          </div>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: C.text, margin: 0 }}>Analytics Dashboard</h1>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Business intelligence · 2025 Year to Date</div>
        </div>
        <div style={{ display: "flex", background: C.white, borderRadius: 8, padding: 4, gap: 3, border: `1px solid ${C.border}` }}>
          {["MTD", "QTD", "YTD"].map(p => <button key={p} onClick={() => setPeriod(p)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: period === p ? C.navy : "transparent", color: period === p ? C.white : C.muted, fontSize: 11, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: 500 }}>{p}</button>)}
        </div>
      </div>

      {/* KPI tiles */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Revenue", value: `₱${(totalRev/1000000).toFixed(2)}M`, sub: "+18% vs last year", icon: "💰", trend: "up", color: C.successBg, border: "#b8d9c8" },
          { label: "Total Events", value: totalEvents, sub: "+5 vs last year", icon: "🗓", trend: "up", color: C.infoBg, border: "#c0d4f0" },
          { label: "Conversion Rate", value: `${avgConversion}%`, sub: "+3.2pp vs last year", icon: "📈", trend: "up", color: "#fdf4e0", border: "#f0dba0" },
          { label: "Total Inquiries", value: totalInquiries, sub: "+22% vs last year", icon: "📩", trend: "up", color: C.purpleBg, border: "#c8b8f0" },
        ].map(s => (
          <div key={s.label} style={{ background: s.color, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 0.3, textTransform: "uppercase", lineHeight: 1.4 }}>{s.label}</div>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 600, color: C.text }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.success, marginTop: 4 }}>↑ {s.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue Bar Chart */}
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Monthly Revenue 2025</div>
          <Badge color="gold">₱{(totalRev/1000000).toFixed(2)}M Total</Badge>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: isMobile ? 6 : 10, height: 140 }}>
          {ANALYTICS_MONTHLY.map(m => {
            const h = Math.round((m.revenue / maxRevenue) * 120) + 10;
            return (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: isMobile ? 9 : 10, color: C.muted, fontWeight: 500 }}>₱{Math.round(m.revenue/1000)}K</div>
                <div style={{ width: "100%", height: h, background: `linear-gradient(180deg, ${C.gold} 0%, ${C.goldDark} 100%)`, borderRadius: "4px 4px 0 0", minHeight: 4, position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.15)", borderRadius: "4px 4px 0 0" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 10, borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 2 }}>
          {ANALYTICS_MONTHLY.map(m => <div key={m.month} style={{ flex: 1, textAlign: "center", fontSize: isMobile ? 9 : 10, color: C.muted }}>{m.month}</div>)}
        </div>
      </div>

      {/* Conversion Funnel + Top Packages */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Conversion Funnel */}
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 18 }}>Conversion Funnel</div>
          {[
            { stage: "Total Inquiries", value: 88, pct: 100, color: C.infoBg, border: "#c0d4f0", text: C.info },
            { stage: "Ocular Scheduled", value: 54, pct: 61, color: C.purpleBg, border: "#c8b8f0", text: C.purple },
            { stage: "Proposal Sent", value: 41, pct: 47, color: "#fdf4e0", border: "#f0dba0", text: C.goldDark },
            { stage: "Reserved", value: 31, pct: 35, color: C.warningBg, border: "#f0d090", text: C.warning },
            { stage: "Fully Booked", value: 37, pct: 42, color: C.successBg, border: "#b8d9c8", text: C.success },
          ].map((s, i) => (
            <div key={s.stage} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontSize: 11, color: C.text }}>{s.stage}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: s.text }}>{s.value} · {s.pct}%</div>
              </div>
              <div style={{ height: 8, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: s.border, borderRadius: 99 }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: "10px 12px", background: C.successBg, borderRadius: 8, border: `1px solid #b8d9c8` }}>
            <div style={{ fontSize: 11, color: C.success, fontWeight: 500 }}>✓ Average Conversion Rate: {avgConversion}%</div>
          </div>
        </div>

        {/* Top Package Performance */}
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 18 }}>Top Packages by Revenue</div>
          {PACKAGE_PERFORMANCE.sort((a, b) => b.revenue - a.revenue).map((pkg, i) => (
            <div key={pkg.name} style={{ padding: "10px 12px", background: i === 0 ? "#fffbf0" : C.bg, borderRadius: 8, marginBottom: 8, border: `1px solid ${i === 0 ? "#f0dba0" : C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{pkg.name} {i === 0 && "🏆"}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{pkg.bookings} bookings · ★ {pkg.avgFeedback}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>₱{(pkg.revenue/1000000).toFixed(2)}M</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{pkg.utilization}% util.</div>
                </div>
              </div>
              <div style={{ marginTop: 8, height: 4, background: C.border, borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${pkg.utilization}%`, background: pkg.utilization > 80 ? C.success : C.gold, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-on Performance */}
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>Add-on Revenue Breakdown</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {ADDON_PERFORMANCE.sort((a, b) => b.totalRevenue - a.totalRevenue).map(a => (
            <div key={a.id} style={{ padding: "14px 16px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text, lineHeight: 1.3 }}>{a.label}</div>
                <span style={{ fontSize: 14 }}>{a.trend === "up" ? "📈" : a.trend === "down" ? "📉" : "➡️"}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.gold }}>₱{(a.totalRevenue/1000).toFixed(0)}K</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{a.timesBooked} bookings · {a.margin}% margin</div>
              <div style={{ marginTop: 8, height: 4, background: C.border, borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${a.margin}%`, background: a.margin > 65 ? C.success : a.margin > 50 ? C.gold : C.warning, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PHASE 4: ADVANCED QUOTATION ──────────────────────────────────────────────
function AdvancedQuotationView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [rules, setRules] = useState(PRICING_RULES);
  const [tab, setTab] = useState("rules");
  const [selected, setSelected] = useState(PACKAGES[1]);
  const [addOns, setAddOns] = useState({});
  const [appliedRules, setAppliedRules] = useState([]);
  const [newRule, setNewRule] = useState({ name: "", type: "percent", value: "", trigger: "" });
  const [showAddRule, setShowAddRule] = useState(false);
  const [ruleSaved, setRuleSaved] = useState(false);

  const baseTotal = selected ? selected.price + ADDONS.filter(a => addOns[a.id]).reduce((s, a) => s + a.price, 0) : 0;
  const discount = appliedRules.reduce((s, rid) => {
    const r = rules.find(r => r.id === rid);
    if (!r) return s;
    return s + (r.type === "percent" ? Math.round(baseTotal * r.value / 100) : r.value);
  }, 0);
  const finalTotal = Math.max(0, baseTotal - discount);

  function toggleRule(id) { setAppliedRules(p => p.includes(id) ? p.filter(r => r !== id) : [...p, id]); }
  function saveNewRule() {
    if (!newRule.name || !newRule.value) return;
    setRules(p => [...p, { ...newRule, id: p.length + 1, value: +newRule.value, active: true, applied: 0, color: "blue" }]);
    setNewRule({ name: "", type: "percent", value: "", trigger: "" });
    setRuleSaved(true); setTimeout(() => { setRuleSaved(false); setShowAddRule(false); }, 1800);
  }
  function toggleActive(id) { setRules(p => p.map(r => r.id === id ? { ...r, active: !r.active } : r)); }

  const tabs = ["rules", "builder", "margins"];
  const tabLabels = { rules: "💎 Pricing Rules", builder: "🔨 Quote Builder", margins: "📊 Margin Analysis" };

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,160,80,0.9)", letterSpacing: 1, textTransform: "uppercase", background: "rgba(255,160,80,0.1)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,160,80,0.25)" }}>⚡ Phase 4</span>
        </div>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: C.text, margin: 0 }}>Advanced Quotation</h1>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Dynamic pricing rules, discount engine, and margin calculator</div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 22, background: C.white, padding: 5, borderRadius: 10, border: `1px solid ${C.border}`, overflowX: "auto" }}>
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} style={{ flexShrink: 0, flex: 1, padding: "8px 12px", background: tab === t ? C.navy : "transparent", color: tab === t ? C.white : C.muted, border: "none", borderRadius: 7, fontSize: isMobile ? 11 : 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>{tabLabels[t]}</button>)}
      </div>

      {tab === "rules" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: C.muted }}>{rules.filter(r => r.active).length} active rules</div>
            <Btn onClick={() => setShowAddRule(p => !p)} style={{ fontSize: 12, padding: "8px 16px" }}>+ New Rule</Btn>
          </div>
          {showAddRule && (
            <div style={{ background: "#fffbf0", border: `1px solid #f0dba0`, borderRadius: 12, padding: 20, marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.goldDark, marginBottom: 14 }}>💎 New Pricing Rule</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <div><label style={lbl}>Rule Name</label><input value={newRule.name} onChange={e => setNewRule(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Loyalty Discount" style={inp({ fontSize: 12 })} /></div>
                <div><label style={lbl}>Type</label>
                  <select value={newRule.type} onChange={e => setNewRule(p => ({ ...p, type: e.target.value }))} style={inp({ fontSize: 12 })}>
                    <option value="percent">Percentage (%)</option><option value="fixed">Fixed Amount (₱)</option>
                  </select>
                </div>
                <div><label style={lbl}>Value ({newRule.type === "percent" ? "%" : "₱"})</label><input type="number" value={newRule.value} onChange={e => setNewRule(p => ({ ...p, value: e.target.value }))} placeholder={newRule.type === "percent" ? "10" : "5000"} style={inp({ fontSize: 12 })} /></div>
                <div><label style={lbl}>Trigger Condition</label><input value={newRule.trigger} onChange={e => setNewRule(p => ({ ...p, trigger: e.target.value }))} placeholder="When does this apply?" style={inp({ fontSize: 12 })} /></div>
              </div>
              {ruleSaved && <div style={{ marginTop: 10, fontSize: 12, color: C.success, fontWeight: 500 }}>✓ Rule saved!</div>}
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}><Btn onClick={saveNewRule} style={{ fontSize: 12 }}>Save Rule</Btn><Btn variant="outline" onClick={() => setShowAddRule(false)} style={{ fontSize: 12 }}>Cancel</Btn></div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rules.map(rule => {
              const colorMap = { green: "green", blue: "blue", purple: "purple", amber: "amber", gold: "gold", red: "red" };
              return (
                <div key={rule.id} style={{ background: C.white, borderRadius: 10, border: `1px solid ${C.border}`, padding: "14px 18px", display: "flex", gap: 14, alignItems: "center", opacity: rule.active ? 1 : 0.55 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{rule.name}</div>
                      <Badge color={colorMap[rule.color] || "gray"}>{rule.type === "percent" ? `${rule.value}% off` : `₱${rule.value.toLocaleString()} off`}</Badge>
                      {!rule.active && <Badge color="gray">Inactive</Badge>}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted }}>🎯 {rule.trigger}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Applied {rule.applied} times</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => toggleActive(rule.id)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${rule.active ? C.success : C.border}`, background: rule.active ? C.successBg : C.bg, color: rule.active ? C.success : C.muted, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{rule.active ? "Active" : "Off"}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "builder" && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>Select Package</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PACKAGES.map(pkg => (
                <div key={pkg.id} onClick={() => setSelected(pkg)} style={{ padding: "14px 16px", background: C.white, borderRadius: 10, border: `2px solid ${selected?.id === pkg.id ? C.gold : C.border}`, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{pkg.name}</div><div style={{ fontSize: 14, fontFamily: "'Cormorant Garamond', serif", color: C.navy }}>₱{pkg.price.toLocaleString()}</div></div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}><Badge color={typeColor(pkg.type)}>{pkg.type}</Badge></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", position: "sticky", top: 20 }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, background: C.navy }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.gold }}>Smart Quote Builder</div>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>Add-ons</div>
                {ADDONS.map(a => (
                  <div key={a.id} onClick={() => setAddOns(p => ({ ...p, [a.id]: !p[a.id] }))} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${addOns[a.id] ? C.gold : C.border}`, background: addOns[a.id] ? C.gold : "transparent" }} />
                      <div style={{ fontSize: 11, color: C.text }}>{a.label}</div>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted }}>+₱{a.price.toLocaleString()}</div>
                  </div>
                ))}
                <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, margin: "16px 0 10px" }}>Apply Discount Rules</div>
                {rules.filter(r => r.active).map(rule => (
                  <div key={rule.id} onClick={() => toggleRule(rule.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${appliedRules.includes(rule.id) ? C.success : C.border}`, background: appliedRules.includes(rule.id) ? C.success : "transparent" }} />
                      <div style={{ fontSize: 11, color: C.text }}>{rule.name}</div>
                    </div>
                    <div style={{ fontSize: 11, color: C.success }}>-{rule.type === "percent" ? `${rule.value}%` : `₱${rule.value.toLocaleString()}`}</div>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "14px", background: C.bg, borderRadius: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12, color: C.muted }}>Subtotal</span><span style={{ fontSize: 12, color: C.text }}>₱{baseTotal.toLocaleString()}</span></div>
                  {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12, color: C.success }}>Discount Applied</span><span style={{ fontSize: 12, color: C.success }}>-₱{discount.toLocaleString()}</span></div>}
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: C.muted }}>Final Total</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.navy, fontWeight: 600 }}>₱{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
                {discount > 0 && <div style={{ marginTop: 10, padding: "8px 12px", background: C.successBg, borderRadius: 6, fontSize: 11, color: C.success, fontWeight: 500 }}>✓ Client saves ₱{discount.toLocaleString()} with applied discounts</div>}
                <Btn style={{ width: "100%", marginTop: 14, fontSize: 12 }}>Send Quote to Client</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "margins" && (
        <div>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>Package Margin Analysis</div>
            {PACKAGE_PERFORMANCE.map((pkg, i) => {
              const margin = Math.round((pkg.revenue * 0.38) / pkg.revenue * 100);
              const grossMargin = 38 + (i % 3) * 4;
              return (
                <div key={pkg.name} style={{ padding: "12px 14px", background: C.bg, borderRadius: 8, marginBottom: 10, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{pkg.name}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}><Badge color={typeColor(pkg.type)}>{pkg.type}</Badge> · {pkg.bookings} bookings</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: grossMargin > 42 ? C.success : grossMargin > 38 ? C.gold : C.warning }}>{grossMargin}%</div>
                      <div style={{ fontSize: 10, color: C.muted }}>Gross Margin</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: C.muted }}>Total Revenue</span><span style={{ fontSize: 11, fontWeight: 500, color: C.text }}>₱{(pkg.revenue/1000000).toFixed(2)}M</span>
                  </div>
                  <div style={{ height: 6, background: C.border, borderRadius: 99 }}>
                    <div style={{ height: "100%", width: `${grossMargin}%`, background: grossMargin > 42 ? C.success : grossMargin > 38 ? C.gold : C.warning, borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>Add-on Margin Breakdown</div>
            {ADDON_PERFORMANCE.sort((a, b) => b.margin - a.margin).map(a => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 12px", background: C.bg, borderRadius: 8, marginBottom: 8, border: `1px solid ${C.border}` }}>
                <div><div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{a.label}</div><div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>₱{a.price.toLocaleString()} unit price · {a.timesBooked} bookings</div></div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: a.margin > 65 ? C.success : a.margin > 50 ? C.gold : C.warning }}>{a.margin}%</div>
                  <div style={{ fontSize: 10, color: C.muted }}>margin</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PHASE 4: FULL INVENTORY MANAGEMENT ───────────────────────────────────────
function FullInventoryView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [filterCat, setFilterCat] = useState("All");
  const [filterDeadStock, setFilterDeadStock] = useState(false);
  const [selected, setSelected] = useState(null);
  const deadStockItems = INVENTORY_FULL.filter(i => i.deadStock);
  const totalReplacementCost = INVENTORY_FULL.reduce((s, i) => s + i.replacementCost * i.qty, 0);
  const categories = ["All", ...new Set(INVENTORY_FULL.map(i => i.category))];
  const filtered = INVENTORY_FULL.filter(i => (filterCat === "All" || i.category === filterCat) && (!filterDeadStock || i.deadStock));

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,160,80,0.9)", letterSpacing: 1, textTransform: "uppercase", background: "rgba(255,160,80,0.1)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,160,80,0.25)" }}>⚡ Phase 4</span>
        </div>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: C.text, margin: 0 }}>Full Inventory Management</h1>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Replacement costs, dead stock alerts, location tracking & depreciation</div>
      </div>

      {/* Dead stock alert banner */}
      {deadStockItems.length > 0 && (
        <div style={{ background: C.warningBg, border: `1px solid #f0d090`, borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ fontSize: 20 }}>⚠️</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.warning }}>Dead Stock Alert — {deadStockItems.length} items unused 90+ days</div>
            <div style={{ fontSize: 12, color: C.text, marginTop: 3 }}>{deadStockItems.map(i => i.name).join(", ")} — consider disposal, rental pricing review, or replacement</div>
          </div>
          <button onClick={() => setFilterDeadStock(p => !p)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid #f0d090`, background: filterDeadStock ? C.warning : C.white, color: filterDeadStock ? C.white : C.warning, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", flexShrink: 0, fontWeight: 500 }}>
            {filterDeadStock ? "Show All" : "Filter Dead Stock"}
          </button>
        </div>
      )}

      {/* Summary tiles */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Stock Value", val: `₱${(totalReplacementCost/1000000).toFixed(2)}M`, icon: "💰", bg: "#fdf4e0", border: "#f0dba0" },
          { label: "Total SKUs", val: INVENTORY_FULL.length, icon: "📦", bg: C.infoBg, border: "#c0d4f0" },
          { label: "Dead Stock", val: deadStockItems.length, icon: "🚨", bg: C.warningBg, border: "#f0d090" },
          { label: "Avg Days Since Use", val: Math.round(INVENTORY_FULL.reduce((s, i) => s + i.daysSinceUse, 0) / INVENTORY_FULL.length), icon: "📅", bg: C.bg, border: C.border },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>{s.val} <span>{s.icon}</span></div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {categories.map(cat => <button key={cat} onClick={() => { setFilterCat(cat); setFilterDeadStock(false); }} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", background: filterCat === cat ? C.navy : C.white, color: filterCat === cat ? C.white : C.muted, border: `1px solid ${filterCat === cat ? C.navy : C.border}` }}>{cat}</button>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : selected ? "1fr 1fr" : "1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(item => (
            <div key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)} style={{ background: C.white, borderRadius: 10, border: `2px solid ${item.deadStock ? "#f0d090" : selected?.id === item.id ? C.gold : C.border}`, padding: "14px 16px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 24 }}>{item.emoji}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>📍 {item.location} · {item.category}</div>
                    <div style={{ fontSize: 11, color: item.daysSinceUse > 90 ? C.warning : C.muted, marginTop: 2 }}>🕐 Last used {item.daysSinceUse} days ago</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.qty} pcs</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>₱{item.replacementCost.toLocaleString()}/pc</div>
                  {item.deadStock && <div style={{ marginTop: 4 }}><Badge color="amber">Dead Stock</Badge></div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, background: C.navy }}>
              <div style={{ fontSize: 22 }}>{selected.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: C.white, marginTop: 4 }}>{selected.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{selected.category} · {selected.location}</div>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Quantity", val: `${selected.qty} pcs` },
                  { label: "Replacement Cost", val: `₱${selected.replacementCost.toLocaleString()}/pc` },
                  { label: "Total Asset Value", val: `₱${(selected.qty * selected.replacementCost).toLocaleString()}` },
                  { label: "Days Since Last Use", val: `${selected.daysSinceUse} days` },
                ].map(s => (
                  <div key={s.label} style={{ padding: "10px 12px", background: C.bg, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{s.val}</div>
                  </div>
                ))}
              </div>
              {selected.deadStock && (
                <div style={{ padding: "12px 14px", background: C.warningBg, border: `1px solid #f0d090`, borderRadius: 8, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.warning, marginBottom: 4 }}>⚠️ Dead Stock — Action Required</div>
                  <div style={{ fontSize: 11, color: C.text }}>This item has not been used in {selected.daysSinceUse} days. Consider: discounted rental pricing, sell-off, or disposal.</div>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Btn style={{ fontSize: 12 }}>📋 View Reservation History</Btn>
                <Btn variant="outline" style={{ fontSize: 12 }}>🔧 Log Repair / Condition Note</Btn>
                {selected.deadStock && <Btn variant="danger" style={{ fontSize: 12 }}>🗑 Flag for Disposal Review</Btn>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PHASE 4: SUPPLIER PERFORMANCE ────────────────────────────────────────────
function SupplierPerformanceView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [selected, setSelected] = useState(null);
  const badgeColor = b => b === "Gold Partner" ? "gold" : b === "Preferred Supplier" ? "blue" : "gray";

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,160,80,0.9)", letterSpacing: 1, textTransform: "uppercase", background: "rgba(255,160,80,0.1)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,160,80,0.25)" }}>⚡ Phase 4</span>
        </div>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: C.text, margin: 0 }}>Supplier Performance</h1>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>On-time delivery, quality ratings, and performance scorecards</div>
      </div>

      {/* Warning for underperformers */}
      {SUPPLIER_PERFORMANCE_DATA.filter(s => s.avgQuality < 4).length > 0 && (
        <div style={{ background: C.dangerBg, border: `1px solid #e0b8b8`, borderRadius: 10, padding: "12px 16px", marginBottom: 18, fontSize: 12, color: C.danger, fontWeight: 500 }}>
          ⚠️ {SUPPLIER_PERFORMANCE_DATA.filter(s => s.avgQuality < 4).length} suppliers below 4.0 quality threshold: {SUPPLIER_PERFORMANCE_DATA.filter(s => s.avgQuality < 4).map(s => s.name).join(", ")}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : selected ? "1fr 1.2fr" : "1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SUPPLIER_PERFORMANCE_DATA.sort((a, b) => b.avgQuality - a.avgQuality).map((s, i) => {
            const onTimeRate = Math.round((s.onTimeDeliveries / s.totalOrders) * 100);
            return (
              <div key={s.id} onClick={() => setSelected(selected?.id === s.id ? null : s)} style={{ background: C.white, borderRadius: 10, border: `2px solid ${selected?.id === s.id ? C.gold : s.avgQuality < 4 ? "#e0b8b8" : C.border}`, padding: "16px 18px", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{s.name}</div>
                      {i === 0 && <span>🏆</span>}
                      {s.badge && <Badge color={badgeColor(s.badge)}>{s.badge}</Badge>}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted }}>{s.category} · Last delivery: {s.lastDelivery}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: s.avgQuality >= 4.8 ? C.success : s.avgQuality >= 4 ? C.gold : C.danger }}>★ {s.avgQuality.toFixed(1)}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>Avg Quality</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  <div style={{ padding: "8px 10px", background: C.bg, borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: onTimeRate >= 90 ? C.success : onTimeRate >= 75 ? C.gold : C.danger }}>{onTimeRate}%</div>
                    <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>On-Time</div>
                  </div>
                  <div style={{ padding: "8px 10px", background: C.bg, borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{s.totalOrders}</div>
                    <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Total Orders</div>
                  </div>
                  <div style={{ padding: "8px 10px", background: C.bg, borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.gold }}>₱{Math.round(s.totalSpend/1000)}K</div>
                    <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Total Spend</div>
                  </div>
                </div>
                {s.lateDeliveries > 0 && (
                  <div style={{ marginTop: 10, padding: "6px 10px", background: C.warningBg, borderRadius: 6, fontSize: 11, color: C.warning, fontWeight: 500 }}>
                    ⚠️ {s.lateDeliveries} late deliver{s.lateDeliveries > 1 ? "ies" : "y"} on record
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selected && (
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, background: C.navy }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.gold, fontWeight: 600 }}>{selected.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{selected.category} · ★ {selected.avgQuality.toFixed(1)} avg quality</div>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>Performance History</div>
              {selected.history.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", background: h.onTime ? C.successBg : C.warningBg, border: `1px solid ${h.onTime ? "#b8d9c8" : "#f0d090"}`, borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{h.event}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Badge color={h.onTime ? "green" : "amber"}>{h.onTime ? "On Time ✓" : "Late ⚠️"}</Badge>
                      <Badge color="gold">★ {h.quality}</Badge>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>📅 {h.date}</div>
                  <div style={{ fontSize: 11, color: C.text, fontStyle: "italic" }}>"{h.note}"</div>
                </div>
              ))}
              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                <Btn style={{ flex: 1, fontSize: 12 }}>📧 Contact Supplier</Btn>
                <Btn variant="outline" style={{ fontSize: 12 }}>📋 Full Report</Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PHASE 4: AUTOMATION CENTER ───────────────────────────────────────────────
function AutomationView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [automations, setAutomations] = useState(AUTOMATION_TEMPLATES);
  const [showLoadingList, setShowLoadingList] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  function toggleAutomation(id) { setAutomations(p => p.map(a => a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a)); }
  function generateLoadingList() { setGenerating(true); setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800); }

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,160,80,0.9)", letterSpacing: 1, textTransform: "uppercase", background: "rgba(255,160,80,0.1)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,160,80,0.25)" }}>⚡ Phase 4</span>
        </div>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: C.text, margin: 0 }}>Automation Center</h1>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Smart workflows, auto-generated documents, and scheduled tasks</div>
      </div>

      {/* Auto Loading List Generator */}
      <div style={{ background: "linear-gradient(135deg, #12122a 0%, #1a1a38 100%)", borderRadius: 14, padding: "22px 24px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: C.gold, fontWeight: 600, marginBottom: 4 }}>🚛 Auto-Generate Loading List</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>Pulls inventory reservations, checklist tasks, and supplier windows to generate a complete truck loading manifest.</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {["Reyes-Santos Wedding", "BDO Annual Summit", "Garcia Debut"].map(ev => (
                <div key={ev} style={{ padding: "4px 10px", background: "rgba(201,168,108,0.15)", borderRadius: 20, fontSize: 11, color: C.gold, border: "1px solid rgba(201,168,108,0.25)" }}>{ev.split(" ").slice(0, 2).join(" ")}</div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="gold" onClick={() => { setShowLoadingList(true); generateLoadingList(); }} style={{ fontSize: 12 }}>Generate Now</Btn>
            <Btn variant="outline" style={{ fontSize: 12, border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}>Schedule</Btn>
          </div>
        </div>
        {showLoadingList && (
          <div style={{ marginTop: 18, padding: 16, background: "rgba(255,255,255,0.05)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
            {generating ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>⚙️</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Pulling inventory reservations, checklist items, and supplier schedules...</div>
              </div>
            ) : generated ? (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.gold, marginBottom: 12 }}>✓ Loading List Generated — Reyes-Santos Wedding · Jul 15, 2025</div>
                {[
                  { truck: "Truck 1 (6-ton)", items: ["150 Gold Chiavari Chairs", "20 Round Tables (5ft)", "2 Arch Structures (Large)", "30 Candelabras (gold)"] },
                  { truck: "Truck 2 (3-ton)", items: ["20 LED Uplights", "Photo Booth Unit (1)", "Backdrop Stand (3)", "Pin Lighting Sets (8)"] },
                ].map(t => (
                  <div key={t.truck} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>🚛 {t.truck}</div>
                    {t.items.map(item => <div key={item} style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 3, paddingLeft: 14 }}>· {item}</div>)}
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <Btn variant="gold" style={{ fontSize: 11, padding: "7px 14px" }}>📄 Export PDF</Btn>
                  <Btn variant="outline" style={{ fontSize: 11, padding: "7px 14px", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}>📊 Export Excel</Btn>
                  <Btn variant="outline" style={{ fontSize: 11, padding: "7px 14px", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}>📤 Send to Warehouse</Btn>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Automation rules */}
      <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 14 }}>Automation Rules ({automations.filter(a => a.status === "active").length} active)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {automations.map(a => (
          <div key={a.id} style={{ background: C.white, borderRadius: 10, border: `1px solid ${C.border}`, padding: "16px 18px", opacity: a.status === "active" ? 1 : 0.6 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ fontSize: 24, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>{a.desc}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>🎯 Trigger: {a.trigger} · Ran {a.runsTotal}x · Last: {a.lastRun}</div>
                  </div>
                  <button onClick={() => toggleAutomation(a.id)} style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${a.status === "active" ? C.success : C.border}`, background: a.status === "active" ? C.successBg : C.bg, color: a.status === "active" ? C.success : C.muted, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, flexShrink: 0 }}>{a.status === "active" ? "✓ Active" : "Off"}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PHASE 4: AUDIT LOG ───────────────────────────────────────────────────────
function AuditLogView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [filterCat, setFilterCat] = useState("All");
  const [filterUser, setFilterUser] = useState("All");
  const categories = ["All", ...new Set(AUDIT_LOG_DATA.map(l => l.category))];
  const users = ["All", ...new Set(AUDIT_LOG_DATA.map(l => l.user))];
  const catColors = { Pricing: "gold", Pipeline: "blue", Inventory: "purple", Quotation: "amber", Design: "rose", "Event Day": "green", Incident: "red", Supplier: "blue", Permissions: "gray", Files: "gray", Checklist: "green", CRM: "blue" };
  const filtered = AUDIT_LOG_DATA.filter(l => (filterCat === "All" || l.category === filterCat) && (filterUser === "All" || l.user === filterUser));

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,160,80,0.9)", letterSpacing: 1, textTransform: "uppercase", background: "rgba(255,160,80,0.1)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,160,80,0.25)" }}>⚡ Phase 4</span>
        </div>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: C.text, margin: 0 }}>Audit Log</h1>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Full action trail — who did what, when, across all modules</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 18 }}>
        <div>
          <label style={lbl}>Category</label>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={inp({ fontSize: 12 })}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>User</label>
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={inp({ fontSize: 12 })}>
            {users.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}` }}>
        <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{filtered.length} entries</div>
          <Btn variant="outline" style={{ fontSize: 11, padding: "6px 12px" }}>📊 Export Log</Btn>
        </div>
        {filtered.map((log, i) => (
          <div key={log.id} style={{ padding: "13px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{log.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 3 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{log.action}</div>
                <Badge color={catColors[log.category] || "gray"}>{log.category}</Badge>
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>{log.details}</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ fontSize: 10, color: C.muted }}>👤 {log.user}</div>
                <div style={{ fontSize: 10, color: C.muted }}>🕐 {log.timestamp}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PHASE 4: PERMISSIONS VIEW ────────────────────────────────────────────────
function PermissionsView() {
  const bp = useBreakpoint(); const isMobile = bp === "mobile";
  const [matrix, setMatrix] = useState(PERMISSION_MATRIX);
  const [saved, setSaved] = useState(false);

  const roles = ["admin", "coordinator", "designer", "warehouse"];
  const roleLabels = { admin: "🔑 Admin", coordinator: "🤝 Coordinator", designer: "🎨 Designer", warehouse: "🚛 Warehouse" };
  const modules = [
    { key: "crm", label: "CRM Pipeline" }, { key: "events", label: "Events" }, { key: "clients", label: "Clients" },
    { key: "meetings", label: "Meetings" }, { key: "checklist", label: "Checklist" }, { key: "crew", label: "Crew & Tasks" },
    { key: "inventory", label: "Inventory" }, { key: "suppliers", label: "Suppliers" }, { key: "files", label: "Files" },
    { key: "quotation", label: "Quotation" }, { key: "moodboard", label: "Moodboard" }, { key: "eventday", label: "Event Day" },
    { key: "afterevent", label: "After Event" }, { key: "reports", label: "Reports" },
    { key: "analytics", label: "Analytics (P4)" }, { key: "advanced_quotation", label: "Adv. Quotation (P4)" },
    { key: "full_inventory", label: "Full Inventory (P4)" }, { key: "supplier_perf", label: "Supplier Perf (P4)" },
    { key: "automation", label: "Automation (P4)" }, { key: "audit", label: "Audit Log (P4)" },
    { key: "permissions", label: "Permissions (P4)" },
  ];
  const accessLevels = ["none", "read", "full"];
  const accessColors = { full: "green", read: "blue", none: "gray" };
  const accessLabels = { full: "Full", read: "Read", none: "—" };

  function cycleAccess(role, mod) {
    if (role === "admin") return; // Admin always full
    const current = matrix[role][mod] || "none";
    const next = current === "none" ? "read" : current === "read" ? "full" : "none";
    setMatrix(p => ({ ...p, [role]: { ...p[role], [mod]: next } }));
  }

  function saveMatrix() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div style={{ padding: isMobile ? "20px 16px" : "32px 36px" }}>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,160,80,0.9)", letterSpacing: 1, textTransform: "uppercase", background: "rgba(255,160,80,0.1)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,160,80,0.25)" }}>⚡ Phase 4</span>
          </div>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 500, color: C.text, margin: 0 }}>Advanced Permissions</h1>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Role-based access control matrix — click cells to cycle access levels</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saved && <div style={{ fontSize: 12, color: C.success, fontWeight: 500 }}>✓ Saved!</div>}
          <Btn onClick={saveMatrix} style={{ fontSize: 12 }}>Save Changes</Btn>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        {[["green", "Full Access"], ["blue", "Read Only"], ["gray", "No Access"]].map(([color, label]) => (
          <div key={label} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Badge color={color}>{accessLabels[color === "green" ? "full" : color === "blue" ? "read" : "none"]}</Badge>
            <span style={{ fontSize: 11, color: C.muted }}>{label}</span>
          </div>
        ))}
        <div style={{ fontSize: 11, color: C.muted }}>· Click cells to cycle access (non-admin roles only)</div>
      </div>

      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflowX: "auto" }}>
        {/* Header row */}
        <div style={{ display: "grid", gridTemplateColumns: `200px ${roles.map(() => "1fr").join(" ")}`, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: C.navy, zIndex: 10 }}>
          <div style={{ padding: "12px 16px", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>Module</div>
          {roles.map(r => (
            <div key={r} style={{ padding: "12px 8px", textAlign: "center", fontSize: 11, color: r === "admin" ? C.gold : "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: 0.3 }}>{roleLabels[r]}</div>
          ))}
        </div>
        {modules.map((mod, i) => (
          <div key={mod.key} style={{ display: "grid", gridTemplateColumns: `200px ${roles.map(() => "1fr").join(" ")}`, borderBottom: i < modules.length - 1 ? `1px solid ${C.border}` : "none", background: i % 2 === 0 ? C.white : C.bg }}>
            <div style={{ padding: "11px 16px", fontSize: 12, color: C.text, fontWeight: mod.label.includes("P4") ? 500 : 400, display: "flex", alignItems: "center", gap: 6 }}>
              {mod.label.includes("P4") && <span style={{ fontSize: 9, background: "rgba(255,160,80,0.15)", color: "rgba(255,120,40,0.9)", borderRadius: 8, padding: "1px 5px", fontWeight: 600, letterSpacing: 0.3 }}>P4</span>}
              {mod.label.replace(" (P4)", "")}
            </div>
            {roles.map(role => {
              const access = matrix[role]?.[mod.key] || "none";
              return (
                <div key={role} onClick={() => cycleAccess(role, mod.key)} style={{ padding: "10px 8px", textAlign: "center", cursor: role === "admin" ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Badge color={accessColors[access]}>{accessLabels[access]}</Badge>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [clientPanel, setClientPanel] = useState(false);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";

  function handleLogin(u) { setUser(u); if (u.role === "client") setClientPanel(true); setShowLogin(false); }
  function handleLogout() { setUser(null); setClientPanel(false); }

  if (user && ["admin", "coordinator", "designer", "warehouse"].includes(user.role)) {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <LandingNav user={user} onLoginClick={() => setShowLogin(true)} onLogoutClick={handleLogout} onPortalClick={() => setClientPanel(p => !p)} />
      <main style={{ marginRight: (!isMobile && clientPanel && user?.role === "client") ? 430 : 0, transition: "margin-right 0.3s ease" }}>
        <Hero onLoginClick={() => setShowLogin(true)} />
        <Services />
        <Gallery />
        <StatsBand />
        <PublicReviews reviews={reviews} />
        <InquiryCTA onLoginClick={() => setShowLogin(true)} />
        <Footer />
      </main>
      {clientPanel && user?.role === "client" && <ClientPanel user={user} onClose={() => setClientPanel(false)} onAddReview={r => setReviews(p => [...p, { ...r, id: p.length + 1 }])} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} users={users} onRegister={u => setUsers(p => [...p, u])} />}
    </div>
  );
}
