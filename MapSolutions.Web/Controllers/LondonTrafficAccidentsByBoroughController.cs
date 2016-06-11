using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MapSolutions.Controllers
{
    public class LondonTrafficAccidentsByBoroughController : Controller
    {
        //
        // GET: /LondonTrafficAccidentsHeatMaps/
        public ActionResult LondonTrafficAccidentsByBorough()
        {
            return View();
        }
	}
}