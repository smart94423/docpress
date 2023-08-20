import React from 'react'
import { assert, Emoji, EmojiName } from './utils/server'

export { parseTitle }
export { getHeadingsWithProcessedTitle }

export type Heading = Omit<HeadingDefinition, 'title' | 'titleInNav'> & {
  title: JSX.Element
  titleInNav: JSX.Element
  parentHeadings: (Heading | HeadingDetached)[]
  // Not sure why this is needed
  isListTitle?: true
  sectionTitles?: string[]
}
export type HeadingDetached = Omit<Heading, 'level' | 'parentHeadings'> & {
  level: 2
  parentHeadings: null
}
export type HeadingDetachedDefinition = {
  url: string
  title: string | JSX.Element
  sectionTitles?: string[]
}
export type HeadingDefinition = HeadingBase &
  (
    | ({ level: 1; titleEmoji: EmojiName } & HeadingAbstract)
    | ({ level: 4 } & HeadingAbstract)
    | {
        level: 2
        isListTitle?: true
        sectionTitles?: string[]
        url: null | string
      }
    | {
        level: 3
        url: null | string
      }
  )
type HeadingBase = {
  title: string
  level: number
  url?: null | string
  titleDocument?: string
  titleInNav?: string
  // titleSize?: string
}
type HeadingAbstract = {
  url?: undefined
  titleDocument?: undefined
  titleInNav?: undefined
}

function getHeadingsWithProcessedTitle(config: {
  headings: HeadingDefinition[]
  headingsDetached: HeadingDetachedDefinition[]
}): {
  headingsProcessed: Heading[]
  headingsDetachedProcessed: HeadingDetached[]
} {
  const headingsWithoutParent: Omit<Heading, 'parentHeadings'>[] = config.headings.map((heading: HeadingDefinition) => {
    const titleProcessed: JSX.Element = parseTitle(heading.title)

    const titleInNav = heading.titleInNav || heading.title
    let titleInNavProcessed: JSX.Element
    if ('isListTitle' in heading) {
      assert(heading.isListTitle === true)
      let titleParsed: JSX.Element = parseTitle(titleInNav)
      // if (heading.titleSize) {
      //   titleParsed = React.createElement('span', { style: { fontSize: heading.titleSize } }, titleParsed)
      // }
      titleInNavProcessed = React.createElement(React.Fragment, {}, getListPrefix(), titleParsed)
    } else {
      titleInNavProcessed = parseTitle(titleInNav)
    }
    if ('titleEmoji' in heading) {
      assert(heading.titleEmoji)
      titleInNavProcessed = withEmoji(heading.titleEmoji, titleInNavProcessed)
    }

    const headingProcessed: Omit<Heading, 'parentHeadings'> = {
      ...heading,
      title: titleProcessed,
      titleInNav: titleInNavProcessed
    }
    return headingProcessed
  })

  const headingsProcessed: Heading[] = []
  headingsWithoutParent.forEach((heading) => {
    const parentHeadings = findParentHeadings(heading, headingsProcessed)
    headingsProcessed.push({ ...heading, parentHeadings })
  })

  const headingsDetachedProcessed = config.headingsDetached.map((headingsDetached) => {
    const { url, title } = headingsDetached
    assert(
      headingsProcessed.find((heading) => heading.url === url) === undefined,
      `remove ${headingsDetached.url} from headingsDetached`
    )
    const titleProcessed = typeof title === 'string' ? parseTitle(title) : title
    return {
      ...headingsDetached,
      level: 2 as const,
      title: titleProcessed,
      titleInNav: titleProcessed,
      parentHeadings: null
    }
  })

  assertHeadingsUrl([...headingsProcessed, ...headingsDetachedProcessed])
  return { headingsProcessed, headingsDetachedProcessed }
}

function findParentHeadings(heading: Omit<Heading, 'parentHeadings'>, headings: Heading[]) {
  const parentHeadings: Heading[] = []
  let levelCurrent = heading.level
  let listTitleParentFound = false
  headings
    .slice()
    .reverse()
    .forEach((parentCandidate) => {
      let isListTitleParent = false
      if (
        !listTitleParentFound &&
        levelCurrent === heading.level &&
        parentCandidate.level === heading.level &&
        !parentCandidate.isListTitle &&
        heading.isListTitle
      ) {
        isListTitleParent = true
        listTitleParentFound = true
      }

      const isParent = parentCandidate.level < levelCurrent

      if (isParent || isListTitleParent) {
        levelCurrent = parentCandidate.level
        parentHeadings.push(parentCandidate)
      }
    })
  return parentHeadings
}

function assertHeadingsUrl(headings: { url?: null | string }[]) {
  headings.forEach((heading) => {
    if (heading.url) {
      const { url } = heading
      assert(url.startsWith('/'))
    }
  })
}

function getListPrefix() {
  const nonBreakingSpace = String.fromCodePoint(0x00a0)
  const bulletPoint = String.fromCodePoint(0x2022)
  return nonBreakingSpace + bulletPoint + nonBreakingSpace
}

function parseTitle(title: string): JSX.Element {
  type Part = { nodeType: 'text' | 'code'; content: string }
  const parts: Part[] = []
  let current: Part | undefined
  title.split('').forEach((letter) => {
    if (letter === '`') {
      if (current?.nodeType === 'code') {
        // </code>
        parts.push(current)
        current = undefined
      } else {
        // <code>
        if (current) {
          parts.push(current)
        }
        current = { nodeType: 'code', content: '' }
      }
    } else {
      if (!current) {
        current = { nodeType: 'text', content: '' }
      }
      current.content += letter
    }
  })
  if (current) {
    parts.push(current)
  }

  const titleJsx = React.createElement(
    React.Fragment,
    {},
    ...parts.map((part, i) =>
      React.createElement(part.nodeType === 'code' ? 'code' : React.Fragment, { key: i }, part.content)
    )
  )

  return titleJsx
}

function withEmoji(name: EmojiName, title: string | JSX.Element): JSX.Element {
  const style = { fontSize: '1.4em' }
  //return React.createElement(React.Fragment, null, Emoji({ name, style }), ' ', title)
  return React.createElement(
    'span',
    { style },
    Emoji({ name }),
    ' ',
    React.createElement('span', { style: { fontSize: '1rem' } }, title)
  )
}