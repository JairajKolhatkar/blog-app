# Blog Application

A modern blog application with a Flask backend API and React frontend. This project allows you to create, view, and delete blog posts with tag categorization and custom background images.

## Features

- Responsive design with modern UI using Bootstrap
- Create blog posts with rich text editor
- Custom background images for posts
- Tag system for categorizing posts
- Search functionality
- Delete posts with confirmation
- Clean and modern glass-morphism design

## Tech Stack

### Backend
- Flask (Python web framework)
- Flask-CORS for handling cross-origin requests
- In-memory data storage
 
### Frontend
- React.js
- React Router for navigation
- Bootstrap for styling
- ReactQuill for rich text editing
- Axios for API requests

## Project Structure

```
blog/
├── api/                # Flask backend
│   ├── app.py          # Main Flask application
│   └── requirements.txt
├── frontend/           # React frontend
│   ├── public/         # Static files
│   │   └── image/      # Background images
│   ├── src/            # Source code
│   │   ├── components/ # React components
│   │   ├── services/   # API services
│   │   ├── App.js      # Main component
│   │   └── index.js    # Entry point
│   └── package.json    # Dependencies
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Python 3.7+
- Node.js 14+
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd blog
   ```

2. Set up the backend:
   ```
   cd api
   pip install -r requirements.txt
   python app.py
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

- **View Posts**: Browse all posts on the home page
- **Read Post**: Click on a post to read its full content
- **Create Post**: Click "Create Post" to write a new blog post
- **Add Background Image**: Upload a custom image when creating a post
- **Delete Post**: Click "Delete Post" on the post detail page
- **Search**: Use the search bar to find posts
- **Browse by Tag**: Click on tags to see related posts

## License

MIT 