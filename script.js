// Global data storage
let websiteData = {
    destinations: [],
    gallery: [],
    news: [],
    taglines: []
};

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "uttarakhand2024"
};

// GitHub connection status
let githubConnected = false;

// Initialize the website
document.addEventListener('DOMContentLoaded', async function() {
    await initializeWebsite();
});

// Initialize website
async function initializeWebsite() {
    try {
        showLoading('🚀 Initializing Uttarakhand Hills Website...');
        
        // Initialize GitHub connection
        githubConnected = await githubService.initialize();
        
        if (githubConnected) {
            showNotification('✅ Connected to GitHub successfully!', 'success');
        } else {
            showNotification('⚠️ GitHub connection failed. Using local mode.', 'warning');
        }
        
        // Load data
        await loadData();
        initializeTaglineRotation();
        initializePageSpecificFunctions();
        
        hideLoading();
        
    } catch (error) {
        console.error('Failed to initialize website:', error);
        hideLoading();
        showNotification('⚠️ Using default data mode', 'info');
        
        // Load default data as fallback
        websiteData = githubService.getDefaultData();
        updatePageContent();
        initializeTaglineRotation();
        initializePageSpecificFunctions();
    }
}

// Load data from GitHub
async function loadData() {
    try {
        showLoading('📥 Loading data from GitHub...');
        websiteData = await githubService.loadAllData();
        updatePageContent();
        hideLoading();
        
    } catch (error) {
        console.error('Failed to load data:', error);
        hideLoading();
        websiteData = githubService.getDefaultData();
        updatePageContent();
        showNotification('📋 Loaded default data', 'info');
    }
}

// Save data to GitHub
async function saveData(dataType = null) {
    try {
        showLoading('💾 Saving to GitHub...');
        
        if (dataType) {
            await githubService.writeData(`data/${dataType}.json`, websiteData[dataType]);
        } else {
            await githubService.saveAllData(websiteData);
        }
        
        hideLoading();
        showNotification('✅ Data saved to GitHub successfully!', 'success');
        return true;
        
    } catch (error) {
        console.error('Failed to save data:', error);
        hideLoading();
        showNotification('❌ Failed to save to GitHub', 'error');
        return false;
    }
}

// Update tagline every 2 minutes
function initializeTaglineRotation() {
    updateTagline();
    setInterval(updateTagline, 120000);
}

// Update the tagline display
function updateTagline() {
    const taglineElement = document.getElementById('tagline');
    if (taglineElement && websiteData.taglines.length > 0) {
        const randomIndex = Math.floor(Math.random() * websiteData.taglines.length);
        taglineElement.textContent = websiteData.taglines[randomIndex];
    }
}

// Initialize page-specific functions
function initializePageSpecificFunctions() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'gallery.html':
            initializeGalleryPage();
            break;
        case 'admin.html':
            initializeAdminPage();
            break;
    }
}

// Home page functions
function initializeHomePage() {
    updateGitHubStatus();
}

// Update GitHub connection status display
function updateGitHubStatus() {
    const statusElements = document.querySelectorAll('.github-status');
    statusElements.forEach(element => {
        element.innerHTML = githubConnected ? 
            '<span style="color: #38b000"><i class="fas fa-check-circle"></i> GitHub Connected</span>' :
            '<span style="color: #ff6b6b"><i class="fas fa-exclamation-triangle"></i> Local Mode</span>';
    });
}

// Gallery page functions
function initializeGalleryPage() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            filterGallery(filter);
        });
    });
}

// Filter gallery items
function filterGallery(category) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Admin page functions
function initializeAdminPage() {
    updateGitHubStatus();
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                document.getElementById('login-section').style.display = 'none';
                document.getElementById('admin-dashboard').style.display = 'block';
                loadAdminData();
                showNotification('🔓 Admin access granted', 'success');
            } else {
                showNotification('❌ Invalid credentials', 'error');
            }
        });
    }
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Form submissions
    const destinationForm = document.getElementById('destination-form');
    if (destinationForm) destinationForm.addEventListener('submit', (e) => { e.preventDefault(); addDestination(); });
    
    const galleryForm = document.getElementById('gallery-form');
    if (galleryForm) galleryForm.addEventListener('submit', (e) => { e.preventDefault(); addGalleryItem(); });
    
    const newsForm = document.getElementById('news-form');
    if (newsForm) newsForm.addEventListener('submit', (e) => { e.preventDefault(); addNewsItem(); });
    
    const taglineForm = document.getElementById('tagline-form');
    if (taglineForm) taglineForm.addEventListener('submit', (e) => { e.preventDefault(); addTagline(); });
}

// Load data into admin panel
function loadAdminData() {
    loadDestinationsList();
    loadGalleryList();
    loadNewsList();
    loadTaglinesList();
}

// Add a new destination
async function addDestination() {
    const name = document.getElementById('dest-name').value;
    const description = document.getElementById('dest-description').value;
    const image = document.getElementById('dest-image').value;
    const region = document.getElementById('dest-region').value;
    
    if (!name || !description || !image || !region) {
        showNotification('❌ Please fill all fields', 'error');
        return;
    }
    
    const newDestination = {
        id: Date.now(),
        name,
        description,
        image,
        region
    };
    
    websiteData.destinations.push(newDestination);
    const saved = await saveData('destinations');
    if (saved) {
        loadDestinationsList();
        document.getElementById('destination-form').reset();
        updatePageContent();
    }
}

// Load destinations in admin panel
function loadDestinationsList() {
    const listElement = document.getElementById('destinations-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    if (websiteData.destinations.length === 0) {
        listElement.innerHTML = '<p>No destinations added yet.</p>';
        return;
    }
    
    websiteData.destinations.forEach(destination => {
        const item = document.createElement('div');
        item.className = 'item-card';
        item.innerHTML = `
            <div>
                <h4>${destination.name}</h4>
                <p>${destination.region} - ${destination.description.substring(0, 50)}...</p>
            </div>
            <button class="delete-btn" onclick="deleteDestination(${destination.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
        listElement.appendChild(item);
    });
}

// Delete a destination
async function deleteDestination(id) {
    if (confirm('Are you sure you want to delete this destination?')) {
        websiteData.destinations = websiteData.destinations.filter(dest => dest.id !== id);
        const saved = await saveData('destinations');
        if (saved) {
            loadDestinationsList();
            updatePageContent();
        }
    }
}

// Add a new gallery item
async function addGalleryItem() {
    const title = document.getElementById('gallery-title').value;
    const image = document.getElementById('gallery-image').value;
    const category = document.getElementById('gallery-category').value;
    
    if (!title || !image || !category) {
        showNotification('❌ Please fill all fields', 'error');
        return;
    }
    
    const newGalleryItem = {
        id: Date.now(),
        title,
        image,
        category
    };
    
    websiteData.gallery.push(newGalleryItem);
    const saved = await saveData('gallery');
    if (saved) {
        loadGalleryList();
        document.getElementById('gallery-form').reset();
        updatePageContent();
    }
}

// Load gallery items in admin panel
function loadGalleryList() {
    const listElement = document.getElementById('gallery-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    if (websiteData.gallery.length === 0) {
        listElement.innerHTML = '<p>No gallery items added yet.</p>';
        return;
    }
    
    websiteData.gallery.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'item-card';
        listItem.innerHTML = `
            <div>
                <h4>${item.title}</h4>
                <p>Category: ${item.category}</p>
            </div>
            <button class="delete-btn" onclick="deleteGalleryItem(${item.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
        listElement.appendChild(listItem);
    });
}

// Delete a gallery item
async function deleteGalleryItem(id) {
    if (confirm('Are you sure you want to delete this gallery item?')) {
        websiteData.gallery = websiteData.gallery.filter(item => item.id !== id);
        const saved = await saveData('gallery');
        if (saved) {
            loadGalleryList();
            updatePageContent();
        }
    }
}

// Add a news item
async function addNewsItem() {
    const title = document.getElementById('news-title').value;
    const content = document.getElementById('news-content').value;
    const date = document.getElementById('news-date').value;
    
    if (!title || !content || !date) {
        showNotification('❌ Please fill all fields', 'error');
        return;
    }
    
    const newNewsItem = {
        id: Date.now(),
        title,
        content,
        date
    };
    
    websiteData.news.push(newNewsItem);
    const saved = await saveData('news');
    if (saved) {
        loadNewsList();
        document.getElementById('news-form').reset();
        updatePageContent();
    }
}

// Load news items in admin panel
function loadNewsList() {
    const listElement = document.getElementById('news-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    if (websiteData.news.length === 0) {
        listElement.innerHTML = '<p>No news items added yet.</p>';
        return;
    }
    
    websiteData.news.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'item-card';
        listItem.innerHTML = `
            <div>
                <h4>${item.title}</h4>
                <p>Date: ${item.date}</p>
            </div>
            <button class="delete-btn" onclick="deleteNewsItem(${item.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
        listElement.appendChild(listItem);
    });
}

// Delete a news item
async function deleteNewsItem(id) {
    if (confirm('Are you sure you want to delete this news item?')) {
        websiteData.news = websiteData.news.filter(item => item.id !== id);
        const saved = await saveData('news');
        if (saved) {
            loadNewsList();
            updatePageContent();
        }
    }
}

// Add a tagline
async function addTagline() {
    const tagline = document.getElementById('new-tagline').value;
    
    if (!tagline) {
        showNotification('❌ Please enter a tagline', 'error');
        return;
    }
    
    websiteData.taglines.push(tagline);
    const saved = await saveData('taglines');
    if (saved) {
        loadTaglinesList();
        document.getElementById('tagline-form').reset();
    }
}

// Load taglines in admin panel
function loadTaglinesList() {
    const listElement = document.getElementById('taglines-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    if (websiteData.taglines.length === 0) {
        listElement.innerHTML = '<p>No taglines added yet.</p>';
        return;
    }
    
    websiteData.taglines.forEach((tagline, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'item-card';
        listItem.innerHTML = `
            <div>
                <p>"${tagline}"</p>
            </div>
            <button class="delete-btn" onclick="deleteTagline(${index})">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
        listElement.appendChild(listItem);
    });
}

// Delete a tagline
async function deleteTagline(index) {
    if (confirm('Are you sure you want to delete this tagline?')) {
        websiteData.taglines.splice(index, 1);
        await saveData('taglines');
        loadTaglinesList();
    }
}

// Update page content based on current page
function updatePageContent() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            updateHomePage();
            break;
        case 'gallery.html':
            updateGalleryPage();
            break;
    }
}

// Update home page content
function updateHomePage() {
    updateDestinations();
    updateNews();
}

// Update destinations on home page
function updateDestinations() {
    const gridElement = document.getElementById('destinations-grid');
    if (!gridElement) return;
    
    gridElement.innerHTML = '';
    
    if (websiteData.destinations.length === 0) {
        gridElement.innerHTML = '<p>No destinations available. Add some in the admin panel.</p>';
        return;
    }
    
    websiteData.destinations.forEach(destination => {
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

// Update news on home page
function updateNews() {
    const gridElement = document.getElementById('news-grid');
    if (!gridElement) return;
    
    gridElement.innerHTML = '';
    
    if (websiteData.news.length === 0) {
        gridElement.innerHTML = '<p>No news available at the moment.</p>';
        return;
    }
    
    websiteData.news.forEach(newsItem => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <div class="news-content">
                <h3>${newsItem.title}</h3>
                <div class="news-date">${formatDate(newsItem.date)}</div>
                <p>${newsItem.content}</p>
            </div>
        `;
        gridElement.appendChild(card);
    });
}

// Update gallery page
function updateGalleryPage() {
    const gridElement = document.getElementById('gallery-grid');
    if (!gridElement) return;
    
    gridElement.innerHTML = '';
    
    if (websiteData.gallery.length === 0) {
        gridElement.innerHTML = '<p>No gallery items available. Add some in the admin panel.</p>';
        return;
    }
    
    websiteData.gallery.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', item.category);
        galleryItem.style.backgroundImage = `url('${item.image}')`;
        galleryItem.innerHTML = `
            <div class="gallery-overlay">
                <h4>${item.title}</h4>
                <small>${item.category}</small>
            </div>
        `;
        gridElement.appendChild(galleryItem);
    });
}

// Utility function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Loading indicator functions
function showLoading(message = 'Loading...') {
    hideLoading();
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 16px;
        font-weight: 500;
    `;
    loadingDiv.innerHTML = `
        <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid #57cc99; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite;"></div>
        <span>${message}</span>
    `;
    
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        max-width: 400px;
    `;
    
    if (type === 'success') notification.style.background = '#38b000';
    else if (type === 'error') notification.style.background = '#ff6b6b';
    else if (type === 'warning') notification.style.background = '#ff9e00';
    else notification.style.background = '#1a5f7a';
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Add spinner animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
