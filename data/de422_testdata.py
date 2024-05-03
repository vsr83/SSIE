import numpy as np;
import json;
import de421;
import de422;
from jplephem import Ephemeris;
from jplephem.calendar import compute_julian_date
import sys;

eph = Ephemeris(de422);

def generate_json(JDepoch):
    bodies = ['sun', 'mercury', 'venus', 'earthmoon', 'moon', 'mars', 
    'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    au = 149597870.691;

    # GM_sun / GM_planet from Table 1. Mass parameters of planetary bodies 
    # used in DE 421 (Folkner, Williams, Boggs - The Planetary and Lunar 
    # Ephemeris DE 421).
    k = 0.01720209895;
    GM_mer = 6023597.400017;
    GM_ven = 408523.718655;
    GM_ear = 332946.048166;
    GM_mar = 3098703.590267;
    GM_jup = 1047.348625;
    GM_sat = 3497.901768;
    GM_ura = 22902.981613;
    GM_nep = 19412.237346;
    GM_plu = 135836683.767599;
    GM_moo = 27068703.185436;

    mu_sun = k*k;
    mu_mer = k*k/GM_mer;
    mu_ven = k*k/GM_ven;
    mu_ear = k*k/GM_ear;
    mu_moo = k*k/GM_moo;
    mu_mar = k*k/GM_mar;
    mu_jup = k*k/GM_jup;
    mu_sat = k*k/GM_sat;
    mu_ura = k*k/GM_ura;
    mu_nep = k*k/GM_nep;
    mu_plu = k*k/GM_plu;

    #mu_sun = 2.959122082855911e-04;
    #mu_mer = 4.912500194824559e-11;
    #mu_ven = 7.243452332680141e-10;
    #mu_ear = 8.887692446750799e-10;
    #mu_moo = 1.093189462305851e-11;
    #mu_mar = 9.549548829827684e-11;
    #mu_jup = 2.825345825239843e-07;
    #mu_sat = 8.459705993418360e-08;
    #mu_ura = 1.292026564974666e-08;
    #mu_nep = 1.524357347892686e-08;
    #mu_plu = 2.175096464904175e-12;

    #print('Epoch time:');
    #print(JDepoch);
    #print('Libration initial condition:');
    librations = eph.compute('librations', JDepoch).flatten();
    libration = {
        "phi"    : librations[0],
        "phi1"   : librations[3],
        "theta"  : librations[1],
        "theta1" : librations[4],
        "psi"    : librations[2],
        "psi1"   : librations[5]
    };
    #json_output_libration = json.dumps(libration);
    #print(json_output);

    osv_sun = eph.compute('sun',       JDepoch).flatten()/au;
    osv_mer = eph.compute('mercury',   JDepoch).flatten()/au;
    osv_ven = eph.compute('venus',     JDepoch).flatten()/au;
    osv_emb = eph.compute('earthmoon', JDepoch).flatten()/au;
    osv_moe = eph.compute('moon',      JDepoch).flatten()/au;
    osv_mar = eph.compute('mars',      JDepoch).flatten()/au;
    osv_jup = eph.compute('jupiter',   JDepoch).flatten()/au;
    osv_sat = eph.compute('saturn',    JDepoch).flatten()/au;
    osv_ura = eph.compute('uranus',    JDepoch).flatten()/au;
    osv_nep = eph.compute('neptune',   JDepoch).flatten()/au;
    osv_plu = eph.compute('pluto',     JDepoch).flatten()/au;

    # Convert EMB OSVs to the barycentric Earth and Moon OSVs.
    mu_ratio = mu_ear / mu_moo;
    osv_ear = osv_emb - osv_moe / (1 + mu_ratio);
    osv_moo = osv_emb + osv_moe * mu_ratio / (1 + mu_ratio);

    def pos(osv):
        return [osv[0], osv[1], osv[2]]
    def vel(osv):
        return [osv[3], osv[4], osv[5]]

    objects = [
        {"name" : "Sun",     "mu" : mu_sun, "r" : pos(osv_sun), "v" : vel(osv_sun)},
        {"name" : "Mercury", "mu" : mu_mer, "r" : pos(osv_mer), "v" : vel(osv_mer)},
        {"name" : "Venus",   "mu" : mu_ven, "r" : pos(osv_ven), "v" : vel(osv_ven)},
        {"name" : "Earth",   "mu" : mu_ear, "r" : pos(osv_ear), "v" : vel(osv_ear)},
        {"name" : "Moon",    "mu" : mu_moo, "r" : pos(osv_moo), "v" : vel(osv_moo)},
        {"name" : "Mars",    "mu" : mu_mar, "r" : pos(osv_mar), "v" : vel(osv_mar)},
        {"name" : "Jupiter", "mu" : mu_jup, "r" : pos(osv_jup), "v" : vel(osv_jup)},
        {"name" : "Saturn",  "mu" : mu_sat, "r" : pos(osv_sat), "v" : vel(osv_sat)},
        {"name" : "Uranus",  "mu" : mu_ura, "r" : pos(osv_ura), "v" : vel(osv_ura)},
        {"name" : "Neptune", "mu" : mu_nep, "r" : pos(osv_nep), "v" : vel(osv_nep)},
        {"name" : "Pluto",   "mu" : mu_plu, "r" : pos(osv_plu), "v" : vel(osv_plu)}
    ];

    #json_output = json.dumps(objects);
    #print("Point mass initial condition:");
    #print(json_output);
    return {
        "point_masses" : objects,
        "libration"    : libration
    }

np.set_printoptions(threshold=np.inf);
np.set_printoptions(linewidth=np.inf);
np.set_printoptions(precision=30);

def write_json(start_year, end_year, filename):
    JD_list = [];
    objects_list = [];

    print("Writing " + filename);

    JDepoch_start = compute_julian_date(start_year, 1, 1);
    JDepoch_end   = compute_julian_date(end_year, 1, 1);
    num_items = (int(JDepoch_end) - int(JDepoch_start)) * 6;
    JDepoch = JDepoch_start;

    for ind in range(0, num_items):
        #if ind % 1000 == 0:
        #    print(ind / (365*6));
        JDepoch = JDepoch_start + ind / 6.0;
        objects = generate_json(JDepoch);

        JD_list.append(JDepoch);
        objects_list.append(objects);

    output = {
        "JD_list" : JD_list,
        "objects_list" : objects_list
    };

    json_output = json.dumps(output);
    #print(json_output);
    f = open(filename, "w");
    f.write(json_output);
    f.close();

write_json(1900, 1910, "DE422_1900-1910.json")
write_json(1910, 1920, "DE422_1910-1920.json")
write_json(1920, 1930, "DE422_1920-1930.json")
write_json(1930, 1940, "DE422_1930-1940.json")
write_json(1940, 1950, "DE422_1940-1950.json")
write_json(1950, 1960, "DE422_1950-1960.json")
write_json(1960, 1970, "DE422_1960-1970.json")
write_json(1970, 1980, "DE422_1970-1980.json")
write_json(1980, 1990, "DE422_1980-1990.json")
write_json(1990, 2000, "DE422_1990-2000.json")
write_json(2000, 2010, "DE422_2000-2010.json")
write_json(2010, 2020, "DE422_2010-2020.json")
write_json(2020, 2030, "DE422_2020-2030.json")
write_json(2030, 2040, "DE422_2030-2040.json")
write_json(2040, 2050, "DE422_2040-2050.json")
write_json(2050, 2060, "DE422_2050-2060.json")
write_json(2060, 2070, "DE422_2060-2070.json")
write_json(2070, 2080, "DE422_2070-2080.json")
write_json(2080, 2090, "DE422_2080-2090.json")
write_json(2090, 2100, "DE422_2090-2100.json")
#write_json(1950, 2000, "DE422_1950-2000.json")
#write_json(2000, 2050, "DE422_2000-2050.json")
#write_json(2050, 2100, "DE422_2050-2100.json")
