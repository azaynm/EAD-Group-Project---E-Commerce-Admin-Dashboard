using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace ecommerce_backend.Models
{
    public class Vendor
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;
        // Use the average of comment rankings as the vendor's ranking
    [BsonIgnore] // Ignore storing in MongoDB, computed on demand
    public double Ranking => Comments.Count == 0 ? 0.0 : Comments.Average(c => c.Ranking);
        public List<Comment> Comments { get; set; } = new List<Comment>();
    }

    public class Comment
    {
        public string CommentText { get; set; } = string.Empty;
        public double Ranking { get; set; } = 0.0;
    }
}
