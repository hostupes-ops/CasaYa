import { useState, useEffect, useRef } from “react”;

// ─── COLORS & CONSTANTS ───────────────────────────────────────────────────────
const T = “#00BFA5”;
const TD = “#009688”;
const TL = “#E0F7F4”;
const N = “#1E2D4E”;
const N2 = “#2C3E6B”;
const G5 = “#718096”;
const G3 = “#CBD5E0”;
const G1 = “#F7F9FC”;

const CITIES = [
[“La Habana”,“🏙️”],[“Santiago de Cuba”,“🌄”],[“Holguín”,“🌿”],
[“Camagüey”,“🏛️”],[“Guantánamo”,“⛰️”],[“Santa Clara”,“🌺”],
[“Las Tunas”,“🌾”],[“Bayamo”,“🎵”],[“Cienfuegos”,“⚓”],
[“Pinar del Río”,“🌱”],[“Matanzas”,“🌊”],[“Ciego de Ávila”,“🍍”],
[“Sancti Spíritus”,“🕌”],[“Trinidad”,“🏺”],[“Varadero”,“🏖️”],
];

const CAT_EMOJI = { limpieza:“🧹”, cuidado:“👩‍⚕️”, belleza:“💅” };
const CAT_BG    = { limpieza:”#E0F7F4”, cuidado:”#FFF0E3”, belleza:”#F3E8FF” };
const CAT_NAME  = { limpieza:“Limpieza del hogar”, cuidado:“Cuidado de personas mayores”, belleza:“Belleza y estética” };

const DAYS   = [“Dom”,“Lun”,“Mar”,“Mié”,“Jue”,“Vie”,“Sáb”];
const MONTHS = [“Ene”,“Feb”,“Mar”,“Abr”,“May”,“Jun”,“Jul”,“Ago”,“Sep”,“Oct”,“Nov”,“Dic”];
const TIMES  = [“8:00 AM”,“9:00 AM”,“10:00 AM”,“11:00 AM”,“2:00 PM”,“4:00 PM”];

// ─── TUTORIAL DATA ────────────────────────────────────────────────────────────
const TUT = [
{
title: “Busca tu servicio a domicilio”,
sub: “Limpieza, cuidado de personas, belleza y más. Todo a domicilio en Cuba.”,
icon: “🏠”
},
{
title: “Escoge a tu profesional ideal”,
sub: “Compara profesionales, sus precios y valoraciones. Elige el que más te guste.”,
icon: “⭐”
},
{
title: “Contáctalo en 3 toques”,
sub: “Reserva en la app o escríbele por WhatsApp. Pago en efectivo, sin comisiones.”,
icon: “💬”
},
{
title: “Disfruta tu servicio”,
sub: “Recibe al profesional en tu domicilio en el horario acordado. ¡Y califica tu experiencia!”,
icon: “🎉”
}
];

// ─── STYLES (inline, zero external deps) ─────────────────────────────────────
const S = {
// layout
app: { fontFamily:”‘Segoe UI’,system-ui,sans-serif”, background:G1, minHeight:“100vh”, maxWidth:430, margin:“0 auto”, position:“relative”, overflow:“hidden” },
screen: { minHeight:“100vh”, display:“flex”, flexDirection:“column”, background:“white” },

// nav
nav: { background:“white”, borderBottom:`1px solid #EDF2F7`, padding:“0 20px”, height:60, display:“flex”, alignItems:“center”, justifyContent:“space-between”, position:“sticky”, top:0, zIndex:100 },
logo: { fontSize:22, fontWeight:800, color:N, letterSpacing:-0.5, cursor:“pointer” },
logoSpan: { color:T },

// bottom nav
bnav: { position:“fixed”, bottom:0, left:“50%”, transform:“translateX(-50%)”, width:“100%”, maxWidth:430, background:“white”, borderTop:`1px solid #EDF2F7`, display:“flex”, justifyContent:“space-around”, padding:“8px 0 14px”, zIndex:100 },
bni: (on) => ({ display:“flex”, flexDirection:“column”, alignItems:“center”, gap:3, cursor:“pointer”, padding:“4px 14px”, border:“none”, background:“none”, color: on ? T : G5, fontFamily:“inherit”, fontSize:10, fontWeight:600 }),

// fab
fab: { position:“fixed”, bottom:18, left:“50%”, transform:“translateX(-50%) translateX(0)”, marginLeft:0, width:54, height:54, borderRadius:“50%”, background:T, border:“none”, display:“flex”, alignItems:“center”, justifyContent:“center”, boxShadow:`0 4px 20px rgba(0,191,165,.4)`, cursor:“pointer”, zIndex:110 },

// buttons
bt: { width:“100%”, background:T, border:“none”, borderRadius:14, padding:“15px”, fontFamily:“inherit”, fontSize:15, fontWeight:800, color:“white”, cursor:“pointer”, display:“block” },
bto: { width:“100%”, background:“transparent”, border:`2px solid ${T}`, borderRadius:14, padding:14, fontFamily:“inherit”, fontSize:15, fontWeight:700, color:T, cursor:“pointer”, display:“block” },
backW: { width:36, height:36, background:“rgba(255,255,255,.15)”, border:“none”, borderRadius:10, display:“flex”, alignItems:“center”, justifyContent:“center”, cursor:“pointer”, color:“white”, flexShrink:0 },
backD: { width:36, height:36, background:G1, border:“none”, borderRadius:10, display:“flex”, alignItems:“center”, justifyContent:“center”, cursor:“pointer”, color:”#4A5568”, flexShrink:0 },

// forms
fg: { display:“flex”, flexDirection:“column”, gap:8 },
fl: { fontSize:13, fontWeight:700, color:”#4A5568” },
fi: { background:“white”, border:`1.5px solid #E2E8F0`, borderRadius:12, padding:“13px 16px”, fontFamily:“inherit”, fontSize:14, color:N, outline:“none”, width:“100%”, boxSizing:“border-box” },
fsel: { background:“white”, border:`1.5px solid #E2E8F0`, borderRadius:12, padding:“13px 16px”, fontFamily:“inherit”, fontSize:14, color:N, outline:“none”, width:“100%”, cursor:“pointer” },

// info box
ib: { background:TL, borderRadius:12, padding:14, display:“flex”, gap:10, alignItems:“flex-start”, fontSize:12, color:TD, fontWeight:500, lineHeight:1.5 },

// hero
hero: { background:`linear-gradient(145deg,${N},${N2})`, padding:“28px 20px 32px”, position:“relative”, overflow:“hidden” },
heroTitle: { fontSize:22, fontWeight:800, color:“white”, lineHeight:1.3, marginBottom:20 },
heroEm: { color:T, fontStyle:“normal” },

// search bar
sb: { background:“white”, borderRadius:14, display:“flex”, alignItems:“center”, padding:“0 16px”, gap:10, height:52, boxShadow:“0 4px 24px rgba(0,0,0,.25)” },
sbBtn: { background:T, border:“none”, borderRadius:10, width:36, height:36, display:“flex”, alignItems:“center”, justifyContent:“center”, cursor:“pointer”, flexShrink:0 },

// city
cityBar: { display:“flex”, alignItems:“center”, gap:8, padding:“12px 20px”, background:“white”, borderBottom:`1px solid #EDF2F7`, position:“relative”, zIndex:50 },
cityBtn: { display:“flex”, alignItems:“center”, gap:6, background:“none”, border:`1.5px solid #E2E8F0`, borderRadius:20, padding:“7px 14px”, fontFamily:“inherit”, fontSize:13, fontWeight:600, color:N, cursor:“pointer” },
cityDd: { position:“absolute”, top:52, left:20, background:“white”, borderRadius:16, boxShadow:“0 8px 40px rgba(0,0,0,.13)”, zIndex:200, width:“calc(100% - 40px)”, border:`1px solid #EDF2F7`, maxHeight:260, overflowY:“auto” },
cityOpt: { padding:“12px 16px”, fontSize:14, fontWeight:600, cursor:“pointer”, display:“flex”, alignItems:“center”, gap:10, borderBottom:`1px solid #F7F9FC` },

// cats
cg: { display:“grid”, gridTemplateColumns:“repeat(3,1fr)”, gap:12 },
cc: { background:“white”, borderRadius:16, padding:“18px 10px 14px”, display:“flex”, flexDirection:“column”, alignItems:“center”, gap:10, cursor:“pointer”, boxShadow:“0 4px 20px rgba(0,0,0,.07)”, border:`2px solid transparent` },
ci: { width:52, height:52, borderRadius:“50%”, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:24 },

// promo
pb: { margin:“20px 20px 0”, background:`linear-gradient(135deg,${T},${TD})`, borderRadius:16, padding:“18px 20px”, display:“flex”, alignItems:“center”, justifyContent:“space-between”, position:“relative”, overflow:“hidden” },

// pro card
pc: { background:“white”, borderRadius:16, padding:16, display:“flex”, gap:14, boxShadow:“0 4px 20px rgba(0,0,0,.07)”, cursor:“pointer” },
pa: { width:64, height:64, borderRadius:14, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:28, flexShrink:0, overflow:“hidden” },

// filter chips
fc: { display:“flex”, gap:8, padding:“14px 20px”, overflowX:“auto”, background:“white”, borderBottom:`1px solid #F0F4F8` },
ch: (on) => ({ whiteSpace:“nowrap”, padding:“6px 14px”, borderRadius:20, fontSize:12, fontWeight:600, cursor:“pointer”, border: on ? `1.5px solid ${T}` : `1.5px solid #E2E8F0`, background: on ? T : “white”, color: on ? “white” : “#4A5568”, fontFamily:“inherit” }),

// detail hero
dh: { background:`linear-gradient(145deg,${N},${N2})`, padding:“20px 20px 28px” },
da: { width:80, height:80, borderRadius:20, overflow:“hidden”, border:`3px solid ${T}`, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:40, flexShrink:0 },

// service item
si: { background:G1, borderRadius:12, padding:“14px 12px” },

// cta bar
cta: { position:“fixed”, bottom:0, left:“50%”, transform:“translateX(-50%)”, width:“100%”, maxWidth:430, background:“white”, padding:“14px 20px 20px”, borderTop:`1px solid #EDF2F7`, display:“flex”, gap:12, zIndex:99 },

// booking
db2: (on) => ({ background: on ? T : “white”, border: on ? `1.5px solid ${T}` : `1.5px solid #E2E8F0`, borderRadius:12, padding:“10px 4px”, fontFamily:“inherit”, cursor:“pointer”, textAlign:“center” }),
tb: (on) => ({ background: on ? T : “white”, border: on ? `1.5px solid ${T}` : `1.5px solid #E2E8F0`, borderRadius:10, padding:10, fontFamily:“inherit”, fontSize:13, fontWeight:600, color: on ? “white” : “#4A5568”, cursor:“pointer” }),
ck: (on) => ({ background: on ? TL : “white”, border: on ? `1.5px solid ${T}` : `1.5px solid #E2E8F0`, borderRadius:12, padding:“14px 16px”, display:“flex”, alignItems:“center”, gap:12, cursor:“pointer”, marginBottom:8 }),
ckb: (on) => ({ width:22, height:22, borderRadius:6, border: on ? `2px solid ${T}` : `2px solid ${G3}`, background: on ? T : “transparent”, display:“flex”, alignItems:“center”, justifyContent:“center”, flexShrink:0 }),

// summary
sumc: { background:G1, borderRadius:16, padding:16 },
sr: { display:“flex”, justifyContent:“space-between”, alignItems:“center”, padding:“7px 0”, borderBottom:`1px solid #E8EBF0` },

// modal
mo: { position:“fixed”, inset:0, background:“rgba(0,0,0,.4)”, zIndex:300, display:“flex”, alignItems:“flex-end”, justifyContent:“center” },
ms: { background:“white”, borderRadius:“24px 24px 0 0”, width:“100%”, maxWidth:430, maxHeight:“90vh”, overflowY:“auto”, paddingBottom:40 },

// rating
ro: { position:“fixed”, inset:0, background:“rgba(0,0,0,.45)”, zIndex:400, display:“flex”, alignItems:“center”, justifyContent:“center”, padding:24 },
rc2: { background:“white”, borderRadius:24, padding:“28px 24px”, width:“100%”, maxWidth:360, textAlign:“center” },

// profile
ph: { background:`linear-gradient(145deg,${N},${N2})`, padding:“28px 20px 24px”, display:“flex”, flexDirection:“column”, alignItems:“center”, textAlign:“center”, gap:12 },
pmenu: { background:“white”, borderRadius:16, overflow:“hidden”, boxShadow:“0 4px 20px rgba(0,0,0,.07)”, marginBottom:14 },
mi: { display:“flex”, alignItems:“center”, gap:14, padding:16, cursor:“pointer”, borderBottom:`1px solid #F7F9FC` },
mic: { width:38, height:38, borderRadius:10, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:18, flexShrink:0 },

// success
succi: { width:100, height:100, background:TL, borderRadius:“50%”, display:“flex”, alignItems:“center”, justifyContent:“center”, marginBottom:24 },

// reg header
rh: { background:`linear-gradient(145deg,${N},${N2})`, padding:“20px 20px 24px” },

// vbadge
vb: (type) => {
const map = { ok:[TL,TD], pend:[”#FFF8E1”,”#D97706”], no:[”#FEE2E2”,”#DC2626”] };
return { display:“inline-flex”, alignItems:“center”, gap:4, borderRadius:20, fontSize:11, fontWeight:700, padding:“4px 10px”, background:map[type][0], color:map[type][1] };
},

// photo upload
pu: (done) => ({ border: done ? `2px solid ${T}` : `2px dashed ${G3}`, borderRadius:16, padding:“22px 16px”, textAlign:“center”, cursor:“pointer”, background: done ? TL : “white”, position:“relative”, overflow:“hidden” }),

// step dots
sdots: { display:“flex”, gap:6, padding:“14px 20px 0” },
sd: (on) => ({ height:4, borderRadius:4, flex:1, background: on ? T : “#E2E8F0”, transition:“background .3s” }),

// tut dots
dot: (on) => ({ width: on ? 24 : 8, height:8, borderRadius: on ? 4 : “50%”, background: on ? T : G3, transition:“all .25s” }),

// onboarding
onbHero: { background:`linear-gradient(150deg,${N},${N2})`, padding:“52px 28px 36px”, textAlign:“center” },
rc: (on) => ({ background:“white”, border: on ? `2px solid ${T}` : `2px solid #E2E8F0`, borderRadius:20, padding:20, display:“flex”, alignItems:“center”, gap:16, cursor:“pointer”, boxShadow:“0 4px 20px rgba(0,0,0,.07)”, marginBottom:14 }),
ri: { width:54, height:54, borderRadius:16, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:26, flexShrink:0 },

// avatar
avBox: (done) => ({ width:100, height:100, borderRadius:“50%”, background:G1, border: done ? `3px solid ${T}` : `3px dashed ${G3}`, display:“flex”, flexDirection:“column”, alignItems:“center”, justifyContent:“center”, cursor:“pointer”, overflow:“hidden”, margin:“0 auto” }),

// tut illustration bg
tutIll: { width:220, height:220, borderRadius:“50%”, background:TL, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:100, marginBottom:16 },
};

// ─── TINY COMPONENTS ─────────────────────────────────────────────────────────

function Logo({ onClick }) {
return <div style={S.logo} onClick={onClick}>Casa<span style={S.logoSpan}>Ya</span></div>;
}

function BackW({ onClick }) {
return (
<button style={S.backW} onClick={onClick}>
<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
<path d="M19 12H5M12 19l-7-7 7-7"/>
</svg>
</button>
);
}

function BackD({ onClick }) {
return (
<button style={S.backD} onClick={onClick}>
<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
<path d="M19 12H5M12 19l-7-7 7-7"/>
</svg>
</button>
);
}

function CitySelect({ label = “— Selecciona —” }) {
return (
<select style={S.fsel}>
<option value="">{label}</option>
{CITIES.map(([c]) => <option key={c}>{c}</option>)}
</select>
);
}

function InfoBox({ icon, text }) {
return (
<div style={S.ib}>
<span>{icon}</span>
<span dangerouslySetInnerHTML={{ __html: text }} />
</div>
);
}

function EmptyState({ withBtn, onRegPro }) {
return (
<div style={{ background:“white”, borderRadius:16, boxShadow:“0 4px 20px rgba(0,0,0,.07)”, display:“flex”, flexDirection:“column”, alignItems:“center”, padding:“40px 24px”, textAlign:“center”, gap:12 }}>
<div style={{ fontSize:48 }}>🔍</div>
<div style={{ fontSize:16, fontWeight:800, color:N }}>Sin profesionales aún</div>
<div style={{ fontSize:13, color:G5, lineHeight:1.6, maxWidth:260 }}>Todavía no hay profesionales. ¡Sé el primero en registrarte!</div>
{withBtn && <button style={{ …S.bt, maxWidth:240, marginTop:10 }} onClick={onRegPro}>Registrarme como profesional</button>}
</div>
);
}

function ProCard({ pro, onClick }) {
return (
<div style={S.pc} onClick={onClick}>
<div style={{ …S.pa, background: CAT_BG[pro.category] || “#F0F4F8” }}>
{pro.avatar
? <img src={pro.avatar} alt=”” style={{ width:“100%”, height:“100%”, objectFit:“cover”, borderRadius:14 }} />
: <span style={{ fontSize:28 }}>{CAT_EMOJI[pro.category] || “👤”}</span>
}
</div>
<div style={{ flex:1 }}>
<div style={{ fontSize:15, fontWeight:700, color:N }}>{pro.name}</div>
<div style={{ fontSize:12, color:G5, marginTop:2 }}>{pro.role}</div>
<div style={{ display:“flex”, gap:6, marginTop:8, flexWrap:“wrap” }}>
<span style={{ background:G1, color:G5, fontSize:10, fontWeight:600, padding:“3px 8px”, borderRadius:6 }}>📍 {pro.city}</span>
{pro.verified && <span style={{ background:TL, color:TD, fontSize:10, fontWeight:600, padding:“3px 8px”, borderRadius:6 }}>✓ Verificado</span>}
<span style={{ background:G1, color:G5, fontSize:10, fontWeight:600, padding:“3px 8px”, borderRadius:6 }}>Efectivo</span>
</div>
</div>
</div>
);
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ current, onChange }) {
const items = [
{ id:“home”, label:“Inicio”, icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
{ id:“explore”, label:“Explorar”, icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="22" height="22"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> },
{ id:“fab”, label:””, icon: null },
{ id:“bookings”, label:“Reservas”, icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="22" height="22"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
{ id:“profile”, label:“Perfil”, icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];
return (
<nav style={S.bnav}>
{items.map(item =>
item.id === “fab”
? <div key=“fab” style={{ width:60 }} />
: <button key={item.id} style={S.bni(current === item.id)} onClick={() => onChange(item.id)}>
{item.icon}
<span>{item.label}</span>
</button>
)}
</nav>
);
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

// TUTORIAL
function TutorialScreen({ onDone }) {
const [slide, setSlide] = useState(0);
const next = () => slide >= 3 ? onDone() : setSlide(s => s + 1);
const d = TUT[slide];
return (
<div style={{ …S.screen, background:“white” }}>
<div style={{ display:“flex”, alignItems:“center”, justifyContent:“space-between”, padding:“20px 24px 0” }}>
<Logo onClick={onDone} />
<button style={{ fontSize:15, fontWeight:700, color:T, background:“none”, border:“none”, cursor:“pointer”, fontFamily:“inherit” }} onClick={onDone}>Salir</button>
</div>
<div style={{ flex:1, display:“flex”, flexDirection:“column”, alignItems:“center”, justifyContent:“center”, padding:“20px 32px” }}>
<div style={S.tutIll}>{d.icon}</div>
<h2 style={{ fontSize:26, fontWeight:800, color:N, textAlign:“center”, lineHeight:1.3, marginBottom:10 }}>{d.title}</h2>
<p style={{ fontSize:15, color:G5, textAlign:“center”, lineHeight:1.6 }}>{d.sub}</p>
</div>
<div style={{ display:“flex”, justifyContent:“center”, gap:8, padding:“20px 0 10px” }}>
{TUT.map((_, i) => <div key={i} style={S.dot(i === slide)} />)}
</div>
<div style={{ padding:“16px 24px 36px” }}>
<button style={S.bt} onClick={next}>{slide === 3 ? “¡Empezar!” : “Siguiente”}</button>
</div>
</div>
);
}

// ONBOARDING
function OnboardingScreen({ onClient, onPro }) {
const [role, setRole] = useState(””);
const go = () => {
if (!role) { alert(“Por favor elige una opción.”); return; }
role === “client” ? onClient() : onPro();
};
return (
<div style={S.screen}>
<div style={S.onbHero}>
<div style={{ fontSize:34, fontWeight:800, color:“white”, letterSpacing:-1, marginBottom:6 }}>Casa<span style={{ color:T }}>Ya</span></div>
<div style={{ fontSize:14, color:“rgba(255,255,255,.45)” }}>Servicios a domicilio en Cuba 🇨🇺</div>
</div>
<div style={{ flex:1, padding:“32px 24px” }}>
<h2 style={{ fontSize:22, fontWeight:800, color:N, marginBottom:8 }}>¿Cómo quieres usar CasaYa?</h2>
<p style={{ fontSize:14, color:G5, marginBottom:28, lineHeight:1.6 }}>Elige tu rol para personalizar tu experiencia.</p>
<div style={S.rc(role===“client”)} onClick={() => setRole(“client”)}>
<div style={{ …S.ri, background:”#E0F7F4” }}>🏠</div>
<div><div style={{ fontSize:16, fontWeight:800, color:N }}>Buscar servicios</div><div style={{ fontSize:12, color:G5, marginTop:3 }}>Necesito un profesional a domicilio</div></div>
</div>
<div style={S.rc(role===“pro”)} onClick={() => setRole(“pro”)}>
<div style={{ …S.ri, background:”#EEF2FF” }}>💼</div>
<div><div style={{ fontSize:16, fontWeight:800, color:N }}>Ofrecer mis servicios</div><div style={{ fontSize:12, color:G5, marginTop:3 }}>Soy profesional y quiero clientes</div></div>
</div>
</div>
<div style={{ padding:“20px 24px 36px” }}>
<button style={S.bt} onClick={go}>Continuar →</button>
</div>
</div>
);
}

// REG CLIENT
function RegClientScreen({ onBack, onDone }) {
return (
<div style={S.screen}>
<div style={S.rh}>
<BackW onClick={onBack} />
<div style={{ fontSize:20, fontWeight:800, color:“white”, marginTop:8 }}>Crear cuenta</div>
<div style={{ fontSize:13, color:“rgba(255,255,255,.5)”, marginTop:3 }}>Para buscar y reservar servicios</div>
</div>
<div style={{ flex:1, overflowY:“auto”, paddingBottom:100 }}>
<div style={{ padding:“24px 20px”, display:“flex”, flexDirection:“column”, gap:18 }}>
<div style={S.fg}><label style={S.fl}>Nombre completo</label><input style={S.fi} type="text" placeholder="Ej: Ana García López" /></div>
<div style={S.fg}>
<label style={S.fl}>WhatsApp ✱</label>
<input style={S.fi} type="tel" placeholder="+53 5 XXX XXXX" />
<span style={{ fontSize:11, color:G5 }}>✱ Los profesionales te contactarán aquí</span>
</div>
<div style={S.fg}><label style={S.fl}>Ciudad</label><CitySelect /></div>
<div style={S.fg}><label style={S.fl}>Municipio / Reparto</label><input style={S.fi} type="text" placeholder="Ej: Playa, Vedado" /></div>
<InfoBox icon="💡" text="Tu WhatsApp permite que los profesionales se coordinen contigo directamente." />
</div>
</div>
<div style={{ position:“fixed”, bottom:0, left:“50%”, transform:“translateX(-50%)”, width:“100%”, maxWidth:430, background:“white”, padding:“14px 20px 28px”, borderTop:`1px solid #EDF2F7` }}>
<button style={S.bt} onClick={onDone}>Crear cuenta y explorar →</button>
</div>
</div>
);
}

// REG PRO
function RegProScreen({ onBack, onDone }) {
const [step, setStep] = useState(1);
const [svcCount, setSvcCount] = useState(1);
const [avatarSrc, setAvatarSrc] = useState(null);
const [uploads, setUploads] = useState({});
const avRef = useRef();

const stepTitles = [“Datos personales”,“Servicios y precios”,“Verificación”,”¡Listo!”];
const stepSubs   = [“Paso 1 de 4”,“Paso 2 de 4”,“Paso 3 de 4”,“Paso 4 de 4”];

const handleAvatar = (e) => {
const f = e.target.files[0];
if (!f) return;
const r = new FileReader();
r.onload = ev => setAvatarSrc(ev.target.result);
r.readAsDataURL(f);
};

const handleUpload = (key) => (e) => {
if (e.target.files && e.target.files[0]) setUploads(u => ({ …u, [key]: true }));
};

const goNext = () => {
if (step === 4) { onDone(); return; }
setStep(s => s + 1);
};
const goBack = () => step > 1 ? setStep(s => s - 1) : onBack();

const anyPhoto = uploads.front || uploads.back || uploads.self;

return (
<div style={S.screen}>
<div style={S.rh}>
<BackW onClick={goBack} />
<div style={{ fontSize:20, fontWeight:800, color:“white”, marginTop:8 }}>{stepTitles[step-1]}</div>
<div style={{ fontSize:13, color:“rgba(255,255,255,.5)”, marginTop:3 }}>{stepSubs[step-1]}</div>
</div>
<div style={S.sdots}>
{[1,2,3,4].map(i => <div key={i} style={S.sd(i <= step)} />)}
</div>
<div style={{ flex:1, overflowY:“auto”, paddingBottom:100 }}>
<div style={{ padding:“24px 20px”, display:“flex”, flexDirection:“column”, gap:18 }}>

```
      {/* STEP 1 */}
      {step === 1 && <>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"8px 0" }}>
          <input type="file" accept="image/*" ref={avRef} style={{ display:"none" }} onChange={handleAvatar} />
          <div style={S.avBox(!!avatarSrc)} onClick={() => avRef.current.click()}>
            {avatarSrc
              ? <img src={avatarSrc} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }} />
              : <><span style={{ fontSize:28 }}>📷</span><span style={{ fontSize:10, fontWeight:700, color:G5 }}>Tu foto</span></>
            }
          </div>
          <span style={{ fontSize:12, color:G5 }}>Foto de perfil (recomendado)</span>
        </div>
        <div style={S.fg}><label style={S.fl}>Nombre completo</label><input style={S.fi} type="text" placeholder="Ej: María González" /></div>
        <div style={S.fg}>
          <label style={S.fl}>WhatsApp ✱</label>
          <input style={S.fi} type="tel" placeholder="+53 5 XXX XXXX" />
          <span style={{ fontSize:11, color:G5 }}>✱ Los clientes te contactarán por aquí</span>
        </div>
        <div style={S.fg}><label style={S.fl}>Ciudad</label><CitySelect /></div>
        <div style={S.fg}><label style={S.fl}>Zonas donde trabajas</label><input style={S.fi} type="text" placeholder="Ej: Playa, Vedado, Miramar" /></div>
        <div style={S.fg}><label style={S.fl}>Sobre mí</label><textarea style={{ ...S.fi, resize:"none" }} rows={4} placeholder="Tu experiencia y por qué elegirte..." /></div>
      </>}

      {/* STEP 2 */}
      {step === 2 && <>
        <div style={S.fg}>
          <label style={S.fl}>Categoría</label>
          <select style={S.fsel}>
            <option value="">— Selecciona —</option>
            <option value="limpieza">🧹 Limpieza del hogar</option>
            <option value="cuidado">💊 Cuidado de personas mayores</option>
            <option value="belleza">💅 Belleza y estética</option>
          </select>
        </div>
        <div style={S.fg}>
          <label style={S.fl}>Experiencia</label>
          <select style={S.fsel}>
            <option>Menos de 1 año</option><option>1–3 años</option>
            <option>3–5 años</option><option>Más de 5 años</option><option>Más de 10 años</option>
          </select>
        </div>
        <div style={S.fg}>
          <label style={S.fl}>Disponibilidad</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {["Lun–Vie","Sábados","Domingos","Urgencias"].map(d =>
              <label key={d} style={{ display:"flex", alignItems:"center", gap:8, background:"white", border:`1.5px solid #E2E8F0`, borderRadius:10, padding:"10px 12px", cursor:"pointer", fontSize:13, fontWeight:600 }}>
                <input type="checkbox" style={{ accentColor:T }} defaultChecked={d==="Lun–Vie"} /> {d}
              </label>
            )}
          </div>
        </div>
        <div>
          <label style={{ ...S.fl, display:"block", marginBottom:12 }}>Mis servicios y precios</label>
          {Array.from({ length: svcCount }, (_, i) => (
            <div key={i} style={{ background:"white", border:`1.5px solid #E2E8F0`, borderRadius:14, padding:16, marginBottom:10 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#4A5568", marginBottom:12 }}>Servicio {i + 1}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <input style={S.fi} type="text" placeholder="Nombre del servicio" />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div style={S.fg}><label style={S.fl}>Precio (CUP)</label><input style={S.fi} type="number" placeholder="500" min="0" /></div>
                  <div style={S.fg}><label style={S.fl}>Duración</label>
                    <select style={S.fsel}><option>1h</option><option>2h</option><option>3h</option><option>4h</option><option>6h</option><option>8h</option><option>Todo el día</option></select>
                  </div>
                </div>
                <textarea style={{ ...S.fi, resize:"none" }} rows={2} placeholder="¿Qué incluye?" />
              </div>
            </div>
          ))}
          <button style={{ background:TL, border:`1.5px dashed ${T}`, borderRadius:12, padding:13, fontFamily:"inherit", fontSize:14, fontWeight:700, color:T, cursor:"pointer", width:"100%" }}
            onClick={() => setSvcCount(c => c + 1)}>
            + Agregar otro servicio
          </button>
        </div>
      </>}

      {/* STEP 3 */}
      {step === 3 && <>
        <InfoBox icon="🔒" text="<strong>Verificación opcional.</strong> Los perfiles verificados reciben hasta 3× más solicitudes." />
        {[
          { key:"front", label:"🪪 Carnet — frente", title:"Foto del carnet (frente)" },
          { key:"back",  label:"🪪 Carnet — reverso", title:"Foto del carnet (reverso)" },
          { key:"self",  label:"🤳 Selfie con carnet", title:"Foto tuya sosteniendo el carnet" },
        ].map(({ key, label, title }) => (
          <div key={key} style={S.fg}>
            <label style={S.fl}>{label}</label>
            <label style={S.pu(uploads[key])}>
              <input type="file" accept="image/*" style={{ display:"none" }} onChange={handleUpload(key)} />
              <div style={{ fontSize:32, marginBottom:8 }}>{uploads[key] ? "✅" : key==="self" ? "🤳" : "🪪"}</div>
              <div style={{ fontSize:14, fontWeight:700 }}>{uploads[key] ? "¡Cargado correctamente!" : title}</div>
              {!uploads[key] && <div style={{ fontSize:12, color:G5, marginTop:3 }}>Toca para seleccionar</div>}
            </label>
          </div>
        ))}
        <div style={S.fg}>
          <label style={S.fl}>🏠 Dirección de tu domicilio</label>
          <input style={S.fi} type="text" placeholder="Calle, número, municipio, ciudad" />
          <span style={{ fontSize:11, color:G5 }}>Solo para verificación. Es información privada.</span>
        </div>
      </>}

      {/* STEP 4 */}
      {step === 4 && <>
        <div style={{ textAlign:"center", padding:"20px 0 10px" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
          <h2 style={{ fontSize:22, fontWeight:800, color:N, marginBottom:8 }}>¡Perfil creado!</h2>
          <p style={{ fontSize:14, color:G5, lineHeight:1.6 }}>Tu perfil entrará en revisión y estará visible en 24–48 horas.</p>
        </div>
        <div style={S.sumc}>
          <div style={S.sr}><span style={{ fontSize:13, color:G5 }}>Estado</span><span style={S.vb("pend")}>⏳ En revisión</span></div>
          <div style={S.sr}><span style={{ fontSize:13, color:G5 }}>Verificación</span><span style={anyPhoto ? S.vb("pend") : S.vb("no")}>{anyPhoto ? "⏳ En revisión" : "Sin verificar"}</span></div>
          <div style={{ ...S.sr, borderBottom:"none" }}><span style={{ fontSize:13, color:G5 }}>Visible en</span><span style={{ fontSize:13, fontWeight:700, color:N }}>24–48 horas</span></div>
        </div>
        <InfoBox icon="📱" text="Los clientes te contactarán por WhatsApp. Mantén notificaciones activas." />
      </>}

    </div>
  </div>
  <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"white", padding:"14px 20px 28px", borderTop:`1px solid #EDF2F7` }}>
    <button style={S.bt} onClick={goNext}>{step === 4 ? "Ir a la app →" : "Continuar →"}</button>
  </div>
</div>
```

);
}

// HOME
function HomeScreen({ professionals, onNav, onCat, selectedCity, onPickCity, onFab }) {
const [cityOpen, setCityOpen] = useState(false);

return (
<div style={S.screen}>
<div style={S.nav}>
<Logo onClick={() => onNav(“home”)} />
<div style={{ display:“flex”, gap:10, alignItems:“center” }}>
<button onClick={() => onNav(“explore”)} style={{ background:“none”, border:“none”, cursor:“pointer”, padding:8, borderRadius:10, color:”#4A5568”, display:“flex” }}>
<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
</button>
<button onClick={() => onNav(“profile”)} style={{ background:T, color:“white”, border:“none”, padding:“8px 16px”, borderRadius:40, fontFamily:“inherit”, fontSize:13, fontWeight:700, cursor:“pointer” }}>Mi perfil</button>
</div>
</div>

```
  <div style={{ flex:1, overflowY:"auto", paddingBottom:80 }}>
    {/* Hero */}
    <div style={S.hero}>
      <p style={{ fontSize:13, color:"rgba(255,255,255,.55)", marginBottom:4 }}>👋 ¿Qué necesitas hoy?</p>
      <h1 style={S.heroTitle}>Servicios a domicilio <em style={S.heroEm}>confiables</em> en Cuba</h1>
      <div style={S.sb}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" placeholder="¿Qué servicio buscas?" readOnly onClick={() => onNav("explore")} style={{ flex:1, border:"none", outline:"none", fontFamily:"inherit", fontSize:14, cursor:"pointer", background:"transparent" }} />
        <div style={S.sbBtn} onClick={() => onNav("explore")}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>

    {/* City selector */}
    <div style={S.cityBar} id="city-bar">
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={T} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <button style={S.cityBtn} onClick={(e) => { e.stopPropagation(); setCityOpen(o => !o); }}>
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
        <span>{selectedCity ? `${CITIES.find(c=>c[0]===selectedCity)?.[1]} ${selectedCity}` : "Elige tu ciudad"}</span>
      </button>
      {cityOpen && (
        <div style={S.cityDd}>
          <div style={{ padding:"11px 16px", fontSize:11, fontWeight:700, color:G5, textTransform:"uppercase", letterSpacing:.5, borderBottom:`1px solid #F0F4F8`, position:"sticky", top:0, background:"white" }}>📍 Ciudades de Cuba</div>
          {CITIES.map(([city, emoji]) => (
            <div key={city} style={S.cityOpt} onClick={() => { onPickCity(city); setCityOpen(false); }}>
              <span>{emoji}</span>{city}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Promo */}
    <div style={S.pb}>
      <div><div style={{ fontSize:16, fontWeight:800, color:"white" }}>¡Gratis para todos!</div><div style={{ fontSize:12, color:"rgba(255,255,255,.8)", marginTop:3 }}>Sin comisiones ni suscripciones</div></div>
      <div style={{ fontSize:40, position:"relative", zIndex:1 }}>🎉</div>
    </div>

    {/* Categories */}
    <div style={{ padding:"22px 20px 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <h2 style={{ fontSize:16, fontWeight:800, color:N }}>Servicios</h2>
        <button style={{ fontSize:13, color:T, fontWeight:600, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }} onClick={() => onNav("explore")}>Ver todos</button>
      </div>
      <div style={S.cg}>
        {[["limpieza","🧹","Limpieza del hogar","#E0F7F4"],["cuidado","💊","Cuidado de personas","#FFF0E3"],["belleza","💅","Belleza y estética","#F3E8FF"]].map(([cat,icon,name,bg]) => (
          <div key={cat} style={S.cc} onClick={() => onCat(cat)}>
            <div style={{ ...S.ci, background:bg }}>{icon}</div>
            <span style={{ fontSize:11, fontWeight:700, color:N, textAlign:"center" }}>{name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Pros */}
    <div style={{ padding:"22px 20px 0" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <h2 style={{ fontSize:16, fontWeight:800, color:N }}>Profesionales</h2>
        <button style={{ fontSize:13, color:T, fontWeight:600, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }} onClick={() => onNav("explore")}>Ver todos</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {(selectedCity ? professionals.filter(p => p.city === selectedCity) : professionals).length === 0
          ? <EmptyState withBtn={false} />
          : (selectedCity ? professionals.filter(p => p.city === selectedCity) : professionals).slice(0,4).map((p,i) => (
              <ProCard key={i} pro={p} onClick={() => onNav("detail", p)} />
            ))
        }
      </div>
    </div>

    {/* Be a pro CTA */}
    <div style={{ padding:20 }}>
      <div style={{ background:`linear-gradient(135deg,${N},${N2})`, borderRadius:16, padding:"22px 20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-16, top:-16, width:90, height:90, background:T, borderRadius:"50%", opacity:.07 }} />
        <p style={{ fontSize:13, color:"rgba(255,255,255,.45)", marginBottom:6 }}>¿Eres profesional?</p>
        <h3 style={{ fontSize:17, fontWeight:800, color:"white", marginBottom:6 }}>Publica tus servicios gratis</h3>
        <p style={{ fontSize:12, color:"rgba(255,255,255,.5)", marginBottom:18, lineHeight:1.5 }}>Sin comisiones. Empieza hoy.</p>
        <button style={{ ...S.bt, maxWidth:240 }} onClick={() => onNav("regpro")}>Registrarme como profesional</button>
      </div>
    </div>
  </div>

  <BottomNav current="home" onChange={onNav} />
  <button style={S.fab} onClick={onFab}>
    <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
  </button>
</div>
```

);
}

// EXPLORE
function ExploreScreen({ professionals, onNav, onDetail, onFab }) {
const [filter, setFilter] = useState(“todos”);
const [q, setQ] = useState(””);
const filtered = professionals.filter(p => {
const mc = filter === “todos” || p.category === filter;
const mq = !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.role.toLowerCase().includes(q.toLowerCase());
return mc && mq;
});
return (
<div style={S.screen}>
<div style={S.nav}><Logo onClick={() => onNav(“home”)} /></div>
<div style={{ background:“white”, padding:“14px 20px”, borderBottom:`1px solid #EDF2F7` }}>
<div style={{ background:G1, borderRadius:12, display:“flex”, alignItems:“center”, padding:“0 14px”, gap:10, height:46 }}>
<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
<input type=“text” value={q} onChange={e => setQ(e.target.value)} placeholder=“Buscar profesional o servicio…” style={{ flex:1, border:“none”, outline:“none”, fontFamily:“inherit”, fontSize:14, background:“transparent” }} />
</div>
</div>
<div style={{ …S.fc, scrollbarWidth:“none” }}>
{[[“todos”,“Todos”],[“limpieza”,“🧹 Limpieza”],[“cuidado”,“💊 Cuidado”],[“belleza”,“💅 Belleza”]].map(([id,label]) => (
<button key={id} style={S.ch(filter===id)} onClick={() => setFilter(id)}>{label}</button>
))}
</div>
<div style={{ flex:1, overflowY:“auto”, paddingBottom:80 }}>
<div style={{ padding:“16px 20px”, display:“flex”, flexDirection:“column”, gap:12 }}>
{filtered.length === 0
? <EmptyState withBtn onRegPro={() => onNav(“regpro”)} />
: filtered.map((p,i) => <ProCard key={i} pro={p} onClick={() => onDetail(p)} />)
}
</div>
</div>
<BottomNav current="explore" onChange={onNav} />
<button style={S.fab} onClick={onFab}>
<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
</button>
</div>
);
}

// DETAIL
function DetailScreen({ pro, onBack, onBook, onNav }) {
const openWA = () => {
if (!pro.whatsapp) return;
const num = pro.whatsapp.replace(/\D/g,””);
const msg = encodeURIComponent(`Hola ${pro.name}, vi tu perfil en CasaYa. Me interesa tu servicio de ${pro.role}. ¿Tienes disponibilidad?`);
window.open(`https://wa.me/${num}?text=${msg}`, “_blank”);
};
return (
<div style={S.screen}>
<div style={{ flex:1, overflowY:“auto”, paddingBottom:90 }}>
<div style={S.dh}>
<BackW onClick={onBack} />
<div style={{ display:“flex”, gap:16, alignItems:“flex-start”, marginTop:16 }}>
<div style={{ …S.da, background: CAT_BG[pro.category]||”#E0F7F4” }}>
{pro.avatar ? <img src={pro.avatar} alt=”” style={{ width:“100%”, height:“100%”, objectFit:“cover” }} /> : <span style={{ fontSize:40 }}>{CAT_EMOJI[pro.category]||“👤”}</span>}
</div>
<div style={{ flex:1 }}>
<div style={{ fontSize:20, fontWeight:800, color:“white” }}>{pro.name}</div>
<div style={{ fontSize:13, color:“rgba(255,255,255,.55)”, marginTop:3 }}>{pro.role}</div>
<div style={{ marginTop:8 }}>
<span style={pro.verified ? S.vb(“ok”) : S.vb(“no”)}>{pro.verified ? “✓ Verificado” : “Sin verificar”}</span>
</div>
<div style={{ display:“flex”, gap:20, marginTop:12 }}>
<div><div style={{ fontSize:16, fontWeight:800, color:“white” }}>—</div><div style={{ fontSize:10, color:“rgba(255,255,255,.45)”, marginTop:2 }}>Valoración</div></div>
<div><div style={{ fontSize:16, fontWeight:800, color:“white” }}>0</div><div style={{ fontSize:10, color:“rgba(255,255,255,.45)”, marginTop:2 }}>Reseñas</div></div>
</div>
</div>
</div>
</div>
<div style={{ padding:20, display:“flex”, flexDirection:“column”, gap:20 }}>
<div>
<div style={{ fontSize:14, fontWeight:800, marginBottom:12, color:N }}>📍 Zona de trabajo</div>
<p style={{ fontSize:14, color:G5 }}>{pro.city}{pro.zones ? ` · ${pro.zones}` : “”}</p>
</div>
{pro.bio && <div>
<div style={{ fontSize:14, fontWeight:800, marginBottom:12, color:N }}>Sobre mí</div>
<p style={{ fontSize:14, color:G5, lineHeight:1.6 }}>{pro.bio}</p>
</div>}
{pro.services?.length > 0 && <div>
<div style={{ fontSize:14, fontWeight:800, marginBottom:12, color:N }}>Servicios y precios</div>
<div style={{ display:“grid”, gridTemplateColumns:“1fr 1fr”, gap:10 }}>
{pro.services.map((sv,i) => (
<div key={i} style={S.si}>
<div style={{ fontSize:13, fontWeight:700, color:N }}>{sv.name}</div>
<div style={{ fontSize:14, fontWeight:800, color:T, marginTop:4 }}>{sv.price} CUP</div>
<div style={{ fontSize:11, color:G5, marginTop:2 }}>{sv.duration}</div>
</div>
))}
</div>
</div>}
<InfoBox icon="💬" text="Escríbele por WhatsApp para coordinar antes de reservar." />
</div>
</div>
<div style={S.cta}>
<button onClick={openWA} style={{ background:“none”, border:`1.5px solid #25D366`, borderRadius:14, padding:“13px 16px”, display:“flex”, alignItems:“center”, gap:8, cursor:“pointer”, fontFamily:“inherit”, fontSize:14, fontWeight:700, color:”#25D366” }}>
<svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
WhatsApp
</button>
<button style={{ …S.bt, flex:1 }} onClick={onBook}>Reservar →</button>
</div>
</div>
);
}

// BOOKING
function BookingScreen({ pro, onBack, onConfirm }) {
const today = new Date();
const dates = Array.from({length:7}, (_,i) => {
const d = new Date(today); d.setDate(today.getDate()+i+1);
return { label:`${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`, day:DAYS[d.getDay()], num:d.getDate() };
});
const [selDate, setSelDate] = useState(dates[0].label);
const [selTime, setSelTime] = useState(TIMES[0]);
const [selSvc, setSelSvc] = useState(pro.services?.[0]?.name || “”);
const selSvcObj = pro.services?.find(s => s.name === selSvc);

return (
<div style={S.screen}>
<div style={{ background:“white”, padding:“16px 20px”, borderBottom:`1px solid #EDF2F7`, display:“flex”, alignItems:“center”, gap:12, position:“sticky”, top:0, zIndex:10 }}>
<BackD onClick={onBack} />
<h2 style={{ fontSize:17, fontWeight:800, color:N }}>Reservar servicio</h2>
</div>
<div style={{ flex:1, overflowY:“auto”, paddingBottom:100 }}>
<div style={{ padding:“20px”, display:“flex”, flexDirection:“column”, gap:18 }}>
{pro.services?.length > 0 && <div style={S.fg}>
<label style={S.fl}>Servicio</label>
{pro.services.map(sv => (
<div key={sv.name} style={S.ck(selSvc===sv.name)} onClick={() => setSelSvc(sv.name)}>
<div style={S.ckb(selSvc===sv.name)}>
{selSvc===sv.name && <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
</div>
<span style={{ fontSize:14, fontWeight:600, flex:1, color:N }}>{sv.name}<br/><small style={{ color:G3, fontWeight:400 }}>{sv.duration}</small></span>
<span style={{ fontSize:13, fontWeight:700, color:T }}>{sv.price} CUP</span>
</div>
))}
</div>}

```
      <div style={S.fg}>
        <label style={S.fl}>Fecha</label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
          {dates.map(d => (
            <button key={d.label} style={S.db2(selDate===d.label)} onClick={() => setSelDate(d.label)}>
              <div style={{ fontSize:10, fontWeight:600, color: selDate===d.label ? "white" : G5 }}>{d.day}</div>
              <div style={{ fontSize:16, fontWeight:800, color: selDate===d.label ? "white" : N }}>{d.num}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={S.fg}>
        <label style={S.fl}>Hora</label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {TIMES.map(t => <button key={t} style={S.tb(selTime===t)} onClick={() => setSelTime(t)}>{t}</button>)}
        </div>
      </div>

      <div style={S.fg}><label style={S.fl}>Tu dirección</label><input style={S.fi} type="text" placeholder="Calle, número, municipio" /></div>
      <div style={S.fg}><label style={S.fl}>Notas (opcional)</label><textarea style={{ ...S.fi, resize:"none" }} rows={3} placeholder="Ej: traer materiales, tengo mascota..." /></div>

      <div style={S.fg}>
        <label style={S.fl}>Resumen</label>
        <div style={S.sumc}>
          {[["Profesional", pro.name],["Servicio", selSvc||"—"],["Fecha y hora",`${selDate} · ${selTime}`]].map(([k,v]) => (
            <div key={k} style={S.sr}><span style={{ fontSize:13, color:G5, fontWeight:500 }}>{k}</span><span style={{ fontSize:13, fontWeight:700, color:N }}>{v}</span></div>
          ))}
          <div style={{ ...S.sr, borderBottom:"none" }}>
            <span style={{ fontSize:14, fontWeight:800, color:N }}>Total</span>
            <span style={{ fontSize:16, fontWeight:800, color:T }}>{selSvcObj ? `${selSvcObj.price} CUP` : "Acordar"}</span>
          </div>
        </div>
      </div>
      <InfoBox icon="💵" text="Pago en efectivo al profesional el día del servicio. Sin comisiones." />
    </div>
  </div>
  <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"white", padding:"14px 20px 24px", borderTop:`1px solid #EDF2F7` }}>
    <button style={S.bt} onClick={() => onConfirm({ pro, svc:selSvc, date:selDate, time:selTime })}>Confirmar reserva</button>
  </div>
</div>
```

);
}

// BOOKINGS LIST
function BookingsScreen({ bookings, onNav }) {
return (
<div style={S.screen}>
<div style={S.nav}><Logo onClick={() => onNav(“home”)} /></div>
<div style={{ flex:1, overflowY:“auto”, paddingBottom:80 }}>
<div style={{ padding:20 }}>
<h2 style={{ fontSize:18, fontWeight:800, color:N, marginBottom:16 }}>Mis reservas</h2>
{bookings.length === 0 ? (
<div style={{ background:“white”, borderRadius:16, boxShadow:“0 4px 20px rgba(0,0,0,.07)”, display:“flex”, flexDirection:“column”, alignItems:“center”, padding:“40px 24px”, textAlign:“center”, gap:12 }}>
<div style={{ fontSize:48 }}>📅</div>
<div style={{ fontSize:16, fontWeight:800, color:N }}>Sin reservas aún</div>
<div style={{ fontSize:13, color:G5, lineHeight:1.6, maxWidth:260 }}>Cuando reserves aparecerá aquí</div>
<button style={{ …S.bt, maxWidth:200, marginTop:10 }} onClick={() => onNav(“explore”)}>Explorar servicios</button>
</div>
) : bookings.map((b,i) => (
<div key={i} style={{ background:“white”, borderRadius:16, boxShadow:“0 4px 20px rgba(0,0,0,.07)”, overflow:“hidden”, marginBottom:14 }}>
<div style={{ background:TL, padding:“10px 16px”, fontSize:11, fontWeight:700, color:TD, textTransform:“uppercase”, letterSpacing:.5 }}>Confirmada</div>
<div style={{ padding:16, display:“flex”, gap:14, alignItems:“center” }}>
<div style={{ width:52, height:52, borderRadius:14, background:CAT_BG[b.pro.category], display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:26 }}>{CAT_EMOJI[b.pro.category]}</div>
<div style={{ flex:1 }}>
<div style={{ fontSize:15, fontWeight:700 }}>{b.svc}</div>
<div style={{ fontSize:12, color:G5, marginTop:2 }}>{b.pro.name}</div>
<div style={{ fontSize:12, fontWeight:600, color:T, marginTop:6 }}>{b.date} · {b.time}</div>
</div>
</div>
</div>
))}
</div>
</div>
<BottomNav current="bookings" onChange={onNav} />
</div>
);
}

// SUCCESS
function SuccessScreen({ booking, onHome }) {
return (
<div style={{ …S.screen, background:G1 }}>
<div style={{ flex:1, overflowY:“auto” }}>
<div style={{ display:“flex”, flexDirection:“column”, alignItems:“center”, justifyContent:“center”, padding:“40px 24px”, textAlign:“center”, minHeight:“80vh” }}>
<div style={S.succi}>
<svg width="52" height="52" fill="none" viewBox="0 0 24 24" stroke={T} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
</div>
<h2 style={{ fontSize:24, fontWeight:800, color:N, marginBottom:10 }}>¡Reserva enviada!</h2>
<p style={{ fontSize:14, color:G5, lineHeight:1.6, maxWidth:280, margin:“0 auto 28px” }}>El profesional te contactará por WhatsApp para confirmar los detalles.</p>
<div style={{ …S.sumc, width:“100%”, maxWidth:340, marginBottom:28, textAlign:“left” }}>
{[[“Profesional”,booking.pro.name],[“Servicio”,booking.svc],[“Fecha”,`${booking.date} · ${booking.time}`],[“Pago”,“Efectivo al profesional”]].map(([k,v]) => (
<div key={k} style={{ …S.sr, borderBottom:`1px solid #F0F4F8` }}>
<span style={{ fontSize:12, color:G5 }}>{k}</span>
<span style={{ fontSize:12, fontWeight:700, color:N }}>{v}</span>
</div>
))}
</div>
<button style={{ …S.bt, maxWidth:320 }} onClick={onHome}>Volver al inicio</button>
</div>
</div>
</div>
);
}

// PROFILE
function ProfileScreen({ selectedCity, onNav }) {
return (
<div style={S.screen}>
<div style={S.nav}><Logo onClick={() => onNav(“home”)} /></div>
<div style={{ flex:1, overflowY:“auto”, paddingBottom:80 }}>
<div style={S.ph}>
<div style={{ width:80, height:80, borderRadius:“50%”, background:T, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:36, border:“3px solid rgba(255,255,255,.2)” }}>👤</div>
<div>
<div style={{ fontSize:20, fontWeight:800, color:“white” }}>Mi perfil</div>
<div style={{ fontSize:13, color:“rgba(255,255,255,.5)” }}>📍 {selectedCity || “Ciudad no seleccionada”}</div>
</div>
</div>
<div style={{ padding:20 }}>
<div style={S.pmenu}>
<div style={S.mi} onClick={() => onNav(“bookings”)}>
<div style={{ …S.mic, background:”#E0F7F4” }}>📋</div>
<div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:600, color:N }}>Mis reservas</div><div style={{ fontSize:12, color:G5, marginTop:2 }}>Historial de servicios</div></div>
<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={G3} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
</div>
<div style={{ …S.mi, borderBottom:“none” }} onClick={() => onNav(“regpro”)}>
<div style={{ …S.mic, background:”#F3E8FF” }}>💼</div>
<div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:600, color:N }}>Ofrecer servicios</div><div style={{ fontSize:12, color:G5, marginTop:2 }}>Regístrate como profesional</div></div>
<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={G3} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
</div>
</div>
<div style={S.pmenu}>
<div style={S.mi}><div style={{ …S.mic, background:”#FFF0E3” }}>⚙️</div><div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:600, color:N }}>Configuración</div></div></div>
<div style={{ …S.mi, borderBottom:“none” }}><div style={{ …S.mic, background:”#E0F7F4” }}>❓</div><div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:600, color:N }}>Ayuda y soporte</div></div></div>
</div>
<div style={{ textAlign:“center”, padding:“10px 0” }}>
<span style={{ fontSize:11, color:G3 }}>CasaYa v1.0 · Hecho con ❤️ para Cuba</span>
</div>
</div>
</div>
<BottomNav current="profile" onChange={onNav} />
</div>
);
}

// REQUEST MODAL
function RequestModal({ onClose }) {
const [step, setStep] = useState(1);
const [cat, setCat] = useState(””);
const catNames = { limpieza:“Limpieza del hogar”, cuidado:“Cuidado de personas”, belleza:“Belleza y estética” };
const submit = () => {
const city = document.getElementById(“req-city-sel”)?.value;
const wa   = document.getElementById(“req-wa-inp”)?.value;
if (!city || !wa) { alert(“Por favor completa la ciudad y tu WhatsApp.”); return; }
onClose();
alert(“✅ Solicitud publicada. Los profesionales te contactarán por WhatsApp.”);
};
return (
<div style={S.mo} onClick={onClose}>
<div style={S.ms} onClick={e => e.stopPropagation()}>
<div style={{ width:40, height:4, background:”#E2E8F0”, borderRadius:4, margin:“14px auto 20px” }} />
<div style={{ fontSize:18, fontWeight:800, color:N, padding:“0 20px 16px”, borderBottom:`1px solid #F0F4F8` }}>¿Qué servicio necesitas?</div>
<div style={{ padding:20, display:“flex”, flexDirection:“column”, gap:14 }}>
{step === 1 ? <>
<p style={{ fontSize:13, color:G5 }}>Los profesionales disponibles te contactarán por WhatsApp.</p>
{[[“limpieza”,“🧹”,“Limpieza del hogar”,“Limpieza estándar, profunda, organización”,”#E0F7F4”],
[“cuidado”,“💊”,“Cuidado de personas”,“Adultos mayores, acompañamiento”,”#FFF0E3”],
[“belleza”,“💅”,“Belleza y estética”,“Peluquería, manicura, pedicura”,”#F3E8FF”]
].map(([id,ic,name,sub,bg]) => (
<div key={id} style={{ background:G1, borderRadius:14, padding:16, display:“flex”, alignItems:“center”, gap:14, cursor:“pointer”, border:`2px solid transparent` }}
onClick={() => { setCat(id); setStep(2); }}>
<div style={{ width:48, height:48, borderRadius:14, background:bg, display:“flex”, alignItems:“center”, justifyContent:“center”, fontSize:24 }}>{ic}</div>
<div><div style={{ fontSize:15, fontWeight:700, color:N }}>{name}</div><div style={{ fontSize:12, color:G5, marginTop:2 }}>{sub}</div></div>
</div>
))}
</> : <>
<div style={{ display:“flex”, alignItems:“center”, gap:10 }}>
<button onClick={() => setStep(1)} style={{ background:“none”, border:“none”, cursor:“pointer”, color:T, fontSize:13, fontWeight:700, fontFamily:“inherit” }}>← Volver</button>
<span style={{ fontSize:15, fontWeight:800, color:N }}>{catNames[cat]}</span>
</div>
<div style={S.fg}><label style={S.fl}>¿Qué necesitas exactamente?</label><textarea style={{ …S.fi, resize:“none” }} rows={3} placeholder=“Describe tu necesidad…” /></div>
<div style={S.fg}><label style={S.fl}>Tu ciudad</label>
<select id="req-city-sel" style={S.fsel}><option value="">— Selecciona —</option>{CITIES.map(([c])=><option key={c}>{c}</option>)}</select>
</div>
<div style={S.fg}><label style={S.fl}>Tu WhatsApp</label><input id="req-wa-inp" style={S.fi} type="tel" placeholder="+53 5 XXX XXXX" /></div>
<button style={S.bt} onClick={submit}>Publicar solicitud →</button>
<p style={{ fontSize:11, color:G5, textAlign:“center” }}>Los profesionales te contactarán por WhatsApp</p>
</>}
</div>
</div>
</div>
);
}

// RATING POPUP
function RatingPopup({ onClose }) {
const [stars, setStars] = useState(0);
const submit = () => {
onClose();
setTimeout(() => alert(“⭐”.repeat(stars) + “ ¡Gracias! Tu opinión nos ayuda a mejorar CasaYa.”), 300);
};
return (
<div style={S.ro}>
<div style={S.rc2}>
<div style={{ fontSize:52, marginBottom:12 }}>⭐</div>
<h3 style={{ fontSize:20, fontWeight:800, color:N, marginBottom:6 }}>¿Qué tal CasaYa?</h3>
<p style={{ fontSize:13, color:G5, marginBottom:4, lineHeight:1.5 }}>Llevas 1 minuto usando la app. Tu opinión nos ayuda a mejorar.</p>
<div style={{ display:“flex”, justifyContent:“center”, gap:8, margin:“16px 0” }}>
{[1,2,3,4,5].map(n => (
<button key={n} onClick={() => setStars(n)} style={{ fontSize:36, cursor:“pointer”, opacity: n<=stars ? 1 : .3, background:“none”, border:“none”, transition:“opacity .15s” }}>★</button>
))}
</div>
<textarea style={{ …S.fi, resize:“none”, marginBottom:14 }} rows={3} placeholder=”¿Qué podríamos mejorar?” />
<button style={{ …S.bt, opacity: stars ? 1 : .4, pointerEvents: stars ? “auto” : “none” }} onClick={submit}>Enviar valoración</button>
<button onClick={onClose} style={{ width:“100%”, marginTop:8, background:“none”, border:“none”, cursor:“pointer”, fontFamily:“inherit”, fontSize:14, color:G5, padding:8 }}>Ahora no</button>
</div>
</div>
);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
const [screen, setScreen]         = useState(“tutorial”);
const [professionals]             = useState([]);
const [selectedCity, setCity]     = useState(””);
const [currentPro, setPro]        = useState(null);
const [bookings, setBookings]     = useState([]);
const [showModal, setShowModal]   = useState(false);
const [showRating, setShowRating] = useState(false);
const timerRef = useRef(null);

const startApp = () => {
setScreen(“home”);
timerRef.current = setTimeout(() => setShowRating(true), 60000);
};

useEffect(() => () => clearTimeout(timerRef.current), []);

const nav = (dest, pro = null) => {
if (dest === “detail” && pro) { setPro(pro); setScreen(“detail”); return; }
if (dest === “regpro”) { setScreen(“regpro”); return; }
setScreen(dest);
};

const handleConfirm = (booking) => {
setBookings(b => […b, booking]);
setScreen(“success”);
};

return (
<div style={S.app} onClick={() => {}}>
{screen === “tutorial”  && <TutorialScreen onDone={() => setScreen(“onboarding”)} />}
{screen === “onboarding”&& <OnboardingScreen onClient={() => setScreen(“regclient”)} onPro={() => setScreen(“regpro”)} />}
{screen === “regclient” && <RegClientScreen onBack={() => setScreen(“onboarding”)} onDone={startApp} />}
{screen === “regpro”    && <RegProScreen onBack={() => setScreen(“onboarding”)} onDone={startApp} />}
{screen === “home”      && <HomeScreen professionals={professionals} onNav={nav} onCat={cat => { setScreen(“explore”); }} selectedCity={selectedCity} onPickCity={setCity} onFab={() => setShowModal(true)} />}
{screen === “explore”   && <ExploreScreen professionals={professionals} onNav={nav} onDetail={pro => { setPro(pro); setScreen(“detail”); }} onFab={() => setShowModal(true)} />}
{screen === “detail”    && currentPro && <DetailScreen pro={currentPro} onBack={() => setScreen(“explore”)} onBook={() => setScreen(“booking”)} onNav={nav} />}
{screen === “booking”   && currentPro && <BookingScreen pro={currentPro} onBack={() => setScreen(“detail”)} onConfirm={handleConfirm} />}
{screen === “bookings”  && <BookingsScreen bookings={bookings} onNav={nav} />}
{screen === “success”   && bookings.length > 0 && <SuccessScreen booking={bookings[bookings.length-1]} onHome={() => setScreen(“home”)} />}
{screen === “profile”   && <ProfileScreen selectedCity={selectedCity} onNav={nav} />}

```
  {showModal  && <RequestModal onClose={() => setShowModal(false)} />}
  {showRating && <RatingPopup onClose={() => setShowRating(false)} />}
</div>
```

);
}
