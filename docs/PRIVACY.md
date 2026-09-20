# LIFE / RECEIPTS — Privacy & Data Governance Manifest

## 1. Fundamental Principle
**Your personal data belongs solely to you.**  
LIFE / RECEIPTS executes completely inside your browser client memory. No telemetry, audio logs, banking records, or expense receipts are ever transmitted to any remote server or third-party analytical platform.

## 2. PII Sanitization Guarantee
- Bank account numbers, card PANs, and UPI identifiers are masked prior to display (`•••• 1234`).
- No raw persistent cookies or local tracking beacons are set.
- All imported CSV files remain in volatile browser heap memory unless explicitly exported by the user.

## 3. Offline & Air-Gapped Operation
LIFE / RECEIPTS is designed to function seamlessly in offline and air-gapped environments without degrading 3D rendering or heuristic correlation performance.
