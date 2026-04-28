// Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDAcKcg3alPOTH3FFGelYmsW7jcMMe2PLI",
    authDomain: "upnvjdatsystem.firebaseapp.com",
    projectId: "upnvjdatsystem",
    storageBucket: "upnvjdatsystem.firebasestorage.app",
    messagingSenderId: "57095309946",
    appId: "1:57095309946:web:b0e9f3f86380d549ffc9c3"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Status Bar Time
function updateStatusTime() {
    const el = document.getElementById('statusTime');
    if (el) {
        const update = () => { el.textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); };
        update(); setInterval(update, 60000);
    }
}

// Toast
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="color:${type === 'success' ? '#10b981' : '#ef4444'};"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Load News
async function loadNews() {
    const container = document.getElementById('newsList');
    if (!container) return;
    try {
        const snapshot = await db.collection('news').orderBy('date', 'desc').limit(3).get();
        container.innerHTML = '';
        snapshot.forEach(doc => {
            const d = doc.data();
            const date = d.date?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) || '';
            container.innerHTML += `
                <div class="news-card" onclick="location.href='app-berita-detail.html?id=${doc.id}'">
                    <img src="${d.image || 'https://via.placeholder.com/80/0088cc/ffffff?text=68'}" alt="">
                    <div class="news-info">
                        <div class="news-date"><i class="far fa-calendar"></i> ${date}</div>
                        <div class="news-title">${d.title}</div>
                        <div class="news-excerpt">${d.excerpt || ''}</div>
                    </div>
                </div>`;
        });
    } catch (e) { console.error(e); }
}

// Load News Full
async function loadNewsFull() {
    const container = document.getElementById('newsFullList');
    if (!container) return;
    try {
        const snapshot = await db.collection('news').orderBy('date', 'desc').limit(10).get();
        container.innerHTML = '';
        snapshot.forEach(doc => {
            const d = doc.data();
            const date = d.date?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) || '';
            container.innerHTML += `
                <div class="news-full-card" onclick="location.href='app-berita-detail.html?id=${doc.id}'">
                    <img src="${d.image || 'https://via.placeholder.com/400x200/0088cc/ffffff?text=68'}" alt="">
                    <div class="news-full-body">
                        <div class="news-date"><i class="far fa-calendar"></i> ${date}</div>
                        <h2>${d.title}</h2>
                        <p>${d.excerpt || d.content?.substring(0, 150) || ''}...</p>
                        <span style="color:var(--primary);font-weight:600;font-size:0.85rem;">Baca Selengkapnya →</span>
                    </div>
                </div>`;
        });
    } catch (e) { console.error(e); }
}

// Load Agenda
async function loadAgenda() {
    const container = document.getElementById('agendaList');
    if (!container) return;
    try {
        const today = new Date(); today.setHours(0,0,0,0);
        const snapshot = await db.collection('agenda').where('date', '>=', today).orderBy('date', 'asc').limit(3).get();
        container.innerHTML = '';
        snapshot.forEach(doc => {
            const d = doc.data();
            const date = d.date?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) || '';
            container.innerHTML += `
                <div class="agenda-card">
                    <span class="agenda-category">${d.category}</span>
                    <div class="agenda-title">${d.title}</div>
                    <div class="agenda-meta"><i class="far fa-clock"></i> ${d.time} • <i class="fas fa-map-marker-alt"></i> ${d.location} • ${date}</div>
                </div>`;
        });
    } catch (e) { console.error(e); }
}

// Load Agenda Full
async function loadAgendaFull(filter = 'all') {
    const container = document.getElementById('agendaFullList');
    if (!container) return;
    try {
        let query = db.collection('agenda').orderBy('date', 'asc');
        if (filter !== 'all') query = query.where('category', '==', filter);
        const snapshot = await query.limit(20).get();
        container.innerHTML = '';
        snapshot.forEach(doc => {
            const d = doc.data();
            const date = d.date?.toDate().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) || '';
            container.innerHTML += `
                <div class="agenda-card">
                    <span class="agenda-category">${d.category}</span>
                    <div class="agenda-title">${d.title}</div>
                    <div class="agenda-meta"><i class="far fa-clock"></i> ${d.time}</div>
                    <div class="agenda-meta"><i class="fas fa-map-marker-alt"></i> ${d.location}</div>
                    <div class="agenda-meta" style="margin-top:5px;color:var(--blue);"><i class="far fa-calendar-alt"></i> ${date}</div>
                </div>`;
        });
    } catch (e) { console.error(e); }
}

// Filter Chips
function setupFilterChips() {
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            loadAgendaFull(chip.dataset.filter);
        });
    });
}

// Load Gallery
async function loadGallery() {
    const container = document.getElementById('galleryGrid');
    if (!container) return;
    try {
        const snapshot = await db.collection('gallery').limit(12).get();
        container.innerHTML = '';
        snapshot.forEach(doc => {
            const d = doc.data();
            container.innerHTML += `
                <div class="gallery-item-app" onclick="openLightbox('${d.imageUrl}', '${d.caption}')">
                    <img src="${d.imageUrl}" alt="${d.caption}" loading="lazy">
                </div>`;
        });
    } catch (e) { container.innerHTML = '<p>Gagal memuat galeri</p>'; }
}

// Lightbox
function openLightbox(url, caption) {
    document.getElementById('lightbox').style.display = 'flex';
    document.getElementById('lightboxImg').src = url;
    document.getElementById('lightboxCaption').textContent = caption;
}
function closeLightbox() { document.getElementById('lightbox').style.display = 'none'; }

// Chat
function setupChat() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const container = document.getElementById('chatMessages');
    
    sendBtn?.addEventListener('click', () => {
        const msg = input.value.trim();
        if (!msg) return;
        container.innerHTML += `<div class="chat-user-msg">${msg}</div>`;
        input.value = '';
        container.scrollTop = container.scrollHeight;
    });
    
    input?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    updateStatusTime();
    loadNews();
    loadNewsFull();
    loadAgenda();
    loadAgendaFull();
    loadGallery();
    setupFilterChips();
    setupChat();
    
    document.getElementById('fabChat')?.addEventListener('click', () => { location.href = 'app-chat.html'; });
});

console.log('✅ App SMAN 68 Jakarta - All Features Loaded');
