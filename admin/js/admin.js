// Admin JavaScript for Mountain Life Uttarakhand (Fixed Version)

// Global variables
let currentEditingArticle = null;
let currentEditingFile = null;
window.websiteData = window.websiteData || { articles: [], pages: [], settings: {}, images: [], events: [], locations: [] };

// Notification utility
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 4000);
}

// Initialize admin
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    initializeAdminTabs();
    initializeFormHandlers();
    setupGitHubConfig();
    
    if (window.websiteData) updateAdminUI();
    else window.addEventListener('githubDataLoaded', updateAdminUI);
}

function initializeAdminTabs() {
    document.querySelectorAll('.admin-tab').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

function initializeFormHandlers() {
    document.getElementById('addArticleBtn')?.addEventListener('click', showArticleForm);
    document.getElementById('cancelArticleBtn')?.addEventListener('click', () => { hideArticleForm(); resetArticleForm(); });
    document.getElementById('articleFormElement')?.addEventListener('submit', e => { e.preventDefault(); saveArticle(); });
    document.getElementById('imageUpload')?.addEventListener('change', e => { if (e.target.files.length > 0) uploadImage(e.target.files[0]); });
    document.getElementById('saveAllData')?.addEventListener('click', saveAllData);
    document.getElementById('refreshData')?.addEventListener('click', refreshData);
}

// GitHub Config
function setupGitHubConfig() {
    const configForm = document.getElementById('githubConfigForm');
    if (!configForm) return;
    const savedConfig = JSON.parse(localStorage.getItem('githubConfig') || '{}');
    document.getElementById('githubUsername').value = savedConfig.username || '';
    document.getElementById('githubRepo').value = savedConfig.repo || '';
    document.getElementById('githubToken').value = savedConfig.token || '';
    configForm.addEventListener('submit', e => { e.preventDefault(); saveGitHubConfig(); });
}

function saveGitHubConfig() {
    const config = {
        username: document.getElementById('githubUsername').value,
        repo: document.getElementById('githubRepo').value,
        token: document.getElementById('githubToken').value
    };
    localStorage.setItem('githubConfig', JSON.stringify(config));
    window.GITHUB_CONFIG = { ...window.GITHUB_CONFIG, ...config };
    showNotification('GitHub configuration saved successfully!', 'success');
}

// Update UI
function updateAdminUI() {
    if (!window.websiteData) return;
    document.getElementById('articlesCount').textContent = websiteData.articles.length;
    document.getElementById('imagesCount').textContent = websiteData.images.length;
    document.getElementById('eventsCount').textContent = websiteData.events.length;
    document.getElementById('locationsCount').textContent = websiteData.locations.length;
    updateRecentArticlesList();
}

function updateRecentArticlesList() {
    const container = document.getElementById('recentArticles');
    if (!container) return;
    const recentArticles = websiteData.articles.slice(0, 5);
    container.innerHTML = recentArticles.length === 0
        ? '<div class="admin-list-item">No articles yet.</div>'
        : recentArticles.map(article => `
            <div class="admin-list-item">
                <div><h4>${article.title}</h4><small>${article.date}</small></div>
                <div class="admin-actions">
                    <button class="btn-edit" onclick="editArticle('${article.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteArticle('${article.id}')">Delete</button>
                </div>
            </div>`).join('');
}

async function saveArticle() {
    const formData = new FormData(document.getElementById('articleFormElement'));
    const article = {
        id: formData.get('id') || generateId(),
        title: formData.get('title'),
        content: formData.get('content'),
        image: formData.get('image'),
        date: formData.get('date') || new Date().toISOString().split('T')[0]
    };
    websiteData.articles.unshift(article);
    await (window.saveArticles ? window.saveArticles() : Promise.resolve(true));
    hideArticleForm();
    updateRecentArticlesList();
    showNotification('Article saved successfully!', 'success');
}

function showArticleForm() { document.getElementById('articleForm').style.display = 'block'; }
function hideArticleForm() { document.getElementById('articleForm').style.display = 'none'; }
function resetArticleForm() { document.getElementById('articleFormElement')?.reset(); }

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substring(2); }
