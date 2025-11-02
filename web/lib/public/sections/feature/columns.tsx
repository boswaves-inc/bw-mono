import { forwardRef } from "react";
import { CloudUpload, Fingerprint, LockIcon, RefreshCw } from "lucide-react";
import Paragraph from "~/components/paragraph";
import type { SectionProps } from "~/components/section";
import Section from "~/components/section";

const features = [
    {
        name: 'Push to deploy',
        description:
            'Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.',
        icon: CloudUpload,
    },
    {
        name: 'SSL certificates',
        description:
            'Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.',
        icon: LockIcon,
    },
    {
        name: 'Simple queues',
        description:
            'Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.',
        icon: RefreshCw,
    }
]

const FeatureColumn = forwardRef<HTMLElement, SectionProps>((props, ref) => {
    return (
        <Section ref={ref} {...props}>
            <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-base/7 font-semibold dark:text-indigo-400 text-indigo-600">Deploy faster</h2>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-5xl lg:text-balance">
                    Everything you need to deploy your app
                </p>
                <Paragraph size="lg" className="mt-6">
                    Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum
                    pulvinar et feugiat blandit at. In mi viverra elit nunc.
                </Paragraph>
            </div>
            <div className="mt-16 sm:mt-20 lg:mt-24 max-w-2xl lg:max-w-none  mx-auto">
                <dl className="grid  grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3 lg:gap-y-16">
                    {features.map((feature) => (
                        <div key={feature.name} className="relative">
                            <dt className="text-base/7 flex items-center gap-4 font-semibold dark:text-white text-gray-900">
                                <div className="flex size-6 items-center justify-center rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <feature.icon aria-hidden="true" className="size-6" />
                                </div>
                                {feature.name}
                            </dt>
                            <dd className="mt-2 text-base/7  dark:text-gray-400 text-gray-600">{feature.description}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </Section>
    )
})

export default FeatureColumn;