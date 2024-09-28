using MongoDB.Driver;
using ecommerce_backend.Models;
using ecommerce_backend.Data; // Make sure the namespace matches your project


namespace ecommerce_backend.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(MongoDbContext dbContext)
        {
            _users = dbContext.Users;
        }

        public async Task<User> LoginAsync(string name, string password)
        {
            return await _users.Find(u => u.Name == name && u.Password == password).FirstOrDefaultAsync();
        }

        public async Task<User> RegisterAsync(User user)
        {
            await _users.InsertOneAsync(user);
            return user;
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _users.Find(_ => true).ToListAsync();
        }
    }
}
