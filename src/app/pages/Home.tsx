import PinnedAndOverlap from '../components/PinnedAndOverlap'
import Introduction from './Introduction'
import WhatIdo from './WhatIdo'
import Experience from './Experience'
import Activities from './Activities'
import Contact from './Contact'
import HeaderNav from '../components/HeaderNav'

const Home = () => {
    return (
        <main>
            <HeaderNav />
            <PinnedAndOverlap
                containerHeight="480vh"
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
