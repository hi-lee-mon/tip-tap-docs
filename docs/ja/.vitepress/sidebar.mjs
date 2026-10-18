const SITE_URL = 'https://tiptap.dev/docs'

const toLink = (relPath) => '/' + relPath.replace(/index\.md$/, '').replace(/\.md$/, '')

const pageItem = (relPath, readTitle, isExcluded) => {
  if (isExcluded(relPath)) {
    const route = relPath.replace(/\.md$/, '')
    return { text: `${route.split('/').at(-1)}（未翻訳・原文）`, link: `${SITE_URL}/${route}` }
  }
  return { text: readTitle(relPath), link: toLink(relPath) }
}

const buildItems = (dir, files, readTitle, isExcluded) => {
  const children = new Map()
  for (const f of files) {
    const name = f.slice(dir.length + 1).split('/')[0]
    if (!children.has(name)) children.set(name, [])
    children.get(name).push(f)
  }
  return [...children.keys()].sort().map((name) => {
    const group = children.get(name)
    if (name.endsWith('.md')) return pageItem(group[0], readTitle, isExcluded)
    const sub = `${dir}/${name}`
    const index = `${sub}/index.md`
    const rest = group.filter((f) => f !== index)
    return {
      text: group.includes(index) ? readTitle(index) : name,
      ...(group.includes(index) && { link: toLink(index) }),
      collapsed: true,
      items: buildItems(sub, rest, readTitle, isExcluded),
    }
  })
}

export const buildSidebar = (sections, files, readTitle, isExcluded = () => false) =>
  sections.map(([dir, label]) => ({
    text: label,
    collapsed: true,
    items: buildItems(dir, files.filter((f) => f.startsWith(`${dir}/`)), readTitle, isExcluded),
  }))
