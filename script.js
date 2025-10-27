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
    username: 'DeepakSingh86',
    repo: 'mountain-life-uttarakhand',
    branch: "main",
    dataFolder: "data",
    token: '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'
};

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeTaglineRotation();
    initializePageSpecificFunctions();
    initializeStatsAnimation();
});

// Load data from localStorage or initialize with default data
function loadData() {
    const savedData = localStorage.getItem('uttarakhandWebsiteData');
    
    if (savedData) {
        websiteData = JSON.parse(savedData);
    } else {
        // Initialize with default data
        initializeDefaultData();
    }
    
    // Update the display based on current page
    updatePageContent();
}

// Initialize with default data

// 💾 Function to save section data to GitHub
async function saveData(sectionName) {
    const sectionData = websiteData[sectionName];
    if (!sectionData) {
        console.error(`Section "${sectionName}" not found in websiteData`);
        return;
    }

    const jsonContent = JSON.stringify(sectionData, null, 2);
    const filePath = `${GITHUB_CONFIG.dataFolder}/${sectionName}.json`;

    try {
        // Step 1: Get existing file SHA (needed to update)
        const getUrl = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
        const getResponse = await fetch(getUrl, {
            headers: {
                Authorization: `token ${GITHUB_CONFIG.token}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        const fileData = await getResponse.json();
        const sha = fileData.sha || null;

        // Step 2: Prepare commit payload
        const putUrl = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
        const response = await fetch(putUrl, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_CONFIG.token}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Update ${sectionName}.json`,
                content: btoa(unescape(encodeURIComponent(jsonContent))), // base64 encoding
                branch: GITHUB_CONFIG.branch,
                sha: sha
            })
        });

        if (response.ok) {
            console.log(`✅ Successfully saved ${sectionName}.json to GitHub (${filePath})`);
        } else {
            const error = await response.json();
            console.error(`❌ Failed to save ${sectionName}.json`, error);
        }
    } catch (error) {
        console.error("⚠️ Error saving data to GitHub:", error);
    }
}
// Save data to localStorage and simulate GitHub save
//function saveData() {
  //  localStorage.setItem('uttarakhandWebsiteData', JSON.stringify(websiteData));
    
    // Simulate GitHub save
    //console.log("Data saved to localStorage. In production, this would push to GitHub repository.");
    //simulateGitHubSave();
//}

// Simulate GitHub data saving
function simulateGitHubSave() {
    // In a real implementation, this would use GitHub API
    // For now, we'll just log the action
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Data would be saved to GitHub: ${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.dataFolder}/`);
    
    // Create a JSON blob for export
    const dataStr = JSON.stringify(websiteData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    // This would be the actual GitHub API call in production:
    // fetch(`https://api.github.com/repos/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.dataFolder}/data.json`, {
    //     method: 'PUT',
    //     headers: {
    //         'Authorization': 'token YOUR_GITHUB_TOKEN',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         message: 'Auto-update website data',
    //         content: btoa(dataStr),
    //         branch: GITHUB_CONFIG.branch
    //     })
    // });
}

// Update tagline every 2 minutes
function initializeTaglineRotation() {
    updateTagline(); // Initial update
    
    // Update every 2 minutes (120000 milliseconds)
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

// Initialize stats animation
function initializeStatsAnimation() {
    // Only run on about page
    if (window.location.pathname.includes('about.html')) {
        animateStats();
    }
}

// Animate statistics counters
function animateStats() {
    const stats = websiteData.stats;
    
    // Animate each counter
    animateValue('destinations-count', 0, stats.destinations, 2000);
    animateValue('visitors-count', 0, stats.visitors, 2000);
    animateValue('years-count', 0, stats.years, 2000);
    animateValue('satisfaction-count', 0, stats.satisfaction, 2000, true);
}

// Animate a value from start to end
function animateValue(id, start, end, duration, isPercentage = false) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(function() {
        current += increment;
        element.innerHTML = isPercentage ? current + "%" : formatNumber(current);
        
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    // Nothing specific needed beyond what's in updatePageContent
}

// Gallery page functions
function initializeGalleryPage() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery
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
            } else {
                alert('Invalid credentials!');
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            document.getElementById('login-section').style.display = 'block';
            document.getElementById('admin-dashboard').style.display = 'none';
            document.getElementById('login-form').reset();
        });
    }
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Destination form
    const destinationForm = document.getElementById('destination-form');
    if (destinationForm) {
        destinationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addDestination();
        });
    }
    
    // Gallery form
    const galleryForm = document.getElementById('gallery-form');
    if (galleryForm) {
        galleryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addGalleryItem();
        });
    }
    
    // News form
    const newsForm = document.getElementById('news-form');
    if (newsForm) {
        newsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewsItem();
        });
    }
    
    // Testimonial form
    const testimonialForm = document.getElementById('testimonial-form');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addTestimonial();
        });
    }
    
    // Tagline form
    const taglineForm = document.getElementById('tagline-form');
    if (taglineForm) {
        taglineForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addTagline();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportData();
        });
    }
}

// Load data into admin panel
function loadAdminData() {
    loadDestinationsList();
    loadGalleryList();
    loadNewsList();
    loadTestimonialsList();
    loadTaglinesList();
}

// Add a new destination
function addDestination() {
    const name = document.getElementById('dest-name').value;
    const description = document.getElementById('dest-description').value;
    const image = document.getElementById('dest-image').value;
    const region = document.getElementById('dest-region').value;
    
    const newDestination = {
        id: Date.now(), // Simple ID generation
        name,
        description,
        image,
        region
    };
    
    websiteData.destinations.push(newDestination);
    saveData("destinations");
    loadDestinationsList();
    document.getElementById('destination-form').reset();
    
    // Update the home page if we're on it
    updatePageContent();
}

// Load destinations in admin panel
function loadDestinationsList() {
    const listElement = document.getElementById('destinations-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    websiteData.destinations.forEach(destination => {
        const item = document.createElement('div');
        item.className = 'item-card';
        item.innerHTML = `
            <div>
                <h4>${destination.name}</h4>
                <p>${destination.region} Region</p>
            </div>
            <button class="delete-btn" onclick="deleteDestination(${destination.id})">Delete</button>
        `;
        listElement.appendChild(item);
    });
}

// Delete a destination
function deleteDestination(id) {
    if (confirm('Are you sure you want to delete this destination?')) {
        websiteData.destinations = websiteData.destinations.filter(dest => dest.id !== id);
        saveData("destinations");
        loadDestinationsList();
        updatePageContent();
    }
}

// Add a new gallery item
function addGalleryItem() {
    const title = document.getElementById('gallery-title').value;
    const image = document.getElementById('gallery-image').value;
    const category = document.getElementById('gallery-category').value;
    
    const newGalleryItem = {
        id: Date.now(),
        title,
        image,
        category
    };
    
    websiteData.gallery.push(newGalleryItem);
    saveData("gallery");
    loadGalleryList();
    document.getElementById('gallery-form').reset();
    
    // Update the gallery page if we're on it
    updatePageContent();
}

// Load gallery items in admin panel
function loadGalleryList() {
    const listElement = document.getElementById('gallery-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    websiteData.gallery.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'item-card';
        listItem.innerHTML = `
            <div>
                <h4>${item.title}</h4>
                <p>Category: ${item.category}</p>
            </div>
            <button class="delete-btn" onclick="deleteGalleryItem(${item.id})">Delete</button>
        `;
        listElement.appendChild(listItem);
    });
}

// Delete a gallery item
function deleteGalleryItem(id) {
    if (confirm('Are you sure you want to delete this gallery item?')) {
        websiteData.gallery = websiteData.gallery.filter(item => item.id !== id);
        saveData("gallery");
        loadGalleryList();
        updatePageContent();
    }
}

// Add a news item
function addNewsItem() {
    const title = document.getElementById('news-title').value;
    const content = document.getElementById('news-content').value;
    const date = document.getElementById('news-date').value;
    
    const newNewsItem = {
        id: Date.now(),
        title,
        content,
        date
    };
    
    websiteData.news.push(newNewsItem);
    saveData("news");
    loadNewsList();
    document.getElementById('news-form').reset();
    
    // Update the home page if we're on it
    updatePageContent();
}

// Load news items in admin panel
function loadNewsList() {
    const listElement = document.getElementById('news-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    websiteData.news.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'item-card';
        listItem.innerHTML = `
            <div>
                <h4>${item.title}</h4>
                <p>Date: ${formatDisplayDate(item.date)}</p>
            </div>
            <button class="delete-btn" onclick="deleteNewsItem(${item.id})">Delete</button>
        `;
        listElement.appendChild(listItem);
    });
}

// Delete a news item
function deleteNewsItem(id) {
    if (confirm('Are you sure you want to delete this news item?')) {
        websiteData.news = websiteData.news.filter(item => item.id !== id);
        saveData("news");
        loadNewsList();
        updatePageContent();
    }
}

// Add a testimonial
function addTestimonial() {
    const name = document.getElementById('testimonial-name').value;
    const location = document.getElementById('testimonial-location').value;
    const content = document.getElementById('testimonial-content').value;
    const rating = parseInt(document.getElementById('testimonial-rating').value);
    
    const newTestimonial = {
        id: Date.now(),
        name,
        location,
        content,
        rating
    };
    
    websiteData.testimonials.push(newTestimonial);
    saveData("testimonials");
    loadTestimonialsList();
    document.getElementById('testimonial-form').reset();
    
    // Update the home page if we're on it
    updatePageContent();
}

// Load testimonials in admin panel
function loadTestimonialsList() {
    const listElement = document.getElementById('testimonials-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    websiteData.testimonials.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'item-card';
        listItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>${item.location} | Rating: ${'★'.repeat(item.rating)}${'☆'.repeat(5-item.rating)}</p>
            </div>
            <button class="delete-btn" onclick="deleteTestimonial(${item.id})">Delete</button>
        `;
        listElement.appendChild(listItem);
    });
}

// Delete a testimonial
function deleteTestimonial(id) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        websiteData.testimonials = websiteData.testimonials.filter(item => item.id !== id);
        saveData("testimonials");
        loadTestimonialsList();
        updatePageContent();
    }
}

// Add a tagline
function addTagline() {
    const tagline = document.getElementById('new-tagline').value;
    
    websiteData.taglines.push(tagline);
    saveData("taglines");
    loadTaglinesList();
    document.getElementById('tagline-form').reset();
    
    // The tagline rotation will pick up the new tagline automatically
}

// Load taglines in admin panel
function loadTaglinesList() {
    const listElement = document.getElementById('taglines-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    websiteData.taglines.forEach((tagline, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'item-card';
        listItem.innerHTML = `
            <div>
                <p>"${tagline}"</p>
            </div>
            <button class="delete-btn" onclick="deleteTagline(${index})">Delete</button>
        `;
        listElement.appendChild(listItem);
    });
}

// Delete a tagline
function deleteTagline(index) {
    if (confirm('Are you sure you want to delete this tagline?')) {
        websiteData.taglines.splice(index, 1);
        saveData("taglines");
        loadTaglinesList();
    }
}

// Export data as JSON file
function exportData() {
    const dataStr = JSON.stringify(websiteData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'uttarakhand-website-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    const exportResult = document.getElementById('export-result');
    if (exportResult) {
        exportResult.innerHTML = `
            <p><strong>Success!</strong> Data exported as JSON file.</p>
            <p>File: uttarakhand-website-data.json</p>
            <p>You can now commit this file to your GitHub repository.</p>
        `;
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
    updateTestimonials();
}

// Update destinations on home page
function updateDestinations() {
    const gridElement = document.getElementById('destinations-grid');
    if (!gridElement) return;
    
    gridElement.innerHTML = '';
    
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
    
    websiteData.news.forEach(newsItem => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <div class="news-content">
                <h3>${newsItem.title}</h3>
                <div class="news-date"><i class="fas fa-calendar-alt"></i> ${formatDisplayDate(newsItem.date)}</div>
                <p>${newsItem.content}</p>
            </div>
        `;
        gridElement.appendChild(card);
    });
}

// Update testimonials on home page
function updateTestimonials() {
    const gridElement = document.getElementById('testimonials-grid');
    if (!gridElement) return;
    
    gridElement.innerHTML = '';
    
    websiteData.testimonials.forEach(testimonial => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="testimonial-content">
                <p>${testimonial.content}</p>
            </div>
            <div class="testimonial-author">
                <div class="author-info">
                    <h4>${testimonial.name}</h4>
                    <div class="author-location">${testimonial.location}</div>
                </div>
                <div class="testimonial-rating">
                    ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5-testimonial.rating)}
                </div>
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
    
    websiteData.gallery.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', item.category);
        galleryItem.style.backgroundImage = `url('${item.image}')`;
        galleryItem.innerHTML = `
            <div class="gallery-overlay">
                <h4>${item.title}</h4>
            </div>
        `;
        gridElement.appendChild(galleryItem);
    });
}

// Utility function to format dates for display
function formatDisplayDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}




