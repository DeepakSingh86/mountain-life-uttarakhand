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
    }

    // Get headers for API requests
    getHeaders() {
        return {
            'Authorization': `token ${this.config.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        };
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
                throw new Error(`GitHub API error: ${response.status}`);
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
            const response = await fetch(
                `${this.baseURL}/repos/${this.config.username}/${this.config.repo}/contents/${filePath}`,
                { headers: this.getHeaders() }
            );
            
            if (response.status === 404) {
                return null; // File doesn't exist
            }
            
            if (!response.ok) {
                throw new Error(`Failed to read data: ${response.status}`);
            }
            
            const data = await response.json();
            const content = atob(data.content); // Decode base64
            return JSON.parse(content);
        } catch (error) {
            console.error('Error reading data from GitHub:', error);
            throw error;
        }
    }

    // Write data to GitHub
    async writeData(filePath, content, commitMessage = 'Update data') {
        try {
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
                throw new Error(`Failed to write data: ${errorData.message}`);
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
            const promises = [
                this.writeData('data/destinations.json', websiteData.destinations, 'Update destinations'),
                this.writeData('data/gallery.json', websiteData.gallery, 'Update gallery'),
                this.writeData('data/news.json', websiteData.news, 'Update news'),
                this.writeData('data/taglines.json', websiteData.taglines, 'Update taglines')
            ];
            
            await Promise.all(promises);
            console.log('All data saved to GitHub successfully');
            return true;
        } catch (error) {
            console.error('Error saving all data:', error);
            throw error;
        }
    }

    // Load all website data from GitHub
    async loadAllData() {
        try {
            const [destinations, gallery, news, taglines] = await Promise.all([
                this.readData('data/destinations.json').catch(() => []),
                this.readData('data/gallery.json').catch(() => []),
                this.readData('data/news.json').catch(() => []),
                this.readData('data/taglines.json').catch(() => [])
            ]);
            
            return {
                destinations: destinations || [],
                gallery: gallery || [],
                news: news || [],
                taglines: taglines || this.getDefaultTaglines()
            };
        } catch (error) {
            console.error('Error loading data from GitHub:', error);
            return this.getDefaultData();
        }
    }

    // Get default data structure
    getDefaultData() {
        return {
            destinations: [
                {
                    id: 1,
                    name: "Rishikesh",
                    description: "The Yoga Capital of the World, situated on the banks of the holy Ganges river.",
                    image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    region: "Garhwal"
                },
                {
                    id: 2,
                    name: "Nainital",
                    description: "The Lake District of India, famous for its beautiful lakes and pleasant climate.",
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
                    title: "Char Dham Yatra 2024 Begins",
                    content: "The sacred Char Dham Yatra has commenced with new safety measures in place for pilgrims.",
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
            "Explore the Unexplored Beauty of Devbhoomi"
        ];
    }
}

// Create global instance
const githubService = new GitHubService();

