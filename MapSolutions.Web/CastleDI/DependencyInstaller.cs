using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using System.Web.Http.Controllers;
using MapSolutions.Service.Contracts;
using MapSolutions.Service.Implementations;


namespace MapSolutions.CastleDI
{
    public class DependencyInstaller :  IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(
                        Component.For<ITwitterService>()
                            .ImplementedBy<TwitterService>()
                            .LifeStyle.PerWebRequest,

                        Types.FromThisAssembly().BasedOn<IHttpController>().LifestyleTransient(),

                        Types.FromAssemblyNamed("MapSolutions.Service")
                            .Where(type => type.Name.EndsWith("Service")).WithServiceAllInterfaces().LifestylePerWebRequest()

                        );
        }
    }
}