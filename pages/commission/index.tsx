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
        <Block />
        <ImageBrowser id={0} />
        <DetailsMenu id={0} />
        <Filters id={0} />
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
