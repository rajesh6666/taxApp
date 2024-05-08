using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using BankTaxApi;
using BankTaxApi.Controllers;
using BankTaxApi.Models;
using System.Linq;

public class BankAccountsControllerTests
{
    private AppDbContext _context;
    private BankAccountsController _controller;

    public BankAccountsControllerTests()
    {
        // Setup an in-memory database for testing
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Generate a unique name for the database
            .Options;

        _context = new AppDbContext(options, false);
        _controller = new BankAccountsController(_context);
    }

    [Fact]
    public void GetAll_ReturnsAllBankAccounts()
    {
        // Arrange
        _context.BankAccounts.Add(new BankAccount { Id = 1, Name = "Account 1", Balance = 100 });
        _context.BankAccounts.Add(new BankAccount { Id = 2, Name = "Account 2", Balance = 200 });
        _context.SaveChanges();

        // Act
        var result = _controller.GetAll();

        // Assert
        Assert.Equal(2, result.Value.Count);
    }

    [Fact]
    public void GetById_ExistingId_ReturnsBankAccount()
    {
        // Arrange
        var bankAccount = new BankAccount { Id = 1, Name = "Account 1", Balance = 100 };
        _context.BankAccounts.Add(bankAccount);
        _context.SaveChanges();

        // Act
        var result = _controller.GetById(1);

        // Assert
        Assert.Equal(bankAccount, result.Value);
    }

    [Fact]
    public void GetById_NonExistingId_ReturnsNotFound()
    {
        // Act
        var result = _controller.GetById(1);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public void Transfer_InsufficientBalance_ReturnsBadRequest()
    {
        // Arrange
        var sourceAccount = new BankAccount { Id = 1, Name = "Source Account", Balance = 50 };
        var targetAccount = new TaxAccount { Id = 1, Name = "Target Account", Balance = 0 };
        _context.BankAccounts.Add(sourceAccount);
        _context.TaxAccounts.Add(targetAccount);
        _context.SaveChanges();

        var transferRequest = new TransferRequest
        {
            SourceAccountId = 1,
            TargetAccountId = 1,
            Amount = 100
        };

        // Act
        var result = _controller.Transfer(transferRequest);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public void Transfer_ValidRequest_ReturnsOk()
    {
        // Arrange
        var sourceAccount = new BankAccount { Id = 1, Name = "Source Account", Balance = 200 };
        var targetAccount = new TaxAccount { Id = 1, Name = "Target Account", Balance = 0 };
        _context.BankAccounts.Add(sourceAccount);
        _context.TaxAccounts.Add(targetAccount);
        _context.SaveChanges();

        var transferRequest = new TransferRequest
        {
            SourceAccountId = 1,
            TargetAccountId = 1,
            Amount = 100
        };

        // Act
        var result = _controller.Transfer(transferRequest);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Equal(100, _context.BankAccounts.Find(1).Balance);
        Assert.Equal(100, _context.TaxAccounts.Find(1).Balance);
    }

}