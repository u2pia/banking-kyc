// Builds dist/ from src/ with Node's own TypeScript type stripping, so the project needs no dependencies.
// It strips types only; it does not type-check. Relative `.ts` imports are rewritten to `.js`.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { dirname, join, relative } from 'node:path'

const source = 'src'
const output = 'dist'
const files = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(join(directory, entry.name)) : entry.name.endsWith('.ts') ? [join(directory, entry.name)] : [])

rmSync(output, { recursive: true, force: true })
for (const file of files(source)) {
  const code = stripTypeScriptTypes(readFileSync(file, 'utf8'), { mode: 'strip' })
    .replace(/(from\s+|import\s*\(\s*)(['"])(\.{1,2}\/[^'"]+)\.ts\2/gu, '$1$2$3.js$2')
  const target = join(output, relative(source, file)).replace(/\.ts$/u, '.js')
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, code)
  console.log(`built ${target}`)
}
