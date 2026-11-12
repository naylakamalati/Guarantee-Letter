# DESIGN.md — AirNav Guarantee Letter Generator

A design system for an internal web tool used by AirNav Indonesia (Perum LPPNPI, Surabaya Branch) staff to create hotel Guarantee Letters. Interface labels are in **Bahasa Indonesia**. This file is the source of truth for look, layout, components, and the letter document itself.

---

## 1. Product Overview

- **Purpose:** Fill a form on the left, see an exact A4 letter on the right, download a print-ready PDF.
- **Users:** Administrative staff (Personalia & Umum). Used daily, often by non-technical people, usually on a laptop or desktop.
- **Personality:** Trustworthy, official, calm, efficient. Government-institution professionalism with a modern, uncluttered finish. Never playful, never decorative.
- **Primary goal:** Speed and accuracy. The user should create a correct letter in under two minutes.
- **Anti-goals:** No marketing-style hero sections, no stock photography, no gradients, no animation that delays work.

---

## 2. Color Tokens

Palette is strictly **white, navy blue, and light gray**. One accent for state feedback only.

| Token | Hex | Use |
|---|---|---|
| `--navy-900` | `#0B1F3A` | App header, primary headings |
| `--navy-700` | `#12315C` | Primary buttons, active states |
| `--navy-600` | `#1B4380` | Button hover, links, focus ring |
| `--navy-100` | `#E3EAF4` | Selected row, subtle highlights |
| `--white` | `#FFFFFF` | Cards, inputs, paper |
| `--gray-50` | `#F6F8FA` | App background |
| `--gray-100` | `#EEF1F5` | Panel background, table header in form |
| `--gray-200` | `#DDE2E9` | Borders, dividers |
| `--gray-500` | `#6B7685` | Helper text, placeholders |
| `--gray-800` | `#1F2937` | Body text in form |
| `--danger-600` | `#C0392B` | Validation errors only |
| `--success-600` | `#1E7F4F` | Saved / success toast only |

**Rules**
- Navy is the only brand color. Do not introduce green, teal, or orange.
- Document paper is always pure white with black text, regardless of any UI theme.
- Contrast: body text on white at least 7:1, secondary text at least 4.5:1.

---

## 3. Typography

| Role | Font | Size / Weight |
|---|---|---|
| UI (form, buttons, labels) | **Inter**, fallback system-ui | 14px / 400; labels 13px / 500; section titles 16px / 600 |
| App title | Inter | 20px / 600, white on navy |
| Helper & error text | Inter | 12px / 400 |
| **Letter document** | **Tinos** (metric-compatible with Times New Roman), fallback "Times New Roman", serif | Body 11.5pt; letterhead right block 10pt bold; title "AirNav Indonesia" 18pt bold |

Line height: UI 1.5, letter 1.25. No italics in the UI.

---

## 4. Spacing, Radius, Elevation

- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48.
- Radius: inputs and buttons 8px, cards 12px. Letter paper has **0 radius** (it is a paper sheet).
- Elevation: cards use a 1px `--gray-200` border plus `0 1px 2px rgba(11,31,58,0.06)`. The paper preview uses `0 8px 24px rgba(11,31,58,0.12)` so it reads as a sheet lying on the gray canvas.
- No glassmorphism, no gradients, no blur.

---

## 5. Layout

### Desktop (≥1024px): two panels

```
┌──────────────────────────────────────────────────────────────┐
│ NAVY HEADER  [logo] Guarantee Letter Generator    [Reset]    │
├───────────────────────────┬──────────────────────────────────┤
│ FORM PANEL (40%)          │ PREVIEW PANEL (60%)              │
│ scrolls independently     │ toolbar: [- 100% +] [Fit width]  │
│                           │ ┌──────────────────────────┐     │
│ ▸ 1 Detail Surat          │ │   A4 paper (white)       │     │
│ ▸ 2 Kepada Yth.           │ │   live HTML letter       │     │
│ ▸ 3 Daftar Tamu           │ │                          │     │
│ ▸ 4 Tagihan & Cakupan     │ └──────────────────────────┘     │
│ ▸ 5 Penandatangan         │  gray canvas, paper centered     │
│ ▸ 6 Aset Resmi            │                                  │
├───────────────────────────┴──────────────────────────────────┤
│ STICKY ACTION BAR  [Download PDF]  [Print]   status: ✔ Siap  │
└──────────────────────────────────────────────────────────────┘
```

- Header height 56px, navy-900, white text.
- Form panel: white background, 24px padding, independent scroll. Sections are collapsible accordions with numbered headings; first section open by default.
- Preview panel: `--gray-100` canvas, paper centered, auto-scaled to fit width by default, zoom 50%–150%.
- Sticky bottom action bar: white, top border, shows validation summary on the left and actions on the right.

### Tablet and mobile (<1024px)
Panels stack. A segmented control at the top switches between **Form** and **Preview**. The action bar stays fixed at the bottom. Guest table becomes a card list (one card per guest).

---

## 6. Components

### Buttons
- **Primary** (`Download PDF`): navy-700 background, white text, 40px height, hover navy-600, disabled gray-200 with gray-500 text.
- **Secondary** (`Print`): white background, navy-700 border and text.
- **Ghost / destructive** (`Reset`, `Hapus baris`): transparent, danger-600 text; Reset always opens a confirmation dialog.

### Inputs
- 40px height, 1px gray-200 border, 8px radius, white fill. Focus: 2px navy-600 ring. Error: danger-600 border plus message in 12px below the field.
- Label above the field. Required fields marked with a small navy asterisk.

### SelectWithManual (key component)
A searchable dropdown used for every green-highlighted field: recipient, room type, coverage, signatory title.
- Options listed alphabetically or in config order; type-ahead filter.
- Last option is always **"Lainnya (ketik manual)"**. Selecting it reveals a text input directly below, same width, with the label "Ketik manual".
- Last manual value is remembered and offered again next time.

### Guest Table (form side)
- Columns: **No** (auto), **Nama** (text, auto-uppercase), **Type** (SelectWithManual), **Check In** (date), **Check Out** (date), **Aksi** (duplicate, delete).
- Header row on gray-100; rows separated by gray-200; 44px row height.
- Footer: `+ Tambah Tamu`, `Tempel dari Excel`, `Terapkan type/tanggal ke semua`.
- Inline error under the row if Check Out is not after Check In. Minimum one row; delete is disabled on the last row.

### Asset Uploader
- Three slots: **Logo**, **Stempel**, **Tanda Tangan**. Each is a 96px dashed-border drop zone with thumbnail, file name, replace and remove actions.
- Empty state placeholder text: "LOGO", "STEMPEL", "TTD". PNG with transparent background recommended (helper text).
- Note: "Aset hanya disimpan di browser Anda."

### Feedback
- Toasts bottom-right, auto-dismiss in 4s: "PDF berhasil dibuat" (success), "Form telah direset".
- Validation summary in the action bar: "2 kolom perlu diperbaiki" with a link that scrolls to the first error.
- Confirm dialog for Reset: title "Reset semua isian?", buttons "Batal" and "Reset".

---

## 7. The Letter Document (A4 Preview)

The preview is **editable HTML, never a scanned image**. It mirrors the AirNav reference letter exactly. Paper: 210 × 297 mm, white, portrait. Page margins: top 15 mm, left 22 mm, right 18 mm, bottom 15 mm. Font: Tinos, black. *Calibrate positions against the reference scan when implementing.*

### Structure, top to bottom

1. **Letterhead**
   - Left: AirNav logo (about 38 mm wide) with the wordmark "AirNav Indonesia" (18pt bold) beside/below it. Placeholder box "LOGO" if no upload.
   - Right, right-aligned block, 10pt: **Perum LPPNPI** (bold, 12pt), **Kantor Cabang Surabaya** (bold), "Gedung AOB - Bandara Juanda," "Surabaya - 61253", "Telp. (031) 2986515", e-mail `surabaya@airnavindonesia.co.id` (blue, underlined), `www.airnavindonesia.co.id`.
2. **Date line** (bold): `Surabaya, 07 Oktober 2026`.
3. **Metadata block** (two columns, colon-aligned):
   - `Nomor   : --`
   - `Perihal : Guarantee Letter`
4. **Addressee**: "Kepada Yth. :" then the recipient in **bold** (e.g. *Pimpinan Hotel Four Points Tunjungan Plaza*), optional branch line in bold caps, then "di –" and "Tempat".
5. **Salutation**: "Dengan hormat," then "Dengan ini kami menyatakan bahwa :".
6. **Guest table**
   - Full content width, 1px solid black borders, 11.5pt.
   - Header: **No.** | **NAMA** | **TYPE** | **KETERANGAN** spanning two sub-columns **Check In** and **Check Out** (header cells merged exactly like the reference).
   - Body: No. (centered, bold), Name (uppercase, left, wraps to a second line inside the cell), Type (centered, uppercase), dates as `07 – Okt – 2026` (centered).
   - Column widths approximately: No 8%, Nama 36%, Type 18%, Check In 19%, Check Out 19%.
7. **Coverage paragraph**: "Adalah tamu Perum LPPNPI dan menanggung biaya tamu tersebut diatas *Room only*. Tagihan dapat dikirimkan kepada :" (the coverage words follow the selected option).
8. **Billing block**, centered, 11.5pt, 1.6 line spacing: organization and billing details entered by the user.
9. **Signature block**, left aligned about 22 mm from the left margin: signatory title (bold caps), then about 28 mm of vertical space where an authorized **stamp** and **signature** may be uploaded by the user and layered, then the signatory name in bold caps.

### Pagination rules
- If the guest table grows beyond the page, continue on page 2: repeat the table header row, never split a row across pages, and keep the whole signature block together (move it to the next page rather than cutting it).
- Page 2 repeats the letterhead only if "Ulangi kop surat" is enabled in settings (default off).

### Missing-asset placeholders
Dashed gray outline box with centered gray label ("LOGO", "STEMPEL", "TTD"). Placeholders are **hidden in the exported PDF** unless the user turns on "Tampilkan placeholder di PDF".

---

## 8. States & Behavior

| State | Behavior |
|---|---|
| Empty / default | Form prefilled with defaults from the reference (Nomor "--", Perihal "Guarantee Letter", billing contact, signatory); first guest row empty |
| Typing | Preview updates instantly (no debounce above 100ms) |
| Invalid | Field turns red with message; Download disabled; summary shown in action bar |
| Generating PDF | Button shows spinner and "Membuat PDF…"; other actions disabled |
| Success | Toast "PDF berhasil dibuat"; filename shown |
| Offline | Everything still works (no server calls) |

**Automatic filename:** `Guarantee-Letter_<Hotel-Name-Without-Pimpinan>_<YYYY-MM-DD>.pdf`, spaces become hyphens, special characters removed.

---

## 9. Content & Microcopy (Bahasa Indonesia)

- Section titles: Detail Surat, Kepada Yth., Daftar Tamu, Tagihan & Cakupan, Penandatangan, Aset Resmi.
- Errors: "Tanggal wajib diisi", "Pilih penerima surat", "Check Out harus setelah Check In", "Tambahkan minimal satu tamu", "Nama tamu tidak boleh kosong".
- Tone: short, polite, formal. No exclamation marks, no emoji.

---

## 10. Accessibility

- All inputs have visible labels; error text is linked with `aria-describedby`.
- Full keyboard navigation; focus ring always visible; Enter in the last guest field adds a new row.
- Minimum touch target 40px; color is never the only error indicator (icon + text).
- The paper preview has `role="document"` and an `aria-label`.

---

## 11. Do / Don't

**Do:** keep generous whitespace, align labels to a 4px grid, use navy for emphasis, let the white paper be the visual hero.
**Don't:** use more than the listed colors, add shadows to form fields, place the preview behind overlays, or style the letter itself (it must stay plain and official).

---

## 12. Reference Notes for Generators (Stitch / Gemini)

- Generate **one desktop screen** (1440 × 900) and **one mobile screen** (390 × 844) of the main editor.
- Show the form with section 3 (Daftar Tamu) expanded and the preview populated with four guests.
- Render the paper with the structure in section 7, not lorem ipsum.
- Style direction: modern SaaS dashboard, quiet and precise; soft rounded cards and clear hierarchy are welcome, but keep the palette navy / white / light gray only.
