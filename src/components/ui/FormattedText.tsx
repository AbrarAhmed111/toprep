import { Fragment } from 'react'

// AI-generated explanations/questions occasionally include basic markdown
// emphasis (**bold**, *italic*, `code`). This renders just those inline
// forms — no lists/headings/links — since the text is always a short,
// single-purpose snippet, not a document.
const INLINE_MARKDOWN_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g

interface FormattedTextProps {
  text: string
}

export function FormattedText({ text }: FormattedTextProps) {
  const parts = text.split(INLINE_MARKDOWN_PATTERN).filter(Boolean)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={index}>{part.slice(1, -1)}</em>
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={index}
              className="rounded bg-surface-hover px-1 py-0.5 text-[0.85em]"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return <Fragment key={index}>{part}</Fragment>
      })}
    </>
  )
}
