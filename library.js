const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// In-memory data store for books
let books = [];

// Middleware to parse incoming request data
app.use(bodyParser.json());

// Routes
app.get('/books', (req, res) => {
  res.json(books);
});

app.post('/books', (req, res) => {
  const { title, author, isbn } = req.body;
  const newBook = { title, author, isbn, available: true };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { action } = req.body;

  const bookIndex = books.findIndex((book) => book.isbn === isbn);
  if (bookIndex !== -1) {
    const book = books[bookIndex];
    if (action === 'borrow' && book.available) {
      book.available = false;
      res.json({ message: `You have borrowed "${book.title}" successfully.` });
    } else if (action === 'return' && !book.available) {
      book.available = true;
      res.json({ message: `You have returned "${book.title}" successfully.` });
    } else {
      res.status(400).json({ message: 'Book not available for the requested action.' });
    }
  } else {
    res.status(404).json({ message: 'Book not found.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Library management system listening on port ${PORT}`);
});
