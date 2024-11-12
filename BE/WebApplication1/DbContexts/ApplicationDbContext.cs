using Microsoft.EntityFrameworkCore;
using WebApplication1.Entity;

namespace WebApplication1.DbContexts;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Asset> Assets { get; set; }
    public DbSet<Request> Requests { get; set; }
    public DbSet<RequestStatus> RequestStatuses { get; set; }
    public DbSet<RequestItem> RequestItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Khởi tạo dữ liệu mặc định cho người dùng
        modelBuilder.Entity<User>().HasData(new User
        {
            Id = 1,
            Email = "admin@example.com",
            Password = "Admin@123",
            FullName = "Admin User",
            DepartmentHeadId = null
        });

        // Khởi tạo dữ liệu cho Role
        modelBuilder.Entity<Role>().HasData(new Role
        {
            Id = 1,
            Name = "Admin"
        });

        // Khởi tạo dữ liệu cho UserRole
        modelBuilder.Entity<UserRole>().HasData(new UserRole
        {
            Id = 1, // Thêm giá trị cho Id
            UserId = 1,
            RoleId = 1
        });
    }


}


