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

// // Admin credentials
// const ADMIN_CREDENTIALS = {
    // username: "admin",
    // password: "uttarakhand2024"
// };

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
	initApp();
});

// Sections = each corresponds to a JSON file
const FILES = ["destinations", "gallery", "news", "testimonials", "taglines"];

async 
function loadData() {
    // Try to load local JSON files from the data/ folder first (works for local server and GitHub Pages).
    const dataFiles = ['data/destinations.json','data/gallery.json','data/news.json','data/taglines.json','data/testimonials.json','data.json'];
    function fetchJson(path) {
        return fetch(path).then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status + ' loading ' + path);
            return r.json().catch(()=>{return null;});
        }).catch(err=>{ console.warn('Failed to load', path, err); return null; });
    }
    Promise.all(dataFiles.map(f => fetchJson(f))).then(results => {
        const keys = ['destinations','gallery','news','taglines','testimonials','raw'];
        results.forEach((res, idx) => {
            if (!res) return;
            try {
                if (idx === 5) {
                    Object.assign(websiteData, res);
                } else {
                    websiteData[keys[idx]] = res;
                }
            } catch (e){ console.warn('merge fail', e); }
        });
        if ((!websiteData.news || websiteData.news.length === 0) && websiteData.raw && websiteData.raw.news) {
            websiteData.news = websiteData.raw.news;
        }
        try { updatePageContent(); } catch(e){}
        try { initializeEnhancements(); } catch(e){}
    }).catch(err=>{
        console.error('loadData error', err);
    });
}



// // Load JSON data from GitHub
// async 
function loadData() {
    // Try to load local JSON files from the data/ folder first (works for local server and GitHub Pages).
    const dataFiles = ['data/destinations.json','data/gallery.json','data/news.json','data/taglines.json','data/testimonials.json','data.json'];
    function fetchJson(path) {
        return fetch(path).then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status + ' loading ' + path);
            return r.json().catch(()=>{return null;});
        }).catch(err=>{ console.warn('Failed to load', path, err); return null; });
    }
    Promise.all(dataFiles.map(f => fetchJson(f))).then(results => {
        const keys = ['destinations','gallery','news','taglines','testimonials','raw'];
        results.forEach((res, idx) => {
            if (!res) return;
            try {
                if (idx === 5) {
                    Object.assign(websiteData, res);
                } else {
                    websiteData[keys[idx]] = res;
                }
            } catch (e){ console.warn('merge fail', e); }
        });
        if ((!websiteData.news || websiteData.news.length === 0) && websiteData.raw && websiteData.raw.news) {
            websiteData.news = websiteData.raw.news;
        }
        try { updatePageContent(); } catch(e){}
        try { initializeEnhancements(); } catch(e){}
    }).catch(err=>{
        console.error('loadData error', err);
    });
}


// // Load data from localStorage or initialize with default data
// 
function loadData() {
    // Try to load local JSON files from the data/ folder first (works for local server and GitHub Pages).
    const dataFiles = ['data/destinations.json','data/gallery.json','data/news.json','data/taglines.json','data/testimonials.json','data.json'];
    function fetchJson(path) {
        return fetch(path).then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status + ' loading ' + path);
            return r.json().catch(()=>{return null;});
        }).catch(err=>{ console.warn('Failed to load', path, err); return null; });
    }
    Promise.all(dataFiles.map(f => fetchJson(f))).then(results => {
        const keys = ['destinations','gallery','news','taglines','testimonials','raw'];
        results.forEach((res, idx) => {
            if (!res) return;
            try {
                if (idx === 5) {
                    Object.assign(websiteData, res);
                } else {
                    websiteData[keys[idx]] = res;
                }
            } catch (e){ console.warn('merge fail', e); }
        });
        if ((!websiteData.news || websiteData.news.length === 0) && websiteData.raw && websiteData.raw.news) {
            websiteData.news = websiteData.raw.news;
        }
        try { updatePageContent(); } catch(e){}
        try { initializeEnhancements(); } catch(e){}
    }).catch(err=>{
        console.error('loadData error', err);
    });
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

// --- Update tagline safely ---
function updateTagline() {
  const taglineElement = document.getElementById("tagline");
  if (!taglineElement) return;

  const taglines = websiteData.taglines;

  // if data not ready yet, skip
  if (!Array.isArray(taglines) || taglines.length === 0) return;

  const randomIndex = Math.floor(Math.random() * taglines.length);
  taglineElement.textContent = String(taglines[randomIndex] || "");
}

// --- Start rotation once data is available ---
function initializeTaglineRotation() {
  // try immediately
  updateTagline();

  // keep checking every 500ms until taglines are loaded
  const waitForData = setInterval(() => {
    if (Array.isArray(websiteData.taglines) && websiteData.taglines.length > 0) {
      updateTagline();           // show instantly when data arrives
      clearInterval(waitForData);
      setInterval(updateTagline, 120000); // update every 2 min
    }
  }, 500);
}

// --- Load data then trigger ---
async function initApp() {
  //await loadData();         // your GitHub JSON fetch
  initializeTaglineRotation();
}



// // Update tagline every 2 minutes
// function initializeTaglineRotation() {
    // updateTagline(); // Initial update
    
    // // Update every 2 minutes (120000 milliseconds)
    // setInterval(updateTagline, 120000);
// }

// // Update the tagline display
// function updateTagline() {
 // console.log(websiteData.taglines);
    // const taglineElement = document.getElementById('tagline');
    // if (websiteData.taglines.length > 0) {
			// alert();
        // const randomIndex = Math.floor(Math.random() * websiteData.taglines.length);
        // taglineElement.textContent = websiteData.taglines[randomIndex];
    // }
// }

// Initialize stats animation
function initializeStatsAnimation() {
    // Only run on about page
    if (window.location.pathname.includes('about.html')) {
        animateStats();
    }
}

// // Animate statistics counters
// function animateStats() {
    // const stats = websiteData.stats || {};

    // animateValue('destinations-count', 0, Math.max(102, stats.destinations || 0), 2000);
    // animateValue('visitors-count', 0, Math.max(0, stats.visitors || 0), 2000);
    // animateValue('years-count', 0, Math.max(0, stats.years || 0), 2000);
    // animateValue('satisfaction-count', 0, Math.max(0, stats.satisfaction || 0), 2000, true);
// }

// // Animate a value from start to end safely (no negatives)
// function animateValue(id, start, end, duration, isPercentage = false) {
    // const element = document.getElementById(id);
    // if (!element) return;

    // // Ensure valid numeric values and prevent negative range
    // start = Math.max(0, Number(start) || 0);
    // end = Math.max(0, Number(end) || 0);

    // const range = end - start;
    // if (range === 0) {
        // element.innerHTML = isPercentage ? end + "%" : formatNumber(end);
        // return;
    // }

    // const stepTime = Math.max(10, Math.floor(duration / range));
    // let current = start;

    // const timer = setInterval(() => {
        // current++;
        // element.innerHTML = isPercentage ? current + "%" : formatNumber(current);

        // if (current >= end) {
            // clearInterval(timer);
            // element.innerHTML = isPercentage ? end + "%" : formatNumber(end);
        // }
    // }, stepTime);
// }

// Optional number formatting for commas
function formatNumber(num) {
    return num.toLocaleString();
}


 // // Animate statistics counters
 // function animateStats() {
   // const stats = websiteData.stats;
    
   // // Animate each counter
   // animateValue('destinations-count', 0, stats.destinations, 2000);
    // animateValue('visitors-count', 0, stats.visitors, 2000);
   // animateValue('years-count', 0, stats.years, 2000);
 // //    animateValue('satisfaction-count', 0, stats.years, 2000);
   // animateValue('satisfaction-count', 0, Math.max(100,100), 100, true);
 // }

// // Animate a value from start to end
 // function animateValue(id, start, end, duration, isPercentage = false) {
     // const element = document.getElementById(id);
     // if (!element) return;
    
     // const range = end - start;
     // const increment = end > start ? 1 : +1;
     // const stepTime = Math.abs(Math.floor(duration / range));
     // let current = start;
    
     // const timer = setInterval(function() {
        // current += increment;
        // element.innerHTML = isPercentage ? 100 + "%" : formatNumber(current);
       
        // if (current === end) {
         // // clearInterval(timer);
        // }
    // }, stepTime);
// }


// --- Base data (starting point) ---
const websiteDataCount = {
  stats: {
    destinations: 56,   // starting count
    visitors: 85402,    // starting count
    years: 6.5,
    satisfaction: 87    // percent
  }
};

// --- Config: daily growth values ---
const DAILY_INCREMENTS = { destinations: 13, visitors: 452 };

// --- Reference start date (set the real launch date) ---
const START_DATE = new Date("2025-10-26"); // change this to your site start date

// --- Calculate days passed since start date ---
function getDaysSinceStart() {
  const today = new Date();
  const diffTime = today.setHours(0, 0, 0, 0) - START_DATE.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
}

// --- Apply date-based increments automatically ---
function applyDateBasedIncrements() {
  const daysPassed = getDaysSinceStart();

  websiteDataCount.stats.destinations =
    56 + (DAILY_INCREMENTS.destinations * daysPassed);

  websiteDataCount.stats.visitors =
    85402 + (DAILY_INCREMENTS.visitors * daysPassed);
}

// --- Easing and formatting functions ---
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function formatValue(value, decimals = 0, suffix = '', useThousands = false) {
  let val = value.toFixed(decimals);
  if (useThousands) {
    val = Number(val).toLocaleString();
  }
  return val + suffix;
}

// --- Animate Stats ---
function animateStats() { 
  const s = websiteDataCount.stats;

  const counters = [
    { id: 'destinations-count', end: s.destinations, duration: 2000, opts: { decimals: 0 } },
    { id: 'visitors-count',    end: s.visitors,    duration: 2200, opts: { decimals: 0, useThousands: true } },
    { id: 'years-count',       end: s.years,       duration: 1800, opts: { decimals: 1 } },
    { id: 'satisfaction-count',end: s.satisfaction, duration: 1800, opts: { decimals: 0, suffix: '%' } }
  ];

  counters.forEach(c => animateValue(0, c.end, c.duration, c.id, c.opts));
}

function animateValue(start, end, duration, elementId, options = {}) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const {
    decimals = 0,
    suffix = '',
    useThousands = false,
    easeFn = easeOutCubic
  } = options;

  if (start === end || duration <= 0) {
    el.textContent = formatValue(end, decimals, suffix, useThousands);
    return;
  }

  const startTime = performance.now();
  const range = end - start;

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const easedT = easeFn(t);
    const current = start + (range * easedT);
    el.textContent = formatValue(current, decimals, suffix, useThousands);

    if (t < 1) requestAnimationFrame(step);
    else el.textContent = formatValue(end, decimals, suffix, useThousands);
  }

  requestAnimationFrame(step);
}

// --- Run everything ---
applyDateBasedIncrements();
animateStats();

/** Default easing (feel free to swap) */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* Optional: another easing examples you could use:
function linear(t){ return t; }
function easeOutQuad(t){ return 1 - (1 - t)*(1 - t); }
*/

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
    // const loginForm = document.getElementById('login-form');
    // if (loginForm) {
        // loginForm.addEventListener('submit', function(e) {
            // e.preventDefault();
            // const username = document.getElementById('username').value;
            // const password = document.getElementById('password').value;
            
            // if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                // document.getElementById('login-section').style.display = 'none';
                // document.getElementById('admin-dashboard').style.display = 'block';
                // loadAdminData();
            // } else {
                // alert('Invalid credentials!');
            // }
        // });
    // }
	 document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadAdminData();
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
			exportAllSections();
           // exportData();
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

function exportAllSections() {
  for (const name of FILES) {
    const data = websiteData[name] ?? [];
    downloadJSON(`${name}.json`, data);
  }

  const el = document.getElementById("export-result");
  if (el) el.innerHTML = `<p>✅ Exported ${FILES.length} files: ${FILES.join(", ")}</p>`;
}


function downloadJSON(filename, obj) {
  const dataStr = JSON.stringify(obj, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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









/* ====== Enhancements: Read More, Image Lightbox, Video Modal ====== */
// (same enhancement code - concise)
function setupReadMore(selector = '.news-card .news-content p', maxChars = 220) {
    document.querySelectorAll(selector).forEach(p => {
        if (p.dataset.processed) return;
        const fullText = p.innerHTML;
        const plain = p.textContent || p.innerText || '';
        if (plain.length <= maxChars) { p.dataset.processed='1'; return; }
        const visible = plain.slice(0, maxChars).trim();
        const truncatedHTML = visible + '... ';
        const readMoreBtn = document.createElement('button');
        readMoreBtn.className = 'readmore-btn';
        readMoreBtn.innerText = 'Read more';
        readMoreBtn.addEventListener('click', function() {
            if (readMoreBtn.innerText === 'Read more') {
                p.innerHTML = fullText + ' ';
                readMoreBtn.innerText = 'Show less';
                setupInlineVideoButtons(p);
                setupImageClickables(p);
            } else {
                p.innerHTML = truncatedHTML;
                readMoreBtn.innerText = 'Read more';
            }
            p.appendChild(readMoreBtn);
        });
        p.innerHTML = truncatedHTML;
        p.appendChild(readMoreBtn);
        p.dataset.processed = '1';
        setupInlineVideoButtons(p);
        setupImageClickables(p);
    });
}

function setupImageLightbox() {
    document.body.addEventListener('click', function(e) {
        const t = e.target;
        if (t.tagName === 'IMG' && t.closest('.gallery-item, .news-card, .item-card, .card, .gallery-grid, .dest-card, .photo')) {
            openImageModal(t.src, t.alt || '');
        }
        if (t.tagName === 'A' && t.querySelector && t.querySelector('img')) {
            const img = t.querySelector('img');
            openImageModal(img.src, img.alt || '');
            e.preventDefault();
        }
    });
}

function setupImageClickables(scope) {
    (scope ? scope : document).querySelectorAll('img').forEach(img=>{
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function(ev){
            ev.stopPropagation();
            openImageModal(img.src, img.alt || '');
        });
    });
}

function openImageModal(src, alt) {
    let modal = document.getElementById('site-image-modal');
    if (!modal) return;
    const img = modal.querySelector('img');
    img.src = src;
    img.alt = alt;
    modal.classList.add('open');
}

function closeImageModal() {
    const modal = document.getElementById('site-image-modal');
    if (!modal) return;
    modal.classList.remove('open');
    const img = modal.querySelector('img');
    img.src = '';
}

function setupInlineVideoButtons(scope) {
    const container = scope || document;
    const urlRegex = /(https?:\/\/[^\s'"]+)/g;
    container.querySelectorAll('a').forEach(a=>{
        const href = a.getAttribute('href') || '';
        if (!href || a.dataset.vsetup) return;
        const yt = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_\-]+)/);
        if (yt) { addVideoPlayButton(a, 'youtube', yt[1]); a.dataset.vsetup='1'; return; }
        if (href.includes('facebook.com') || href.includes('fb.watch')) { addVideoPlayButton(a, 'facebook', href); a.dataset.vsetup='1'; return; }
        if (href.match(/\.(mp4|webm|ogg)(\?|$)/)) { addVideoPlayButton(a, 'direct', href); a.dataset.vsetup='1'; return; }
    });
}

function addVideoPlayButton(anchor, type, idOrUrl) {
    const btn = document.createElement('button');
    btn.className = 'video-play-btn';
    btn.title = 'Play video';
    btn.innerHTML = '<i class="fas fa-play"></i>';
    btn.addEventListener('click', function(ev){
        ev.preventDefault(); ev.stopPropagation();
        openVideoModal(type, idOrUrl);
    });
    anchor.parentNode.insertBefore(btn, anchor.nextSibling);
}

function openVideoModal(type, idOrUrl) {
    const modal = document.getElementById('site-video-modal');
    if (!modal) return;
    const container = modal.querySelector('.video-container');
    container.innerHTML = '';
    if (type === 'youtube') {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + idOrUrl + '?autoplay=1';
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
        iframe.allowFullscreen = true;
        container.appendChild(iframe);
    } else if (type === 'facebook') {
        const iframe = document.createElement('iframe');
        iframe.src = idOrUrl;
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
        iframe.allowFullscreen = true;
        container.appendChild(iframe);
    } else if (type === 'direct') {
        const vid = document.createElement('video');
        vid.src = idOrUrl;
        vid.controls = true; vid.autoplay = true;
        container.appendChild(vid);
    }
    modal.classList.add('open');
}

function closeVideoModal() {
    const modal = document.getElementById('site-video-modal');
    if (!modal) return;
    const container = modal.querySelector('.video-container');
    container.innerHTML = '';
    modal.classList.remove('open');
}

document.addEventListener('click', function(e){
    const imgModal = document.getElementById('site-image-modal');
    if (imgModal && imgModal.classList.contains('open') && e.target.matches('#site-image-modal .close, #site-image-modal')) {
        closeImageModal();
    }
    const vidModal = document.getElementById('site-video-modal');
    if (vidModal && vidModal.classList.contains('open') && e.target.matches('#site-video-modal .close, #site-video-modal')) {
        closeVideoModal();
    }
});
document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') { closeImageModal(); closeVideoModal(); }
});

function initializeEnhancements() {
    setupReadMore();
    setupImageLightbox();
    setupImageClickables();
    setupInlineVideoButtons(document);
}
