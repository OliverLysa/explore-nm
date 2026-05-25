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

  photos?: {
    lat: number
    lng: number

    image: string

    caption: string
  }[]
}

export const trips: Trip[] = [
  {
    slug: "apache-kid-trail-43",

    title:
      "Apache Kid Trail #43",

    location:
      "San Mateo Mountains, New Mexico",

    // Trailhead coordinates
  lat: 33.5752281684803,
  lng: -107.4044701738652,


    description:
      "Remote wilderness hiking through rugged volcanic terrain and high ridgelines.",

    routeFile:
      "/routes/apache-kid-43.gpx",

    distance: "22.0 mi",

    elevation: "3,955 ft gain",
    

    photos: [
  {
    lat: 33.65963214480833,
    lng: -107.43738847089666,

    image:
      "/images/blue-mountain-summit.jpeg",

    caption:
      "Summit before West Blue Mountain"
  },

  {
    lat: 33.62564217729925,
    lng: -107.42175079929393,

    image:
      "/images/twentyfive-yard-spring.jpeg",

    caption:
      "Water source"
  },
   {
    lat: 33.6505323438008,
    lng: -107.42563443152937,

    image:
      "/images/cyclone-saddle.jpeg",

    caption:
      "Cyclone saddle"
  }
]

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