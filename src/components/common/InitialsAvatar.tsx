import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Fonts from '../../constants/fonts';

function normalizeNameTokens(name: string): string[] {
  const raw = name.trim().split(/\s+/).filter(Boolean);
  // Drop common honorifics so "Dr. Hammd" uses H not D.
  const honorifics = new Set([
    'dr',
    'dr.',
    'mr',
    'mr.',
    'mrs',
    'mrs.',
    'ms',
    'ms.',
  ]);
  const filtered = raw.filter((t) => !honorifics.has(t.toLowerCase()));
  return filtered.length ? filtered : raw;
}

function initialsFromName(name: string): string {
  const parts = normalizeNameTokens(name);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  const out = `${first}${last}`.toUpperCase();
  return out || '?';
}

function firstLetterFromName(name: string): string {
  const parts = normalizeNameTokens(name);
  const ch = parts[0]?.[0] ?? '';
  return ch ? ch.toUpperCase() : '?';
}

function colorFromString(seed: string): string {
  // Deterministic pastel-ish color from string hash.
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const hue = h % 360;
  return `hsl(${hue}, 55%, 82%)`;
}

export type InitialsAvatarProps = {
  uri?: string | null;
  name?: string | null;
  size: number;
  borderRadius?: number;
  variant?: 'initials' | 'first-letter';
};

export default function InitialsAvatar({
  uri,
  name,
  size,
  borderRadius,
  variant = 'initials',
}: InitialsAvatarProps) {
  const cleanUri = typeof uri === 'string' ? uri.trim() : '';
  const hasUri = cleanUri.startsWith('http://') || cleanUri.startsWith('https://');
  const label = (name ?? '').trim();
  const text = useMemo(() => {
    return variant === 'first-letter'
      ? firstLetterFromName(label)
      : initialsFromName(label);
  }, [label, variant]);
  const bg = useMemo(() => colorFromString(label || text), [label, text]);
  const r = borderRadius ?? Math.round(size / 4);

  if (hasUri) {
    return (
      <Image
        source={{ uri: cleanUri }}
        style={{ width: size, height: size, borderRadius: r }}
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: r, backgroundColor: bg }]}>
      <Text style={[styles.initials, { fontSize: Math.max(12, Math.round(size * 0.34)) }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: Fonts.raleway,
    fontWeight: '800',
    color: 'rgba(17,24,39,0.72)',
  },
});

