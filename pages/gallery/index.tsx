import {
  initHeader,
  initImageBrowsers,
  initWidth,
} from "../../scripts/image_browser";

import Block from "../../components/Block";
import Container from "../../components/Container";
import DetailsMenu from "../../components/DetailsMenu";
import Filters from "../../components/FiltersMenu";
import Footer from "../../components/Footer";
import GalleryHeading from "../../components/GalleryHeading";
import Head from "next/head";
import Header from "../../components/Header";
import ImageBrowser from "../../components/ImageBrowser";
import type { NextPage } from "next";
import { useEffect } from "react";

const Home: NextPage = () => {
  useEffect(() => {
    initWidth();
    initHeader();
    initImageBrowsers();
  }, []);

  return (
    <div>
      <Head>
        <title>Gallery</title>
        <meta name="og:title" content="Gallery" />
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
          content="https://mkgmagic.com/Images/Icons/MKGMagicPours.png"
        />
      </Head>
      <Header />
      <Container>
        <GalleryHeading title="Classic Pours" />
        <Block />
        <ImageBrowser id={0} />
        <DetailsMenu id={0} />
        <Filters id={0} />
        <GalleryHeading title="Characters and Scenes" />
        <Block />
        <ImageBrowser id={1} />
        <DetailsMenu id={1} />
        <Filters id={1} />
        <GalleryHeading title="Wood Pours" />
        <Block />
        <ImageBrowser id={2} />
        <DetailsMenu id={2} />
        <Filters id={2} />
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
