using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MapSolutions.Geo.Services;

namespace MapSolutions.Test
{
    [TestClass]
    public class LondonAccidentsGeoServiceTest
    {
        [TestMethod]
        public void GetAccidentsByBoroughGeoJson_Valid()
        {
            var _connString =
                "Host=WINSERVER;User ID=postgres;Password=postgres;Port=5432;Database=MapSolutionsDB;CommandTimeout=1500;";
            LondonAccidentsGeoService londonAccidentsGeoService = new LondonAccidentsGeoService(_connString);

            var result = londonAccidentsGeoService.GetAccidentsByBoroughGeoJson(0, 0, 0);
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void GetAccidentsByMonths_Valid()
        {
            var _connString =
                "Host=WINSERVER;User ID=postgres;Password=postgres;Port=5432;Database=MapSolutionsDB;CommandTimeout=1500;";
            LondonAccidentsGeoService londonAccidentsGeoService = new LondonAccidentsGeoService(_connString);

            var result = londonAccidentsGeoService.GetAccidentsByMonthsGeoJson(2012, 5);
            Assert.IsNotNull(result);
        }
    }
}
