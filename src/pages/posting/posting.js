// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent page reload
  
    // Get content from the text area
    const postContent = document.getElementById('postContent').value;
  
    // Check if content is empty
    if (!postContent.trim()) {
      alert('Post content cannot be empty.');
      return;
    }
  
    // Prepare to send content to the server or handle it further
    console.log("Post Content:", postContent);
  
    // Handle media upload
    const fileInput = document.getElementById('fileUpload');
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log("Uploaded File:", file);
      // Further processing or sending the file to the server
    }
  
    // Clear the form after submission
    document.getElementById('postForm').reset();
  }
  
  // Function to initialize the page
  function init() {
    // Create navigation bar
    const navbar = document.createElement('div');
    navbar.id = 'navbar';
  
    // Create navigation items
    const exploreTab = document.createElement('a');
    exploreTab.className = 'nav-item';
    exploreTab.href = '#'; // Placeholder link
    exploreTab.textContent = 'Explore';
  
    const followingTab = document.createElement('a');
    followingTab.className = 'nav-item';
    followingTab.href = '#'; // Placeholder link
    followingTab.textContent = 'Following';
  
    // Append navigation items to the navbar
    navbar.appendChild(exploreTab);
    navbar.appendChild(followingTab);
  
    // Append navbar to the body
    document.body.appendChild(navbar);
  
    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
  
    // Create sidebar items
    const homeItem = document.createElement('a');
    homeItem.className = 'sidebar-item';
    homeItem.href = '#'; // Placeholder link
    homeItem.textContent = 'Home';
  
    const searchItem = document.createElement('a');
    searchItem.className = 'sidebar-item';
    searchItem.href = '#'; // Placeholder link
    searchItem.textContent = 'Search';
  
    const accountItem = document.createElement('a');
    accountItem.className = 'sidebar-item';
    accountItem.href = '#'; // Placeholder link
    accountItem.textContent = 'My Account';
  
    // Append sidebar items to the sidebar
    sidebar.appendChild(homeItem);
    sidebar.appendChild(searchItem);
    sidebar.appendChild(accountItem);
  
    // Append sidebar to the body
    document.body.appendChild(sidebar);
  
    // Create a wrapper for the main content
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'content-wrapper';
  
    // Create form element
    const form = document.createElement('form');
    form.id = 'postForm';
  
    // Create text area for post content
    const textArea = document.createElement('textarea');
    textArea.id = 'postContent';
    textArea.placeholder = "What's on your mind?";
  
    // Create file input for media upload
    const fileInput = document.createElement('input');
    fileInput.id = 'fileUpload';
    fileInput.type = 'file';
  
    // Create submit button
    const submitBtn = document.createElement('button');
    submitBtn.id = 'submitBtn';
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Post';
  
    // Append elements to the form
    form.appendChild(textArea);
    form.appendChild(fileInput);
    form.appendChild(submitBtn);
  
    // Append form to the content wrapper
    contentWrapper.appendChild(form);
  
    // Append content wrapper to the body
    document.body.appendChild(contentWrapper);
  
    // Add event listener for form submission
    form.addEventListener('submit', handleSubmit);
  }
  
  // Initialize the page when the script loads
  init();
  