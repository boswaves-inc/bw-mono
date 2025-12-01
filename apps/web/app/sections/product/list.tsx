import { type ComponentProps } from "react";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import Heading from "~/components/core/heading";
import Paragraph from "~/components/core/paragraph";
import { ButtonV2 } from "~/components/core/v2/button";
import Section from "~/components/section";


const products = [
    {
        id: 'Trend Pivots Profile',
        name: 'Trend Pivots Profile',
        description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'Trend Pivots Profile',
        name: 'Trend Pivots Profile',
        description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'Trend Pivots Profile',
        name: 'Trend Pivots Profile',
        description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'Trend Pivots Profile',
        name: 'Trend Pivots Profile',
        description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'Trend Pivots Profile',
        name: 'Trend Pivots Profile',
        description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'Trend Pivots Profile',
        name: 'Trend Pivots Profile',
        description: "trading indicator is a powerful tool designed to automatically detect and highlight filled and unfilled price gaps between regular trading sessions. It helps traders visually identify areas of strong market sentiment changes and provides a comprehensive dashboard showing detailed statistics about gap behavior and probabilities. Whether you're a day trader or swing trader, this indicator can help you understand how price gaps influence market direction and momentum.",
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    }
]

interface ProductListProps extends ComponentProps<typeof Section> {
    heading?: string
}

export default ({ heading, ...props }: ProductListProps) => (
    <Section {...props}>
        {heading && (
            <Heading size="h3">
                {heading}
            </Heading>
        )}
        <div className={twMerge("grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8", heading && 'mt-6')}>
            {products.slice(0, 10).map((product) => (
                <div key={product.id} className="ring-1 group ring-gray-900/10 shadow-xl bg-gray-900/5 dark:bg-white/5 dark:ring-white/10 rounded-lg overflow-hidden">
                    <Link to={`/library/${product.id}`} className=" peer">
                        <img
                            alt={product.imageAlt}
                            src={product.imageSrc}
                            className="aspect-square peer w-full bg-gray-200 dark:bg-gray-800 object-cover xl:aspect-8/7"
                        />
                    </Link>
                    <Link to={`/library/${product.id}`} className="transition-opacity px-4 pt-4 block hover:opacity-75 peer-hover:opacity-75">
                        <div className="flex w-full justify-between">
                            <div>
                                <Heading size="h5" className="">
                                    {product.name}
                                </Heading>
                                <Paragraph size="sm" className="">
                                    Indicator
                                </Paragraph>
                            </div>

                            <Paragraph size="lg" className="font-medium dark:text-white text-gray-900">
                                {product.price}
                            </Paragraph>
                        </div>
                        <Paragraph size="sm" className="mt-4 line-clamp-4">
                            {product.description}
                        </Paragraph>
                    </Link>
                    <div className="block p-4 w-fit">
                        <Link to={`/library/${product.id}`} className="w-fit">
                            <ButtonV2 className="">
                                Get Access
                            </ButtonV2>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </Section>
)