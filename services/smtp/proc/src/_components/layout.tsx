import { Head, Html as Primitive, Tailwind, Body, Preview, Container, Font, TailwindConfig } from "@react-email/components"
import type { PropsWithChildren } from "react"

const config: TailwindConfig = {
    theme: {
        extend: {
            colors: {
                ring: "oklch(67.3% 0.182 276.935)",
                input: 'oklch(0.92 0.004 286.32)',
                border: 'oklch(0.92 0.004 286.32)'
            },
            fontSize: {
                xs: ['12px', { lineHeight: '16px' }],
                sm: ['14px', { lineHeight: '20px' }],
                base: ['16px', { lineHeight: '24px' }],
                lg: ['18px', { lineHeight: '28px' }],
                xl: ['20px', { lineHeight: '28px' }],
                '2xl': ['24px', { lineHeight: '32px' }],
                '3xl': ['30px', { lineHeight: '36px' }],
                '4xl': ['36px', { lineHeight: '36px' }],
                '5xl': ['48px', { lineHeight: '1' }],
                '6xl': ['60px', { lineHeight: '1' }],
                '7xl': ['72px', { lineHeight: '1' }],
                '8xl': ['96px', { lineHeight: '1' }],
                '9xl': ['144px', { lineHeight: '1' }],
            },
            spacing: {
                px: '1px',
                0: '0',
                0.5: '2px',
                1: '4px',
                1.5: '6px',
                2: '8px',
                2.5: '10px',
                3: '12px',
                3.5: '14px',
                4: '16px',
                5: '20px',
                6: '24px',
                7: '28px',
                8: '32px',
                9: '36px',
                10: '40px',
                11: '44px',
                12: '48px',
                14: '56px',
                16: '64px',
                20: '80px',
                24: '96px',
                28: '112px',
                32: '128px',
                36: '144px',
                40: '160px',
                44: '176px',
                48: '192px',
                52: '208px',
                56: '224px',
                60: '240px',
                64: '256px',
                72: '288px',
                80: '320px',
                96: '384px',
            },
            width: {
                'md': '100px'
            }
        },
    },
}

export const Layout = ({ children }: PropsWithChildren) => {
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
                <Body className="bg-gray-50 my-0 overflow-hidden lg:p-8 p-6">
                    <Preview>
                        Yelp recent login
                    </Preview>
                    <Container className="">
                        {children}
                    </Container>
                </Body>
            </Tailwind>
        </Primitive>
    )
}