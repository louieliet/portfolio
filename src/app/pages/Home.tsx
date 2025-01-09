import PinnedAndOverlap from "../components/PinnedAndOverlap";
import Introduction from "./Introduction";
import WhatIdo from "./WhatIdo";
import Experience from "./Experience";
import Activities from "./Activities";
import Contact from "./Contact";

const Home = () => {
  return (
    <main>
      <PinnedAndOverlap
        containerHeight="300vh"
        contentOne={<Introduction />}
        contentTwo={<WhatIdo />}
      />
      <Experience />
      <Activities />
      <Contact />
    </main>
  );
};

export default Home;
