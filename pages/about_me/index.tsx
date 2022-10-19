import { initHeader, initWidth } from "../../scripts/image_browser";
import { useEffect, useState } from "react";

import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Head from "next/head";
import Header from "../../components/Header";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [artistActive, setArtistActive] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    initWidth();
    initHeader();
  }, []);

  function handleSubmit() {
    //TODO: handle later
  }

  return (
    <div>
      <Head>
        <title>MKGMagic Pours</title>
        <meta name="og:title" content="MKGMagic Pours" />
        <meta
          name="description"
          content="My name is Molly Gudka, and I love making pour paintings - no two pours are ever the same. I hope that my artwork makes you smile!"
        />
        <meta
          name="og:description"
          content="I love making pour paintings, and I hope that my artwork makes you smile!"
        />
        <meta
          name="og:image"
          content="https://mkgmagic.com/icons/MKGMagicPours.png"
        />
      </Head>
      <Header />
      <Container>
        <div className="colorContainer">
          <div className="colorFade">
            <div className="block"></div>
            {/* Switch Person */}
            <div className="switchWrapper">
              <div
                className={`clearStyle artistBtn${
                  artistActive ? " activeSwitchBtn" : ""
                }`}
                onClick={() => setArtistActive(true)}
              >
                <p>Artist: Molly Gudka</p>
              </div>
              <div
                className={`clearStyle devBtn${
                  !artistActive ? " activeSwitchBtn" : ""
                }`}
                onClick={() => setArtistActive(false)}
              >
                <p>Developer: Rory Gudka</p>
              </div>
            </div>

            {/* Rory About Me */}
            {!artistActive && (
              <>
                {" "}
                <div className="intro">
                  <p style={{ paddingBottom: "20px" }}>
                    My name is Rory Gudka, and I&apos;m the developer for this
                    website. I am currently an undergraduate student at the
                    University of Virginia, and I plan to major in Electrical &
                    Computer Engineering with a minor in Computer Science.
                    I&apos;ve been passionate about computer science since the
                    10th grade, because I found it allows me to demonstrate my
                    creativity without needing any materials aside from a
                    computer and my imagination.
                  </p>
                  <p>
                    Last summer, I became very interested in website
                    development, and began the development of my personal
                    website. I had to learn about AWS&apos;s EC2 and RDS
                    services, which felt like no small feat at the time, but
                    successfully began my learning process with all sorts of new
                    applications of computer science. After a couple months of
                    working on various web development projects, I decided that
                    I would make a website for my sister to help expand the
                    reach of her artwork. You are currently seeing the results
                    of such efforts, and I hope that you enjoy what I&apos;ve
                    created. If you would like to see more about my work, you
                    can visit my personal website at{" "}
                    <a className="link" href="https://rorygudka.com">
                      rorygudka.com,
                    </a>{" "}
                    or you can continue reading about some of my favorite
                    projects below.
                  </p>
                  <div className="rorImgContainerIntro">
                    <img src="Images/Actual/New/NASA Astronaut.jpg" />
                  </div>
                </div>
                <div className="fullExpanse">
                  <div className="divider">
                    <hr className="solid" />
                  </div>
                </div>
                <div className="moreInfo">
                  <div className="heading">
                    <p>Fun Projects</p>
                  </div>
                  <div className="hdivider">
                    <hr className="solid" />
                  </div>
                  <div className="subheading">
                    <p>Territory Wars Recreation</p>
                  </div>
                  <ul>
                    <li>
                      When I began working on large scale projects, I wanted to
                      make a game. One of the simpler games that I found very
                      fun at the time was a turn-based stick figure action game
                      called Territory Wars. I decided I would recreate it, and
                      using Code.org&apos;s website and servers, I managed to
                      create a basic version of it with both local multiplayer
                      and online multiplayer that was surprisingly playable.
                      Being my first major project, it was fairly buggy, but it
                      was very fun to create and I was ecstatic with the
                      results. If you would like to see this project, you can
                      access it{" "}
                      <a
                        className="link"
                        href="https://studio.code.org/projects/applab/J3OV6F1CVu1RCfa0gjQGTJ4ADWTdR5GAKmNXl0TrlUY"
                      >
                        here.
                      </a>
                    </li>
                  </ul>
                  <div className="fullExpanse">
                    <div className="rorImgContainer">
                      <img src="Images/Actual/New/Territory Wars.png" />
                      <img src="Images/Actual/New/Territory Wars_2.png" />
                    </div>
                  </div>
                  <div className="subheading">
                    <p>Orbital Simulator</p>
                  </div>
                  <ul>
                    <li>
                      I stemmed this work into even harder creations, such as
                      with the game Orbital Simulator, which was also made via
                      Code.org&apos;s platform. This game not only allowed users
                      to play through levels in attempts to orbit targeted
                      planets, but also allowed them to create their own levels
                      and simulate rocket trajectories. The accuracy of the
                      physics was verified with the orbits of the International
                      Space Station and the Moon, and it was very interesting to
                      see Kepler&apos;s Laws of Planetary Motion. If you would
                      like to see this game, you can access it{" "}
                      <a
                        className="link"
                        href="https://studio.code.org/projects/applab/D7BFh1dLwzXzBv6hxp1jVt5QWDk3szfLQyytTvEegL8"
                      >
                        {" "}
                        here.
                      </a>
                    </li>
                  </ul>
                  <div className="fullExpanse">
                    <div className="rorImgContainer">
                      <img src="Images/Actual/New/Orbital Simulator.png" />
                      <img src="Images/Actual/New/Orbital Simulator_2.png" />
                    </div>
                  </div>
                  <div className="subheading">
                    <p>Agar.io Recreation</p>
                  </div>
                  <ul>
                    <li>
                      After getting into web development, I wanted to recreate
                      even more challenging content, such as a real-time game
                      hosted by my own web server. Agar.io was the game I
                      decided to recreate, and I successfully created a server
                      that can rapidly communicate with up to approximately 20
                      client devices, rendering and sending frames 30 times per
                      second through the power of Node.js and WebSockets. It
                      felt absolutely crazy that it worked so well, and it is
                      still one of my favorite projects I have ever worked on.
                      Unfortunately, I am still working on merging it with my
                      personal website server, so it is not yet publicly
                      accessible. However, you can view more details about this
                      and much more at my personal website linked above!
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Molly About Me */}
            {artistActive && (
              <>
                <div className="container">
                  <div className="intro">
                    <p style={{ paddingBottom: "20px" }}>
                      My name is Molly Gudka, and I discovered last year that I
                      love making pour paintings. As I accumulated more and more
                      paintings over time and people showed interest in my
                      creations I decided to find a good way to sell them. I
                      think acrylic pouring is a wonderful way to express
                      oneself while at the same time letting go of control, as
                      the paint interacts differently every single time. No two
                      pours are ever the same, and I highly enjoy that aspect of
                      the art.
                    </p>
                    <p>
                      I have experimented with multiple variations of different
                      techniques such as the dirty pour, the swipe, the press,
                      the open-cup pour, and the controlled pour - and there are
                      still so many others that I want to try. I also like to
                      further make my pours unique by painting characters,
                      scenes, quotes, or by adding embellishments such as
                      glitter or decorations. I like to challenge myself to try
                      new things incorporating my pours, and I welcome any
                      project. I am currently working on making my pours digital
                      by combining them with my art in Procreate - more about
                      that will be developing over the year. My art is forever a
                      work in progress, but the message will always be the same
                      : find happiness in the little things. I hope that my
                      artwork makes you smile!
                    </p>
                    <div className="rorImgContainerIntro">
                      <img src="Images/Actual/About Me - Image 1.jpeg" />
                      <img src="Images/Actual/About Me - Image 2.jpeg" />
                    </div>
                  </div>
                  <div className="fullExpanse">
                    <div className="divider">
                      <hr className="solid" />
                    </div>
                  </div>
                  <div className="moreInfo">
                    <div className="heading">
                      <p>More Info</p>
                    </div>
                    <div className="hdivider">
                      <hr className="solid" />
                    </div>
                    <div className="subheading">
                      <p>How much will it cost to commission a painting?</p>
                    </div>
                    <ul>
                      <li>
                        It depends on the size and complexity of the project -
                        the bigger and more detailed it is, the more it is going
                        to cost. A lot of components go into making a pour
                        painting such as the canvas, paint, pouring medium,
                        silicone, tools, and - most importantly - time. I aim to
                        make my art affordable while still making a net profit,
                        and sometimes there is a fine balance between. If there
                        is a certain price range that you want to work with then
                        let me know and I will find a way to make something
                        beautiful at the right cost!
                      </li>
                    </ul>
                    <div className="subheading">
                      <p>How long does it take me to complete a project?</p>
                    </div>
                    <ul>
                      <li>
                        Projects can vary a lot in the amount of time they take
                        me. Classic pours are the easiest and the fastest to
                        complete, usually taking only a few days. Painting
                        characters or other images in addition to a pour takes
                        about a week in total, as I sketch out my image(s) and
                        paint many layers after the pour dries. A controlled
                        pour made to look like a certain scene generally takes
                        the longest amount of time, sometimes several weeks to a
                        month depending on the size. Making a specific scene
                        look as desired in the style of a pour is no easy task -
                        it takes multiple layers of paint, lots of planning, and
                        lots of drying time. But the reward is huge when it is
                        complete!
                      </li>
                    </ul>
                    <div className="fullExpanse">
                      <div className="rorImgContainer">
                        <img src="Images/Large/More Info - Question 2 Image.jpeg" />
                      </div>
                    </div>
                    <div className="subheading">
                      <p>How long have I been doing art?</p>
                    </div>
                    <ul>
                      <li>
                        I have enjoyed creating things in almost any form since
                        I was a kid. I learned of pour painting in 2018, and
                        that is when I made my very first (Bear&apos;s Den)
                        using a controlled pour method and makeshift resources.
                        When I saw how it turned out I knew that I was in love
                        with the art. I took a pour painting className at the
                        beginning of 2020 and ever since then I have made over
                        100 pour paintings (and counting). In addition to pour
                        painting, I have experimented with multiple art forms
                        including acrylic painting, watercolor painting, colored
                        pencil and graphite sketching, clay sculpting, scratch
                        art, jewelry-making, and scrapbooking.
                      </li>
                    </ul>
                    <div className="fullExpanse">
                      <div className="rorImgContainer">
                        <img src="Images/Large/More Info - Question 3 Image 1.jpeg" />
                        <img src="Images/Large/More Info - Question 3 Image 2.jpeg" />
                      </div>
                    </div>
                    <div className="subheading">
                      <p>What will shipping prices be like?</p>
                    </div>
                    <ul>
                      <li>
                        Most of my small canvas and wood pieces are very light
                        and ship for less than $10 anywhere in the U.S., but my
                        larger and heavier pieces will be more expensive to ship
                        and that is important to take into account with your
                        price range. I ship internationally, but those prices
                        will also be more expensive. I package my art very
                        carefully so that it will arrive safely, and I have yet
                        to hear of a customer receiving artwork with any damage
                        (*knock on wood*).
                      </li>
                    </ul>
                    <div className="fullExpanse">
                      <div className="rorImgContainer">
                        <img src="Images/Large/More Info - Question 4 Image.jpeg" />
                      </div>
                    </div>
                    <div className="subheading">
                      <p>
                        How often will I update this website with new paintings?
                      </p>
                    </div>
                    <ul>
                      <li>
                        I create new pour paintings almost every week just for
                        the joy of trying new things, and as new paintings
                        accumulate over weeks I will add them to the website. If
                        I am working on multiple projects or commissions then I
                        may be slower to add new paintings. A place to
                        consistently see new content of mine is my Instagram at{" "}
                        <a
                          style={{ color: "lightblue" }}
                          href="https://www.instagram.com/mkgmagic"
                        >
                          www.instagram.com/mkgmagic.
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="divider">
                  <hr className="solid" />
                </div>
                <div className="main">
                  <p id="comment" className="header">
                    Leave a Comment
                  </p>
                  <div className="hdivider">
                    <hr className="solid" />
                  </div>
                  <p className="label bold close-bottom">Name: *</p>
                  <input type="text" id="nameTxt" placeholder="John Smith" />
                  <p className="label bold close-bottom">Email:</p>
                  <input
                    type="text"
                    id="emailTxt"
                    placeholder="jsmith@example.com"
                  />
                  <p className="label bold close-bottom">Comment: *</p>
                  <textarea id="commentTxt"></textarea>
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <div className="pubCheck">
                      <input
                        id="publicCheck"
                        type="checkbox"
                        checked
                        onChange={(e) => setChecked(e.target.checked)}
                      />
                      <label>Visible to public</label>
                    </div>
                    <div
                      className="clearStyle"
                      id="submitBtn"
                      onClick={handleSubmit}
                    >
                      <p className="submit">Submit</p>
                    </div>
                  </div>
                  <p style={{ color: "white", fontSize: "18px" }}>
                    * Required field
                  </p>
                </div>
              </>
            )}

            {/* Overall Comments */}
            <div className="divider">
              <hr className="solid" />
            </div>
            <div className="main" style={{ marginBottom: 0 }}>
              <p className="header">Comments</p>
              <div className="hdivider">
                <hr className="solid" />
              </div>
              <div id="comments" style={{ paddingBottom: "40px" }}>
                <div className="noCommentsWrapper">
                  <p>No comments have been posted yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
