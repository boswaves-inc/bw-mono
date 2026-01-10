// import { Dialog, DialogPanel } from "@headlessui/react"
// import { ChevronRight, Menu, Search, ShoppingCart } from "lucide-react"
// import { useState, type ComponentProps } from "react"
// import { Link } from "react-router"
// import { useCart } from "~/context/cart"

// export default ({ ref }: ComponentProps<'header'>) => {
//     const [dialog, setDialog] = useState(false)

//     const cart = useCart();
//     const auth = false;

//     return (
//         <header ref={ref} className="fixed inset-x-0 top-0 z-50">
//             <div className="absolute h-64 from-black to-transparent pointer-events-none opacity-[clamp(0,calc(var(--scroll-y,0)/100),1)] bg-linear-to-b -z-10 top-0 inset-x-0" />
//             <nav aria-label="Global" className="flex items-center max-w-7xl mx-auto z-20 justify-between p-6 lg:px-8">
//                 <div className="flex lg:flex-1">
//                     <Link to={'/'} className="-m-1.5 p-1.5">
//                         <span className="sr-only">Search</span>
//                         <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=400" alt="" className="h-8 w-auto" />
//                     </Link>
//                 </div>
//                 <div className="flex lg:hidden dark:text-gray-300 text-gray-700 gap-x-6 items-center">
//                     <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 dark:text-gray-300 text-gray-700">
//                         <span className="sr-only">Open main menu</span>
//                         <Search className=" size-5" />
//                     </button>
//                     <button type="button" onClick={() => setDialog(true)} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 dark:text-gray-300 text-gray-700">
//                         <span className="sr-only">Open main menu</span>
//                         <Menu className=" size-5" />
//                     </button>
//                 </div>
//                 <div className="hidden lg:flex lg:gap-x-12">
//                     <Link to={'/products'} className="text-sm/6 font-semibold dark:text-white text-gray-900">Features</Link>
//                     <Link to={'/products'} className="text-sm/6 font-semibold dark:text-white text-gray-900">Resources</Link>
//                     <Link to={'/library'} className="text-sm/6 font-semibold dark:text-white text-gray-900">Library</Link>
//                     <Link to={'/how-it-works'} className="text-sm/6 font-semibold dark:text-white text-gray-900">How It Works</Link>
//                 </div>
//                 <div className="hidden lg:flex lg:flex-1 items-center gap-x-6 lg:justify-end dark:text-white text-gray-900">
//                     <Search className=" size-5" />
//                     <Link to={'/cart'}>
//                         <div className="size-5 relative">
//                             <span data-empty={cart.empty} className="block absolute top-0 right-0 bg-teal-500 data-[empty=true]:opacity-0 data-[empty=true]:animate-none opacity-100 transition-opacity animate-ping size-2 -translate-y-1/2 translate-x-1/2 rounded-full" />
//                             <ShoppingCart className=" size-5" />
//                         </div>
//                     </Link>
//                     {auth ? (
//                         <div className="flex items-center gap-x-3 bg-gray-900/10 dark:bg-white/10 rounded-full h-8 pl-4">
//                             <Link to={'/account'} className="text-sm/6 font-semibold py-1 dark:text-white text-gray-900">Seaszn</Link>
//                             <img className="rounded-full size-8" src="https://s3.tradingview.com/userpics/41863695-PYlq_mid.png" />
//                         </div>
//                     ) : (
//                         <div className="flex items-center gap-x-3 bg-black dark:bg-white h-8 rounded-full px-4">
//                             <Link to={'/auth/login'} className="text-sm/6 font-semibold py-1 text-white dark:text-gray-900">
//                                 <span className=" inline-flex items-center gap-x-2">
//                                     <span>Sign In</span>
//                                     <ChevronRight className="size-4" />
//                                 </span>
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             </nav>
//             <Dialog className={'lg:hidden'} open={dialog} onClose={setDialog}>
//                 <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 p-6 sm:max-w-sm sm:ring-1 dark:sm:ring-gray-900/10 sm:ring-gray-900/10">
//                     <div className="flex items-center justify-between">
//                         <a href="#" className="-m-1.5 p-1.5">
//                             <span className="sr-only">Your Company</span>
//                             <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=400" alt="" className="h-8 w-auto" />
//                         </a>
//                         <button type="button" onClick={() => setDialog(false)} className="-m-2.5 rounded-md p-2.5 dark:text-gray-300 text-gray-700">
//                             <span className="sr-only">Close menu</span>
//                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" className="size-6">
//                                 <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
//                             </svg>
//                         </button>
//                     </div>
//                     <nav className="mt-6 flow-root">
//                         <div className="-my-6 divide-y dark:divide-white/10 divide-gray-500/10">
//                             <div className="space-y-2 py-6">
//                                 <Link to={'/products'} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold dark:text-white text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">Features</Link>
//                                 <Link to={'/products'} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold dark:text-white text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">Resources</Link>
//                                 <Link to={'/library'} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold dark:text-white text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">Library</Link>
//                                 <Link to={'/pricing'} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold dark:text-white text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">Pricing</Link>
//                             </div>
//                             <div className="py-6">
//                                 <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold dark:text-white text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">Log in</a>
//                             </div>
//                         </div>
//                     </nav>
//                 </DialogPanel>
//             </Dialog>
//         </header>
//     )
// }