using ecommerce_backend.Models;
using ecommerce_backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;



[Route("api/[controller]")]
[ApiController]
public class VendorController : ControllerBase
{
    private readonly VendorService _vendorService;

    public VendorController(VendorService vendorService)
    {
        _vendorService = vendorService;
    }


    // GET: api/vendor
    [HttpGet]
    public async Task<ActionResult<List<Vendor>>> GetVendors()
    {
        var vendors = await _vendorService.GetVendorsAsync();
        return Ok(vendors);
    }

    // POST: api/vendor
    [HttpPost]
    public async Task<ActionResult<Vendor>> CreateVendor([FromBody] Vendor vendor)
    {
        var newVendor = await _vendorService.CreateVendorAsync(vendor);
        return CreatedAtAction(nameof(CreateVendor), newVendor);
    }

    // PUT: api/vendor/{id}/ranking
    [HttpPut("{id}/ranking")]
    public async Task<ActionResult<Vendor>> UpdateRanking(string id, [FromBody] double ranking)
    {
        var updatedVendor = await _vendorService.UpdateRankingAsync(id, ranking);
        if (updatedVendor == null) return NotFound("Vendor not found");

        return Ok(updatedVendor);
    }

    // PUT: api/vendor/{id}/comment
    [HttpPut("{id}/comment")]
    public async Task<ActionResult> AddComment(string id, [FromBody] string comment)
    {
        var result = await _vendorService.AddCommentAsync(id, comment);
        if (!result) return NotFound("Vendor not found");

        return NoContent();
    }

    // PUT: api/vendor/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVendor(string id, [FromBody] Vendor vendor)
        {
            if (vendor == null || id != vendor.Id)
            {
                return BadRequest("Invalid vendor data.");
            }

            var updatedVendor = await _vendorService.UpdateVendorAsync(id, vendor);
            if (updatedVendor == null)
            {
                return NotFound("Vendor not found.");
            }

            return Ok(updatedVendor); // Return the updated vendor data
        }

       

       
}
