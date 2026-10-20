# Task: pull three stills from every Freaky Mack film

You're working on Utkarsh's Mac. The Freaky Mack Studios website (freakymack.com, a Next.js site) shows **three still frames for every film** on its Work page, its project pages and the homepage. Your job is to take those frames from the film files and hand back one tidy folder.

**The one rule that matters most: keep each still at the film's own resolution.** No scaling, no cropping, no "web size". A 4K film gives 4K stills, a 1080p film gives 1080p stills, and a 480p phone clip gives 480p stills. The site team makes any smaller copies later.

---

## 1. Where things are

- **Film library:** `/Users/utkarshsingh/Desktop/FreakyMack-Website-Content/`. The table in section 6 gives every film's path relative to this folder.
- **Higher-quality masters:** Utkarsh may have newer or higher-quality versions of some films (for example the Fabindia, Voting Campaign, Sexual Harassment and Falaknama clips). Ask him whether there's a second folder before you start. When a film exists twice, **use the version with the highest resolution and bitrate**, and say which one you used in the manifest.
- **Output:** create `~/Desktop/FreakyMack-Stills/`. Put nothing back into the film library.

## 2. Tools

Use `ffmpeg` and `ffprobe` (`brew install ffmpeg` if missing). Check with `ffmpeg -version`.

## 3. How to choose the frames

For each film:

1. **Read the file first:** `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,sample_aspect_ratio,pix_fmt,color_transfer,field_order:stream_side_data=rotation -show_entries format=duration -of json "<file>"`.
2. **Pull candidates:** take **24 frames evenly spread between 6% and 94% of the running time**. This skips the opening logos and the end cards. Save them in `_candidates/NN-slug/` at full resolution:
   `ffmpeg -v error -ss <seconds> -i "<file>" -map 0:v:0 -frames:v 1 -q:v 2 "_candidates/NN-slug/c-<seconds>.jpg"`
3. **Look at them.** Build a small contact sheet (for your eyes only, not for output), for example `ffmpeg -pattern_type glob -i '_candidates/NN-slug/*.jpg' -vf "scale=480:-1,tile=6x4" -frames:v 1 sheet.jpg`. Open it and pick **three frames**:
   - **01, the hero:** the strongest, most cinematic wide frame. It's used largest, so it has to hold up at full screen.
   - **02 and 03:** two more frames that show different moments, such as a close-up and another setup or location. Don't pick three near-identical shots.
   - **Avoid frames that are:**
     - blurred by motion or mid-transition (dissolves and whip pans);
     - black, faded or flash frames;
     - caught on a blink or an awkward mid-word face;
     - mostly on-screen text, logos, subtitles, end cards or a price card;
     - a split screen.
   - If none of the 24 candidates is good enough for a slot, pull more candidates around the best moment (±2 s) and choose again.
4. **Copy the three picks** to `stills/NN-slug/01.jpg`, `02.jpg` and `03.jpg`. They're already at full resolution, so don't re-encode them.

## 4. Getting the picture right, still at full resolution

Check each of these before you extract. None of them changes the resolution.

- **Rotation:** phone clips (`.MOV`, and the vertical films marked 9:16) carry a rotation flag. ffmpeg applies it automatically. Check that the vertical films really come out **portrait**.
- **HDR:** if `color_transfer` is `arib-std-b67` (HLG) or `smpte2084` (PQ), plain extraction looks grey and washed out. Tone-map it, keeping the size:
  `-vf "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p"`
  If ffmpeg says `zscale` doesn't exist, your build lacks zimg. Run `brew install homebrew-ffmpeg/ffmpeg/ffmpeg`, or tell Utkarsh which films are HDR.
- **Interlacing:** if `field_order` is not `progressive` (or you can see comb lines), add `-vf yadif`.
- **Non-square pixels:** if `sample_aspect_ratio` isn't `1:1` (or N/A), the stored size isn't the display size. Use `-vf "scale=iw*sar:ih,setsar=1"` so the still has the shape the film is shown in. This is the only case where the pixel size may change. Note it in the manifest.
- **Letterboxing:** if a film has black bars burnt into the frame (Rock.it is 2.39:1, Sexual Harassment at Workplace is 2.35:1), **keep them**. Don't crop. Note it in the manifest.
- **JPEG quality:** use `-q:v 2` (visually lossless). Don't use PNG; it's 5–10× larger for no visible gain.

## 5. What to hand back

```
~/Desktop/FreakyMack-Stills/
  stills/
    01-mcdonalds-chicken-mcwings/01.jpg, 02.jpg, 03.jpg
    02-mcdonalds-veg-surprise/…
    …
    41-tlp-teaser/…
  manifest.json
  contact-sheets/NN-slug.jpg   ← the three picks side by side, small, for a quick review
  _candidates/                 ← keep for now; Utkarsh may want to swap a pick
```

For each film, `manifest.json` lists `number`, `slug`, `title`, `source` (the file you used), `width`, `height`, and `stills` (file, timecode `HH:MM:SS.mmm` and a few words on what's in the frame). It also lists `notes`, such as "HDR tone-mapped", "letterboxed 2.39:1", "used the higher-quality master from …" or "low-res source (406p)".

**Finish with a short report:**
- any film you couldn't find or open;
- any film where you couldn't get three good frames;
- the resolution of every film, so the low-resolution ones stand out;
- every film where you had to use a fix from section 4.

**Don't upload anything.** Utkarsh will decide whether the stills go to the S3 bucket (`freaky-media-website-d621b1`, served through CloudFront) or into the website repo.

If you find a film that isn't in the table (for example **Kara Feel**, which the studio wants on the homepage), extract it too as `42-kara-feel` and flag it in the report.

## 6. The films (website order, numbered as on the site)

`NN` is the folder number and `slug` is the folder name: `stills/NN-slug/`. "Frame" is the shape the film is shown in on the site.

| # | slug | Title | Length | Frame | File (relative to the film library) |
|---|---|---|---|---|---|
| 01 | `mcdonalds-chicken-mcwings` | McDonald’s Chicken McWings | 0:22 | 16:9 | `Ad. Films/McDonalds_s Chicken McWings I Director Izaan Khan I Freaky Mack Production - Freaky Mack (1080p, h264).mp4` |
| 02 | `mcdonalds-veg-surprise` | McDonald’s Veg Surprise | 0:30 | 16:9 | `Ad. Films/McDonald_s India N&E I Veg Surprise is back! - McDonaldsinIndia (1080p, h264).mp4` |
| 03 | `pc-jeweller-tvc` | PC Jeweller TVC | 1:14 | 16:9 | `Ad. Films/Ad. PC Jeweller TVC 2017 featuring Akshay Kumar & Twinkle Khanna - PCJeweller (1080p, h264).mp4` |
| 04 | `ptron` | pTron | 1:00 | 16:9 | `Ad. Films/p tron (aparshakti)_ FINAL FULL VIDEO.MP4` |
| 05 | `rock-it` | Rock.it | 1:44 | 2.39:1 | `Ad. Films/Rock.it  I  Directed by Izaan Khan  I  Freaky Mack Productions - Freaky Mack (1080p, h264).mp4` |
| 06 | `changa` | Changa | 3:52 | 16:9 | `Music Videos/Changa (Official Video) Aghor x IKKA  Ashock  Inflict  Latest HipHop Song  Big Bang Music - Big Bang Music (1080p, h264).mp4` |
| 07 | `mercedes-benz-global-star` | Mercedes-Benz Global Star | 1:35 | 16:9 | `Ad. Films/Mercedes-Benz Global Star  I  Directed by Izaan Khan - Freaky Mack (1080p, h264).mp4` |
| 08 | `india-fashion-awards` | India Fashion Awards | 3:45 | 16:9 | `Event Films/India Fashion Awards I Freaky Mack Productions - Freaky Mack (1080p, h264).mp4` |
| 09 | `albela` | Albela | 2:56 | 16:9 | `Fashion Films/Albela_Final.m4v` |
| 10 | `toifa-aftermovie` | TOIFA Aftermovie | 2:02 | 16:9 | `Event Films/TOIFA_Aftermovie.mov` |
| 11 | `the-midnight-hour` | The Midnight Hour | 3:11 | 16:9 | `Short Films/The Midnight Hour.mp4` |
| 12 | `dbs-lifestyle` | DBS Lifestyle | 4:08 | 16:9 | `Corporate Videos/DBS Lifestyle  I  Corporate Film 2023  I  Freaky Mack Films - Freaky Mack (1080p, h264).mp4` |
| 13 | `rudraprayag` | Rudraprayag | 3:47 | 16:9 | `Documentaries/Renew_Rudraprayag.mov` |
| 14 | `kashi` | Kashi | 4:29 | 16:9 | `Short Films/Kashi_ColorGrade.m4v` |
| 15 | `pkcc` | PKCC | 2:27 | 16:9 | `Govt. Ads/PKCC FINAL_1080p.mp4` |
| 16 | `citta-moisturizing-baby-balm` | CITTA Moisturizing Baby Balm | 1:00 | 16:9 | `Ad. Films/CITTA Moisturizing Baby Balm  I  Directed by Izaan Khan  I  TV Commercial - Freaky Mack (1080p, h264).mp4` |
| 17 | `zypp-electric` | Zypp Electric App | 0:58 | 16:9 | `Ad. Films/Zypp Electric App  I  Directed by Izaan Khan  I  Freaky Mack Production - Freaky Mack (1080p, h264).mp4` |
| 18 | `film-for-ace` | Film for Ace | 1:11 | 16:9 | `Ad. Films/Film for Ace.mp4` |
| 19 | `jaldi-bidai` | Jaldi Bidai | 1:18 | 16:9 | `Ad. Films/Jaldi Bidai_Film.mov.mp4` |
| 20 | `falaknama` | Falaknama — Film 01 | 0:39 | 9:16 | `Ad. Films/Falaknama_Couple-esv2-90p-bg-0p.MOV` |
| 21 | `falaknama-02` | Falaknama — Film 02 | 0:30 | 9:16 | `Ad. Films/VIDEO-2026-02-26-21-26-33 copy.mp4` |
| 22 | `falaknama-03` | Falaknama — Film 03 | 0:23 | 9:16 | `Ad. Films/VIDEO-2026-02-26-21-26-33.mp4` |
| 23 | `zykaz-cafe` | Zykaz Cafe | 0:35 | 4:3 | `Ad. Films/Zykaz_Cafe_Square.mov.mp4` |
| 24 | `zykaz-interview` | Zykaz Interview | 0:32 | 16:9 | `Ad. Films/Zykaz_Interview_FinalCut.mov` |
| 25 | `bharatbenz-dhingra-trucking` | BharatBenz × Dhingra Trucking | 7:42 | 16:9 | `Corporate Videos/Bharat Benz   Dhingra Trucking - DHINGRA TRUCKING (1080p, h264).mp4` |
| 26 | `soanbhadra` | Soanbhadra | 9:45 | 16:9 | `Documentaries/DA_Soanbhadra.mp4` |
| 27 | `bombay-times-fashion-week` | Bombay Times Fashion Week — Green Room | 3:13 | 16:9 | `Event Films/Bombay Times Fashion Week  I  March 2020  I  Green Room  I  Film by Freaky Mack_720p.mp4` |
| 28 | `sawe-international-excellence-awards` | SAWE International Excellence Awards | 1:24 | 16:9 | `Event Films/SAWE International Excellence Awards  I  Dubai  I  Creative Partner - Freaky Mack.mp4` |
| 29 | `noughtone-show` | NoughtOne Show | 0:54 | 9:16 | `Event Films/NoughtOne Show.mp4` |
| 30 | `pc-jeweller-sonalika-sahay` | PC Jeweller × Sonalika Sahay | 0:46 | 16:9 | `Fashion Films/PC Jeweller  I  Sonalika Sahay  I  Freaky Mack - Advertising Agency - Freaky Mack (1080p, h264) (1).mp4` |
| 31 | `noughtone` | NoughtOne | 1:21 | 16:9 | `Fashion Films/NoughtOne.mp4` |
| 32 | `harshita-gaur` | Harshita Gaur | 0:52 | 9:16 | `Fashion Films/Film Harshita Gaur.mp4` |
| 33 | `fabindia-01` | Fabindia — Film 01 | 1:00 | 16:9 | `Fashion Films/Fabindia.mp4` |
| 34 | `fabindia-02` | Fabindia — Film 02 | 0:58 | 16:9 | `Fashion Films/Fabindia 2.mp4` |
| 35 | `sex-sorted` | Sex Sorted | 2:32 | 16:9 | `Govt. Ads/SEX SORTED whats app file_1080p.mp4` |
| 36 | `sexual-harassment-haryana` | Sexual Harassment at Workplace | 2:49 | 2.35:1 | `Govt. Ads/Saxual Harrasment for Haryana Govt.mov` |
| 37 | `voting-campaign` | Voting Campaign | 1:41 | 16:9 | `Govt. Ads/Voting Campaign - Freaky Mack (480p, h264).mp4` |
| 38 | `happy-republic-day` | Happy Republic Day | 2:19 | 16:9 | `Short Films/Happy Republic Day  I  Directed by Izaan Khan  I  Freaky Mack Productions - Freaky Mack (1080p, h264).mp4` |
| 39 | `nayi-soch-wali-azadi` | Nayi Soch Wali Azadi | 3:58 | 4:3 | `Short Films/Nayi Soch Wali Azadi_Final Cut.mp4` |
| 40 | `s-and-s-trailer` | Shadows & Spark — Trailer | 1:00 | 16:9 | `Short Films/S&S_Trailer.mov` |
| 41 | `tlp-teaser` | The Last Presence — Teaser | 1:26 | 16:9 | `Short Films/TLP_Teaser_Final.mp4` |

Notes on the list:
- **Falaknama 02 and 03** are the two `VIDEO-2026-02-26-21-26-33` clips. `… copy.mp4` is Film 02 (0:30) and the one without "copy" is Film 03 (0:23).
- **Shadows & Spark** is `S&S_Trailer.mov` and **The Last Presence** is `TLP_Teaser_Final.mp4`.
- A few films are small (362p–480p phone exports). Still extract them at their own size and flag them in the report.
