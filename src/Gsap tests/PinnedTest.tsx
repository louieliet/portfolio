import React from 'react'
import PinnedAndOverlap from '@/Gsap tests/PinnedAndOverlap'

export default function PinnedTest() {
    return (
        <main>
            {/* Aquí inyectamos "contenido 1" y "contenido 2" como props */}
            <PinnedAndOverlap
                containerHeight="300vh"
                contentOne={
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#a2d2ff',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <h1>Contenido 1 (Fijo)</h1>
                    </div>
                }
                contentTwo={
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#ffafcc',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <h1>Contenido 2 (Cubre al primero)</h1>
                    </div>
                }
            />

            {/* Luego el contenido 3 y 4 en flujo normal */}
            <section
                style={{
                    minHeight: '100vh',
                    backgroundColor: 'red',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <h1>Contenido 3</h1>
            </section>

            <section
                style={{
                    minHeight: '100vh',
                    backgroundColor: 'blue',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <h1>Contenido 4</h1>
            </section>
        </main>
    )
}
