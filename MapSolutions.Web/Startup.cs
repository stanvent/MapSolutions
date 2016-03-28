using Microsoft.Owin;
using Owin;

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
