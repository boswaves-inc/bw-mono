// import z from 'zod/v4'
// import { Button } from '~/_components/elements/button'
// import { Html } from '~/_components/elements/html'
// import { template } from '~/utils'
// import { Column, Img, Link, Row, Section, Text } from '@react-email/components'
// import { Heading, Lead, Paragraph, Subheading } from '~/_components/elements/typography'
// // import { Footer } from '~/components/blocks/button'
// // import { OTP } from '~/components/blocks/otp'

// const schema = z.object({
//     otp: z.string()
// })

// const { handler, render } = template('recover_account', schema, ({
//     otp = "000-123"
// }) => (
//     <Html>
//         <Section className="mt-8">
//             <Img
//                 src={`https://react-email-demo-8li1l9xfn-resend.vercel.app/static/slack-logo.png`}
//                 width="120"
//                 height="36"
//                 alt="Slack"
//             />
//         </Section>

//         <Heading>
//             Confirm your email address
//         </Heading>
//         {/* <Subheading>
//             Subheading
//         </Subheading>
//         <Lead>
//             Lead
//         </Lead>
//         <Paragraph>
//             this is a paragraph
//         </Paragraph> */}


//         <Paragraph size='lg'>
//             Your confirmation code is below - enter it in your open browser
//             window and we'll help you get signed in.
//         </Paragraph>

//         <div style={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} className="rounded-xl flex overflow-hidden justify-center items-center bg-white border shadow-black border-black/5">
//             <div className='p-7 sm:p-11 space-y-8'>
//                 {/* <OTP /> */}
//             </div>
//         </div>

//         <Paragraph>
//             If you didn't request this email, there's nothing to worry about,
//             you can safely ignore it.
//         </Paragraph>

//         {/* <Footer /> */}
//     </Html>
// ))

// export { handler }
// export default render