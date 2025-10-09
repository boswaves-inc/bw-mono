import { CloudUpload, Hammer, LucidePackageOpen } from "lucide-react";
import { forwardRef } from "react";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import Button from "~/components/core/button";
import Heading from "~/components/core/heading";
import Paragraph from "~/components/core/paragraph";
import Section, { type SectionProps } from "~/components/core/section";


const products = [
    {
        id: 'Trend Pivots Profile',
        name: 'Trend Pivots Profile',
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'Trend Pivots Profile',
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'Trend Pivots Profile',
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'Trend Pivots Profile',
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'Test',
        name: 'Trend Pivots Profile',
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'Trend Pivots Profile',
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'Trend Pivots Profile',
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'Trend Pivots Profile',
        price: '$25',
        imageSrc: 'https://www.luxalgo.com/_next/image/?url=%2Fimages%2Fproduct%2Ftoolkits%2Ftoolkits_3.png&w=3840&q=75',
        imageAlt: 'image'
    },
]

interface ProductListProps extends SectionProps {
    heading?: string
}

const ProductList = forwardRef<HTMLElement, ProductListProps>(({ heading, ...props }, ref) => {
    return (
        <Section ref={ref} {...props}>
            {heading && (
                <Heading size="h3">
                    {heading}
                </Heading>
            )}
            <div className={twMerge("grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8", heading && 'mt-6')}>
                {products.slice(0, 10).map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`} className="group">
                        <img
                            alt={product.imageAlt}
                            src={product.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-200 dark:bg-gray-800 object-cover group-hover:opacity-75 xl:aspect-[8/7]"
                        />
                        <div>
                            <Paragraph size="sm" className="mt-4">
                                {product.name}
                            </Paragraph>
                            <Paragraph size="lg" className="font-medium dark:text-white text-gray-900">
                                {product.price}
                            </Paragraph>
                        </div>
                    </Link>
                ))}
            </div>
        </Section>
    )
})

export default ProductList;