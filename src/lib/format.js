import { GROUP_CODE, MARKS } from './data/roster.js'

/**
 * @param {{
 *   group?: string,
 *   dateLabel: string,
 *   people: Array<{
 *     surname: string,
 *     mark: string,
 *     reason?: string,
 *     event?: boolean
 *   }>
 * }} state
 */
export function buildRashodText(state) {
  const group = state.group || GROUP_CODE
  const people = state.people || []
  const onList = people.length

  const duty = people.filter((p) => !p.event && p.mark === 'duty')
  const event = people.filter((p) => p.event)
  const absent = people.filter(
    (p) =>
      !p.event &&
      p.mark !== 'duty' &&
      (p.mark === 'absent' ||
        p.mark === 'excused' ||
        p.mark === 'sick' ||
        p.mark === 'unknown' ||
        p.mark === 'unauthorized'),
  )

  // По списку = на лицо + отсутствуют + мероприятие + наряд
  const naLitso = onList - absent.length - event.length - duty.length

  const lines = [`Расход группы ${group}:`, `По списку: ${onList}`, `На лицо: ${naLitso}`]

  if (absent.length) {
    lines.push(`Отсутствуют: ${absent.length}`)
    for (const p of absent) {
      const reason = (p.reason || '').trim()
      lines.push(reason ? `${p.surname} (${reason})` : p.surname)
    }
  } else {
    lines.push('Отсутствуют: 0')
  }

  lines.push('')
  lines.push(`Мероприятие: ${event.length}`)
  for (const p of event) lines.push(p.surname)

  lines.push('')
  lines.push(`Наряд: ${duty.length}`)
  for (const p of duty) lines.push(p.surname)

  return lines.join('\n').trimEnd()
}

export function markLabel(mark) {
  return MARKS[mark]?.label || mark
}
