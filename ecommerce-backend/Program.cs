using ecommerce_backend.Data;     // For MongoDbContext
using ecommerce_backend.Services; // For UserService
using MongoDB.Driver;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins"; // Define the CORS policy name

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var mongoConnectionString = builder.Configuration.GetConnectionString("MongoDb");
    return new MongoClient(mongoConnectionString); // MongoDB connection string
});

// Register InventoryService (assuming it is scoped)
builder.Services.AddScoped<InventoryService>();
// Add MongoDbContext
builder.Services.AddSingleton<MongoDbContext>();

// Add services to the container
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<InventoryService>();
builder.Services.AddScoped<VendorService>();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Allow specific origins like your React app
              .AllowAnyHeader()
              .AllowAnyMethod();  // Allow any method (GET, POST, PUT, etc.)
    });
});

// Add controllers
builder.Services.AddControllers();

var app = builder.Build(); // Build the app after adding services

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

app.UseStaticFiles(); // Serve static files if any (like for frontend assets)

app.UseRouting();

app.UseCors(MyAllowSpecificOrigins); // Apply the CORS policy using the specific policy name

app.UseAuthorization();

app.MapControllers(); // Map controllers

app.Run();
