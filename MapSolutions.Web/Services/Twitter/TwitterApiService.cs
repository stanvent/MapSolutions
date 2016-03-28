using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MapSolutions.Services.Twitter
{
    /*
     Consumer Key (API Key)	S4BF89pALCU9T6qNy901Vp8QV
Consumer Secret (API Secret)	6rHQjEFyMOjVuKLd49SZzIWHEkNAFsXGsZeEibPpkTO3WjOdpo
Access Level	Read-only (modify app permissions)
Owner	Selfexplorer
Owner ID	19927998
     * 
     * 
     * 
     Access Token	19927998-vS2P3nqkUrFUY7g8dvXFIDeG48ZWhM8DpZO91LJ5a
Access Token Secret	kBR91Dl2pPNHro9SpodXnhG9cBHKWgaAuowFlj3QsroDL
Access Level	Read-only
Owner	Selfexplorer
Owner ID	19927998
     */

    public class TwitterApiService : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
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