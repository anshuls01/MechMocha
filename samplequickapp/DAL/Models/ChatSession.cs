using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class ChatSession
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string GameId { get; set; }
        public string ChatId { get; set; }
        public bool Active { get; set; }
    }

}
