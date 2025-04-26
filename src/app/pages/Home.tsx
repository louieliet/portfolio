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

            {/*            <PinnedAndOverlap
                contentOne={<Introduction />}
                contentTwo={<WhatIdo />}
            />*/}
            <Introduction />
            <WhatIdo />
            <Experience />
            <Activities />
            <Contact />
        </main>
    )
}

export default Home
