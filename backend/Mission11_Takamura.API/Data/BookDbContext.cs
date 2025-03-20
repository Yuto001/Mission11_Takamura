using Microsoft.EntityFrameworkCore;

namespace Mission11_Takamura.API.Data
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options) 
        { }

        public DbSet<Project> Books { get; set; }
    }
}
