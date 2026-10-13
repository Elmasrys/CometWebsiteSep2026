"""Generate the site's code-built imagery (SVG) in the Comet visual language.

Run from the repository root:  python3 tools/generate-art.py
Each file in public/images/ is a placeholder that can be replaced with photography
of the same name and aspect ratio without touching the HTML or CSS.
"""
import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "images"
OUT.mkdir(parents=True, exist_ok=True)

GRAIN = """<filter id="grain" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" stitchTiles="stitch"/>
<feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  {a} 0 0 0 0"/></filter>"""
MOTTLE = """<filter id="mottle" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="{f}" numOctaves="4" seed="{s}"/>
<feColorMatrix values="0 0 0 0 {c}  0 0 0 0 {c}  0 0 0 0 {c}  {a} 0 0 0 0"/></filter>"""


def svg(name, w, h, body, label=None):
    a11y = f' role="img" aria-label="{label}"' if label else ' aria-hidden="true"'
    (OUT / name).write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice"{a11y}>\n{body}\n</svg>\n'
    )


def lerp(a, b, t):
    return a + (b - a) * t


def fmt(points):
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in points)


# ---------------------------------------------------------------------------
# Home hero: a monumental corridor opening onto a sun on the horizon (Akhet).
# ---------------------------------------------------------------------------
def hero_scene():
    W, H = 1600, 1000
    vx, vy = 1100, 600            # vanishing point = sun centre on the horizon
    lx, rx = 940, 1260            # far edges of the corridor walls
    far_top, far_bottom = -40, 760

    def wall(near_x, far_x):
        t = (far_x - near_x) / (vx - near_x)
        nt = (far_top - vy * t) / (1 - t)
        nb = (far_bottom - vy * t) / (1 - t)
        return t, nt, nb

    tl, lnt, lnb = wall(-200, lx)
    tr, rnt, rnb = wall(1760, rx)
    left = [(-200, lnt), (lx, far_top), (lx, far_bottom), (-200, lnb)]
    right = [(rx, far_top), (1760, rnt), (1760, rnb), (rx, far_bottom)]
    floor = [(-200, lnb), (lx, far_bottom), (rx, far_bottom), (1760, rnb)]

    # Masonry courses: evenly spaced at the far edge, projected back to the near edge.
    joints = []
    for yf in range(-40, 761, 64):
        joints.append(((-200, (yf - vy * tl) / (1 - tl)), (lx, yf)))
        joints.append(((1760, (yf - vy * tr) / (1 - tr)), (rx, yf)))
    courses = "\n".join(
        f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}"/>' for a, b in joints
    )
    # Vertical block joints, closer together as they recede.
    verticals = []
    for x in (520, 700, 800, 860, 900, 922):
        s = (x + 200) / (lx + 200)
        verticals.append(((x, lerp(lnt, far_top, s)), (x, lerp(lnb, far_bottom, s))))
    for x in (1290, 1340, 1420, 1540):
        s = (1760 - x) / (1760 - rx)
        verticals.append(((x, lerp(rnt, far_top, s)), (x, lerp(rnb, far_bottom, s))))
    vjoints = "\n".join(
        f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}"/>' for a, b in verticals
    )

    # A lone figure walking toward the light, with a long shadow towards the viewer.
    fx, fy = vx, 812
    figure = (
        f'<circle cx="{fx}" cy="{fy - 58}" r="4.6"/>'
        f'<path d="M{fx - 5.5} {fy - 51} Q{fx} {fy - 54} {fx + 5.5} {fy - 51} L{fx + 6.5} {fy - 24} L{fx + 4} {fy - 24} '
        f'L{fx + 5.5} {fy} L{fx + 2.4} {fy} L{fx + 0.6} {fy - 20} L{fx - 0.6} {fy - 20} L{fx - 3.4} {fy} L{fx - 6.2} {fy} '
        f'L{fx - 4} {fy - 24} L{fx - 6.5} {fy - 24} Z"/>'
    )
    shadow = fmt([(fx - 5, fy), (fx + 5, fy), (fx + 52, H), (fx - 30, H)])

    body = f"""<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#110c08"/><stop offset=".42" stop-color="#3a2310"/>
 <stop offset=".72" stop-color="#a5672a"/><stop offset=".9" stop-color="#e7b46a"/><stop offset="1" stop-color="#f8daa2"/></linearGradient>
<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#9a6833"/><stop offset=".35" stop-color="#4a3018"/><stop offset="1" stop-color="#1c140c"/></linearGradient>
<linearGradient id="leftWall" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="{lx}" y2="0">
 <stop offset="0" stop-color="#090807"/><stop offset=".55" stop-color="#14110d"/>
 <stop offset=".86" stop-color="#3a2b1c"/><stop offset="1" stop-color="#83603a"/></linearGradient>
<linearGradient id="rightWall" gradientUnits="userSpaceOnUse" x1="{rx}" y1="0" x2="{W}" y2="0">
 <stop offset="0" stop-color="#94693a"/><stop offset=".18" stop-color="#4a3622"/>
 <stop offset=".6" stop-color="#1a150f"/><stop offset="1" stop-color="#0b0a08"/></linearGradient>
<linearGradient id="floor" gradientUnits="userSpaceOnUse" x1="0" y1="{far_bottom}" x2="0" y2="{H}">
 <stop offset="0" stop-color="#4f3820"/><stop offset=".25" stop-color="#211912"/><stop offset="1" stop-color="#0a0908"/></linearGradient>
<linearGradient id="path" gradientUnits="userSpaceOnUse" x1="0" y1="{far_bottom}" x2="0" y2="{H}">
 <stop offset="0" stop-color="#f6cf8e" stop-opacity=".32"/><stop offset=".6" stop-color="#f6cf8e" stop-opacity=".06"/><stop offset="1" stop-color="#f6cf8e" stop-opacity="0"/></linearGradient>
<radialGradient id="glow" gradientUnits="userSpaceOnUse" cx="{vx}" cy="{vy}" r="420">
 <stop offset="0" stop-color="#ffe3a8" stop-opacity=".9"/><stop offset=".25" stop-color="#f3c47c" stop-opacity=".45"/>
 <stop offset="1" stop-color="#d9a35f" stop-opacity="0"/></radialGradient>
<radialGradient id="spill" gradientUnits="userSpaceOnUse" cx="{vx}" cy="{vy + 60}" r="900">
 <stop offset="0" stop-color="#e2a85e" stop-opacity=".22"/><stop offset="1" stop-color="#e2a85e" stop-opacity="0"/></radialGradient>
<radialGradient id="vignette" cx=".62" cy=".55" r=".8">
 <stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></radialGradient>
<clipPath id="opening"><rect x="{lx}" y="{far_top}" width="{rx - lx}" height="{far_bottom - far_top}"/></clipPath>
<clipPath id="aboveHorizon"><rect x="0" y="0" width="{W}" height="{vy}"/></clipPath>
<clipPath id="walls"><polygon points="{fmt(left)}"/><polygon points="{fmt(right)}"/></clipPath>
{GRAIN.format(a=0.1)}
{MOTTLE.format(f="0.003 0.018", s=11, c=0, a=0.55)}
</defs>
<rect width="{W}" height="{H}" fill="#0b0a08"/>
<g clip-path="url(#opening)">
 <rect x="{lx}" y="{far_top}" width="{rx - lx}" height="{vy - far_top}" fill="url(#sky)"/>
 <rect x="{lx}" y="{vy}" width="{rx - lx}" height="{far_bottom - vy}" fill="url(#ground)"/>
 <circle cx="{vx}" cy="{vy}" r="420" fill="url(#glow)"/>
 <circle cx="{vx}" cy="{vy}" r="96" fill="#fff0c8" clip-path="url(#aboveHorizon)"/>
 <path d="M{lx} {vy} L{lx + 30} {vy - 9} Q{lx + 70} {vy - 24} {lx + 105} {vy - 8} L{lx + 135} {vy - 3} L{rx - 120} {vy - 2} Q{rx - 70} {vy - 18} {rx - 30} {vy - 6} L{rx} {vy - 10} L{rx} {vy} Z" fill="#7a4a22" opacity=".55"/>
</g>
<polygon points="{fmt(floor)}" fill="url(#floor)"/>
<polygon points="{fmt([(vx - 46, far_bottom), (vx + 46, far_bottom), (vx + 330, H), (vx - 250, H)])}" fill="url(#path)"/>
<polygon points="{fmt(left)}" fill="url(#leftWall)"/>
<polygon points="{fmt(right)}" fill="url(#rightWall)"/>
<g clip-path="url(#walls)">
 <rect width="{W}" height="{H}" filter="url(#mottle)"/>
 <g stroke="#000" stroke-opacity=".4" stroke-width="1.4">{courses}
{vjoints}</g>
</g>
<rect width="{W}" height="{H}" fill="url(#spill)"/>
<polygon points="{shadow}" fill="#000" opacity=".45"/>
<g fill="#0d0a07">{figure}</g>
<rect width="{W}" height="{H}" filter="url(#grain)"/>
<rect width="{W}" height="{H}" fill="url(#vignette)"/>"""
    svg("hero-scene.svg", W, H, body)


# ---------------------------------------------------------------------------
# Inner-page hero: a quiet horizon with a half sun between two distant pylons.
# ---------------------------------------------------------------------------
def horizon():
    W, H, hy, sx = 1600, 700, 520, 1180
    body = f"""<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#0b0a08"/><stop offset=".55" stop-color="#1e150d"/>
 <stop offset=".85" stop-color="#5d3a1a"/><stop offset="1" stop-color="#b47a3a"/></linearGradient>
<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#3b2815"/><stop offset=".4" stop-color="#15100b"/><stop offset="1" stop-color="#0b0a08"/></linearGradient>
<linearGradient id="reflect" gradientUnits="userSpaceOnUse" x1="0" y1="{hy}" x2="0" y2="{H}">
 <stop offset="0" stop-color="#f3cf8e" stop-opacity=".45"/><stop offset="1" stop-color="#f3cf8e" stop-opacity="0"/></linearGradient>
<radialGradient id="glow" gradientUnits="userSpaceOnUse" cx="{sx}" cy="{hy}" r="360">
 <stop offset="0" stop-color="#ffe0a3" stop-opacity=".8"/><stop offset=".3" stop-color="#e9b064" stop-opacity=".3"/>
 <stop offset="1" stop-color="#d9a35f" stop-opacity="0"/></radialGradient>
<linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
 <stop offset="0" stop-color="#0b0a08"/><stop offset=".45" stop-color="#0b0a08" stop-opacity=".6"/><stop offset=".7" stop-color="#0b0a08" stop-opacity="0"/></linearGradient>
<clipPath id="sky-clip"><rect width="{W}" height="{hy}"/></clipPath>
{GRAIN.format(a=0.09)}
</defs>
<rect width="{W}" height="{hy}" fill="url(#sky)"/>
<rect y="{hy}" width="{W}" height="{H - hy}" fill="url(#ground)"/>
<circle cx="{sx}" cy="{hy}" r="360" fill="url(#glow)"/>
<circle cx="{sx}" cy="{hy}" r="82" fill="#ffefc6" clip-path="url(#sky-clip)"/>
<polygon points="{fmt([(sx - 40, hy), (sx + 40, hy), (sx + 160, H), (sx - 160, H)])}" fill="url(#reflect)"/>
<g fill="#0e0b08">
 <polygon points="{fmt([(sx - 250, hy), (sx - 236, 210), (sx - 150, 210), (sx - 136, hy)])}"/>
 <polygon points="{fmt([(sx + 136, hy), (sx + 150, 210), (sx + 236, 210), (sx + 250, hy)])}"/>
</g>
<line x1="0" y1="{hy}" x2="{W}" y2="{hy}" stroke="#d9b06f" stroke-opacity=".55"/>
<rect width="{W}" height="{H}" fill="url(#fade)"/>
<rect width="{W}" height="{H}" filter="url(#grain)"/>"""
    svg("horizon.svg", W, H, body)


# ---------------------------------------------------------------------------
# Card textures, after the concept's "visual language" swatches.
# ---------------------------------------------------------------------------
def art_arch():
    W, H = 640, 400
    body = f"""<defs>
<linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
 <stop offset="0" stop-color="#efe7d8"/><stop offset="1" stop-color="#cdbfa6"/></linearGradient>
<linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
 <stop offset="0" stop-color="#3b2f22" stop-opacity=".5"/><stop offset="1" stop-color="#3b2f22" stop-opacity=".18"/></linearGradient>
{MOTTLE.format(f="0.006 0.02", s=5, c=0.25, a=0.35)}
{GRAIN.format(a=0.12)}
</defs>
<rect width="{W}" height="{H}" fill="url(#wall)"/>
<rect width="{W}" height="{H}" filter="url(#mottle)"/>
<path d="M0 0 H230 Q205 230 420 {H} H0 Z" fill="url(#shade)"/>
<path d="M0 0 H120 V{H} H0 Z" fill="#1b1611" opacity=".85"/>
<rect width="{W}" height="{H}" filter="url(#grain)"/>"""
    svg("art-arch.svg", W, H, body)


def art_columns():
    W, H = 640, 400
    ribs = []
    x = 0
    for i, w in enumerate([70, 34, 58, 30, 76, 26, 64, 38, 90, 40, 60, 54]):
        light = 0.04 + 0.22 * (i % 3 == 1) + 0.1 * (i % 4 == 2)
        ribs.append(f'<rect x="{x}" width="{w}" height="{H}" fill="url(#rib)" opacity="{0.55 + light:.2f}"/>')
        ribs.append(f'<rect x="{x + w - 3}" width="3" height="{H}" fill="#e8c38a" opacity="{light:.2f}"/>')
        x += w
    body = f"""<defs>
<linearGradient id="rib" x1="0" y1="0" x2="1" y2="0">
 <stop offset="0" stop-color="#070605"/><stop offset=".7" stop-color="#1d1915"/><stop offset="1" stop-color="#3a3128"/></linearGradient>
<linearGradient id="fall" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></linearGradient>
{GRAIN.format(a=0.1)}
</defs>
<rect width="{W}" height="{H}" fill="#080706"/>
{"".join(ribs)}
<rect width="{W}" height="{H}" fill="url(#fall)"/>
<rect width="{W}" height="{H}" filter="url(#grain)"/>"""
    svg("art-columns.svg", W, H, body)


def art_stone():
    W, H = 640, 400
    body = f"""<defs>
<linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
 <stop offset="0" stop-color="#e2d6c0"/><stop offset="1" stop-color="#b9a585"/></linearGradient>
<linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
 <stop offset="0" stop-color="#fff6e2" stop-opacity="0"/><stop offset=".5" stop-color="#fff6e2" stop-opacity=".45"/>
 <stop offset="1" stop-color="#fff6e2" stop-opacity="0"/></linearGradient>
{MOTTLE.format(f="0.012 0.03", s=8, c=0.2, a=0.5)}
{GRAIN.format(a=0.14)}
</defs>
<rect width="{W}" height="{H}" fill="url(#base)"/>
<rect width="{W}" height="{H}" filter="url(#mottle)"/>
<polygon points="{fmt([(260, 0), (420, 0), (180, H), (20, H)])}" fill="url(#beam)"/>
<path d="M0 290 Q180 270 330 300 T{W} 280" fill="none" stroke="#6d5a40" stroke-opacity=".35"/>
<rect width="{W}" height="{H}" filter="url(#grain)"/>"""
    svg("art-stone.svg", W, H, body)


# ---------------------------------------------------------------------------
# Line glyphs for the Four Fundamentals (a sprite referenced with <use>).
# ---------------------------------------------------------------------------
def icons():
    symbols = {
        # Value: the Shen ring, eternity and wholeness.
        "shen": '<circle cx="32" cy="27" r="18"/><path d="M10 49 H54 M24 43 V49 M40 43 V49"/>',
        # Work: Akhet, the sun between two mountains on the horizon.
        "akhet": '<path d="M4 50 H60 M4 50 L17 24 L25 42 M60 50 L47 24 L39 42"/><circle cx="32" cy="40" r="8"/>',
        # Organisation: columns and lintel, structure and proportion.
        "columns": '<path d="M8 12 H56 M12 18 H52 M8 54 H56 M12 48 H52 M17 18 V48 M25 18 V48 M39 18 V48 M47 18 V48"/>',
        # Growth: the solar switch, a new state.
        "switch": '<rect x="6" y="18" width="52" height="28" rx="14"/><circle cx="44" cy="32" r="8"/>',
    }
    body = "\n".join(
        f'<symbol id="{k}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">{v}</symbol>'
        for k, v in symbols.items()
    )
    (OUT / "icons.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg">\n{body}\n</svg>\n')


if __name__ == "__main__":
    # hero_scene() and horizon() were placeholders for the earlier cinematic direction and are no longer used.
    art_arch()
    art_columns()
    art_stone()
    icons()
    print("wrote", sorted(p.name for p in OUT.iterdir()))
