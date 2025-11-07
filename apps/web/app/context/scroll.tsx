import { Fragment, useEffect } from "react"
import { ScrollRestoration } from "react-router"

export const ScrollProvider = () => {
    useEffect(() => {
        let ticking = false

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    document.documentElement.style.setProperty('--scroll-y', String(window.scrollY))

                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <Fragment>
            <ScrollRestoration />
            <script dangerouslySetInnerHTML={{
                __html: `
                    try {
                        let positions = JSON.parse(sessionStorage.getItem('react-router-scroll-positions') || "{}");
                        let storedY = positions[window.history.state.key] ?? 0;
                        document.documentElement.style.setProperty('--scroll-y', String(storedY));
                    } 
                    catch (error) {
                        document.documentElement.style.setProperty('--scroll-y', '0');
                    }`
            }} />
        </Fragment>
    )
}