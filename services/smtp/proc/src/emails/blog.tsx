import z from 'zod/v4'
import { template } from '~/utils'
import { Html } from '~/components/elements/html'
import { Img, Section } from '@react-email/components'
import { Heading, Paragraph, Subheading } from '~/components/elements/typography'
import Footer from '~/components/sections/footer'

const schema = z.object({
    otp: z.string()
})

const { handler, render } = template('recover_account', schema, ({
    otp = "000-123"
}) => (
    <Html>
        <Section className="mt-2">
            <Img
                src={`https://cdn.sanity.io/images/ssqh4ksj/production/c734dd394de943820a25b4b96eace0855ab44749-2016x1344.png?w=2016&h=1344&auto=format`}
                className='aspect-3/2 w-full object-cover rounded-2xl shadow-xl mb-10'
                alt="Slack"
            />
        </Section>
        <Subheading>
            Thursday, August 29, 2024
        </Subheading>
        <Heading className='mt-0'>
            GDPR is just a suggestion - A guide to European privacy laws
        </Heading>
        <Paragraph  >
            Since its introduction in 2018, GDPR has completely upturned the data collection field and needlessly forced a lot of respectable companies out of business. At Radiant, we've built our reputation on evading the reach of privacy regulators, and so we thought it's about time we shared our strategies with the broader community.
        </Paragraph>
        <Paragraph >
            Generally, we employ three main techniques:
        </Paragraph>
        <ul className='list-disc pl-4 text-base/8 marker:text-gray-400'>
            <li className='my-2 pl-2 has-[br]:mb-8'>
                <strong className='font-semibold text-gray-950'>Jusristiction avoidance. </strong>
                Using service providers and shell companies to avoid being classified as operating in Europe.
            </li>
            <li className='my-2 pl-2 has-[br]:mb-8'>
                <strong className='font-semibold text-gray-950'>Data replication. </strong>
                Storing de-anonymized data in replica databases that are completely obscured to anyone outside the company.
            </li>
            <li className='my-2 pl-2 has-[br]:mb-8'>
                <strong className='font-semibold text-gray-950'>Deceit and obfuscation. </strong>
                Lying to regulators and customers about our compliance and employing a Data Protection Officer who is technically 'fictitious.'
            </li>
        </ul>
        <Paragraph >
            This might seem like a complex setup, but this is just the setup that works for Radiant. It's important to remember to use a strategy that works for your situation and scale — picking and choosing the aspects that seem the most appropriate.
        </Paragraph>
        <Heading size='h2'>
            Jurisdiction avoidance
        </Heading>
        <Paragraph >
            Avoiding actually ever doing business in Europe is the easiest way to skirt the regulations, but how do you continue selling to European customers? Well, at Radiant, we use a data storage company called Sly Data that is in charge of managing all of our European user data. Technically, we license our data from Sly and offload all our storage to them. This is important in shielding us from liability and obscuring any ownership.
        </Paragraph>
        <Paragraph >
            Sly is incorporated in Europe and is subject to GDPR, but they offer a man-in-the-middle API that allows us to intercept traffic heading to their servers before it is anonymised. We then siphon that data off into a series of shell companies and onion routers before it ends up in our data storage.
        </Paragraph>
        <Paragraph >
            The genius of this approach is that we avoid any responsibility for storing European customer data, and when authorities look into Sly, everything seems compliant.
        </Paragraph>

        <Footer />
    </Html>
))

export { handler }
export default render