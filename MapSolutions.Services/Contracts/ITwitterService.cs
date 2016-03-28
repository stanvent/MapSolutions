using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using MapSolutions.Model;

namespace MapSolutions.Service.Contracts
{
    public interface ITwitterService
    {
        List<Tweet> GetTweets(TweetRequestParams requestParams);
    }
}
