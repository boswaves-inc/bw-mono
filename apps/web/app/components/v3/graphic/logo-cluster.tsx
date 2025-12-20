import { motion } from "framer-motion"
import type { ComponentProps, ComponentPropsWithoutRef } from "react"
import { cn } from "~/utils/class"
import { Mark } from "../logo"

interface CircleProps {
    size: number,
    delay: number,
    opacity: string
}

const Circle = ({ size, delay, opacity, }: CircleProps) => (
    <motion.div
        style={{ '--opacity': opacity } as React.CSSProperties}
        variants={{
            idle: { width: `${size}px`, height: `${size}px` },
            active: {
                width: [`${size}px`, `${size + 10}px`, `${size}px`],
                height: [`${size}px`, `${size + 10}px`, `${size}px`],
                transition: {
                    duration: 0.75,
                    repeat: Infinity,
                    repeatDelay: 1.25,
                    ease: 'easeInOut',
                    delay,
                },
            },
        }}
        className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full',
            'bg-[radial-gradient(circle,transparent_25%,color-mix(in_srgb,var(--color-blue-500)_var(--opacity),transparent)_100%)]',
            'ring-1 ring-blue-500/8 ring-inset',
        )}
    />
)

interface LogoProps {
    src: string,
    alt?: string
    left: number
    top: number
    hover: { x: number; y: number; rotate: number; delay: number }
}

const Logo = ({ left, top, hover, ...props }: LogoProps) => (
    <motion.img
        {...props}
        variants={{
            idle: { x: 0, y: 0, rotate: 0 },
            active: {
                x: [0, hover.x, 0],
                y: [0, hover.y, 0],
                rotate: [0, hover.rotate, 0],
                transition: {
                    duration: 0.75,
                    repeat: Infinity,
                    repeatDelay: 1.25,
                    ease: 'easeInOut',
                    delay: hover.delay,
                },
            },
        }}
        style={{ left, top } as React.CSSProperties}
        className="absolute size-16 rounded-full bg-white shadow-sm ring-1 ring-black/5"
    />
)

export const LogoCluster = () => (
    <div aria-hidden="true" className="relative h-full overflow-hidden">
        <div className="absolute inset-0">
            <Circle size={528} opacity="3%" delay={0.45} />
            <Circle size={400} opacity="5%" delay={0.3} />
            <Circle size={272} opacity="5%" delay={0.15} />
            <Circle size={144} opacity="10%" delay={0} />
            <div className="absolute inset-0 bg-linear-to-t from-white to-35%" />
        </div>
        <div className="absolute left-1/2 h-full w-104 -translate-x-1/2">
            <div className="absolute top-32 left-44 flex size-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                <Mark className="h-9 fill-black" />
            </div>
            <Logo
                src="/crypto/career-builder.svg"
                left={360}
                top={144}
                hover={{ x: 6, y: 1, rotate: 5, delay: 0.38 }}
            />
            <Logo
                src="/crypto/dribbble.svg"
                left={285}
                top={20}
                hover={{ x: 4, y: -5, rotate: 6, delay: 0.3 }}
            />
            <Logo
                src="/crypto/glassdoor.svg"
                left={255}
                top={210}
                hover={{ x: 3, y: 5, rotate: 7, delay: 0.2 }}
            />
            <Logo
                src="/crypto/linkedin.svg"
                left={144}
                top={40}
                hover={{ x: -2, y: -5, rotate: -6, delay: 0.15 }}
            />
            <Logo
                src="/crypto/upwork.svg"
                left={36}
                top={56}
                hover={{ x: -4, y: -5, rotate: -6, delay: 0.35 }}
            />
            <Logo
                src="/crypto/we-work-remotely.svg"
                left={96}
                top={176}
                hover={{ x: -3, y: 5, rotate: 3, delay: 0.15 }}
            />
        </div>
    </div>
)