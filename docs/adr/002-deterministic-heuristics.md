# ADR 002: Deterministic Heuristic Correlation Engine

## Status
Accepted

## Context
When displaying relationships across disparate life events (e.g. music listened to during a shopping trip), ungrounded generative models frequently hallucinate non-existent biographical causality.

## Decision
We utilize a deterministic mathematical affinity model:
$$S(A_i, A_j) = w_t \cdot T(\Delta t) + w_c \cdot C(c_i, c_j) + w_k \cdot K(k_i, k_j)$$

All connections must be backed by explicit diagnostic evidence strings (`"Events occurred within 22 minutes of each other"`, `"Shared category: Groceries"`).

## Consequences
- Guaranteed reproducibility across all client environments.
- High transparency and zero AI hallucination.
