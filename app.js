/* ====== DATA ====== */
const SECTIONS = [
  {
    id: 'pt', tag: 'PT', title: 'Présentation & Tenue', color: '#6247AA',
    criteria: ['Tenue conforme aux standards', 'Chaussures adaptées et propres', 'Badge visible et en bon état', 'Hygiène et présentation', 'Posture professionnelle']
  },
  {
    id: 'cs', tag: 'CS', title: 'Comportement & Sens du service', color: '#1B8A5A',
    criteria: ['Accueil chaleureux', 'Proactivité et anticipation', 'Gestion des demandes', 'Politesse et courtoisie', 'Pas de téléphone personnel', "Esprit d'équipe"]
  },
  {
    id: 'cf', tag: 'CF', title: 'Connaissances & Formation', color: '#2980B9',
    criteria: ['Procédures du site', 'Maîtrise des outils', 'Consignes de sécurité', 'Quizz de formation', 'Cahier de consignes']
  },
  {
    id: 'qp', tag: 'QP', title: 'Qualité des prestations', color: '#C67D20',
    criteria: ['Respect des horaires', "Qualité d'exécution", 'Propreté du poste', 'Gestion des flux', 'Reporting à jour']
  },
  {
    id: 'va', tag: 'VA', title: 'Valeur ajoutée', color: '#A93246',
    criteria: ["Propositions d'amélioration", 'Initiative positive', 'Satisfaction client', 'Implication sur site']
  }
];

const CONTROL_TYPES = ['Visite hebdomadaire', 'Contrôle contradictoire', 'Contrôle mystère', 'Audit qualité annuel'];
const METIERS = ['Accueil / Hôte(sse)', 'Agent Courrier', 'Factotum / Agent polyvalent', 'Hospitality Manager', 'Agent Property Manager', 'Agent Numérisation', 'Agent Reprographie'];

/* ====== STATE ====== */
let ratings = {};
let comments = {};
let photos = [];
let currentUser = null;

/* ====== INIT ====== */
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('pq_user');
  if (saved) {
    currentUser = JSON.parse(saved);
    document.getElementById('login-name').value = currentUser.name;
    document.getElementById('login-email').value = currentUser.email;
  }
  buildForm();
  updateProgress();
  updateChips();
  loadHistory();
});

/* ====== LOGIN ====== */
function doLogin() {
  const name = document.getElementById('login-name').value.trim();
  const email = document.getElementById('login-email').value.trim();
  const err = document.getElementById('login-error');

  if (!name || !email || !email.includes('@')) {
    err.textContent = 'Veuillez remplir tous les champs (email valide requis).';
    err.style.display = 'block';
    return;
  }

  currentUser = { name, email };
  localStorage.setItem('pq_user', JSON.stringify(currentUser));
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
}

function doLogout() {
  document.getElementById('app-screen').classList.add('hidden');
  document.getElementById('history-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
}

/* ====== BUILD FORM ====== */
function buildForm() {
  // Populate selects
  const typeSelect = document.getElementById('field-type');
  CONTROL_TYPES.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; typeSelect.appendChild(o); });

  const metierSelect = document.getElementById('field-metier');
  METIERS.forEach(m => { const o = document.createElement('option'); o.value = m; o.textContent = m; metierSelect.appendChild(o); });

  // Set today's date
  document.getElementById('field-date').valueAsDate = new Date();

  // Build sections
  const container = document.getElementById('sections-container');
  SECTIONS.forEach((sec, si) => {
    const card = document.createElement('div');
    card.className = 'section-card' + (si === 0 ? ' open' : '');
    card.innerHTML = `
      <div class="section-header" onclick="toggleSection(this)">
        <span class="section-tag" style="background:${sec.color}">${sec.tag}</span>
        <span class="section-title">${sec.title}</span>
        <span class="section-badge" id="badge-${sec.id}">0/${sec.criteria.length}</span>
        <span class="section-chevron">▾</span>
      </div>
      <div class="section-body">
        ${sec.criteria.map((c, ci) => {
          const key = `${sec.id}_${ci}`;
          return `
          <div class="criterion">
            <div class="criterion-label">${c}</div>
            <div class="rating-buttons">
              <button class="rating-btn conforme" onclick="rate('${key}','conforme',this)">Conforme</button>
              <button class="rating-btn ameliorer" onclick="rate('${key}','ameliorer',this)">À améliorer</button>
              <button class="rating-btn non-conforme" onclick="rate('${key}','non-conforme',this)">Non conforme</button>
              <button class="rating-btn na" onclick="rate('${key}','na',this)">N/A</button>
            </div>
          </div>`;
        }).join('')}
        <div class="comment-area">
          <textarea placeholder="Commentaire pour ${sec.title}..." id="comment-${sec.id}" oninput="comments['${sec.id}']=this.value"></textarea>
          <button class="mic-btn" onclick="startDictation('comment-${sec.id}', this)" title="Dictée vocale">🎤</button>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

/* ====== SECTIONS ====== */
function toggleSection(header) {
  header.parentElement.classList.toggle('open');
}

/* ====== RATING ====== */
function rate(key, value, btn) {
  ratings[key] = value;
  const btns = btn.parentElement.querySelectorAll('.rating-btn');
  btns.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  updateProgress();
  updateChips();
  updateBadges();
}

function updateBadges() {
  SECTIONS.forEach(sec => {
    let filled = 0;
    sec.criteria.forEach((_, ci) => { if (ratings[`${sec.id}_${ci}`]) filled++; });
    document.getElementById(`badge-${sec.id}`).textContent = `${filled}/${sec.criteria.length}`;
  });
}

/* ====== PROGRESS ====== */
function updateProgress() {
  const total = SECTIONS.reduce((s, sec) => s + sec.criteria.length, 0);
  const filled = Object.keys(ratings).length;
  document.getElementById('progress-fill').style.width = `${(filled / total) * 100}%`;
}

/* ====== CHIPS ====== */
function updateChips() {
  let conf = 0, amel = 0, nc = 0, na = 0;
  Object.values(ratings).forEach(v => {
    if (v === 'conforme') conf++;
    else if (v === 'ameliorer') amel++;
    else if (v === 'non-conforme') nc++;
    else if (v === 'na') na++;
  });
  document.getElementById('chips').innerHTML =
    (conf ? `<span class="chip chip-green">${conf} Conforme${conf > 1 ? 's' : ''}</span>` : '') +
    (amel ? `<span class="chip chip-orange">${amel} À améliorer</span>` : '') +
    (nc ? `<span class="chip chip-red">${nc} Non conforme${nc > 1 ? 's' : ''}</span>` : '') +
    (na ? `<span class="chip chip-gray">${na} N/A</span>` : '');
}

/* ====== PHOTOS ====== */
function handlePhotos(input) {
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      photos.push(e.target.result);
      renderPhotos();
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function renderPhotos() {
  const grid = document.getElementById('photo-grid');
  grid.innerHTML = photos.map((p, i) => `
    <div class="photo-wrapper">
      <img src="${p}" class="photo-thumb" alt="Photo ${i + 1}">
      <button class="photo-remove" onclick="removePhoto(${i})">×</button>
    </div>`).join('');
}

function removePhoto(i) {
  photos.splice(i, 1);
  renderPhotos();
}

/* ====== DICTATION ====== */
function startDictation(textareaId, btn) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { alert('Dictée vocale non supportée sur ce navigateur.'); return; }

  if (btn.classList.contains('recording')) { return; }
  btn.classList.add('recording');
  const recognition = new SpeechRecognition();
  recognition.lang = 'fr-FR';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = e => {
    const ta = document.getElementById(textareaId);
    ta.value += (ta.value ? ' ' : '') + e.results[0][0].transcript;
    if (textareaId.startsWith('comment-')) {
      const secId = textareaId.replace('comment-', '');
      comments[secId] = ta.value;
    }
  };
  recognition.onend = () => btn.classList.remove('recording');
  recognition.onerror = () => btn.classList.remove('recording');
  recognition.start();
}

/* ====== SCORING ====== */
function computeScore() {
  let conf = 0, total = 0;
  Object.values(ratings).forEach(v => {
    if (v !== 'na') {
      total++;
      if (v === 'conforme') conf++;
    }
  });
  if (total === 0) return { score: 0, level: 'N/A', color: '#B0ADB8' };
  const score = Math.round((conf / total) * 100);
  let level, color;
  if (score >= 80) { level = 'Excellent'; color = '#1B8A5A'; }
  else if (score >= 60) { level = 'Satisfaisant'; color = '#C67D20'; }
  else if (score >= 40) { level = 'À améliorer'; color = '#b36b00'; }
  else { level = 'Insuffisant'; color = '#A93246'; }
  return { score, level, color };
}

/* ====== VALIDATE ====== */
function validateAndGenerate() {
  const client = document.getElementById('field-client').value.trim();
  if (!client) { alert('Veuillez renseigner le Client / Site.'); return; }

  const filledCount = Object.keys(ratings).length;
  if (filledCount < 5) { alert('Veuillez évaluer au moins 5 critères.'); return; }

  const date = document.getElementById('field-date').value;
  const type = document.getElementById('field-type').value;
  const metier = document.getElementById('field-metier').value;
  const ressource = document.getElementById('field-ressource').value.trim();
  const actionPlan = document.getElementById('action-plan').value.trim();
  const { score, level, color } = computeScore();

  // Save to history
  saveHistory({ date, client, type, metier, agent: ressource, score, level, timestamp: Date.now() });

  // Generate report
  const reportHTML = generateReport({ client, date, type, metier, ressource, actionPlan, score, level, color });

  // Download report
  const blob = new Blob([reportHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PluriQuali_${client.replace(/[^a-zA-Z0-9]/g, '_')}_${date}.html`;
  a.click();
  URL.revokeObjectURL(url);

  // Open mailto
  const subject = encodeURIComponent(`[Pluri'Quali] ${type} - ${client} - ${date} (Score: ${score}%)`);
  const body = encodeURIComponent(
    `Bonjour,\n\nVeuillez trouver ci-joint le rapport de contrôle qualité :\n\n` +
    `Client : ${client}\nType : ${type}\nDate : ${date}\nScore : ${score}% — ${level}\n\n` +
    `Merci de joindre le fichier HTML téléchargé en pièce jointe.\n\nCordialement,\n${currentUser.name}`
  );
  window.location.href = `mailto:${currentUser.email}?subject=${subject}&body=${body}`;
}

/* ====== REPORT GENERATION ====== */
function generateReport(data) {
  let detailHTML = '';
  SECTIONS.forEach(sec => {
    let rows = '';
    sec.criteria.forEach((c, ci) => {
      const key = `${sec.id}_${ci}`;
      const val = ratings[key];
      let label = '—', bg = '#f5f5f5', fg = '#999';
      if (val === 'conforme') { label = 'Conforme'; bg = '#D4EFDF'; fg = '#1B8A5A'; }
      else if (val === 'ameliorer') { label = 'À améliorer'; bg = '#FCF0DB'; fg = '#C67D20'; }
      else if (val === 'non-conforme') { label = 'Non conforme'; bg = '#FADEE4'; fg = '#A93246'; }
      else if (val === 'na') { label = 'N/A'; bg = '#F2F1F4'; fg = '#B0ADB8'; }
      rows += `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee">${c}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center"><span style="background:${bg};color:${fg};padding:4px 10px;border-radius:6px;font-weight:600;font-size:13px">${label}</span></td></tr>`;
    });
    const comment = comments[sec.id] || '';
    detailHTML += `
      <div style="margin-bottom:20px">
        <h3 style="font-family:'Playfair Display',serif;font-size:16px;margin-bottom:8px;display:flex;align-items:center;gap:8px">
          <span style="background:${sec.color};color:#fff;padding:2px 8px;border-radius:6px;font-size:12px;font-family:'DM Sans',sans-serif">${sec.tag}</span>
          ${sec.title}
        </h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
        ${comment ? `<div style="margin-top:8px;padding:10px;background:#f9f8fc;border-radius:8px;font-size:13px;color:#555"><strong>Commentaire :</strong> ${comment}</div>` : ''}
      </div>`;
  });

  let photosHTML = '';
  if (photos.length) {
    photosHTML = '<div style="margin:20px 0"><h3 style="font-family:\'Playfair Display\',serif;font-size:16px;margin-bottom:10px">📷 Photos</h3><div style="display:flex;flex-wrap:wrap;gap:8px">';
    photos.forEach(p => { photosHTML += `<img src="${p}" style="width:120px;height:120px;object-fit:cover;border-radius:8px">`; });
    photosHTML += '</div></div>';
  }

  let conf = 0, amel = 0, nc = 0, na = 0;
  Object.values(ratings).forEach(v => {
    if (v === 'conforme') conf++;
    else if (v === 'ameliorer') amel++;
    else if (v === 'non-conforme') nc++;
    else if (v === 'na') na++;
  });

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rapport Pluri'Quali — ${data.client}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>body{font-family:'DM Sans',sans-serif;margin:0;padding:0;color:#2D2A33;background:#fff}
.header{background:#0D0B11;color:#CEC2F0;padding:20px 24px;font-family:'Playfair Display',serif;font-size:22px}
.container{max-width:700px;margin:0 auto;padding:24px}
.meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
.meta-item{background:#F6F4FB;padding:10px 14px;border-radius:8px;font-size:13px}
.meta-item strong{display:block;font-size:11px;color:#8A8494;text-transform:uppercase;margin-bottom:2px}
.score-box{text-align:center;padding:24px;margin-bottom:24px;border-radius:12px;background:#F6F4FB}
.score-num{font-size:48px;font-weight:800}
.score-level{font-size:18px;font-weight:700;margin-top:4px}
.chips{display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap}
.chip{padding:4px 12px;border-radius:16px;font-size:13px;font-weight:600}
.footer{text-align:center;margin-top:32px;padding:16px;font-size:12px;color:#8A8494;border-top:1px solid #DDD8E8}
</style></head><body>
<div class="header">Pluri'Quali — Rapport de contrôle</div>
<div class="container">
  <h2 style="font-family:'Playfair Display',serif;margin-bottom:16px">${data.client}</h2>
  <div class="meta-grid">
    <div class="meta-item"><strong>Contrôleur</strong>${currentUser.name}</div>
    <div class="meta-item"><strong>Date</strong>${data.date}</div>
    <div class="meta-item"><strong>Type</strong>${data.type}</div>
    <div class="meta-item"><strong>Métier</strong>${data.metier}</div>
    <div class="meta-item"><strong>Ressource</strong>${data.ressource || '—'}</div>
    <div class="meta-item"><strong>Email</strong>${currentUser.email}</div>
  </div>
  <div class="score-box">
    <div class="score-num" style="color:${data.color}">${data.score}%</div>
    <div class="score-level" style="color:${data.color}">${data.level}</div>
    <div class="chips">
      ${conf ? `<span class="chip" style="background:#D4EFDF;color:#1B8A5A">${conf} Conforme${conf > 1 ? 's' : ''}</span>` : ''}
      ${amel ? `<span class="chip" style="background:#FCF0DB;color:#C67D20">${amel} À améliorer</span>` : ''}
      ${nc ? `<span class="chip" style="background:#FADEE4;color:#A93246">${nc} Non conforme${nc > 1 ? 's' : ''}</span>` : ''}
      ${na ? `<span class="chip" style="background:#F2F1F4;color:#B0ADB8">${na} N/A</span>` : ''}
    </div>
  </div>
  ${detailHTML}
  ${photosHTML}
  ${data.actionPlan ? `<div style="margin:20px 0"><h3 style="font-family:'Playfair Display',serif;font-size:16px;margin-bottom:8px">📋 Plan d'actions</h3><div style="padding:12px;background:#f9f8fc;border-radius:8px;font-size:14px;white-space:pre-wrap">${data.actionPlan}</div></div>` : ''}
  <div class="footer">Pluri'Quali — Agence Pluri'Elles — agence-plurielles.tech</div>
</div></body></html>`;
}

/* ====== HISTORY ====== */
function getHistory() {
  return JSON.parse(localStorage.getItem('pq_history') || '[]');
}

function saveHistory(entry) {
  const h = getHistory();
  h.unshift(entry);
  localStorage.setItem('pq_history', JSON.stringify(h));
}

function loadHistory() {
  renderHistory();
}

function showHistory() {
  document.getElementById('app-screen').classList.add('hidden');
  document.getElementById('history-screen').classList.remove('hidden');
  renderHistory();
}

function showApp() {
  document.getElementById('history-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
}

function renderHistory() {
  const list = document.getElementById('history-list');
  const h = getHistory();
  if (!h.length) {
    list.innerHTML = '<p style="text-align:center;color:#8A8494;padding:40px 0">Aucun contrôle enregistré.</p>';
    return;
  }
  list.innerHTML = h.map((item, i) => {
    let color = '#1B8A5A';
    if (item.score < 40) color = '#A93246';
    else if (item.score < 60) color = '#b36b00';
    else if (item.score < 80) color = '#C67D20';
    return `
    <div class="history-item">
      <div class="history-info">
        <div class="h-client">${item.client}</div>
        <div class="h-meta">${item.date} · ${item.type}</div>
      </div>
      <div class="history-score" style="color:${color}">${item.score}%</div>
      <button class="history-del" onclick="deleteHistory(${i})" title="Supprimer">🗑</button>
    </div>`;
  }).join('');
}

function deleteHistory(i) {
  const h = getHistory();
  h.splice(i, 1);
  localStorage.setItem('pq_history', JSON.stringify(h));
  renderHistory();
}

function exportCSV() {
  const h = getHistory();
  if (!h.length) { alert('Aucun historique à exporter.'); return; }
  let csv = 'Date,Client,Type,Métier,Ressource,Score,Niveau\n';
  h.forEach(item => {
    csv += `"${item.date}","${item.client}","${item.type}","${item.metier || ''}","${item.agent || ''}","${item.score}%","${item.level}"\n`;
  });
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PluriQuali_historique_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ====== SERVICE WORKER ====== */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
