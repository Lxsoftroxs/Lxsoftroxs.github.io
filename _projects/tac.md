---
layout: project
title: "Tourbillon à Cardan (TAC)"
permalink: /projects/tac/
status: design
summary: "A triple-axis tourbillon in a gimballed enclosure with two modes: FLOAT holds its orientation however the case moves, and LEVEL aligns it with gravity on demand."
updated: 2026-11-09
next: "A way to disengage the transmission in FLOAT, then a printed gimbal demonstrator"
checklist:
  - { text: "Gimbal layouts, gear transmission, differential gearing explored in CAD", done: true }
  - { text: "TAC-2 smaller redesign, checked for watertight meshes and interference", done: true }
  - { text: "Simplified disturbance simulation", done: true }
  - { text: "Disengage the transmission during FLOAT", done: false }
  - { text: "Separately switchable leveling mechanism", done: false }
  - { text: "Printed gimbal demonstrator with a dummy payload", done: false }
  - { text: "Working tourbillon in the proven suspension", done: false }
---

## The idea

A tourbillon spins the escapement to average out gravity's pull on a watch movement. TAC puts that inside a gimbal with two modes:

- **FLOAT:** the inner assembly keeps its orientation no matter how the case moves.
- **LEVEL:** it aligns itself with gravity when asked.

## Done so far

I went through gimbal layouts, gear transmission, differential gearing, bearing placement and balancing over several CAD and simulation iterations.

The current version, **TAC-2**, is a smaller redesign: 32 part instances, 6 bearings and 29 bolt stacks. 18 meshes were checked watertight and 25 configurations were checked for interference.

| Version | Printed mass | Est. parts cost |
|---|---|---|
| TAC-1 | not recorded | $450–1,100 (over budget) |
| TAC-2 | 0.581 kg | $50–117 |

In a simplified disturbance sim, a **49.6° case rotation produced only 0.14° of inner-plane tilt**.

## Open problems

- A modeled ring deflection of **1.77 mm**.
- Gravity torque up to **34 mN·m** against a 2 mN·m test drive.
- The transmission coupling fights FLOAT isolation. In FLOAT, the drive connection drags the inner plane along with the case.

## Plan

Do it in stages: the math, then a dynamics sim, then a physical demonstrator, then miniaturization. The demonstrator is a printed gimbal with a dummy payload, to measure drift, friction, torque and leveling before any real tourbillon goes in. Later on, two synchronized TAC clocks.

*CAD renders and sim GIFs coming.*
