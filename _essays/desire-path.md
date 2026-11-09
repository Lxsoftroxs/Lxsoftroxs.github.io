---
layout: post
title: "Desire Path"
date: 2026-11-09
permalink: /essays/desire-path/
summary: "A museum you destroy by walking through it: a dead golf course, eighteen water tanks, and the question of what an acre owes the world."
project: desire-path
---
A museum you destroy by walking through it.

This started as an exhibition proposal for HAVC 40, with a sourced data sheet behind it. I liked it too much to leave it in a class folder.

## The site

Take a decommissioned golf course in a water-stressed city: Phoenix, Palm Springs, the Central Valley. Keep the turf and take away everything else. There are no walls and no marked paths.

In the clubhouse you pick a movement artifact to wear: a tumpline basket, a hand cart, spiked boots, a weighted pack. Then you walk wherever you want. Every visitor tramples their own route across the grass, and the routes everyone shares wear into desire paths, the dirt lines people cut when the designed route isn't the one they want. At the last hole you scatter native wildflower seed into the ground you broke. Over time the course stops being a course and turns into prairie.

The exhibit is the destruction. You can't see it without taking part in it.

## The eighteen holes

The holes are ordered by water intensity. At each one a transparent tank holds **a year of irrigation for one Arizona acre** of a different kind of land, built as a cube so you can stand next to it. The data center is the exception: there's no honest per-acre number for one, so its tank holds what one large facility can use in a single day.

<figure class="post-figure">
<svg viewBox="0 0 550 215" role="img" aria-labelledby="dp-tanks-title" style="width:100%;max-width:580px;height:auto">
  <title id="dp-tanks-title">Tank cubes drawn to scale: data center (one day) 87 ft, golf turf 60 ft, irrigated cropland 57 ft, clover 28 ft; native prairie and bare dirt have no tank.</title>
  <g fill="rgba(102,221,255,0.18)" stroke="#6df" stroke-width="1.5">
    <rect x="10" y="41" width="139" height="139"/>
    <rect x="167" y="84" width="96" height="96"/>
    <rect x="281" y="89" width="91" height="91"/>
    <rect x="390" y="135" width="45" height="45"/>
  </g>
  <g stroke="#6df" stroke-width="3">
    <line x1="453" y1="180" x2="490" y2="180"/>
    <line x1="500" y1="180" x2="537" y2="180" stroke-dasharray="4 4"/>
  </g>
  <g fill="#ddd" font-family="Courier New, monospace" font-size="11" text-anchor="middle">
    <text x="80" y="35">87 ft</text>
    <text x="215" y="78">60 ft</text>
    <text x="327" y="83">57 ft</text>
    <text x="413" y="129">28 ft</text>
    <text x="472" y="172">0</text>
    <text x="519" y="172">0</text>
  </g>
  <g fill="#999" font-family="Courier New, monospace" font-size="10" text-anchor="middle">
    <text x="80" y="197">data center</text>
    <text x="80" y="209">(1 day)</text>
    <text x="215" y="197">golf turf</text>
    <text x="327" y="197">cropland</text>
    <text x="413" y="197">clover</text>
    <text x="472" y="197">prairie</text>
    <text x="519" y="197">dirt</text>
  </g>
</svg>
<figcaption>Tank cubes drawn to scale, side length in feet. Land tanks hold one Arizona acre's water for a year; the data center tank holds one large facility's water for one day.</figcaption>
</figure>

| Exhibit | Water | Tank |
|---|---|---|
| Large data center, one day | up to 5 million gallons | 87-ft cube, with screens showing the precision-ag water it saves |
| Desert golf turf, one acre-year | 4.5–5.2 acre-feet (about 1.6 million gallons) | 60-ft cube |
| Arizona irrigated cropland, one acre-year | 4.3 acre-feet (about 1.4 million gallons) | 57-ft cube, beside a table of the grain it grows |
| Clover, arid climate | up to 0.5 acre-feet (my estimate) | 28-ft cube |
| Native prairie | no irrigation once established | An empty glass platform |
| Bare dirt | nothing | A platform ringed by erosion gullies |

In the desert, a fairway drinks about as much as a field of crops. The two cubes stand nearly the same height, and only one of them comes with a table of food.

The prairie gets an empty platform because it doesn't need anything from us. The bare dirt gets gullies because it has nothing to hold the water when it comes.

## The pillars

Outside the clubhouse stand four stone pillars, each scaled to one national sector's yearly water use and engraved with what that water produces.

| Pillar | Water per year | Height |
|---|---|---|
| Irrigated farmland | 81 million acre-feet (26.4 trillion gallons) | 106 ft |
| Beef (irrigation and drinking water) | about 7.4 trillion gallons | 30 ft |
| Golf | 1.68 million acre-feet (about 550 billion gallons) | 26 in |
| All US data centers, including the water used to make their power | about 228 billion gallons | 11 in |

Beef's water is mostly irrigation for feed crops, so part of it is already counted in the farmland pillar. The data center pillar counts power plants on purpose; their on-site cooling water alone would come to under an inch.

Beside them stands a 17-ft glass **ghost pillar**. Since 1979, the average irrigated acre in the US has gone from more than 2 acre-feet a year to about 1.5. Across 53 million acres that is roughly 8.6 trillion gallons a year farms no longer apply. I halved it to 4.3 trillion, because not all of that drop is down to computing, and gave the rest of the credit to precision agriculture. I framed data centers as producers of knowledge, not villains.

## The question

The exhibition is organized by ecological succession: turf to trampled ground to prairie. The question it asks is **what an acre owes the world.** Food, knowledge, a nice afternoon, or nothing at all, left to grow back.

The audience is anyone who has walked past a sprinkler running on an empty fairway during a drought.

## The math

Every tank and pillar comes from two conversions:

```
cube side (ft)     = ∛(gallons × 0.1337)        # 0.1337 ft³ per gallon
pillar height (ft) = gallons ÷ 249,000,000,000  # farmland = 106 ft
1 acre-foot        = 325,851 gallons
```

### Sources

- Desert golf turf: University of Arizona Water Resources Research Center, [Golf Course Water Use](https://wrrc.arizona.edu/sites/wrrc.arizona.edu/files/documents/SS-Golf-Course-Water-Use-4-19-23.pdf) (2023).
- Cropland and farmland: USDA NASS, [2023 Irrigation and Water Management Survey](https://data-origin.nass.usda.gov/Newsroom/printable/2024/10-31-2024.pdf) and [state highlights](https://data-origin.nass.usda.gov/Publications/Highlights/2024/Census22_HL_Irrigation_4.pdf).
- Irrigation trend since 1979: USDA ERS, [Irrigation & Water Use](https://www.ers.usda.gov/topics/farm-practices-management/irrigation-water-use).
- Golf nationally: GCSAA, [Golf Course Environmental Profile water survey](https://www.gcsaa.org/docs/default-source/environment/phase-3-water-survey-full-report.pdf) (2020 data).
- Beef: "How advances in animal efficiency and management have affected beef cattle's water intensity in the United States: 1991 compared to 2019" ([PubMed](https://pubmed.ncbi.nlm.nih.gov/36063042/), 2022): 275 gallons of blue water per pound of boneless beef.
- Data centers: Lawrence Berkeley National Lab, *2024 United States Data Center Energy Usage Report* (17.4 billion gallons direct, 2023), and EESI, [Data Centers and Water Consumption](https://www.eesi.org/articles/view/data-centers-and-water-consumption) (power-generation water; up to 5 million gallons a day for the largest sites).
- Clover is my estimate: the [USDA plant guide](https://plants.usda.gov) calls white clover drought-tolerant but gives no irrigation figure.

## Bigger

There's a larger version of this in my head: *Desire Paths: A Museum of Human Movement*. It would be a full exhibit about how designed landscapes steer movement, water, labor and ecological restoration, with sections, case studies and visitor experiences. Maybe one day.
