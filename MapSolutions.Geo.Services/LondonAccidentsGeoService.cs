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

                queryStringBuilder.AppendFormat("SELECT distinct(acc.accident_index), acc.latitude, acc.longitude FROM lnd_accidents acc {0} where 1=1 ",
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
                    coords.Add(new LatLng(Convert.ToDouble(reader[1]), Convert.ToDouble(reader[2])));
                }

            }

            return new Point(coords);
        }

        public string GetAccidentsByBoroughGeoJson(int accidentYear, int numberOfVehicles, int vehicleType)
        {
            List<LatLng> coords = new List<LatLng>();
            string geoJsonResult;
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                conn.Open();

                var queryStringBuilderMain = new StringBuilder();

                var queryStringBuilderSub = new StringBuilder();

                queryStringBuilderMain.Append("SELECT row_to_json(fc)" +
                    " FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features" +
                    " FROM (SELECT 'Feature' As type" +
                    " , ST_AsGeoJSON(lg.geom_simply)::json As geometry" +
                    " , row_to_json((SELECT l FROM (SELECT acc_count, name) As l" +
                    " )) As properties" +
                    " FROM (");

                queryStringBuilderSub.AppendFormat("select count(acc.borough_id) as acc_count, bor.name, bor.geom_simply from public.london_borough bor left join public.lnd_accidents acc on acc.borough_id = bor.gid ");

                if (accidentYear > 0)
                {
                    queryStringBuilderSub.AppendFormat(" AND acc.acc_year={0}", accidentYear);
                }
                if (numberOfVehicles > 0)
                {
                    queryStringBuilderSub.AppendFormat(" AND acc.num_vehicles={0}", numberOfVehicles);
                }
                if (vehicleType > 0)
                {
                    queryStringBuilderSub.AppendFormat(" AND exists(select veh.accident_index from public.vehicles_full veh where veh.accident_index = acc.accident_index and veh.vehicle_type_int={0})", vehicleType);
                }

                queryStringBuilderSub.AppendFormat(" group by bor.gid ");

                queryStringBuilderMain.Append(queryStringBuilderSub);

                queryStringBuilderMain.Append(") As lg   ) As f )  As fc;");
                var command = new NpgsqlCommand(queryStringBuilderMain.ToString(), conn);
                geoJsonResult = Convert.ToString(command.ExecuteScalar());
               
            }
            return geoJsonResult;
        }

    }
}
