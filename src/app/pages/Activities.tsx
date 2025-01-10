import SingleActivity from '@/app/components/SingleActivity'
import IOSIMG from '@/app/assets/images/iosimg.jpeg'
import VORTEXIMG from '@/app/assets/images/vorteximg.jpg'
import PCIIMG from '@/app/assets/images/pciimg.jpg'
import SAUPIMG from '@/app/assets/images/saupimg.jpeg'

const Activities = () => {
    return (
        <div className="activities-bg z-20 flex flex-col px-5 md:px-20">
            <div className="text-start w-full mt-6">
                <h1 className="text-4xl md:text-6xl lg:text-8xl text-white font-extrabold">
                    [03] Actividades
                </h1>

                <div className="flex flex-col gap-40 mt-16">
                    <SingleActivity
                        img={IOSIMG}
                        title="Co-fundador de Blank Canvas y desarrollador fullstack en el iOS Lab UP"
                        description="Participo en el desarrollo de aplicaciones para iOS, liderando un equipo creativo en la conceptualización, diseño y programación de soluciones innovadoras. Mi enfoque se centra en crear experiencias de usuario atractivas y funcionales. He trabajado con Swift, SwiftUI, CoreML, ARKit."
                        imageOnLeft={true}
                    />

                    <SingleActivity
                        img={VORTEXIMG}
                        title="Unity 2D Senior Developer en UP Panteras Play - Vortex"
                        description="Desarrollador enfocado a tareas de programación y especializado en mecánicas del jugador en Unity 2D en el juego Pumpkin Paradox. Estuve a cargo de las mecánicas del jugador y niveles que se presentaron en la EGS 2023."
                        imageOnLeft={false}
                    />

                    <SingleActivity
                        img={PCIIMG}
                        title="Líder de Gameplay Development en el PCI Lab - Universidad Panamericana"
                        description="Coordinador del diseño y la implementación de mecánicas de juego en Unity 3D. Lideré al equipo de Gameplay Development para crear la demo del juego Lotus, ganador del premio ILAN 2023, presentado en Israel."
                        imageOnLeft={true}
                    />

                    <SingleActivity
                        img={SAUPIMG}
                        title="Presidente de Ing. en Animación y Videojuegos | Sociedad de Alumnos de la Universidad Panamericana"
                        description="Lidereé iniciativas para promover la colaboración entre estudiantes, organizando eventos y conferencias que fomentan el desarrollo profesional y la creatividad."
                        imageOnLeft={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default Activities
