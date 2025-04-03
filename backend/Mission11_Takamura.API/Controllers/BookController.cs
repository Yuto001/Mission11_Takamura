using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11_Takamura.API.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Mission11_Takamura.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        public BookController(BookDbContext temp) => _bookContext = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetProjects(int pageSize = 5, int pageNum = 1, string sortOrder = null, [FromQuery] List<string>? category = null)
        {
            var booksQuery = _bookContext.Books.AsQueryable();

            if (category != null && category.Any())
            {
                booksQuery = booksQuery.Where(p => category.Contains(p.Category));
            }

            //  Apply Sorting
            if (!string.IsNullOrEmpty(sortOrder))
            {
                if (sortOrder.ToLower() == "asc")
                {
                    booksQuery = booksQuery.OrderBy(b => b.Title);
                }
                else if (sortOrder.ToLower() == "desc")
                {
                    booksQuery = booksQuery.OrderByDescending(b => b.Title);
                }
            }
            else
            {
                // Default order should be by `BookID`
                booksQuery = booksQuery.OrderBy(b => b.BookID);
            }

            var totalNumBooks = booksQuery.Count();

            var pagination = booksQuery
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();


            var someObject = new
            {
                Books = pagination,
                TotalNumBooks = totalNumBooks
            };

            return Ok(someObject);

        }
        [HttpGet("GetCategoryTypes")]

        public IActionResult GetCategoryTypes()
        {
            var categoryTypes = _bookContext.Books
                .Select(p => p.Category)
                .Distinct()
                .ToList();

            return Ok(categoryTypes);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Project newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookID}")]
        public IActionResult UpdateBook(int bookID, [FromBody] Project updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookID);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookContext.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookID}")]
        public IActionResult DeleteBook(int bookID)
        {
            var book = _bookContext.Books.Find(bookID);

            if(book == null)
            {
                return NotFound(new {message = "Book not found"});
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}
