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

// Initialize the website
document.addEventListener('DOMContentLoaded', async function() {
    await initializeWebsite();
});

// Initialize website
async function initializeWebsite() {
    try {
        showLoading('🚀 Starting Uttarakhand Hills Website...');
        
        // Load data
        await loadData();
        initializeTaglineRotation();
        initializePageSpecificFunctions();
        
        hideLoading();
        showNotification('🏔️ Welcome to Uttarakhand Hills!', 'success');
        
    } catch (error) {
        console.error('Failed to initialize website:', error);
        hideLoading();
        
        // Load default data as fallback
        websiteData = githubService.getDefaultData();
        updatePageContent();
        initializeTaglineRotation();
        initializePageSpecificFunctions();
        
        showNotification('📋 Using default data', 'info');
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
    }
}

// Save data and prepare for GitHub upload
async function saveData(dataType = null) {
    try {
        showLoading('💾 Preparing data for GitHub...');
        
        if (dataType) {
            await githubService.saveData(`data/${dataType}.json`, websiteData[dataType]);
        } else {
            await githubService.saveAllData(websiteData);
        }
        
        hideLoading();
        
        // Show upload instructions
        showUploadInstructions(dataType);
        return true;
        
    } catch (error) {
        console.error('Failed to save data:', error);
        hideLoading();
        showNotification('❌ Failed to prepare data for upload', 'error');
        return false;
    }
}

// Show upload instructions to user
function showUploadInstructions(dataType) {
    const repoURL = githubService.getRepoURL();
    const fileName = dataType ? `${dataType}.json` : 'all files';
    
    const message = `
        ✅ Data prepared successfully!
        
        📁 To upload to GitHub:
        1. Go to: ${repoURL}
        2. Click "Add file" → "Upload files"
        3. Upload the downloaded JSON file(s)
        4. Commit changes with message "Update ${fileName}"
        5. Your changes will be live immediately!
        
        💡 The files have been downloaded to your computer.
    `;
    
    // Create modal with instructions
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10001;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    modal.innerHTML = `
        <h3 style="color: #1a5f7a; margin-bottom: 20px;">📤 Upload to GitHub</h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; font-size: 14px; line-height: 1.5; white-space: pre-line;">
            ${message}
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button onclick="this.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Close
            </button>
            <button onclick="window.open('${repoURL}', '_blank'); this.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #1a5f7a; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Open GitHub
            </button>
        </div>
    `;
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
    `;
    
    overlay.onclick = () => {
        modal.remove();
        overlay.remove();
    };
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
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
    // Add GitHub repo info
    addGitHubInfo();
}

// Add GitHub repository information
function addGitHubInfo() {
    const repoURL = githubService.getRepoURL();
    const infoDiv = document.createElement('div');
    infoDiv.style.cssText = `
        text-align: center;
        margin: 20px 0;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 5px;
        font-size: 14px;
    `;
    infoDiv.innerHTML = `
        <span>📁 Data loaded from: </span>
        <a href="${repoURL}" target="_blank" style="color: #1a5f7a; text-decoration: none;">
            GitHub Repository
        </a>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.appendChild(infoDiv);
    }
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
    // Add GitHub upload section
    addGitHubUploadSection();
    
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

// Add GitHub upload section to admin panel
function addGitHubUploadSection() {
    const adminDashboard = document.getElementById('admin-dashboard');
    if (adminDashboard) {
        const uploadSection = document.createElement('div');
        uploadSection.className = 'upload-section';
        uploadSection.style.cssText = `
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #1a5f7a;
        `;
        
        uploadSection.innerHTML = `
            <h3 style="color: #1a5f7a; margin-bottom: 15px;">📤 GitHub Upload</h3>
            <p style="margin-bottom: 15px; color: #555;">
                After making changes, upload the data files to GitHub to make them live on your website.
            </p>
            <button onclick="uploadAllToGitHub()" class="btn btn-primary" style="margin-right: 10px;">
                <i class="fas fa-cloud-upload-alt"></i> Upload All to GitHub
            </button>
            <button onclick="showUploadInstructions()" class="btn" style="background: #6c757d; color: white;">
                <i class="fas fa-question-circle"></i> Upload Guide
            </button>
        `;
        
        adminDashboard.insertBefore(uploadSection, adminDashboard.firstChild);
    }
}

// Upload all data to GitHub
async function uploadAllToGitHub() {
    const saved = await saveData();
    if (saved) {
        showNotification('✅ All data prepared for GitHub upload!', 'success');
    }
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
    await saveData('destinations');
    loadDestinationsList();
    document.getElementById('destination-form').reset();
    updatePageContent();
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
        await saveData('destinations');
        loadDestinationsList();
        updatePageContent();
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
    await saveData('gallery');
    loadGalleryList();
    document.getElementById('gallery-form').reset();
    updatePageContent();
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
        await saveData('gallery');
        loadGalleryList();
        updatePageContent();
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
    await saveData('news');
    loadNewsList();
    document.getElementById('news-form').reset();
    updatePageContent();
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
        await saveData('news');
        loadNewsList();
        updatePageContent();
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
    await saveData('taglines');
    loadTaglinesList();
    document.getElementById('tagline-form').reset();
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
