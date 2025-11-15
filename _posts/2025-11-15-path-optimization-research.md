---
layout: post
title: "Never Get Lost Again"
date: 2025-11-15
author: Patrick Shaw
---

## Never Get Lost Again

Do you ever wander the forest alone? Ever walk the streets while keeping your phone on silent? I believe wandering to be fundamental to human curiosity.

> "Once I know where I am, then the world becomes as narrow as a map. When I don't know, the world feels unlimited." — Liu Cixin, *The Dark Forest*

When I read fantasy stories I ponder how people functioned before GPS or the detailed maps you find within libraries. With this question in mind I began to think, "Where do I go when I can't see every detail of my surroundings?" and my research was born.

### The Problem

Developing the full question here: given a finite set of known $k^\star$ and unknown $k^\circ$ points of interest on a finite section of $\mathbb{R}^2$ space, the points are then connected by a geodesic line (Roads). Let a variable $\omega$ (walkspeed) describe the speed of travel on the plane; when your location is shared with the coordinates of the lines, set a new value for speed of travel $v$ (roadspeed). Describe a relation between $\omega$ and $v$ where $v$ is greater. Determine your location of origin $P$ and destination $Q$, with the information above determine the optimal heading angle $\theta$ when accounting for road jumps*.

**The conjecture I am forming:** there is an algebraic equation to describe the optimal angle of heading, with a defined number of $K^\star$ and $K^\circ$ POIs; or an unknown $P$, but only known POIs.

### My Approach

Beginning my approach to this problem, I asked math professors how they would start. I was specifically seeking an equation that would take input variables of $k^\star$ and $k^\circ$ POIs, $\omega$, and $v$; that could then be converted into the $\theta$ of optimal direction of heading. The first step I took to create experimental data was forming an algorithm that could draw rays from $P$ that then would describe the travel path with an output of time. By running the simulation code for every point coordinate on the finite plane as $P$ with rays to all other coordinates, without changing the POI coordinates; I could build a three dimensional map that marks time as the extra dimension. The vertical axis would then be time, creating a topological map where the steepest descent described the fastest path, converting the algorithm into a calculus problem.

Comparatively, I needed two maps per set of POIs to develop an understanding of how full knowledge and partial knowledge of all points would alter the $\theta$. By relating the differing levels of information and paths, I could narrow the error margin down for the limited knowledge pathing. Then by randomizing the POIs and comparing the three dimensional maps, the angle of maximal descent, within the frame of reference of $P$ and $Q$, could be approximated then compared with the initial conditions to form an equation.

### Reflections on the Journey

My journey through attempting mathematical research has been backed by many stories of computational simulations defining the data we begin with, only to compare with reality and rebuild and restructure. This topic was important to me as I enjoyed the brain teaser element, alongside my enjoyment of wandering cities until I got lost; I liked to challenge myself to find a path through any problem.

### Future Directions

To further expand on this research problem I will need to build a better analysis of the data that I have collected from simulations. Then to also learn more about probabilistic analysis for the alternate initial condition of an unknown origin. Broadening the scope of the research there are many more avenues that could be worked on, like:

- Path finding optimization computationally through the A* algorithm
- The newer deterministic $O(m \log^{2/3} n)$-time algorithm by Duan et al (2025)
- An increase in dimensions for the map terrain
- Curved roads
- Density of points generating faster roads
- A look into infinite dimensionality with infinite roads to see if the path integral is emergent
- Roads of infinite speeds for a more mathematical approach to finding limits of directionality

### The Deeper Question

Fundamentally, the question seems significant to others as it can help those who are lost; however, I suspect it's a red herring as human ingenuity tends to trump mathematical analysis in real world scenarios. Some examples are following streams, listening for cars, or finding elevation. Time is one of our most finite resources, but is it philosophically flawed to optimize every second for its greatest potential within reality?

---

**Road Jumps* is the strategy to leave a road in order to join another road to optimize for the total time even with the slower walk speed between paths.

<div style="text-align: right; font-style: italic; margin-top: 40px;">
Patrick Shaw<br>
2025
</div>
