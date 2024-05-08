using Microsoft.EntityFrameworkCore;
using BankTaxApi.Models;

namespace BankTaxApi
{
    public class AppDbContext : DbContext
    {
        private readonly bool _preloadData;

        public AppDbContext(DbContextOptions<AppDbContext> options, bool preloadData = true)
            : base(options)
        {
            _preloadData = preloadData;
            Database.EnsureCreated();
        }

        public DbSet<BankAccount> BankAccounts { get; set; }
        public DbSet<TaxAccount> TaxAccounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            if (_preloadData)
            {
                modelBuilder.Entity<BankAccount>().HasData(
                    new BankAccount { Id = 1, Name = "Account 1", Balance = 1000 },
                    new BankAccount { Id = 2, Name = "Account 2", Balance = 2000 }
                );

                modelBuilder.Entity<TaxAccount>().HasData(
                    new TaxAccount { Id = 1, Name = "Tax Account 1", Balance = 500 },
                    new TaxAccount { Id = 2, Name = "Tax Account 2", Balance = 1000 }
                );
            }
        }
    }
}