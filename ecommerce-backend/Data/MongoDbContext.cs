using MongoDB.Driver;
using ecommerce_backend.Models;
using Microsoft.Extensions.Configuration;

namespace ecommerce_backend.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("MongoDb"));
            _database = client.GetDatabase("EnterpriseApp");
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        public IMongoCollection<Order> Orders => _database.GetCollection<Order>("Orders");
        public IMongoCollection<InventoryItem> InventoryItems => _database.GetCollection<InventoryItem>("InventoryItems");
        public IMongoCollection<Vendor> Vendors => _database.GetCollection<Vendor>("Vendors");
    }
}
