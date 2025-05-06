// js/blog.js - Scripting for blog functionality

// Configure marked options for Markdown parsing
// Enables features like line breaks, GitHub Flavored Markdown, and header IDs.
// Mangle is set to false to prevent obfuscation of email addresses.
marked.use({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
});

/**
 * Formats a date string into YYYY-MM-DD.
 * @param {string} dateStr - The date string to format.
 * @returns {string} The formatted date string, or an empty string if input is invalid.
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
}

/**
 * Adds a ripple effect to blog cards on click.
 * The effect is only applied if the click target is not a link itself,
 * allowing links within the card to function normally.
 */
function addCardClickEffect() {
  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Check if the click is on the card itself and not on a link within it
      if (e.target.tagName !== 'A' && !e.target.closest('a')) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; // X position within the card
        const y = e.clientY - rect.top;  // Y position within the card
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        // Remove ripple after animation completes
        setTimeout(() => {
          ripple.remove();
        }, 600); // Corresponds to ripple animation duration in CSS
      }
    });
  });
}

/**
 * Renders the list of blog posts with a staggered fade-in animation.
 * @param {Array<Object>} posts - An array of post objects.
 */
function renderBlogList(posts) {
  const list = document.getElementById('blog-list');
  list.innerHTML = ''; // Clear previous list
  
  // Clear post-specific metadata from the header
  document.getElementById('post-metadata').innerHTML = '';
  
  posts.forEach((post, index) => {
    const card = document.createElement('div');
    card.className = 'blog-card';
    // Initial styles for animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    // Staggered transition delay
    card.style.transition = `all 0.5s ease ${index * 0.1}s`;
    
    card.innerHTML = `
      <div class="blog-card-content">
        <h2 class="blog-card-title">
          <a href="#${post.filename}" class="blog-title-link">${post.title}</a>
        </h2>
        <p class="blog-card-summary">${post.summary}</p>
        <div class="blog-card-meta">
          <span class="blog-card-date">${formatDate(post.date)}</span>
        </div>
      </div>
    `;
    
    list.appendChild(card);
    
    // Trigger animation by changing opacity and transform
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 10); // Small delay to ensure styles are applied for transition
  });
  
  list.style.display = 'flex'; // Show list
  document.getElementById('blog-detail').style.display = 'none'; // Hide detail view
  
  // Add click effects after cards are rendered and animations likely started
  setTimeout(addCardClickEffect, posts.length * 100 + 100); // Adjust delay based on number of posts
}

/**
 * Renders the detail view for a single blog post with a fade-in animation.
 * @param {Object} post - The post object.
 * @param {string} md - The Markdown content of the post.
 */
function renderBlogDetail(post, md) {
  const detail = document.getElementById('blog-detail');
  
  // marked.parse will use the KaTeX extension configured globally
  const htmlContent = marked.parse(md);
  
  // Initial styles for animation
  detail.style.opacity = '0';
  detail.style.transform = 'translateY(20px)';
  
  // Update post metadata (title and date) in the header area
  const metadataArea = document.getElementById('post-metadata');
  metadataArea.innerHTML = `
    <h1 class="post-title">${post.title}</h1>
    <span class="post-date">${formatDate(post.date)}</span>
  `;
  
  detail.innerHTML = `<div class="blog-content">${htmlContent}</div>`;
  
  detail.style.display = 'block'; // Show detail view
  document.getElementById('blog-list').style.display = 'none'; // Hide list view
  
  // Trigger animation
  setTimeout(() => {
    detail.style.opacity = '1';
    detail.style.transform = 'translateY(0)';
  }, 10);
}

// Main application logic
let blogPosts = []; // Cache for blog post index

// Fetch blog index and set up routing
fetch('content/blog-index.json')
  .then(res => res.json())
  .then(posts => {
    blogPosts = posts;

    // Initialize KaTeX extension for marked here,
    // ensuring the markedKatex library is loaded and parsed (due to defer on its script tag).
    if (typeof markedKatex === "function") {
      marked.use(markedKatex({ throwOnError: false }));
    } else {
      // This warning helps diagnose if KaTeX doesn't load as expected.
      console.warn("markedKatex function not found when trying to initialize. Math rendering might fail.");
    }
    
    /**
     * Routes to the correct view (list or detail) based on the URL hash.
     */
    function route() {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      
      if (!hash) { // No hash, show blog list
        renderBlogList(blogPosts);
      } else { // Hash present, attempt to show blog detail
        const post = blogPosts.find(p => p.filename === hash);
        if (!post) { // Post not found, redirect to list
          renderBlogList(blogPosts); // Or show a 404 message within blog-detail
          return;
        }
        
        // Fetch Markdown content for the specific post
        fetch('content/blog/' + post.filename)
          .then(res => res.text())
          .then(md => renderBlogDetail(post, md));
      }
    }
    
    // Event listener for the "Blogs" link to navigate to the blog list view
    document.getElementById('blogs-link').addEventListener('click', function(e) {
      // If already on blog.html, prevent page reload and clear hash to show list
      if (window.location.pathname.includes('blog.html')) {
        e.preventDefault();
        if (window.location.hash !== '') { // Only update if there's a hash
            window.location.hash = '';
        } else { // If no hash, and on blog list, re-render (e.g. if state was modified)
            renderBlogList(blogPosts);
        }
      }
      // If on a different page (e.g. index.html), the link will navigate normally.
    });
    
    // Listen for hash changes (e.g., browser back/forward)
    window.addEventListener('hashchange', route);
    
    // Initial route call to render content based on the current URL
    route();
  })
  .catch(error => {
    console.error("Failed to load blog posts:", error);
    // Optionally, display an error message to the user in the UI
    const list = document.getElementById('blog-list');
    if(list) list.innerHTML = "<p>Error loading blog posts. Please try again later.</p>";
  }); 