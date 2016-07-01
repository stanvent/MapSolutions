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

/*
 реализовать поиск расстояния между двумя точками с помощью 4 API (Google Maps, OSM, Bing, Yahoo)
 
 Provide a solution where we can do "address lookup", and get a lat/long for a given address, 
 * and also determine the distance (straight-line or driving) between to addresses. 
 * The inputs will be a user-entered string containing an address. 
 * 1) call OSM API directly on demand,
 * then if OSM does has information about address, then we calculate the distance between those two addresses
 * 2) if OSM doesn't have address, or it is not full we must call Google API to calculate the distance. 
 * This needs to be done as a C# class with NUnit test classes that can be run for a set of addresses of my choice.
 
 
 */