using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HumanManagermentBackend.Dto
{
    public class DegreeDTO
    {
        public long Id { get; set; }
        public DegreeTypeDTO DegreeType { get; set; }
        public string ImageName { get; set; }
    }
}
