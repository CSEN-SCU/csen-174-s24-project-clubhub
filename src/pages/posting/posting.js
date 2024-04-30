// Function to initialize the page
function init() {
    // Create a main title
    const mainTitle = document.createElement('h1');
    mainTitle.textContent = 'ClubHub';
  
    // Style the title directly (or handle it via CSS)
    mainTitle.style.textAlign = 'center';
    mainTitle.style.margin = '20px 0';
    mainTitle.style.color = '#333';
  
    // Append title to the body
    document.body.insertBefore(mainTitle, document.body.firstChild);
  
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
  
    navbar.appendChild(exploreTab);
    navbar.appendChild(followingTab);
  
    document.body.appendChild(navbar);
  
    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
  
    const homeItem = document.createElement('a');
    homeItem.className = 'sidebar-item';
    homeItem.href = '#';
    homeItem.textContent = 'Home';
  
    const searchItem = document.createElement('a');
    searchItem.className = 'sidebar-item';
    searchItem.href = '#';
    searchItem.textContent = 'Search';
  
    const accountItem = document.createElement('a');
    accountItem.className = 'sidebar-item';
    accountItem.href = '#';
    accountItem.textContent = 'My Account';
  
    sidebar.appendChild(homeItem);
    sidebar.appendChild(searchItem);
    sidebar.appendChild(accountItem);
  
    document.body.appendChild(sidebar);
  
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'content-wrapper';
  
    const form = document.createElement('form');
    form.id = 'postForm';
  
    const textArea = document.createElement('textarea');
    textArea.id = 'postContent';
    textArea.placeholder = "What's on your mind?";
  
    const fileInput = document.createElement('input');
    fileInput.id = 'fileUpload';
    fileInput.type = 'file';
  
    const submitBtn = document.createElement('button');
    submitBtn.id = 'submitBtn';
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Post';
  
    form.appendChild(textArea);
    form.appendChild(fileInput);
    form.appendChild(submitBtn);
  
    contentWrapper.appendChild(form);
  
    document.body.appendChild(contentWrapper);
  
    form.addEventListener('submit', handleSubmit);
  }
  
  // Function to handle form submission
  function handleSubmit(event) {
    event.preventDefault();
  
    const postContent = document.getElementById('postContent').value;
  
    if (!postContent.trim()) {
      alert('Post content cannot be empty.');
      return;
    }
  
    console.log("Post Content:", postContent);
  
    const fileInput = document.getElementById('fileUpload');
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log("Uploaded File:", file);
      // Further processing or sending the file to the server
    }
  
    document.getElementById('postForm').reset();
  }
  
  // Initialize the page when the script loads
  init();
  