import { createElement, useRef, type ComponentProps } from "react"
import Primitive, { type ExtraProps } from "react-markdown"
import { Link } from "react-router"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import { cn } from "~/utils/class"

interface MarkdownProps extends Omit<ComponentProps<'div'>, 'children'> {
    content: string
}

export const Markdown = ({ className, content }: MarkdownProps) => {
    return (
        <div className={cn("markdown", className)}>
            <Primitive
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{ p, h2, h3, blockquote, img, hr, ol, ul, li, strong, link, a, code, pre, table, th, td }}
            >
                {content}
            </Primitive>
        </div>
    )
}

const pre = ({ children, node, ...props }: ComponentProps<'pre'> & ExtraProps) => createElement('pre', {
    ...props,
    className: "[&>span]:w-full [&>span>span]:p-6 [&>span>span]:text-gray-700 [&>span>span]:bg-white [&>span]:shadow-md"
}, children)

const p = ({ children, node, ...props }: ComponentProps<'p'> & ExtraProps) => createElement('p', {
    ...props,
    className: 'my-10 text-base/8 first:mt-0 last:mb-0'
}, children)

const h2 = ({ children, node, ...props }: ComponentProps<'h2'> & ExtraProps) => createElement('h2', {
    ...props,
    className: 'mt-12 mb-10 text-2xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0'
}, children)

const h3 = ({ children, node, ...props }: ComponentProps<'h3'> & ExtraProps) => createElement('h3', {
    ...props,
    className: 'mt-12 mb-10 text-xl/8 font-medium tracking-tight text-gray-950 first:mt-0 last:mb-0'
}, children)

const blockquote = ({ children, node, ...props }: ComponentProps<'blockquote'> & ExtraProps) => createElement('blockquote', {
    ...props,
    className: "my-10 border-l-2 border-l-gray-300 pl-6 text-base/8 text-gray-950 first:mt-0 last:mb-0"
}, children)

const img = ({ children, node, ...props }: ComponentProps<'img'> & ExtraProps) => createElement('img', {
    ...props,
    className: "w-full rounded-2xl"
}, children)

const hr = ({ children, node, ...props }: ComponentProps<'hr'> & ExtraProps) => createElement('hr', {
    ...props,
    className: "my-8 border-t border-gray-200"
}, children)

const ol = ({ children, node, ...props }: ComponentProps<'ol'> & ExtraProps) => createElement('ol', {
    ...props,
    className: "list-decimal pl-4 text-base/8 marker:text-gray-400"
}, children)

const ul = ({ children, node, ...props }: ComponentProps<'ul'> & ExtraProps) => createElement('ul', {
    ...props,
    className: "list-disc pl-4 text-base/8 marker:text-gray-400"
}, children)

const li = ({ children, node, ...props }: ComponentProps<'li'> & ExtraProps) => createElement('li', {
    ...props,
    className: "my-2 pl-2 has-[br]:mb-8"
}, children)

const strong = ({ children, node, ...props }: ComponentProps<'strong'> & ExtraProps) => createElement('strong', {
    ...props,
    className: "font-semibold text-gray-950"
}, children)

const link = ({ href = '', children }: ComponentProps<'link'> & ExtraProps) => (
    <Link to={href} className="font-medium text-gray-950 underline decoration-gray-400 underline-offset-4 data-hover:decoration-gray-600">
        {children}
    </Link>
)

const a = ({ href = '', children }: ComponentProps<'a'> & ExtraProps) => (
    <Link to={href} className="font-medium text-gray-950 underline decoration-gray-400 underline-offset-4 data-hover:decoration-gray-600">
        {children}
    </Link>
)

const table = ({ children }: ComponentProps<'table'> & ExtraProps) => (
    <table className="w-full! my-10! border-collapse gap-0! border-spacing-0!">
        {children}
    </table>
)

const th = ({ children, className }: ComponentProps<'th'> & ExtraProps) => (
    <th className={cn("text-center p-1 px-3 border-collapse border", className)}>
        {children}
    </th>
)

const td = ({ children, className }: ComponentProps<'td'> & ExtraProps) => (
    <td className={cn("text-left p-1 px-3 border", className)}>
        {children}
    </td>
)

const code = ({ className, children, node, ...props }: ComponentProps<'code'> & ExtraProps) => {
    const ref = useRef<HTMLElement>(null);
    const match = /language-(\w+)/.exec(className || '');
    const lang = match && match[1];

    return (
        <span className="relative overflow-hidden inline-flex flex-col items-start rounded-3xl border border-gray-300 bg-gray-50 text-sm/6 font-medium text-gray-500">
            {lang && (
                <span className='items-center peer w-full z-10 text-xs/5 flex justify-between pb-0!'>
                    {lang}
                </span>
            )}
            <span className='overflow-y-auto overflow-x-auto px-2 h-fit w-full relative '>
                <code ref={ref} className={cn(className, "whitespace-pre! py-0")}>
                    {children}
                </code>
            </span>
        </span>
    )
}