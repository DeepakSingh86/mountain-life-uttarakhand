// GitHub Service for Data Storage
class GitHubService {
    constructor() {
        this.config = {
            username: 'DeepakSingh86',
            repo: 'mountain-life-uttarakhand',
            branch: 'main',
            token: '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'
        };
        this.baseURL = 'https://api.github.com';
        this.isAuthenticated = false;
    }

    // Get headers for API requests
    getHeaders() {
        if (!this.config.token) {
            console.warn('GitHub token not configured');
            return {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            };
        }
        
        return {
            'Authorization': `Bearer ${this.config.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        };
    }

    // Test authentication
    async testAuthentication() {
        try {
            const response = await fetch(`${this.baseURL}/user`, {
                headers: this.getHeaders()
            });
            
            if (response.status === 401) {
                console.error('GitHub authentication failed: Invalid token');
                this.isAuthenticated = false;
                return false;
            }
            
            if (!response.ok) {
                throw new Error(`Authentication test failed: ${response.status}`);
            }
            
            this.isAuthenticated = true;
            console.log('GitHub authentication successful');
            return true;
        } catch (error) {
            console.error('GitHub authentication test failed:', error);
            this.isAuthenticated = false;
            return false;
        }
    }

    // Get file SHA (needed for updates)
    async getFileSHA(filePath) {
        try {
            const response = await fetch(
                `${this.baseURL}/repos/${this.config.username}/${this.config.repo}/contents/${filePath}`,
                { 
                    method: 'GET',
                    headers: this.getHeaders()
                }
            );
            
            if (response.status === 404) {
                return null; // File doesn't exist yet
            }
            
            if (response.status === 401) {
                throw new Error('Authentication failed: Please check your GitHub token');
            }
            
            if (!response.ok) {
                throw new Error(`Failed to get file SHA: ${response.status}`);
            }
            
            const data = await response.json();
            return data.sha;
        } catch (error) {
            console.error('Error getting file SHA:', error);
            throw error;
        }
    }

    // Read data from GitHub
    async readData(filePath) {
        try {
            console.log(`Reading data from: ${filePath}`);
            
            const response = await fetch(
                `${this.baseURL}/repos/${this.config.username}/${this.config.repo}/contents/${filePath}`,
                { 
                    method: 'GET',
                    headers: this.getHeaders()
                }
            );
            
            if (response.status === 404) {
                console.log(`File ${filePath} not found, returning default data`);
                return this.getDefaultDataForPath(filePath);
            }
            
            if (response.status === 401) {
                throw new Error('Authentication failed: Invalid GitHub token');
            }
            
            if (!response.ok) {
                throw new Error(`Failed to read data: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.content) {
                throw new Error('No content found in response');
            }
            
            const content = atob(data.content.replace(/\n/g, '')); // Decode base64
            return JSON.parse(content);
        } catch (error) {
            console.error(`Error reading data from ${filePath}:`, error);
            // Return default data instead of throwing
            return this.getDefaultDataForPath(filePath);
        }
    }

    // Write data to GitHub
    async writeData(filePath, content, commitMessage = 'Update data via website') {
        try {
            // Test authentication first
            if (!await this.testAuthentication()) {
                throw new Error('Cannot write to GitHub: Authentication failed. Please check your token.');
            }

            const sha = await this.getFileSHA(filePath);
            const encodedContent = btoa(JSON.stringify(content, null, 2));
            
            const body = {
                message: commitMessage,
                content: encodedContent,
                branch: this.config.branch
            };
            
            // Add SHA if file exists (for updates)
            if (sha) {
                body.sha = sha;
            }
            
            const response = await fetch(
                `${this.baseURL}/repos/${this.config.username}/${this.config.repo}/contents/${filePath}`,
                {
                    method: 'PUT',
                    headers: this.getHeaders(),
                    body: JSON.stringify(body)
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to write data: ${errorData.message || response.status}`);
            }
            
            console.log(`Successfully saved data to ${filePath}`);
            return true;
        } catch (error) {
            console.error('Error writing data to GitHub:', error);
            throw error;
        }
    }

    // Save all website data to GitHub
    async saveAllData(websiteData) {
        try {
            console.log('Saving all data to GitHub...');
            
            if (!await this.testAuthentication()) {
                throw new Error('Cannot save data: GitHub authentication failed');
            }

            const results = await Promise.allSettled([
                this.writeData('data/destinations.json', websiteData.destinations, 'Update destinations'),
                this.writeData('data/gallery.json', websiteData.gallery, 'Update gallery'),
                this.writeData('data/news.json', websiteData.news, 'Update news'),
                this.writeData('data/taglines.json', websiteData.taglines, 'Update taglines')
            ]);

            // Check if any failed
            const failed = results.filter(result => result.status === 'rejected');
            if (failed.length > 0) {
                console.warn(`Some data failed to save: ${failed.length} files`);
                failed.forEach(fail => console.error('Failed:', fail.reason));
            }

            console.log('Data save operation completed');
            return true;
        } catch (error) {
            console.error('Error saving all data:', error);
            throw error;
        }
    }

    // Load all website data from GitHub
    async loadAllData() {
        try {
            console.log('Loading all data from GitHub...');
            
            const [destinations, gallery, news, taglines] = await Promise.all([
                this.readData('data/destinations.json'),
                this.readData('data/gallery.json'),
                this.readData('data/news.json'),
                this.readData('data/taglines.json')
            ]);
            
            const loadedData = {
                destinations: Array.isArray(destinations) ? destinations : [],
                gallery: Array.isArray(gallery) ? gallery : [],
                news: Array.isArray(news) ? news : [],
                taglines: Array.isArray(taglines) ? taglines : this.getDefaultTaglines()
            };
            
            console.log('Data loaded successfully:', loadedData);
            return loadedData;
        } catch (error) {
            console.error('Error loading data from GitHub:', error);
            // Return default data as fallback
            return this.getDefaultData();
        }
    }

    // Get default data for specific file path
    getDefaultDataForPath(filePath) {
        switch(filePath) {
            case 'data/destinations.json':
                return this.getDefaultData().destinations;
            case 'data/gallery.json':
                return this.getDefaultData().gallery;
            case 'data/news.json':
                return this.getDefaultData().news;
            case 'data/taglines.json':
                return this.getDefaultData().taglines;
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
                    name: "Rishikesh",
                    description: "The Yoga Capital of the World, situated on the banks of the holy Ganges river. Known for its spiritual atmosphere and adventure activities.",
                    image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    region: "Garhwal"
                },
                {
                    id: 2,
                    name: "Nainital",
                    description: "The Lake District of India, famous for its beautiful lakes and pleasant climate. A perfect hill station for family vacations.",
                    image: "https://images.unsplash.com/photo-1597149877677-2c64d93c4c51?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    region: "Kumaon"
                },
                {
                    id: 3,
                    name: "Mussoorie",
                    description: "Queen of the Hills, offering panoramic views of the Himalayan ranges. Famous for its colonial architecture and scenic beauty.",
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
                    title: "River Rafting in Rishikesh",
                    image: "https://images.unsplash.com/photo-1563793254321-ec66e66ccd6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    category: "adventure"
                },
                {
                    id: 4,
                    title: "Jim Corbett National Park",
                    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    category: "wildlife"
                }
            ],
            news: [
                {
                    id: 1,
                    title: "Char Dham Yatra 2024 Season Begins",
                    content: "The sacred Char Dham Yatra has commenced with enhanced safety measures and improved facilities for pilgrims. Book your journey now.",
                    date: "2024-05-01"
                },
                {
                    id: 2,
                    title: "New Adventure Sports Launched in Uttarakhand",
                    content: "Experience thrilling new adventure activities including paragliding, rock climbing, and mountain biking in various hill stations.",
                    date: "2024-04-25"
                },
                {
                    id: 3,
                    title: "Monsoon Tourism Promotion",
                    content: "Special monsoon packages available for hill stations. Enjoy the lush green landscapes and pleasant weather.",
                    date: "2024-04-20"
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
            "Where Mountains Meet Heaven - Uttarakhand",
            "Journey Through the Heart of Himalayas"
        ];
    }

    // Initialize GitHub connection
    async initialize() {
        try {
            await this.testAuthentication();
            return this.isAuthenticated;
        } catch (error) {
            console.error('Failed to initialize GitHub service:', error);
            return false;
        }
    }
}

// Create global instance
const githubService = new GitHubService();
