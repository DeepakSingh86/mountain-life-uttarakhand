// Admin Configuration
const ADMIN_CONFIG = {
    password: 'TravelPahad2024', // Change this password
    token: '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'
};

// GitHub Configuration (same as main.js)
const GITHUB_CONFIG = {
    username: 'DeepakSingh86',
    repo: 'mountain-life-uttarakhand',
    branch: 'main',
    dataPath: 'admin-data/destinations.json'
};

const GITHUB_API = {
    base: 'https://api.github.com',
    get contents() {
        return `${this.base}/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.dataPath}`;
    }
};

let destinations = [];
let currentFileSHA = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    setupEventListeners();
});

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showAdminDashboard();
        loadDestinations();
    } else {
        showLoginSection();
    }
}

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('destinationForm');
    const passwordInput = document.getElementById('adminPassword');
    
    form.addEventListener('submit', handleFormSubmit);
    
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
}

// Handle login
function login() {
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    if (password === ADMIN_CONFIG.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminDashboard();
        loadDestinations();
        errorDiv.textContent = '';
    } else {
        errorDiv.textContent = 'Invalid password. Please try again.';
    }
}

// Handle logout
function logout() {
    localStorage.removeItem('adminLoggedIn');
    showLoginSection();
    document.getElementById('adminPassword').value = '';
}

// Show login section
function showLoginSection() {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

// Show admin dashboard
function showAdminDashboard() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    addDestination();
}

// Add new destination
function addDestination() {
    const form = document.getElementById('destinationForm');
    const formData = new FormData(form);
    
    const newDestination = {
        id: Date.now(), // Simple ID generation
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        image: document.getElementById('image').value,
        altitude: document.getElementById('altitude').value,
        bestTime: document.getElementById('bestTime').value,
        attractions: document.getElementById('attractions').value.split(',').map(item => item.trim())
    };
    
    destinations.push(newDestination);
    saveDestinations();
    form.reset();
    renderAdminDestinations();
}

// Delete destination
function deleteDestination(id) {
    if (confirm('Are you sure you want to delete this destination?')) {
        destinations = destinations.filter(dest => dest.id !== id);
        saveDestinations();
        renderAdminDestinations();
    }
}

// Load destinations from GitHub
async function loadDestinations() {
    try {
        const response = await fetch(GITHUB_API.contents, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const content = JSON.parse(atob(data.content));
            destinations = content.destinations || [];
            currentFileSHA = data.sha;
            updateGitHubStatus('Connected to GitHub successfully', 'success');
        } else {
            throw new Error(`GitHub API error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error loading destinations:', error);
        updateGitHubStatus('Failed to connect to GitHub', 'error');
        // Initialize with empty array if file doesn't exist
        destinations = [];
    }
    
    renderAdminDestinations();
}

// Save destinations to GitHub
async function saveDestinations() {
    try {
        const content = {
            destinations: destinations,
            lastUpdated: new Date().toISOString(),
            totalDestinations: destinations.length
        };
        
        const contentBase64 = btoa(JSON.stringify(content, null, 2));
        
        const response = await fetch(GITHUB_API.contents, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Update destinations - ${new Date().toLocaleString()}`,
                content: contentBase64,
                sha: currentFileSHA,
                branch: GITHUB_CONFIG.branch
            })
        });

        if (response.ok) {
            const data = await response.json();
            currentFileSHA = data.content.sha;
            updateGitHubStatus('Data saved successfully to GitHub', 'success');
            return true;
        } else {
            throw new Error(`GitHub API error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error saving destinations:', error);
        updateGitHubStatus('Failed to save data to GitHub', 'error');
        return false;
    }
}

// Render destinations in admin panel
function renderAdminDestinations() {
    const grid = document.getElementById('adminDestinationsGrid');
    
    if (!destinations || destinations.length === 0) {
        grid.innerHTML = '<div class="no-data">No destinations added yet.</div>';
        return;
    }

    grid.innerHTML = destinations.map(destination => `
        <div class="admin-card">
            <h4>${destination.name}</h4>
            <p><strong>Altitude:</strong> ${destination.altitude}</p>
            <p><strong>Best Time:</strong> ${destination.bestTime}</p>
            <p><strong>Attractions:</strong> ${destination.attractions ? destination.attractions.join(', ') : 'N/A'}</p>
            <div class="admin-actions">
                <button onclick="deleteDestination(${destination.id})" class="btn-danger">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Test GitHub connection
async function testGitHubConnection() {
    try {
        updateGitHubStatus('Testing connection...', 'loading');
        
        const response = await fetch(GITHUB_API.contents, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            updateGitHubStatus('GitHub connection successful', 'success');
        } else {
            throw new Error(`Connection failed: ${response.status}`);
        }
    } catch (error) {
        updateGitHubStatus('GitHub connection failed', 'error');
    }
}

// Force sync with GitHub
async function forceSync() {
    await loadDestinations();
}

// Update GitHub status display
function updateGitHubStatus(message, type) {
    const statusElement = document.getElementById('githubStatus');
    statusElement.textContent = message;
    statusElement.className = type === 'success' ? 'success-message' : 
                             type === 'error' ? 'error-message' : '';
}

// Add admin-specific styles
const adminStyle = document.createElement('style');
adminStyle.textContent = `
    .admin-body {
        margin: 0;
        padding: 0;
        background: #f5f5f5;
    }
    
    .admin-container {
        min-height: 100vh;
    }
    
    .login-section {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .login-form {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        text-align: center;
        width: 100%;
        max-width: 400px;
    }
    
    .admin-dashboard {
        padding: 20px;
    }
    
    .admin-header {
        background: white;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .form-section {
        background: white;
        padding: 30px;
        border-radius: 10px;
        margin-bottom: 30px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .destination-form {
        display: grid;
        gap: 15px;
        max-width: 600px;
    }
    
    .form-input {
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
    }
    
    .admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    
    .admin-card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .github-status {
        background: white;
        padding: 30px;
        border-radius: 10px;
        margin-top: 30px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .status-card {
        text-align: center;
        padding: 20px;
        border: 2px dashed #ddd;
        border-radius: 10px;
    }
    
    .hidden {
        display: none;
    }
    
    @media (max-width: 768px) {
        .admin-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
        }
    }
`;
document.head.appendChild(adminStyle);