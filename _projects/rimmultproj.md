---
layout: project
title: "rimmultproj: RimWorld Multiplayer"
permalink: /projects/rimmultproj/
status: design
summary: "Designing a RimWorld multiplayer mod with real interactions (raids, trades, joint defense), no desyncs, 100+ players per server, and play while friends are offline."
started: 2026-01-01
updated: 2026-11-09
next_step: "Snapshot proof of concept: save and restore a colony byte-for-byte on two machines"
checklist:
  - { text: "Architecture document", done: true }
  - { text: "12-month project plan", done: true }
  - { text: "Starter code: snapshots, interaction zones, world server", done: true }
  - { text: "Dev environment (.NET, Docker, RimWorld 1.7)", done: false }
  - { text: "Snapshot determinism proof of concept across two machines", done: false }
  - { text: "Minimal world server + client mod that uploads a snapshot", done: false }
  - { text: "Publish the repo", done: false }
log:
  - { date: "Jan 2026", text: "Architecture, roadmap and starter code designed." }
---

## The problem

RimWorld multiplayer today comes in two shapes. **Lockstep** (Zetrith's Multiplayer mod) runs every player's game in sync. Interactions are real, but everyone has to be online, and one desync breaks the session. **Async** (RimWorld Together) lets everyone play their own colony on their own schedule, but the interactions are thin.

I want both: real combat, trading and co-op, no desyncs, 100+ players on a server, and being able to play while friends are offline.

## Core idea: contextual sync

Each colony normally runs on its own player's machine and sends a small state update to the server every 60 seconds. When players interact (a raid, a trade, a joint defense), the server spins up a temporary synchronized **interaction zone** on a server worker. Both players control their pawns in real time inside it, and the result is written back to both colonies.

Most of the time you're playing single-player. You're only in lockstep while it matters.

## Three tiers

1. **World server:** accounts, world state, markets, matchmaking, load balancing.
2. **Simulation workers:** host interaction zones, and colonies whose owners are offline (offline AI defenders).
3. **Clients:** the RimWorld mod, each simulating its own colony.

## The critical piece

**Deterministic snapshots.** A colony has to save and restore *byte-for-byte identically* on any machine, including RNG state, verified with checksums. If that fails, the design fails. So it's the first thing to prove.

## Stack

C# throughout: an ASP.NET Core server and a Harmony-patched client mod. Also PostgreSQL, Redis, RabbitMQ, MessagePack and Docker.

## Roadmap

1. **Foundation** (3 months): world server, snapshot system, client mod. The goal is two players sharing snapshots.
2. **Interactions** (3 months): trading, raids, offline AI defenders.
3. **Scaling** (3 months): multiple workers, load balancing, migration. The goal is 50+ players.
4. **Polish** (3 months): world events, social features, public beta.
