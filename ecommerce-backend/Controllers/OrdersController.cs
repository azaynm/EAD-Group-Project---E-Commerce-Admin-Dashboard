using ecommerce_backend.Models;
using ecommerce_backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }

    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<List<Order>>> GetOrders()
    {
        var orders = await _orderService.GetOrdersAsync();
        return Ok(orders);
    }

    // POST: api/orders
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] Order order)
    {
        var newOrder = await _orderService.CreateOrderAsync(order);
        return CreatedAtAction(nameof(CreateOrder), newOrder);
    }

// PUT: api/orders/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(string id, [FromBody] UpdateOrderStatusDto statusDto)
        {
            var updatedOrder = await _orderService.UpdateOrderStatusAsync(id, statusDto.Status);

            if (updatedOrder == null)
            {
                return NotFound($"Order with ID {id} not found");
            }

            return Ok(updatedOrder);
        }

    // DELETE: api/orders/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> CancelOrder(string id)
    {
        var result = await _orderService.CancelOrderAsync(id);
        if (!result) return NotFound("Order not found or already dispatched");

        return NoContent();
    }

    

     // PUT: api/orders/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(string id, [FromBody] Order updatedOrder)
        {
            if (id != updatedOrder.Id)
            {
                return BadRequest("Order ID mismatch");
            }

            var order = await _orderService.UpdateOrderAsync(id, updatedOrder);

            if (order == null)
            {
                return NotFound($"Order with ID {id} not found");
            }

            return Ok(order);
        }

        public class UpdateOrderStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}
