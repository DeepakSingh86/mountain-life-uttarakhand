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
function initializeDefaultData() {
    websiteData = {
        destinations: [
            {
                id: 1,
                name: "Rishikesh",
                description: "The Yoga Capital of the World, situated on the banks of the holy Ganges river. Known for its spiritual aura and adventure activities.",
                image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                region: "Garhwal"
            },
            {
                id: 2,
                name: "Nainital",
                description: "The Lake District of India, famous for its beautiful lakes and pleasant climate. A perfect hill station getaway.",
                image: "https://images.unsplash.com/photo-1597149877677-2c64d93c4c51?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                region: "Kumaon"
            },
            {
                id: 3,
                name: "Mussoorie",
                description: "Queen of the Hills, offering panoramic views of the Himalayan ranges. Ideal for nature lovers and honeymooners.",
                image: "https://images.unsplash.com/photo-1563793254321-ec66e66ccd6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                region: "Garhwal"
            },
            {
                id: 4,
                name: "Auli",
                description: "Popular skiing destination with breathtaking views of Nanda Devi peak. A winter paradise for adventure seekers.",
                image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                region: "Garhwal"
            }
        ],
        gallery: [
            {
                id: 1,
                title: "Kedarnath Temple",
                image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                category: "temples"
            },
            {
                id: 2,
                title: "Valley of Flowers",
                image: "https://images.unsplash.com/photo-1597149877677-2c64d93c4c51?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                category: "hills"
            },
            {
                id: 3,
                title: "River Rafting in Rishikesh",
                image: "https://images.unsplash.com/photo-1563793254321-ec66e66ccd6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                category: "adventure"
            },
            {
                id: 4,
                title: "Jim Corbett National Park",
                image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                category: "wildlife"
            },
            {
                id: 5,
                title: "Traditional Uttarakhand Dance",
                image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                category: "culture"
            },
            {
                id: 6,
                title: "Badrinath Temple",
                image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                category: "temples"
            }
        ],
        news: [
            {
                id: 1,
                title: "Char Dham Yatra 2024 Begins",
                content: "The sacred Char Dham Yatra has commenced with new safety measures in place for pilgrims. Special arrangements have been made for senior citizens.",
                date: "2024-05-01"
            },
            {
                id: 2,
                title: "New Trekking Routes Opened in Uttarakhand",
                content: "The state tourism department has opened 5 new trekking routes for adventure enthusiasts in the Kumaon region.",
                date: "2024-04-25"
            },
            {
                id: 3,
                title: "Uttarakhand Tourism Wins National Award",
                content: "Uttarakhand has been awarded the 'Best Adventure Tourism Destination' at the National Tourism Awards 2024.",
                date: "2024-04-15"
            }
        ],
        testimonials: [
            {
                id: 1,
                name: "Priya Sharma",
                location: "Mumbai",
                content: "My trip to Uttarakhand was absolutely magical! The serene beauty of the hills and the warm hospitality made it an unforgettable experience.",
                rating: 5
            },
            {
                id: 2,
                name: "Rajesh Kumar",
                location: "Delhi",
                content: "As an adventure enthusiast, Uttarakhand offered everything I was looking for - from trekking to river rafting. Highly recommended!",
                rating: 4
            },
            {
                id: 3,
                name: "Anita Desai",
                location: "Bangalore",
                content: "The spiritual journey to the Char Dham temples was transformative. The natural beauty of Uttarakhand is simply breathtaking.",
                rating: 5
            }
        ],
        taglines: [
            "Discover the Land of Gods - Uttarakhand",
            "Experience Serenity in the Himalayan Abode",
            "Your Gateway to Spiritual and Adventure Tourism",
            "Explore the Unexplored Beauty of Devbhoomi",
            "Where Nature Meets Spirituality - Uttarakhand",
            "Journey to the Heart of the Himalayas"
        ],
        stats: {
            destinations: 25,
            visitors: 12500,
            years: 8,
            satisfaction: 98
        }
    };
    saveData();
}

// Save data to localStorage and simulate GitHub save
function saveData() {
    localStorage.setItem('uttarakhandWebsiteData', JSON.stringify(websiteData));
    
    // Simulate GitHub save
    console.log("Data saved to localStorage. In production, this would push to GitHub repository.");
    simulateGitHubSave();
}

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
    saveData();
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
        saveData();
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
    saveData();
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
        saveData();
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
    saveData();
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
        saveData();
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
    saveData();
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
        saveData();
        loadTestimonialsList();
        updatePageContent();
    }
}

// Add a tagline
function addTagline() {
    const tagline = document.getElementById('new-tagline').value;
    
    websiteData.taglines.push(tagline);
    saveData();
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
        saveData();
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
