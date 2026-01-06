import { ComponentProps } from "react"
import { cn } from "../utils"
import { MinusIcon } from 'lucide-react'

export const OTP = () => {
    return (
        <div className=" inline-flex gap-1 w-fit max-w-md justify-center">
            <div className="flex items-center fit gap-1">
                000123
                {/* <OTPGroup>
                    <OTPSlot first >
                        0
                    </OTPSlot>
                    <OTPSlot >
                        0
                    </OTPSlot>
                    <OTPSlot last >
                        0
                    </OTPSlot>
                </OTPGroup>
                <OTPSeparator />
                <OTPGroup>
                    <OTPSlot first >
                        1
                    </OTPSlot>
                    <OTPSlot >
                        2
                    </OTPSlot>
                    <OTPSlot last >
                        3
                    </OTPSlot>
                </OTPGroup> */}
            </div>
        </div>
    )
}

const OTPGroup = ({ className, ...props }: React.ComponentProps<"div">) => (
    <div className={cn("flex items-center", className)} {...props} />
)

const OTPSlot = ({ first, last, className, ...props }: React.ComponentProps<"div"> & { first?: boolean, last?: boolean }) => (
    <div  {...props} className={cn(" dark:bg-input/30 border-input relative flex size-10 lg:size-12 items-center justify-center border-y border-r text-base/7 shadow-xs transition-all outline-none",
        className,
        {
            'rounded-l-md border-l': first,
            'rounded-r-md': last,
        },
    )} />
)

const OTPSeparator = ({ ...props }: ComponentProps<'div'>) => (
    <div role="separator" {...props}>
        <MinusIcon />
    </div>
)
