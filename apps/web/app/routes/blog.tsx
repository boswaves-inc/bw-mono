import { Outlet } from 'react-router'
import { Container } from '~/components/v3/container'
import { Footer } from '~/components/v3/footer'
import { GradientBackground } from '~/components/v3/gradient'
import { Navigation } from '~/components/v3/navbar'
import type { Route } from './+types/blog'

export default ({ loaderData }: Route.ComponentProps) => {
    return (
        <main className="overflow-hidden bg-gray-50">
            <GradientBackground />
            <Container>
                <Navigation/>
            </Container>
            <Outlet />
            <Footer />
        </main>
    )
}