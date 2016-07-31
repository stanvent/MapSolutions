using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Dispatcher;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Castle.Windsor;
using MapSolutions.CastleDI;
using MapSolutionServices;
using Microsoft.Owin.Security.Provider;
using Newtonsoft.Json;
using NLog;
using NLog.Fluent;

namespace MapSolutions
{
    public class MapSolutionApplication : System.Web.HttpApplication
    {
        private readonly IWindsorContainer container;

        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

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
                typeof (IHttpControllerActivator),
                new WindsorActivator(this.container));
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            LogUserInfo(HttpContext.Current).ContinueWith(result => {});
        }

        
        static async Task LogUserInfo(HttpContext context)
        {
            await Task.Delay(1);
            try
            {
                /*
                var userIp = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                if (string.IsNullOrEmpty(userIp))
                {
                    userIp = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                }
                */

                var userIp = context.Request.UserHostAddress;
                var host = context.Request.UserHostAddress;
                //var refer = context.Request.UrlReferrer;
                string refer = context.Request.UrlReferrer == null ? "" : context.Request.UrlReferrer.AbsoluteUri;

                string url = "http://freegeoip.net/json/" + userIp;
                WebClient client = new WebClient();
                string jsonstring = client.DownloadString(url);
                dynamic dynObj = JsonConvert.DeserializeObject(jsonstring);

                logger.Info(
                    "DateTime: {0}, User IP: {1}, User Name: {2}, User Refer: {3}, User Country: {4}, User Region: {5}, User City: {6}",
                    DateTime.Now.ToString("dd.MM.yyyy hh:mm.ss"), userIp, host, refer, dynObj.country_name, dynObj.region_name, dynObj.city);
            }
            catch (Exception ex)
            {
                logger.Info(ex.Message);
            }

        }
    
    }
}
