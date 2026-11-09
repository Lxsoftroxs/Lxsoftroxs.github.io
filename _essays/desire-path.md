---
layout: post
title: "Desire Path"
date: 2026-11-09
permalink: /essays/desire-path/
summary: "A museum you destroy by walking through it: a dead golf course, eighteen water tanks, and the question of what an acre owes the world."
project: desire-path
---
A museum you destroy by walking through it.

This started as a 300-word exhibition proposal for HAVC 40 (the final draft came in at 312), with a sourced data sheet behind it. I liked it too much to leave it in a class folder.

## The site

Take a decommissioned golf course in a water-stressed city: Phoenix, Palm Springs, the Central Valley. Keep the turf and take away everything else. There are no walls and no marked paths.

In the clubhouse you pick a movement artifact to wear: a tumpline basket, a hand cart, spiked boots, a weighted pack. Then you walk wherever you want. Every visitor tramples their own route across the grass, and the routes everyone shares wear into desire paths, the dirt lines people cut when the designed route isn't the one they want. At the last hole you scatter native wildflower seed into the ground you broke. Over time the course stops being a course and turns into prairie.

The exhibit is the destruction. You can't see it without taking part in it.

## The eighteen holes

The holes are ordered by water intensity. At each one a transparent tank holds **one acre's yearly water use** for a different kind of land, built as a cube so you can stand next to it.

<figure class="post-figure">
<svg viewBox="0 0 520 215" role="img" aria-labelledby="dp-tanks-title" style="width:100%;max-width:560px;height:auto">
  <title id="dp-tanks-title">Tank cubes drawn to scale: data center 136 ft, golf turf 53 ft, irrigated cropland 40 ft, clover 28 ft, native prairie and bare dirt have no tank.</title>
  <g fill="rgba(102,221,255,0.18)" stroke="#6df" stroke-width="1.5">
    <rect x="10" y="17" width="163" height="163"/>
    <rect x="193" y="116" width="64" height="64"/>
    <rect x="277" y="132" width="48" height="48"/>
    <rect x="345" y="146" width="34" height="34"/>
  </g>
  <g stroke="#6df" stroke-width="3">
    <line x1="399" y1="180" x2="445" y2="180"/>
    <line x1="463" y1="180" x2="509" y2="180" stroke-dasharray="4 4"/>
  </g>
  <g fill="#ddd" font-family="Courier New, monospace" font-size="11" text-anchor="middle">
    <text x="91" y="12">136 ft</text>
    <text x="225" y="110">53 ft</text>
    <text x="301" y="126">40 ft</text>
    <text x="362" y="140">28 ft</text>
    <text x="422" y="172">0</text>
    <text x="486" y="172">0</text>
  </g>
  <g fill="#999" font-family="Courier New, monospace" font-size="10" text-anchor="middle">
    <text x="91" y="197">data center</text>
    <text x="225" y="197">golf turf</text>
    <text x="301" y="197">cropland</text>
    <text x="362" y="197">clover</text>
    <text x="422" y="197">prairie</text>
    <text x="486" y="197">bare dirt</text>
  </g>
</svg>
<figcaption>Tank cubes drawn to scale, side length in feet, for one acre's water use per year.</figcaption>
</figure>

| Land use (per acre, per year) | Tank |
|---|---|
| Data center | 136-ft cube, with screens showing the precision-ag water it saves |
| Golf turf (about 1.0–1.3 million gallons) | 53-ft cube |
| Irrigated cropland | 40-ft cube, beside a table of the grain it grows |
| Clover | 28-ft cube |
| Native prairie | An empty glass platform |
| Bare dirt | A platform ringed by erosion gullies |

The prairie gets an empty platform because it doesn't need anything from us. The bare dirt gets gullies because it has nothing to hold the water when it comes.

## The pillars

Outside the clubhouse stand five stone pillars, each scaled to one national sector's yearly water use and engraved with what that water produces. Irrigated farmland is the tallest at 106 ft. All US data centers combined come to 7 inches.

Beside them stands a 17-ft glass **ghost pillar** for the roughly 4.3 trillion gallons a year that precision agriculture saves. Farm water intensity has fallen 25–40% since 1979. I framed data centers as producers of knowledge, not villains.

## The question

The exhibition is organized by ecological succession: turf to trampled ground to prairie. The question it asks is **what an acre owes the world.** Food, knowledge, a nice afternoon, or nothing at all, left to grow back.

The audience is anyone who has walked past a sprinkler running on an empty fairway during a drought.

## The math

Every tank and pillar comes from two conversions:

```
cube side (ft)     = ∛(gallons × 0.1337)        # 0.1337 ft³ per gallon
pillar height (ft) = gallons ÷ 250,000,000,000
```

Sources: USDA NASS, USGA and the GCSAA water use survey, Lawrence Berkeley National Lab (data centers), and peer-reviewed agricultural research.

## Bigger

There's a larger version of this in my head: *Desire Paths: A Museum of Human Movement*. It would be a full exhibit about how designed landscapes steer movement, water, labor and ecological restoration, with sections, case studies and visitor experiences. Maybe one day.
