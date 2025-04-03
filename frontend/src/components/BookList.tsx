import { useEffect, useState } from 'react';
import { Project } from '../types/Project';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '../api/ProjectsAPI';
import Pagination from './Pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Project[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null); // Added for the sorting
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects(
          pageSize,
          pageNum,
          selectedCategories,
          sortOrder || null
        );

        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [pageSize, pageNum, selectedCategories, sortOrder]);

  if (loading) return <p>Loading Books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
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
            <button
              className="btn btn-success"
              onClick={() =>
                navigate(`/addCart/${p.title}/${p.bookID}/${p.price}`)
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </>
  );
}

export default BookList;
