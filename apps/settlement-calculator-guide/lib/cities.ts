import { states } from "@/lib/states";

export type CityGuide = {
  name: string;
  slug: string;
  stateCode: string;
  stateName: string;
  stateSlug: string;
};

const cityNamesByStateCode: Record<string, readonly string[]> = {
  AL: ["Birmingham", "Montgomery", "Mobile"],
  AK: ["Anchorage", "Fairbanks", "Juneau"],
  AZ: ["Phoenix", "Tucson", "Mesa"],
  AR: ["Little Rock", "Fayetteville", "Fort Smith"],
  CA: ["Los Angeles", "San Diego", "San Jose"],
  CO: ["Denver", "Colorado Springs", "Aurora"],
  CT: ["Bridgeport", "Stamford", "New Haven"],
  DE: ["Wilmington", "Dover", "Newark"],
  FL: ["Jacksonville", "Miami", "Tampa"],
  GA: ["Atlanta", "Augusta", "Columbus"],
  HI: ["Honolulu", "Hilo", "Kailua"],
  ID: ["Boise", "Meridian", "Nampa"],
  IL: ["Chicago", "Aurora", "Naperville"],
  IN: ["Indianapolis", "Fort Wayne", "Evansville"],
  IA: ["Des Moines", "Cedar Rapids", "Davenport"],
  KS: ["Wichita", "Overland Park", "Kansas City"],
  KY: ["Louisville", "Lexington", "Bowling Green"],
  LA: ["New Orleans", "Baton Rouge", "Shreveport"],
  ME: ["Portland", "Lewiston", "Bangor"],
  MD: ["Baltimore", "Frederick", "Rockville"],
  MA: ["Boston", "Worcester", "Springfield"],
  MI: ["Detroit", "Grand Rapids", "Warren"],
  MN: ["Minneapolis", "Saint Paul", "Rochester"],
  MS: ["Jackson", "Gulfport", "Southaven"],
  MO: ["Kansas City", "Saint Louis", "Springfield"],
  MT: ["Billings", "Missoula", "Great Falls"],
  NE: ["Omaha", "Lincoln", "Bellevue"],
  NV: ["Las Vegas", "Henderson", "Reno"],
  NH: ["Manchester", "Nashua", "Concord"],
  NJ: ["Newark", "Jersey City", "Paterson"],
  NM: ["Albuquerque", "Las Cruces", "Rio Rancho"],
  NY: ["New York City", "Buffalo", "Rochester"],
  NC: ["Charlotte", "Raleigh", "Greensboro"],
  ND: ["Fargo", "Bismarck", "Grand Forks"],
  OH: ["Columbus", "Cleveland", "Cincinnati"],
  OK: ["Oklahoma City", "Tulsa", "Norman"],
  OR: ["Portland", "Eugene", "Salem"],
  PA: ["Philadelphia", "Pittsburgh", "Allentown"],
  RI: ["Providence", "Warwick", "Cranston"],
  SC: ["Charleston", "Columbia", "North Charleston"],
  SD: ["Sioux Falls", "Rapid City", "Aberdeen"],
  TN: ["Nashville", "Memphis", "Knoxville"],
  TX: ["Houston", "San Antonio", "Dallas"],
  UT: ["Salt Lake City", "West Valley City", "West Jordan"],
  VT: ["Burlington", "South Burlington", "Rutland"],
  VA: ["Virginia Beach", "Chesapeake", "Norfolk"],
  WA: ["Seattle", "Spokane", "Tacoma"],
  WV: ["Charleston", "Huntington", "Morgantown"],
  WI: ["Milwaukee", "Madison", "Green Bay"],
  WY: ["Cheyenne", "Casper", "Gillette"],
};

const toSlug = (name: string) => name.toLowerCase().replaceAll(" ", "-");

export const cityGuides: CityGuide[] = states.flatMap((state) =>
  (cityNamesByStateCode[state.code] ?? []).map((name) => ({
    name,
    slug: toSlug(name),
    stateCode: state.code,
    stateName: state.name,
    stateSlug: state.slug,
  })),
);

export function getCitiesForState(stateCode: string) {
  return cityGuides.filter((city) => city.stateCode === stateCode);
}

export function getCityGuide(stateSlug: string, citySlug: string) {
  return cityGuides.find((city) => city.stateSlug === stateSlug && city.slug === citySlug);
}
