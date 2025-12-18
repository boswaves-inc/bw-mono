import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Minus, Plus } from "lucide-react";
import { forwardRef, type ComponentProps } from "react";
import Paragraph from "~/components/core/paragraph";
import { Heading } from "~/components/core/v2/typography";
import Section from "~/components/page";

const config = [
    {
        question: "What's the best thing about Switzerland?",
        awnser: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat."
    },
    {
        question: "What's the best thing about Switzerland?",
        awnser: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat."
    },
    {
        question: "What's the best thing about Switzerland?",
        awnser: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat."
    },
    {
        question: "What's the best thing about Switzerland?",
        awnser: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat."
    },
]

export default ({ ...props }: ComponentProps<typeof Section>) => (
    <Section {...props}>
        <Heading size="h1">Frequently asked questions</Heading>
        <div>
            {config.map((x, i) => (
                <div key={`question-${i}`} className="first:mt-16 first:pt-0 py-6 border-b border-gray-900/10 dark:border-white/10">
                    <Disclosure>
                        <DisclosureButton className={'dark:text-white group w-full text-gray-900 text-left justify-between items-start flex'}>
                            <span className="font-semibold text-base/7">
                                {x.question}
                            </span>
                            <div className=" ml-4">
                                <Minus className='group-aria-expanded:block hidden ' />
                                <Plus className='group-aria-expanded:hidden block ' />
                            </div>
                        </DisclosureButton>
                        <DisclosurePanel className={'mt-2 pr-6'}>
                            <Paragraph>
                                {x.awnser}
                            </Paragraph>
                        </DisclosurePanel>
                    </Disclosure>
                </div>
            ))}
        </div>
    </Section>
)

