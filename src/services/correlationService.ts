import { discoverConnections, getConnectionReasonLabel } from '@/lib/connections';
import type { LifeActivity, Connection, ConnectionReason } from '@/types';

/**
 * Correlation Service - Domain service for deterministic relational discovery
 */
export class CorrelationService {
  public static findCorrelations(activities: LifeActivity[]): Connection[] {
    if (!activities || activities.length === 0) return [];
    return discoverConnections(activities);
  }

  public static getReasonLabel(reason: ConnectionReason): string {
    return getConnectionReasonLabel(reason);
  }

  public static groupConnectionsByReason(connections: Connection[]): Map<ConnectionReason, Connection[]> {
    const map = new Map<ConnectionReason, Connection[]>();
    for (const conn of connections) {
      const list = map.get(conn.reason) ?? [];
      list.push(conn);
      map.set(conn.reason, list);
    }
    return map;
  }
}
