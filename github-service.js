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
        return {
            'Authorization': `Bearer ${this.config.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
    }

    // Test authentication
    async testAuthentication() {
        try {
            const response = await fetch(`${this.baseURL}/user`, {
                headers: this.getHeaders()
            });
            
            if (response.ok) {
                this.isAuthenticated = true;
                console.log('✅ GitHub authentication successful');
                return true;
            } else {
                console.error('❌ GitHub authentication failed:', response.status);
                this.isAuthenticated = false;
                return false;
            }
        } catch (error) {
            console.error('❌ GitHub authentication error:', error);
            this.isAuthenticated = false;
            return false;
        }
    }

    // Get file SHA (needed for updates)
    async getFileSHA(filePath) {
        try {
            const response = await fetch(
                `${this.baseURL}/repos/${this.config.username}/${this.config.repo}/contents/${filePath}`,
                { headers: this.getHeaders() }
            );
            
            if (response.status === 404) {
                return null; // File doesn't exist yet
            }
            
            if (!response.ok) {
                throw new Error(`Failed to get file SHA: ${response.status}`);
            }
            
            const data = await response.json();
            return data.sha;
        } catch (error) {
            console.error('Error getting file SHA:', error);
            return null;
        }
    }

    // Read data from GitHub
    async readData(filePath) {
        try {
            console.log(`📖 Reading ${filePath} from GitHub...`);
            
            const response = await fetch(
                `${this.baseURL}/repos/${this.config.username}/${this.config.repo}/contents/${filePath}`,
                { headers: this.getHeaders() }
            );
            
            if (response.status === 404) {
                console.log(`📝 File ${filePath} not found, creating default...`);
                const defaultData = this.getDefaultDataForPath(filePath);
                await this.createFile(filePath, defaultData);
                return defaultData;
            }
            
            if (!response.ok) {
                throw new Error(`Failed to read ${filePath}: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.content) {
                throw new Error('No content found in response');
            }
            
            // Decode base64 content
            const content = atob(data.content.replace(/\n/g, ''));
            const parsedData = JSON.parse(content);
            console.log(`✅ Successfully loaded ${filePath}`);
            return parsedData;
        } catch (error) {
            console.error(`❌ Error reading ${filePath}:`, error);
            return this.getDefaultDataForPath(filePath);
        }
    }

    // Create new file in GitHub
    async createFile(filePath, content, commitMessage = 'Create file via website') {
        try {
            const encodedContent = btoa(JSON.stringify(content, null, 2));
            
            const body = {
                message: commitMessage,
                content: encodedContent,
                branch: this.config.branch
            };
            
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
                throw new Error(`Failed to create file: ${errorData.message}`);
            }
            
            console.log(`✅ Created ${filePath} in GitHub`);
            return true;
        } catch (error) {
            console.error(`❌ Error creating ${filePath}:`, error);
            throw error;
        }
    }

    // Write data to GitHub
    async writeData(filePath, content, commitMessage = 'Update via website') {
        try {
            const sha = await this.getFileSHA(filePath);
            const encodedContent = btoa(JSON.stringify(content, null, 2));
            
            const body = {
                message: commitMessage,
                content: encodedContent,
                branch: this.config.branch
            };
            
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
                throw new Error(`Failed to write data: ${errorData.message}`);
            }
            
            console.log(`✅ Successfully saved ${filePath} to GitHub`);
            return true;
        } catch (error) {
            console.error(`❌ Error writing ${filePath}:`, error);
            throw error;
        }
    }

    // Save all website data to GitHub
    async saveAllData(websiteData) {
        try {
            console.log('💾 Saving all data to GitHub...');
            
            const results = await Promise.allSettled([
                this.writeData('data/destinations.json', websiteData.destinations, 'Update destinations'),
                this.writeData('data/gallery.json', websiteData.gallery, 'Update gallery'),
                this.writeData('data/news.json', websiteData.news, 'Update news'),
                this.writeData('data/taglines.json', websiteData.taglines, 'Update taglines')
            ]);

            const failed = results.filter(result => result.status === 'rejected');
            if (failed.length > 0) {
                console.warn(`⚠️ Some files failed to save: ${failed.length}`);
                failed.forEach(fail => console.error('Failed:', fail.reason));
            }

            console.log('✅ All data save operations completed');
            return true;
        } catch (error) {
            console.error('❌ Error saving all data:', error);
            throw error;
        }
    }

    // Load all website data from GitHub
    async loadAllData() {
        try {
            console.log('📥 Loading all data from GitHub...');
            
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
            
            console.log('✅ All data loaded successfully from GitHub');
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
                }
            ],
            news: [
                {
                    id: 1,
                    title: "Char Dham Yatra 2024 Season Begins",
                    content: "The sacred Char Dham Yatra pilgrimage has officially started with enhanced facilities and safety measures for all devotees.",
                    date: "2024-05-01"
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

    // Initialize GitHub connection
    async initialize() {
        return await this.testAuthentication();
    }
}

// Create global instance
const githubService = new GitHubService();
