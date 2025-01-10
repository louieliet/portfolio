'use client'
import React from 'react'

const HeaderNav = () => {
    // Función para hacer scroll hasta el id correspondiente
    const handleScroll = (sectionId: string) => {
        const section = document.getElementById(sectionId)
        if (section) {
            // scroll suave
            section.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <nav
            className="
                fixed top-0 w-full z-50 bg-white text-black shadow-md
                flex justify-center gap-6 p-4
            "
        >
            {/* Puedes añadir o quitar botones dependiendo de cuántas secciones tengas */}
            <button onClick={() => handleScroll('home')}>Home</button>
            <button onClick={() => handleScroll('whatido')}>¿Qué hago?</button>
            <button onClick={() => handleScroll('experience')}>Experiencia</button>
            <button onClick={() => handleScroll('activities')}>Actividades</button>
            <button onClick={() => handleScroll('contact')}>Contacto</button>
        </nav>
    )
}

export default HeaderNav