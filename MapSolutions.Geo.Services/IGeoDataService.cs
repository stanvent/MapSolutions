using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GeoJson.net2;

namespace MapSolutions.Geo.Services
{
    public interface IGeoDataService
    {
        //Geojson GetPoints();
        Geojson GetLineLayer();

        Geojson GetPointLayer();
    }
}
