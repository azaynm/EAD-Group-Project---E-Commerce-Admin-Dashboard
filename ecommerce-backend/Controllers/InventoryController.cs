using ecommerce_backend.Models;
using ecommerce_backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class InventoryController : ControllerBase
{
    private readonly InventoryService _inventoryService;

    public InventoryController(InventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    // GET: api/inventory
    [HttpGet]
    public async Task<ActionResult<List<InventoryItem>>> GetInventory()
    {
        var inventory = await _inventoryService.GetInventoryAsync();
        return Ok(inventory);
    }

    // POST: api/inventory
    [HttpPost]
    public async Task<ActionResult<InventoryItem>> CreateInventoryItem([FromBody] InventoryItem item)
    {
        var newItem = await _inventoryService.CreateInventoryItemAsync(item);
        return CreatedAtAction(nameof(CreateInventoryItem), newItem);
    }

    // PUT: api/inventory/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<InventoryItem>> UpdateInventoryItem(string id, [FromBody] InventoryItem updatedItem)
    {
        var existingItem = await _inventoryService.UpdateInventoryItemAsync(id, updatedItem);
        if (existingItem == null)
        {
            return NotFound("Inventory item not found");
        }

        return Ok(existingItem);
    }

    // DELETE: api/inventory/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteInventoryItem(string id)
    {
        var result = await _inventoryService.DeleteInventoryItemAsync(id);
        if (!result)
        {
            return NotFound("Inventory item not found");
        }

        return NoContent();
    }

    // PUT: api/inventory/activate/5f73e3b2e7e4b942ac4014c9
        [HttpPut("activate/{id}")]
        public async Task<IActionResult> UpdateIsActivated(string id, [FromBody] bool isActivated)
        {
            try
            {
                await _inventoryService.UpdateIsActivatedAsync(id, isActivated);
                return Ok(new { message = "Item activation status updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error updating activation status: {ex.Message}" });
            }
        }
}
