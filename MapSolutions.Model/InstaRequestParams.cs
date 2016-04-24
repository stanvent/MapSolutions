using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapSolutions.Model
{
    public class InstaRequestParams
    {
        public string Lat { get; set; }

        public string Lng { get; set; }

        public int Radius { get; set; }

        public string Tag { get; set; }
    }
}
