/** The mark: a single lens on a softly graded red tile. Shared by the favicon, the header and the share images */
export const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="pokedex-mark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2502a"/><stop offset="1" stop-color="#d42c08"/></linearGradient></defs><rect x="2" y="2" width="36" height="36" rx="11" fill="url(#pokedex-mark)"/><circle cx="20" cy="20" r="10.5" fill="#fff"/><circle cx="20" cy="20" r="6.5" fill="#15171f"/><circle cx="17.8" cy="17.8" r="1.9" fill="#fff"/></svg>`

export const MARK_DATA_URI = `data:image/svg+xml,${encodeURIComponent(MARK_SVG)}`
