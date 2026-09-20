import { describe, it, expect } from 'vitest';
import { normalizeBankingData } from '@/data/banking';
import { normalizeSpotifyData } from '@/data/spotify';
import { normalizeHouseholdData } from '@/data/household';

describe('Data Privacy, Normalization & Security Safeguards', () => {
  it('should normalize banking records safely and compute numeric amounts', () => {
    const rawBanking = [
      {
        trans_id: 'tx-1001',
        trans_date_trans_time: '2026-03-15 14:30:00',
        cc_num: '4000123456789010',
        merchant: 'fraud_Swiggy_Online',
        category: 'food_dining',
        amt: '450.00',
        first: 'John',
        last: 'Doe',
        gender: 'M',
        street: '123 Tech Blvd',
        city: 'Bengaluru',
        state: 'Karnataka',
        lat: '12.97',
        long: '77.59',
        city_pop: '8000000',
        job: 'Software Engineer',
        dob: '1995-05-12',
        merch_lat: '12.98',
        merch_long: '77.60',
        is_fraud: '0',
        customer_id: 'cust-99',
      },
    ];

    const normalized = normalizeBankingData(rawBanking);
    expect(normalized.length).toBe(1);
    const act = normalized[0];
    expect(act.source).toBe('banking');
    expect(act.amount).toBe(450);
    expect(act.currency).toBe('INR');
    expect(act.timestamp).toBeTruthy();
    expect(act.title).toBe('Swiggy Online');
  });

  it('should normalize Spotify streaming records and compute playtime duration', () => {
    const rawSpotify = [
      {
        spotify_track_uri: 'spotify:track:4cOdK2wGLETKBW3PvgPWqT',
        ts: '2026-03-15T22:30:00Z',
        platform: 'web_player',
        ms_played: '301000',
        track_name: 'Digital Love',
        artist_name: 'Daft Punk',
        album_name: 'Discovery',
        reason_start: 'clickrow',
        reason_end: 'trackdone',
        shuffle: 'false',
        skipped: 'false',
      },
    ];

    const normalized = normalizeSpotifyData(rawSpotify);
    expect(normalized.length).toBe(1);
    const act = normalized[0];
    expect(act.source).toBe('music');
    expect(act.title).toContain('Digital Love');
    expect(act.metadata.durationMs).toBe(301000);
    expect(act.category).toBe('Electronic');
  });

  it('should normalize household expenses records', () => {
    const rawHousehold = [
      {
        Date: '2026-03-15',
        Category: 'Groceries',
        Amount: '890',
        Description: 'Organic Vegetables & Dairy',
        SubCategory: 'Organic',
        'Payment Mode': 'UPI',
      },
    ];

    const normalized = normalizeHouseholdData(rawHousehold);
    expect(normalized.length).toBe(1);
    const act = normalized[0];
    expect(act.source).toBe('household');
    expect(act.amount).toBe(890);
    expect(act.category).toBe('Groceries');
  });
});
