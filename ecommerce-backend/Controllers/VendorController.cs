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

    // PUT: api/vendor/{id}/comment
    [HttpPut("{id}/comment")]
    public async Task<IActionResult> AddComment(string id, [FromBody] AddCommentDto commentDto)
    {
        if (string.IsNullOrWhiteSpace(commentDto.CommentText))
        {
            return BadRequest("Comment cannot be empty.");
        }

        var comment = new Comment
        {
            CommentText = commentDto.CommentText,
            Ranking = commentDto.Ranking
        };

        var updatedVendor = await _vendorService.AddCommentAsync(id, comment);

        if (updatedVendor == null)
        {
            return NotFound($"Vendor with ID {id} not found.");
        }

        return Ok(updatedVendor);
    }


    public class AddCommentDto
{
    public string CommentText { get; set; } = string.Empty;
    public double Ranking { get; set; } = 0.0;
}
}
