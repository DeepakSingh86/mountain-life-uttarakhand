// GitHub Configuration
const GITHUB_CONFIG = {
    username: 'DeepakSingh86',
    repo: 'mountain-life-uttarakhand',
    branch: 'main',
    token: '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',
    dataPath: 'admin-data/destinations.json'
};

// API URLs
const GITHUB_API = {
    base: 'https://api.github.com',
    get contents() {
        return `${this.base}/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.dataPath}`;
    }
};

// Global variables
let destinations = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDestinations();
    setupMobileMenu();
});

// Setup mobile menu functionality
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

// Scroll to destinations section
function scrollToDestinations() {
    document.getElementById('destinations').scrollIntoView({
        behavior: 'smooth'
    });
}

// Load destinations from GitHub
async function loadDestinations() {
    try {
        showLoadingState();
        
        const response = await fetch(GITHUB_API.contents, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        destinations = content.destinations || [];
        
        renderDestinations();
        
    } catch (error) {
        console.error('Error loading destinations:', error);
        showErrorState('Failed to load destinations. Please try again later.');
        
        // Load sample data as fallback
        loadSampleData();
    }
}

// Load sample data when GitHub fails
function loadSampleData() {
    destinations = [
        {
            id: 1,
            name: "Nainital",
            description: "The beautiful lake district of Uttarakhand, known for its stunning Naini Lake and panoramic views of the Himalayas.",
            image: "https://images.unsplash.com/photo-1588418075920-9842a9f667fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            altitude: "2,084 meters",
            bestTime: "March to June",
            attractions: ["Naini Lake", "Snow View Point", "Eco Cave Garden"]
        },
        {
            id: 2,
            name: "Mussoorie",
            description: "The Queen of Hills, offering breathtaking views of the Shivalik ranges and the Doon Valley.",
            image: "https://images.unsplash.com/photo-1597148546265-324d312b651b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            altitude: "2,005 meters",
            bestTime: "April to June, September to November",
            attractions: ["Kempty Falls", "Gun Hill", "Camel's Back Road"]
        }
    ];
    
    renderDestinations();
}

// Show loading state
function showLoadingState() {
    const grid = document.getElementById('destinationsGrid');
    grid.innerHTML = '<div class="loading">Loading destinations...</div>';
}

// Show error state
function showErrorState(message) {
    const grid = document.getElementById('destinationsGrid');
    grid.innerHTML = `<div class="error">${message}</div>`;
}

// Render destinations to the page
function renderDestinations() {
    const grid = document.getElementById('destinationsGrid');
    
    if (!destinations || destinations.length === 0) {
        grid.innerHTML = '<div class="no-data">No destinations available. Check back later!</div>';
        return;
    }

    grid.innerHTML = destinations.map(destination => `
        <div class="destination-card">
            <img src="${destination.image}" alt="${destination.name}" class="destination-image" onerror="this.src='https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'">
            <div class="destination-info">
                <h3>${destination.name}</h3>
                <p>${destination.description}</p>
                <div class="destination-meta">
                    <span><i class="fas fa-mountain"></i> ${destination.altitude}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${destination.bestTime}</span>
                </div>
                ${destination.attractions ? `
                    <div class="attractions">
                        <strong>Attractions:</strong> ${destination.attractions.join(', ')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Add some basic styling for loading and error states
const style = document.createElement('style');
style.textContent = `
    .loading, .error, .no-data {
        text-align: center;
        padding: 40px;
        font-size: 1.2rem;
        grid-column: 1 / -1;
    }
    
    .loading {
        color: #4a7c1f;
    }
    
    .error {
        color: #dc3545;
    }
    
    .no-data {
        color: #6c757d;
    }
    
    .attractions {
        margin-top: 10px;
        font-size: 0.9rem;
        color: #555;
    }
    
    .destination-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .destination-meta i {
        color: #4a7c1f;
    }
`;
document.head.appendChild(style);