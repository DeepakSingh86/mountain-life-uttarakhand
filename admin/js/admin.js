// Admin JavaScript for Mountain Life Uttarakhand

// Global variables
let currentEditingArticle = null;
let currentEditingFile = null;

// Initialize admin
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    initializeAdminTabs();
    initializeFormHandlers();
    setupGitHubConfig();
    
    // GitHub data should already be loaded by github-integration.js
    if (window.websiteData) {
        updateAdminUI();
    } else {
        // Wait for GitHub data
        window.addEventListener('githubDataLoaded', function() {
            updateAdminUI();
        });
    }
}

// Initialize admin tabs
function initializeAdminTabs() {
    const tabButtons = document.querySelectorAll('.admin-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and content
            document.querySelectorAll('.admin-tab').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to current button and content
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Initialize form handlers
function initializeFormHandlers() {
    // Add article button
    document.getElementById('addArticleBtn')?.addEventListener('click', function() {
        showArticleForm();
    });
    
    // Cancel article button
    document.getElementById('cancelArticleBtn')?.addEventListener('click', function() {
        hideArticleForm();
        resetArticleForm();
    });
    
    // Article form submission
    document.getElementById('articleFormElement')?.addEventListener('submit', function(e) {
        e.preventDefault();
        saveArticle();
    });
    
    // Image upload handler
    document.getElementById('imageUpload')?.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            uploadImage(e.target.files[0]);
        }
    });
    
    // Save all data button
    document.getElementById('saveAllData')?.addEventListener('click', function() {
        saveAllData();
    });
    
    // Refresh data button
    document.getElementById('refreshData')?.addEventListener('click', function() {
        refreshData();
    });
}

// Setup GitHub configuration form
function setupGitHubConfig() {
    const configForm = document.getElementById('githubConfigForm');
    if (!configForm) return;
    
    // Load saved config
    const savedConfig = JSON.parse(localStorage.getItem('githubConfig') || '{}');
    
    document.getElementById('githubUsername').value = savedConfig.username || '';
    document.getElementById('githubRepo').value = savedConfig.repo || '';
    document.getElementById('githubToken').value = savedConfig.token || '';
    
    configForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveGitHubConfig();
    });
}

// Save GitHub configuration
function saveGitHubConfig() {
    const config = {
        username: document.getElementById('githubUsername').value,
        repo: document.getElementById('githubRepo').value,
        token: document.getElementById('githubToken').value
    };
    
    localStorage.setItem('githubConfig', JSON.stringify(config));
    
    // Update the global config
    if (window.GITHUB_CONFIG) {
        Object.assign(window.GITHUB_CONFIG, config);
    }
    
    showNotification('GitHub configuration saved successfully!', 'success');
}

// Update admin UI with loaded data
function updateAdminUI() {
    if (!window.websiteData) return;
    
    // Update statistics
    document.getElementById('articlesCount').textContent = websiteData.articles.length;
    document.getElementById('imagesCount').textContent = websiteData.images.length;
    document.getElementById('eventsCount').textContent = websiteData.events.length;
    document.getElementById('locationsCount').textContent = websiteData.locations.length;
    
    // Update file explorer
    updateFileExplorer();
    
    // Update recent articles
    updateRecentArticlesList();
    
    // Update settings form
    updateSettingsForm();
}

// Update file explorer
function updateFileExplorer() {
    const fileExplorer = document.getElementById('fileExplorer');
    if (!fileExplorer || !websiteData) return;
    
    let html = `
        <div class="file-explorer-header">
            <h4>Repository Files</h4>
            <div>
                <button class="btn btn-primary btn-sm" onclick="createNewFolder()">
                    <i class="fas fa-folder-plus"></i> New Folder
                </button>
                <button class="btn btn-secondary btn-sm" onclick="uploadNewImage()" style="margin-left: 10px;">
                    <i class="fas fa-upload"></i> Upload Image
                </button>
            </div>
        </div>
        <div class="file-explorer-body">
            <div class="file-item folder" onclick="loadFolder('data')">
                <i class="fas fa-folder"></i> data/
            </div>
    `;
    
    // Add data files
    html += `
        <div class="file-item" onclick="editFile('data/articles.json', 'articles')">
            <i class="fas fa-file-code"></i> articles.json
        </div>
        <div class="file-item" onclick="editFile('data/events.json', 'events')">
            <i class="fas fa-file-code"></i> events.json
        </div>
        <div class="file-item" onclick="editFile('data/locations.json', 'locations')">
            <i class="fas fa-file-code"></i> locations.json
        </div>
        <div class="file-item" onclick="editFile('data/settings.json', 'settings')">
            <i class="fas fa-file-code"></i> settings.json
        </div>
    `;
    
    // Add images folder and files
    html += `
        <div class="file-item folder" onclick="loadFolder('images')">
            <i class="fas fa-folder"></i> images/
        </div>
    `;
    
    if (websiteData.images && websiteData.images.length > 0) {
        websiteData.images.forEach(image => {
            html += `
                <div class="file-item" onclick="viewImage('${image.url}', '${image.name}')">
                    <i class="fas fa-image"></i> ${image.name}
                </div>
            `;
        });
    } else {
        html += `
            <div class="file-item">
                <i class="fas fa-info-circle"></i> No images uploaded yet
            </div>
        `;
    }
    
    html += '</div>';
    fileExplorer.innerHTML = html;
}

// Update recent articles list
function updateRecentArticlesList() {
    const container = document.getElementById('recentArticles');
    if (!container || !websiteData.articles) return;
    
    const recentArticles = websiteData.articles.slice(0, 5);
    
    if (recentArticles.length === 0) {
        container.innerHTML = '<div class="admin-list-item">No articles yet. <a href="#" onclick="showArticleForm()">Create your first article</a></div>';
        return;
    }
    
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

// Update settings form
function updateSettingsForm() {
    if (!websiteData.settings) return;
    
    const form = document.getElementById('settingsForm');
    if (!form) return;
    
    document.getElementById('siteName').value = websiteData.settings.siteName || '';
    document.getElementById('siteDescription').value = websiteData.settings.description || '';
    document.getElementById('contactEmail').value = websiteData.settings.contactEmail || '';
    document.getElementById('facebookUrl').value = websiteData.settings.socialLinks?.facebook || '';
    document.getElementById('twitterUrl').value = websiteData.settings.socialLinks?.twitter || '';
    document.getElementById('instagramUrl').value = websiteData.settings.socialLinks?.instagram || '';
    document.getElementById('youtubeUrl').value = websiteData.settings.socialLinks?.youtube || '';
}

// Show article form
function showArticleForm(article = null) {
    currentEditingArticle = article;
    
    const form = document.getElementById('articleForm');
    const title = document.getElementById('articleFormTitle');
    
    if (article) {
        title.textContent = 'Edit Article';
        populateArticleForm(article);
    } else {
        title.textContent = 'Add New Article';
        resetArticleForm();
    }
    
    form.style.display = 'block';
    document.getElementById('addArticleBtn').style.display = 'none';
}

// Hide article form
function hideArticleForm() {
    document.getElementById('articleForm').style.display = 'none';
    document.getElementById('addArticleBtn').style.display = 'block';
    currentEditingArticle = null;
}

// Reset article form
function resetArticleForm() {
    document.getElementById('articleFormElement').reset();
    document.getElementById('articleId').value = '';
    document.getElementById('articleContent').value = '';
}

// Populate article form with data
function populateArticleForm(article) {
    document.getElementById('articleId').value = article.id || '';
    document.getElementById('articleTitle').value = article.title || '';
    document.getElementById('articleExcerpt').value = article.excerpt || '';
    document.getElementById('articleContent').value = article.content || '';
    document.getElementById('articleImage').value = article.image || '';
    document.getElementById('articleDate').value = article.date || '';
    document.getElementById('articleCategory').value = article.category || '';
    document.getElementById('articleAuthor').value = article.author || '';
    document.getElementById('articleTags').value = article.tags ? article.tags.join(', ') : '';
}

// Save article
async function saveArticle() {
    const formData = new FormData(document.getElementById('articleFormElement'));
    
    const article = {
        id: formData.get('id') || generateId(),
        title: formData.get('title'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        image: formData.get('image'),
        date: formData.get('date') || new Date().toISOString().split('T')[0],
        category: formData.get('category'),
        author: formData.get('author'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : []
    };
    
    if (currentEditingArticle) {
        // Update existing article
        const index = websiteData.articles.findIndex(a => a.id === currentEditingArticle.id);
        if (index !== -1) {
            websiteData.articles[index] = article;
        }
    } else {
        // Add new article
        websiteData.articles.unshift(article);
    }
    
    // Save to GitHub
    const success = await window.saveArticles();
    
    if (success) {
        hideArticleForm();
        updateRecentArticlesList();
        showNotification(`Article "${article.title}" saved successfully!`, 'success');
    }
}

// Edit article
function editArticle(articleId) {
    const article = websiteData.articles.find(a => a.id === articleId);
    if (article) {
        showArticleForm(article);
    }
}

// Delete article
async function deleteArticle(articleId) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    websiteData.articles = websiteData.articles.filter(a => a.id !== articleId);
    
    const success = await window.saveArticles();
    
    if (success) {
        updateRecentArticlesList();
        showNotification('Article deleted successfully!', 'success');
    }
}

// Upload image
async function uploadImage(file) {
    const status = document.getElementById('uploadStatus');
    if (status) {
        status.textContent = 'Uploading...';
    }
    
    const downloadUrl = await window.uploadImage(file);
    
    if (status) {
        status.textContent = downloadUrl ? 'Upload successful!' : 'Upload failed!';
        
        if (downloadUrl) {
            // Update the article form image field if open
            const imageField = document.getElementById('articleImage');
            if (imageField) {
                imageField.value = downloadUrl;
            }
        }
    }
    
    return downloadUrl;
}

// Create new folder
async function createNewFolder() {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;
    
    const success = await window.createFolder(folderName);
    return success;
}

// Upload new image
function uploadNewImage() {
    document.getElementById('imageUpload').click();
}

// Edit file
function editFile(filePath, dataType) {
    currentEditingFile = { path: filePath, type: dataType };
    
    const content = websiteData[dataType];
    const contentTextarea = document.getElementById('fileContent');
    
    if (contentTextarea) {
        contentTextarea.value = JSON.stringify(content, null, 2);
        document.getElementById('fileEditor').style.display = 'block';
    }
}

// View image
function viewImage(imageUrl, imageName) {
    openImageModal(imageUrl, imageName);
}

// Save file
async function saveFile() {
    if (!currentEditingFile) return;
    
    try {
        const contentTextarea = document.getElementById('fileContent');
        const newContent = JSON.parse(contentTextarea.value);
        
        // Update local data
        websiteData[currentEditingFile.type] = newContent;
        
        // Save to GitHub
        const success = await saveToGitHub(currentEditingFile.path, newContent, `Update ${currentEditingFile.type}`);
        
        if (success) {
            showNotification(`File ${currentEditingFile.path} saved successfully!`, 'success');
            updateAdminUI();
        }
    } catch (error) {
        showNotification('Error parsing JSON: ' + error.message, 'error');
    }
}

// Close file editor
function closeFileEditor() {
    document.getElementById('fileEditor').style.display = 'none';
    currentEditingFile = null;
}

// Save all data
async function saveAllData() {
    const btn = document.getElementById('saveAllData');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;
    
    try {
        const promises = [
            window.saveArticles(),
            window.saveEvents(),
            window.saveLocations(),
            window.saveSettings()
        ];
        
        await Promise.all(promises);
        
        showNotification('All data saved to GitHub successfully!', 'success');
    } catch (error) {
        showNotification('Error saving data: ' + error.message, 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Refresh data
async function refreshData() {
    const btn = document.getElementById('refreshData');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    btn.disabled = true;
    
    try {
        await window.loadAllDataFromGitHub();
        updateAdminUI();
        showNotification('Data refreshed from GitHub successfully!', 'success');
    } catch (error) {
        showNotification('Error refreshing data: ' + error.message, 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Save settings
async function saveSettings() {
    const formData = new FormData(document.getElementById('settingsForm'));
    
    websiteData.settings = {
        siteName: formData.get('siteName'),
        description: formData.get('siteDescription'),
        contactEmail: formData.get('contactEmail'),
        socialLinks: {
            facebook: formData.get('facebookUrl'),
            twitter: formData.get('twitterUrl'),
            instagram: formData.get('instagramUrl'),
            youtube: formData.get('youtubeUrl')
        }
    };
    
    const success = await window.saveSettings();
    
    if (success) {
        showNotification('Settings saved successfully!', 'success');
    }
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Open image modal
function openImageModal(imageUrl, title) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    
    modalImage.src = imageUrl;
    modalTitle.textContent = title;
    modal.style.display = 'flex';
}

// Make functions available globally
window.showArticleForm = showArticleForm;
window.hideArticleForm = hideArticleForm;
window.editArticle = editArticle;
window.deleteArticle = deleteArticle;
window.uploadImage = uploadImage;
window.createNewFolder = createNewFolder;
window.uploadNewImage = uploadNewImage;
window.editFile = editFile;
window.viewImage = viewImage;
window.saveFile = saveFile;
window.closeFileEditor = closeFileEditor;
window.saveAllData = saveAllData;
window.refreshData = refreshData;
window.saveSettings = saveSettings;
window.openImageModal = openImageModal;