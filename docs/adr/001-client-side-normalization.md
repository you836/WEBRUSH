# ADR 001: Client-Side Data Normalization and Ingestion Pipeline

## Status
Accepted

## Context
The application processes diverse telemetry datasets (Spotify streaming history, Indian banking & UPI transactions, and daily household expenses). Users expect immediate interactivity, privacy protection, and custom CSV dataset ingestion without uploading raw personal records to third-party cloud servers.

## Decision
We enforce a **100% Client-Side Ingestion Architecture**:
- All CSV parsing is executed in-memory using `PapaParse`.
- Disparate schemas are mapped immediately to the canonical `LifeActivity` interface.
- Personal Identifiable Information (PII) such as bank account numbers is masked at ingestion time (`•••• 1234`).
- No database backend or external analytics API is utilized.

## Consequences
### Positive
- Zero telemetry transmission guarantees full user privacy.
- Sub-millisecond data query performance with zero network latency.
- Instant offline capabilities and zero cloud infrastructure operational costs.

### Negative
- Memory capacity is bounded by browser heap (mitigated by lazy chunking and virtualized pagination).
