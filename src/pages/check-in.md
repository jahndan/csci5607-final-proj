---
layout: "/src/layouts/MarkdownLayout.astro"
---

# CSCI 5607 final project check-in

I will be making a CPU-bound path tracer (no GPU acceleration). Since Project
3 for this class was to make a ray tracer, I will outline the distinction more
clearly below. Additionally, I will be working alone, since I also plan on
submitting this project for the Gopher Graphics demoscene competition: "fastest
ray tracer" category. I put the category name in quotes because the workshop
they held was centered around a tutorial for making a rudimentary path tracer
(rather than a ray tracer). As I mentioned wanting to do in Project 3, I also
plan on implementing a fixed point math library to compare against the floating
point implementation (I expect that usage of integer arithmetic will be a
sizeable speed up).

Side note: this will be written mostly from scratch because I will be using
`glm` for the vector math and Google's reference implementation of `webp` for
exporting images, and more importantly because I had some architectural choices
in the ray tracer code that I do not want to keep. (I'm planning ahead for using
an acceleration structure of some kind in this one.)

## Progress plan

December 5th:
- Basic path tracing working with spheres (floating point math)
  - Rudimentary BRDFs (Lambertian diffuse)
  - Ambient occlusion, reflection, refraction
  - Supersampling, depth of field
- Area lights

December 8th:
- Fixed point math library
  - Drop-in replacement for `glm` math types
  - Build-time config flag to use fixed/floating point math
- BVH or other acceleration structure
- Cornell box

December 12th:
- Visualization of intermediate results (increasing depth) and
  convergence (increasing samples)
- More interesting BRDFs (maybe BTDFs?) and better Monte Carlo techniques

## Expected result

First, let us establish what _ray casting_ is (typical figures omitted for
brevity). We assume that an image is to be created according to a perspective
projection of a 3D scene. That is, each pixel is processed similarly, by casting
a ray from the camera position towards the projection of the pixel location onto
the image plane. This ray will then intersect a number of objects (or none), and
the pixel corresponding to it will be colored based on the closest intersection
(or lack thereof). No further rays are cast, so at best this can crudely shade
objects with according to angles between tangent planes and light sources,
but failing to account for occlusion by other objects.

<figure>
  <img src="/temp.webp" />
  <caption>

> An image I created while scaffolding the code for this project, which uses
> only ray casting and colors the spheres based on their normals.

  </caption>
</figure>

Then, let us distinguish what a _ray tracer_ does in addition to ray casting.
Upon intersection, we will compute the mathematical reflection of the ray
according to the tangent plane of intersection (or "refraction" using Snell's
law, but in the end it's still a deterministic singular ray). These created
rays will be cast out from the location of intersection in the direction
reflected (or refracted) to see what they may have hit. We would still apply
the Phong lighting model (or something else that captures the effects of direct
illumination), but now we can get objects to cast shadows on each other, as
well as specular reflections and refractions (missing caustics).

<figure>
  <img src="/ShadowTest.png" />
  <caption>

> Sample image from my Project 3 ray tracer which shows the lamppost
> casting a shadow on the ground plane.

  </caption>
</figure>

Finally, we describe a _path tracer_, which essentially casts exponentially
more rays to better model the behavior of light in real life. Rather than just
casting the mathematically reflected ray, we consider all possible "reflected"
rays (weighted according to a probability distribution). In practice, analytic
integration over the hemisphere of directions outwards from a tangent plane
is not possible with arbitrary scenes, so we will be randomly sampling
the hemisphere according to the probability distribution. By introducing
stochasticism into the process, we will get potentially grainy images (maybe
somewhat desirable for aesthetic reasons) and can take a number of approaches
towards reducing said grain (the easiest is increasing the sample count to
converge towards the true average). More importantly, we will also capture the
effects of global illumination (diffuse reflections), ambient occlusion, and
caustics (from refractive surfaces).

> I don't yet have a rendering of the [Cornell box][] ready, but it showcases
> most of these things I'm talking about that distinguish path tracing as a
> technique from the more primitive ray tracing.

[Cornell box]: https://en.wikipedia.org/wiki/Cornell_box

I will try to capture some of the effects described in these blog posts:
- [Path Tracing – Getting Started With Diffuse and Emissive - Alan Wolfe](https://blog.demofox.org/2016/09/21/path-tracing-getting-started-with-diffuse-and-emissive/)
- [Raytracing Reflection, Refraction, Fresnel, Total Internal Reflection, and Beer’s Law - Alan Wolfe](https://blog.demofox.org/2017/01/09/raytracing-reflection-refraction-fresnel-total-internal-reflection-and-beers-law/)

And may attempt to use some of these as more sophisticated sampling techniques:
- [Interleaved Gradient Noise: A Different Kind of Low Discrepancy Sequence - Alan Wolfe](https://blog.demofox.org/2022/01/01/interleaved-gradient-noise-a-different-kind-of-low-discrepancy-sequence/)
- [The Unreasonable Effectiveness of Quasirandom Sequences - Martin Roberts](https://extremelearning.com.au/unreasonable-effectiveness-of-quasirandom-sequences/)
