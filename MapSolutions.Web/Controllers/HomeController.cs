using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MapSolutions.Controllers
{
    public class HomeController : Controller
    {
        /*public ActionResult Index()
        {
            ViewBag.Title="Stan's mapping examples";
            return View();
        }*/

        public ActionResult About()
        {
            ViewBag.Message = "About me";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Contact";

            return View();
        }

        public ActionResult Examples()
        {
            ViewBag.Message = "Examples";

            return View();
        }
    }
}