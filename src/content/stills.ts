/**
 * Film stills, three per film, taken from each film at its own resolution (FreakyMack-Stills, Oct 2026).
 * Letterbox bars burnt into some masters are trimmed off; the picture itself is never scaled.
 * Generated from the extraction manifest. Films missing here had no source file on the studio's Mac yet.
 */
export type Still = { src: string; width: number; height: number; alt: string };

export const STILLS: Record<string, Still[]> = {
  "mcdonalds-chicken-mcwings": [
    { src: "/work/mcdonalds-chicken-mcwings/01.jpg", width: 1920, height: 752, alt: "Wings bursting through a cloud of spice" },
    { src: "/work/mcdonalds-chicken-mcwings/02.jpg", width: 1920, height: 752, alt: "Woman in a red jacket eating in a car" },
    { src: "/work/mcdonalds-chicken-mcwings/03.jpg", width: 1920, height: 752, alt: "Wings frying in the basket, close-up" },
  ],
  "mcdonalds-veg-surprise": [
    { src: "/work/mcdonalds-veg-surprise/01.jpg", width: 1920, height: 1080, alt: "Man in a white suit, arms spread wide, garden behind" },
    { src: "/work/mcdonalds-veg-surprise/02.jpg", width: 1920, height: 1080, alt: "Close-up, finger raised" },
    { src: "/work/mcdonalds-veg-surprise/03.jpg", width: 1920, height: 1080, alt: "Seated in an armchair holding the burger" },
  ],
  "pc-jeweller-tvc": [
    { src: "/work/pc-jeweller-tvc/01.jpg", width: 1920, height: 1080, alt: "Wide of the candle-lit staircase, woman descending" },
    { src: "/work/pc-jeweller-tvc/02.jpg", width: 1920, height: 1080, alt: "Woman in the kundan necklace, smiling" },
    { src: "/work/pc-jeweller-tvc/03.jpg", width: 1920, height: 1080, alt: "Man in black under the chandelier" },
  ],
  "rock-it": [
    { src: "/work/rock-it/01.jpg", width: 1920, height: 806, alt: "Wide of the gym, athlete on battle ropes" },
    { src: "/work/rock-it/02.jpg", width: 1920, height: 806, alt: "Close-up portrait in teal light" },
    { src: "/work/rock-it/03.jpg", width: 1920, height: 806, alt: "Low wide of a deadlift on the gym floor" },
  ],
  "changa": [
    { src: "/work/changa/01.jpg", width: 1920, height: 820, alt: "Two performers back to back in teal light, crowd behind" },
    { src: "/work/changa/02.jpg", width: 1920, height: 820, alt: "Rapper inside the orange neon tunnel" },
    { src: "/work/changa/03.jpg", width: 1920, height: 820, alt: "Woman on the gym machine in amber light" },
  ],
  "mercedes-benz-global-star": [
    { src: "/work/mercedes-benz-global-star/01.jpg", width: 1920, height: 800, alt: "Wide showroom with staircase, cars and a silhouette" },
    { src: "/work/mercedes-benz-global-star/02.jpg", width: 1920, height: 800, alt: "Woman with a coffee beside a white Mercedes" },
    { src: "/work/mercedes-benz-global-star/03.jpg", width: 1920, height: 800, alt: "G-Class grille and headlight close-up" },
  ],
  "dbs-lifestyle": [
    { src: "/work/dbs-lifestyle/01.jpg", width: 1920, height: 1080, alt: "Design team around the worktable (black and white)" },
    { src: "/work/dbs-lifestyle/02.jpg", width: 1920, height: 1080, alt: "Fabric on the loom, close-up" },
    { src: "/work/dbs-lifestyle/03.jpg", width: 1920, height: 1080, alt: "Executive at his desk, interview" },
  ],
  "pkcc": [
    { src: "/work/pkcc/01.jpg", width: 1920, height: 820, alt: "Wide of the roadside drinks stall, man arriving by bicycle" },
    { src: "/work/pkcc/02.jpg", width: 1920, height: 820, alt: "Bearded farmer smiling, hills behind" },
    { src: "/work/pkcc/03.jpg", width: 1920, height: 820, alt: "Younger man at the stall, hands clasped, listening" },
  ],
  "citta-moisturizing-baby-balm": [
    { src: "/work/citta-moisturizing-baby-balm/01.jpg", width: 1920, height: 988, alt: "Wide of the verandah, mother with baby on the daybed" },
    { src: "/work/citta-moisturizing-baby-balm/02.jpg", width: 1920, height: 988, alt: "Mother nuzzling the baby, close-up" },
    { src: "/work/citta-moisturizing-baby-balm/03.jpg", width: 1920, height: 988, alt: "Grandmother smiling over the baby" },
  ],
  "zypp-electric": [
    { src: "/work/zypp-electric/01.jpg", width: 1920, height: 802, alt: "Two men at the desk with the Zypp box, map wall behind" },
    { src: "/work/zypp-electric/02.jpg", width: 1920, height: 802, alt: "Delivery rider smiling at the door" },
    { src: "/work/zypp-electric/03.jpg", width: 1920, height: 802, alt: "Close-up of the founder" },
  ],
  "film-for-ace": [
    { src: "/work/film-for-ace/01.jpg", width: 1920, height: 816, alt: "Wide of the living room, father home with shopping" },
    { src: "/work/film-for-ace/02.jpg", width: 1920, height: 816, alt: "Father and daughter on the sofa, smiling" },
    { src: "/work/film-for-ace/03.jpg", width: 1920, height: 816, alt: "Family of four on the sofa" },
  ],
  "jaldi-bidai": [
    { src: "/work/jaldi-bidai/01.jpg", width: 1920, height: 1080, alt: "Wedding party gathered around the bride and groom" },
    { src: "/work/jaldi-bidai/02.jpg", width: 1920, height: 1080, alt: "Bride in close-up" },
    { src: "/work/jaldi-bidai/03.jpg", width: 1920, height: 1080, alt: "Bride and her father seated under fairy lights" },
  ],
  "falaknama-02": [
    { src: "/work/falaknama-02/01.jpg", width: 480, height: 848, alt: "Wide of the cafe, man waiting at the table" },
    { src: "/work/falaknama-02/02.jpg", width: 480, height: 848, alt: "Close-up, man smiling" },
    { src: "/work/falaknama-02/03.jpg", width: 480, height: 848, alt: "Matcha drink and a red rose on the table" },
  ],
  "falaknama-03": [
    { src: "/work/falaknama-03/01.jpg", width: 480, height: 848, alt: "Wide of the green library wall, woman reading" },
    { src: "/work/falaknama-03/02.jpg", width: 480, height: 848, alt: "Close-up sipping coffee" },
    { src: "/work/falaknama-03/03.jpg", width: 480, height: 848, alt: "Woman reading in the armchair" },
  ],
  "zykaz-cafe": [
    { src: "/work/zykaz-cafe/01.jpg", width: 1024, height: 768, alt: "Wide of the cafe, woman in red walking out with her bag" },
    { src: "/work/zykaz-cafe/02.jpg", width: 1024, height: 768, alt: "Woman in a mint blazer at her table" },
    { src: "/work/zykaz-cafe/03.jpg", width: 1024, height: 768, alt: "Man in a printed shirt at the next table" },
  ],
  "bombay-times-fashion-week": [
    { src: "/work/bombay-times-fashion-week/01.jpg", width: 1280, height: 720, alt: "Models on the runway, audience either side" },
    { src: "/work/bombay-times-fashion-week/02.jpg", width: 1280, height: 720, alt: "Model in a crystal tiara, close-up" },
    { src: "/work/bombay-times-fashion-week/03.jpg", width: 1280, height: 720, alt: "Model in a yellow clock dress backstage" },
  ],
  "sawe-international-excellence-awards": [
    { src: "/work/sawe-international-excellence-awards/01.jpg", width: 1280, height: 720, alt: "Guests arriving on the red carpet at night" },
    { src: "/work/sawe-international-excellence-awards/02.jpg", width: 1280, height: 720, alt: "Performers on stage against a starfield screen" },
    { src: "/work/sawe-international-excellence-awards/03.jpg", width: 1280, height: 720, alt: "Guest of honour seated in the ballroom" },
  ],
  "noughtone-show": [
    { src: "/work/noughtone-show/01.jpg", width: 720, height: 1280, alt: "Wide of the chequered runway, green coat at the head" },
    { src: "/work/noughtone-show/02.jpg", width: 720, height: 1280, alt: "Model in blue racing separates walking" },
    { src: "/work/noughtone-show/03.jpg", width: 720, height: 1280, alt: "Model in a green bomber, audience behind" },
  ],
  "pc-jeweller-sonalika-sahay": [
    { src: "/work/pc-jeweller-sonalika-sahay/01.jpg", width: 1920, height: 1080, alt: "Bride seated on the sofa in full jewellery" },
    { src: "/work/pc-jeweller-sonalika-sahay/02.jpg", width: 1920, height: 1080, alt: "Veiled portrait looking down" },
    { src: "/work/pc-jeweller-sonalika-sahay/03.jpg", width: 1920, height: 1080, alt: "Cocktail rings, hand on brocade" },
  ],
  "noughtone": [
    { src: "/work/noughtone/01.jpg", width: 1280, height: 720, alt: "Lone figure on the ridge at sunrise" },
    { src: "/work/noughtone/02.jpg", width: 1280, height: 720, alt: "Figure walking, mirrored in the water" },
    { src: "/work/noughtone/03.jpg", width: 1280, height: 720, alt: "Model in a grey jacket against the stone chapel" },
  ],
  "harshita-gaur": [
    { src: "/work/harshita-gaur/01.jpg", width: 1080, height: 1920, alt: "Twirling in a shower of rose petals" },
    { src: "/work/harshita-gaur/02.jpg", width: 1080, height: 1920, alt: "At the mirror holding the necklace" },
    { src: "/work/harshita-gaur/03.jpg", width: 1080, height: 1920, alt: "Close-up, hand at her face in a shaft of light" },
  ],
  "fabindia-01": [
    { src: "/work/fabindia-01/01.jpg", width: 720, height: 326, alt: "Couple laughing among marigold garlands" },
    { src: "/work/fabindia-01/02.jpg", width: 720, height: 326, alt: "Couple in the arched doorway" },
    { src: "/work/fabindia-01/03.jpg", width: 720, height: 326, alt: "Couple in close-up" },
  ],
  "fabindia-02": [
    { src: "/work/fabindia-02/01.jpg", width: 720, height: 326, alt: "Couple stepping out of the orange archway" },
    { src: "/work/fabindia-02/02.jpg", width: 720, height: 326, alt: "Couple laughing in close-up" },
    { src: "/work/fabindia-02/03.jpg", width: 720, height: 326, alt: "Woman in a coral sari, portrait" },
  ],
  "sex-sorted": [
    { src: "/work/sex-sorted/01.jpg", width: 1920, height: 820, alt: "Wide of the village square under the banyan, men and a cow" },
    { src: "/work/sex-sorted/02.jpg", width: 1920, height: 820, alt: "Two farmers talking in the green fields" },
    { src: "/work/sex-sorted/03.jpg", width: 1920, height: 820, alt: "Elder in a white turban, close-up" },
  ],
  "sexual-harassment-haryana": [
    { src: "/work/sexual-harassment-haryana/01.jpg", width: 852, height: 362, alt: "Woman in a sari standing in the office" },
    { src: "/work/sexual-harassment-haryana/02.jpg", width: 852, height: 362, alt: "Woman in profile at her desk" },
    { src: "/work/sexual-harassment-haryana/03.jpg", width: 852, height: 362, alt: "Two colleagues talking over tea" },
  ],
  "voting-campaign": [
    { src: "/work/voting-campaign/01.jpg", width: 848, height: 400, alt: "Village women and children walking up the lane" },
    { src: "/work/voting-campaign/02.jpg", width: 848, height: 400, alt: "Two women in orange and purple dupattas" },
    { src: "/work/voting-campaign/03.jpg", width: 848, height: 400, alt: "Woman and a boy sitting outside, cow behind" },
  ],
  "happy-republic-day": [
    { src: "/work/happy-republic-day/01.jpg", width: 1920, height: 1080, alt: "Wide of the balloon seller's cycle on the street" },
    { src: "/work/happy-republic-day/02.jpg", width: 1920, height: 1080, alt: "Balloon seller with flags and balloons" },
    { src: "/work/happy-republic-day/03.jpg", width: 1920, height: 1080, alt: "Man in a blue jacket, close-up" },
  ],
  "s-and-s-trailer": [
    { src: "/work/s-and-s-trailer/01.jpg", width: 1920, height: 804, alt: "Boy in the old-city lane" },
    { src: "/work/s-and-s-trailer/02.jpg", width: 1920, height: 804, alt: "Boy sitting against a brick wall" },
    { src: "/work/s-and-s-trailer/03.jpg", width: 1920, height: 804, alt: "Hands over a lit carrom board" },
  ],
};
