# Mountain Life in Uttarakhand - Magazine Website

A dynamic, responsive magazine website showcasing the beauty, culture, and adventures of Uttarakhand's Himalayan region.

## Features

- **Modern Newspaper Layout**: Clean, responsive design optimized for all devices
- **Dynamic Content**: All content pulled from external sources (GitHub, Google Drive, Google Sheets)
- **Admin Dashboard**: Easy content management with integration to external services
- **Multiple Content Types**: Support for articles, images, videos, galleries, and embedded media
- **Automated Updates**: Changes in external sources automatically reflect on the website

## Setup Instructions

### 1. Repository Setup

1. Create a GitHub repository for your content
2. Set up the following folder structure:
============================================================
your-repo/
├── content/
│ ├── articles.json
│ └── locations.json
└── images/
=======================================================
### 2. Google Services Setup

1. **Google Sheets**:
- Create a new Google Sheet
- Share it publicly (View access)
- Note the Sheet ID from the URL

2. **Google Drive**:
- Create a folder for your media
- Share it publicly (View access)
- Note the Folder ID from the URL

### 3. Configuration

Update the `CONFIG` object in `integration.js` with your details:

```javascript
const CONFIG = {
 github: {
     repo: 'your-username/your-repo-name',
     branch: 'main',
     contentPath: 'content/',
     imagesPath: 'images/'
 },
 google: {
     sheetId: 'your-google-sheet-id',
     driveFolderId: 'your-google-drive-folder-id'
 }
};
=====================================================
4. API Keys (Optional)
For enhanced functionality, you can set up:

GitHub Personal Access Token (for write operations)

Google API Key (for Sheets and Drive access)
========================================================
Deployment
This is a static website that can be deployed to:

GitHub Pages

Netlify

Vercel

Any static hosting service

Admin Usage
Access the admin panel at /admin.html

Use the dashboard to:

Add/edit/delete articles

Upload images to Google Drive

Manage content in Google Sheets

Monitor integration status

Content Management
Adding Articles via Admin
Click "Add New Article" in the admin panel

Fill in the article details

Save to automatically update GitHub/Google Sheets

Manual Content Updates
GitHub: Edit JSON files in the content folder

Google Sheets: Update the spreadsheet directly

Google Drive: Upload new images/videos to the shared folder

Customization
Modify colors in CSS variables in style.css

Update fonts by changing the Google Fonts import

Add new sections by extending the HTML structure

Customize the integration logic in integration.js

Browser Support
Chrome (latest)

Firefox (latest)

Safari (latest)

Edge (latest)

License
This project is copyright-free and can be used for any purpose.

Support
For issues and questions, please check the documentation or contact the development team.


## Deployment Instructions

1. Upload all files to your web hosting service
2. Update the configuration in `integration.js` with your actual GitHub repository, Google Sheet ID, and Google Drive folder ID
3. Set up your content in the external services
4. Test the website and admin panel functionality

This complete project provides a fully functional, dynamic magazine website for "Mountain Life in Uttarakhand" with all the requested features, including integration with external services, an admin panel, responsive design, and modern UI/UX.