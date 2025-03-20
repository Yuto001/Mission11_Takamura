using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11_Takamura.API.Data;

namespace Mission11_Takamura.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        public BookController(BookDbContext temp) => _bookContext = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetProjects(int pageSize = 5, int pageNum = 1, string sortOrder = null)
        {
            var booksQuery = _bookContext.Books.AsQueryable();

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

            var pagination = booksQuery
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

            var totalNumBooks = _bookContext.Books.Count();

            var someObject = new
            {
                Books = pagination,
                TotalNumBooks = totalNumBooks
            };

            return Ok(someObject);
        }
    }
}
