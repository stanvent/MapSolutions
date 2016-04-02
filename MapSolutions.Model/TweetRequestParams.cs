using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapSolutions.Model
{
    public class TweetRequestParams
    {
        public string Lat { get; set; }

        public string Lng { get; set; }

        public int Radius { get; set; }

        public string SearchPattern { get; set; }
        
    }
}
