// Rough first-name -> gender heuristic used to pre-fill the outreach form.
// It is a starting suggestion only — every entry stays editable, and unknown
// names fall back to "Unspecified" rather than guessing.

const GIRL_NAMES = new Set([
  "sarah","mary","jane","grace","joy","faith","hope","ruth","esther","rebecca","susan","florence",
  "harriet","joyce","juliet","brenda","patience","peace","irene","annet","proscovia","phiona","shifra",
  "aisha","fatuma","zainab","amina","nakato","nabirye","nansubuga","namutebi","nakalema","nalubega",
  "namuli","nassuna","auma","atim","akello","adongo","apio","nyakato","nyangoma","kevin","alice","betty",
  "carol","diana","emily","fiona","gladys","hannah","janet","kate","laura","mercy","nancy","olivia",
  "priscilla","queen","rachel","stella","tracy","victoria","winnie","yvonne","zara","doreen","sandra",
  "sharon","cynthia","catherine","christine","agnes","beatrice","dorothy","edith","evelyn","gloria",
  "immaculate","jacinta","josephine","justine","lillian","maria","martha","monica","norah","pamela",
  "rose","teopista","veronica","vanessa","angela","bridget","charlotte","daisy","eva","gift","goodness",
  "precious","sophia","emma","olive","lucy","becky","cindy","dorcas","edna","georgina","henrietta","ivy",
  "jemima","kathy","linda","miriam","nadia","paula","quinn","rita","salma","tabitha","ursula","vera",
  "wendy","abigail","brianna","chloe","daniella","erica"
]);

const BOY_NAMES = new Set([
  "john","james","peter","paul","david","michael","daniel","joseph","samuel","joshua","moses","aaron",
  "isaac","jacob","noah","elijah","emmanuel","gabriel","benjamin","andrew","mark","luke","matthew","simon",
  "stephen","henry","edward","richard","robert","william","charles","francis","patrick","anthony","martin",
  "victor","denis","dennis","ronald","edwin","brian","kevin","alex","alan","allan","eric","derrick","fred",
  "frank","geoffrey","godfrey","herbert","ivan","julius","kenneth","lawrence","musa","nelson","oscar",
  "phillip","raymond","timothy","vincent","walter","yusuf","zack","ssemakula","kato","wasswa","mukasa",
  "kizza","kimuli","okello","opio","otim","odongo","omara","ochieng","muwanga","mugisha","tumusiime",
  "byaruhanga","katamba","lubega","kaggwa","ssali","nsubuga","ntale","mutebi","kayongo","waiswa",
  "nkurunziza","habyarimana","dan","tony","tom","sam","ben","max","leo","hassan","ibrahim","abdul","yasin",
  "suleiman","rashid","ali","omar"
]);

export function suggestGender(fullName) {
  const parts = (fullName || "").toLowerCase().trim().split(/\s+/).filter(Boolean);
  for (const p of parts) {
    if (GIRL_NAMES.has(p)) return "Girl";
    if (BOY_NAMES.has(p)) return "Boy";
  }
  return "Unspecified";
}
