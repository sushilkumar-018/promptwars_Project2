// ===== PARTICLE CANVAS =====
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];
function resizeCanvas() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        color: ['#8B5CF6','#3B82F6','#10B981'][Math.floor(Math.random()*3)]
    });
}
function animateParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = pCanvas.width;
        if (p.x > pCanvas.width) p.x = 0;
        if (p.y < 0) p.y = pCanvas.height;
        if (p.y > pCanvas.height) p.y = 0;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pCtx.fillStyle = p.color;
        pCtx.globalAlpha = p.alpha;
        pCtx.fill();
    });
    pCtx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== PIPELINE STAGES =====
const pipelineData = [
    { emoji: '🗳', label: 'Ballot Casting', title: 'Ballot Casting', desc: 'Registered voters cast ballots in person, by mail, or via early voting. Each ballot is verified against voter rolls before being accepted.', warning: '⚠ Risk: Long queues, provisional ballots, signature mismatches.' },
    { emoji: '📦', label: 'Collection', title: 'Collection & Storage', desc: 'Sealed ballot boxes are transported under chain-of-custody protocols to secure counting centers. Security seals prevent tampering.', warning: '⚠ Risk: Delays in rural areas, chain-of-custody breaks.' },
    { emoji: '🔢', label: 'Counting', title: 'Vote Counting', desc: 'Ballots are counted by optical scanners or hand. Bipartisan teams oversee every step. Mail-in ballots are processed separately.', warning: '⚠ Risk: Machine calibration errors, damaged ballots.' },
    { emoji: '📊', label: 'Tabulation', title: 'Tabulation', desc: 'Counts from all polling stations are aggregated and reconciled against the number of voters signed in. Every tally must balance.', warning: '⚠ Risk: Data entry errors, communication delays between counties.' },
    { emoji: '✅', label: 'Certification', title: 'Certification', desc: 'Election boards officially certify results after audits pass. Results become legally binding. Losing candidates may request recounts.', warning: '⚠ Risk: Legal challenges, recount requests can extend timelines.' }
];

let activePipeline = -1;

function buildPipeline() {
    const container = document.getElementById('pipeline-stages');
    const fill = document.getElementById('pipeline-fill');
    pipelineData.forEach((stage, i) => {
        const el = document.createElement('div');
        el.className = 'pipeline-stage';
        el.innerHTML = `<div class="stage-circle">${stage.emoji}</div><span class="stage-label">${stage.label}</span>`;
        el.addEventListener('click', () => selectStage(i, fill));
        container.appendChild(el);
    });
}

function selectStage(i, fill) {
    const stages = document.querySelectorAll('.pipeline-stage');
    stages.forEach((s, idx) => {
        s.classList.remove('active');
        if (idx < i) s.classList.add('completed');
        else s.classList.remove('completed');
    });
    stages[i].classList.add('active');
    activePipeline = i;
    fill.style.width = `${(i / (pipelineData.length - 1)) * 100}%`;
    const d = pipelineData[i];
    document.getElementById('detail-icon').textContent = d.emoji;
    document.getElementById('detail-title').textContent = d.title;
    document.getElementById('detail-desc').textContent = d.desc;
    document.getElementById('detail-extras').innerHTML = `<div class="detail-warning">${d.warning}</div>`;
    document.getElementById('pipeline-detail').style.transform = 'scale(0.98)';
    setTimeout(() => document.getElementById('pipeline-detail').style.transform = 'scale(1)', 200);
}

// ===== BALLOT CASTING =====
let selectedCandidate = null;
function setupBallot() {
    const candidates = document.querySelectorAll('.ballot-candidate');
    const castBtn = document.getElementById('cast-vote-btn');
    candidates.forEach(c => {
        c.addEventListener('click', () => {
            candidates.forEach(x => x.classList.remove('selected'));
            c.classList.add('selected');
            selectedCandidate = c.dataset.candidate;
            castBtn.disabled = false;
        });
    });
    castBtn.addEventListener('click', () => {
        if (!selectedCandidate) return;
        castBtn.disabled = true;
        castBtn.innerHTML = '<span>Casting...</span>';
        const journey = document.getElementById('ballot-journey');
        const tooltip = document.getElementById('ballot-tooltip');
        journey.classList.remove('hidden');
        const steps = document.querySelectorAll('.journey-step');
        steps.forEach((s, i) => {
            setTimeout(() => {
                s.classList.add('active');
                if (i === steps.length - 1) {
                    tooltip.classList.remove('hidden');
                    launchConfetti();
                    castBtn.innerHTML = '<span>Vote Cast! ✓</span>';
                    castBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                }
            }, i * 800);
        });
    });
}

// ===== CONFETTI =====
const cfCanvas = document.getElementById('confetti-canvas');
const cfCtx = cfCanvas.getContext('2d');
cfCanvas.width = window.innerWidth; cfCanvas.height = window.innerHeight;
window.addEventListener('resize', () => { cfCanvas.width = window.innerWidth; cfCanvas.height = window.innerHeight; });
let confettiPieces = [];
function launchConfetti() {
    confettiPieces = [];
    for (let i = 0; i < 120; i++) {
        confettiPieces.push({
            x: Math.random() * cfCanvas.width,
            y: -20,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: ['#8B5CF6','#3B82F6','#10B981','#EF4444','#F59E0B','#EC4899'][Math.floor(Math.random()*6)],
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 4 + 2,
            alpha: 1
        });
    }
    animateConfetti();
}
function animateConfetti() {
    cfCtx.clearRect(0, 0, cfCanvas.width, cfCanvas.height);
    confettiPieces = confettiPieces.filter(p => p.alpha > 0.01);
    confettiPieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += p.spin;
        if (p.y > cfCanvas.height) p.alpha -= 0.05;
        cfCtx.save();
        cfCtx.globalAlpha = p.alpha;
        cfCtx.translate(p.x, p.y);
        cfCtx.rotate(p.angle);
        cfCtx.fillStyle = p.color;
        cfCtx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        cfCtx.restore();
    });
    if (confettiPieces.length > 0) requestAnimationFrame(animateConfetti);
}

// ===== CANVAS SIMULATIONS =====
function drawBars(canvasId, data, winner) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...data.map(d => d.val));
    const barW = 80, gap = (W - data.length * barW) / (data.length + 1);
    data.forEach((d, i) => {
        const x = gap + i * (barW + gap);
        const barH = (d.val / max) * (H - 120);
        const y = H - 70 - barH;
        const grd = ctx.createLinearGradient(x, y + barH, x, y);
        grd.addColorStop(0, d.color + '88');
        grd.addColorStop(1, d.color);
        ctx.fillStyle = grd;
        ctx.roundRect(x, y, barW, barH, [8, 8, 0, 0]);
        ctx.fill();
        if (d.label === winner) {
            ctx.shadowColor = d.color; ctx.shadowBlur = 20;
            ctx.strokeStyle = d.color; ctx.lineWidth = 3;
            ctx.strokeRect(x - 2, y - 2, barW + 4, barH + 4);
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText('WINNER 🏆', x + barW / 2, y - 10);
        }
        ctx.fillStyle = d.color; ctx.font = 'bold 18px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText(d.val, x + barW / 2, y - (d.label === winner ? 30 : 10));
        ctx.fillStyle = '#A1A1AA'; ctx.font = '600 13px Outfit';
        ctx.fillText(d.label, x + barW / 2, H - 45);
        ctx.fillStyle = d.color; ctx.font = '700 12px Outfit';
        ctx.fillText(d.pct + '%', x + barW / 2, H - 28);
    });
}

function animateBars(canvasId, targets, winner, steps = 40) {
    const current = targets.map(t => ({ ...t, val: 0 }));
    let frame = 0;
    function step() {
        frame++;
        current.forEach((c, i) => { c.val = Math.round((frame / steps) * targets[i].val); });
        drawBars(canvasId, current, frame < steps ? null : winner);
        if (frame < steps) requestAnimationFrame(step);
    }
    step();
}

// FPTP
document.getElementById('btn-fptp').addEventListener('click', function() {
    this.disabled = true;
    const data = [
        { label: 'Red', color: '#EF4444', val: 45, pct: 45 },
        { label: 'Blue', color: '#3B82F6', val: 35, pct: 35 },
        { label: 'Yellow', color: '#F59E0B', val: 20, pct: 20 }
    ];
    animateBars('canvas-fptp', data, 'Red');
    setTimeout(() => this.disabled = false, 1500);
});

// RCV
document.getElementById('btn-rcv').addEventListener('click', async function() {
    this.disabled = true;
    const status = document.getElementById('rcv-status');
    const r1 = [
        { label: 'Red', color: '#EF4444', val: 40, pct: 40 },
        { label: 'Blue', color: '#3B82F6', val: 35, pct: 35 },
        { label: 'Yellow', color: '#F59E0B', val: 25, pct: 25 }
    ];
    status.textContent = 'Round 1: Counting first-choice votes…';
    animateBars('canvas-rcv', r1, null);
    await new Promise(r => setTimeout(r, 2000));
    status.innerHTML = 'No majority! Yellow (25%) is <strong style="color:#EF4444">eliminated</strong>. Redistributing their votes…';
    await new Promise(r => setTimeout(r, 1500));
    const r2 = [
        { label: 'Red', color: '#EF4444', val: 49, pct: 49 },
        { label: 'Blue', color: '#3B82F6', val: 51, pct: 51 },
        { label: 'Yellow', color: '#F59E0B', val: 0, pct: 0 }
    ];
    status.textContent = 'Round 2: Yellow votes redistributed. Checking for majority…';
    animateBars('canvas-rcv', r2, null);
    await new Promise(r => setTimeout(r, 1500));
    status.innerHTML = 'Blue crosses 50%! <strong style="color:#3B82F6">Blue Wins!</strong> 🎉';
    drawBars('canvas-rcv', r2, 'Blue');
    this.disabled = false;
});

// PR
document.getElementById('btn-pr').addEventListener('click', async function() {
    this.disabled = true;
    const data = [
        { label: 'Red', color: '#EF4444', val: 40, pct: 40, seats: 4 },
        { label: 'Blue', color: '#3B82F6', val: 30, pct: 30, seats: 3 },
        { label: 'Yellow', color: '#F59E0B', val: 30, pct: 30, seats: 3 }
    ];
    animateBars('canvas-pr', data, null);
    const seatContainer = document.getElementById('parliament-seats');
    seatContainer.innerHTML = '';
    await new Promise(r => setTimeout(r, 1500));
    data.forEach(d => {
        for (let i = 0; i < d.seats; i++) {
            setTimeout(() => {
                const dot = document.createElement('div');
                dot.className = 'seat-dot';
                dot.style.background = d.color;
                dot.style.boxShadow = `0 0 8px ${d.color}`;
                dot.title = `${d.label} Party`;
                seatContainer.appendChild(dot);
            }, i * 200 + data.indexOf(d) * 800);
        }
    });
    setTimeout(() => this.disabled = false, 3000);
});

// ===== TABS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

// ===== PIE CHART =====
function updatePie(r, b, y) {
    const total = 100;
    const circumference = 2 * Math.PI * 15.9155;
    let offset = 0;
    const segments = [
        { id: 'pie-red', pct: r },
        { id: 'pie-blue', pct: b },
        { id: 'pie-yellow', pct: y }
    ];
    segments.forEach(s => {
        const el = document.getElementById(s.id);
        const dash = (s.pct / total) * circumference;
        el.style.strokeDasharray = `${dash} ${circumference - dash}`;
        el.style.strokeDashoffset = -offset;
        offset += dash;
    });
}
updatePie(40, 35, 25);

// ===== KILLER FEATURE =====
const redSlider = document.getElementById('votes-red');
const blueSlider = document.getElementById('votes-blue');
const yellowSlider = document.getElementById('votes-yellow');
const valRed = document.getElementById('val-red');
const valBlue = document.getElementById('val-blue');
const valYellow = document.getElementById('val-yellow');

function syncSliders(e) {
    let r = parseInt(redSlider.value), b = parseInt(blueSlider.value);
    if (r + b > 100) {
        if (e.target === redSlider) { b = 100 - r; blueSlider.value = b; }
        else { r = 100 - b; redSlider.value = r; }
    }
    const y = 100 - r - b;
    yellowSlider.value = y;
    valRed.textContent = r + '%'; valBlue.textContent = b + '%'; valYellow.textContent = y + '%';
    updatePie(r, b, y);
}
redSlider.addEventListener('input', syncSliders);
blueSlider.addEventListener('input', syncSliders);

document.getElementById('run-all-sims').addEventListener('click', () => {
    const r = parseInt(redSlider.value);
    const b = parseInt(blueSlider.value);
    const y = 100 - r - b;
    const names = { r: 'Red', b: 'Blue', y: 'Yellow' };
    const colors = { r: '#EF4444', b: '#3B82F6', y: '#F59E0B' };

    // FPTP
    const maxVal = Math.max(r, b, y);
    let fWinner = maxVal === r && r !== b && r !== y ? 'r' : maxVal === b && b !== r && b !== y ? 'b' : maxVal === y && y !== r && y !== b ? 'y' : null;
    const fEl = document.getElementById('winner-fptp');
    const fIns = document.getElementById('insight-fptp');
    if (fWinner) {
        fEl.innerHTML = `<span style="color:${colors[fWinner]}">${names[fWinner]} Wins</span>`;
        fIns.textContent = `${names[fWinner]} wins with only ${maxVal}% — ${100-maxVal}% voted against them.`;
    } else { fEl.innerHTML = '<span>Tie!</span>'; fIns.textContent = 'A rare tie — unlikely in real elections.'; }

    // RCV
    const rEl = document.getElementById('winner-rcv');
    const rIns = document.getElementById('insight-rcv');
    let rcvWinner;
    if (r > 50) { rcvWinner = 'r'; rIns.textContent = 'Red wins outright in Round 1 with a majority.'; }
    else if (b > 50) { rcvWinner = 'b'; rIns.textContent = 'Blue wins outright in Round 1.'; }
    else if (y > 50) { rcvWinner = 'y'; rIns.textContent = 'Yellow wins outright in Round 1.'; }
    else {
        const minVal = Math.min(r, b, y);
        if (minVal === y) { rcvWinner = b + y > r ? 'b' : 'r'; rIns.textContent = `Yellow eliminated. Transfers make ${names[rcvWinner]} the majority winner.`; }
        else if (minVal === b) { rcvWinner = r + b > y ? 'r' : 'y'; rIns.textContent = `Blue eliminated. Transfers make ${names[rcvWinner]} the majority winner.`; }
        else { rcvWinner = y + r > b ? 'y' : 'b'; rIns.textContent = `Red eliminated. Transfers make ${names[rcvWinner]} the majority winner.`; }
    }
    rEl.innerHTML = `<span style="color:${colors[rcvWinner]}">${names[rcvWinner]} Wins</span>`;

    // PR (10 seats)
    const pEl = document.getElementById('winner-pr');
    const pIns = document.getElementById('insight-pr');
    const rs = Math.round(r / 10), bs = Math.round(b / 10);
    const ys = Math.max(0, 10 - rs - bs);
    pEl.innerHTML = `<span style="color:#EF4444">${rs}</span><span style="opacity:0.4"> / </span><span style="color:#3B82F6">${bs}</span><span style="opacity:0.4"> / </span><span style="color:#F59E0B">${ys}</span> <span style="font-size:0.8rem;color:#A1A1AA">seats</span>`;
    pIns.textContent = 'Seats split proportionally. Coalition required for majority.';

    // Animate cards
    ['res-fptp', 'res-rcv', 'res-pr'].forEach((id, i) => {
        const card = document.getElementById(id);
        card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.16,1,0.3,1)';
            card.style.opacity = '1'; card.style.transform = 'translateY(0)';
        }, i * 150);
    });

    // Highlight if different winners
    const allWinners = [fWinner, rcvWinner];
    if (new Set(allWinners).size > 1) {
        ['res-fptp','res-rcv'].forEach(id => document.getElementById(id).classList.add('highlight'));
    }
    setTimeout(() => launchConfetti(), 600);
});

// ===== FAILURE MODE LOGIC =====
let isFailureMode = false;
let stats = { total: 0, rejected: 0, pending: 0 };

const failureToggle = document.getElementById('failure-mode-toggle');
const statusPanel = document.getElementById('status-panel');
const warningTimeline = document.getElementById('warning-timeline');

failureToggle.addEventListener('change', (e) => {
    isFailureMode = e.target.checked;
    statusPanel.classList.toggle('hidden', !isFailureMode);
    warningTimeline.classList.toggle('hidden', !isFailureMode);
    if (isFailureMode) {
        addWarning("FAILURE MODE ACTIVATED: System anomalies simulated.");
    } else {
        warningTimeline.innerHTML = '';
        resetStats();
    }
});

function addWarning(msg) {
    const el = document.createElement('div');
    el.className = 'warning-msg';
    el.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    warningTimeline.prepend(el);
}

// ===== CONFIDENCE METER LOGIC =====
const confCanvas = document.getElementById('confidence-canvas');
const confCtx = confCanvas.getContext('2d');
let currentConfidence = 0;
let targetConfidence = 0;

function calculateConfidence(votesCounted) {
    // Total expected votes for simulation purposes (e.g., 50)
    const expectedTotal = 50; 
    const baseConf = (votesCounted / expectedTotal) * 100;
    
    // Adjustment factor: slower growth at start, faster as we approach total
    const adjustment = votesCounted < 10 ? 0.8 : 1.2;
    return Math.min(Math.round(baseConf * adjustment), 100);
}

function updateConfidenceUI(val) {
    const statusEl = document.getElementById('confidence-status');
    const valEl = document.getElementById('confidence-val');
    
    valEl.textContent = `${val}%`;
    
    if (val < 50) {
        statusEl.textContent = "Uncertain";
        statusEl.style.color = "var(--text-secondary)";
    } else if (val < 80) {
        statusEl.textContent = "Leaning";
        statusEl.style.color = "var(--warning)";
    } else {
        statusEl.textContent = "Strong Lead";
        statusEl.style.color = "var(--accent-3)";
    }
    
    targetConfidence = val;
}

function drawConfidenceGauge() {
    const W = confCanvas.width, H = confCanvas.height;
    const center = W / 2;
    const radius = 35;
    
    // Smooth animation
    if (currentConfidence < targetConfidence) currentConfidence += 0.5;
    else if (currentConfidence > targetConfidence) currentConfidence -= 0.5;

    confCtx.clearRect(0, 0, W, H);
    
    // Background Circle
    confCtx.beginPath();
    confCtx.arc(center, center, radius, 0, Math.PI * 2);
    confCtx.strokeStyle = "rgba(255,255,255,0.05)";
    confCtx.lineWidth = 6;
    confCtx.stroke();
    
    // Progress Arc
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (currentConfidence / 100) * (Math.PI * 2);
    
    confCtx.beginPath();
    confCtx.arc(center, center, radius, startAngle, endAngle);
    
    // Dynamic color based on confidence
    let color = "#3B82F6"; // Blue (default)
    if (currentConfidence >= 80) color = "#10B981"; // Green
    else if (currentConfidence >= 50) color = "#F59E0B"; // Orange
    
    confCtx.strokeStyle = color;
    confCtx.lineWidth = 6;
    confCtx.lineCap = "round";
    confCtx.stroke();
    
    requestAnimationFrame(drawConfidenceGauge);
}

// Update updateStats to include confidence
function updateStats() {
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-rejected').textContent = stats.rejected;
    document.getElementById('stat-pending').textContent = stats.pending;
    
    const newConf = calculateConfidence(stats.total);
    updateConfidenceUI(newConf);
}

// Start gauge animation loop
drawConfidenceGauge();

// Update run-all-sims to include recount check
const originalRunSims = document.getElementById('run-all-sims').onclick;
document.getElementById('run-all-sims').addEventListener('click', () => {
    const r = parseInt(redSlider.value);
    const b = parseInt(blueSlider.value);
    simulateRecount({r, b});
});

// ===== COUNTRY PRESETS CONFIG =====
const countrySystems = {
    india: {
        name: "India",
        system: "First-Past-The-Post",
        regions: 543,
        rules: "Single-member constituencies, winner takes all.",
        pipeline: [
            { emoji: '🗳', label: 'EVM Voting', title: 'EVM Casting', desc: 'Voters use Electronic Voting Machines (EVMs). VVPAT provides a physical audit trail.', warning: '⚠ Risk: EVM security concerns, long queues.' },
            { emoji: '🔒', label: 'Strong Room', title: 'Secure Storage', desc: 'EVMs are sealed and stored in "Strong Rooms" under 24/7 guard until counting day.', warning: '⚠ Risk: Tampering rumors, surveillance gaps.' }
        ]
    },
    usa: {
        name: "USA",
        system: "Electoral College",
        regions: 50,
        rules: "State-based winner-take-all (mostly). 270 to win.",
        pipeline: [
            { emoji: '📮', label: 'Mail-in/Early', title: 'Hybrid Casting', desc: 'Massive use of mail-in ballots. Signature verification is a key security step.', warning: '⚠ Risk: Slow mail processing, legal challenges.' },
            { emoji: '🔢', label: 'State Tally', title: 'State Certification', desc: 'Each state certifies results independently before electors meet.', warning: '⚠ Risk: Safe harbor deadlines, contested electors.' }
        ]
    },
    germany: {
        name: "Germany",
        system: "Mixed-Member Proportional",
        regions: 299,
        rules: "Two votes per person: one for local candidate, one for party list.",
        pipeline: [
            { emoji: '📄', label: 'Double Ballot', title: 'Dual Casting', desc: 'Voters mark two names. First vote is for local, second for party share.', warning: '⚠ Risk: Voter confusion with overhang seats.' },
            { emoji: '⚖', label: 'Equalization', title: 'Seat Balancing', desc: 'Extra "overhang" and "leveling" seats are added to ensure proportionality.', warning: '⚠ Risk: Parliament size can grow significantly.' }
        ]
    },
    australia: {
        name: "Australia",
        system: "Ranked Choice",
        regions: 151,
        rules: "Preferential voting. Mandatory participation.",
        pipeline: [
            { emoji: '🔢', label: 'Preferences', title: 'Ranking', desc: 'Voters MUST rank all candidates. Compulsory voting ensures high turnout.', warning: '⚠ Risk: Donkey voting (sequential ranking).' },
            { emoji: '🔄', label: 'Distribution', title: 'Preference Flow', desc: 'Lower-ranked candidates are eliminated; their votes flow to next preferences.', warning: '⚠ Risk: Complex tallying cycles.' }
        ]
    }
};

const presetSelector = document.getElementById('country-preset');

presetSelector.addEventListener('change', (e) => {
    const country = countrySystems[e.target.value];
    applyCountryPreset(country);
});

function applyCountryPreset(config) {
    // Update labels and simulation variables
    console.log(`Switching to ${config.name} system: ${config.system}`);
    
    // Update Pipeline UI (re-injecting with new context if needed)
    // For this version, we will update the description and add a warning
    addWarning(`SYSTEM UPDATE: Loaded ${config.name} model (${config.system}).`);
    
    // Update simulation logic constants
    // (In a real app, this would change the math in calculateConfidence or rcv loops)
}

// Initial application
applyCountryPreset(countrySystems.india);

// ===== INIT =====
buildPipeline();
setupBallot();

// ===== SCROLL ANIMATIONS =====
function checkScroll() {
    document.querySelectorAll(".fade-up").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) el.classList.add("visible");
    });
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    document.getElementById("progress-bar").style.width = Math.min((winScroll / height) * 100, 100) + "%";
}
window.addEventListener("scroll", checkScroll);

// ===== HERO START =====
document.getElementById("start-btn").addEventListener("click", () => {
    const hero = document.getElementById("hero");
    hero.style.opacity = "0";
    setTimeout(() => {
        hero.classList.add("hidden");
        document.getElementById("main-content").classList.remove("hidden");
        window.scrollTo({ top: 0 });
        checkScroll();
    }, 600);
});

function resetStats() {
    stats = { total: 0, rejected: 0, pending: 0 };
    updateStats();
}

async function simulateDelay(stepName) {
    if (!isFailureMode) return 800;
    const delay = Math.random() * 2000 + 1000;
    addWarning(`Delay detected in ${stepName}: Transport lag +${Math.round(delay)}ms`);
    return delay;
}

function simulateRejection() {
    if (!isFailureMode) return false;
    const rejected = Math.random() < 0.05; // 5% rejection rate
    if (rejected) {
        stats.rejected++;
        addWarning("Machine Error: Ballot rejected due to improper marking.");
    }
    return rejected;
}

function simulateRecount(votes) {
    if (!isFailureMode) return;
    const margin = Math.abs(votes.r - votes.b);
    if (margin < 2) {
        addWarning(`CRITICAL: Margin < 2% (${margin}%). Triggering automatic recount...`);
        launchConfetti(); // Visual cue for recount start
    }
}

// Override setupBallot to include failure logic
function setupBallot() {
    const candidates = document.querySelectorAll(".ballot-candidate");
    const castBtn = document.getElementById("cast-vote-btn");
    candidates.forEach(c => {
        c.addEventListener("click", () => {
            candidates.forEach(x => x.classList.remove("selected"));
            c.classList.add("selected");
            selectedCandidate = c.dataset.candidate;
            castBtn.disabled = false;
        });
    });
    castBtn.addEventListener("click", async () => {
        if (!selectedCandidate) return;
        castBtn.disabled = true;
        castBtn.innerHTML = "<span>Casting...</span>";
        
        const journey = document.getElementById("ballot-journey");
        const tooltip = document.getElementById("ballot-tooltip");
        journey.classList.remove("hidden");
        
        const steps = document.querySelectorAll(".journey-step");
        stats.pending++;
        updateStats();

        for (let i = 0; i < steps.length; i++) {
            const s = steps[i];
            const stepName = s.querySelector("span").textContent;
            
            const delay = await simulateDelay(stepName);
            await new Promise(r => setTimeout(r, delay));
            
            s.classList.add("active");
            
            // Rejection logic at "Counted" step
            if (i === 3 && simulateRejection()) {
                castBtn.innerHTML = "<span style=\"color:#EF4444\">Ballot Rejected!</span>";
                addWarning("Process Terminated: Ballot discarded.");
                stats.pending--;
                updateStats();
                return;
            }
        }

        stats.total++;
        stats.pending--;
        updateStats();
        
        tooltip.classList.remove("hidden");
        launchConfetti();
        castBtn.innerHTML = "<span>Vote Cast! ✓</span>";
        castBtn.style.background = "linear-gradient(135deg, #10B981, #059669)";
    });
}


// ===== ELECTION MAP LOGIC =====
const regionData = {
    "North": { red: 45, blue: 30, yellow: 25, leading: "red", pop: "12.5M" },
    "East": { red: 20, blue: 55, yellow: 25, leading: "blue", pop: "8.2M" },
    "West": { red: 35, blue: 35, yellow: 30, leading: "yellow", pop: "10.1M" },
    "South": { red: 50, blue: 20, yellow: 30, leading: "red", pop: "15.4M" }
};

let currentRegion = null;

const mapRegions = document.querySelectorAll(".map-region");
const mapTooltip = document.getElementById("map-tooltip");
const regionNameDisplay = document.getElementById("region-name");
const regionStatsDisplay = document.getElementById("region-stats");

function initMap() {
    mapRegions.forEach(region => {
        const id = region.dataset.region;
        const data = regionData[id];
        
        // Initial color based on leader
        const colors = { red: "rgba(239, 68, 68, 0.4)", blue: "rgba(59, 130, 246, 0.4)", yellow: "rgba(245, 158, 11, 0.4)" };
        region.setAttribute("fill", colors[data.leading]);
        region.style.fill = colors[data.leading]; // Explicitly set style

        region.addEventListener("mouseenter", (e) => {
            const rect = e.target.getBoundingClientRect();
            mapTooltip.style.left = `${e.clientX + 15}px`;
            mapTooltip.style.top = `${e.clientY + 15}px`;
            mapTooltip.innerHTML = `<strong>${id}</strong><br>Leading: ${data.leading.toUpperCase()}`;
            mapTooltip.classList.remove("hidden");
        });

        region.addEventListener("mousemove", (e) => {
            mapTooltip.style.left = `${e.clientX + 15}px`;
            mapTooltip.style.top = `${e.clientY + 15}px`;
        });

        region.addEventListener("mouseleave", () => {
            mapTooltip.classList.add("hidden");
        });

        region.addEventListener("click", () => {
            // Remove active class from all
            mapRegions.forEach(r => r.classList.remove("active-region"));
            region.classList.add("active-region");
            currentRegion = id;
            showRegionDetails(id, data);
        });
    });
}

function showRegionDetails(id, data) {
    regionNameDisplay.textContent = `${id} Region Details`;
    regionStatsDisplay.innerHTML = `
        <div class="region-stat-row">
            <span class="region-stat-label">Population</span>
            <span class="region-stat-value">${data.pop}</span>
        </div>
        <div class="region-stat-row">
            <span class="region-stat-label" style="color:#EF4444">Red Party</span>
            <span class="region-stat-value">${data.red}%</span>
        </div>
        <div class="region-stat-row">
            <span class="region-stat-label" style="color:#3B82F6">Blue Party</span>
            <span class="region-stat-value">${data.blue}%</span>
        </div>
        <div class="region-stat-row">
            <span class="region-stat-label" style="color:#F59E0B">Yellow Party</span>
            <span class="region-stat-value">${data.yellow}%</span>
        </div>
        <div class="region-stat-row" style="margin-top:1rem; border-top:2px solid var(--border-color)">
            <span class="region-stat-label">Projected Winner</span>
            <span class="region-stat-value" style="color:var(--accent-3)">${data.leading.toUpperCase()}</span>
        </div>
    `;
    
    // Smooth transition
    regionStatsDisplay.style.opacity = "0";
    regionStatsDisplay.style.transform = "translateY(10px)";
    setTimeout(() => {
        regionStatsDisplay.style.transition = "all 0.4s ease";
        regionStatsDisplay.style.opacity = "1";
        regionStatsDisplay.style.transform = "translateY(0)";
    }, 50);
}

// Call map init
initMap();

