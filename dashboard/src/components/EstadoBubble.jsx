import React from 'react'
import { Stack, LiquidBubble } from '@agustin/aqus'
import { progressState } from '../data/helpers.js'

/**
 * Organic liquid dot standing in for how a patient is coming along — a feeling,
 * not a metric. Meaning rests on dot + word + color together, never color alone
 * (Von Restorff / a11y). `size="lg"` adds the warm one-line note.
 */
export function EstadoBubble({ paciente, size = 'sm' }) {
  const st = progressState(paciente)
  const dim = size === 'lg' ? 18 : 13

  return (
    <Stack direction="row" gap={2} align="center">
      <LiquidBubble size={dim} color={st.color} />
      <Stack gap={0} style={{ minWidth: 0 }}>
        <span
          style={{
            fontSize: size === 'lg' ? 'var(--text-body-sm)' : 'var(--text-caption)',
            fontWeight: 'var(--weight-medium)',
            color: st.color,
          }}
        >
          {st.label}
        </span>
        {size === 'lg' && (
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>{st.note}</span>
        )}
      </Stack>
    </Stack>
  )
}
