import { faInfo, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { FC, ReactNode, useState } from 'react'
import { Alert, Button, Tabs, Textarea } from 'react-daisyui'
import ReactMarkdown from 'react-markdown'
import { Link } from './link'

export type MarkdownDisplayProps = {
  className?: string
  info?: {
    action?: () => void
    text: ReactNode
    icon?: IconDefinition
  }
  children: string
}
const MarkdownDisplay: FC<MarkdownDisplayProps> = ({
  children,
  info,
  className,
}) => (
  <div className={classNames('relative', className)}>
    {info && (
      <Button
        className='absolute -right-2 gap-x-2 opacity-60 hover:opacity-100'
        color='primary'
        onClick={info.action}
        startIcon={info.icon && <FontAwesomeIcon icon={info.icon} />}
        size='sm'
      >
        {info.text}
      </Button>
    )}
    <ReactMarkdown
      className={classNames(
        'prose prose-headings:mt-0 prose-headings:text-primary',
        'prose-p:text-neutral-content',
        'prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg',
        'prose-a:font-bold prose-a:text-secondary prose-a:no-underline prose-a:hover:text-primary'
      )}
      linkTarget='_blank'
    >
      {children}
    </ReactMarkdown>
  </div>
)

export type MarkdownEditorProps = {
  text: string
  onTextChange: (text: string) => void
}
type EditorTabs = 'editor' | 'preview'

const EditorTextArea: FC<MarkdownEditorProps & { className?: string }> = ({
  text,
  onTextChange,
  className,
}) => (
  <Textarea
    className={classNames('max-h-96 rounded-xl', className)}
    rows={10}
    color='primary'
    value={text}
    onChange={(e) => onTextChange(e.target.value)}
  />
)
const TabbedEditor: FC<MarkdownEditorProps> = ({ text, onTextChange }) => {
  const [active, setActive] = useState<EditorTabs>('editor')

  return (
    <>
      <Tabs boxed value={active} onChange={setActive} size='lg'>
        <Tabs.Tab className='w-1/2' value='editor' size='md'>
          Editor
        </Tabs.Tab>
        <Tabs.Tab className='w-1/2' value='preview'>
          Preview
        </Tabs.Tab>
      </Tabs>
      {active === 'editor' ? (
        <EditorTextArea
          className='w-full'
          text={text}
          onTextChange={onTextChange}
        />
      ) : (
        <MarkdownDisplay className='rounded-2xl border border-primary bg-base-300 p-3'>
          {text}
        </MarkdownDisplay>
      )}
    </>
  )
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({ text, onTextChange }) => {
  return (
    <>
      <TabbedEditor text={text} onTextChange={onTextChange} />
      <Alert
        className='wrap bg-base-100 italic'
        icon={<FontAwesomeIcon icon={faInfo} />}
      >
        <span>
          You can format your text in{' '}
          <Link
            className='italic'
            href='https://www.markdownguide.org/cheat-sheet/'
            target='_blank'
            highlight
          >
            Markdown Syntax
          </Link>
        </span>
      </Alert>
    </>
  )
}

export const Markdown = {
  Display: MarkdownDisplay,
  Editor: MarkdownEditor,
}
