# LIFE / RECEIPTS — Technical Architecture Document

## 1. Executive Summary
**LIFE / RECEIPTS** is engineered as an offline-first, client-side digital life exploration platform. It transforms disparate personal telemetry data streams into a unified semantic timeline, discovers latent cross-source correlations via deterministic heuristics, and generates narrative chapters rendered through a 3D WebGL and editorial typography interface.

---

## 2. Directory & Module Organization

```
src/
├── __tests__/                  # Vitest unit test suites
│   ├── connections.test.ts     # Correlation engine verification
│   ├── data.test.ts            # Data ingestion & stats calculation
│   ├── privacy.test.ts         # PII masking & sanitization
│   └── stories.test.ts         # Narrative generation & evidence tests
├── components/
│   ├── archive/                # Archive explorer, receipt cards, filters, data import/export
│   ├── connections/            # Relational inspector, connection cards, correlation canvas graph
│   ├── gallery/                # Memory wall, drift wall, 3D photo grid
│   ├── hero/                   # Hero banner, 3D typography
│   ├── insights/               # Recharts metrics dashboards, category breakdowns
│   ├── journey/                # Monthly timeline, activity pulses
│   ├── layout/                 # Navigation, sticky headers, footers
│   ├── story/                  # Narrative chapters, tone switcher, pixel-swap cards
│   └── ui/                     # 3D WebGL scenes, ErrorBoundary, GlassIcons, modals
├── data/                       # Bundled CSV datasets & data normalization adapters
├── hooks/                      # Custom React hooks (useActiveSection, useFilters)
├── lib/                        # Pure analytical algorithms (connections, stories, formatting)
├── types/                      # TypeScript schemas & interfaces
└── App.tsx                     # Main layout & coordinator component
```

---

## 3. Data Ingestion & Normalization Pipeline

1. **Raw CSV Parsing**: Datasets (`banking.csv`, `expenses.csv`, `spotify.csv`) or user-uploaded files are streamed into memory via PapaParse.
2. **Schema Uniformity**: Disparate structures are mapped into the canonical `LifeActivity` interface:
   - `id`: Unique deterministically generated identifier.
   - `source`: `'music' | 'banking' | 'household'`.
   - `title`: Human-readable label (sanitized & masked).
   - `timestamp`: ISO-8601 string.
   - `amount`: Optional numerical value for financial events.
   - `category`: Canonical classification.
   - `metadata`: Arbitrary source-specific diagnostic fields.
3. **Privacy Sanitization**:
   - Strips unneeded technical identifiers.
   - Masks card numbers and payment tokens (`•••• 4092`).
   - Normalizes merchant strings (`fraud_` prefixes eliminated).

---

## 4. Heuristic Discovery & Story Derivation

- **Zero Hallucination Policy**: No ungrounded biographical claims or fictionalized narratives are fabricated.
- **Relational Heuristics**:
  - `temporal-proximity`: Events within 60 minutes of each other across distinct sources.
  - `shared-date`: Events occurring on the same calendar day.
  - `shared-category`: Semantic alignment between financial and daily expense entries.
  - `activity-cluster`: Unusually high event density within a 24-hour window.
- **Multi-Perspective Narrative Adaptation**:
  - *Editorial*: Archival curation.
  - *Data Analyst*: Quantitative variance and cluster telemetry.
  - *Poetic*: Evocative temporal rhythm.

---

## 5. WebGL & 3D Rendering Pipeline

- **Scene Architecture**: Built using `@react-three/fiber` and `@react-three/drei`.
- **Lighting & Materials**:
  - Double-sided geometry rendering (`THREE.DoubleSide`) preventing back-face clipping during continuous orbital rotation.
  - Directional and ambient soft fill lights with subtle color grading.
  - Custom camera angle focused on interior cutaways (`[0, 5, 12]`, lookAt: `[0, 0, 0]`).
- **Performance Optimizations**:
  - High-DPI clamping (`dpr={[1, 2]}`) to prevent mobile GPU throttling.
  - Zero memory leaks via automatic GLTF loader cache disposal.
