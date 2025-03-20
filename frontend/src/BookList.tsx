import { useEffect, useState } from 'react';
import { Project } from './types/Project';

function BookList() {
  const [books, setBooks] = useState<Project[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null); // Added for the sorting

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(
        `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}` +
          (sortOrder ? `&sortOrder=${sortOrder}` : '')
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchProjects();
  }, [pageSize, pageNum, totalItems, sortOrder]);

  return (
    <>
      <h1>Online Book Store</h1>
      <br />
      <button
        onClick={() => {
          if (sortOrder === null) {
            setSortOrder('asc'); // First click sorts ascending
          } else if (sortOrder === 'asc') {
            setSortOrder('desc'); // Second click sorts descending
          } else {
            setSortOrder(null); // Third click resets sorting
          }
        }}
      >
        Sort by Title:{' '}
        {sortOrder === null
          ? '🔄 Default'
          : sortOrder === 'asc'
            ? '🔼 Ascending'
            : '🔽 Descending'}
      </button>
      <br />
      {books.map((p) => (
        <div id="projectCard" className="card" key={p.bookID}>
          <h3 className="card-title">{p.title}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <strong>Author:</strong> {p.author}
              </li>
              <li>
                <strong>Publisher:</strong> {p.publisher}
              </li>
              <li>
                <strong>ISBN:</strong> {p.isbn}
              </li>
              <li>
                <strong>Classification/Category:</strong> {p.classification}/
                {p.category}
              </li>
              <li>
                <strong>Number of Pages:</strong> {p.pageCount}
              </li>
              <li>
                <strong>Price:</strong> ${p.price}
              </li>
            </ul>
          </div>
        </div>
      ))}

      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setPageNum(index + 1)}
          disabled={pageNum === index + 1}
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>

      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value));
            setPageNum(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </>
  );
}

export default BookList;
