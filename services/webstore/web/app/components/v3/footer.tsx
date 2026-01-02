import { Link } from 'react-router'
import { Container } from './container'
import { Button } from './core/button'
import { Subheading } from './core/typography'
import { Gradient } from './gradient'
import { Wireframe, WireframeItem, WireframeRow } from './wireframe'
import { type ComponentProps, type PropsWithChildren } from 'react'
import { Mark } from './logo'

const NavGroup = ({ children }: PropsWithChildren) => (
    <ul className="mt-6 space-y-4 text-sm/6">
        {children}
    </ul>
)

const NavGroupHeading = ({ children }: PropsWithChildren) => (
    <h3 className="text-sm/6 font-medium text-gray-950/50">
        {children}
    </h3>
)

const NavGroupItem = (props: ComponentProps<typeof Link>) => (
    <li>
        <Link {...props} className="font-medium text-gray-950 data-hover:text-gray-950/75" />
    </li>
)

export function Footer() {
    return (
        <footer>
            <Gradient className="relative">
                <div className="absolute inset-2 rounded-4xl bg-white/80" />
                <Container>
                    <div className="relative pt-20 pb-16 text-center sm:py-24">
                        <hgroup>
                            <Subheading>Get started</Subheading>
                            <p className="mt-6 text-3xl font-medium tracking-tight text-gray-950 sm:text-5xl">
                                Ready to dive in?
                                <br />
                                Start your free trial today.
                            </p>
                        </hgroup>
                        <p className="mx-auto mt-6 max-w-xs text-sm/6 text-gray-500">
                            Get the cheat codes for selling and unlock your team&apos;s revenue
                            potential.
                        </p>
                        <div className="mt-6">
                            <Link to={""}>
                                <Button className="w-full sm:w-auto">
                                    Get started
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <Wireframe className="pb-16">
                        <WireframeRow>
                            <div className="grid grid-cols-2 gap-y-10 pb-6 lg:grid-cols-6 lg:gap-8">
                                <div className="col-span-2 flex">
                                    <WireframeItem className="pt-6 lg:pb-6">
                                        <Link to="/" title="Home" className='flex gap-3 justify-start items-center'>
                                            <Mark className='fill-black size-9' />
                                            <div className='text-[22px] h-9 align-middle flex items-center font-medium'>
                                                BosWaves
                                            </div>
                                        </Link>
                                    </WireframeItem>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-12 lg:col-span-4 lg:grid-cols-subgrid lg:pt-6">
                                    <div>
                                        <NavGroupHeading>Product</NavGroupHeading>
                                        <NavGroup>
                                            <NavGroupItem to="/pricing">Pricing</NavGroupItem>
                                            <NavGroupItem to="#">Analysis</NavGroupItem>
                                            <NavGroupItem to="#">API</NavGroupItem>
                                        </NavGroup>
                                    </div>
                                    <div>
                                        <NavGroupHeading>Company</NavGroupHeading>
                                        <NavGroup>
                                            <NavGroupItem to="#">Careers</NavGroupItem>
                                            <NavGroupItem to="/blog">Blog</NavGroupItem>
                                            <NavGroupItem to="/company">Company</NavGroupItem>
                                        </NavGroup>
                                    </div>
                                    <div>
                                        <NavGroupHeading>Support</NavGroupHeading>
                                        <NavGroup>
                                            <NavGroupItem to="#">Help center</NavGroupItem>
                                            <NavGroupItem to="#">Community</NavGroupItem>
                                        </NavGroup>
                                    </div>
                                    <div>
                                        <NavGroupHeading>Company</NavGroupHeading>
                                        <NavGroup>
                                            <NavGroupItem to="#">Terms of service</NavGroupItem>
                                            <NavGroupItem to="#">Privacy policy</NavGroupItem>
                                        </NavGroup>
                                    </div>

                                </div>
                            </div>
                        </WireframeRow>
                        <WireframeRow className="flex justify-between">
                            <div>
                                <WireframeItem className="py-3">
                                    <div className="text-sm/6 text-gray-950">
                                        &copy; {new Date().getFullYear()} BosWaves Inc.
                                    </div>
                                </WireframeItem>
                            </div>
                            <div className="flex">
                                <WireframeItem className="flex items-center gap-8 py-3">
                                    <Link to="https://facebook.com" target="_blank" aria-label="Visit us on Facebook" className="text-gray-950 data-hover:text-gray-950/75">
                                        <svg viewBox="0 0 16 16" fill="currentColor" className='size-4'>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M16 8.05C16 3.603 12.418 0 8 0S0 3.604 0 8.05c0 4.016 2.926 7.346 6.75 7.95v-5.624H4.718V8.05H6.75V6.276c0-2.017 1.194-3.131 3.022-3.131.875 0 1.79.157 1.79.157v1.98h-1.008c-.994 0-1.304.62-1.304 1.257v1.51h2.219l-.355 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.95z"
                                            />
                                        </svg>
                                    </Link>
                                    <Link to="https://x.com" target="_blank" aria-label="Visit us on X" className="text-gray-950 data-hover:text-gray-950/75">
                                        <svg viewBox="0 0 16 16" fill="currentColor" className='size-4'>
                                            <path d="M12.6 0h2.454l-5.36 6.778L16 16h-4.937l-3.867-5.594L2.771 16H.316l5.733-7.25L0 0h5.063l3.495 5.114L12.6 0zm-.86 14.376h1.36L4.323 1.539H2.865l8.875 12.837z" />
                                        </svg>
                                    </Link>
                                    <Link to="https://linkedin.com" target="_blank" aria-label="Visit us on LinkedIn" className="text-gray-950 data-hover:text-gray-950/75">
                                        <svg viewBox="0 0 16 16" fill="currentColor" className='size-4'>
                                            <path d="M14.82 0H1.18A1.169 1.169 0 000 1.154v13.694A1.168 1.168 0 001.18 16h13.64A1.17 1.17 0 0016 14.845V1.15A1.171 1.171 0 0014.82 0zM4.744 13.64H2.369V5.996h2.375v7.644zm-1.18-8.684a1.377 1.377 0 11.52-.106 1.377 1.377 0 01-.527.103l.007.003zm10.075 8.683h-2.375V9.921c0-.885-.015-2.025-1.234-2.025-1.218 0-1.425.966-1.425 1.968v3.775H6.233V5.997H8.51v1.05h.032c.317-.601 1.09-1.235 2.246-1.235 2.405-.005 2.851 1.578 2.851 3.63v4.197z" />
                                        </svg>
                                    </Link>
                                </WireframeItem>
                            </div>
                        </WireframeRow>
                    </Wireframe>
                </Container>
            </Gradient>
        </footer>
    )
}
