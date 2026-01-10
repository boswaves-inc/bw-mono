import { motion } from 'framer-motion'
import type { ComponentProps } from 'react'
import { cn } from '~/utils/class'
import { Subheading } from './core/typography'

interface BentoProps extends Omit<ComponentProps<'div'>, 'title'> {
    title: React.ReactNode
    eyebrow: React.ReactNode
    graphic: React.ReactNode
    description: React.ReactNode
    fade?: ('top' | 'bottom')[]
}

export const Bento = ({ className, eyebrow, title, description, graphic, fade = [] }: BentoProps) => {
    return (
        <motion.div initial='idle' whileHover={'active'} variants={{ idle: {}, active: {} }} className={cn(className, 'group relative flex flex-col overflow-hidden rounded-lg', 'bg-white shadow-xs ring-1 ring-black/5', 'dark:bg-gray-800 dark:ring-white/15')}>
            <div className="relative h-80 shrink-0">
                {graphic}
                {fade.includes('top') && (
                    <div className="absolute inset-0 bg-linear-to-b from-white to-50% dark:from-gray-800 dark:from-[-25%]" />
                )}
                {fade.includes('bottom') && (
                    <div className="absolute inset-0 bg-linear-to-t from-white to-50% dark:from-gray-800 dark:from-[-25%]" />
                )}
            </div>
            <div className="relative p-10">
                <Subheading size="h3">
                    {eyebrow}
                </Subheading>
                <p className="mt-1 text-2xl/8 font-medium tracking-tight text-gray-950 dark:text-white">
                    {title}
                </p>
                <p className="mt-2 max-w-150 text-sm/6 text-gray-600 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </motion.div>
    )
}
