using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GeoJson.net2;
using Npgsql;

namespace MapSolutions.Geo.Services
{
    public class LondonAccidentsGeoService:ILondonAccidentsGeoService
    {
        private string _connectionString;
        public LondonAccidentsGeoService(string connectionString)
        {
            _connectionString = connectionString;
        }
        public Geojson GetAccidentsGeoJson(int accidentYear, int numberOfVehicles, IList<string> vehicleTypes)
        {
            /*
  accident_index character varying(13),
  longitude double precision,
  latitude double precision,
  location geometry,
  num_vehicles integer,
  acc_year integer,
  gid integer 
             */
            /*
             
SELECT distinct(acc.accident_index) as accident_index, acc.longitude, acc.latitude, acc.location, acc.num_vehicles, 
       acc.acc_year, gid, veh.vehicle_type
  FROM public.lnd_accidents acc 
  inner join public.vehicles_full veh on
  veh.accident_index=acc.accident_index
  where acc.acc_year=2007 and veh.vehicle_type in ('1','23','11')
    ;

             */

            List<LatLng> coords = new List<LatLng>();

            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();

                var queryStringBuilder = new StringBuilder();

                queryStringBuilder.AppendFormat("SELECT acc.latitude, acc.longitude FROM lnd_accidents acc {0} where 1=1 ",
                    vehicleTypes.Count>0?"":" inner join public.vehicles_full veh on veh.accident_index=acc.accident_index ");

                if (accidentYear > 0)
                {
                    queryStringBuilder.AppendFormat(" AND acc_year={0}", accidentYear); 
                }
                if (numberOfVehicles > 0)
                {
                    queryStringBuilder.AppendFormat(" AND num_vehicles={0}", numberOfVehicles);
                }
                if (vehicleTypes.Count > 0)
                {
                    string tmp = vehicleTypes.Aggregate((first, second) => first + ',' + second);
                    queryStringBuilder.AppendFormat(" AND veh.vehicle_type in({0})", tmp);
                }

                var command = new NpgsqlCommand(queryStringBuilder.ToString(), conn);

                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    coords.Add(new LatLng(Convert.ToDouble(reader[0]), Convert.ToDouble(reader[1])));
                }

            }

            return new Point(coords);
        }

    }
}
