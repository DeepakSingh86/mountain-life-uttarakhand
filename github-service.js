// GitHub Service for Data Storage (No Token Required - Public Repository)
class GitHubService {
    constructor() {
        this.config = {
            username: 'DeepakSingh86',
            repo: 'mountain-life-uttarakhand',
            branch: 'main'
        };
        this.baseURL = 'https://api.github.com';
        this.rawBaseURL = 'https://raw.githubusercontent.com';
    }

    // Get default headers
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        };
    }

    // Read data from GitHub (Public access)
    async readData(filePath) {
        try {
            console.log(`📖 Reading ${filePath} from GitHub...`);
            
            // Use raw.githubusercontent.com for public repositories
            const response = await fetch(
                `${this.rawBaseURL}/${this.config.username}/${this.config.repo}/${this.config.branch}/${filePath}`,
                { 
                    method: 'GET',
                    headers: this.getHeaders()
                }
            );
            
            if (response.status === 404) {
                console.log(`📝 File ${filePath} not found, using default data`);
                return this.getDefaultDataForPath(filePath);
            }
            
            if (!response.ok) {
                throw new Error(`Failed to read ${filePath}: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`✅ Successfully loaded ${filePath}`);
            return data;
        } catch (error) {
            console.error(`❌ Error reading ${filePath}:`, error);
            return this.getDefaultDataForPath(filePath);
        }
    }

    // Save data using GitHub Pages approach
    async saveData(filePath, content) {
        try {
            console.log(`💾 Attempting to save ${filePath}...`);
            
            // For public repositories without authentication, we can't directly write via API
            // Instead, we'll store in localStorage and provide download option
            this.saveToLocalStorage(filePath, content);
            
            // Create downloadable JSON file
            this.createDownloadableFile(filePath, content);
            
            console.log(`✅ Data prepared for manual upload to ${filePath}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error preparing ${filePath} for upload:`, error);
            return false;
        }
    }

    // Save to localStorage as backup
    saveToLocalStorage(filePath, content) {
        try {
            const key = `github_${filePath.replace(/\//g, '_')}`;
            localStorage.setItem(key, JSON.stringify(content));
            console.log(`📱 Backup saved to localStorage: ${key}`);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    // Load from localStorage
    loadFromLocalStorage(filePath) {
        try {
            const key = `github_${filePath.replace(/\//g, '_')}`;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    // Create downloadable JSON file
    createDownloadableFile(filePath, content) {
        try {
            const dataStr = JSON.stringify(content, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.download = filePath.split('/').pop();
            downloadLink.href = URL.createObjectURL(dataBlob);
            downloadLink.style.display = 'none';
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            console.log(`📥 Download ready for: ${filePath}`);
        } catch (error) {
            console.error('Error creating downloadable file:', error);
        }
    }

    // Save all website data
    async saveAllData(websiteData) {
        try {
            console.log('💾 Preparing all data for GitHub...');
            
            const results = await Promise.allSettled([
                this.saveData('data/destinations.json', websiteData.destinations),
                this.saveData('data/gallery.json', websiteData.gallery),
                this.saveData('data/news.json', websiteData.news),
                this.saveData('data/taglines.json', websiteData.taglines)
            ]);

            console.log('✅ All data prepared for manual upload to GitHub');
            return true;
        } catch (error) {
            console.error('❌ Error preparing data:', error);
            return false;
        }
    }

    // Load all website data from GitHub
    async loadAllData() {
        try {
            console.log('📥 Loading all data from GitHub...');
            
            // Try to load from GitHub first
            const [destinations, gallery, news, taglines] = await Promise.all([
                this.readData('data/destinations.json'),
                this.readData('data/gallery.json'),
                this.readData('data/news.json'),
                this.readData('data/taglines.json')
            ]);
            
            const loadedData = {
                destinations: destinations || [],
                gallery: gallery || [],
                news: news || [],
                taglines: taglines || this.getDefaultTaglines()
            };
            
            console.log('✅ Data loaded successfully');
            return loadedData;
            
        } catch (error) {
            console.error('❌ Error loading data from GitHub:', error);
            return this.getDefaultData();
        }
    }

    // Get default data for specific file path
    getDefaultDataForPath(filePath) {
        const defaultData = this.getDefaultData();
        switch(filePath) {
            case 'data/destinations.json':
                return defaultData.destinations;
            case 'data/gallery.json':
                return defaultData.gallery;
            case 'data/news.json':
                return defaultData.news;
            case 'data/taglines.json':
                return defaultData.taglines;
            default:
                return [];
        }
    }

    // Get default data structure
    getDefaultData() {
        return {
            destinations: [
                {
                    id: 1,
                    name: "Rishikesh - Yoga Capital",
                    description: "The Yoga Capital of the World, situated on the banks of the holy Ganges river. Known for spiritual retreats and adventure sports.",
                    image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    region: "Garhwal"
                },
                {
                    id: 2,
                    name: "Nainital - Lake District",
                    description: "The Lake District of India, famous for its beautiful Naini Lake and pleasant climate throughout the year.",
                    image: "https://images.unsplash.com/photo-1597149877677-2c64d93c4c51?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    region: "Kumaon"
                },
                {
                    id: 3,
                    name: "Mussoorie - Queen of Hills",
                    description: "Famous for its scenic beauty, colonial architecture, and panoramic views of the Himalayan ranges.",
                    image: "https://images.unsplash.com/photo-1563793254321-ec66e66ccd6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
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
                    title: "River Rafting",
                    image: "https://images.unsplash.com/photo-1563793254321-ec66e66ccd6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    category: "adventure"
                }
            ],
            news: [
                {
                    id: 1,
                    title: "Char Dham Yatra 2024 Season Begins",
                    content: "The sacred Char Dham Yatra pilgrimage has officially started with enhanced facilities and safety measures for all devotees.",
                    date: "2024-05-01"
                },
                {
                    id: 2,
                    title: "New Adventure Sports Launched",
                    content: "Experience thrilling new adventure activities including paragliding and rock climbing in various hill stations.",
                    date: "2024-04-25"
                }
            ],
            taglines: this.getDefaultTaglines()
        };
    }

    getDefaultTaglines() {
        return [
            "Discover the Land of Gods - Uttarakhand",
            "Experience Serenity in the Himalayan Abode",
            "Your Gateway to Spiritual and Adventure Tourism",
            "Explore the Unexplored Beauty of Devbhoomi",
            "Where Mountains Meet Heaven - Uttarakhand Awaits"
        ];
    }

    // Get GitHub repository URL for manual upload
    getRepoURL() {
        return `https://github.com/${this.config.username}/${this.config.repo}/tree/main/data`;
    }

    // Initialize service
    async initialize() {
        console.log('🚀 GitHub Service Initialized');
        return true;
    }
}

// Create global instance
const githubService = new GitHubService();
