// tongyun: 纯函数自检（不调网络）
import { gradeQuizAnswer, pickWrongWordsForQuiz } from './learn-client.ts'

const errors: string[] = []

function assert(cond: boolean, msg: string) {
  if (!cond) errors.push(msg)
}

const words = [
  { word: 'Abandon', trans: [{ cn: '放弃' }] },
  { word: 'abandon', trans: [{ cn: '抛弃' }] },
  { word: 'ability', trans: [{ cn: '能力' }] },
  ...Array.from({ length: 25 }, (_, i) => ({
    word: `w${i}`,
    trans: [{ cn: `义${i}` }],
  })),
]

const picked = pickWrongWordsForQuiz(words, 20)
assert(picked.length === 20, `期望 20，实际 ${picked.length}`)
assert(picked[0].word === 'Abandon', `首词应为 Abandon，实际 ${picked[0]?.word}`)
assert(picked[0].cn === '放弃', `首词 cn 应为 放弃`)
assert(!picked.some((w, i) => i > 0 && w.word.toLowerCase() === 'abandon'), 'abandon 应去重')

assert(gradeQuizAnswer('  Abandon ', 'abandon') === true, 'cloze 大小写不敏感应判对')
assert(gradeQuizAnswer('ability', 'abandon') === false, '错误答案应判错')
assert(gradeQuizAnswer('', 'abandon') === false, '空输入应判错')

if (errors.length) {
  console.error('FAIL')
  for (const e of errors) console.error('-', e)
  process.exit(1)
}
console.log('PASS learn-client.quiz.check.ts')
