import { useEffect, useState } from 'react';
import { Project } from '../types/Project';
import { deleteBook, fetchProjects } from '../api/ProjectsAPI';
import Pagination from '../components/Pagination';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

const AdminProjectsPage = () => {
  const [books, setBooks] = useState<Project[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Project | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null); // Added for the sorting

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects(
          pageSize,
          pageNum,
          [],
          sortOrder || undefined
        );
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [pageSize, pageNum, sortOrder]);

  const handleDelete = async (bookID: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (!confirmDelete) return;

    try {
      await deleteBook(bookID);
      setBooks(books.filter((p) => p.bookID !== bookID));
    } catch (error) {
      alert('Failed to delete book. Please try again.');
    }
  };

  if (loading) return <p>Loading Books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1>Admin - Books</h1>
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

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Book
        </button>
      )}

      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchProjects(pageSize, pageNum, [], sortOrder || undefined).then(
              (data) => setBooks(data.books)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            fetchProjects(pageSize, pageNum, [], sortOrder || undefined).then(
              (data) => setBooks(data.books)
            );
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Page Count</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((p) => (
            <tr key={p.bookID}>
              <td>{p.title}</td>
              <td>{p.author}</td>
              <td>{p.publisher}</td>
              <td>{p.isbn}</td>
              <td>{p.classification}</td>
              <td>{p.category}</td>
              <td>{p.pageCount}</td>
              <td>{p.price}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingBook(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => handleDelete(p.bookID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  );
};

export default AdminProjectsPage;
