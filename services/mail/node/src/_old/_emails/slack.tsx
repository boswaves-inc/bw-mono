// import z from 'zod/v4'
// import { Html } from '~/_components/elements/html'
// import { template } from '~/utils'
// import { Img, Section, Text } from '@react-email/components'
// import { Heading } from '~/_components/elements/typography'
// import Footer from '~/_components/sections/footer'

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

//         <Heading className="text-[#1d1c1d] text-4xl sm:text-4xl font-bold my-7.5 mx-0 p-0 leading-10.5">
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


//         <Text className="text-xl mb-7.5">
//             Your confirmation code is below - enter it in your open browser
//             window and we'll help you get signed in.
//         </Text>
//         <Section className="bg-[rgb(245,244,245)] rounded mb-7.5 py-10 px-2.5">
//             <Text className="text-3xl leading-6 text-center align-middle">
//                 {otp}
//             </Text>
//         </Section>

//         <Text className="text-black text-sm leading-6">
//             If you didn't request this email, there's nothing to worry about,
//             you can safely ignore it.
//         </Text>

//         <Footer />
//     </Html>
// ))

// export { handler }
// export default render