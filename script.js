let currentUser = null;
let currentFilter = 'All';
let skillMode = 'teach'; 
let cvTemplate = 'modern';

const PEERS = [
  { id:1, name:'Priya Nair', dept:'Design, Year 2', emoji:'PN', color:'#5552B5',
    teaches:['Figma','UI Design','Illustrator'], wants:['React','Python'],
    rating:4.9, sessions:18, points:520, badge:'Verified Mentor', avail:'Weekdays 3–6PM', cat:'Design' },
  { id:2, name:'Rithvik Menon', dept:'CSE, Year 4', emoji:'RM', color:'#2D7D4E',
    teaches:['React','Node.js','GraphQL'], wants:['French','Piano'],
    rating:4.7, sessions:24, points:680, badge:'Top Tutor', avail:'Weekends 10AM–2PM', cat:'Tech' },
  { id:3, name:'Akshara Patel', dept:'Mathematics, Year 3', emoji:'AP', color:'#B85C00',
    teaches:['Calculus','Linear Algebra','LaTeX'], wants:['Guitar','Photoshop'],
    rating:4.8, sessions:15, points:400, badge:null, avail:'Mon–Wed 5–8PM', cat:'Academic' },
  { id:4, name:'Zara Khan', dept:'Humanities, Year 2', emoji:'ZK', color:'#7B3FA0',
    teaches:['French','Spanish','Content Writing'], wants:['Python','Figma'],
    rating:5.0, sessions:10, points:320, badge:'Verified Mentor', avail:'Daily 4–7PM', cat:'Languages' },
  { id:5, name:'Dev Iyer', dept:'Music, Year 1', emoji:'DI', color:'#C0392B',
    teaches:['Guitar','Music Theory','Ableton'], wants:['React','Video Editing'],
    rating:4.6, sessions:8, points:210, badge:null, avail:'Evenings 6–9PM', cat:'Music' },
  { id:6, name:'Simran Bose', dept:'Business, Year 3', emoji:'SB', color:'#1A6B72',
    teaches:['Excel','Finance Basics','Public Speaking'], wants:['Machine Learning','SQL'],
    rating:4.9, sessions:20, points:590, badge:'Top Tutor', avail:'Weekdays 12–3PM', cat:'Business' },
];

const BOUNTIES_INIT = [
  { id:1, need:'Need help debugging a C++ pointer issue before midnight!', offer:'30-min Figma crash course', urgency:'high', poster:'Kiran M.', color:'#5552B5', points:80, time:'2h ago' },
  { id:2, need:'Looking for a French conversation partner for 45 min', offer:'Python data-structures tutoring session', urgency:'normal', poster:'Anjali R.', color:'#2D7D4E', points:60, time:'4h ago' },
  { id:3, need:'Need Calculus help for my exam tomorrow', offer:'Guitar beginner lesson', urgency:'high', poster:'Sam T.', color:'#B85C00', points:100, time:'30m ago' },
  { id:4, need:'Want to learn Figma basics — have React to offer', offer:'2-hr React workshop', urgency:'normal', poster:'Arush K.', color:'#7B3FA0', points:70, time:'1h ago' },
];

let bounties = [...BOUNTIES_INIT];

const TEACH_SKILLS = [
  { name:'React.js', level:'Expert', pct:95 },
  { name:'Node.js', level:'Advanced', pct:80 },
  { name:'Python', level:'Advanced', pct:75 },
];
const LEARN_SKILLS = [
  { name:'Figma / UI Design', level:'Beginner', pct:20 },
  { name:'French', level:'Beginner', pct:15 },
];

const SESSIONS = [
  { title:'Taught React Hooks to Priya', partner:'Priya Nair', pColor:'#5552B5', date:'Today, 3:00 PM', status:'upcoming', barColor:'var(--mint)' },
  { title:'Learnt Calculus — Integration', partner:'Akshara Patel', pColor:'#B85C00', date:'Yesterday, 5:30 PM', status:'completed', barColor:'var(--indigo-light)' },
  { title:'French Conversation Practice', partner:'Zara Khan', pColor:'#7B3FA0', date:'Mar 25, 4:00 PM', status:'completed', barColor:'var(--indigo-light)' },
  { title:'Guitar Intro — awaiting confirmation', partner:'Dev Iyer', pColor:'#C0392B', date:'Mar 29, 6:00 PM', status:'pending', barColor:'#FFC107' },
];

const BADGES = [
  { icon:'🎓', name:'First Session', desc:'Completed your first peer session', locked:false },
  { icon:'⭐', name:'5-Star Tutor', desc:'Received 5 five-star ratings', locked:false },
  { icon:'🔥', name:'On a Roll', desc:'5 sessions in a single week', locked:false },
  { icon:'🏅', name:'Verified Mentor', desc:'Taught a skill 5+ times with high ratings', locked:false },
  { icon:'🤝', name:'Double Match', desc:'Matched with a perfect skill swap partner', locked:false },
  { icon:'💡', name:'Knowledge Sage', desc:'25 teaching sessions completed', locked:true },
  { icon:'🌟', name:'Campus Legend', desc:'Top 10 reputation score on campus', locked:true },
  { icon:'🎯', name:'Skill Collector', desc:'Listed 10+ skills in your ledger', locked:true },
  { icon:'🏆', name:'Bounty Hunter', desc:'Fulfilled 10 bounty board requests', locked:true },
];

function init() {
  renderFeed();
  renderBounties();
  renderTeachSkills();
  renderLearnSkills();
  renderSessions();
  renderBadges();
}
document.addEventListener('DOMContentLoaded', init);

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  
  const loggedIn = !!currentUser;
  document.getElementById('nav-app-links').style.display = loggedIn ? 'flex' : 'none';
  
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const map = { home:'nl-home', account:'nl-account', cv:'nl-cv' };
  if (map[page]) document.getElementById(map[page])?.classList.add('active');
  window.scrollTo(0,0);
}

function goHome() {
  if (currentUser) showPage('home'); else showPage('login');
}

function scrollToBounty() {
  setTimeout(() => {
    document.getElementById('bounty-section')?.scrollIntoView({ behavior:'smooth' });
  }, 100);
}

function doLogin() {
  const email = document.getElementById('signin-email').value.trim();
  const pwd   = document.getElementById('signin-pwd').value;
  
  const name = email ? (email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase())) : 'Aryan Sharma';
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || 'AS';
  currentUser = { name, email: email || 'student@university.edu', initials };
  afterLogin();
}

function doRegister() {
  const fname = document.getElementById('reg-fname').value.trim() || 'Student';
  const lname = document.getElementById('reg-lname').value.trim() || '';
  const email = document.getElementById('reg-email').value.trim() || 'student@university.edu';
  const dept  = document.getElementById('reg-dept').value || 'Computer Science & Engineering';
  currentUser = { name: (fname+' '+lname).trim(), email, initials: (fname[0]+(lname[0]||'')).toUpperCase(), dept };
  afterLogin();
}

function loginWithGoogle() {
  currentUser = { name:'Aryan Sharma', email:'aryan@university.edu', initials:'AS', dept:'Computer Science & Engineering' };
  afterLogin();
}

function afterLogin() {
  
  document.getElementById('nav-auth').innerHTML = `
    <div style="font-size:13px;color:var(--ink-faint);font-weight:500">${currentUser.name.split(' ')[0]}</div>
    <div class="nav-avatar" onclick="showPage('account')">${currentUser.initials}</div>
  `;
  document.getElementById('nav-app-links').style.display = 'flex';
  
  document.getElementById('acc-avatar').textContent = currentUser.initials;
  document.getElementById('acc-name').textContent   = currentUser.name;
  document.getElementById('acc-email').textContent  = currentUser.email;
  if (currentUser.dept) document.getElementById('acc-dept').textContent = currentUser.dept + ', Year 1';
  
  const parts = currentUser.name.split(' ');
  document.getElementById('set-fname').value = parts[0] || '';
  document.getElementById('set-lname').value = parts.slice(1).join(' ') || '';
  
  document.getElementById('cv-name').value = currentUser.name;
  showToast('✓ Welcome, ' + currentUser.name.split(' ')[0] + '! You\'re in.');
  showPage('home');
}

function doLogout() {
  currentUser = null;
  document.getElementById('nav-auth').innerHTML = `<button class="nav-cta" onclick="showPage('login')">Join Free</button>`;
  document.getElementById('nav-app-links').style.display = 'none';
  showPage('login');
}

function switchLoginTab(tab) {
  document.getElementById('signin-form').style.display = tab === 'signin' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('tab-signin').classList.toggle('active', tab === 'signin');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
}

function renderFeed(peers) {
  peers = peers || PEERS;
  const grid = document.getElementById('feed-grid');
  grid.innerHTML = peers.map((p,i) => `
    <div class="peer-card fade-in stagger-${(i%4)+1}" onclick="openConnect(${p.id})">
      ${p.badge ? `<div class="peer-badge">${p.badge}</div>` : ''}
      <div class="peer-card-top">
        <div class="peer-avatar" style="background:${p.color}">${p.emoji}</div>
        <div class="peer-info">
          <h3>${p.name}</h3>
          <p>${p.dept}</p>
          <div class="peer-rating">
            <span class="stars">${'★'.repeat(Math.floor(p.rating))}${p.rating%1>=0.5?'½':''}</span>
            <span>${p.rating} · ${p.sessions} sessions</span>
          </div>
        </div>
      </div>
      <div class="peer-section-lbl">Teaches</div>
      <div class="peer-tags">${p.teaches.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="peer-section-lbl">Wants to Learn</div>
      <div class="peer-tags">${p.wants.map(t=>`<span class="tag tag-want">${t}</span>`).join('')}</div>
      <div class="peer-points">
        <div>
          <div class="peer-points-val">🪙 ${p.points}</div>
          <div class="peer-points-lbl">PeerPoints</div>
        </div>
        <button class="btn btn-mint btn-sm" onclick="event.stopPropagation();openConnect(${p.id})">Connect →</button>
      </div>
    </div>
  `).join('');
}

function filterCards() {
  const q = document.getElementById('search-input').value.toLowerCase();
  let filtered = PEERS.filter(p => {
    const match = p.name.toLowerCase().includes(q) ||
      p.teaches.join(' ').toLowerCase().includes(q) ||
      p.wants.join(' ').toLowerCase().includes(q) ||
      p.dept.toLowerCase().includes(q);
    const catMatch = currentFilter === 'All' || p.cat === currentFilter;
    return match && catMatch;
  });
  renderFeed(filtered);
}

function setFilter(el, cat) {
  currentFilter = cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  filterCards();
}

function renderBounties() {
  const grid = document.getElementById('bounty-grid');
  grid.innerHTML = bounties.map(b => `
    <div class="bounty-card ${b.urgency==='high'?'urgent':''}">
      <div class="bounty-top">
        <span class="bounty-urgency ${b.urgency}">${b.urgency==='high'?'⚡ Urgent':'Normal'}</span>
        <span class="tag">🪙 ${b.points} pts</span>
      </div>
      <div class="bounty-title">${b.need}</div>
      <div class="bounty-offer">Offering: <strong>${b.offer}</strong></div>
      <div class="bounty-footer">
        <div class="bounty-poster">
          <div class="bounty-poster-av" style="background:${b.color}">${b.poster.split(' ').map(w=>w[0]).join('')}</div>
          <span>${b.poster} · ${b.time}</span>
        </div>
        <button class="btn btn-mint btn-sm" onclick="showToast('✓ Request sent to ${b.poster}!')">Respond</button>
      </div>
    </div>
  `).join('');
}

function openPostBounty() {
  if (!currentUser) { showPage('login'); return; }
  openModal('modal-bounty');
}

function postBounty() {
  const need = document.getElementById('b-need').value.trim();
  const offer = document.getElementById('b-offer').value.trim();
  const urgency = document.getElementById('b-urgency').value;
  const points = parseInt(document.getElementById('b-points').value) || 50;
  if (!need || !offer) { showToast('⚠️ Please fill in both fields'); return; }
  bounties.unshift({
    id: Date.now(), need, offer, urgency,
    poster: currentUser?.name || 'You', color:'#2D2B6B', points, time:'just now'
  });
  renderBounties();
  closeModal('modal-bounty');
  showToast('✦ Bounty posted to the board!');
  document.getElementById('b-need').value = '';
  document.getElementById('b-offer').value = '';
}

let teachSkills = [...TEACH_SKILLS];
let learnSkills = [...LEARN_SKILLS];

function renderTeachSkills() {
  const list = document.getElementById('teach-list');
  if (!list) return;
  list.innerHTML = teachSkills.map(s => `
    <div class="skill-item">
      <div class="skill-item-name">${s.name}</div>
      <div class="skill-progress">
        <div class="mini-bar"><div class="mini-bar-fill" style="width:${s.pct}%"></div></div>
        <span class="skill-lvl">${s.level}</span>
      </div>
    </div>
  `).join('');
}

function renderLearnSkills() {
  const list = document.getElementById('learn-list');
  if (!list) return;
  list.innerHTML = learnSkills.map(s => `
    <div class="skill-item">
      <div class="skill-item-name">${s.name}</div>
      <div class="skill-progress">
        <div class="mini-bar"><div class="mini-bar-fill" style="width:${s.pct}%;background:linear-gradient(90deg,#FF8C42,#FFCC80)"></div></div>
        <span class="skill-lvl">${s.level}</span>
      </div>
    </div>
  `).join('');
}

function openAddSkill(mode) {
  skillMode = mode;
  document.getElementById('skill-modal-title').textContent = mode === 'teach' ? 'Add a Skill You Teach' : 'Add a Skill You Want to Learn';
  document.getElementById('skill-level-field').style.display = mode === 'teach' ? 'flex' : 'flex';
  openModal('modal-skill');
}

function addSkillFromModal() {
  const name  = document.getElementById('new-skill-name').value.trim();
  const level = document.getElementById('new-skill-level').value;
  const cat   = document.getElementById('new-skill-cat').value;
  if (!name) { showToast('⚠️ Please enter a skill name'); return; }
  const pctMap = { Beginner:20, Intermediate:50, Advanced:75, Expert:95 };
  const skill = { name, level, cat, pct: pctMap[level] || 60 };
  if (skillMode === 'teach') {
    teachSkills.push(skill);
    renderTeachSkills();
    showToast('✓ "' + name + '" added to skills you teach!');
  } else {
    learnSkills.push(skill);
    renderLearnSkills();
    showToast('✓ "' + name + '" added to skills you want to learn!');
  }
  
  document.getElementById('new-skill-name').value = '';
  closeModal('modal-skill');
}

function renderSessions() {
  const list = document.getElementById('session-list');
  list.innerHTML = SESSIONS.map(s => `
    <div class="session-item">
      <div class="session-color-bar" style="background:${s.barColor}"></div>
      <div class="session-info">
        <div class="session-title">${s.title}</div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:6px">
          <div class="session-partner">
            <div class="session-partner-av" style="background:${s.pColor}">${s.partner.split(' ').map(w=>w[0]).join('')}</div>
            <span class="session-partner-name">with ${s.partner}</span>
          </div>
          <span style="color:var(--ink-faint);font-size:11px">·</span>
          <span style="font-size:12px;color:var(--ink-faint)">${s.date}</span>
        </div>
      </div>
      <span class="session-badge ${s.status}">${s.status.charAt(0).toUpperCase()+s.status.slice(1)}</span>
    </div>
  `).join('');
}

function renderBadges() {
  const grid = document.getElementById('badges-grid');
  grid.innerHTML = BADGES.map(b => `
    <div class="badge-card ${b.locked?'locked':''}">
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-name">${b.name}</div>
      <div class="badge-desc">${b.desc}</div>
      ${b.locked ? '<div style="font-size:10px;color:var(--ink-faint);margin-top:6px">🔒 Locked</div>' : '<div style="font-size:10px;color:var(--mint);font-weight:700;margin-top:6px">✓ Earned</div>'}
    </div>
  `).join('');
}

function switchAccTab(tab, el) {
  ['skills','sessions','badges','settings'].forEach(t => {
    const el2 = document.getElementById('acc-tab-'+t);
    if (el2) el2.style.display = (t === tab) ? 'block' : 'none';
  });
  document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');
  
  if (tab === 'skills')   { renderTeachSkills(); renderLearnSkills(); }
  if (tab === 'sessions') renderSessions();
  if (tab === 'badges')   renderBadges();
}

function saveSettings() {
  const fname = document.getElementById('set-fname').value.trim();
  const lname = document.getElementById('set-lname').value.trim();
  if (fname) {
    document.getElementById('acc-name').textContent = fname + ' ' + lname;
    document.getElementById('acc-avatar').textContent = (fname[0]+(lname[0]||'')).toUpperCase();
  }
  showToast('✓ Profile saved successfully!');
}

function openConnect(id) {
  if (!currentUser) { showPage('login'); return; }
  const peer = PEERS.find(p => p.id === id);
  if (!peer) return;
  document.getElementById('connect-avatar-big').textContent = peer.emoji;
  document.getElementById('connect-name').textContent = peer.name;
  document.getElementById('connect-dept').textContent = peer.dept;
  document.getElementById('connect-avail').textContent = peer.avail;
  document.getElementById('connect-tags').innerHTML = [
    ...peer.teaches.map(t=>`<span class="tag">${t}</span>`),
    ...peer.wants.map(t=>`<span class="tag tag-want">${t}</span>`)
  ].join('');
  openModal('modal-connect');
}

function sendRequest() {
  closeModal('modal-connect');
  showToast('✓ Session request sent! They\'ll respond shortly.');
}

function setTemplate(el, tpl) {
  cvTemplate = tpl;
  document.querySelectorAll('.cv-template-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

async function generateCV() {
  const name   = document.getElementById('cv-name').value.trim() || 'Student Name';
  const role   = document.getElementById('cv-role').value.trim() || 'Software Developer';
  const edu    = document.getElementById('cv-edu').value.trim() || 'B.Tech, University';
  const skills = document.getElementById('cv-skills').value.trim() || 'Various';
  const exp    = document.getElementById('cv-exp').value.trim() || 'No experience listed';
  const ach    = document.getElementById('cv-ach').value.trim() || '';
  const extra  = document.getElementById('cv-extra').value.trim() || '';

  const output = document.getElementById('cv-output');
  output.innerHTML = `<div class="cv-placeholder"><div class="ai-spinner"></div><p style="color:var(--ink-faint)">Crafting your ${cvTemplate} CV…</p></div>`;
  output.className = 'cv-output-area';
  document.getElementById('cv-actions').style.display = 'none';

  const prompt = `You are an expert career consultant. Create a professional, polished ${cvTemplate}-style CV/resume for a university student. 

Student Details:
- Name: ${name}
- Target Role: ${role}
- Education: ${edu}
- Skills: ${skills}
- Projects/Experience: ${exp}
- Achievements & Extracurriculars: ${ach}
- Extra Instructions: ${extra || 'None'}

Write a complete, well-formatted CV using plain text formatting (use ===, ---, * and proper indentation). Make it compelling, specific, and tailored to the target role. Include sections: Contact Info, Objective/Summary, Education, Technical Skills, Projects, Experience (if any), Achievements, and Extracurriculars. Keep it professional and impactful. Do NOT use markdown like ** or ##, use plain text formatting only.`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await resp.json();
    const text = data.content?.map(c => c.text || '').join('') || 'Could not generate CV. Please try again.';
    output.className = 'cv-output-area typing';
    typeText(output, text, () => {
      output.className = 'cv-output-area';
      document.getElementById('cv-actions').style.display = 'flex';
    });
  } catch (err) {
    output.className = 'cv-output-area';
    output.textContent = '⚠️ Unable to connect to AI service. Please check your connection and try again.';
  }
}

function typeText(el, text, cb) {
  el.textContent = '';
  let i = 0;
  const speed = Math.max(4, Math.floor(3000 / text.length));
  const iv = setInterval(() => {
    el.textContent += text[i];
    el.scrollTop = el.scrollHeight;
    i++;
    if (i >= text.length) { clearInterval(iv); if (cb) cb(); }
  }, speed);
}

function copyCV() {
  const text = document.getElementById('cv-output').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('✓ CV copied to clipboard!'));
}

function downloadCV() {
  const text = document.getElementById('cv-output').textContent;
  const name = document.getElementById('cv-name').value.trim() || 'CV';
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name.replace(/\s+/g,'_') + '_CV.txt';
  a.click();
  showToast('✓ CV downloaded!');
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
  if (e.key === 'Enter') {
    const ae = document.activeElement;
    if (ae?.id === 'signin-email' || ae?.id === 'signin-pwd') doLogin();
  }
});