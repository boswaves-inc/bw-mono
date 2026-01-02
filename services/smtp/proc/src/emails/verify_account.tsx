import z from 'zod/v4'
import { Email } from '~/components/email'
import { template } from '~/utils'

const schema = z.object({
    otp: z.string()
})

const { handler, render } = template('recover_account', schema, ({
    otp = "000-123"
}) => (
    <Email>
        <h1 className='text-brand'>
            Verify Account
        </h1>
        <h1 className='text-black'>
            {otp}
        </h1>
    </Email>
))

export { handler }
export default render