/**
 * Film stills, taken from each film at its own resolution: three per film from FreakyMack-Stills (JPG), and the
 * studio's own graded picks for the ad films (WebP, 4–11 per film, "Ad Films - Web"). The first is the cover.
 * Letterbox bars burnt into some masters are trimmed off; the picture itself is never scaled.
 * Generated from the extraction manifest. Films missing here had no source file on the studio's Mac yet.
 */
export type Still = { src: string; width: number; height: number; alt: string };

export const STILLS: Record<string, Still[]> = {
  "mcdonalds-chicken-mcwings": [
    { src: "/work/mcdonalds-chicken-mcwings/05.webp", width: 1920, height: 754, alt: "Frame from McDonald’s Chicken McWings, at 0:11" },
    { src: "/work/mcdonalds-chicken-mcwings/01.webp", width: 1920, height: 754, alt: "Frame from McDonald’s Chicken McWings, at 0:01" },
    { src: "/work/mcdonalds-chicken-mcwings/02.webp", width: 1920, height: 754, alt: "Frame from McDonald’s Chicken McWings, at 0:03" },
    { src: "/work/mcdonalds-chicken-mcwings/03.webp", width: 1920, height: 754, alt: "Frame from McDonald’s Chicken McWings, at 0:05" },
    { src: "/work/mcdonalds-chicken-mcwings/04.webp", width: 1920, height: 754, alt: "Frame from McDonald’s Chicken McWings, at 0:06" },
    { src: "/work/mcdonalds-chicken-mcwings/06.webp", width: 1920, height: 754, alt: "Frame from McDonald’s Chicken McWings, at 0:13" },
    { src: "/work/mcdonalds-chicken-mcwings/07.webp", width: 1920, height: 754, alt: "Frame from McDonald’s Chicken McWings, at 0:17" },
  ],
  "mcdonalds-veg-surprise": [
    { src: "/work/mcdonalds-veg-surprise/02.webp", width: 1920, height: 1080, alt: "Frame from McDonald’s Veg Surprise, at 0:12" },
    { src: "/work/mcdonalds-veg-surprise/01.webp", width: 1920, height: 1080, alt: "Frame from McDonald’s Veg Surprise, at 0:08" },
    { src: "/work/mcdonalds-veg-surprise/03.webp", width: 1920, height: 1080, alt: "Frame from McDonald’s Veg Surprise, at 0:17" },
    { src: "/work/mcdonalds-veg-surprise/04.webp", width: 1920, height: 1080, alt: "Frame from McDonald’s Veg Surprise, at 0:24" },
  ],
  "pc-jeweller-tvc": [
    { src: "/work/pc-jeweller-tvc/01.webp", width: 1920, height: 1080, alt: "Frame from PC Jeweller TVC, at 0:16" },
    { src: "/work/pc-jeweller-tvc/02.webp", width: 1920, height: 1080, alt: "Frame from PC Jeweller TVC, at 0:18" },
    { src: "/work/pc-jeweller-tvc/03.webp", width: 1920, height: 1080, alt: "Frame from PC Jeweller TVC, at 0:18" },
    { src: "/work/pc-jeweller-tvc/04.webp", width: 1920, height: 1080, alt: "Frame from PC Jeweller TVC, at 0:26" },
    { src: "/work/pc-jeweller-tvc/05.webp", width: 1920, height: 1080, alt: "Frame from PC Jeweller TVC, at 0:30" },
    { src: "/work/pc-jeweller-tvc/06.webp", width: 1920, height: 1080, alt: "Frame from PC Jeweller TVC, at 0:47" },
    { src: "/work/pc-jeweller-tvc/07.webp", width: 1920, height: 1080, alt: "Frame from PC Jeweller TVC, at 0:49" },
    { src: "/work/pc-jeweller-tvc/08.webp", width: 1920, height: 1080, alt: "Frame from PC Jeweller TVC, at 0:51" },
    { src: "/work/pc-jeweller-tvc/09.webp", width: 1920, height: 1080, alt: "Frame from PC Jeweller TVC, at 0:53" },
    { src: "/work/pc-jeweller-tvc/10.webp", width: 1920, height: 1080, alt: "Frame from PC Jeweller TVC, at 0:57" },
    { src: "/work/pc-jeweller-tvc/11.webp", width: 1920, height: 1080, alt: "Frame from PC Jeweller TVC, at 1:07" },
  ],
  "rock-it": [
    { src: "/work/rock-it/01.webp", width: 1920, height: 806, alt: "Frame from Rock.it, at 0:02" },
    { src: "/work/rock-it/02.webp", width: 1920, height: 806, alt: "Frame from Rock.it, at 0:19" },
    { src: "/work/rock-it/03.webp", width: 1920, height: 806, alt: "Frame from Rock.it, at 0:28" },
    { src: "/work/rock-it/04.webp", width: 1920, height: 806, alt: "Frame from Rock.it, at 0:53" },
    { src: "/work/rock-it/05.webp", width: 1920, height: 806, alt: "Frame from Rock.it, at 1:16" },
    { src: "/work/rock-it/06.webp", width: 1920, height: 806, alt: "Frame from Rock.it, at 1:32" },
  ],
  "changa": [
    { src: "/work/changa/01.jpg", width: 1920, height: 820, alt: "Two performers back to back in teal light, crowd behind" },
    { src: "/work/changa/02.jpg", width: 1920, height: 820, alt: "Rapper inside the orange neon tunnel" },
    { src: "/work/changa/03.jpg", width: 1920, height: 820, alt: "Woman on the gym machine in amber light" },
  ],
  "mercedes-benz-global-star": [
    { src: "/work/mercedes-benz-global-star/03.webp", width: 1920, height: 800, alt: "Frame from Mercedes-Benz Global Star, at 0:17" },
    { src: "/work/mercedes-benz-global-star/01.webp", width: 1920, height: 800, alt: "Frame from Mercedes-Benz Global Star, at 0:06" },
    { src: "/work/mercedes-benz-global-star/02.webp", width: 1920, height: 800, alt: "Frame from Mercedes-Benz Global Star, at 0:13" },
    { src: "/work/mercedes-benz-global-star/04.webp", width: 1920, height: 800, alt: "Frame from Mercedes-Benz Global Star, at 0:23" },
    { src: "/work/mercedes-benz-global-star/05.webp", width: 1920, height: 800, alt: "Frame from Mercedes-Benz Global Star, at 0:30" },
    { src: "/work/mercedes-benz-global-star/06.webp", width: 1920, height: 800, alt: "Frame from Mercedes-Benz Global Star, at 0:35" },
    { src: "/work/mercedes-benz-global-star/07.webp", width: 1920, height: 800, alt: "Frame from Mercedes-Benz Global Star, at 0:49" },
    { src: "/work/mercedes-benz-global-star/08.webp", width: 1920, height: 800, alt: "Frame from Mercedes-Benz Global Star, at 0:54" },
    { src: "/work/mercedes-benz-global-star/09.webp", width: 1920, height: 800, alt: "Frame from Mercedes-Benz Global Star, at 1:08" },
    { src: "/work/mercedes-benz-global-star/10.webp", width: 1920, height: 800, alt: "Frame from Mercedes-Benz Global Star, at 1:11" },
    { src: "/work/mercedes-benz-global-star/11.webp", width: 1920, height: 800, alt: "Frame from Mercedes-Benz Global Star, at 1:23" },
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
    { src: "/work/citta-moisturizing-baby-balm/01.webp", width: 1920, height: 992, alt: "Frame from CITTA Moisturizing Baby Balm, at 0:00" },
    { src: "/work/citta-moisturizing-baby-balm/02.webp", width: 1920, height: 992, alt: "Frame from CITTA Moisturizing Baby Balm, at 0:04" },
    { src: "/work/citta-moisturizing-baby-balm/03.webp", width: 1920, height: 992, alt: "Frame from CITTA Moisturizing Baby Balm, at 0:35" },
    { src: "/work/citta-moisturizing-baby-balm/04.webp", width: 1920, height: 992, alt: "Frame from CITTA Moisturizing Baby Balm, at 0:42" },
    { src: "/work/citta-moisturizing-baby-balm/05.webp", width: 1920, height: 992, alt: "Frame from CITTA Moisturizing Baby Balm, at 0:50" },
    { src: "/work/citta-moisturizing-baby-balm/06.webp", width: 1920, height: 992, alt: "Frame from CITTA Moisturizing Baby Balm, at 0:52" },
    { src: "/work/citta-moisturizing-baby-balm/07.webp", width: 1920, height: 1080, alt: "Frame from CITTA Moisturizing Baby Balm, at 0:57" },
  ],
  "zypp-electric": [
    { src: "/work/zypp-electric/01.webp", width: 1920, height: 808, alt: "Frame from Zypp Electric App, at 0:04" },
    { src: "/work/zypp-electric/02.webp", width: 1920, height: 808, alt: "Frame from Zypp Electric App, at 0:29" },
    { src: "/work/zypp-electric/03.webp", width: 1920, height: 808, alt: "Frame from Zypp Electric App, at 0:46" },
    { src: "/work/zypp-electric/04.webp", width: 1920, height: 808, alt: "Frame from Zypp Electric App, at 0:46" },
    { src: "/work/zypp-electric/05.webp", width: 1920, height: 808, alt: "Frame from Zypp Electric App, at 0:54" },
  ],
  "film-for-ace": [
    { src: "/work/film-for-ace/01.webp", width: 1920, height: 820, alt: "Frame from Film for Ace, at 0:12" },
    { src: "/work/film-for-ace/02.webp", width: 1920, height: 820, alt: "Frame from Film for Ace, at 0:32" },
    { src: "/work/film-for-ace/03.webp", width: 1920, height: 820, alt: "Frame from Film for Ace, at 0:38" },
    { src: "/work/film-for-ace/04.webp", width: 1920, height: 820, alt: "Frame from Film for Ace, at 0:49" },
    { src: "/work/film-for-ace/05.webp", width: 1920, height: 820, alt: "Frame from Film for Ace, at 0:49" },
    { src: "/work/film-for-ace/06.webp", width: 1920, height: 820, alt: "Frame from Film for Ace, at 0:56" },
  ],
  "jaldi-bidai": [
    { src: "/work/jaldi-bidai/01.webp", width: 1920, height: 1080, alt: "Frame from Jaldi Bidai, at 0:00" },
    { src: "/work/jaldi-bidai/02.webp", width: 1920, height: 1080, alt: "Frame from Jaldi Bidai, at 0:08" },
    { src: "/work/jaldi-bidai/03.webp", width: 1920, height: 1080, alt: "Frame from Jaldi Bidai, at 0:13" },
    { src: "/work/jaldi-bidai/04.webp", width: 1920, height: 1080, alt: "Frame from Jaldi Bidai, at 0:45" },
    { src: "/work/jaldi-bidai/05.webp", width: 1920, height: 1080, alt: "Frame from Jaldi Bidai, at 0:54" },
    { src: "/work/jaldi-bidai/06.webp", width: 1920, height: 1080, alt: "Frame from Jaldi Bidai, at 0:58" },
    { src: "/work/jaldi-bidai/07.webp", width: 1920, height: 1080, alt: "Frame from Jaldi Bidai, at 1:10" },
  ],
  "falaknama-02": [
    { src: "/work/falaknama-02/01.webp", width: 480, height: 848, alt: "Frame from Falaknama — Film 02, at 0:03" },
    { src: "/work/falaknama-02/02.webp", width: 480, height: 848, alt: "Frame from Falaknama — Film 02, at 0:08" },
    { src: "/work/falaknama-02/03.webp", width: 480, height: 848, alt: "Frame from Falaknama — Film 02, at 0:12" },
    { src: "/work/falaknama-02/04.webp", width: 480, height: 848, alt: "Frame from Falaknama — Film 02, at 0:12" },
    { src: "/work/falaknama-02/05.webp", width: 480, height: 848, alt: "Frame from Falaknama — Film 02, at 0:15" },
    { src: "/work/falaknama-02/06.webp", width: 480, height: 848, alt: "Frame from Falaknama — Film 02, at 0:18" },
    { src: "/work/falaknama-02/07.webp", width: 480, height: 848, alt: "Frame from Falaknama — Film 02, at 0:22" },
  ],
  "falaknama-03": [
    { src: "/work/falaknama-03/01.jpg", width: 480, height: 848, alt: "Wide of the green library wall, woman reading" },
    { src: "/work/falaknama-03/02.jpg", width: 480, height: 848, alt: "Close-up sipping coffee" },
    { src: "/work/falaknama-03/03.jpg", width: 480, height: 848, alt: "Woman reading in the armchair" },
  ],
  "zykaz-cafe": [
    { src: "/work/zykaz-cafe/04.webp", width: 1024, height: 768, alt: "Frame from Zykaz Cafe, at 0:26" },
    { src: "/work/zykaz-cafe/01.webp", width: 1024, height: 768, alt: "Frame from Zykaz Cafe, at 0:02" },
    { src: "/work/zykaz-cafe/02.webp", width: 1024, height: 768, alt: "Frame from Zykaz Cafe, at 0:12" },
    { src: "/work/zykaz-cafe/03.webp", width: 1024, height: 768, alt: "Frame from Zykaz Cafe, at 0:15" },
    { src: "/work/zykaz-cafe/05.webp", width: 1024, height: 768, alt: "Frame from Zykaz Cafe, at 0:32" },
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
