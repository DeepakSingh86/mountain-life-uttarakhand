// GitHub Integration for Mountain Life Uttarakhand

const GITHUB_CONFIG = {
    username: 'DeepakSingh86',
    repo: 'mountain-life-uttarakhand',
    branch: 'main',
    token: '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' // For write operations
};

// Data structure for the website
let websiteData = {
    articles: [],
    images: [],
    events: [],
    locations: [],
    settings: {}
};

// Initialize GitHub integration
async function initializeGitHubIntegration() {
    console.log('Initializing GitHub integration...');
    
    try {
        // Load all data from GitHub
        await loadAllDataFromGitHub();
        
        // Initialize the appropriate interface
        if (window.location.pathname.includes('admin.html')) {
            initializeAdminGitHub();
        } else {
            initializeFrontendGitHub();
        }
        
        console.log('GitHub integration initialized successfully');
    } catch (error) {
        console.error('Error initializing GitHub integration:', error);
        showNotification('Failed to connect to GitHub. Using local data.', 'error');
        loadLocalFallbackData();
    }
}

// Load all data from GitHub
async function loadAllDataFromGitHub() {
    try {
        // Load articles
        websiteData.articles = await loadJSONFromGitHub('data/articles.json');
        
        // Load events
        websiteData.events = await loadJSONFromGitHub('data/events.json');
        
        // Load locations
        websiteData.locations = await loadJSONFromGitHub('data/locations.json');
        
        // Load settings
        websiteData.settings = await loadJSONFromGitHub('data/settings.json');
        
        // Load images list
        websiteData.images = await loadImagesFromGitHub();
        
        console.log('All data loaded from GitHub:', websiteData);
    } catch (error) {
        console.error('Error loading data from GitHub:', error);
        throw error;
    }
}

// Load JSON file from GitHub
async function loadJSONFromGitHub(filePath) {
    try {
        const url = `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${filePath}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.warn(`Could not load ${filePath} from GitHub:`, error);
        
        // Return empty default data
        if (filePath.includes('articles.json')) return getDefaultArticles();
        if (filePath.includes('events.json')) return getDefaultEvents();
        if (filePath.includes('locations.json')) return getDefaultLocations();
        if (filePath.includes('settings.json')) return getDefaultSettings();
        
        return {};
    }
}

// Load images from GitHub
async function loadImagesFromGitHub() {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/images?ref=${GITHUB_CONFIG.branch}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to load images from GitHub');
        }
        
        const data = await response.json();
        return data
            .filter(item => item.type === 'file')
            .map(item => ({
                name: item.name,
                url: item.download_url,
                path: item.path,
                size: item.size,
                type: 'image'
            }));
    } catch (error) {
        console.warn('Could not load images from GitHub:', error);
        return getDefaultImages();
    }
}

// Save data to GitHub
async function saveToGitHub(filePath, content, commitMessage = 'Update content') {
    if (!GITHUB_CONFIG.token) {
        console.warn('GitHub token not configured. Cannot save changes.');
        showNotification('GitHub token not configured. Changes will not be saved.', 'warning');
        return false;
    }
    
    try {
        // Get the current file SHA (required for updates)
        let sha = null;
        try {
            const currentFile = await getFileFromGitHub(filePath);
            sha = currentFile.sha;
        } catch (error) {
            // File doesn't exist yet, that's fine
        }
        
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: commitMessage,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
                sha: sha,
                branch: GITHUB_CONFIG.branch
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to save ${filePath}: ${response.status}`);
        }
        
        console.log(`Successfully saved ${filePath} to GitHub`);
        return true;
    } catch (error) {
        console.error(`Error saving ${filePath} to GitHub:`, error);
        showNotification(`Failed to save ${filePath}: ${error.message}`, 'error');
        return false;
    }
}

// Get file info from GitHub
async function getFileFromGitHub(filePath) {
    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${filePath}?ref=${GITHUB_CONFIG.branch}`,
        {
            headers: GITHUB_CONFIG.token ? {
                'Authorization': `token ${GITHUB_CONFIG.token}`
            } : {}
        }
    );
    
    if (!response.ok) {
        throw new Error(`Failed to get file ${filePath}: ${response.status}`);
    }
    
    return await response.json();
}

// Upload image to GitHub
async function uploadImageToGitHub(file, filename) {
    if (!GITHUB_CONFIG.token) {
        console.warn('GitHub token not configured. Cannot upload images.');
        showNotification('GitHub token not configured. Cannot upload images.', 'warning');
        return null;
    }
    
    try {
        // Convert file to base64
        const base64Content = await fileToBase64(file);
        
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/images/${filename}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Upload image: ${filename}`,
                content: base64Content.split(',')[1], // Remove data URL prefix
                branch: GITHUB_CONFIG.branch
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to upload image: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Image uploaded successfully:', result);
        
        // Return the download URL
        return result.content.download_url;
    } catch (error) {
        console.error('Error uploading image to GitHub:', error);
        showNotification(`Failed to upload image: ${error.message}`, 'error');
        return null;
    }
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Create folder in GitHub
async function createFolderInGitHub(folderPath) {
    if (!GITHUB_CONFIG.token) {
        console.warn('GitHub token not configured. Cannot create folder.');
        return false;
    }
    
    try {
        // GitHub doesn't have empty folders, so we create a .gitkeep file
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${folderPath}/.gitkeep`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Create folder: ${folderPath}`,
                content: btoa(''), // Empty file
                branch: GITHUB_CONFIG.branch
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create folder: ${response.status}`);
        }
        
        console.log(`Folder ${folderPath} created successfully`);
        return true;
    } catch (error) {
        console.error(`Error creating folder ${folderPath}:`, error);
        return false;
    }
}

// Initialize frontend with GitHub data
function initializeFrontendGitHub() {
    console.log('Initializing frontend with GitHub data...');
    
    // The main script.js will use websiteData
    window.websiteData = websiteData;
    
    // Trigger data loaded event
    window.dispatchEvent(new CustomEvent('githubDataLoaded', {
        detail: websiteData
    }));
}

// Initialize admin with GitHub data
function initializeAdminGitHub() {
    console.log('Initializing admin with GitHub data...');
    
    // Make websiteData available globally for admin
    window.websiteData = websiteData;
    
    // Update admin UI with loaded data
    updateAdminUI();
    
    // Set up GitHub operations for admin
    setupAdminGitHubOperations();
}

// Update admin UI with loaded data
function updateAdminUI() {
    // Update statistics
    document.getElementById('articlesCount').textContent = websiteData.articles.length;
    document.getElementById('imagesCount').textContent = websiteData.images.length;
    document.getElementById('eventsCount').textContent = websiteData.events.length;
    document.getElementById('locationsCount').textContent = websiteData.locations.length;
    
    // Update file explorer
    updateFileExplorer();
    
    // Update recent articles
    updateRecentArticlesList();
}

// Setup admin GitHub operations
function setupAdminGitHubOperations() {
    // Save articles
    window.saveArticles = async function() {
        const success = await saveToGitHub('data/articles.json', websiteData.articles, 'Update articles');
        if (success) {
            showNotification('Articles saved to GitHub successfully!', 'success');
        }
        return success;
    };
    
    // Save events
    window.saveEvents = async function() {
        const success = await saveToGitHub('data/events.json', websiteData.events, 'Update events');
        if (success) {
            showNotification('Events saved to GitHub successfully!', 'success');
        }
        return success;
    };
    
    // Save locations
    window.saveLocations = async function() {
        const success = await saveToGitHub('data/locations.json', websiteData.locations, 'Update locations');
        if (success) {
            showNotification('Locations saved to GitHub successfully!', 'success');
        }
        return success;
    };
    
    // Save settings
    window.saveSettings = async function() {
        const success = await saveToGitHub('data/settings.json', websiteData.settings, 'Update settings');
        if (success) {
            showNotification('Settings saved to GitHub successfully!', 'success');
        }
        return success;
    };
    
    // Upload image
    window.uploadImage = async function(file) {
        const filename = `image-${Date.now()}-${file.name}`;
        const downloadUrl = await uploadImageToGitHub(file, filename);
        
        if (downloadUrl) {
            // Add to images list
            websiteData.images.push({
                name: filename,
                url: downloadUrl,
                path: `images/${filename}`,
                size: file.size,
                type: 'image'
            });
            
            showNotification('Image uploaded to GitHub successfully!', 'success');
            updateFileExplorer();
        }
        
        return downloadUrl;
    };
    
    // Create folder
    window.createFolder = async function(folderName) {
        const success = await createFolderInGitHub(folderName);
        if (success) {
            showNotification(`Folder '${folderName}' created successfully!`, 'success');
            updateFileExplorer();
        }
        return success;
    };
}

// Update file explorer in admin
function updateFileExplorer() {
    const fileExplorer = document.getElementById('fileExplorer');
    if (!fileExplorer) return;
    
    let html = `
        <div class="file-explorer-header">
            <h4>Repository Files</h4>
            <button class="btn btn-primary btn-sm" onclick="createNewFolder()">
                <i class="fas fa-folder-plus"></i> New Folder
            </button>
        </div>
        <div class="file-explorer-body">
            <div class="file-item folder" onclick="loadFolder('data')">
                <i class="fas fa-folder"></i> data/
            </div>
            <div class="file-item folder" onclick="loadFolder('images')">
                <i class="fas fa-folder"></i> images/
            </div>
    `;
    
    // Add data files
    html += `
        <div class="file-item" onclick="editFile('data/articles.json')">
            <i class="fas fa-file-code"></i> articles.json
        </div>
        <div class="file-item" onclick="editFile('data/events.json')">
            <i class="fas fa-file-code"></i> events.json
        </div>
        <div class="file-item" onclick="editFile('data/locations.json')">
            <i class="fas fa-file-code"></i> locations.json
        </div>
        <div class="file-item" onclick="editFile('data/settings.json')">
            <i class="fas fa-file-code"></i> settings.json
        </div>
    `;
    
    // Add images
    websiteData.images.forEach(image => {
        html += `
            <div class="file-item" onclick="viewImage('${image.url}')">
                <i class="fas fa-image"></i> ${image.name}
            </div>
        `;
    });
    
    html += '</div>';
    fileExplorer.innerHTML = html;
}

// Update recent articles list
function updateRecentArticlesList() {
    const container = document.getElementById('recentArticles');
    if (!container) return;
    
    const recentArticles = websiteData.articles.slice(0, 5);
    
    container.innerHTML = recentArticles.map(article => `
        <div class="admin-list-item">
            <div>
                <h4>${article.title || 'Untitled'}</h4>
                <small>${article.date || 'No date'} • ${article.category || 'Uncategorized'}</small>
            </div>
            <div class="admin-actions">
                <button class="btn-edit" onclick="editArticle('${article.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteArticle('${article.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Default data fallbacks
function getDefaultArticles() {
    return [
        {
            id: '1',
            title: 'Welcome to Mountain Life Uttarakhand',
            excerpt: 'Discover the beauty of the Himalayas through our stories and experiences.',
            content: 'Full article content here...',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            date: new Date().toISOString().split('T')[0],
            category: 'Featured',
            author: 'Admin',
            tags: ['himalayas', 'uttarakhand', 'welcome']
        }
    ];
}

function getDefaultEvents() {
    return [
        {
            id: '1',
            title: 'Uttarakhand Tourism Festival',
            date: '2023-11-15',
            location: 'Dehradun',
            description: 'Annual tourism festival showcasing Uttarakhand\'s culture and attractions'
        }
    ];
}

function getDefaultLocations() {
    return [
        {
            id: '1',
            name: 'Valley of Flowers',
            type: 'National Park',
            description: 'UNESCO World Heritage Site known for alpine flowers',
            coordinates: { lat: 30.7333, lng: 79.6333 }
        }
    ];
}

function getDefaultSettings() {
    return {
        siteName: 'Mountain Life Uttarakhand',
        description: 'Discovering Uttarakhand\'s Himalayan Wonders',
        contactEmail: 'info@mountainlifeuttarakhand.com',
        socialLinks: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            youtube: '#'
        }
    };
}

function getDefaultImages() {
    return [
        {
            name: 'default-mountain.jpg',
            url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            path: 'images/default-mountain.jpg',
            size: 0,
            type: 'image'
        }
    ];
}

// Load local fallback data
function loadLocalFallbackData() {
    websiteData.articles = getDefaultArticles();
    websiteData.events = getDefaultEvents();
    websiteData.locations = getDefaultLocations();
    websiteData.settings = getDefaultSettings();
    websiteData.images = getDefaultImages();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGitHubIntegration);

// Make functions available globally
window.loadAllDataFromGitHub = loadAllDataFromGitHub;
window.saveToGitHub = saveToGitHub;
window.uploadImageToGitHub = uploadImageToGitHub;
window.createFolderInGitHub = createFolderInGitHub;
window.showNotification = showNotification;