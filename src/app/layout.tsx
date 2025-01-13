import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import './globals.css'

const urbanist = Urbanist({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Emi's portafolio 🌱",
    description: 'Personal portafolio of Emiliano Montes',
    icons:{
        icon: "/favicon.ico",
    }
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${urbanist.className} antialiased`}>
                {children}
            </body>
        </html>
    )
}
