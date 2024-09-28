using ecommerce_backend.Models;
using MongoDB.Driver;
using ecommerce_backend.Data; // Make sure the namespace matches your project


public class VendorService
{
    private readonly IMongoCollection<Vendor> _vendors;

     private readonly VendorService _vendorService;


    public VendorService(MongoDbContext dbContext)
    {
        _vendors = dbContext.Vendors;
    }

    public async Task<List<Vendor>> GetVendorsAsync()
    {
        return await _vendors.Find(_ => true).ToListAsync();
    }

    public async Task<Vendor> CreateVendorAsync(Vendor vendor)
    {
        await _vendors.InsertOneAsync(vendor);
        return vendor;
    }



    public async Task<Vendor> UpdateRankingAsync(string vendorId, double ranking)
    {
        var update = Builders<Vendor>.Update.Set(v => v.Ranking, ranking);
        return await _vendors.FindOneAndUpdateAsync(v => v.Id == vendorId, update);
    }


    public async Task<Vendor> UpdateVendorAsync(string id, Vendor updatedVendor)
    {
        // Find vendor by ObjectId and update it
        var filter = Builders<Vendor>.Filter.Eq(v => v.Id, id);
        var updateDefinition = Builders<Vendor>.Update
            .Set(v => v.Name, updatedVendor.Name)
            .Set(v => v.Ranking, updatedVendor.Ranking)
            .Set(v => v.Comments, updatedVendor.Comments);

        var result = await _vendors.FindOneAndUpdateAsync(filter, updateDefinition, new FindOneAndUpdateOptions<Vendor>
        {
            ReturnDocument = ReturnDocument.After
        });

        return result;
    }

   // Add a comment with ranking to a vendor
    public async Task<Vendor?> AddCommentAsync(string vendorId, Comment comment)
    {
        var filter = Builders<Vendor>.Filter.Eq(v => v.Id, vendorId);
        var update = Builders<Vendor>.Update.Push(v => v.Comments, comment);

        // Return the updated document after the update
        var options = new FindOneAndUpdateOptions<Vendor>
        {
            ReturnDocument = ReturnDocument.After
        };

        return await _vendors.FindOneAndUpdateAsync(filter, update, options);
    }

    
}
