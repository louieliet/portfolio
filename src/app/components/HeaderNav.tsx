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
                absolute top-0 left-0 w-full 
                bg-transparent text-black 
                flex justify-center gap-6 p-4 
                z-40
            "
        >
            <button onClick={() => handleScroll('whatido')}>Home</button>
            <button onClick={() => handleScroll('experience')}>Experiencia</button>
            <button onClick={() => handleScroll('activities')}>Actividades</button>
            <button onClick={() => handleScroll('contact')}>Contacto</button>
        </nav>
    )
}

export default HeaderNav