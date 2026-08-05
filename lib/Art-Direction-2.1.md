---
name: Art Direction 2.1
description: Generate professional AI image prompts with a unified visual aesthetic — clinical high-fashion editorial in the spirit of SCHÖN Magazine and 032C, shot on a Canon EOS 5D Mark III or Hasselblad digital medium format camera, edgy editorial 2026. Use this skill whenever you need image prompts for AI generation tools (Midjourney, Flux, Stable Diffusion, ComfyUI, etc.). This skill ensures all generated prompts follow a cohesive visual language with signature art direction that produces editorial-quality results.
---

# Art Direction 2.1 — Professional Prompt Generation System

This skill generates AI image prompts that follow a unified visual language: a clinical, high-fashion editorial aesthetic rooted in sharp digital photography, edgy 2026 fashion sensibility, and deliberate art direction.

Every prompt this skill produces should feel like it was briefed by a creative director putting together a spread for **SCHÖN Magazine** or **032C** — precise, austere, sculptural — not by someone scrolling Pinterest for a vintage mood board.

---

## 1 · The Aesthetic DNA

This visual language sits at the intersection of these qualities:

### Core Look
- **Sharp digital clarity** — the image should read as crisp, high-resolution, technically pristine. No film grain, no soft haze, no vintage softness.
- **Bold graphic color or stark black-and-white** — either punchy, saturated color blocking (blood red, acid green, cobalt against black or white) or true high-contrast monochrome. Never muted, faded, or pastel-washed.
- **Sculptural precision** — the subject is carved by light and composition, not softened by it. Every frame reads as deliberately engineered.
- **Hyper-detailed texture rendering** — skin, fabric weave, and material finish rendered in sharp, clinical detail. Texture is real, but the overall register is polished and controlled rather than "caught off guard."

### Lighting Philosophy
- **Hard, directional studio light** — a single strobe, gridded softbox, or bare flash carving sharp shadow edges across the subject.
- **Chiaroscuro as structure** — light and dark divide the frame geometrically; the shadow is part of the composition, not just mood.
- **Clinical, even light when needed** — flat, shadowless studio lighting for graphic, object-like simplicity.
- **Controlled over available** — the default is a studio or a controlled environment, not window light or golden hour. Reserve natural light only when explicitly requested.

### Color World
- **High-contrast graphic palette** — black, white, and one or two saturated accent colors doing all the work.
- **Or full monochrome** — deep true blacks, clean whites, zero color cast.
- **No desaturated, faded, or "vintage" treatment** — reject muted/washed color language entirely; the palette is either loud and graphic or stark black-and-white.

### Mood & Attitude
- **Clinical and austere** — futurist surrealism meets brutalist minimalism. Cold, considered, high-fashion.
- **Confrontational stillness** — subjects hold direct, unflinching eye contact or a deliberate, sculptural pose. Not a candid, caught-mid-motion energy.
- **Editorial, not documentary** — every frame is openly staged and art-directed. Nothing pretends to be a candid snapshot.
- **Cool and severe** — effortless in the sense of being deadpan and precise, never nostalgic or soft.

---

## 2 · Reference Aesthetic DNA

These visual influences inform the language. Channel their combined sensibility:

- **SCHÖN Magazine energy** — Futurist, surreal, unapologetically high-fashion, bold conceptual staging
- **032C brutalist minimalism** — Cold, architectural, object-like precision, graphic restraint
- **Cinematic editorial** — High-contrast, sculptural lighting with a fashion edge
- **Theatrical & sculptural** — Handmade set design, geometric compositions, strong architectural framing
- **Raw high-flash editorial** — Direct on-camera flash, hard shadow, unflinching subject
- **Clean minimal lines** — "Classy but on-edge," studio precision, editorial sensibility
- **Studio-based editorial** — Clean graphic compositions with clinical intention

---

## 3 · Camera & Lens Set

Every prompt specifies a camera from this set. Alternate between them based on what the shot calls for — don't default to the same camera every time.

**Canon EOS 5D Mark III** — full-frame digital DSLR. Use for punchier, faster, more immediate editorial energy — high-flash work, movement, anything with a raw or aggressive edge.
- `50mm f/1.2L` — classic editorial portraiture, natural perspective
- `85mm f/1.2L` — tight beauty/portrait work, razor-thin focus plane, clinical sharp eyes against soft falloff
- `35mm f/1.4L` — wider environmental or full-body editorial
- `24-70mm f/2.8L` — versatile editorial coverage, environmental context

**Hasselblad digital medium format** (H6D-100c or equivalent back) — Use when the shot calls for maximum resolution and clinical, object-like precision — cover-story energy, still life, anything that needs to feel monumental or engineered.
- `80mm f/2.8` — standard medium-format editorial portrait
- `50mm f/3.5` — wider environmental or architectural framing
- `120mm f/4 Macro` — extreme close-up detail, product/still-life work

### Mandatory Elements (include in every prompt)

These elements define the baseline. Always include them unless explicitly overridden:

**Camera & lens (choose one per prompt):**
> Shot on Canon EOS 5D Mark III, 50mm f/1.2L

> Shot on Hasselblad, 80mm f/2.8

**Processing keywords (append 2-3 per prompt):**
- `sharp digital clarity`
- `high-contrast graphic lighting`
- `deep true blacks, clean whites`
- `sculptural shadow play`
- `hyper-detailed texture rendering`
- `clinical editorial precision`
- `graphic color blocking` (only when the palette uses a saturated accent color)
- `no grain, no color cast, no vintage treatment`

### Shot Types Reference

Use precise photographic language:

- **ECU (Extreme close-up)** — Eyes, lips, hands. Detail-level.
- **CU (Close-up)** — Face fills frame. Jawline to top of head.
- **MCU (Medium close-up)** — Head and shoulders.
- **MS (Medium shot)** — Waist up.
- **MLS (Medium long shot / American shot)** — Knees up.
- **LS (Long shot / Full shot)** — Full body, some environment.
- **ELS (Extreme long shot)** — Subject small in frame, environment dominates.

---

## 4 · Prompt Architecture

Every prompt follows this structure. Order matters — AI models weight earlier tokens more heavily.

```
[SHOT TYPE + FRAMING] + [SUBJECT DESCRIPTION] + [ACTION/POSE] + [WARDROBE] + [SETTING/ENVIRONMENT] + [LIGHTING] + [CAMERA + LENS] + [PROCESSING KEYWORDS] + [MOOD/AESTHETIC KEYWORDS]
```

---

## 5 · Prompt Generation Rules

1. **Be specific, not poetic** — Describe what's in the frame, not how it makes you feel.

2. **Lead with the subject** — AI models anchor on the first elements. Start with framing and subject, not mood words.

3. **Wardrobe matters** — Always describe clothing with specificity. Fabric, color, fit, silhouette.

4. **No face description when face references are provided** — If a separate face reference photo is used, describe only body, pose, wardrobe, setting, and camera.

5. **Environment is a character, and it should feel engineered** — Concrete, glass, steel, stark white cyc, brutalist architecture. Describe materials and scale with the same precision as the subject.

6. **One prompt = one image** — Don't pack multiple concepts. Each prompt should describe exactly one frame.

7. **No negative prompts unless asked** — Default to positive description only.

8. **Keep it under 150 words** — Tight, dense prompts perform better. Every word should contribute visual information.

9. **Match the style** — Write prompts as dense paragraphs, not bulleted lists. Technical but readable. Art director briefing a photographer, not a robot generating tags.

---

## 6 · Prompt Templates by Category

### Portrait (Editorial)

```
[Shot type] portrait, [subject positioning]. [Wardrobe description]. [Setting/background — stark, architectural, or graphic]. [Lighting description — source, quality, direction]. [Specific shadow/highlight behavior]. Skin and texture rendered in sharp, clinical detail. Shot on [Canon EOS 5D Mark III, lens] or [Hasselblad, lens]. [2-3 processing keywords]. [Mood reference].
```

### Product / Still Life

```
[Composition description — arrangement, hierarchy]. [Product/object details — material, color, finish]. [Surface/background — material, color, graphic]. [Lighting — source count, quality, shadow behavior]. [Atmospheric elements, if any]. Shot on Hasselblad, [lens], [aperture for depth of field]. [Processing keywords]. Clinical editorial aesthetic.
```

### Fashion Editorial

```
[Shot type], [model positioning and body language — deliberate, sculptural]. [Garment description — fabric, silhouette, color, fit]. [Styling details — accessories, hair, attitude]. [Set design or location — brutalist/architectural/stark]. [Lighting approach — flash/studio/mixed]. Shot on [Canon EOS 5D Mark III or Hasselblad, lens choice]. [Processing keywords]. [Reference — e.g., "direct flash energy" or "brutalist minimalism"].
```

---

## 7 · Platform-Specific Adjustments

When a specific platform is mentioned, adjust the prompt format:

**Midjourney** — Append style flags: `--ar 3:4 --v 6 --style raw`. Keep prompt concise. Midjourney responds well to publication/style name references.

**Flux / Stable Diffusion** — Can handle longer, more descriptive prompts. Include negative prompt if requested. Specify model if known (e.g., "Realistic Vision", "SDXL").

**ComfyUI** — Prompt goes in the positive conditioning node. When using separate face reference via IPAdapter — never describe face in these prompts.

**Seedream / Nanobanana** — Face reference uploaded separately. Prompt describes only scene, pose, wardrobe, setting. Add "Maintain exact face, facial features and hair from reference" when face consistency matters.

**Higgsfield / Video** — Describe the motion/action, not just the still frame. Include temporal language: "slowly turns", "camera pushes in", "strobe fires on the beat."

---

## 8 · Examples

**Editorial portrait prompt:**
> Medium close-up portrait, subject facing camera dead-on, unflinching stare, chin level. Structured charcoal wool coat, sharp popped collar, no shirt underneath. Stark white cyclorama background, no visible horizon line. Single hard strobe camera-left through a grid, razor-sharp shadow falling across the right side of the face, deep black shadow under the jaw. Skin texture sharp and clinical — pores and detail fully resolved, no softening. Shot on Hasselblad, 80mm f/2.8, f/5.6. Sharp digital clarity, deep true blacks, sculptural shadow play, clinical editorial precision. Brutalist minimalism.

**Product prompt:**
> Flat composition, three glass spheres arranged in descending size on a matte black surface. Largest sphere blood-red, medium sphere acid-green, smallest sphere chrome-silver. Each sphere contains visible molecular structures and floating micro-particles. Single hard overhead light, crisp graphic shadows directly beneath each sphere, sharp specular highlight on glass. Background pure black, no distracting elements. Shot on Hasselblad, 120mm f/4 Macro, f/11. Sharp digital clarity, deep true blacks, hyper-detailed texture rendering, graphic color blocking. Clinical editorial aesthetic, cover-story energy.

**Lifestyle prompt (with face reference):**
> Medium long shot, subject standing at the center of a raw concrete stairwell, one hand braced against the wall, weight on back leg, direct eye contact with camera. Structured white vinyl trench, black leather gloves, hair pulled back severely. Single hard flash from camera position, sharp shadow cast on concrete behind them, high contrast between lit and unlit sections of the frame. Shot on Canon EOS 5D Mark III, 35mm f/1.4L, f/2.8. Sharp digital clarity, high-contrast graphic lighting, deep true blacks. Maintain exact face, facial features and hair from reference. Brutalist architectural editorial.

**Fashion editorial prompt:**
> Full body shot, subject standing in center of a stark industrial steel-and-glass space, arms relaxed at sides, weight on right leg, chin slightly elevated, unflinching gaze. Oversized deconstructed black vinyl coat over bare skin, wide-leg cream trousers pooling at ankles, bare feet on polished concrete floor. Single harsh direct flash from camera-left, deep hard shadows on right side of body, sharp flash reflection on concrete floor. Shot on Canon EOS 5D Mark III, 50mm f/1.2L, f/2. High-contrast graphic lighting, deep true blacks, sculptural shadow play, no grain or color cast. Direct flash energy meets minimal clean lines.

---

## 9 · Pre-Generation Checklist

Before delivering any prompt, verify:

- Does it read like an art director's brief, not a tag soup?
- Is the camera specified — Canon EOS 5D Mark III or Hasselblad, with a specific lens?
- Is the palette either bold/graphic or true black-and-white — no washed, faded, or muted color language anywhere?
- Is the lighting hard and directional, or clinically flat — never soft available light unless explicitly requested?
- If a face reference is being used, is the face excluded from the description?
- Is the wardrobe described with fabric, color, and fit?
- Is it under 150 words?
- Does it match the intended platform's format?
- Would this prompt produce an image that feels cohesive with the aesthetic?

---

## How to Use This Skill

1. **For Portraits:** Describe the subject, wardrobe, setting, and mood. The skill will generate a professional prompt with proper camera and processing details.

2. **For Products:** Describe the objects, composition, and lighting intent. The skill handles technical camera language automatically.

3. **For Lifestyle/Fashion:** Describe the scene, action, environment. The skill structures it as a professional art director brief.

4. **With Face References:** Mention that you're using a separate face reference. The skill will exclude face description and add "Maintain exact face" instruction.

5. **Platform-Specific:** Mention your target platform (Midjourney, ComfyUI, Flux, etc.) and the skill will format accordingly.