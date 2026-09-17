/**
 * Static fallback catalogue.
 *
 * The doors page reads the live catalogue from `/api/doors` (Vercel Blob —
 * see lib/doors-catalogue.ts) first. When that's empty or unreachable — most
 * likely because Vercel Blob isn't connected to this project yet — it falls
 * back to this hardcoded list so the main product page is never blank.
 *
 * `Door` here is the one shared shape used by the live catalogue, the admin
 * dashboard, and this fallback — import it from here rather than redeclaring
 * it. `imagePathname` is only ever set on Blob-backed entries (it's the
 * storage key used to delete/replace the image file); fallback entries leave
 * it undefined since there's no blob behind a bundled /public image.
 */
export type Door = {
  id: string
  name: string
  image_url: string
  category: string
  description: string
  imagePathname?: string
}

/**
 * The category *values* every door's `category` field actually uses (lower-
 * case, matches the sidebar filters on /doors) paired with a display label
 * for the admin dashboard's dropdown. Keep these two in sync — a door saved
 * with a category outside this list still works, it just won't match any
 * sidebar filter.
 */
export const DOOR_CATEGORIES: { value: string; label: string }[] = [
  { value: "main", label: "Main Doors" },
  { value: "pooja", label: "Pooja Room Doors" },
  { value: "bedroom", label: "Bedroom Doors" },
  { value: "bathroom", label: "Bathroom Doors" },
  { value: "balcony", label: "Balcony Doors" },
  { value: "office", label: "Office Doors" },
  { value: "pg", label: "P.G. Doors" },
]

export const fallbackDoors: Door[] = [
  {
    id: "main-01",
    name: "Heritage Carved Main Door",
    image_url: "/elegant-wooden-main-door-with-carved-details.jpg",
    category: "main",
    description: "Solid teak with hand-carved panelling and a deep melamine finish.",
  },
  {
    id: "main-02",
    name: "Solid Carved Entrance",
    image_url: "/solid-carved-wooden-main-door.jpg",
    category: "main",
    description: "Single-leaf entrance in seasoned hardwood, carved to order.",
  },
  {
    id: "main-03",
    name: "Arched Carved Door",
    image_url: "/arched-solid-wooden-door-with-carvings.jpg",
    category: "main",
    description: "Arched head with relief carving — built to a custom frame.",
  },
  {
    id: "main-04",
    name: "Rustic Grain Door",
    image_url: "/rustic-wooden-door-with-natural-wood-grain-texture.jpg",
    category: "main",
    description: "Open-grain finish that keeps the natural texture of the timber.",
  },
  {
    id: "main-05",
    name: "Twin-Leaf Glass Entrance",
    image_url: "/double-wooden-doors-with-multiple-glass-panels.jpg",
    category: "main",
    description: "Double-leaf entrance with toughened glass panels.",
  },
  {
    id: "pooja-01",
    name: "Traditional Pooja Doors",
    image_url: "/traditional-pooja-room-wooden-doors-with-spiritual.jpg",
    category: "pooja",
    description: "Twin-leaf pooja doors with traditional motif carving.",
  },
  {
    id: "pooja-02",
    name: "Ornate Pooja Room Doors",
    image_url: "/ornate-traditional-pooja-room-doors-with-carvings.jpg",
    category: "pooja",
    description: "Deep-relief carving with brass-finish fittings.",
  },
  {
    id: "pooja-03",
    name: "Classic Carved Pooja Door",
    image_url: "/classic-carved-wooden-pooja-door.jpg",
    category: "pooja",
    description: "Single-leaf pooja door in seasoned teak.",
  },
  {
    id: "bedroom-01",
    name: "Sleek Bedroom Door",
    image_url: "/modern-bedroom-door-with-sleek-wooden-design.jpg",
    category: "bedroom",
    description: "Flush door with a warm veneer and concealed hinges.",
  },
  {
    id: "bedroom-02",
    name: "Minimalist Bedroom Door",
    image_url: "/modern-minimalist-bedroom-door.jpg",
    category: "bedroom",
    description: "Clean flush face, matt PU finish, soft-close hardware.",
  },
  {
    id: "bedroom-03",
    name: "Panelled Bedroom Door",
    image_url: "/paneled-wooden-bedroom-door.jpg",
    category: "bedroom",
    description: "Four-panel profile in a classic proportion.",
  },
  {
    id: "bedroom-04",
    name: "Traditional Panel Door",
    image_url: "/classic-wooden-panel-door-with-traditional-design.jpg",
    category: "bedroom",
    description: "Six-panel traditional layout, solid core.",
  },
  {
    id: "bathroom-01",
    name: "Moisture-Sealed Bathroom Door",
    image_url: "/minimalist-bathroom-door-with-moisture-resistant-w.jpg",
    category: "bathroom",
    description: "Edge-sealed and water-resistant for wet areas.",
  },
  {
    id: "bathroom-02",
    name: "White Panelled Bathroom Door",
    image_url: "/white-paneled-bathroom-door.jpg",
    category: "bathroom",
    description: "Painted panel door with a wipe-clean finish.",
  },
  {
    id: "balcony-01",
    name: "Sliding Balcony Doors",
    image_url: "/glass-and-wood-balcony-sliding-doors-with-natural-.jpg",
    category: "balcony",
    description: "Timber-framed sliding panels with clear glazing.",
  },
  {
    id: "balcony-02",
    name: "French Balcony Doors",
    image_url: "/french-style-balcony-doors-with-glass-panels.jpg",
    category: "balcony",
    description: "Double-leaf French doors with divided glass panes.",
  },
  {
    id: "balcony-03",
    name: "Arched Glass Double Doors",
    image_url: "/arched-double-wooden-doors-with-glass-panels.jpg",
    category: "balcony",
    description: "Arched twin doors with full-height glazing.",
  },
  {
    id: "office-01",
    name: "Modern Office Door",
    image_url: "/professional-office-door-with-modern-frame.jpg",
    category: "office",
    description: "Straight-line frame with a hard-wearing laminate face.",
  },
  {
    id: "office-02",
    name: "Glass & Wood Office Door",
    image_url: "/modern-office-door-with-glass-and-wood.jpg",
    category: "office",
    description: "Vision panel set into a solid timber stile.",
  },
  {
    id: "office-03",
    name: "Glass Accent Door",
    image_url: "/wooden-door-with-glass-accent-panels-elegant-desig.jpg",
    category: "office",
    description: "Slim glass accents for borrowed light.",
  },
  {
    id: "pg-01",
    name: "Durable Shared-Space Door",
    image_url: "/durable-wooden-door-for-shared-residential-space.jpg",
    category: "pg",
    description: "Reinforced core built for heavy daily use.",
  },
  {
    id: "pg-02",
    name: "Simple P.G. Door",
    image_url: "/simple-durable-wooden-door-for-pg.jpg",
    category: "pg",
    description: "Economical, hard-wearing and quick to fit.",
  },
  {
    id: "glass-01",
    name: "Decorative Glass Insert Door",
    image_url: "/wooden-door-with-decorative-glass-insert.jpg",
    category: "main",
    description: "Etched glass insert framed in solid hardwood.",
  },
  {
    id: "glass-02",
    name: "Elegant Glass Panel Door",
    image_url: "/elegant-wooden-door-with-decorative-glass-panel.jpg",
    category: "main",
    description: "Full-height decorative glazing with a carved surround.",
  },
  {
    id: "modern-01",
    name: "Modern Minimalist Door",
    image_url: "/modern-minimalist-wooden-door-with-sleek-design.jpg",
    category: "bedroom",
    description: "Flat face, hidden frame, matt lacquer.",
  },
  {
    id: "modern-02",
    name: "Glass Panel Entrance",
    image_url: "/modern-wooden-door-with-glass-panels-in-elegant-ho.jpg",
    category: "main",
    description: "Contemporary entrance with side glazing.",
  },
]
