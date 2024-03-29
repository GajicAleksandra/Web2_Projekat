using App.UserService.BussinessLogic.Services.Interface;
using App.UserService.BussinessLogic.Services;
using Microsoft.OpenApi.Models;
using App.UserService.DataAccess.Repository.Interface;
using App.UserService.DataAccess.Repository;
using App.UserService.DataAccess.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AutoMapper;
using App.Mapper;
using App.UserService.Models.Models;
using MailKit;
using App.Common.Services.Interfaces;
using App.Common.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("EmailSettings"));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "OnlineShoppingApp.UserService", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

var mapperConfig = new MapperConfiguration(cfg =>
{
    cfg.AddProfile(new ProfileMapper());
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<IBlobService, BlobService>();

builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters //Podesavamo parametre za validaciju pristiglih tokena
        {
            ValidateIssuer = true, //Validira izdavaoca tokena
            ValidateAudience = false, //Kazemo da ne validira primaoce tokena
            ValidateLifetime = true,//Validira trajanje tokena
            ValidateIssuerSigningKey = true, //validira potpis token, ovo je jako vazno!
            ValidIssuer = "http://localhost:7059", //odredjujemo koji server je validni izdavalac
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("Authentication:SecretKey")))//navodimo privatni kljuc kojim su potpisani nasi tokeni
        };
    });

builder.Services.AddCors(options =>
{ 
    options.AddPolicy(name: "cors", builder => {
        builder.WithOrigins("https://localhost:7032")//Ovde navodimo koje sve aplikacije smeju kontaktirati nasu,u ovom slucaju nas Angular front
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

var mapper = mapperConfig.CreateMapper();

builder.Services.AddSingleton(mapper);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("cors");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
