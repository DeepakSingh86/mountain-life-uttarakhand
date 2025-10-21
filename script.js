// Main JavaScript for Mountain Life Uttarakhand

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date display
    updateDate();
    
    // Initialize weather (mock for now)
    updateWeather();
    
    // Wait for GitHub data to load
    window.addEventListener('githubDataLoaded', function(e) {
        initializeContent(e.detail);
    });
    
    // Initialize tabs and modal
    initializeTabs();
    initializeModal();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
});

// Update current date
function updateDate() {
    const dateElement = document.getElementById('currentDate');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString('en-US', options);
}

// Update weather information (mock data)
function updateWeather() {
    const weatherElement = document.getElementById('weatherTemp');
    const temperatures = ['12°C / 54°F', '15°C / 59°F', '10°C / 50°F', '18°C / 64°F'];
    const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
    weatherElement.textContent = randomTemp;
}

// Initialize all dynamic content with GitHub data
function initializeContent(data) {
    console.log('Initializing content with GitHub data:', data);
    
    // Load hero slider
    loadHeroSlider(data.articles);
    
    // Load featured articles
    loadFeaturedArticles(data.articles);
    
    // Load trending news
    loadTrendingNews(data.articles);
    
    // Load quick facts
    loadQuickFacts(data.locations);
    
    // Load upcoming events
    loadUpcomingEvents(data.events);
    
    // Load photo gallery
    loadPhotoGallery(data.images);
    
    // Load culture content
    loadCultureContent(data.articles);
    
    // Load adventure content
    loadAdventureContent(data.articles);
}

// Initialize tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and content
            document.querySelectorAll('.tab-button').forEach(btn => {
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

// Initialize modal functionality
function initializeModal() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Open image in modal
function openImageModal(imageUrl, title) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    
    modalImage.src = imageUrl;
    modalTitle.textContent = title;
    modal.style.display = 'flex';
}

// Load hero slider content
function loadHeroSlider(articles) {
    const heroSlider = document.getElementById('heroSlider');
    
    if (!articles || articles.length === 0) {
        heroSlider.innerHTML = `
            <div class="hero-slide active" style="background-image: url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')">
                <div class="hero-content">
                    <h2>Welcome to Mountain Life Uttarakhand</h2>
                    <p>Discover the majestic Himalayas and rich culture of Uttarakhand</p>
                </div>
            </div>
        `;
        return;
    }
    
    const featuredArticles = articles.filter(article => article.featured).slice(0, 3);
    
    if (featuredArticles.length === 0 && articles.length > 0) {
        featuredArticles.push(articles[0]);
    }
    
    let slidesHTML = '';
    featuredArticles.forEach((article, index) => {
        slidesHTML += `
            <div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${article.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}')">
                <div class="hero-content">
                    <h2>${article.title}</h2>
                    <p>${article.excerpt}</p>
                </div>
            </div>
        `;
    });
    
    heroSlider.innerHTML = slidesHTML;
    
    // Initialize slider functionality
    initializeHeroSlider();
}

// Initialize hero slider functionality
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Auto-advance slides
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Load featured articles
function loadFeaturedArticles(articles) {
    const featuredGrid = document.getElementById('featuredGrid');
    
    if (!articles || articles.length === 0) {
        featuredGrid.innerHTML = `
            <div class="featured-card">
                <div class="featured-image" style="background-image: url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"></div>
                <div class="featured-content">
                    <h3>Welcome to Mountain Life Uttarakhand</h3>
                    <div class="featured-meta">
                        <span>${new Date().toLocaleDateString()}</span>
                        <span>Featured</span>
                    </div>
                    <p>Discover the majestic Himalayas and rich culture of Uttarakhand through our stories and experiences.</p>
                    <a href="#" class="read-more">Read More →</a>
                </div>
            </div>
        `;
        return;
    }
    
    const featuredArticles = articles.slice(0, 3);
    
    let featuredHTML = '';
    featuredArticles.forEach(article => {
        featuredHTML += `
            <div class="featured-card">
                <div class="featured-image" style="background-image: url('${article.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}')"></div>
                <div class="featured-content">
                    <h3>${article.title}</h3>
                    <div class="featured-meta">
                        <span>${article.date || new Date().toLocaleDateString()}</span>
                        <span>${article.category || 'Article'}</span>
                    </div>
                    <p>${article.excerpt}</p>
                    <a href="#" class="read-more" data-article-id="${article.id}">Read More →</a>
                </div>
            </div>
        `;
    });
    
    featuredGrid.innerHTML = featuredHTML;
}

// Load trending news
function loadTrendingNews(articles) {
    const trendingNews = document.getElementById('trendingNews');
    
    if (!articles || articles.length === 0) {
        trendingNews.innerHTML = `
            <div class="trending-item">
                <div class="trending-image" style="background-image: url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"></div>
                <div class="trending-content">
                    <h3>Discover Uttarakhand's Himalayan Beauty</h3>
                    <p>Explore the stunning landscapes and rich cultural heritage of Uttarakhand.</p>
                    <span class="trending-date">Just now</span>
                </div>
            </div>
        `;
        return;
    }
    
    const trendingArticles = articles.slice(0, 4);
    
    let trendingHTML = '';
    trendingArticles.forEach(article => {
        trendingHTML += `
            <div class="trending-item">
                <div class="trending-image" style="background-image: url('${article.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}')"></div>
                <div class="trending-content">
                    <h3>${article.title}</h3>
                    <p>${article.excerpt}</p>
                    <span class="trending-date">${article.date || 'Recent'}</span>
                </div>
            </div>
        `;
    });
    
    trendingNews.innerHTML = trendingHTML;
}

// Load quick facts
function loadQuickFacts(locations) {
    const quickFacts = document.getElementById('quickFacts');
    
    const defaultFacts = [
        'Uttarakhand is known as "Devbhumi" - Land of the Gods',
        'Home to India\'s second-highest peak, Nanda Devi',
        'The Ganga and Yamuna rivers originate from Uttarakhand',
        'Has 13 districts with Dehradun as the capital',
        'Approximately 65% of the state is covered by forest',
        'Hosts the famous Kumbh Mela in Haridwar'
    ];
    
    let factsHTML = '';
    
    if (locations && locations.length > 0) {
        locations.slice(0, 3).forEach(location => {
            factsHTML += `<div class="fact-item">${location.name}: ${location.description}</div>`;
        });
        
        // Add default facts if we have less than 3 locations
        if (locations.length < 3) {
            defaultFacts.slice(0, 3 - locations.length).forEach(fact => {
                factsHTML += `<div class="fact-item">${fact}</div>`;
            });
        }
    } else {
        defaultFacts.forEach(fact => {
            factsHTML += `<div class="fact-item">${fact}</div>`;
        });
    }
    
    quickFacts.innerHTML = factsHTML;
}

// Load upcoming events
function loadUpcomingEvents(events) {
    const upcomingEvents = document.getElementById('upcomingEvents');
    
    const defaultEvents = [
        { date: 'Nov 15-20, 2023', title: 'Uttarakhand Tourism Festival', location: 'Dehradun' },
        { date: 'Dec 10-15, 2023', title: 'Winter Sports Championship', location: 'Auli' },
        { date: 'Jan 14, 2024', title: 'Makar Sankranti Kite Festival', location: 'Haridwar' }
    ];
    
    let eventsHTML = '';
    
    if (events && events.length > 0) {
        events.slice(0, 4).forEach(event => {
            eventsHTML += `
                <div class="event-item">
                    <div class="event-date">${event.date}</div>
                    <div class="event-title">${event.title}</div>
                    <div class="event-location">${event.location}</div>
                </div>
            `;
        });
    } else {
        defaultEvents.forEach(event => {
            eventsHTML += `
                <div class="event-item">
                    <div class="event-date">${event.date}</div>
                    <div class="event-title">${event.title}</div>
                    <div class="event-location">${event.location}</div>
                </div>
            `;
        });
    }
    
    upcomingEvents.innerHTML = eventsHTML;
}

// Load photo gallery
function loadPhotoGallery(images) {
    const photoGallery = document.getElementById('photoGallery');
    
    const defaultImages = [
        {
            url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            title: 'Himalayan Peaks'
        },
        {
            url: 'https://images.unsplash.com/photo-1563794349773-1cf70de8f8b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            title: 'Valley of Flowers'
        },
        {
            url: 'https://images.unsplash.com/photo-1598880940080-7fc0e4cbfc57?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
            title: 'Mountain Village'
        }
    ];
    
    let galleryHTML = '';
    
    if (images && images.length > 0) {
        images.slice(0, 6).forEach(image => {
            galleryHTML += `
                <div class="gallery-item" style="background-image: url('${image.url}')" 
                     onclick="openImageModal('${image.url}', '${image.name || 'Mountain Image'}')">
                </div>
            `;
        });
    } else {
        defaultImages.forEach(image => {
            galleryHTML += `
                <div class="gallery-item" style="background-image: url('${image.url}')" 
                     onclick="openImageModal('${image.url}', '${image.title}')">
                </div>
            `;
        });
    }
    
    photoGallery.innerHTML = galleryHTML;
}

// Load culture content
function loadCultureContent(articles) {
    const cultureGrid = document.getElementById('cultureGrid');
    
    const cultureArticles = articles ? articles.filter(article => 
        article.category === 'Culture' || article.tags?.includes('culture')
    ).slice(0, 3) : [];
    
    let cultureHTML = '';
    
    if (cultureArticles.length > 0) {
        cultureArticles.forEach(article => {
            cultureHTML += `
                <div class="culture-card">
                    <div class="culture-image" style="background-image: url('${article.image || 'https://images.unsplash.com/photo-1580136579317-67b4b0edef52?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'}')"></div>
                    <div class="culture-content">
                        <h3>${article.title}</h3>
                        <p>${article.excerpt}</p>
                    </div>
                </div>
            `;
        });
    } else {
        // Default culture content
        cultureHTML = `
            <div class="culture-card">
                <div class="culture-image" style="background-image: url('https://images.unsplash.com/photo-1580136579317-67b4b0edef52?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')"></div>
                <div class="culture-content">
                    <h3>Traditional Garhwali Culture</h3>
                    <p>Explore the rich traditions, festivals, and customs of Uttarakhand's indigenous communities.</p>
                </div>
            </div>
            <div class="culture-card">
                <div class="culture-image" style="background-image: url('https://images.unsplash.com/photo-1594736797933-d0f1482b0616?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')"></div>
                <div class="culture-content">
                    <h3>Local Cuisine</h3>
                    <p>Discover the unique flavors and traditional recipes of mountain cuisine.</p>
                </div>
            </div>
            <div class="culture-card">
                <div class="culture-image" style="background-image: url('https://images.unsplash.com/photo-1623053530135-6b5c6798ca4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"></div>
                <div class="culture-content">
                    <h3>Folk Arts & Music</h3>
                    <p>Experience the vibrant performing arts traditions of the Himalayan region.</p>
                </div>
            </div>
        `;
    }
    
    cultureGrid.innerHTML = cultureHTML;
}

// Load adventure content
function loadAdventureContent(articles) {
    const adventureGrid = document.getElementById('adventureGrid');
    
    const adventureArticles = articles ? articles.filter(article => 
        article.category === 'Adventure' || article.tags?.includes('adventure')
    ).slice(0, 3) : [];
    
    let adventureHTML = '';
    
    if (adventureArticles.length > 0) {
        adventureArticles.forEach(article => {
            adventureHTML += `
                <div class="adventure-card">
                    <div class="adventure-image" style="background-image: url('${article.image || 'https://images.unsplash.com/photo-1559666126-84d0e8c4f9f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}')"></div>
                    <div class="adventure-content">
                        <h3>${article.title}</h3>
                        <p>${article.excerpt}</p>
                    </div>
                </div>
            `;
        });
    } else {
        // Default adventure content
        adventureHTML = `
            <div class="adventure-card">
                <div class="adventure-image" style="background-image: url('https://images.unsplash.com/photo-1559666126-84d0e8c4f9f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"></div>
                <div class="adventure-content">
                    <h3>Trekking Routes</h3>
                    <p>From beginner trails to challenging high-altitude expeditions in the Himalayas.</p>
                </div>
            </div>
            <div class="adventure-card">
                <div class="adventure-image" style="background-image: url('https://images.unsplash.com/photo-1598880940080-7fc0e4cbfc57?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80')"></div>
                <div class="adventure-content">
                    <h3>River Rafting</h3>
                    <p>White water adventures on the Ganga and other Himalayan rivers.</p>
                </div>
            </div>
            <div class="adventure-card">
                <div class="adventure-image" style="background-image: url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"></div>
                <div class="adventure-content">
                    <h3>Winter Sports</h3>
                    <p>Skiing and snowboarding in Auli and other winter destinations.</p>
                </div>
            </div>
        `;
    }
    
    adventureGrid.innerHTML = adventureHTML;
}

// Video gallery would be loaded similarly
function loadVideoGallery() {
    // Implementation for video gallery
    const videoGallery = document.getElementById('videoGallery');
    videoGallery.innerHTML = `
        <div class="video-item">
            <div class="video-thumbnail" style="background-image: url('https://images.unsplash.com/photo-1559666126-84d0e8c4f9f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"></div>
            <div class="video-content">
                <h3>Uttarakhand Adventure Preview</h3>
                <p>Experience the thrill of adventure sports in the Himalayas.</p>
            </div>
        </div>
    `;
}

// Make functions available globally
window.openImageModal = openImageModal;