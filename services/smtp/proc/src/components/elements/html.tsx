import { Head, Html as Primitive, pixelBasedPreset, Tailwind, Body, Preview, Container, Font } from "@react-email/components"
import type { PropsWithChildren } from "react"
import type { Config } from "tailwindcss"

const config: Config = {
    presets: [
        pixelBasedPreset
    ],
    theme: {
        extend: {
            colors: {
                brand: "#1eb8e2ff",
            },
        },
    },
}

export const Html = ({ children }: PropsWithChildren) => {
    return (
        <Primitive lang="en">
            <Tailwind config={config}>
                <Head>
                    <Font
                        fontFamily="Switzer"
                        fallbackFontFamily='sans-serif'
                        webFont={{
                            url: "//cdn.fontshare.com/wf/BLNB4FAQFNK56DWWNF7PMGTCOTZHOEII/ST3WKSSDMBK2MIQQO3MAVYWLF4FTOLFV/6IN5WOLRCYP4G4MOCOHOMXNON6Q7MDAR.woff2",
                            format: "woff2",
                        }}
                        fontWeight={400}
                        fontStyle="normal"
                    />
                    <Font
                        fontFamily="Switzer"
                        fallbackFontFamily='sans-serif'
                        webFont={{
                            url: "//cdn.fontshare.com/wf/OYB4CXKJQXKTNSLJMTDQOIVUL2V5EL7S/WYO2P7DQVV5RNXGMCUO2HL4RJP4VFUAS/6XPIMU23OJVRY676OG5YVJMWEHWICATX.woff2",
                            format: "woff2",
                        }}
                        fontWeight={500}
                        fontStyle="normal"
                    />
                    <Font
                        fontFamily="Switzer"
                        fallbackFontFamily='sans-serif'
                        webFont={{
                            url: "//cdn.fontshare.com/wf/5SZVFDB7V52TI6ULVC6J3WQZQCIZVDV5/ODYPSTCUDMKSTYIPTV4CLQ7URIK7XYBJ/YS3VPNVO4B3TOJMEXDGFZQ4TLZGGSRZC.woff2",
                            format: "woff2",
                        }}
                        fontWeight={600}
                        fontStyle="normal"
                    />
                    <Font
                        fontFamily="Switzer"
                        fallbackFontFamily='sans-serif'
                        webFont={{
                            url: "//cdn.fontshare.com/wf/HBNTRIISA5MEXGL5WPYI7CV2HIWTDV3Q/YDPDINVT673XLXNSTMLG4JNCZZMVVNPN/Y7SCNZJOT2MW5ADSGOFLDGH4TNL4JCQY.woff2",
                            format: "woff2",
                        }}
                        fontWeight={700}
                        fontStyle="normal"
                    />
                    <title>My email title</title>
                </Head>
                <Body className="bg-white font-slack mx-auto my-0">
                    <Preview>
                        Yelp recent login
                    </Preview>
                    <Container className="mx-auto my-0 py-0 px-5">
                        {children}
                    </Container>
                </Body>
            </Tailwind>
        </Primitive>
    )
}