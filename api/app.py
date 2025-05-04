"""
Blog Application API
Created by: Jairaj Kolhatkar
A simple Flask API for a blog application with in-memory storage
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import base64
import random

app = Flask(__name__)
CORS(app)

# In-memory storage instead of MySQL
posts = []
post_id_counter = 1
tags = []
tag_id_counter = 1
post_tags = []

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Simple Blog API!"})

@app.route('/api/posts', methods=['GET'])
def get_posts():
    return jsonify(posts)

@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    for post in posts:
        if post['id'] == post_id:
            # Add tags to post
            post_tag_ids = [pt['tag_id'] for pt in post_tags if pt['post_id'] == post_id]
            post_tag_names = [tag['name'] for tag in tags if tag['id'] in post_tag_ids]
            post_with_tags = post.copy()
            post_with_tags['tags'] = post_tag_names
            return jsonify(post_with_tags)
    
    return jsonify({"error": "Post not found"}), 404

@app.route('/api/posts', methods=['POST'])
def create_post():
    global post_id_counter
    
    data = request.json
    print(f"Received post data: {data}")
    
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({"error": "Title and content are required"}), 400
    
    new_post = {
        'id': post_id_counter,
        'title': data['title'],
        'content': data['content'],
    }
    
    # Handle background image if provided
    if 'backgroundImage' in data and data['backgroundImage']:
        new_post['backgroundImage'] = data['backgroundImage']
    
    posts.append(new_post)
    post_id = post_id_counter
    post_id_counter += 1
    
    # Handle tags
    if 'tags' in data and isinstance(data['tags'], list):
        for tag_name in data['tags']:
            if not tag_name.strip():
                continue
                
            # Check if tag exists
            tag_id = None
            for tag in tags:
                if tag['name'] == tag_name:
                    tag_id = tag['id']
                    break
            
            # Create new tag if it doesn't exist
            if tag_id is None:
                global tag_id_counter
                tag_id = tag_id_counter
                tags.append({'id': tag_id, 'name': tag_name})
                tag_id_counter += 1
            
            # Link post and tag
            post_tags.append({'post_id': post_id, 'tag_id': tag_id})
    
    return jsonify({"id": post_id, "message": "Post created successfully"}), 201

@app.route('/api/tags', methods=['GET'])
def get_tags():
    return jsonify(tags)

@app.route('/api/posts/tag/<tag_name>', methods=['GET'])
def get_posts_by_tag(tag_name):
    # Find tag id
    tag_id = None
    for tag in tags:
        if tag['name'] == tag_name:
            tag_id = tag['id']
            break
    
    if tag_id is None:
        return jsonify([])
    
    # Find posts with this tag
    post_ids = [pt['post_id'] for pt in post_tags if pt['tag_id'] == tag_id]
    filtered_posts = [post for post in posts if post['id'] in post_ids]
    
    return jsonify(filtered_posts)

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    global posts
    
    # Find post by ID
    post_index = None
    for i, post in enumerate(posts):
        if post['id'] == post_id:
            post_index = i
            break
    
    if post_index is None:
        return jsonify({"error": "Post not found"}), 404
    
    # Remove post
    deleted_post = posts.pop(post_index)
    
    # Remove post tags relations
    global post_tags
    post_tags = [pt for pt in post_tags if pt['post_id'] != post_id]
    
    return jsonify({"message": f"Post '{deleted_post['title']}' deleted successfully"}), 200

if __name__ == '__main__':
    # Add some sample data with properly formatted HTML content
    
    # Sample post 1
    posts.append({
        'id': post_id_counter,
        'title': 'Getting Started with React',
        'content': '''
        <h2>Introduction to React</h2>
        <p>React is a popular JavaScript library for building user interfaces. It makes creating interactive UIs painless and efficient. React lets you compose complex UIs from small, isolated pieces of code called components.</p>
        
        <h3>Key Features of React</h3>
        <ul>
            <li><strong>Declarative</strong>: React makes it painless to create interactive UIs. Design simple views for each state in your application.</li>
            <li><strong>Component-Based</strong>: Build encapsulated components that manage their own state, then compose them to make complex UIs.</li>
            <li><strong>Learn Once, Write Anywhere</strong>: You can develop new features in React without rewriting existing code.</li>
        </ul>
        
        <h3>A Simple Component</h3>
        <pre><code>
function Welcome(props) {
  return &lt;h1&gt;Hello, {props.name}&lt;/h1&gt;;
}
        </code></pre>
        
        <p>React has been designed from the start for gradual adoption, and you can use as little or as much React as you need.</p>
        '''
    })
    post_id_counter += 1
    
    # Add tags for the first post
    tags.append({'id': tag_id_counter, 'name': 'React'})
    post_tags.append({'post_id': 1, 'tag_id': tag_id_counter})
    tag_id_counter += 1
    
    tags.append({'id': tag_id_counter, 'name': 'JavaScript'})
    post_tags.append({'post_id': 1, 'tag_id': tag_id_counter})
    tag_id_counter += 1
    
    # Sample post 2
    posts.append({
        'id': post_id_counter,
        'title': 'Building RESTful APIs with Flask',
        'content': '''
        <h2>What is Flask?</h2>
        <p>Flask is a lightweight WSGI web application framework in Python. It is designed to make getting started quick and easy, with the ability to scale up to complex applications.</p>
        
        <p>Flask is considered a microframework because it does not require particular tools or libraries. It has no database abstraction layer, form validation, or any other components where pre-existing third-party libraries provide common functions.</p>
        
        <h3>A Basic Flask App</h3>
        <pre><code>
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
        </code></pre>
        
        <h3>REST API with Flask</h3>
        <p>Flask makes it easy to create RESTful APIs. Here's how you can define routes:</p>
        
        <blockquote>
        REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP methods explicitly and are stateless.
        </blockquote>
        
        <p>Common HTTP methods used in RESTful APIs:</p>
        <ul>
            <li><strong>GET</strong>: Retrieve resources</li>
            <li><strong>POST</strong>: Create a new resource</li>
            <li><strong>PUT</strong>: Update an existing resource</li>
            <li><strong>DELETE</strong>: Remove a resource</li>
        </ul>
        '''
    })
    post_id_counter += 1
    
    # Add tags for the second post
    tags.append({'id': tag_id_counter, 'name': 'Python'})
    post_tags.append({'post_id': 2, 'tag_id': tag_id_counter})
    tag_id_counter += 1
    
    tags.append({'id': tag_id_counter, 'name': 'Flask'})
    post_tags.append({'post_id': 2, 'tag_id': tag_id_counter})
    tag_id_counter += 1
    
    tags.append({'id': tag_id_counter, 'name': 'API'})
    post_tags.append({'post_id': 2, 'tag_id': tag_id_counter})
    tag_id_counter += 1
    
    # Sample post 3
    posts.append({
        'id': post_id_counter,
        'title': 'CSS Flexbox Layout Guide',
        'content': '''
        <h2>Understanding Flexbox</h2>
        <p>Flexbox is a one-dimensional layout method for arranging items in rows or columns. Items flex (expand) to fill additional space or shrink to fit into smaller spaces.</p>
        
        <h3>The Flex Container</h3>
        <p>To create a flex container, set the <code>display</code> property to <code>flex</code>:</p>
        
        <pre><code>
.container {
  display: flex;
  flex-direction: row; /* or column */
  justify-content: space-between; /* horizontal alignment */
  align-items: center; /* vertical alignment */
  flex-wrap: wrap; /* allows items to wrap */
}
        </code></pre>
        
        <h3>Common Flexbox Properties</h3>
        <ul>
            <li><strong>flex-direction</strong>: Sets the direction of the flex container (row, row-reverse, column, column-reverse)</li>
            <li><strong>justify-content</strong>: Aligns items along the main axis (flex-start, flex-end, center, space-between, space-around)</li>
            <li><strong>align-items</strong>: Aligns items along the cross axis (flex-start, flex-end, center, stretch, baseline)</li>
            <li><strong>flex-wrap</strong>: Controls wrapping of items (nowrap, wrap, wrap-reverse)</li>
        </ul>
        
        <h3>Flexbox Item Properties</h3>
        <p>Individual flex items can be controlled with:</p>
        <pre><code>
.item {
  flex-grow: 1; /* allows item to grow */
  flex-shrink: 0; /* prevents item from shrinking */
  flex-basis: 200px; /* initial size */
  /* shorthand for the above three properties */
  flex: 1 0 200px;
}
        </code></pre>
        
        <p>Flexbox has transformed how we build layouts in CSS, making many complex layouts much easier to achieve.</p>
        '''
    })
    post_id_counter += 1
    
    # Add tags for the third post
    tags.append({'id': tag_id_counter, 'name': 'CSS'})
    post_tags.append({'post_id': 3, 'tag_id': tag_id_counter})
    tag_id_counter += 1
    
    tags.append({'id': tag_id_counter, 'name': 'Web Development'})
    post_tags.append({'post_id': 3, 'tag_id': tag_id_counter})
    tag_id_counter += 1
    
    # Run the app
    app.run(host='127.0.0.1', port=5000, debug=True) 