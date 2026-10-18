export interface LocationItem {
  city: string;
  state: string;
  zip: string;
  full: string;
}

export interface RegionGroup {
  region: string;
  locations: LocationItem[];
}

export const NH_SERVICE_AREAS_DATA: RegionGroup[] = [
  {
    region: "Manchester",
    locations: [
      { city: "Manchester", state: "NH", zip: "03101", full: "Manchester, NH 03101" },
      { city: "Manchester", state: "NH", zip: "03102", full: "Manchester, NH 03102" },
      { city: "Manchester", state: "NH", zip: "03103", full: "Manchester, NH 03103" },
      { city: "Manchester", state: "NH", zip: "03104", full: "Manchester, NH 03104" },
      { city: "Manchester", state: "NH", zip: "03109", full: "Manchester, NH 03109" },
    ],
  },
  {
    region: "Greater Manchester",
    locations: [
      { city: "Auburn", state: "NH", zip: "03032", full: "Auburn, NH 03032" },
      { city: "Bedford", state: "NH", zip: "03110", full: "Bedford, NH 03110" },
      { city: "Candia", state: "NH", zip: "03034", full: "Candia, NH 03034" },
      { city: "Chester", state: "NH", zip: "03036", full: "Chester, NH 03036" },
      { city: "Deerfield", state: "NH", zip: "03037", full: "Deerfield, NH 03037" },
      { city: "Dunbarton", state: "NH", zip: "03046", full: "Dunbarton, NH 03046" },
      { city: "Fremont", state: "NH", zip: "03044", full: "Fremont, NH 03044" },
      { city: "Goffstown", state: "NH", zip: "03045", full: "Goffstown, NH 03045" },
      { city: "Hooksett", state: "NH", zip: "03106", full: "Hooksett, NH 03106" },
      { city: "New Boston", state: "NH", zip: "03070", full: "New Boston, NH 03070" },
      { city: "Raymond", state: "NH", zip: "03077", full: "Raymond, NH 03077" },
      { city: "Weare", state: "NH", zip: "03281", full: "Weare, NH 03281" },
    ],
  },
  {
    region: "Greater Nashua",
    locations: [
      { city: "Amherst", state: "NH", zip: "03031", full: "Amherst, NH 03031" },
      { city: "Brookline", state: "NH", zip: "03033", full: "Brookline, NH 03033" },
      { city: "Hollis", state: "NH", zip: "03049", full: "Hollis, NH 03049" },
      { city: "Hudson", state: "NH", zip: "03051", full: "Hudson, NH 03051" },
      { city: "Litchfield", state: "NH", zip: "03052", full: "Litchfield, NH 03052" },
      { city: "Merrimack", state: "NH", zip: "03054", full: "Merrimack, NH 03054" },
      { city: "Milford", state: "NH", zip: "03055", full: "Milford, NH 03055" },
      { city: "Mont Vernon", state: "NH", zip: "03057", full: "Mont Vernon, NH 03057" },
      { city: "Nashua", state: "NH", zip: "03060", full: "Nashua, NH 03060" },
    ],
  },
  {
    region: "Greater Salem / Derry",
    locations: [
      { city: "Derry", state: "NH", zip: "03038", full: "Derry, NH 03038" },
      { city: "Hampstead", state: "NH", zip: "03841", full: "Hampstead, NH 03841" },
      { city: "Londonderry", state: "NH", zip: "03053", full: "Londonderry, NH 03053" },
      { city: "Pelham", state: "NH", zip: "03076", full: "Pelham, NH 03076" },
      { city: "Salem", state: "NH", zip: "03079", full: "Salem, NH 03079" },
      { city: "Sandown", state: "NH", zip: "03873", full: "Sandown, NH 03873" },
      { city: "Windham", state: "NH", zip: "03087", full: "Windham, NH 03087" },
    ],
  },
  {
    region: "Greater Concord",
    locations: [
      { city: "Allenstown", state: "NH", zip: "03257", full: "Allenstown, NH 03257" },
      { city: "Bow", state: "NH", zip: "03304", full: "Bow, NH 03304" },
      { city: "Chichester", state: "NH", zip: "03258", full: "Chichester, NH 03258" },
      { city: "Concord", state: "NH", zip: "03301", full: "Concord, NH 03301" },
      { city: "Epsom", state: "NH", zip: "03234", full: "Epsom, NH 03234" },
      { city: "Henniker", state: "NH", zip: "03242", full: "Henniker, NH 03242" },
      { city: "Hopkinton", state: "NH", zip: "03229", full: "Hopkinton, NH 03229" },
      { city: "Pembroke", state: "NH", zip: "03275", full: "Pembroke, NH 03275" },
      { city: "Penacook", state: "NH", zip: "03303", full: "Penacook, NH 03303" },
      { city: "Loudon", state: "NH", zip: "03307", full: "Loudon, NH 03307" },
      { city: "Canterbury", state: "NH", zip: "03224", full: "Canterbury, NH 03224" },
      { city: "Contoocook", state: "NH", zip: "03229", full: "Contoocook, NH 03229" },
      { city: "Boscawen", state: "NH", zip: "03303", full: "Boscawen, NH 03303" },
      { city: "Pittsfield", state: "NH", zip: "03263", full: "Pittsfield, NH 03263" },
    ],
  },
  {
    region: "Greater Laconia",
    locations: [
      { city: "Laconia", state: "NH", zip: "03246", full: "Laconia, NH 03246" },
      { city: "Belmont", state: "NH", zip: "03220", full: "Belmont, NH 03220" },
      { city: "Tilton", state: "NH", zip: "03276", full: "Tilton, NH 03276" },
      { city: "Franklin", state: "NH", zip: "03235", full: "Franklin, NH 03235" },
      { city: "Gilmanton", state: "NH", zip: "03237", full: "Gilmanton, NH 03237" },
      { city: "Gilford", state: "NH", zip: "03249", full: "Gilford, NH 03249" },
      { city: "Bristol", state: "NH", zip: "03222", full: "Bristol, NH 03222" },
      { city: "Meredith", state: "NH", zip: "03253", full: "Meredith, NH 03253" },
      { city: "Wolfeboro", state: "NH", zip: "03894", full: "Wolfeboro, NH 03894" },
      { city: "Alton", state: "NH", zip: "03809", full: "Alton, NH 03809" },
      { city: "Moultonborough", state: "NH", zip: "03254", full: "Moultonborough, NH 03254" },
      { city: "Ashland", state: "NH", zip: "03217", full: "Ashland, NH 03217" },
      { city: "Andover", state: "NH", zip: "03216", full: "Andover, NH 03216" },
      { city: "Webster", state: "NH", zip: "03303", full: "Webster, NH 03303" },
      { city: "New London", state: "NH", zip: "03257", full: "New London, NH 03257" },
      { city: "Warner", state: "NH", zip: "03278", full: "Warner, NH 03278" },
    ],
  },
];
