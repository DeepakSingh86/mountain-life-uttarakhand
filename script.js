// Global data storage
let websiteData = {
    destinations: [],
    gallery: [],
    news: [],
    testimonials: [],
    taglines: [],
    stats: {
        destinations: 0,
        visitors: 0,
        years: 0,
        satisfaction: 0
    }
};

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "uttarakhand2024"
};

// GitHub integration simulation
const GITHUB_CONFIG = {
    repo: "uttarakhand-travel-data",
    branch: "main",
    dataFolder: "data"
};

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeTaglineRotation();
    initializePageSpecificFunctions();
    initializeStatsAnimation();
});

// Load data from localStorage or JSON
function loadData() {
    const savedData = localStorage.getItem('uttarakhandWebsiteData');

    if (savedData) {
        websiteData = JSON.parse(savedData);
        updatePageContent();
    } else {
        // Load default data from JSON
        fetch('/DeepakSingh86/mountain-life-uttarakhand/data/destinations.json')
            .then(res => res.json())
            .then(data => {
                if(data.destinations) websiteData.destinations = data.destinations;
                if(data.gallery) websiteData.gallery = data.gallery;
                if(data.news) websiteData.news = data.news;
                if(data.testimonials) websiteData.testimonials = data.testimonials;
                if(data.taglines) websiteData.taglines = data.taglines;
                if(data.stats) websiteData.stats = data.stats;
                saveData();
                updatePageContent();
            })
            .catch(err => console.error('Error loading JSON:', err));
    }
}

// Save data to localStorage and simulate GitHub save
function saveData() {
    localStorage.setItem('uttarakhandWebsiteData', JSON.stringify(websiteData));
    simulateGitHubSave();
}

// Simulate GitHub data saving
function simulateGitHubSave() {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Data would be saved to GitHub: ${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.dataFolder}/`);
}

// Tagline rotation
function initializeTaglineRotation() {
    updateTagline();
    setInterval(updateTagline, 120000); // every 2 minutes
}

function updateTagline() {
    const taglineElement = document.getElementById('tagline');
    if(taglineElement && websiteData.taglines.length > 0) {
        const randomIndex = Math.floor(Math.random() * websiteData.taglines.length);
        taglineElement.textContent = websiteData.taglines[randomIndex];
    }
}

// Stats animation
function initializeStatsAnimation() {
    if(window.location.pathname.includes('about.html')) {
        animateStats();
    }
}

function animateStats() {
    const stats = websiteData.stats;
    animateValue('destinations-count', 0, stats.destinations, 2000);
    animateValue('visitors-count', 0, stats.visitors, 2000);
    animateValue('years-count', 0, stats.years, 2000);
    animateValue('satisfaction-count', 0, stats.satisfaction, 2000, true);
}

function animateValue(id, start, end, duration, isPercentage=false){
    const element = document.getElementById(id);
    if(!element) return;
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        element.innerHTML = isPercentage ? current + "%" : formatNumber(current);
        if(current === end) clearInterval(timer);
    }, stepTime);
}

function formatNumber(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Page-specific initialization
function initializePageSpecificFunctions() {
    const currentPage = window.location.pathname.split('/').pop();
    switch(currentPage){
        case 'index.html':
        case '':
            initializeHomePage(); break;
        case 'gallery.html':
            initializeGalleryPage(); break;
        case 'admin.html':
            initializeAdminPage(); break;
    }
}

function initializeHomePage(){}

function initializeGalleryPage(){
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button=>{
        button.addEventListener('click', function(){
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            filterGallery(filter);
        });
    });
}

function filterGallery(category){
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item=>{
        if(category==='all'||item.getAttribute('data-category')===category){
            item.style.display='block';
        } else item.style.display='none';
    });
}

// Admin page functions
function initializeAdminPage(){
    // Login
    const loginForm = document.getElementById('login-form');
    if(loginForm){
        loginForm.addEventListener('submit', function(e){
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if(username===ADMIN_CREDENTIALS.username && password===ADMIN_CREDENTIALS.password){
                document.getElementById('login-section').style.display='none';
                document.getElementById('admin-dashboard').style.display='block';
                loadAdminData();
            } else alert('Invalid credentials!');
        });
    }
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn){
        logoutBtn.addEventListener('click', ()=>{
            document.getElementById('login-section').style.display='block';
            document.getElementById('admin-dashboard').style.display='none';
            document.getElementById('login-form').reset();
        });
    }
    // Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button=>{
        button.addEventListener('click', function(){
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
    // Forms
    const forms = ['destination','gallery','news','testimonial','tagline'];
    forms.forEach(form=>{
        const f = document.getElementById(form+'-form');
        if(f) f.addEventListener('submit', e=>{ e.preventDefault(); window['add'+capitalize(form)](); });
    });
    // Export button
    const exportBtn = document.getElementById('export-btn');
    if(exportBtn) exportBtn.addEventListener('click', exportData);
}

function capitalize(str){ return str.charAt(0).toUpperCase()+str.slice(1); }

// Load admin data
function loadAdminData(){
    loadDestinationsList();
    loadGalleryList();
    loadNewsList();
    loadTestimonialsList();
    loadTaglinesList();
}

// Add/load/delete functions for destinations, gallery, news, testimonials, taglines
// Ensure all `insertAdjacentHTML` and template literals are fixed

// Update page content
function updatePageContent() {
    const currentPage = window.location.pathname.split('/').pop();
    switch(currentPage){
        case 'index.html':
        case '':
            updateHomePage(); break;
        case 'gallery.html':
            updateGalleryPage(); break;
    }
}

// Update home page
function updateHomePage(){
    updateDestinations();
    updateNews();
    updateTestimonials();
}

// Update destinations on home page
function updateDestinations(){
    const gridElement = document.getElementById('destinations-grid');
    if(!gridElement) return;
    gridElement.innerHTML = '';
    websiteData.destinations.forEach(destination=>{
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.innerHTML = `
            <div class="destination-img" style="background-image: url('${destination.image}')"></div>
            <div class="destination-content">
                <h3>${destination.name}</h3>
                <div class="destination-region">${destination.region} Region</div>
                <p>${destination.description}</p>
            </div>
        `;
        gridElement.appendChild(card);
    });
}

// Similarly updateNews(), updateTestimonials(), updateGalleryPage() remain same

