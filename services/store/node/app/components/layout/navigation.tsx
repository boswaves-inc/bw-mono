import { motion } from 'framer-motion'
import { Menu, ShoppingCart } from 'lucide-react'
import { Link, useRevalidator } from 'react-router'
import { Wireframe, WireframeItem, WireframeRow } from '../v3/wireframe'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../v3/core/collapsible'
import { Mark } from '../v3/logo'
import { Editable, useEditor } from './editor'
import { useRef } from 'react'

const links = [
    { href: '/pricing', label: 'Library' },
    // { href: '/company', label: 'Company' },
    { href: '/blog', label: 'Blog' },
    { href: '/cart', label: 'Cart' },
    { href: '/auth/login', label: 'Login' },
]


export function Navigation({ children }: { children?: React.ReactNode }) {
    return (
        <Editable type='header' className="pt-12 sm:pt-16">
            <Collapsible>
                <Wireframe >
                    <WireframeRow className="relative flex justify-between">
                        <div className="relative flex gap-6">
                            <WireframeItem className="py-3">
                                <Link to="/" title="Home" className='flex gap-3 justify-start items-center'>
                                    <Mark className='fill-black size-9' />
                                    <div className='text-[22px] h-9 align-middle flex items-center font-medium'>
                                        BosWaves
                                    </div>
                                </Link>
                            </WireframeItem>
                            {children && (
                                <div className="relative hidden items-center py-3 lg:flex">
                                    {children}
                                </div>
                            )}
                        </div>

                        {/* Desktpp */}
                        <nav className="relative hidden lg:flex">
                            {links.map(({ href, label }) => (
                                <WireframeItem key={href} className="relative flex">
                                    <Link to={href} className="flex items-center px-4 py-3 gap-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 text-base font-medium text-gray-950 bg-blend-multiply hover:bg-black/2.5" >
                                        {/* <ShoppingCart /> */}
                                        {label}
                                    </Link>
                                </WireframeItem>
                            ))}
                        </nav>

                        {/* Mobile Button */}
                        <CollapsibleTrigger asChild>
                            <button className="flex size-12 items-center justify-center self-center rounded-lg hover:bg-black/5 lg:hidden">
                                <Menu className="size-6" />
                            </button>
                        </CollapsibleTrigger>
                    </WireframeRow>
                </Wireframe>

                {/* Mobile */}
                <CollapsibleContent>
                    <div className="flex lg:hidden flex-col gap-6 py-4">
                        {links.map(({ href, label }, linkIndex) => (
                            <motion.div
                                initial={{ opacity: 0, rotateX: -90 }}
                                animate={{ opacity: 1, rotateX: 0 }}
                                transition={{
                                    duration: 0.15,
                                    ease: 'easeInOut',
                                    rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
                                }}
                                key={href}
                            >
                                <Link to={href} className="text-base font-medium text-gray-950">
                                    {label}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                    <div className="absolute left-1/2 w-screen -translate-x-1/2">
                        <div className="absolute inset-x-0 top-0 border-t border-black/5" />
                        <div className="absolute inset-x-0 top-2 border-t border-black/5" />
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Editable >
    )
}