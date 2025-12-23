let web3;
let contract;
const contractAddress = "0x30fCfBAC10A7Ea0a332A792bE1D92EBD84FCb46b"; // Your contract address
const contractABI =   [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "fileHash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "deleter",
        "type": "address"
      }
    ],
    "name": "DocumentDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "fileHash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "retriever",
        "type": "address"
      }
    ],
    "name": "DocumentRetrieved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "fileHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "newTitle",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "updater",
        "type": "address"
      }
    ],
    "name": "DocumentUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "fileHash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "uploader",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      }
    ],
    "name": "DocumentUploaded",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_fileHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      }
    ],
    "name": "uploadDocument",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "string",
        "name": "_fileHash",
        "type": "string"
      }
    ],
    "name": "getDocumentDetails",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_fileHash",
        "type": "string"
      }
    ],
    "name": "retrieveDocument",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_fileHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_newTitle",
        "type": "string"
      }
    ],
    "name": "updateDocumentTitle",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_fileHash",
        "type": "string"
      }
    ],
    "name": "deleteDocument",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "string",
        "name": "_fileHash",
        "type": "string"
      }
    ],
    "name": "documentExists",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]; // Add your contract ABI here

// This function will be called when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                alert('No account found! Please connect to MetaMask.');
                return;
            }

            // Initialize the contract
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log('Contract initialized successfully:', contract);

            // Attach event listeners to the forms
            setupEventListeners();
        } catch (error) {
            console.error('Error accessing accounts or initializing contract:', error.message);
            alert('User denied account access or other error: ' + error.message);
        }
    } else {
        alert('Please install MetaMask to use this application.');
    }
});

// Function to set up event listeners
function setupEventListeners() {
    const uploadForm = document.getElementById('uploadForm');
    const getDetailsForm = document.getElementById('getDetailsForm');
    const editForm = document.getElementById('editForm');
    const deleteForm = document.getElementById('deleteForm');
    const downloadForm = document.getElementById('downloadForm'); // Assuming for download

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await uploadDocument(); // Call the unified upload function
        });
    }

    if (getDetailsForm) {
        getDetailsForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await getDocumentDetails();
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await editDocumentTitle();
        });
    }

    if (deleteForm) {
        deleteForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await deleteDocument();
        });
    }

    if (downloadForm) {
        downloadForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await downloadDocument(); // Implement this function if necessary
        });
    }
}

// Unified function to upload document
async function uploadDocument() {
    const fileInput = document.getElementById('fileInput');
    const title = document.getElementById('title').value;

    if (!fileInput.files.length || !title) {
        alert('Please select a file and enter a title.');
        return;
    }

    const file = fileInput.files[0];
    const fileBuffer = await file.arrayBuffer(); // Read file as array buffer
    const hash = await calculateHash(fileBuffer); // Calculate file hash
    const accounts = await web3.eth.getAccounts(); // Get user accounts

    try {
        const tx = await contract.methods.uploadDocument(hash, title).send({ from: accounts[0], gas: 5000000 }); // Increased gas limit
        console.log('Document uploaded successfully:', tx);
        alert('Document uploaded successfully!');
    } catch (error) {
        console.error('Error uploading document:', error);
        alert('Error uploading document: ' + (error.message || JSON.stringify(error)));
    }
}

// Function to calculate SHA-256 hash of the file
async function calculateHash(buffer) {
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Function to get document details
async function getDocumentDetails() {
    const fileHash = document.getElementById('fileHash').value; // Get the hash value from input
    if (!fileHash) {
        alert('Please enter a file hash.');
        return;
    }

    try {
        const details = await contract.methods.getDocumentDetails(fileHash).call();
        console.log('Document details retrieved:', details);
        displayDocumentDetails(details); // Call function to display details
    } catch (error) {
        console.error('Error retrieving document details:', error);
        alert('Error retrieving document details: ' + error.message);
    }
}

// Function to display document details in the UI
function displayDocumentDetails(details) {
    const documentDetailsDiv = document.getElementById('documentDetails');
    documentDetailsDiv.innerHTML = `
        <h2>Document Details:</h2>
        <p><strong>Title:</strong> ${details[1]}</p>
        <p><strong>Timestamp:</strong> ${new Date(details[2] * 1000).toLocaleString()}</p>
    `;
}

// Function to edit document title
async function editDocumentTitle() {
    const fileHash = document.getElementById('editFileHash').value;
    const newTitle = document.getElementById('newTitle').value;

    if (!fileHash || !newTitle) {
        alert('Please enter a file hash and a new title.');
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const tx = await contract.methods.updateDocumentTitle(fileHash, newTitle).send({ from: accounts[0] });
        console.log('Document title updated successfully:', tx);
        alert('Document title updated successfully!');
    } catch (error) {
        console.error('Error updating document title:', error);
        alert('Error updating document title: ' + error.message);
    }
}

// Function to delete document
async function deleteDocument() {
    const fileHash = document.getElementById('deleteFileHash').value; // Get the hash from input
    if (!fileHash) {
        alert('Please enter a file hash.');
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const tx = await contract.methods.deleteDocument(fileHash).send({ from: accounts[0] });
        console.log('Document deleted successfully:', tx);
        alert('Document deleted successfully!');
    } catch (error) {
        console.error('Error deleting document:', error);
        alert('Error deleting document: ' + error.message);
    }
}

// Function to download document (if applicable)
async function downloadDocument() {
  const fileHash = document.getElementById('fileHash').value; 
  const feedbackElement = document.getElementById('downloadFeedback');
  const loader = document.getElementById('downloadLoader');

  // Clear previous feedback
  feedbackElement.innerHTML = '';

  if (!fileHash) {
      feedbackElement.innerHTML = 'Please enter a file hash to download the document.';
      return;
  }

  // Show the loader
  loader.style.display = 'block';

  try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
          feedbackElement.innerHTML = 'MetaMask is not installed. Please install it to proceed.';
          loader.style.display = 'none';
          return;
      }

      // Request account access if needed
      await ethereum.request({ method: 'eth_requestAccounts' });

      // Connect to the contract using Web3
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress); 

      // Call the smart contract function to retrieve the document details using file hash
      const documentDetails = await contract.methods.getDocumentDetails(fileHash).call();
      console.log('Document Details:', documentDetails);

      if (!documentDetails) {
          feedbackElement.innerHTML = 'No document found for the provided hash.';
          loader.style.display = 'none';
          return;
      }

      // Assuming IPFS is used to store files
      const ipfsHash = documentDetails[2]; // Assuming IPFS hash is stored as the third output in the details
      const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
      if (!response.ok) {
          throw new Error('Failed to fetch the document from IPFS.');
      }

      const blob = await response.blob();

      // Create a download link for the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "document"; // Set an appropriate filename or use documentDetails if it contains the file name.
      a.click();

      feedbackElement.innerHTML = 'Document downloaded successfully!';
  } catch (error) {
      console.error('Error downloading document:', error);
      feedbackElement.innerHTML = 'Error downloading document: ' + error.message;
  } finally {
      loader.style.display = 'none';
  }
  // Function to verify document
async function verifyDocument() {
  const fileHash = document.getElementById('verifyFileHash').value;

  if (!fileHash) {
      alert('Please enter a file hash to verify.');
      return;
  }

  try {
      const accounts = await web3.eth.getAccounts();
      const tx = await contract.methods.verifyDocument(fileHash).send({ from: accounts[0] });
      console.log('Document verified successfully:', tx);
      alert('Document verified successfully!');
  } catch (error) {
      console.error('Error verifying document:', error);
      alert('Error verifying document: ' + error.message);
  }
}

// Function to check if a document is verified
async function checkVerificationStatus() {
  const fileHash = document.getElementById('verifyFileHash').value;

  if (!fileHash) {
      alert('Please enter a file hash.');
      return;
  }

  try {
      const isVerified = await contract.methods.isDocumentVerified(fileHash).call();
      console.log('Verification status:', isVerified);
      alert(`Document verification status: ${isVerified ? 'Verified' : 'Not Verified'}`);
  } catch (error) {
      console.error('Error checking verification status:', error);
      alert('Error checking verification status: ' + error.message);
  }
}

// Set up event listener for verify form
const verifyForm = document.getElementById('verifyForm');
if (verifyForm) {
  verifyForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await verifyDocument(); // Call the verification function
  });
}

const checkStatusButton = document.getElementById('checkVerificationStatus');
if (checkStatusButton) {
  checkStatusButton.addEventListener('click', async (event) => {
      event.preventDefault();
      await checkVerificationStatus(); // Check verification status
  });
}

}

// Constants for localStorage keys
const LOGIN_STATUS_KEY = "isLoggedIn";
const REGISTERED_USERNAME_KEY = "registeredUsername";
const REGISTERED_PASSWORD_KEY = "registeredPassword";

// Function to check login status on page load
window.onload = function() {
    const isLoggedIn = localStorage.getItem(LOGIN_STATUS_KEY) === "true";
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle buttons based on login status
    if (isLoggedIn) {
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'none';
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
};

// Function to handle login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Retrieve the registered username and password from localStorage
    const storedUsername = localStorage.getItem(REGISTERED_USERNAME_KEY);
    const storedPassword = localStorage.getItem(REGISTERED_PASSWORD_KEY);

    // Check if the entered credentials match the stored credentials
    if (username === storedUsername && password === storedPassword) {
        localStorage.setItem(LOGIN_STATUS_KEY, "true");
        window.location.href = "index.html"; // Change to your homepage
    } else {
        alert("Invalid login credentials!");
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
    }
}

// Function to handle registration
function handleRegistration(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if username and password fields are not empty
    if (!username || !password) {
        alert("Username and password cannot be empty!");
        return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Save user data to localStorage
    localStorage.setItem(REGISTERED_USERNAME_KEY, username);
    localStorage.setItem(REGISTERED_PASSWORD_KEY, password);
    localStorage.setItem(LOGIN_STATUS_KEY, "true");

    // Redirect to the homepage after successful registration
    window.location.href = "index.html"; // Change to your homepage
}

// Attach event listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Login form event listener
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Registration form event listener
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }

    // Logout button event listener
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem(LOGIN_STATUS_KEY);
            window.location.href = "login.html"; // Redirect to login
        });
    }
});
// app.js - Main application file for eVault dashboard

// Initialize Supabase client
const supabaseUrl = 'https://lugeqqhmxgvfcikxrxps.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Z2VxcWhteGd2ZmNpa3hyeHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjU1OTAsImV4cCI6MjA1OTcwMTU5MH0.jVQ-Kqs_DnUgE0IgBebaD-F3YIvwozV_Y3xjUypSE-I'

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM elements
const welcomeUserElement = document.querySelector('.user-welcome h2');
const totalDocumentsElement = document.querySelector('.stat-card:nth-child(1) .stat-info h3');
const verifiedDocumentsElement = document.querySelector('.stat-card:nth-child(2) .stat-info h3');
const pendingVerificationsElement = document.querySelector('.stat-card:nth-child(3) .stat-info h3');
const documentTableBody = document.querySelector('.doc-table tbody');
const activityContainer = document.querySelector('.activity-item').parentElement;
const logoutBtn = document.getElementById('logoutBtn');

// Check authentication state on page load
document.addEventListener('DOMContentLoaded', async function() {
  // Check if user is logged in
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    // Redirect to login page if not logged in
    window.location.href = 'login.html';
    return;
  }
  
  // User is authenticated, load dashboard data
  loadDashboardData(user);
  setupLogout();
});

// Load all dashboard data
async function loadDashboardData(user) {
  try {
    // Update welcome message with user's name
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    
    if (profile && profile.full_name) {
      welcomeUserElement.textContent = `Welcome, ${profile.full_name}`;
    } else {
      welcomeUserElement.textContent = `Welcome, ${user.email.split('@')[0]}`;
    }
    
    // Update user avatar if available
    updateUserAvatar(user.id);
    
    // Load document statistics
    loadDocumentStats(user.id);
    
    // Load recent documents
    loadRecentDocuments(user.id);
    
    // Load recent activity
    loadRecentActivity(user.id);
    
    // Load blockchain statistics
    loadBlockchainStats(user.id);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showNotification('Error loading dashboard data', 'error');
  }
}

// Update user avatar
async function updateUserAvatar(userId) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();
    
    const avatarContainer = document.querySelector('.user-avatar');
    
    if (profile && profile.avatar_url) {
      // Replace icon with actual user avatar
      avatarContainer.innerHTML = `<img src="${profile.avatar_url}" alt="User Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    }
  } catch (error) {
    console.error('Error loading avatar:', error);
  }
}

// Load document statistics
async function loadDocumentStats(userId) {
  try {
    // Get total documents count
    const { count: totalCount, error: totalError } = await supabase
      .from('documents')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);
    
    if (!totalError) {
      totalDocumentsElement.textContent = totalCount;
    }
    
    // Get verified documents count
    const { count: verifiedCount, error: verifiedError } = await supabase
      .from('documents')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'verified');
    
    if (!verifiedError) {
      verifiedDocumentsElement.textContent = verifiedCount;
    }
    
    // Get pending documents count
    const { count: pendingCount, error: pendingError } = await supabase
      .from('documents')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'pending');
    
    if (!pendingError) {
      pendingVerificationsElement.textContent = pendingCount;
    }
  } catch (error) {
    console.error('Error loading document stats:', error);
  }
}

// Load recent documents
async function loadRecentDocuments(userId) {
  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(4);
    
    if (error) throw error;
    
    // Clear existing table rows
    documentTableBody.innerHTML = '';
    
    if (documents && documents.length > 0) {
      documents.forEach(doc => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(doc.created_at);
        const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
        
        // Create status class based on document status
        const statusClass = doc.status === 'verified' ? 'status-verified' : 'status-pending';
        
        row.innerHTML = `
          <td>${doc.name}</td>
          <td>${formattedDate}</td>
          <td><span class="doc-status ${statusClass}">${doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span></td>
          <td class="doc-actions">
            <a href="#" title="View" data-id="${doc.id}" class="view-doc"><i class="fas fa-eye"></i></a>
            <a href="#" title="Download" data-id="${doc.id}" class="download-doc"><i class="fas fa-download"></i></a>
            <a href="#" title="Share" data-id="${doc.id}" class="share-doc"><i class="fas fa-share-alt"></i></a>
            <a href="#" title="Delete" data-id="${doc.id}" class="delete-doc"><i class="fas fa-trash"></i></a>
          </td>
        `;
        
        documentTableBody.appendChild(row);
      });
      
      // Add event listeners to the action buttons
      setupDocumentActionListeners();
    } else {
      // If no documents, show empty state
      const row = document.createElement('tr');
      row.innerHTML = `
        <td colspan="4" class="text-center">No documents found. <a href="upload.html">Upload your first document</a></td>
      `;
      documentTableBody.appendChild(row);
    }
  } catch (error) {
    console.error('Error loading recent documents:', error);
  }
}

// Setup document action event listeners
function setupDocumentActionListeners() {
  // View document
  document.querySelectorAll('.view-doc').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const docId = e.currentTarget.dataset.id;
      viewDocument(docId);
    });
  });
  
  // Download document
  document.querySelectorAll('.download-doc').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const docId = e.currentTarget.dataset.id;
      downloadDocument(docId);
    });
  });
  
  // Share document
  document.querySelectorAll('.share-doc').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const docId = e.currentTarget.dataset.id;
      showShareModal(docId);
    });
  });
  
  // Delete document
  document.querySelectorAll('.delete-doc').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const docId = e.currentTarget.dataset.id;
      showDeleteConfirmation(docId);
    });
  });
}

// Load recent activity
async function loadRecentActivity(userId) {
  try {
    const { data: activities, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(4);
    
    if (error) throw error;
    
    // Clear existing activities
    activityContainer.innerHTML = '';
    
    if (activities && activities.length > 0) {
      activities.forEach(activity => {
        // Determine the appropriate icon based on activity type
        let iconClass = '';
        switch(activity.action_type) {
          case 'upload':
            iconClass = 'fas fa-upload';
            break;
          case 'verify':
            iconClass = 'fas fa-check-circle';
            break;
          case 'share':
            iconClass = 'fas fa-share-alt';
            break;
          case 'edit':
            iconClass = 'fas fa-edit';
            break;
          case 'delete':
            iconClass = 'fas fa-trash';
            break;
          default:
            iconClass = 'fas fa-file-alt';
        }
        
        // Calculate time ago
        const timeAgo = getTimeAgo(new Date(activity.created_at));
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
          <div class="activity-icon">
            <i class="${iconClass}"></i>
          </div>
          <div class="activity-details">
            <h4>${activity.action_description}</h4>
            <p>${activity.document_name}</p>
            <span class="activity-time">${timeAgo}</span>
          </div>
        `;
        
        activityContainer.appendChild(activityItem);
      });
    } else {
      // If no activities, show empty state
      const emptyActivity = document.createElement('div');
      emptyActivity.className = 'text-center p-4';
      emptyActivity.innerHTML = `
        <p>No recent activity. Start by <a href="upload.html">uploading a document</a>.</p>
      `;
      activityContainer.appendChild(emptyActivity);
    }
  } catch (error) {
    console.error('Error loading recent activity:', error);
  }
}

// Load blockchain statistics
async function loadBlockchainStats(userId) {
  try {
    // In a real app, this would fetch data from your blockchain integration
    // For now, we'll just simulate it with static data or from Supabase
    
    const { data: stats, error } = await supabase
      .from('blockchain_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (stats) {
      // Update the DOM elements with real stats
      document.querySelector('.dashboard-card:last-child .mb-3:nth-child(1) h4').textContent = stats.total_transactions || '0';
      document.querySelector('.dashboard-card:last-child .mb-3:nth-child(2) h4').textContent = `${stats.gas_used || '0.000'} ETH`;
      document.querySelector('.dashboard-card:last-child .mb-3:nth-child(3) h4').textContent = `${stats.avg_verification_time || '0.0'} seconds`;
      
      // Update network status
      const networkStatusElement = document.querySelector('.dashboard-card:last-child .mb-3:nth-child(4) h4');
      if (stats.network_status === 'active') {
        networkStatusElement.innerHTML = '<span class="text-success">●</span> Active';
      } else {
        networkStatusElement.innerHTML = '<span class="text-danger">●</span> Inactive';
      }
    }
  } catch (error) {
    console.error('Error loading blockchain stats:', error);
  }
}

// Document action functions
async function viewDocument(docId) {
  try {
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', docId)
      .single();
    
    if (error) throw error;
    
    // Log the view activity
    await logActivity(document.user_id, 'view', `You viewed a document`, document.name);
    
    // Redirect to document viewer page with the document ID
    window.location.href = `view-document.html?id=${docId}`;
  } catch (error) {
    console.error('Error viewing document:', error);
    showNotification('Error viewing document', 'error');
  }
}

async function downloadDocument(docId) {
  try {
    // Get document details first
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', docId)
      .single();
    
    if (error) throw error;
    
    // Get the file from storage
    const { data, error: storageError } = await supabase.storage
      .from('documents')
      .download(`${document.user_id}/${document.file_path}`);
    
    if (storageError) throw storageError;
    
    // Create a download link and trigger it
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Log the download activity
    await logActivity(document.user_id, 'download', `You downloaded a document`, document.name);
    
    showNotification('Document downloaded successfully', 'success');
  } catch (error) {
    console.error('Error downloading document:', error);
    showNotification('Error downloading document', 'error');
  }
}

async function showShareModal(docId) {
  try {
    // Get document details
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', docId)
      .single();
    
    if (error) throw error;
    
    // Create and show a modal for sharing
    const modalHtml = `
      <div class="modal fade" id="shareModal" tabindex="-1" aria-labelledby="shareModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content bg-dark text-light">
            <div class="modal-header">
              <h5 class="modal-title" id="shareModalLabel">Share Document</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Share "${document.name}" with:</p>
              <form id="shareForm">
                <div class="mb-3">
                  <label for="shareEmail" class="form-label">Email Address</label>
                  <input type="email" class="form-control bg-dark text-light" id="shareEmail" placeholder="Enter email address" required>
                </div>
                <div class="mb-3">
                  <label for="sharePermission" class="form-label">Permission Level</label>
                  <select class="form-select bg-dark text-light" id="sharePermission">
                    <option value="view">View Only</option>
                    <option value="edit">Edit</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="shareMessage" class="form-label">Add a Message (Optional)</label>
                  <textarea class="form-control bg-dark text-light" id="shareMessage" rows="3"></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="confirmShare">Share</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // Initialize modal
    const shareModal = new bootstrap.Modal(document.getElementById('shareModal'));
    shareModal.show();
    
    // Handle share button click
    document.getElementById('confirmShare').addEventListener('click', async () => {
      const shareEmail = document.getElementById('shareEmail').value;
      const sharePermission = document.getElementById('sharePermission').value;
      const shareMessage = document.getElementById('shareMessage').value;
      
      if (!shareEmail) {
        alert('Please enter an email address');
        return;
      }
      
      try {
        // Create share record in database
        const { data, error } = await supabase
          .from('document_shares')
          .insert({
            document_id: docId,
            shared_by: document.user_id,
            shared_with_email: shareEmail,
            permission_level: sharePermission,
            message: shareMessage
          });
        
        if (error) throw error;
        
        // Log the share activity
        await logActivity(document.user_id, 'share', `You shared a document with ${shareEmail}`, document.name);
        
        // Close modal
        shareModal.hide();
        
        // Show success notification
        showNotification('Document shared successfully', 'success');
        
        // Remove modal from DOM after hiding
        shareModal._element.addEventListener('hidden.bs.modal', () => {
          document.body.removeChild(modalContainer);
        });
      } catch (error) {
        console.error('Error sharing document:', error);
        showNotification('Error sharing document', 'error');
      }
    });
    
    // Clean up modal when closed
    document.getElementById('shareModal').addEventListener('hidden.bs.modal', () => {
      document.body.removeChild(modalContainer);
    });
  } catch (error) {
    console.error('Error preparing share modal:', error);
    showNotification('Error preparing share options', 'error');
  }
}

async function showDeleteConfirmation(docId) {
  try {
    // Get document details
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', docId)
      .single();
    
    if (error) throw error;
    
    // Create confirmation modal
    const modalHtml = `
      <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content bg-dark text-light">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete "${document.name}"?</p>
              <p class="text-danger">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" id="confirmDelete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // Initialize modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
    
    // Handle delete button click
    document.getElementById('confirmDelete').addEventListener('click', async () => {
      try {
        // First delete file from storage
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([`${document.user_id}/${document.file_path}`]);
        
        if (storageError) throw storageError;
        
        // Then delete document record
        const { error: deleteError } = await supabase
          .from('documents')
          .delete()
          .eq('id', docId);
        
        if (deleteError) throw deleteError;
        
        // Log the delete activity
        await logActivity(document.user_id, 'delete', `You deleted a document`, document.name);
        
        // Close modal
        deleteModal.hide();
        
        // Show success notification
        showNotification('Document deleted successfully', 'success');
        
        // Reload dashboard data to reflect changes
        const { data: { user } } = await supabase.auth.getUser();
        loadDashboardData(user);
        
        // Remove modal from DOM after hiding
        deleteModal._element.addEventListener('hidden.bs.modal', () => {
          document.body.removeChild(modalContainer);
        });
      } catch (error) {
        console.error('Error deleting document:', error);
        showNotification('Error deleting document', 'error');
      }
    });
    
    // Clean up modal when closed
    document.getElementById('deleteModal').addEventListener('hidden.bs.modal', () => {
      document.body.removeChild(modalContainer);
    });
  } catch (error) {
    console.error('Error preparing delete confirmation:', error);
    showNotification('Error preparing delete confirmation', 'error');
  }
}

// Utility function to log user activity
async function logActivity(userId, actionType, actionDescription, documentName) {
  try {
    const { error } = await supabase
      .from('activities')
      .insert({
        user_id: userId,
        action_type: actionType,
        action_description: actionDescription,
        document_name: documentName
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// Get time ago string from date
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

// Setup logout functionality
function setupLogout() {
  logoutBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Redirect to login page
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Error during logout:', error);
      showNotification('Error during logout', 'error');
    }
  });
}

// Show notification
function showNotification(message, type = 'info') {
  const notificationContainer = document.createElement('div');
  notificationContainer.className = `notification ${type}`;
  notificationContainer.innerHTML = message;
  
  document.body.appendChild(notificationContainer);
  
  // Show notification
  setTimeout(() => {
    notificationContainer.classList.add('show');
  }, 10);
  
  // Hide and remove notification after 3 seconds
  setTimeout(() => {
    notificationContainer.classList.remove('show');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      document.body.removeChild(notificationContainer);
    }, 300);
  }, 3000);
}

// Initialize sidebar functionality
function initSidebar() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove active class from all links
      sidebarLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Prevent default for links that are not yet implemented
      if (this.getAttribute('href') === '#') {
        e.preventDefault();
        showNotification('This feature is coming soon!', 'info');
      }
    });
  });
}

// Call sidebar initialization
initSidebar();