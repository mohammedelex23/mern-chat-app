import React from "react";
import Navbar from "./Navbar";
import News from "./News";
import PeoplesToFollow from "./PeoplesToFollow";

function someStile(name) {
    let news = document.getElementById("news");
    let people = document.getElementById("people");
    if (name == "news") {
        people.style.color = "#cccccc";
        news.style.color = "#242F9B";

        let newsComp = document.getElementById("newsComp");
        newsComp.style.marginLeft = 0;

    } else {
        news.style.color = "#cccccc"
        people.style.color = "#242F9B";

        let newsComp = document.getElementById("newsComp");
        newsComp.style.marginLeft = "-100%";
    }
}

export default function Home() {


    const handleClick = (name) => () => {
        someStile(name);
    }


    return (
        <div>
            <Navbar />
            <div>
                {/* Posts and peoples to follow */}
                <div className="flex gap-10 py-2 font-bold uppercase justify-center">
                    <h2 onClick={handleClick("news")} id="news" className="cursor-pointer select-none color-active">Posts</h2>
                    <h2 onClick={handleClick("people")} id="people" className="cursor-pointer select-none color-inactive">Peoples</h2>
                </div>

                <div className="mt-3 rounded-sm shadow-md p-2 slider mb-24">
                    <div className="slides">
                        {/* Posts */}
                        <News />
                        {/* PeoplesToFollow */}
                        <PeoplesToFollow />
                    </div>
                </div>
            </div>
        </div>
    )
}




