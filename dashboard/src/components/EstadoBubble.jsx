import React from 'react'
import { Stack, LiquidBubble } from '@agustin/aqus'
import { treatmentState } from '../data/helpers.js'

/**
 * Organic liquid blob standing in for the patient's current treatment state —
 * a feeling, not a metric. Color is always paired with a word (Von Restorff /
 * accessibility: never color alone). `size="lg"` shows the note too.
 */
export function EstadoBubble({ paciente, size = 'sm' }) {
  const st = treatmentState(paciente)
  const dim = size === 'lg' ? 20 : 14

  return (
    <Stack direction="row" gap={2} align="center">
      <LiquidBubble size={dim} color={st.color} />
      <Stack gap={0} style={{ minWidth: 0 }}>
        <span
          style={{
            fontSize: size === 'lg' ? 'var(--text-body-sm)' : 'var(--text-caption)',
            fontWeight: 'var(--weight-medium)',
            color: 'var(--text-primary)',
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
