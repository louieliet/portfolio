import PinnedAndOverlap from '../components/PinnedAndOverlap'
import Introduction from './Introduction'
import WhatIdo from './WhatIdo'
import Experience from './Experience'
import Activities from './Activities'
import Contact from './Contact'
import SideMenu from '../components/SideMenu'

const Home = () => {
    return (
        <main>
            <SideMenu />
            <PinnedAndOverlap
                containerHeight="450vh"
                contentOne={<Introduction />}
                contentTwo={<WhatIdo />}
            />
            <Experience />
            <Activities />
            <Contact />
        </main>
    )
}

export default Home
