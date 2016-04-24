using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapSolutions.Model.LondonAccidents
{
    public class AccidentInfo
    {
        public string AccidentIndex;

        public DateTime AccidentYear;

        public int NumberOfVehicles;

        public IList<int> VehicleTypes;

    }

    
/*
 "9";"Car"
"8";"Taxi / Private hire car"
"19";"Van - Goods vehicle 3.5 tonnes mgw and under"
"20";"Goods vehicle over 3.5 tonnes mgw and under 7.5 tonnes mgw"
"21";"Goods vehicle 7.5 tonnes mgw & over"
"98";"Goods vehicle - unknown weight"
"2";"M/cycle 50cc and under"
"3";"M/cycle over 50cc and up to 125cc"
"4";"M/cycle over 125cc and up to 500cc "
"5";"Motorcycle over 500cc"
"97";"Motorcycle - cc unknown"
"23";"Electric Motorcycle"
"1";"Pedal cycle"
"11";"Bus or coach (17 or more passenger seats)"
"10";"Minibus (8-16 passenger seats)"
"17";"Agricultural vehicle (include diggers etc)"
"16";"Ridden horse"
"22";"Mobility scooter"
"18";"Tram / Light rail"
"90";"Other"
    */

}
