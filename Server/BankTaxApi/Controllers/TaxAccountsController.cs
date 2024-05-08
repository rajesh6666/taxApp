using Microsoft.AspNetCore.Mvc;
using BankTaxApi.Models;
using System.Collections.Generic;
using System.Linq;

namespace BankTaxApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaxAccountsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaxAccountsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<TaxAccount>> GetAll() =>
            _context.TaxAccounts.ToList();

        [HttpGet("{id}")]
        public ActionResult<TaxAccount> GetById(int id)
        {
            var taxAccount = _context.TaxAccounts.Find(id);
            if (taxAccount == null)
            {
                return NotFound();
            }
            return taxAccount;
        }
    }
}