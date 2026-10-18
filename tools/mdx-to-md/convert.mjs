import { posix } from 'node:path'

const SITE_URL = 'https://tiptap.dev/docs'
const DEMO_URL = 'https://embed.tiptap.dev/preview'
const PRO_DEMO_URL = 'https://embed-pro.tiptap.dev/preview'

const CALLOUT_KINDS = { hint: 'TIP', info: 'NOTE', warning: 'WARNING', default: 'NOTE' }

const FENCE = /^\s*(```|~~~)/

export const toOutputPath = (relPath) => relPath.replace(/\.mdx$/, '.md')

const toRoute = (relPath) => relPath.replace(/\.mdx$/, '').replace(/\/index$/, '')

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1]

const resolveLink = (target, ctx) => {
  const [route, anchor] = target.replace(/^\/(docs\/)?/, '').split(/(?=#)/)
  const from = posix.dirname(toOutputPath(ctx.relPath))
  const found = [`${route}.md`, `${route}/index.md`].find((p) => ctx.outputs.has(p))
  if (found) return posix.relative(from, found) + (anchor ?? '')
  return `${SITE_URL}/${route}${anchor ?? ''}`
}

const rewriteLinks = (line, ctx) =>
  line
    .replace(/\]\((\/[^)\s]*)\)/g, (_, t) => `](${resolveLink(t, ctx)})`)
    .replace(/href="(\/[^"]*)"/g, (_, t) => `href="${resolveLink(t, ctx)}"`)

const parseFrontmatter = (src) => {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!m) return { title: undefined, body: src }
  const title = m[1].match(/^title:\s*(.*)$/m)?.[1].replace(/^['"]|['"]$/g, '')
  return { title, body: src.slice(m[0].length) }
}

// 開始行から終了の目印を含む行までを1つのタグとしてまとめる
const collectUntil = (lines, start, endMark) => {
  let end = start
  while (end < lines.length - 1 && !lines[end].includes(endMark)) end++
  return { block: lines.slice(start, end + 1), next: end + 1 }
}

// 単純に '/>' を探すと、属性に入れ子になった `{<Icon />}` で途中終了してしまう
const collectSelfClosing = (lines, start) => {
  let depth = 0
  let end = start
  for (; end < lines.length - 1; end++) {
    for (const ch of lines[end]) depth += ch === '{' ? 1 : ch === '}' ? -1 : 0
    if (depth === 0 && lines[end].trimEnd().endsWith('/>')) break
  }
  return { block: lines.slice(start, end + 1), next: end + 1 }
}

const dedent = (lines) => {
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length)
  const min = indents.length ? Math.min(...indents) : 0
  return lines.map((l) => l.slice(min))
}

const trimBlankEdges = (lines) => {
  const out = [...lines]
  while (out.length && !out[0].trim()) out.shift()
  while (out.length && !out.at(-1).trim()) out.pop()
  return out
}

const convertCallout = (block, ctx) => {
  const joined = block.join('\n')
  const open = joined.match(/<Callout\b[^>]*>/)[0]
  const inner = joined.slice(joined.indexOf(open) + open.length, joined.lastIndexOf('</Callout>'))
  const kind = CALLOUT_KINDS[attr(open, 'variant')] ?? 'NOTE'
  const title = attr(open, 'title')
  let inFence = false
  const body = dedent(trimBlankEdges(inner.split('\n'))).map((l) => {
    if (FENCE.test(l)) inFence = !inFence
    return inFence || FENCE.test(l) ? l : rewriteLinks(l, ctx)
  })
  // 空行を挟まないと、タイトルと本文が1つの段落につながって表示される
  const quoted = [`[!${kind}]`, ...(title ? [`**${title}**`, ''] : []), ...body]
  return quoted.map((l) => (l ? `> ${l}` : '>'))
}

const convertCodeDemo = (block) => {
  const tag = block.join(' ')
  const src = attr(tag, 'src')
  const url = src ?? (/\bisPro\b/.test(tag) ? PRO_DEMO_URL : DEMO_URL) + attr(tag, 'path')
  return [`[デモを開く](${url})`]
}

export const convertMdx = (source, ctx) => {
  const { title, body } = parseFrontmatter(source)
  const lines = body.split('\n')
  const out = []
  let inFence = false

  for (let i = 0; i < lines.length; ) {
    const line = lines[i]

    if (FENCE.test(line)) {
      inFence = !inFence
      out.push(line)
      i++
      continue
    }
    if (inFence) {
      out.push(line)
      i++
      continue
    }

    if (/^import\s.*\sfrom\s+['"].*['"];?\s*$/.test(line)) {
      i++
      continue
    }
    if (/^\s*<Callout\b/.test(line)) {
      const { block, next } = collectUntil(lines, i, '</Callout>')
      out.push(...convertCallout(block, ctx))
      i = next
      continue
    }
    if (/^\s*<CodeDemo\b/.test(line)) {
      const { block, next } = collectSelfClosing(lines, i)
      out.push(...convertCodeDemo(block))
      i = next
      continue
    }
    if (/^\s*<EnterpriseCalloutAuto\b/.test(line)) {
      i = collectSelfClosing(lines, i).next
      continue
    }
    if (/^\s*<\/?Checklist>\s*$/.test(line)) {
      i++
      continue
    }
    const checkbox = line.match(/^\s*<CheckboxItem>(.*)<\/CheckboxItem>\s*$/)
    if (checkbox) {
      out.push(`- [ ] ${rewriteLinks(checkbox[1], ctx)}`)
      i++
      continue
    }

    out.push(rewriteLinks(line, ctx))
    i++
  }

  const sourceUrl = `${SITE_URL}/${toRoute(ctx.relPath)}`
  const header = [`# ${title ?? ''}`, '', `> 原文: [${sourceUrl}](${sourceUrl})`, '']
  return [...header, ...out].join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}
