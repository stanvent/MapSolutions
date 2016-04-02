using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MapSolutions.Model;
using MapSolutions.Service.Contracts;
using LinqToTwitter;

namespace MapSolutions.Service.Implementations
{
    public class TwitterService:ITwitterService
    {
        public List<Tweet> GetTweets(TweetRequestParams requestParams)
        {
            List<Tweet> listTweets = new List<Tweet>();

            var auth = new SingleUserAuthorizer
            {
                CredentialStore = new SingleUserInMemoryCredentialStore
                {
                    ConsumerKey = "S4BF89pALCU9T6qNy901Vp8QV",
                    ConsumerSecret = "6rHQjEFyMOjVuKLd49SZzIWHEkNAFsXGsZeEibPpkTO3WjOdpo",
                    AccessToken = "19927998-vS2P3nqkUrFUY7g8dvXFIDeG48ZWhM8DpZO91LJ5a",
                    AccessTokenSecret = "kBR91Dl2pPNHro9SpodXnhG9cBHKWgaAuowFlj3QsroDL"
                }
            };

            var geocodeString = String.Format("{0},{1},{2}km", requestParams.Lat, requestParams.Lng, requestParams.Radius);
            var queryStr = String.IsNullOrEmpty(requestParams.SearchPattern) ? "*" : requestParams.SearchPattern;
            var twitterCtx = new TwitterContext(auth);
            var searchResponse =
                (from search in twitterCtx.Search
                    where search.Type == SearchType.Search &&
                          search.ResultType == ResultType.Recent &&
                          search.GeoCode == geocodeString &&
                          search.Query == queryStr &&
                          search.Count == 100
                    select search)
                    .SingleOrDefault();

            if (searchResponse != null && searchResponse.Statuses != null)
                searchResponse.Statuses.ForEach(tweet =>
                    listTweets.Add(new Tweet
                    {
                        TweetBody = tweet.Text, 
                        UserName = tweet.User.Name, 
                        UserScreenName = tweet.User.ScreenNameResponse,
                        CreatedAt = tweet.CreatedAt,
                        ProfileImageUrl = tweet.User.ProfileImageUrl
                        
                    }));

            return listTweets;
        }


    }
}
