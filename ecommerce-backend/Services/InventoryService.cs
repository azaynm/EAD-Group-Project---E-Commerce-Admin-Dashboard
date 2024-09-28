using MongoDB.Driver;
using ecommerce_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ecommerce_backend.Services
{
    public class InventoryService
    {
        private readonly IMongoCollection<InventoryItem> _inventoryCollection;

        public InventoryService(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("ecommerceDb"); // Replace with your database name
            _inventoryCollection = database.GetCollection<InventoryItem>("Inventory"); // Replace with your collection name
        }

        public async Task<List<InventoryItem>> GetInventoryAsync()
        {
            return await _inventoryCollection.Find(_ => true).ToListAsync();
        }

        public async Task<InventoryItem> CreateInventoryItemAsync(InventoryItem item)
        {
            await _inventoryCollection.InsertOneAsync(item);
            return item;
        }

        public async Task<InventoryItem> UpdateInventoryItemAsync(string id, InventoryItem updatedItem)
        {
            var result = await _inventoryCollection.ReplaceOneAsync(x => x.Id == id, updatedItem);
            if (result.MatchedCount == 0) return null;
            return updatedItem;
        }

        // Method to update the isActivated field by Id
        public async Task UpdateIsActivatedAsync(string id, bool isActivated)
        {
            var filter = Builders<InventoryItem>.Filter.Eq(item => item.Id, id);
            var update = Builders<InventoryItem>.Update.Set(item => item.IsActivated, isActivated);
            await _inventoryCollection.UpdateOneAsync(filter, update);
        }

        public async Task<bool> DeleteInventoryItemAsync(string id)
        {
            var result = await _inventoryCollection.DeleteOneAsync(x => x.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
