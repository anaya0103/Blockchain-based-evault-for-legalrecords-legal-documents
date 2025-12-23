// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DocumentStorage {
    struct Document {
        address uploader;
        string fileHash; // IPFS hash or document identifier
        string title;    // Title of the document
        uint256 timestamp;
        bool isVerified;  // Boolean to track verification status
    }

    // Mapping of file hashes to Document structs
    mapping(string => Document) private documents;
    mapping(string => bool) private documentExistence;  // Renamed to avoid conflict with function name

    // Events for actions
    event DocumentUploaded(string fileHash, address indexed uploader, string title);
    event DocumentUpdated(string fileHash, string newTitle, address indexed updater);
    event DocumentRetrieved(string fileHash, address indexed retriever);
    event DocumentDeleted(string fileHash, address indexed deleter);
    event DocumentVerified(string fileHash, address verifier);

    // Function to upload a document
    function uploadDocument(string memory _fileHash, string memory _title) public {
        require(bytes(_fileHash).length > 0, "File hash cannot be empty.");
        require(bytes(_title).length > 0, "Title cannot be empty.");
        require(documents[_fileHash].uploader == address(0), "Document already exists.");

        documents[_fileHash] = Document({
            uploader: msg.sender,
            fileHash: _fileHash,
            title: _title,
            timestamp: block.timestamp,
            isVerified: false  // Initializing isVerified as false
        });

        documentExistence[_fileHash] = true;  // Mark that the document exists

        emit DocumentUploaded(_fileHash, msg.sender, _title);
    }

    // Function to retrieve document details (view-only)
    function getDocumentDetails(string memory _fileHash) public view returns (address, string memory, uint256, bool) {
        Document memory doc = documents[_fileHash];
        require(doc.uploader != address(0), "Document does not exist.");

        return (doc.uploader, doc.title, doc.timestamp, doc.isVerified);
    }

    // Function to emit event when document is retrieved
    function retrieveDocument(string memory _fileHash) public {
        Document memory doc = documents[_fileHash];
        require(doc.uploader != address(0), "Document does not exist.");

        emit DocumentRetrieved(_fileHash, msg.sender);  // Emit event on retrieval
    }

    // Function to update the document title
    function updateDocumentTitle(string memory _fileHash, string memory _newTitle) public {
        Document storage doc = documents[_fileHash];
        require(doc.uploader == msg.sender, "Only the uploader can update the document.");
        require(bytes(_newTitle).length > 0, "New title cannot be empty.");

        doc.title = _newTitle;

        emit DocumentUpdated(_fileHash, _newTitle, msg.sender);
    }

    // Function to delete a document
    function deleteDocument(string memory _fileHash) public {
        require(documents[_fileHash].uploader != address(0), "Document does not exist.");  // Check if document exists
        require(documents[_fileHash].uploader == msg.sender, "Only the uploader can delete the document.");  // Check if sender is the uploader

        emit DocumentDeleted(_fileHash, msg.sender);  // Emit event before deletion
        delete documents[_fileHash];  // Delete the document from the mapping
        delete documentExistence[_fileHash];  // Mark that the document no longer exists
    }

    // Function to check if a document exists (for external validation)
    function doesDocumentExist(string memory _fileHash) public view returns (bool) {
        return documentExistence[_fileHash];
    }

    // Function to get the file hash and title (for download instructions)
    function getDocument(string memory _fileHash) public view returns (string memory, string memory) {
        Document memory doc = documents[_fileHash];
        require(doc.uploader != address(0), "Document does not exist.");

        return (doc.fileHash, doc.title);
    }

    // Function to verify a document
    function verifyDocument(string memory _fileHash) public {
        require(documentExistence[_fileHash], "Document does not exist");  // Use the renamed mapping
        Document storage doc = documents[_fileHash];
        doc.isVerified = true;
        
        emit DocumentVerified(_fileHash, msg.sender);
    }

    // Add a function to get document verification status
    function isDocumentVerified(string memory _fileHash) public view returns (bool) {
        require(documentExistence[_fileHash], "Document does not exist");  // Use the renamed mapping
        return documents[_fileHash].isVerified;
    }
}
