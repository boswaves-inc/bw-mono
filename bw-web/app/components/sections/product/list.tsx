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
        id: 'test',
        name: 'test',
        price: '$25',
        imageSrc: 'image.url',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'test',
        price: '$25',
        imageSrc: 'image.url',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'test',
        price: '$25',
        imageSrc: 'image.url',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'Test',
        price: '$25',
        imageSrc: 'image.url',
        imageAlt: 'image'
    },
    {
        id: 'Test',
        name: 'test',
        price: '$25',
        imageSrc: 'image.url',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'test',
        price: '$25',
        imageSrc: 'image.url',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'test',
        price: '$25',
        imageSrc: 'image.url',
        imageAlt: 'image'
    },
    {
        id: 'test',
        name: 'Test',
        price: '$25',
        imageSrc: 'image.url',
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
                    <Link key={product.id} to={product.id} className="group">
                        <img
                            alt={product.imageAlt}
                            src={product.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-200 dark:bg-gray-700 object-cover group-hover:opacity-75 xl:aspect-7/8"
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