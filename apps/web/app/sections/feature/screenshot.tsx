import { forwardRef, type ComponentProps } from "react";
import { CloudUpload, Fingerprint, LockIcon, RefreshCw } from "lucide-react";
import Paragraph from "~/components/core/paragraph";
import Section from "~/components/page";

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
    },
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

export default ({ ...props }: ComponentProps<typeof Section>) => (
    <Section {...props}>
        <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base/7 font-semibold dark:text-indigo-400 text-indigo-600">Everything you need</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-5xl lg:text-balance">
                No server? No problem.
            </p>
            <Paragraph size="lg" className="mt-6">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis.
            </Paragraph>
        </div>
        <div className=" pt-16 overflow-hidden relative">
            <div>
                <img className="dark:hidden ring-gray-900/10 ring-1 shadow-2xl -mb-[12%] rounded-md" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75" />
                <img className="hidden dark:block ring-white/10 ring-1 shadow-2xl rounded-md -mb-[12%] h-auto max-w-full" src="https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75" />
            </div>
            <div className="relative pt-[7%] from-white dark:from-gray-900 to-transparent bg-linear-to-t" />
        </div>
        <div className="mt-16 sm:mt-20 md:mt-24 max-w-2xl lg:max-w-none  mx-auto">
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