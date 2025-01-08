import Header from "@/app/components/Header";
import Introduction from "@/app/pages/Introduction";
import AboutMe from "@/app/pages/AboutMe";
export default function Home() {
  return (
    <div>
      <main>
        <div className="hidden md:block">
          <Header textcolor="white" />
        </div>
        <Introduction />
        <AboutMe />
      </main>
    </div>
  );
}
