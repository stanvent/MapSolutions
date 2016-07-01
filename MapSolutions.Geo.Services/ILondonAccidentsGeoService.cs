using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GeoJson.net2;

namespace MapSolutions.Geo.Services
{
    public interface ILondonAccidentsGeoService
    {
        Geojson GetAccidentsGeoJson(int accidentYear, int numberOfVehicles, IList<string> vehicleTypes);

        string GetAccidentsByBoroughGeoJson(int accidentYear, int numberOfVehicles, int vehicleType);

        string GetAccidentsByMonthsGeoJson(int accidentYear, int accidentMonth);
    }
}
