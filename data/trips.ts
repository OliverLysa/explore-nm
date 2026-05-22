export interface Trip {
  slug: string
  title: string
 location: string
  lat: number
  lng: number
  description: string

  routeFile?: string
  distance?: string
  elevation?: string
}

export const trips: Trip[] = [
  {
    slug: "apache-kid-trail-43",

    title:
      "West Blue Mountain via Apache Kid Trail #43",

    location:
      "San Mateo Mountains, New Mexico",

    // Trailhead coordinates
  lat: 33.5752281684803,
  lng: -107.4044701738652,


    description:
      "Remote wilderness hiking through rugged volcanic terrain and high ridgelines.",

    routeFile:
      "/routes/apache-kid-43.gpx",

    distance: "9.0 mi",

    elevation: "3,955 ft gain"
  },

  {
    slug: "cold-spring-trail-87",

    title:
      "Cold Spring Trail #87",

    location:
      "San Mateo Mountains, New Mexico",

    lat: 33.688500605097005,
    lng: -107.34851548621513,


    description:
      "Forest trail climbing through mixed conifer terrain and shaded drainages."
  }
]