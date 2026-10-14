# Hero asset credits

## Moon

Source: NASA, NASA-3D-Resources official repository.

Image: https://raw.githubusercontent.com/nasa/NASA-3D-Resources/11ebb4ee043715aefbba6aeec8a61746fad67fa7/Images%20and%20Textures/Moon/Moon.jpg

Repository statement: "Welcome to the 3D Resources github site. This is a growing collection of 3D models, textures, and images from inside NASA. "

The repository explicitly states: "These assets are free and without copyright."

Pinned repository commit: 11ebb4ee043715aefbba6aeec8a61746fad67fa7.

Original SHA-256: 1318334a5089fb186d39996f60677b5f5b42cde74158ceff97b3e2283bfd41d4

Local derivatives: moon-nasa.webp (1600 px), moon-nasa-mobile.webp (640 px). Resized and compressed; no generated replacement imagery. CSS grayscale and brightness affect presentation only. No NASA endorsement is implied.

Official usage-policy link supplied by NASA: https://www.nasa.gov/nasa-brand-center/images-and-media/ (not accessible from this environment).

## Poppins

Copyright 2020 The Poppins Project Authors (https://github.com/itfoundry/Poppins). SIL Open Font License 1.1; complete license bundled at /fonts/poppins/OFL.txt. Source: https://github.com/google/fonts/tree/main/ofl/poppins . Original Regular, Medium, SemiBold and Bold TTF files converted losslessly to WOFF; family metadata unchanged.

## Stars

Original static SVG point field generated for this prototype with deterministic seed 233. No third-party imagery.

## Lunar sphere maps (Stage 2.4)

Source declared by the distributor: NASA Scientific Visualization Studio, CGI Moon Kit — LROC color/albedo and LOLA elevation. Official reference: https://svs.gsfc.nasa.gov/4720/ . NASA imagery is declared public domain in the distributor's README; no additional Creative Commons license is claimed.

Actual download source: https://github.com/tysonfarrington-cmyk/lunar-estates-assets/tree/1eed1f486b0ce07797cce959aca6b16af9865663 . This community mirror resizes and encodes the NASA maps as WebP. Its provenance and public-domain statement are preserved verbatim in `/hero/lunar/SOURCE.md`.

The official NASA SVS page and general media-use page are blocked by this environment's network policy. These assets were downloaded from the pinned mirror, not directly from NASA; byte-for-byte equivalence to original NASA files was not independently checked. The 2:1 map layout, image content and matching elevation/color features were inspected. No code or design from the mirror is used.

Downloaded files (unchanged), SHA-256:

- moon-color-1k.webp: 1726ca119dc98892618e4ca8643f339ea38df7b3c2509cbf5559a9fbfd17fd51
- moon-color-2k.webp: 79c3f75a3ead4d4e39391f2ebb7acdc3d881283e6162becbb0d827b234891398
- moon-bump-1k.webp: 0a7bd8b7a8ef55e332778b51563957fd622125d6b30ca89ccb040fb3bd267ffb
- moon-bump-2k.webp: 5073bdb5003cff609c5b3f5d2c5a83ab696cc6c727b060e119a244cc4dd6e8f5

Credit: NASA / SVS, Lunar Reconnaissance Orbiter (LROC and LOLA); WebP distribution by the above community mirror. No NASA endorsement is implied. The existing NASA Moon photograph remains the independent static fallback.

## Static rendered fallback (Stage 2.4.1)

`moon-render-desktop.webp` (1600×1598) and `moon-render-mobile.webp` (640×639) are local raster derivatives of the approved `src/components/ui/lunarScene.js` renderer, not a new photograph. Generated in Chromium / SwiftShader with the existing 2k and 1k color/elevation maps respectively, the same orthographic camera, fixed orientation, light, material and grayscale presentation. Transparent PNG canvas captures were encoded as WebP quality 94, method 6, retaining alpha. No new third-party imagery or generated replacement imagery was used. Source-map credits and the mirror provenance limitation above apply equally to these rendered derivatives.

The NASA SVS reference https://svs.gsfc.nasa.gov/4720/ was checked again on 2026-10-14: the environment proxy rejected the CONNECT request with HTTP 403. Direct verification of the original NASA files remains unavailable; no independent verification is claimed. Original photo assets remain in the repository for traceability but are no longer the Hero's active fallback.


## Continuous editorial sky (Stage 4.7.2)

`space-stars.svg` (1920 × 2800, 1900 points, seed 47220) and `space-stars-mobile.svg` (600 × 2800, 850 points, seed 47221) are original procedural SVG point fields prepared for this portfolio. Uniform irregular points and soft Gaussian concentrations vary radius, opacity and neutral/cool-white color, with quieter areas near the text. No external imagery, nebula photograph, copied design, AI-generated image, or NASA texture is used for these star fields. Existing original star SVGs remain for traceability. The atmospheric tint and continuous black fade are CSS gradients, with no animation or particle engine. Moon assets and their provenance limitations above remain unchanged.

Stage 4.7.2.1 refines these same original procedural fields: increased upper-field density, varied radii (0.4–2.15 SVG units), and modestly brighter stars. Seeds and dimensions are unchanged; no third-party resources added.
