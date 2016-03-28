using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Dispatcher;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Castle.Windsor;
using MapSolutions.CastleDI;
using MapSolutionServices;

namespace MapSolutions
{
    public class MapSolutionApplication : System.Web.HttpApplication
    {
        private readonly IWindsorContainer container;

        public MapSolutionApplication()
        {
            this.container =
                new WindsorContainer().Install(new DependencyInstaller());
        }

        public override void Dispose()
        {
            this.container.Dispose();
            base.Dispose();
        }

        protected void Application_Start()
        {
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            GlobalConfiguration.Configuration.Services.Replace(
                typeof(IHttpControllerActivator),
                new WindsorActivator(this.container));
        }
    }
}
