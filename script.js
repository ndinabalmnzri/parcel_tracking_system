// script.js — main logic for TRANZIO PARCELLO

// --- Branches data (1 sample branch per state/ft) ---
const BRANCHES = [
  { state: "Johor", branch: "Johor Bahru Central", city:"Johor Bahru", address:"No. 12 Jalan Permata", phone:"+60 7-123 0001", code:"TRZ-JHR001" },
  { state: "Kedah", branch: "Alor Setar Hub", city:"Alor Setar", address:"20 Jalan Meranti", phone:"+60 4-123 0002", code:"TRZ-KDH001" },
  { state: "Kelantan", branch: "Kota Bharu Depot", city:"Kota Bharu", address:"3 Jalan Besar", phone:"+60 9-123 0003", code:"TRZ-KTN001" },
  { state: "Melaka", branch: "Melaka Sentral", city:"Melaka", address:"Lot 5, Jalan Bunga Raya", phone:"+60 6-123 0004", code:"TRZ-MLK001" },
  { state: "Negeri Sembilan", branch: "Seremban Main", city:"Seremban", address:"8 Jalan Emas", phone:"+60 6-123 0005", code:"TRZ-NSN001" },
  { state: "Pahang", branch: "Kuantan Hub", city:"Kuantan", address:"Jalan Timur 2", phone:"+60 9-123 0006", code:"TRZ-PGH001" },
  { state: "Perak", branch: "Ipoh Central", city:"Ipoh", address:"34 Jalan Raja", phone:"+60 5-123 0007", code:"TRZ-PRK001" },
  { state: "Perlis", branch: "Kangar Branch", city:"Kangar", address:"2 Jalan Kuala Perlis", phone:"+60 4-123 0008", code:"TRZ-PLS001" },
  { state: "Penang", branch: "Pulau Pinang Hub", city:"George Town", address:"10 Lebuh Pantai", phone:"+60 4-123 0009", code:"TRZ-PNG001" },
  { state: "Sabah", branch: "Kota Kinabalu Depot", city:"Kota Kinabalu", address:"Lot 9 Jalan Teluk", phone:"+60 88-123 0010", code:"TRZ-SBH001" },
  { state: "Sarawak", branch: "Kuching Central", city:"Kuching", address:"5 Jalan Stutong", phone:"+60 82-123 0011", code:"TRZ-SWK001" },
  { state: "Selangor", branch: "Petaling Jaya Hub", city:"Petaling Jaya", address:"No. 33 Jalan Teknologi", phone:"+60 3-123 0012", code:"TRZ-SLG001" },
  { state: "Terengganu", branch: "Kuala Terengganu Branch", city:"Kuala Terengganu", address:"Jalan Pantai 4", phone:"+60 9-123 0013", code:"TRZ-TGN001" },
  { state: "Kuala Lumpur (FT)", branch: "KL Sentral Office", city:"Kuala Lumpur", address:"Lot 1, KL Sentral", phone:"+60 3-123 0014", code:"TRZ-KL001" },
  { state: "Putrajaya (FT)", branch: "Putrajaya Office", city:"Putrajaya", address:"Presint 3, Building 2", phone:"+60 3-123 0015", code:"TRZ-PJY001" },
  { state: "Labuan (FT)", branch: "Labuan Branch", city:"Labuan", address:"Jalan Utama 7", phone:"+60 87-123 0016", code:"TRZ-LBN001" }
];

// utilities -------------------
function $(id){ return document.getElementById(id); }
function formatDate(d){ return d.toISOString().slice(0,10); }

// populate state select (on pages where present)
function populateStateSelect(){
  const s = $("stateSelect");
  if(!s) return;
  const states = [...new Set(BRANCHES.map(b=>b.state))].sort();
  states.forEach(st=>{
    const opt = document.createElement("option");
    opt.value = st; opt.textContent = st;
    s.appendChild(opt);
  });
}

// populate branch select depending on state
function populateBranchList(){
  const state = $("stateSelect").value;
  const branchSel = $("branchSelect");
  branchSel.innerHTML = '<option value="">-- Select branch --</option>';
  BRANCHES.filter(b => b.state === state).forEach(b=>{
    const opt = document.createElement("option");
    opt.value = b.branch;
    opt.textContent = `${b.branch} (${b.code}) — ${b.city}`;
    branchSel.appendChild(opt);
  });
}

// branches page: render cards grid
function renderBranchesGrid(){
  const grid = $("branchesGrid");
  if(!grid) return;
  grid.innerHTML = '';
  BRANCHES.forEach(b=>{
    const card = document.createElement('div');
    card.className = 'branch-card';
    card.innerHTML = `<h4>${b.branch}</h4>
      <p><strong>State:</strong> ${b.state}</p>
      <p><strong>City:</strong> ${b.city}</p>
      <p><strong>Address:</strong> ${b.address}</p>
      <p><strong>Phone:</strong> ${b.phone}</p>
      <p><strong>Branch code:</strong> ${b.code}</p>`;
    grid.appendChild(card);
  });
}

// tracking logic --------------------------------------------------
// generate timeline array for this tracking — returns objects {date, status, location}
function generateTimeline(branchObj){
  // base statuses (single summary first; full timeline later)
  const messages = [
    "Parcel received at origin facility",
    "Processed at sorting center",
    "In transit to hub",
    "Arrived at local hub",
    "Out for delivery",
    "Delivered"
  ];

  // build timeline with realistic-ish dates
  const now = new Date();
  const timeline = [];
  // start a few days before now
  const start = new Date(now);
  start.setDate(now.getDate() - Math.floor(Math.random()*5) - 1);

  for(let i=0;i<messages.length;i++){
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    timeline.push({
      date: formatDate(d),
      status: messages[i],
      location: (i<=2) ? "Origin facility" : (i===3 ? branchObj.city : (i===4 ? branchObj.city : branchObj.city))
    });
  }
  return timeline;
}

// create random ETA (between now and +7 days)
function randomEta(){
  const now = new Date();
  const days = Math.floor(Math.random() * 8) + 1; // 1..8 days
  const d = new Date(now);
  d.setDate(now.getDate() + days);
  return formatDate(d);
}

// show partial result on tracking page
function showPartialResult(trackingNumber, branchName){
  const branchObj = BRANCHES.find(b => b.branch === branchName) || BRANCHES[0];
  const timeline = generateTimeline(branchObj);
  const current = timeline[Math.min(timeline.length-1, Math.floor(Math.random()*(timeline.length-1)))];
  const res = $("trackResult"); if(!res) return;
  $("resNumber").textContent = trackingNumber;
  $("resLocation").textContent = `${branchObj.city} — ${branchObj.branch} (${branchObj.code})`;
  $("resCurrent").textContent = current.status + ` (${current.date})`;
  $("resEta").textContent = randomEta();
  res.classList.remove('hidden');

  // persist to localStorage for status page
  const saved = { trackingNumber, branch: branchObj, timeline, current, eta: $("resEta").textContent };
  localStorage.setItem('tranzio_last_track', JSON.stringify(saved));
}

// when user presses Show / Full Status
function showFullStatus(){
  const payload = localStorage.getItem('tranzio_last_track');
  if(!payload){
    alert("Please search for a parcel first.");
    return;
  }
  // build full timeline HTML and store separately too
  const data = JSON.parse(payload);
  localStorage.setItem('tranzio_last_full_status', JSON.stringify(data));
  // Immediately navigate to status page (status page will read and render timeline)
  window.location.href = 'status.html';
}

// Search handler (tracking page)
function searchTracking(e){
  if(e) e.preventDefault();
  const tn = ($("trackNumber") ? $("trackNumber").value.trim() : "") || ("TRZ" + Math.floor(Math.random()*900000+100000));
  const st = ($("stateSelect") ? $("stateSelect").value : "");
  const br = ($("branchSelect") ? $("branchSelect").value : "");
  if(!$("stateSelect") || !st || !br){
    alert("Please select State and Branch to track your parcel.");
    return;
  }
  showPartialResult(tn, br);
}

// helper to generate random sample result
function generateRandomAndShow(){
  const randomBranch = BRANCHES[Math.floor(Math.random()*BRANCHES.length)];
  if($("stateSelect")){
    $("stateSelect").value = randomBranch.state;
    populateBranchList();
    $("branchSelect").value = randomBranch.branch;
  }
  const tn = "TRZ" + Math.floor(Math.random()*900000+100000);
  $("trackNumber").value = tn;
  showPartialResult(tn, randomBranch.branch);
}

// reset tracking area
function resetTracking(){
  if($("trackForm")) $("trackForm").reset();
  if($("trackResult")) $("trackResult").classList.add('hidden');
  localStorage.removeItem('tranzio_last_track');
  localStorage.removeItem('tranzio_last_full_status');
}

// status page renderer
function renderStatusPage(){
  const raw = localStorage.getItem('tranzio_last_full_status');
  const container = $("timelineContainer");
  if(!container) return;
  container.innerHTML = '';
  if(!raw){
    container.innerHTML = `<p class="muted">No status available. Use the Tracking page first.</p>`;
    return;
  }
  const data = JSON.parse(raw);
  const header = document.createElement('div');
  header.innerHTML = `<p><strong>Tracking:</strong> ${data.trackingNumber}</p>
    <p><strong>Branch:</strong> ${data.branch.branch} — ${data.branch.code}</p>
    <p><strong>Estimated delivery:</strong> ${data.eta}</p>`;
  container.appendChild(header);

  const timelineWrap = document.createElement('div');
  timelineWrap.className = 'track-timeline';
  data.timeline.forEach(item=>{
    const itm = document.createElement('div');
    itm.className = 'timeline-item';
    itm.innerHTML = `<div><strong>${item.status}</strong></div>
                     <div class="muted">${item.date} — ${item.location}</div>`;
    timelineWrap.appendChild(itm);
  });
  container.appendChild(timelineWrap);
}

// clearing status
function clearStatus(){
  localStorage.removeItem('tranzio_last_full_status');
  localStorage.removeItem('tranzio_last_track');
  const container = $("timelineContainer");
  if(container) container.innerHTML = `<p class="muted">Status cleared.</p>`;
}

// auth (index) logic
function showAuth(which){
  $('loginTab').classList.toggle('active', which === 'login');
  $('signupTab').classList.toggle('active', which === 'signup');
  $('loginForm').classList.toggle('hidden', which !== 'login');
  $('signupForm').classList.toggle('hidden', which !== 'signup');
}

function handleLogin(evt){
  evt.preventDefault();
  const email = $('loginEmail').value.trim();
  const pwd = $('loginPassword').value.trim();
  if(!email || !pwd){ alert('Please enter email & password'); return; }
  // For this PBL, any credentials allowed — store username in sessionStorage and go to tracking page
  const username = email.split('@')[0];
  sessionStorage.setItem('tranzio_user', username);
  alert(`Login successful — Welcome ${username}`);
  window.location.href = 'tracking.html';
}

function handleSignup(evt){
  evt.preventDefault();
  const name = $('signupName').value.trim();
  const email = $('signupEmail').value.trim();
  const pwd = $('signupPassword').value.trim();
  if(!email || !pwd){ alert('Please provide email & password to create account.'); return; }
  // store a tiny record in localStorage
  const account = { name: name || email.split('@')[0], email: email };
  localStorage.setItem('tranzio_user_'+email, JSON.stringify(account));
  alert('Account created. You may now login.');
  showAuth('login');
}

function forgotPassword(e){
  if(e) e.preventDefault();
  alert('Password reset is not implemented for this assignment. You may re-create an account.');
}

// small helper from index quick track
function goToTracking(evt){
  if(evt) evt.preventDefault();
  // if quick tracking number provided, forward to tracking page and prefill
  const q = $('quickTrackNumber');
  const tn = q ? q.value.trim() : '';
  if(tn) localStorage.setItem('tranzio_quick_track', tn);
  window.location.href = 'tracking.html';
}

// on load initialization
document.addEventListener('DOMContentLoaded',()=>{
  populateStateSelect();
  renderBranchesGrid();

  // if tracking page and we have a quick track in localStorage, prefill
  const quick = localStorage.getItem('tranzio_quick_track');
  if(quick && $('trackNumber')){ $('trackNumber').value = quick; localStorage.removeItem('tranzio_quick_track'); }

  // status page rendering
  renderStatusPage();
});
