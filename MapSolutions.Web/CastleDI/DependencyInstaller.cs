using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using System.Web.Http.Controllers;
using MapSolutions.Geo.Services;
using MapSolutions.Service.Contracts;
using MapSolutions.Service.Implementations;


namespace MapSolutions.CastleDI
{
    public class DependencyInstaller :  IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            var connectionString = System.Configuration.ConfigurationManager.AppSettings["PostgresAccidentsDBConnectionString"];

            container.Register(
                        Component.For<ITwitterService>()
                            .ImplementedBy<TwitterService>()
                            .LifeStyle.PerWebRequest,

                            Component.For<IGeoDataService>()
                            .ImplementedBy<GeoDataService>()
                            .DependsOn(Dependency.OnValue("connectionString", connectionString))
                            .LifeStyle.PerWebRequest,

                             Component.For<ILondonAccidentsGeoService>()
                            .ImplementedBy<LondonAccidentsGeoService>()
                            .DependsOn(Dependency.OnValue("connectionString", connectionString))
                            .LifeStyle.PerWebRequest,

                        Types.FromThisAssembly().BasedOn<IHttpController>().LifestyleTransient(),

                        Types.FromAssemblyNamed("MapSolutions.Service")
                            .Where(type => type.Name.EndsWith("Service")).WithServiceAllInterfaces().LifestylePerWebRequest()

                        );
        }
    }
}