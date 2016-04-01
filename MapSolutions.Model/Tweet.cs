﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapSolutions.Model
{
    public class Tweet
    {
        public string UserName { get; set; }

        public string TweetBody { get; set; }

        public string UserScreenName { get; set; }

        public string ProfileImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }
        
    }
}
