using ecommerce_backend.Models;
using ecommerce_backend.Data; // Correct namespace for MongoDbContext
using MongoDB.Driver;

public class OrderService
{
    private readonly IMongoCollection<Order> _orders;

    public OrderService(MongoDbContext dbContext)
    {
        _orders = dbContext.Orders;
    }

    public async Task<List<Order>> GetOrdersAsync()
    {
        return await _orders.Find(_ => true).ToListAsync();
    }

    public async Task<Order> CreateOrderAsync(Order order)
    {
        order.Status = "Processing"; // Set initial status
        await _orders.InsertOneAsync(order);
        return order;
    }

// Method to update only the status of an order by its ID
        public async Task<Order?> UpdateOrderStatusAsync(string id, string status)
        {
            var filter = Builders<Order>.Filter.Eq(o => o.Id, id);
            var update = Builders<Order>.Update.Set(o => o.Status, status);

            var result = await _orders.FindOneAndUpdateAsync(filter, update, new FindOneAndUpdateOptions<Order>
            {
                ReturnDocument = ReturnDocument.After // Return the updated document
            });

            return result;
        }

     // Method to update an order by its ID
        public async Task<Order?> UpdateOrderAsync(string id, Order updatedOrder)
        {
            // Find and update the order
            var result = await _orders.ReplaceOneAsync(order => order.Id == id, updatedOrder);

            // Return the updated order if it exists
            return result.IsAcknowledged && result.ModifiedCount > 0 ? updatedOrder : null;
        }

    public async Task<bool> CancelOrderAsync(string orderId)
    {
        var result = await _orders.DeleteOneAsync(o => o.Id == orderId && o.Status == "Processing");
        return result.DeletedCount > 0;
    }
}
