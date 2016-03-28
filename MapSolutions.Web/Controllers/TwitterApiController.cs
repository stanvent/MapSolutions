using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using MapSolutions.Common.Filters;
using MapSolutions.Model;
using MapSolutions.Model.DTO;
using MapSolutions.Service.Contracts;


namespace MapSolutionServices.Controllers
{
    public class TwitterApiController : ApiController
    {
        private ITwitterService _twitterService;

        public TwitterApiController(ITwitterService twitterService)
        {
            _twitterService = twitterService;
        }
        // GET api/<controller>
        /*public IEnumerable<string> Get()
        {
            return new string[] { "val1", "val2" };
        }*/

        [EnableCors]
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        [System.Web.Http.HttpPost]
        public List<Tweet> GetTweets(TweetRequestParams reqParams)
        {
            return _twitterService.GetTweets(reqParams);
        }

       
        public void Post([FromBody]string value)
        {

        }

        // PUT api/<controller>/5
        /*public void Put(int id, [FromBody]string value)
        {
        }*/

        // DELETE api/<controller>/5
        /*public void Delete(int id)
        {
        }*/
    }
}