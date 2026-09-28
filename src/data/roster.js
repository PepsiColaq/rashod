export const GROUP_CODE = '0903-ПД3'

/** Фамилия — для текста расхода; полное ФИО — для подсказки модели */
export const ROSTER = [
  { surname: 'Аредакова', fullName: 'Аредакова Ангелина Артуровна' },
  { surname: 'Брюкин', fullName: 'Брюкин Бекзод Михайлович' },
  { surname: 'Бендас', fullName: 'Бендас Анастасия' },
  { surname: 'Боджуа', fullName: 'Боджуа Аманда Руслановна' },
  { surname: 'Войцеховский', fullName: 'Войцеховский Никита Владимирович' },
  { surname: 'Вольская', fullName: 'Вольская Виктория Андреевна' },
  { surname: 'Денисенко', fullName: 'Денисенко Руслан Анатольевич' },
  { surname: 'Жирикова', fullName: 'Жирикова Милана Эдуардовна' },
  { surname: 'Исмаилов', fullName: 'Исмаилов Алексей Александрович' },
  { surname: 'Камышева', fullName: 'Камышева Стефания Александровна' },
  { surname: 'Клименко', fullName: 'Клименко Семен Никитич' },
  { surname: 'Кобзева', fullName: 'Кобзева Анастасия Антоновна' },
  { surname: 'Коробейникова', fullName: 'Коробейникова Екатерина Дмитриевна' },
  { surname: 'Крупенина', fullName: 'Крупенина Виктория Дмитриевна' },
  { surname: 'Ломакин', fullName: 'Ломакин Даниил Антонович' },
  { surname: 'Матвеев', fullName: 'Матвеев Матвей Геннадьевич' },
  { surname: 'Николаев', fullName: 'Николаев Степан Андреевич' },
  { surname: 'Пронин', fullName: 'Пронин Владислав Александрович' },
  { surname: 'Тюшкин', fullName: 'Тюшкин Максим Андреевич' },
  { surname: 'Цирульник', fullName: 'Цирульник Данила Андреевич' },
  { surname: 'Шакирова', fullName: 'Шакирова Екатерина Игоревна' },
  { surname: 'Ясинецкая', fullName: 'Ясинецкая Дарина Дмитриевна' },
]

export const MARKS = {
  present: { label: 'Есть (+)', short: '+' },
  absent: { label: 'Нет (−)', short: '−' },
  duty: { label: 'Наряд (Н)', short: 'Н' },
  excused: { label: 'Отпущен (О)', short: 'О' },
  sick: { label: 'Болен (Б)', short: 'Б' },
  unknown: { label: 'Н/П', short: 'Н/П' },
  unauthorized: { label: 'Самоволка (С)', short: 'С' },
  empty: { label: 'Не распознано', short: '?' },
}

/** Быстрые кнопки в карточке курсанта */
export const QUICK_MARKS = ['present', 'absent', 'duty']

