using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesManager.Data;
using NotesManager.Models;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace NotesManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public NotesController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Notes
        // Supports search (by title) and filtering by creation dates with pagination
        [HttpGet]
        public async Task<IActionResult> GetNotes(
            [FromQuery] string? search,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var userId = User.FindFirstValue("uid");

            var query = _context.Notes.Where(n => n.UserId == userId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(n => n.Title.Contains(search));
            }
            if (fromDate.HasValue)
            {
                query = query.Where(n => n.CreatedAt >= fromDate.Value);
            }
            if (endDate.HasValue)
            {
                query = query.Where(n => n.CreatedAt <= endDate.Value);
            }

            var totalNotes = await query.CountAsync();
            var notes = await query
                .OrderByDescending(n => n.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { totalNotes, notes });
        }

        // POST: api/Notes
        [HttpPost]
        public async Task<IActionResult> CreateNote([FromBody] NoteCreateModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue("uid");
            var note = new Note
            {
                Title = model.Title,
                Description = model.Description,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return Ok(note);
        }

        // PUT: api/Notes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, [FromBody] NoteUpdateModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue("uid");
            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (note == null)
                return NotFound();

            note.Title = model.Title;
            note.Description = model.Description;
            await _context.SaveChangesAsync();

            return Ok(note);
        }

        // DELETE: api/Notes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var userId = User.FindFirstValue("uid");
            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (note == null)
                return NotFound();

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Note deleted successfully" });
        }
    }

    public class NoteCreateModel
    {
        [Required]
        public string Title { get; set; }

        public string Description { get; set; }
    }

    public class NoteUpdateModel
    {
        [Required]
        public string Title { get; set; }

        public string Description { get; set; }
    }
}
