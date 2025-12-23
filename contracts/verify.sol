// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Verify {
    // Define your struct and mapping for documents
    struct Document {
        string fileHash;
        string fileName;
        address uploader;
        bool isVerified;
    }

    mapping(string => Document) public documents;

    // Function to verify a document
    function verifyDocument(string memory _fileHash) public {
        require(documents[_fileHash].uploader != address(0), "Document does not exist");
        documents[_fileHash].isVerified = true;
    }
}
