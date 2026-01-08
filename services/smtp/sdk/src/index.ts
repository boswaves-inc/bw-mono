import { Element } from './gen/elements'
export { Smtp } from './client'
export * from './gen/routes'

// export const queue = <const C extends readonly Element[]>({ }: {
//     to_emails: string[]
//     cc_emails?: string[] | undefined
//     bcc_emails?: string[] | undefined
//     content: C
// }) => {
//     //
// };

// queue({
//     to_emails: [
//         'admin@example.com'
//     ],
//     content: [
//         {
//             type: 'button',
//             content: 'Click me'
//         },
//         {
//             type: 'markdown',
//             content: '# Markdown header'
//         },
//     ]
// })