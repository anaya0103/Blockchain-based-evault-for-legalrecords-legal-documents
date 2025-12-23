const Contract = artifacts.require("Contract");

contract("Contract", accounts => {
    it("should upload a document", async () => {
        const instance = await Contract.deployed();
        const fileHash = "123abc";
        const title = "Test Document";
        
        await instance.uploadDocument(fileHash, title, { from: accounts[0] });
        const document = await instance.getDocumentDetails(fileHash);

        assert.equal(document[0], accounts[0], "Uploader address does not match.");
        assert.equal(document[1], title, "Document title does not match.");
    });

    it("should update document title", async () => {
        const instance = await Contract.deployed();
        const fileHash = "123abc";
        const newTitle = "Updated Document Title";

        await instance.updateDocumentTitle(fileHash, newTitle, { from: accounts[0] });
        const document = await instance.getDocumentDetails(fileHash);

        assert.equal(document[1], newTitle, "Document title was not updated.");
    });

    it("should delete a document", async () => {
        const instance = await Contract.deployed();
        const fileHash = "123abc";

        await instance.deleteDocument(fileHash, { from: accounts[0] });
        try {
            await instance.getDocumentDetails(fileHash);
            assert.fail("Expected error not received.");
        } catch (error) {
            assert(error.message.includes("Document does not exist."), "Error message should contain 'Document does not exist.'");
        }
    });
});
