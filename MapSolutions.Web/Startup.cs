﻿using Microsoft.Owin;
using Microsoft.Owin.Logging;
using Owin;
using NLog.Web;

[assembly: OwinStartupAttribute(typeof(MapSolutions.Startup))]
namespace MapSolutions
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
