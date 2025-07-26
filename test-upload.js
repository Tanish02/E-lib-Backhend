const FormData = require("form-data");
const fs = require("fs");
const fetch = require("node-fetch");

async function testBookUpload() {
  try {
    // First, let's test with a simple form data to see what happens
    const form = new FormData();

    // Add text fields
    form.append("title", "Test Book Title");
    form.append("author", "Test Author Name");
    form.append("genre", "Fiction");
    form.append("description", "This is a test book description");

    // For testing, we'll create dummy files
    form.append("coverImage", Buffer.from("fake image data"), {
      filename: "test-cover.jpg",
      contentType: "image/jpeg",
    });

    form.append("file", Buffer.from("fake pdf data"), {
      filename: "test-book.pdf",
      contentType: "application/pdf",
    });

    console.log("Testing book upload...");
    console.log("Form data fields:", {
      title: "Test Book Title",
      author: "Test Author Name",
      genre: "Fiction",
      description: "This is a test book description",
    });

    const response = await fetch("http://localhost:5513/api/books", {
      method: "POST",
      body: form,
      headers: {
        // Add a dummy auth token for testing - you'll need to replace this with a real token
        Authorization: "Bearer your-test-token-here",
      },
    });

    const result = await response.text();
    console.log("Response status:", response.status);
    console.log("Response:", result);
  } catch (error) {
    console.error("Test error:", error.message);
  }
}

testBookUpload();
