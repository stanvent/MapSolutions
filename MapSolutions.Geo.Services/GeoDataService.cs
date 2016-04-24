using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GeoJson.net2;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using Npgsql;
using LineString = GeoJson.net2.LineString;
using Point = GeoJson.net2.Point;

namespace MapSolutions.Geo.Services
{
    public class GeoDataService : IGeoDataService
    {
        /*
         SELECT *
FROM mytable
WHERE mytable.geom && ST_MakeEnvelope(10.9351, 49.3866, 11.201, 49.5138, 4326);
         * */

        /*
         User ID=root;Password=myPassword;Host=localhost;Port=5432;Database=myDataBase;
Pooling=true;Min Pool Size=0;Max Pool Size=100;Connection Lifetime=0;
         * */
        private string _connectionString;
        public GeoDataService(string connectionString)
        {
            _connectionString = connectionString;
        }
        public Geojson GetLineLayer()
        {
            List<LatLng> coords = new List<LatLng>();
            
            //coords.Add(new LatLng(37.772, -122.214));
            //coords.Add(new LatLng(21.291, -157.821));
            
            coords.Add(new LatLng(-18.142, 178.431));

            coords.Add(new LatLng(-27.467, 153.027));
            return new LineString(coords);
        }

        public Geojson GetPointLayer()
        {
           
            //NetTopologySuite.IO.PostGisReader pgr = new PostGisReader();
            //var g = pgr.Read(new byte[1]);
           



            List<LatLng> coords = new List<LatLng>();

            using (Npgsql.NpgsqlConnection conn = new
                Npgsql.NpgsqlConnection(_connectionString))
            {

                conn.Open();

                // Define a query returning a single row result set
                NpgsqlCommand command = new NpgsqlCommand("SELECT latitude, longitude FROM lnd_accidents where latitude is not null and longitude is not null and num_vehicles=5", conn);

                // Execute the query and obtain the value of the first column of the first row
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    coords.Add(new LatLng(Convert.ToDouble(reader[0]), Convert.ToDouble(reader[1])));
                }

            }
            //NetTopologySuite.IO.PostGisReader pgReader = new PostGisReader();
            
            
            return new Point(coords);
        }
    }
}
