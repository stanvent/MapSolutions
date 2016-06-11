using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GeoJson.net2;
using MapSolutions.Common.Filters;
using MapSolutions.Geo.Services;
using MapSolutions.Model;
using Newtonsoft.Json;

namespace MapSolutions.Controllers
{
    public class LTAApiController : ApiController
    {
        private ILondonAccidentsGeoService _londonAccService;

        public LTAApiController(ILondonAccidentsGeoService londonAccService)
        {
            _londonAccService = londonAccService;
            //string value = System.Configuration.ConfigurationManager.AppSettings[key];
        }

        [EnableCors]
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        [System.Web.Http.HttpPost]
        public Geojson GetAccidentsGeoJson(/*int accidentYear, int numberOfVehicles, IList<string> vehicleTypes */)
        {
            int accidentYear = 2006;
            int numberOfVehicles = 1;
            IList<string> vehicleTypes = new List<string>();
            
            return _londonAccService.GetAccidentsGeoJson(accidentYear, numberOfVehicles, vehicleTypes);
        }

        [EnableCors]
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        [System.Web.Http.HttpPost]
        public string GetAccidentsByBorough(AccidentsRequestParams accidentsRequestParams)
        {
            /*
            int accidentYear = 2006;
            int numberOfVehicles = 1;
            IList<string> vehicleTypes = new List<string>();
            */
            return _londonAccService.GetAccidentsByBoroughGeoJson(accidentsRequestParams.accYear, accidentsRequestParams.numVehicles, accidentsRequestParams.vehicleType);
        }
    }
}
