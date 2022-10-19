/*
TODO:
* Get pictures in the About Me
Extension TODO's:
* Fix headings on mobile horizontal
* Adjust arrows on the purchase page to be a little higher
* Finish Agar.io on main server and link photos in About Me
* Follow up with any feedback!
*/

import { data } from "../database.json";

/**
 * GENERAL VARIABLES AND FUNCTIONS
 */

interface Instance {
  index: number;
  //Browser
  browser: HTMLElement;
  carouselBtn: HTMLElement;
  gridBtn: HTMLElement;
  //Filters
  filterMenu: HTMLElement;
  randomBtn: HTMLElement;
  sizeBtn: HTMLElement;
  titleBtn: HTMLElement;
  priceBtn: HTMLElement;
  dateBtn: HTMLElement;
  //Details
  cover: HTMLElement;
  coverInfo: HTMLElement;
  coverTitle: HTMLElement;
  coverDesc: HTMLElement;
  coverPrice: HTMLElement;
  coverSize: HTMLElement;
  coverCommission: HTMLElement;
  coverBuy: HTMLElement;
  //Carousel
  carousel: HTMLElement;
  noMatches: HTMLElement;
  title: HTMLElement;
  leftArrow: HTMLElement;
  rightArrow: HTMLElement;
  loadingLbl: HTMLElement;
  //Gallery
  gallery: HTMLElement;

  //Instance variables
  images: Image[];
  allImages: Image[];
  filters: string[];
  carouselActive: boolean;
  gridActive: boolean;
  activeImage?: string;
  sortData: { [sort: string]: boolean | undefined };
  //Carousel
  moveScreen?: NodeJS.Timeout;
  slowDown?: NodeJS.Timeout;
  touchCheck?: NodeJS.Timeout;
  lastFocused?: Image;
  startingCount: number;
  scrPos: number;
  startPos: number;
  endPos: number;
  count: number;
  mouseX: number;
  touchX: number;
  curTouchX: number;
  leftWrap: boolean;
  rightWrap: boolean;
  prevPos: number;
  wrapped: boolean;

  //Inner carousel data

  //HTML Elements
  carousel2: HTMLElement;
  browser2: HTMLElement;
  leftArrow2: HTMLElement;
  rightArrow2: HTMLElement;
  loadingLbl2: HTMLElement;
  //Details instance variables
  adjustScreen2?: NodeJS.Timeout;
  moveScreen2?: NodeJS.Timeout;
  slowDown2?: NodeJS.Timeout;
  touchCheck2?: NodeJS.Timeout;
  lastFocused2?: Image;
  images2?: Image[];
  allImages2?: Image[];
  startingCount2?: number;
  scrPos2?: number;
  endPos2?: number;
  startPos2?: number;
  count2?: number;
  mouseX2?: number;
  touchX2?: number;
  curTouchX2?: number;
  leftWrap2?: boolean;
  rightWrap2?: boolean;
  prevPos2?: number;
  wrapped2?: boolean;
}

interface DatabaseImage {
  title: string;
  desc: string;
  price: string;
  size: string;
  fileName: string;
  forSale: string;
  classic: string;
  wood: string;
  charOrScene: string;
  favorite: string;
  halloween: string;
  christmas: string;
  pride: string;
  date: string;
  subImages: number;
  colors: string;
  avgColor: string;
}

interface Image {
  title: string;
  desc: string;
  price: string;
  size: string;
  fileName: string;
  forSale: boolean;
  classic: boolean;
  wood: boolean;
  charOrScene: boolean;
  favorite: boolean;
  halloween: boolean;
  christmas: boolean;
  pride: boolean;
  date: number;
  subImages?: { fileName: string }[];
  colors: string[];
  avgColor: string[];
  position?: number;
  endPosition?: number;
  clientWidth?: number;
  center?: number;
  displayed?: boolean;
  element?: ImageElement;
  element2?: ImageElement;
}

interface NoFileNameImage extends Omit<Image, "fileName"> {
  fileName?: string;
}

interface ImageElement extends HTMLImageElement {
  value: string;
  myListeners: any;
}

/** HTML Elements */
let everythingContainer: HTMLElement | null = null;
let header: HTMLElement | null = null;
let headerImg: HTMLElement | null = null;

//Layout variables
let imPadding = 35; //Distance between images (120 at laptop width)
const antiSensitivity = 25; //Higher number is slower
const slowSpeed = 30; //Higher number slows quicker
const slowSpeedTouch = 70;
const speedMultiplier = 35;
const speedMultiplier2 = 35;
const lockSensitivity = 2;
const lockSensitivity2 = 2;
const maxAngle = 20; //Degrees
const distanceDivider = 2; //Distance between the "camera" and the images
const moveSpeed = 75; //Speed of the arrow presses
const perspectiveCalibration = -1.1; //Don't change this unless you change the perspective or something strange happens
const perspectiveCalibration2 = -1.1; //Don't change this unless you change the perspective or something strange happens

//Defines all of the instance variables for each carousel
const instance: Instance[] = [];
let scrollHeight = 0;
let locked = false;
let locking = false;
let lockTimeout: NodeJS.Timeout;

//Details about the screen
let width = 0;
let width2 = 0;
let halfWidth = 0;
let halfWidth2 = 0;
let height = 0;
let mobile = false;

//Scroll lock
let wheelOpt: any;
let wheelEvent: string;

//Header variable
export let headerColor = { avgColor: "127, 122, 106" };

export function initWidth() {
  //Layout variables
  imPadding = document.body.clientWidth * 0.051337 + 35; //Distance between images (120 at laptop width)

  //Details about the screen
  width = document.body.clientWidth;
  halfWidth = width / 2;
  height = window.innerHeight;
  if (width / height < 3 / 4 || height < 500) {
    mobile = true;
    width2 = width;
    halfWidth2 = width2 / 2;
  } else {
    mobile = false;
    width2 = width * 0.8;
    halfWidth2 = width2 / 2;
  }
}

export function initImageBrowsers() {
  /** HTML Elements */
  everythingContainer = getElementsByClassName("everythingContainer")[0];
  header = getElementsByClassName("head")[0];
  headerImg = getElementsByClassName("headBackImg")[0];

  //Screen resize controls
  setInterval(function () {
    //Detects whether width has changed
    if (document.body.clientWidth != width) {
      //Resets the width and halfWidth variables
      width = document.body.clientWidth;
      halfWidth = width / 2;
      const height = window.innerHeight;
      //Detects whether the menus have resized, and changes the second layer of widths accordingly
      if (width / height < 3 / 4 || height < 500) {
        width2 = width;
        halfWidth2 = width2 / 2;
      } else {
        width2 = width * 0.8;
        halfWidth2 = width2 / 2;
      }
      //Resets the padding based on the equation developed
      imPadding = width * 0.051337 + 35;
      //Resets the width of the containers
      everythingContainer!.style.width = width + "px";
      header!.style.width = width + "px";

      for (let i = 0; i < instance.length; i++) {
        if (instance[i].carouselActive) {
          reinitializeImages(i, true);
        }
        if (instance[i].images2?.length != 0) {
          initializeImages2(i, true);
        }
      }
    }
  }, 50);

  //Instance initialization
  for (let i = 0; i < getElementsByClassName("imageBrowser").length; i++) {
    const index: number = instance.length;
    //Defines the first instance
    instance[index] = {
      //Ensures the index is always known by the program
      index: index,
      //Browser
      browser: getElementsByClassName("imageBrowser")[index] as HTMLElement,
      carouselBtn: getElementsByClassName("carouselBtn")[index],
      gridBtn: getElementsByClassName("gridBtn")[index],
      //Filters
      filterMenu: getElementsByClassName("cover")[index * 2 + 1],
      randomBtn: getElementsByClassName("randomBtn")[index],
      sizeBtn: getElementsByClassName("sizeBtn")[index],
      titleBtn: getElementsByClassName("titleBtn")[index],
      priceBtn: getElementsByClassName("priceBtn")[index],
      dateBtn: getElementsByClassName("dateBtn")[index],
      //Details
      cover: getElementsByClassName("cover")[index * 2],
      coverInfo: getElementsByClassName("covInfo")[index],
      coverTitle: getElementsByClassName("coverTitle")[index],
      coverDesc: getElementsByClassName("coverDesc")[index],
      coverPrice: getElementsByClassName("coverPrice")[index],
      coverSize: getElementsByClassName("coverSize")[index],
      coverCommission: getElementsByClassName("coverCommission")[index],
      coverBuy: getElementsByClassName("coverBuy")[index],
      //Carousel
      carousel: getElementsByClassName("carousel")[index],
      noMatches: getElementsByClassName("noMatches")[index],
      title: getElementsByClassName("icTitle")[index],
      leftArrow: getElementsByClassName("left")[index],
      rightArrow: getElementsByClassName("right")[index],
      loadingLbl: getElementsByClassName("loadingLbl")[index],
      //Gallery
      gallery: getElementsByClassName("gallery")[index],

      //Instance variables
      images: [],
      allImages: [],
      filters: [],
      carouselActive: true,
      gridActive: false,
      activeImage: undefined,
      sortData: {
        random: true,
      },
      //Carousel
      startingCount: 0,
      scrPos: 0,
      startPos: 0,
      endPos: 0,
      count: 0,
      mouseX: 0,
      touchX: 0,
      curTouchX: 0,
      slowDown: undefined,
      lastFocused: undefined,
      leftWrap: false,
      rightWrap: false,
      prevPos: 0,
      moveScreen: undefined,
      wrapped: false,

      //Details instance variables
      startingCount2: undefined,
      scrPos2: undefined,
      endPos2: undefined,
      startPos2: undefined,
      count2: undefined,
      mouseX2: undefined,
      touchX2: undefined,
      curTouchX2: undefined,
      slowDown2: undefined,
      lastFocused2: undefined,
      leftWrap2: undefined,
      rightWrap2: undefined,
      prevPos2: undefined,
      images2: undefined,
      allImages2: undefined,
      adjustScreen2: undefined,
      moveScreen2: undefined,
      wrapped2: undefined,

      //HTML Elements
      carousel2: getElementsByClassName("carousel2")[index],
      browser2: getElementsByClassName("imageBrowser2")[index],
      leftArrow2: getElementsByClassName("left2")[index],
      rightArrow2: getElementsByClassName("right2")[index],
      loadingLbl2: getElementsByClassName("loadingLbl2")[index],
    };

    instance[index].browser.style.backgroundColor =
      "rgb(" +
      headerColor.avgColor[0] +
      ", " +
      headerColor.avgColor[1] +
      ", " +
      headerColor.avgColor[2] +
      ")";
    instance[index].loadingLbl.style.display = "block";
    loadCarousel(index);

    initializeVariables(index);

    //Initialize scroll lock
    // modern Chrome requires { passive: false } when adding event
    let supportsPassive = false;
    try {
      (window.addEventListener as any)(
        "test",
        null,
        Object.defineProperty({}, "passive", {
          get: function () {
            supportsPassive = true;
          },
        })
      );
    } catch (e) {}

    wheelOpt = supportsPassive ? { passive: false } : false;
    wheelEvent =
      "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
  }
}

export function initHeader() {
  /** HTML Elements */
  everythingContainer = getElementsByClassName("everythingContainer")[0];
  header = getElementsByClassName("head")[0];
  headerImg = getElementsByClassName("headBackImg")[0];

  //Initializes the average color of the favorite images
  const favColors: { avgColor: string | string[] }[] = [
    {
      avgColor: "127, 122, 106",
    },
    {
      avgColor: "130, 78, 116",
    },
    {
      avgColor: "132, 110, 145",
    },
    {
      avgColor: "175, 121, 94",
    },
    {
      avgColor: "52, 141, 137",
    },
    {
      avgColor: "33, 85, 158",
    },
    {
      avgColor: "60, 120, 129",
    },
    {
      avgColor: "88, 134, 192",
    },
    {
      avgColor: "166, 152, 145",
    },
  ];
  for (let i = 0; i < favColors.length; i++) {
    favColors[i].avgColor = parseArray(favColors[i].avgColor as string);
  }

  //Initialization of head
  everythingContainer!.style.width = width + "px";
  header!.style.width = width + "px";
  const rnd = Math.floor(Math.random() * 9 + 1);
  (headerImg as HTMLImageElement).src = "head/Favorite_" + rnd + ".jpeg";
  headerColor = favColors[rnd - 1] as { avgColor: string };
}

/**
 * Clears all potentially running loops and resets all instance variables
 * @param {Integer} id The id of the image browser instance
 */
function initializeVariables(id: number) {
  //Clears all potentially running loops
  clearInterval(instance[id].moveScreen2);
  clearInterval(instance[id].adjustScreen2);
  clearInterval(instance[id].slowDown2);
  //Resets instance variables
  instance[id].startingCount2 = 0;
  instance[id].scrPos2 = 0;
  instance[id].endPos2 = 0;
  instance[id].startPos2 = 0;
  instance[id].count2 = 0;
  instance[id].mouseX2 = 0;
  instance[id].touchX2 = 0;
  instance[id].curTouchX2 = 0;
  instance[id].lastFocused2;
  instance[id].leftWrap2 = false;
  instance[id].rightWrap2 = false;
  instance[id].prevPos2 = 0;
  instance[id].images2 = [];
  instance[id].allImages2 = [];
  instance[id].wrapped = false;
}

/**
 * Begins the loading process of the images in the original carousel
 * @param {Integer} id The id of the image browser instance
 */
function loadCarousel(id: number) {
  for (let i = 0; i < data.length; i++) {
    instance[id].images[i] = createImage(data[i]);
  }
  //customizeBrowsers(id);
  //Clones the images array to put into the static allImages variable
  instance[id].allImages = duplicateArray(instance[id].images);
  //Initially updates the carousel to get a decent default going
  if (instance[id].carouselActive) {
    updateCarousel(id);
  } else {
    updateGallery(id);
  }
  instance[id].lastFocused = undefined;
  sort(id, "random");
  //images.length = 10;
  //Begins the instantiation process for the images
  for (let i = 0; i < instance[id].images.length; i++) {
    //Creates the images in the HTML DOM
    const element = document.createElement("IMG") as ImageElement;
    element.src = instance[id].images[i].fileName;
    element.classList.add("icItem");
    //Only when the last element loads does it call initializeImages
    element.onload = function () {
      instance[id].startingCount++;
      instance[id].loadingLbl.innerHTML =
        "Loading: " +
        Math.floor(
          (instance[id].startingCount / instance[id].images.length) * 100
        ) +
        "%";
      if (instance[id].startingCount == instance[id].images.length) {
        initializeImages(id);
      }
    };
    element.style.opacity = "0.00001";
    //Officially adds the images to the HTML DOM
    instance[id].carousel.appendChild(element);
  }
}

/**
 * Begins the loading process of the images2 in the original carousel2
 * @param {Integer} id The id of the image browser instance
 */
function loadCarousel2(id: number) {
  //Clones the images2 array to put into the static allImages variable
  instance[id].allImages2 = duplicateArray(instance[id].images2!);
  instance[id].loadingLbl2.style.display = "block";
  //Initially updates the carousel2 to get a decent default going
  updateCarousel2(id);
  if (instance[id].images2?.length || 0 <= 1) {
    instance[id].leftArrow2.style.display = "none";
    instance[id].rightArrow2.style.display = "none";
  } else {
    instance[id].leftArrow2.style.display = "inline-block";
    instance[id].rightArrow2.style.display = "inline-block";
    instance[id].leftArrow2.style.opacity = "0.0001";
    instance[id].rightArrow2.style.opacity = "0.0001";
  }
  instance[id].lastFocused2 = undefined;
  //Begins the instantiation process for the images2
  for (let i = 0; i < (instance[id].images2?.length || 0); i++) {
    //Creates the images2 in the HTML DOM
    const element = document.createElement("IMG") as ImageElement;
    element.src = instance[id].images2![i].fileName;
    element.classList.add("icItem2");
    element.style.opacity = "0.00001";
    //Only when the last element loads does it call initializeImages2
    element.onload = function () {
      instance[id].startingCount2 = (instance[id].startingCount2 || 0) + 1;
      if (instance[id].startingCount2 == instance[id].images2!.length) {
        initializeImages2(id);
      }
    };
    //Officially adds the images2 to the HTML DOM
    instance[id].carousel2.appendChild(element);
  }
}

/**
 * Initializes the positions and widths of each image,
 * along with key variables for the array
 * @param {Integer} id The id of the image browser instance
 */
function initializeImages(id: number) {
  //Initializes the curPos equal to the start of the first image, which should be less than halfWidth (negative)
  let curPos = -instance[id].carousel.children[0].clientWidth / 2;
  for (let i = 0; i < instance[id].carousel.children.length; i++) {
    const element = instance[id].carousel.children[i] as ImageElement;
    const imPosition = curPos;
    //Creates key variables for the images
    instance[id].images[i] = {
      ...instance[id].images[i],
      position: imPosition,
      endPosition: imPosition + element.clientWidth,
      clientWidth: element.clientWidth,
      center: imPosition + element.clientWidth / 2,
      element,
      displayed: true,
    };
    //Important variable for the first iteration of rendering
    instance[id].images[i].element!.style.opacity = "1";
    instance[id].leftArrow.style.display = "inline-block";
    instance[id].rightArrow.style.display = "inline-block";

    instance[id].images[i].displayed = true;
    //Increments the curPos for the next image in the loop
    curPos += element.clientWidth + imPadding;

    const index = id;
    element.addEventListener("click", function (e) {
      handleImageClick(index, e);
    });
  }
  instance[id].loadingLbl.style.display = "none";
  //Clones the images array to put into the static allImages variable
  instance[id].allImages = duplicateArray(instance[id].images);
  //Sets the start and end variables based on padding (important calc for render)
  instance[id].endPos =
    instance[id].images[instance[id].images.length - 1].endPosition! +
    imPadding +
    instance[id].images[0].clientWidth! / 2;
  instance[id].startPos = -(
    instance[id].images[0].clientWidth! / 2 +
    imPadding
  );
  if (mobile) {
    //TODO: I would absolutely love to make a decent touch event handler
    instance[id].carousel.addEventListener("touchstart", function (event) {
      handleTouchStart(id, event);
    });
    instance[id].carousel.addEventListener("touchmove", function (event) {
      handleTouchMove(id, event);
    });
    instance[id].carousel.addEventListener("touchend", function () {
      handleTouchStop(id);
    });
    instance[id].carousel2.addEventListener("touchstart", function (event) {
      handleTouchStart2(id, event);
    });
    instance[id].carousel2.addEventListener("touchmove", function (event) {
      handleTouchMove2(id, event);
    });
    instance[id].carousel2.addEventListener("touchend", function () {
      handleTouchStop2(id);
    });
  } else {
    instance[id].carousel.addEventListener("mousemove", function (event) {
      instance[id].mouseX = event.clientX - halfWidth;
      //Stop any potentially existing slowDown interval
      clearInterval(instance[id].slowDown);
    });
    instance[id].carousel.addEventListener("mouseleave", function () {
      handleMouseLeave(id);
    });
    instance[id].carousel2.addEventListener("mousemove", function (event) {
      handleMouseMove(id, event);
    });
    instance[id].carousel2.addEventListener("mouseleave", function () {
      handleMouseOut(id);
    });
  }
  //Randomly orders the image array every time the page is loaded
  sort(id, "random");
  //Makes sure the carousel updates with the new data
  if (instance[id].carouselActive) {
    updateCarousel(id);
  } else {
    updateGallery(id);
  }
  /*
    //Experimental test with loading in low quality images first and rerendering with higher quality
    for (let i = 0; i < instance[id].images.length; i++) {
        instance[id].images[i].fileName = instance[id].images[i].fileName.substring(instance[id].images[i].fileName.indexOf("/", 8));
        if(mobile) {
            instance[id].images[i].fileName = "small/" + instance[id].images[i].fileName;
        }
        else {
            instance[id].images[i].fileName = "medium/" + instance[id].images[i].fileName;
        }
        instance[id].images[i].element.src = instance[id].images[i].fileName;
    }
    */
  if (instance[id].carouselActive) {
    updateCarousel(id);
  } else {
    updateGallery(id);
  }
  //While the mousemove event updates position, the interval does the brute calculation due to timing
  setInterval(
    function (id) {
      if (instance[id].images.length > 1) {
        if (instance[id].mouseX != 0) {
          instance[id].scrPos += instance[id].mouseX / antiSensitivity;
          //Wrap around left
          if (instance[id].scrPos < 0) {
            if (!instance[id].leftWrap) {
              instance[id].scrPos = 0;
            } else if (instance[id].scrPos < instance[id].startPos) {
              instance[id].scrPos = instance[id].endPos + instance[id].scrPos;
            }
          }
          //Wrap around right
          else if (
            instance[id].scrPos >
            instance[id].images[instance[id].images.length - 1].center!
          ) {
            if (!instance[id].rightWrap) {
              instance[id].scrPos =
                instance[id].images[instance[id].images.length - 1].center!;
            } else if (instance[id].scrPos > instance[id].endPos) {
              instance[id].scrPos = instance[id].scrPos - instance[id].endPos;
            }
          }
          //Makes sure its necessary to update the carousel
          if (instance[id].scrPos != instance[id].prevPos) {
            //Re-renders the carousel
            if (instance[id].carouselActive) {
              updateCarousel(id);
            }
          }
          instance[id].prevPos = instance[id].scrPos;
        }
      }
    },
    20,
    id
  );
}

/**
 * Initializes the positions and widths of each image,
 * along with key variables for the array
 * @param {Integer} id The id of the image browser instance
 * @param {Boolean} sizeChange Whether or not the re-initialization is due to screen size change
 */
function initializeImages2(id: number, sizeChange = false) {
  //Initializes the curPos equal to the start of the first image, which should be less than halfWidth (negative)
  let curPos = -instance[id].carousel2.children[0].clientWidth / 2;
  for (let i = 0; i < instance[id].carousel2.children.length; i++) {
    if (sizeChange) {
      instance[id].images2![i].element!.style.display = "block";
      instance[id].images2![i].element!.style.transform = "rotate(0deg)ww";
    }
    const element = instance[id].carousel2.children[i] as ImageElement;
    const imPosition = curPos;
    //Creates key variables for the images2
    instance[id].images2![i].position = imPosition;
    instance[id].images2![i].endPosition = imPosition + element.clientWidth;
    instance[id].images2![i].clientWidth = element.clientWidth;
    instance[id].images2![i].center =
      instance[id].images2![i].position! +
      instance[id].images2![i].clientWidth! / 2;
    instance[id].images2![i].element = element;
    instance[id].images2![i].element!.style.opacity = "1";
    if (i > 0) {
      (element as any).value =
        instance[id].activeImage?.substring(
          0,
          instance[id].activeImage?.indexOf(".")
        ) +
        "_" +
        i +
        ".jpeg";
    } else {
      element.value = instance[id].activeImage || "";
    }
    //Remove event listeners from the image
    if (element.myListeners) {
      for (let i = 0; i < element.myListeners.length; i++) {
        element.removeEventListener(
          element.myListeners[i].eType,
          element.myListeners[i].callBack
        );
      }
      delete element.myListeners;
    }
    //Add new event listener to the image
    element.addEventListener("click", function (event) {
      handleDetailsImageClick(id, event);
    });
    instance[id].loadingLbl2.style.display = "none";
    //Determines whether to display the arrows
    if (instance[id].images2!.length > 1) {
      instance[id].leftArrow2.style.opacity = "1";
      instance[id].rightArrow2.style.opacity = "1";
    }
    //Important variable for the first iteration of rendering
    instance[id].images2![i].displayed = true;
    //Increments the curPos for the next image in the loop
    curPos += element.clientWidth + imPadding;
  }
  //Clones the images2 array to put into the static allImages variable
  instance[id].allImages2 = duplicateArray(instance[id].images2!);
  //Sets the start and end variables based on padding (important calc for render)
  instance[id].endPos2 =
    instance[id].images2![instance[id].images2!.length - 1].endPosition! +
    imPadding +
    instance[id].images2![0].clientWidth! / 2;
  instance[id].startPos2 = -(
    instance[id].images2![0].clientWidth! / 2 +
    imPadding
  );
  //Makes sure the carousel2 updates with the new data
  updateCarousel2(id);
  clearInterval(instance[id].adjustScreen2);
  //While the mousemove event updates position, the interval does the brute calculation due to timing
  instance[id].adjustScreen2 = setInterval(
    function (id) {
      if (instance[id].images2!.length > 0) {
        if (instance[id].mouseX2 != 0) {
          instance[id].scrPos2! += instance[id].mouseX2! / antiSensitivity;
          //Wrap around left
          if (instance[id].scrPos2! < 0) {
            if (!instance[id].leftWrap2) {
              instance[id].scrPos2 = 0;
            } else if (instance[id].scrPos2! < instance[id].startPos2!) {
              instance[id].scrPos2 =
                instance[id].endPos2! + instance[id].scrPos2!;
            }
          }
          //Wrap around right
          else if (
            instance[id].scrPos2! >
            instance[id].images2![instance[id].images2!.length - 1].center!
          ) {
            if (!instance[id].rightWrap2) {
              instance[id].scrPos2 =
                instance[id].images2![instance[id].images2!.length - 1].center;
            } else if (instance[id].scrPos2! > instance[id].endPos2!) {
              instance[id].scrPos2 =
                instance[id].scrPos2! - instance[id].endPos2!;
            }
          }
          //Makes sure its necessary to update the carousel2
          if (instance[id].scrPos2 != instance[id].prevPos2) {
            //Re-renders the carousel2
            updateCarousel2(id);
          }
          instance[id].prevPos2 = instance[id].scrPos2;
        }
      }
    },
    20,
    id
  );
}

/**
 * Renders the carousel based on the current screen position
 * Wraps around itself like the images are in a circle
 * @param {Integer} id The id of the image browser instance
 */
function updateCarousel(id: number) {
  //These will be used in the calculation of background color
  const closestToCenter: { dist: number; element?: Image } = {
    dist: 9999999,
    element: undefined,
  };
  const secondClosest: { dist: number; element?: Image } = {
    dist: 9999999,
    element: undefined,
  };
  //Reset the values of right and left wrap
  instance[id].rightWrap = false;
  instance[id].leftWrap = false;
  for (let i = 0; i < instance[id].images.length; i++) {
    const element = instance[id].images[i].element as ImageElement;
    //Keeps track of whether the image has been displayed
    let displayed = true;
    //Pulls location details from the image based on its position
    let details = getDetails(
      id,
      instance[id].images[i].center! - instance[id].scrPos,
      i
    );
    //If the leftmost side is visible, or if the rightmost side is visible, sets the location
    if (details.right > -halfWidth && details.left < halfWidth) {
      element.style.left =
        instance[id].images[i].position! -
        instance[id].scrPos +
        halfWidth +
        "px";
    } else if (instance[id].images.length > 5) {
      details = getDetails(
        id,
        -instance[id].endPos +
          instance[id].images[i].center! -
          instance[id].scrPos,
        i
      );
      //If the rightmost side is visible when posLeft is inverted, sets the location
      instance[id].leftWrap = true;
      if (-details.right < halfWidth) {
        element.style.left =
          width -
          instance[id].endPos +
          instance[id].images[i].endPosition! -
          instance[id].scrPos -
          halfWidth -
          instance[id].images[i].clientWidth! +
          "px";
      } else {
        details = getDetails(
          id,
          instance[id].endPos -
            instance[id].scrPos +
            instance[id].images[i].center!,
          i
        );
        //If the leftmost side is visible when wrapping around, sets the location
        if (details.left < halfWidth) {
          instance[id].rightWrap = true;
          element.style.left =
            instance[id].endPos -
            instance[id].scrPos +
            instance[id].images[i].position! +
            halfWidth +
            "px";
        } else {
          //Only configures the DOM when there is a feature to change
          if (instance[id].images[i].displayed) {
            element.style.display = "none";
          }
          instance[id].images[i].displayed = false;
          displayed = false;
        }
      }
    } else {
      //Only configures the DOM when there is a feature to change
      if (instance[id].images[i].displayed) {
        element.style.display = "none";
      }
      instance[id].images[i].displayed = false;
      displayed = false;
    }
    if (displayed) {
      //Only configures the DOM when there is a feature to change
      if (!instance[id].images[i].displayed) {
        element.style.display = "block";
      }
      instance[id].images[i].displayed = true;
      //Compares with closest and second closest to the middle to find the correct elements
      if (details.dist < closestToCenter.dist) {
        secondClosest.element = closestToCenter.element;
        secondClosest.dist = closestToCenter.dist;
        closestToCenter.element = instance[id].images[i];
        closestToCenter.dist = details.dist;
      } else if (details.dist < secondClosest.dist) {
        secondClosest.element = instance[id].images[i];
        secondClosest.dist = details.dist;
      }
      //Rotates and moves the element based on its distance from the center to create a 3D circle gallery
      element.style.transform =
        "rotateY(" +
        details.angle +
        "rad) translate3d(0, 0," +
        details.pushDist +
        "px)";
    }
  }
  //Handles the case where there are no elements in the images array
  if (
    secondClosest.element == undefined &&
    closestToCenter.element == undefined
  ) {
    instance[id].title.style.opacity = "0";
    instance[id].leftArrow.style.display = "none";
    instance[id].rightArrow.style.display = "none";
    instance[id].browser.style.backgroundColor =
      "rgb(" +
      headerColor.avgColor[0] +
      ", " +
      headerColor.avgColor[1] +
      ", " +
      headerColor.avgColor[2] +
      ")";
    if (instance[id].loadingLbl.style.display != "block") {
      instance[id].noMatches.style.display = "block";
    }
  } else {
    instance[id].noMatches.style.display = "none";
    //Sets the background color of the image carousel equal to the weighted average colors of the two closest pictures
    let colorRatio;
    let color1;
    let color2;
    let opacity;
    //Makes the color display even if there is only one element
    if (secondClosest.element == undefined) {
      colorRatio = 0;
      color1 = closestToCenter.element!.avgColor;
      color2 = closestToCenter.element!.avgColor;
      opacity = 1;
    } else {
      colorRatio = closestToCenter.dist / secondClosest.dist / 2;
      color1 = closestToCenter.element!.avgColor;
      color2 = secondClosest.element!.avgColor;
      opacity = Math.sin(
        (((secondClosest.dist - closestToCenter.dist) / secondClosest.dist) *
          Math.PI) /
          2
      );
      instance[id].leftArrow.style.display = "inline-block";
      instance[id].rightArrow.style.display = "inline-block";
    }
    const r =
      (1 - colorRatio) * parseInt(color1[0]) + colorRatio * parseInt(color2[0]);
    const g =
      (1 - colorRatio) * parseInt(color1[1]) + colorRatio * parseInt(color2[1]);
    const b =
      (1 - colorRatio) * parseInt(color1[2]) + colorRatio * parseInt(color2[2]);
    instance[id].browser.style.backgroundColor =
      "rgb(" + r + ", " + g + ", " + b + ")";
    //customizeColor(id, "rgb(" + r + ", " + g + ", " + b + ")");
    //Sets the image data only if it needs to be changed
    if (closestToCenter.element != instance[id].lastFocused) {
      instance[id].title.innerHTML = closestToCenter.element!.title;
      instance[id].lastFocused = closestToCenter.element;
    }
    //Changes the opacity of the image data depending on its reliability
    instance[id].title.style.opacity = opacity.toString();
  }
}

/**
 * Renders the carousel2 based on the current screen position
 * Wraps around itself like the images2 are in a circle
 * @param {Integer} id The id of the image browser instance
 */
function updateCarousel2(id: number) {
  //These will be used in the calculation of background color
  const closestToCenter = {
    dist: 9999999,
    element: undefined,
  };
  const secondClosest = {
    dist: 9999999,
    element: undefined,
  };
  //Reset the values of right and left wrap
  instance[id].rightWrap2 = false;
  instance[id].leftWrap2 = false;
  for (let i = 0; i < instance[id].images2!.length; i++) {
    const element = instance[id].images2![i].element as ImageElement;
    //Keeps track of whether the image has been displayed
    let displayed = true;
    //Pulls location details from the image based on its position
    let details = getDetails2(
      id,
      instance[id].images2![i].center! - instance[id].scrPos2!,
      i
    );
    //If the leftmost side is visible, or if the rightmost side is visible, sets the location
    if (details.right > -halfWidth2 && details.left < halfWidth2) {
      element.style.left =
        instance[id].images2![i].position! -
        instance[id].scrPos2! +
        halfWidth2 +
        "px";
    } else if (instance[id].images2!.length > 5) {
      details = getDetails2(
        id,
        -instance[id].endPos2! +
          instance[id].images2![i].center! -
          instance[id].scrPos2!,
        i
      );
      //If the rightmost side is visible when posLeft is inverted, sets the location
      if (-details.right < halfWidth2) {
        instance[id].leftWrap2 = true;
        element.style.left =
          width2 -
          instance[id].endPos2! +
          instance[id].images2![i].endPosition! -
          instance[id].scrPos2! -
          halfWidth2 -
          instance[id].images2![i].clientWidth! +
          "px";
      } else {
        details = getDetails2(
          id,
          instance[id].endPos2! -
            instance[id].scrPos2! +
            instance[id].images2![i].center!,
          i
        );
        //If the leftmost side is visible when wrapping around, sets the location
        if (details.left < halfWidth2) {
          instance[id].rightWrap2 = true;
          element.style.left =
            instance[id].endPos2! -
            instance[id].scrPos2! +
            instance[id].images2![i].position! +
            halfWidth2 +
            "px";
        } else {
          //Only configures the DOM when there is a feature to change
          if (instance[id].images2![i].displayed) {
            element.style.display = "none";
          }
          instance[id].images2![i].displayed = false;
          displayed = false;
        }
      }
    } else {
      //Only configures the DOM when there is a feature to change
      if (instance[id].images2![i].displayed) {
        element.style.display = "none";
      }
      instance[id].images2![i].displayed = false;
      displayed = false;
    }
    if (displayed) {
      //Only configures the DOM when there is a feature to change
      if (!instance[id].images2![i].displayed) {
        element.style.display = "block";
      }
      instance[id].images2![i].displayed = true;
      //Rotates and moves the element based on its distance from the center to create a 3D circle gallery
      element.style.transform =
        "rotateY(" +
        details.angle +
        "rad) translate3d(0, 0," +
        details.pushDist +
        "px)";
    }
  }
}

/**
 * Gets the specifics of the images distance from the center of the screen for use in rendering
 * @param {Integer} id The id of the image browser instance
 * @param {Number} distInit Distance of image from the center of the screen
 * @param {Integer} i Index of the images array
 */
function getDetails(id: number, distInit: number, i: number) {
  //Finds the absolute value of the distance needed for some calculations
  const dist = Math.abs(distInit);
  const angle = ((distInit / halfWidth) * maxAngle * Math.PI) / 180;
  const pushDist = (Math.abs(Math.sin(angle)) * -dist) / distanceDivider;
  const angleChange =
    (Math.cos(angle) * instance[id].images[i].clientWidth!) / 2;
  const perspectiveChange =
    (Math.cos(angle) * pushDist - angleChange) * perspectiveCalibration;
  const right =
    distInit + Math.sin(angle) * pushDist - angleChange + perspectiveChange;
  const left =
    distInit + Math.sin(angle) * pushDist + angleChange - perspectiveChange;
  return {
    dist: dist,
    angle: angle,
    right: right,
    left: left,
    pushDist: pushDist,
  };
}

/**
 * Identifies key values for the position of the current image
 * @param {Integer} id The id of the image browser instance
 * @param {Integer} distInit The distance initialization for the current image
 * @param {Integer} i        The index of the current image
 */
function getDetails2(id: number, distInit: number, i: number) {
  //Finds the absolute value of the distance needed for some calculations
  const dist = Math.abs(distInit);
  const angle = ((distInit / halfWidth2) * maxAngle * Math.PI) / 180;
  const pushDist = (Math.abs(Math.sin(angle)) * -dist) / distanceDivider;
  const angleChange =
    (Math.cos(angle) * instance[id].images2![i].clientWidth!) / 2;
  const perspectiveChange =
    (Math.cos(angle) * pushDist - angleChange) * perspectiveCalibration2;
  const right =
    distInit + Math.sin(angle) * pushDist - angleChange + perspectiveChange;
  const left =
    distInit + Math.sin(angle) * pushDist + angleChange - perspectiveChange;
  return {
    dist: dist,
    angle: angle,
    right: right,
    left: left,
    pushDist: pushDist,
  };
}

/**
 * Acts as the handler for any change event of the filters
 * @param {Integer} id The id of the image browser instance
 * @param {Event} e
 */
export function filterChange(id: number, e: any) {
  //Simplifies coding slightly
  const element = e.target;
  //Decides whether to add or remove the filter, and then enacts the decision
  if (element.checked) {
    add(instance[id].filters, element.value);
  } else {
    remove(instance[id].filters, element.value);
  }
  //Clears the images in the viewport
  clearCarousel(id);
  //Recreates the array of images
  applyFilters(id);
  //Resorts the array of images
  sort(id, "", "noToggle");
  //Repositions and displays the images
  reinitializeImages(id);
}

/**
 * Performs the same actions as the filterChange method, but with special controls for DIV elements
 * @param {Integer} id The id of the image browser instance
 * @param {Event} e
 * @param {String} filter
 */
export function filterChangeDiv(id: number, e: any, filter: string) {
  //Finds the correct element
  let element = e.target;
  while (!element.classList.contains("colorSelect")) {
    element = element.parentNode;
  }
  //Decides whether to add or remove the filter, and then enacts the decision
  if (element.classList.contains("colorSelected")) {
    remove(instance[id].filters, filter);
  } else {
    add(instance[id].filters, filter);
  }
  //Toggles the appearance of the DIV
  element.classList.toggle("colorSelected");
  //Clears the images in the viewport
  clearCarousel(id);
  //Recreates the array of images
  applyFilters(id);
  //Resorts the array of images
  sort(id, "", "noToggle");
  //Repositions and displays the images
  reinitializeImages(id);
}

/**
 * Acts as the handler for a filter change from a select menu
 * @param {Integer} id The id of the image browser instance
 * @param {Event} e
 */
export function filterChangeSelect(id: number, e: any) {
  //Finds the correct element
  const element = e.target;
  //Clears any old filters
  if (element.name == "types") {
    remove(instance[id].filters, "bclassic");
    remove(instance[id].filters, "bcharOrScene");
    remove(instance[id].filters, "bwood");
  } else if (element.name == "events") {
    remove(instance[id].filters, "bhalloween");
    remove(instance[id].filters, "bchristmas");
    remove(instance[id].filters, "bpride");
  }
  //Adds the currently selected filter
  if (element.value != undefined) {
    add(instance[id].filters, element.value);
  }
  //Clears the images in the viewport
  clearCarousel(id);
  //Recreates the array of images
  applyFilters(id);
  //Resorts the array of images
  sort(id, "", "noToggle");
  //Repositions and displays the images
  reinitializeImages(id);
}

/**
 * Completely clears the viewport of images
 */
function clearCarousel(id: number) {
  for (let i = 0; i < instance[id].allImages.length; i++) {
    //Removes all elements from display and indicates it
    instance[id].allImages[i].element!.style.display = "none";
    instance[id].allImages[i].displayed = false;
  }
}

/**
 * Recreates the array based on the filters
 */
function applyFilters(id: number) {
  //Sets images equal to allImages without connecting them
  loadImages(id);
  //Loops through the filters to increase specificity
  for (let i = 0; i < instance[id].filters.length; i++) {
    //Deals with color filters
    if (instance[id].filters[i][0] == "c") {
      const filt = instance[id].filters[i].substring(
        1,
        instance[id].filters[i].length
      );
      //Identifies any image that does not match the filter and removes it from the array
      for (let j = 0; j < instance[id].images.length; j++) {
        if (!contains(instance[id].images[j].colors, filt)) {
          remove(instance[id].images, instance[id].images[j]);
          j--;
        }
      }
    } else if (instance[id].filters[i][0] == "b") {
      const filt = instance[id].filters[i].substring(
        1,
        instance[id].filters[i].length
      );
      //Identifies any image that does not match the filter and removes it from the array
      for (let j = 0; j < instance[id].images.length; j++) {
        if ((!instance[id].images[j] as any)[filt]) {
          remove(instance[id].images, instance[id].images[j]);
          j--;
        }
      }
    }
  }
}

/**
 * Sets images equal to allImages without connecting them
 */
function loadImages(id: number) {
  instance[id].images = [];
  for (let i = 0; i < instance[id].allImages.length; i++) {
    add(instance[id].images, instance[id].allImages[i]);
  }
}

/**
 * Calculates position of images and displays the carousel
 */
function reinitializeImages(id: number, sizeChange = false) {
  const oldEndPos = instance[id].endPos;
  if (instance[id].images.length != 0) {
    //Initializes the curPos equal to the start of the first image, which should be less than halfWidth (negative)
    if (sizeChange) {
      for (let i = 0; i < instance[id].images.length; i++) {
        instance[id].images[i].element!.style.display = "block";
        instance[id].images[i].element!.style.transform = "rotate(0deg)ww";
        instance[id].images[i].clientWidth =
          instance[id].images[i].element!.clientWidth;
        if (!instance[id].images[i].displayed) {
          instance[id].images[i].element!.style.display = "none";
        }
      }
    }
    let curPos = -instance[id].images[0].clientWidth! / 2;
    for (let i = 0; i < instance[id].images.length; i++) {
      const imPosition = curPos;
      //Creates key variables for the images
      instance[id].images[i].position = imPosition;
      instance[id].images[i].endPosition =
        imPosition + instance[id].images[i].clientWidth!;
      instance[id].images[i].center =
        instance[id].images[i].position! +
        instance[id].images[i].clientWidth! / 2;
      //Increments the curPos for the next image in the loop
      curPos += instance[id].images[i].clientWidth! + imPadding;
    }
    //Sets the start and end variables based on padding (important calc for render)
    instance[id].endPos =
      instance[id].images[instance[id].images.length - 1].endPosition! +
      imPadding +
      instance[id].images[0].clientWidth! / 2;
    instance[id].startPos = -(
      instance[id].images[0].clientWidth! / 2 +
      imPadding
    );
  }
  if (sizeChange) {
    instance[id].scrPos =
      (instance[id].scrPos * instance[id].endPos) / oldEndPos;
  } else {
    instance[id].scrPos = 0;
  }
  if (instance[id].carouselActive) {
    updateCarousel(id);
  } else {
    updateGallery(id);
  }
}

/**
 * Sorts the images array based on a specified variable in either default descending order
 * @param {Integer} id The id of the image browser instance
 * @param {String}  variable
 * @param {Boolean} desc
 */
export function sort(
  id: number,
  variable: string,
  desc: "toggle" | "noToggle" | boolean = true
) {
  let active = false;
  if (desc == "toggle") {
    if (instance[id].sortData[variable] !== undefined) {
      active = true;
      if (instance[id].sortData[variable]) {
        desc = false;
        instance[id].sortData[variable] = false;
      } else {
        desc = true;
        instance[id].sortData[variable] = true;
      }
    } else {
      desc = true;
      instance[id].sortData[variable] = true;
    }
  } else if (desc == "noToggle") {
    const keys = Object.keys(instance[id].sortData);
    for (let i = 0; i < keys.length; i++) {
      if (instance[id].sortData[keys[i]] !== undefined) {
        variable = keys[i];
        desc = !!instance[id].sortData[keys[i]];
      }
    }
  }
  const keys = Object.keys(instance[id].sortData);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] != variable) {
      instance[id].sortData[keys[i]] = undefined;
      if (keys[i] == "size") {
        (instance[id].sizeBtn.children[1] as HTMLElement).style.opacity = "0";
        (instance[id].sizeBtn.children[1] as HTMLElement).style.transform =
          "rotate(0deg)";
        instance[id].sizeBtn.classList.remove("activeSort");
      } else if (keys[i] == "title") {
        (instance[id].titleBtn.children[1] as HTMLElement).style.opacity = "0";
        (instance[id].titleBtn.children[1] as HTMLElement).style.transform =
          "rotate(0deg)";
        instance[id].titleBtn.classList.remove("activeSort");
      } else if (keys[i] == "date") {
        (instance[id].dateBtn.children[1] as HTMLElement).style.opacity = "0";
        (instance[id].dateBtn.children[1] as HTMLElement).style.transform =
          "rotate(0deg)";
        instance[id].dateBtn.classList.remove("activeSort");
      } else if (keys[i] == "price") {
        (instance[id].priceBtn.children[1] as HTMLElement).style.opacity = "0";
        (instance[id].priceBtn.children[1] as HTMLElement).style.transform =
          "rotate(0deg)";
        instance[id].priceBtn.classList.remove("activeSort");
      } else if (keys[i] == "random") {
        instance[id].randomBtn.classList.remove("activeSort");
      }
    }
  }
  //Defines the temporary array
  const result = [];
  //Handles the case of a desired random order
  if (variable == "random") {
    const length = instance[id].images.length;
    //For every element in arr, removes a random element and places it at the end of the new array
    for (let i = 0; i < length; i++) {
      result.push(
        instance[id].images.splice(
          Math.floor(Math.random() * instance[id].images.length),
          1
        )[0]
      );
    }
    instance[id].randomBtn.classList.add("activeSort");
  }
  //Handles the case of an order by size, as special parsing is used
  else if (variable == "size") {
    const areas = [];
    for (let i = 0; i < instance[id].images.length; i++) {
      let placed = false;
      //Determines the numerical data of the sides and the area of the painting
      const size = parseSize(instance[id].images[i].size);
      const num1 = Number.parseFloat(size.substring(0, size.indexOf("x")));
      const num2 = Number.parseFloat(size.substring(size.indexOf("x") + 1));
      const area = num1 * num2;
      //Adds each task to a new array in alphabetical order
      for (let j = 0; j < result.length; j++) {
        //Handles the descending case
        if (desc) {
          if (area > areas[j]) {
            result.splice(j, 0, instance[id].images[i]);
            areas.splice(j, 0, area);
            j = result.length;
            placed = true;
          }
        }
        //Handles the ascending case
        else {
          if (area < areas[j]) {
            result.splice(j, 0, instance[id].images[i]);
            areas.splice(j, 0, area);
            j = result.length;
            placed = true;
          }
        }
      }
      //If the loop finished without the element being placed, it is placed at the end of the array
      if (!placed) {
        result.push(instance[id].images[i]);
        areas.push(area);
      }
    }
    instance[id].sizeBtn.classList.add("activeSort");
    if (active) {
      if (desc) {
        (instance[id].sizeBtn.children[1] as HTMLElement).style.transform =
          "rotate(0deg)";
      } else {
        (instance[id].sizeBtn.children[1] as HTMLElement).style.transform =
          "rotate(180deg)";
      }
    } else {
      (instance[id].sizeBtn.children[1] as HTMLElement).style.opacity = "1";
    }
  } else if (variable == "price") {
    //Places all images with a defined property into their proper order
    for (let i = 0; i < instance[id].images.length; i++) {
      if (instance[id].images[i][variable] != "") {
        let placed = false;
        const num1 = parseInt(instance[id].images[i][variable].substring(1));
        const num2 = parseInt(instance[id].images[i][variable].substring(1));
        //Adds each task to a new array in alphabetical order
        for (let j = 0; j < result.length; j++) {
          //Handles the descending case
          if (desc) {
            if (instance[id].images[i][variable] > result[j][variable]) {
              result.splice(j, 0, instance[id].images[i]);
              j = result.length;
              placed = true;
            }
          }
          //Handles the ascending case
          else {
            if (instance[id].images[i][variable] < result[j][variable]) {
              result.splice(j, 0, instance[id].images[i]);
              j = result.length;
              placed = true;
            }
          }
        }
        //If the loop finished without the element being placed, it is placed at the end of the array
        if (!placed) {
          result.push(instance[id].images[i]);
        }
      }
    }
    //Pushes all images with a non-defined property onto the end of the array
    for (let i = 0; i < instance[id].images.length; i++) {
      if (instance[id].images[i][variable] == "") {
        result.push(instance[id].images[i]);
      }
    }
    instance[id].priceBtn.classList.add("activeSort");
    if (active) {
      if (desc) {
        (instance[id].priceBtn.children[1] as HTMLElement).style.transform =
          "rotate(0deg)";
      } else {
        (instance[id].priceBtn.children[1] as HTMLElement).style.transform =
          "rotate(180deg)";
      }
    } else {
      (instance[id].priceBtn.children[1] as HTMLElement).style.opacity = "1";
    }
  } else {
    //Places all images with a defined property into their proper order
    for (let i = 0; i < instance[id].images.length; i++) {
      if ((instance[id].images[i] as any)[variable] != "") {
        let placed = false;
        //Adds each task to a new array in alphabetical order
        for (let j = 0; j < result.length; j++) {
          //Handles the descending case
          if (desc) {
            if (
              (instance[id].images[i] as any)[variable] >
              (result[j] as any)[variable]
            ) {
              result.splice(j, 0, instance[id].images[i]);
              j = result.length;
              placed = true;
            }
          }
          //Handles the ascending case
          else {
            if (
              (instance[id].images[i] as any)[variable] <
              (result[j] as any)[variable]
            ) {
              result.splice(j, 0, instance[id].images[i]);
              j = result.length;
              placed = true;
            }
          }
        }
        //If the loop finished without the element being placed, it is placed at the end of the array
        if (!placed) {
          result.push(instance[id].images[i]);
        }
      }
    }
    //Pushes all images with a non-defined property onto the end of the array
    for (let i = 0; i < instance[id].images.length; i++) {
      if ((instance[id].images[i] as any)[variable] == "") {
        result.push(instance[id].images[i]);
      }
    }
    if (variable == "title") {
      instance[id].titleBtn.classList.add("activeSort");
      if (active) {
        if (desc) {
          (instance[id].titleBtn.children[1] as HTMLElement).style.transform =
            "rotate(0deg)";
        } else {
          (instance[id].titleBtn.children[1] as HTMLElement).style.transform =
            "rotate(180deg)";
        }
      } else {
        (instance[id].titleBtn.children[1] as HTMLElement).style.opacity = "1";
      }
    } else if (variable == "date") {
      instance[id].dateBtn.classList.add("activeSort");
      if (active) {
        if (desc) {
          (instance[id].dateBtn.children[1] as HTMLElement).style.transform =
            "rotate(0deg)";
        } else {
          (instance[id].dateBtn.children[1] as HTMLElement).style.transform =
            "rotate(180deg)";
        }
      } else {
        (instance[id].dateBtn.children[1] as HTMLElement).style.opacity = "1";
      }
    }
  }
  //Resets the images array and repositions elements.
  instance[id].images = result;
  instance[id].scrPos = 0;
  reinitializeImages(id);
}

/**
 * Sets the scrPos to move to a certain number over time, wrapping where necessary
 * @param {Integer} id
 * @param {Integer} pos
 * @param {Boolean} wrap
 */
function setScrPos(id: number, pos: number, wrap = false) {
  //Clears any previous moveScreen command
  clearInterval(instance[id].moveScreen);
  //If the more advanced 'wrap' case is used
  if (wrap) {
    instance[id].wrapped = false;
    instance[id].moveScreen = setInterval(
      function (id) {
        //If the carousel should move left
        if (
          (instance[id].scrPos < pos && !instance[id].wrapped) ||
          (instance[id].scrPos >= pos && instance[id].wrapped)
        ) {
          //Move left
          instance[id].scrPos -= moveSpeed;
          //If the end is found for the wrapped case
          if (instance[id].wrapped && instance[id].scrPos <= pos) {
            //Seal the deal
            instance[id].scrPos = pos;
            clearInterval(instance[id].moveScreen);
          }
          //If the end is found for the unwrapped case
          else if (instance[id].scrPos < 0) {
            //Wrap the carousel
            instance[id].scrPos = instance[id].endPos + instance[id].scrPos;
            instance[id].wrapped = true;
          }
        }
        //If the carousel should move right
        else {
          //Move right
          instance[id].scrPos += moveSpeed;
          //If the end is found for the wrapped case
          if (instance[id].wrapped && instance[id].scrPos >= pos) {
            //Seal the deal
            instance[id].scrPos = pos;
            clearInterval(instance[id].moveScreen);
          }
          //If the end is found for the unwrapped case
          else if (
            instance[id].scrPos >
            instance[id].images[instance[id].images.length - 1].center!
          ) {
            //Wrap the carousel
            instance[id].scrPos = instance[id].scrPos - instance[id].endPos;
            instance[id].wrapped = true;
          }
        }
        //Rerender every frame
        updateCarousel(id);
      },
      20,
      id
    );
  }
  //If the less advanced 'nowrap' case is used
  else {
    instance[id].moveScreen = setInterval(
      function (id) {
        //If the carousel should move right
        if (instance[id].scrPos < pos) {
          //Move right
          instance[id].scrPos += moveSpeed;
          //If the end is found
          if (instance[id].scrPos >= pos) {
            //Seal the deal
            instance[id].scrPos = pos;
            clearInterval(instance[id].moveScreen);
          }
        }
        //If the carousel should move left
        else {
          //Move left
          instance[id].scrPos -= moveSpeed;
          //If the end is found
          if (instance[id].scrPos <= pos) {
            //Seal the deal
            instance[id].scrPos = pos;
            clearInterval(instance[id].moveScreen);
          }
        }
        //Rerender the carousel every frame
        updateCarousel(id);
      },
      20,
      id
    );
  }
}

function setScrPos2(id: number, pos: number, wrap = false) {
  clearInterval(instance[id].moveScreen2);
  if (wrap) {
    instance[id].wrapped2 = false;
    instance[id].moveScreen2 = setInterval(
      function (id) {
        if (
          (instance[id].scrPos2! < pos && !instance[id].wrapped2) ||
          (instance[id].scrPos2! >= pos && instance[id].wrapped2)
        ) {
          instance[id].scrPos2! -= moveSpeed;
          if (instance[id].wrapped2! && instance[id].scrPos2! <= pos) {
            instance[id].scrPos2 = pos;
            clearInterval(instance[id].moveScreen2);
          } else if (instance[id].scrPos2! < 0) {
            instance[id].scrPos2 =
              instance[id].endPos2! + instance[id].scrPos2!;
            instance[id].wrapped2 = true;
          }
        } else {
          instance[id].scrPos2! += moveSpeed;
          if (instance[id].wrapped2 && instance[id].scrPos2! >= pos) {
            instance[id].scrPos2 = pos;
            clearInterval(instance[id].moveScreen2);
          } else if (
            instance[id].scrPos2! >
            instance[id].images2![instance[id].images2!.length - 1].center!
          ) {
            instance[id].scrPos2 =
              instance[id].scrPos2! - instance[id].endPos2!;
            instance[id].wrapped2 = true;
          }
        }
        updateCarousel2(id);
      },
      20,
      id
    );
  } else {
    instance[id].moveScreen2 = setInterval(
      function (id) {
        if (instance[id].scrPos2! < pos) {
          instance[id].scrPos2! += moveSpeed;
          if (instance[id].scrPos2! >= pos) {
            instance[id].scrPos2 = pos;
            clearInterval(instance[id].moveScreen2);
          }
        } else {
          instance[id].scrPos2! -= moveSpeed;
          if (instance[id].scrPos2! <= pos) {
            instance[id].scrPos2 = pos;
            clearInterval(instance[id].moveScreen2);
          }
        }
        updateCarousel2(id);
      },
      20,
      id
    );
  }
}

function lockScroll() {
  scrollHeight =
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;
  everythingContainer!.style.height = "99vh";
}

function unlockScroll() {
  everythingContainer!.style.height = "auto";
  window.scroll(0, scrollHeight);
}

/**
 * Finds the first element in the images array with an element equal to the specified element
 * @param {Array} arr
 * @param {*}     element
 */
function find(id: number, element: HTMLElement) {
  for (let i = 0; i < instance[id].images.length; i++) {
    //Carousel checker
    if (instance[id].images[i].element == element) {
      //Return proper image
      return instance[id].images[i];
    }
    //Gallery checker
    if (instance[id].images[i].element2! == element) {
      //Return proper image
      return instance[id].images[i];
    }
  }
  //Only return undefined if no image was found
  return undefined;
}

/**
 * Returns a new Im object that is a clone of the original object
 * @param {Im} obj
 * @return The image
 */
export function duplicateImage(obj: Image) {
  //Clones the object
  const newObj = JSON.parse(JSON.stringify(obj));
  //Resets the file name
  newObj.fileName = newObj.fileName.substring(
    newObj.fileName.indexOf("/") + 1,
    newObj.fileName.indexOf(".")
  );
  //Makes the image an instance of Im
  return createDuplicateImage(newObj);
}

/**
 * Returns a new Im object based on data passed in the obj variable, using different methods if duplicating
 * @param {Object}  obj
 * @param {Boolean} duplicate
 * @return The new image
 */
function createImage(obj: DatabaseImage) {
  const colors = parseArray(obj.colors);
  let subImages: { fileName: string }[] | undefined = [];
  //Makes all of the colors a standard lowercase
  for (let i = 0; i < colors.length; i++) {
    colors[i] = colors[i].toLowerCase();
  }
  //Creates an array of subImage file names to call when necessary
  if (obj.subImages !== 0) {
    for (let i = 0; i < obj.subImages; i++) {
      //Creates an object with the proper fileName to call later
      if (obj.fileName == "") {
        subImages[i] = {
          fileName: "medium/" + obj.title + "_" + (i + 1) + ".jpeg",
        };
      } else {
        subImages[i] = {
          fileName: "medium/" + obj.fileName + "_" + (i + 1) + ".jpeg",
        };
      }
    }
  } else {
    subImages = undefined;
  }
  //Makes the object an instance of Im
  return addFileNameToIm({
    title: obj.title,
    desc: obj.desc,
    forSale: parseBool(obj.forSale),
    price: obj.price,
    avgColor: parseArray(obj.avgColor),
    colors,
    size: obj.size,
    subImages,
    classic: parseBool(obj.classic),
    wood: parseBool(obj.wood),
    charOrScene: parseBool(obj.charOrScene),
    favorite: parseBool(obj.favorite),
    date: parseDate(obj.date),
    fileName: obj.fileName,
    halloween: parseBool(obj.halloween),
    christmas: parseBool(obj.christmas),
    pride: parseBool(obj.pride),
  });
}

/**
 * Returns a new Im object based on data passed in the obj variable, using different methods if duplicating
 * @param {Object}  obj
 * @param {Boolean} duplicate
 * @return The new image
 */
function createDuplicateImage(obj: NoFileNameImage) {
  return addFileNameToIm({ ...obj });
}

function addFileNameToIm(im: NoFileNameImage): Image {
  const { fileName, title } = im;

  let fn = "";
  if (fileName == "") {
    if (mobile) {
      fn = "large/" + title + ".jpeg";
    } else {
      fn = "large/" + title + ".jpeg";
    }
  } else {
    if (mobile) {
      fn = "large/" + fileName + ".jpeg";
    } else {
      fn = "large/" + fileName + ".jpeg";
    }
  }
  return {
    ...im,
    fileName: fn,
  };
}

/*
 * EVENT HANDLERS
 */
/**
 * Handles the event of an image being clicked
 * @param {Event} e
 */
function handleImageClick(id: number, e: any) {
  //Finds the image object of the element that was clicked
  const curImage = find(id, e.target)!;
  instance[id].activeImage = curImage.fileName;
  if (curImage != undefined) {
    if (mobile) {
      locking = true;
      lockTimeout = setTimeout(function () {
        lockScroll();
        locking = false;
      }, 1000);
    }
    //Resets all instance variables and loops for the second carousel
    initializeVariables(id);
    //Removes all images from the carousel
    for (let i = 0; i < instance[id].carousel2.children.length; i++) {
      instance[id].carousel2.children[i].remove();
      i--;
    }
    //Adds the main image to the carousel
    instance[id].images2!.push({
      fileName: curImage.fileName,
    } as any);
    //Adds all subImages to the carousel
    if (curImage.subImages != undefined) {
      for (let i = 0; i < curImage.subImages.length; i++) {
        instance[id].images2!.push(curImage.subImages[i] as any);
      }
    }
    //Loads the carousel
    loadCarousel2(id);
    //Displays the details
    instance[id].coverTitle.innerHTML = curImage.title;
    instance[id].coverDesc.innerHTML = "Description: " + curImage.desc;
    instance[id].coverSize.innerHTML = curImage.size;
    if (curImage.forSale) {
      instance[id].coverPrice.innerHTML = "For Sale: " + curImage.price;
      instance[id].coverBuy.style.display = "inline-block";
    } else {
      instance[id].coverPrice.innerHTML = "Currently Not For Sale";
      instance[id].coverBuy.style.display = "none";
    }
    //Makes the details menu visible
    instance[id].coverInfo.style.backgroundColor =
      "rgb(" +
      curImage.avgColor[0] +
      "," +
      curImage.avgColor[1] +
      "," +
      curImage.avgColor[2] +
      ")";
    instance[id].cover.style.opacity = "1";
    instance[id].cover.style.zIndex = "9999";
  }
}

function handleDetailsImageClick(id: number, e: any) {
  //Finds the image object of the element that was clicked
  const curImage = e.target;
  const fileName =
    "actual/" + curImage.value.substring(curImage.value.lastIndexOf("/"));
  window.open(fileName);
}

/**
 * Handles the event of an image being clicked
 * @param {Event} e
 */
export function handleFilterBtnClick(id: number, e: any) {
  if (mobile) {
    locking = true;
    lockTimeout = setTimeout(function () {
      lockScroll();
      locking = false;
    }, 1000);
  }
  //Makes the filters menu visible
  instance[id].filterMenu.style.opacity = "1";
  instance[id].filterMenu.style.zIndex = "9999";
}

/**
 * Handles the event of the outside of the details menu being clicked
 * @param {Event} e
 */
export function handleOutsideCoverClick(id: number, e: any) {
  if (mobile) {
    if (locking) {
      clearTimeout(lockTimeout);
      locking = false;
    } else {
      unlockScroll();
    }
  }
  //Makes the details menu invisible
  instance[id].cover.style.opacity = "0";
  instance[id].cover.style.zIndex = "-1";
}

/**
 * Handles the event of the filters button being clicked
 * @param {Event} e
 */
export function handleOutsideFilterClick(id: number, e: any) {
  if (mobile) {
    if (locking) {
      clearTimeout(lockTimeout);
      locking = false;
    } else {
      unlockScroll();
    }
  }
  //Makes the filters menu invisible
  instance[id].filterMenu.style.opacity = "0";
  instance[id].filterMenu.style.zIndex = "-1";
}

export function handleCarouselClick(id: number, e: any) {
  if (!instance[id].carouselActive) {
    instance[id].carouselActive = true;
    instance[id].gridActive = false;
    instance[id].carouselBtn.classList.add("activeSwitchBtn");
    instance[id].gridBtn.classList.remove("activeSwitchBtn");
    instance[id].gallery.style.display = "none";
    instance[id].leftArrow.style.display = "inline-block";
    instance[id].rightArrow.style.display = "inline-block";
    instance[id].title.style.display = "block";
    instance[id].carousel.style.display = "block";
    deconstructGallery(id);
    reinitializeImages(id, true);
  }
}

export function handleGridClick(id: number, e: any) {
  if (!instance[id].gridActive) {
    instance[id].gridActive = true;
    instance[id].carouselActive = false;
    instance[id].gridBtn.classList.add("activeSwitchBtn");
    instance[id].carouselBtn.classList.remove("activeSwitchBtn");
    reinitializeImages(id);
    instance[id].carousel.style.display = "none";
    instance[id].leftArrow.style.display = "none";
    instance[id].rightArrow.style.display = "none";
    instance[id].title.style.display = "none";
    instance[id].gallery.style.display = "block";
  }
}

export function handleCommissionClick(id: number) {
  let active = instance[id].activeImage!;
  active = active.substring(active.lastIndexOf("/") + 1, active.indexOf("."));
  window.open("commission.html?active=" + active, "_self");
}

export function handlePurchaseClick(id: number) {
  let active = instance[id].activeImage!;
  active = active.substring(active.lastIndexOf("/") + 1, active.indexOf("."));
  window.open("purchase.html?active=" + active, "_self");
}

function handleMouseMove(id: number, e: any) {
  instance[id].mouseX2 = e.clientX - halfWidth;
  //Stop any potentially existing slowDown2 interval
  clearInterval(instance[id].slowDown2);
}

function handleMouseOut(id: number) {
  clearInterval(instance[id].slowDown2);
  //Create an interval that slowly lowers the velocity of the carousel2
  instance[id].slowDown2 = setInterval(
    function (index) {
      //Works with negative mouseX2
      if (instance[id].mouseX2! < 0) {
        instance[id].mouseX2! += slowSpeed;
        //Once its done its job, stop the interval
        if (instance[id].mouseX2! >= 0) {
          instance[index].mouseX2 = 0;
          clearInterval(instance[id].slowDown2);
        }
      }
      //works with positive mouseX2
      else {
        instance[id].mouseX2! -= slowSpeed;
        //Once its done its job, stop the interval
        if (instance[id].mouseX2! <= 0) {
          instance[id].mouseX2 = 0;
          clearInterval(instance[id].slowDown2!);
        }
      }
    },
    20,
    id
  );
}

function handleTouchStart(id: number, e: any) {
  //Stop any potentially existing intervals
  clearInterval(instance[id].touchCheck);
  clearInterval(instance[id].slowDown);
  //Initialize touch variables
  instance[id].touchX = e.targetTouches[0].screenX - halfWidth;
  instance[id].curTouchX = instance[id].touchX;
  //Create interval to check for changes
  instance[id].touchCheck = setInterval(function () {
    const velocity = instance[id].touchX - instance[id].curTouchX;
    instance[id].mouseX = velocity * speedMultiplier;
    if (!locked) {
      if (Math.abs(velocity) * lockSensitivity > 20) {
        locked = true;
        disableScroll();
      }
    }
    instance[id].touchX = instance[id].curTouchX;
  }, 20);
}

function handleTouchStart2(id: number, e: any) {
  //Stop any potentially existing intervals
  clearInterval(instance[id].touchCheck2);
  clearInterval(instance[id].slowDown2);
  //Initialize touch variables
  instance[id].touchX2 = e.targetTouches[0].screenX - halfWidth;
  instance[id].curTouchX2 = instance[id].touchX2;
  //Create interval to check for changes
  instance[id].touchCheck2 = setInterval(function () {
    const velocity = instance[id].touchX2! - instance[id].curTouchX2!;
    instance[id].mouseX2 = velocity * speedMultiplier2;
    if (!locked) {
      if (Math.abs(velocity) * lockSensitivity2 > 20) {
        locked = true;
        disableScroll();
      }
    }
    instance[id].touchX2 = instance[id].curTouchX2;
  }, 20);
}

function handleTouchMove(id: number, e: any) {
  instance[id].curTouchX = e.targetTouches[0].screenX - halfWidth;
}

function handleTouchMove2(id: number, e: any) {
  instance[id].curTouchX2 = e.targetTouches[0].screenX - halfWidth;
}

function handleTouchStop(id: number) {
  enableScroll();
  locked = false;
  //Clears any potentially existing intervals
  clearInterval(instance[id].touchCheck);
  clearInterval(instance[id].slowDown);
  handleMouseLeave(id, true);
}

function handleTouchStop2(id: number) {
  enableScroll();
  locked = false;
  //Clears any potentially existing intervals
  clearInterval(instance[id].touchCheck2);
  clearInterval(instance[id].slowDown2);
  handleMouseOut(id);
}

function handleMouseLeave(id: number, touch = false) {
  //Create an interval that slowly lowers the velocity of the carousel
  instance[id].slowDown = setInterval(
    function (id) {
      //Works with negative mouseX
      if (instance[id].mouseX < 0) {
        if (touch) {
          instance[id].mouseX += slowSpeedTouch;
        } else {
          instance[id].mouseX += slowSpeed;
        }
        //Once its done its job, stop the interval
        if (instance[id].mouseX > 0) {
          instance[id].mouseX = 0;
          clearInterval(instance[id].slowDown);
        }
      }
      //works with positive mouseX
      else {
        if (touch) {
          instance[id].mouseX -= slowSpeedTouch;
        } else {
          instance[id].mouseX -= slowSpeed;
        }
        //Once its done its job, stop the interval
        if (instance[id].mouseX < 0) {
          instance[id].mouseX = 0;
          clearInterval(instance[id].slowDown);
        }
      }
    },
    20,
    id
  );
}

/**
 * Acts as the event handler for the left arrow button, wrapping where necessary
 * @param {Event} event
 */
export function handleLeftArrowClick(id: number) {
  let found = false;
  for (let i = 0; i < instance[id].images.length; i++) {
    //The first image in the array that is greater than or equal to scrPos is found
    if (instance[id].images[i].center! >= instance[id].scrPos) {
      found = true;
      //If the first image is the one found
      if (i == 0) {
        //If the carousel wraps to the left
        if (instance[id].leftWrap) {
          //Set to wrap left until the last picture
          setScrPos(
            id,
            instance[id].images[instance[id].images.length - 1].center!,
            true
          );
        } else {
          //Set to move right until the last picture
          setScrPos(
            id,
            instance[id].images[instance[id].images.length - 1].center!
          );
        }
      }
      //Set the scrPos to the previous image
      else {
        setScrPos(id, instance[id].images[i - 1].center!);
      }
      i = instance[id].images.length;
    }
  }
  //If nothing was found, the scrPos is greater than the last image - move left
  if (!found) {
    setScrPos(id, instance[id].images[instance[id].images.length - 1].center!);
  }
}

export function handleLeftArrowClick2(id: number) {
  let found = false;
  for (let i = 0; i < instance[id].images2!.length; i++) {
    if (instance[id].images2![i].center! >= instance[id].scrPos2!) {
      found = true;
      if (i == 0) {
        if (instance[id].leftWrap2) {
          setScrPos2(
            id,
            instance[id].images2![instance[id].images2!.length - 1].center!,
            true
          );
        } else {
          setScrPos2(
            id,
            instance[id].images2![instance[id].images2!.length - 1].center!
          );
        }
      } else {
        setScrPos2(id, instance[id].images2![i - 1].center!);
      }
      i = instance[id].images2!.length;
    }
  }
  if (!found) {
    if (instance[id].leftWrap2) {
      setScrPos2(
        id,
        instance[id].images2![instance[id].images2!.length - 1].center!,
        true
      );
    } else {
      setScrPos2(
        id,
        instance[id].images2![instance[id].images2!.length - 1].center!
      );
    }
  }
  updateCarousel2(id);
}

/**
 * Acts as the event handler for the right arrow click, wrapping where necessary
 * @param {Event} event
 */
export function handleRightArrowClick(id: number) {
  let found = false;
  for (let i = 0; i < instance[id].images.length; i++) {
    //The first image with a center greater than the scrPos is found
    if (instance[id].images[i].center! > instance[id].scrPos) {
      //Set the scrPos equal to that image
      setScrPos(id, instance[id].images[i].center!);
      found = true;
      i = instance[id].images.length;
    }
  }
  //If nothing is found, the scrPos must be greater than the last image
  if (!found) {
    //If the image carousel wraps right
    if (instance[id].rightWrap) {
      //Wrap the scrPos right until first image
      setScrPos(id, instance[id].images[0].center!, true);
    } else {
      //Move the scrPos left until first image
      setScrPos(id, instance[id].images[0].center!);
    }
  }
}

export function handleRightArrowClick2(id: number) {
  let found = false;
  for (let i = 0; i < instance[id].images2!.length; i++) {
    if (instance[id].images2![i].center! > instance[id].scrPos2!) {
      found = true;
      setScrPos2(id, instance[id].images2![i].center!);
      i = instance[id].images2!.length;
    }
  }
  if (!found) {
    if (instance[id].rightWrap2) {
      setScrPos2(id, instance[id].images2![0].center!, true);
    } else {
      setScrPos2(id, instance[id].images2![0].center!);
    }
  }
  updateCarousel2(id);
}

/**
 * Acts as the event handler for the search feature, finding the most correlated images and bringing them to the forefront
 * @param {Event} e
 */
export function handleSearch(id: number, e: any) {
  //Reset the array based on previous filters - allows backspace to remove actions
  applyFilters(id);
  //Disregards case in the query
  const query = e.target.value.toLowerCase();
  const result = [];
  const matches = [];
  //Goes through each image to determine relevance
  for (let i = 0; i < instance[id].images.length; i++) {
    let match = 0;
    //If the title contains the query, add to relevance
    if (instance[id].images[i].title.toLowerCase().includes(query)) {
      match++;
    }
    //If the description contains the query, add to relevance
    if (instance[id].images[i].desc.toLowerCase().includes(query)) {
      match++;
    }
    //Search for the classic, charOrScene, and wood filters
    if (instance[id].images[i].classic && query.includes("clas")) {
      match++;
    } else if (
      instance[id].images[i].charOrScene &&
      (query.includes("char") || query.includes("scene"))
    ) {
      match++;
    } else if (instance[id].images[i].wood && query.includes("wood")) {
      match++;
    }
    //Search for the event filters
    if (instance[id].images[i].halloween && query.includes("hal")) {
      match++;
    } else if (instance[id].images[i].christmas && query.includes("chri")) {
      match++;
    } else if (instance[id].images[i].pride && query.includes("prid")) {
      match++;
    }
    //For each of the colors the query contains, add to relevance
    for (let j = 0; j < instance[id].images[i].colors.length; j++) {
      if (query.includes(instance[id].images[i].colors[j])) {
        match++;
      }
    }
    //Any irrelevant image is removed entirely
    if (match == 0) {
      remove(instance[id].images, instance[id].images[i]);
      i--;
    }
    //Relevant images are sorted based on the amount of matches
    else {
      let placed = false;
      for (let j = 0; j < result.length; j++) {
        if (match > matches[j]) {
          result.splice(j, 0, instance[id].images[i]);
          matches.splice(j, 0, match);
          j = result.length;
          placed = true;
        }
      }
      //If the loop finished without the element being placed, it is placed at the end of the array
      if (!placed) {
        result.push(instance[id].images[i]);
        matches.push(match);
      }
    }
  }
  //Sets images to equal the result
  instance[id].images = result;
  //Clears the images in the viewport
  clearCarousel(id);
  //Repositions and displays the images
  reinitializeImages(id);
}

function updateGallery(id: number) {
  //Clears the gallery
  deconstructGallery(id);
  //Creates new children for the gallery to display
  for (let i = 0; i < instance[id].images.length; i++) {
    //Creates a wrapper class node to contain the image and title
    const wrapperNode = document.createElement("DIV");
    wrapperNode.classList.add("galWrapper");
    const imgWrapperNode = document.createElement("DIV");
    imgWrapperNode.classList.add("galImgWrapper");
    //Creates an image node to contain the image
    const imgNode = document.createElement("IMG") as ImageElement;
    imgNode.src = instance[id].images[i].fileName;
    imgNode.classList.add("galImg");
    instance[id].images[i].element2 = imgNode;
    const index = id;
    imgNode.addEventListener("click", function (event) {
      handleImageClick(index, event);
    });
    //Create a wrapper node for the title to keep allow position:absolute and text centering
    const titleWrapperNode = document.createElement("DIV");
    titleWrapperNode.classList.add("galTitleWrapper");
    //Creates a title node to contain the title
    const titleNode = document.createElement("P");
    titleNode.innerHTML = instance[id].images[i].title;
    titleNode.classList.add("galTitle");
    //Appends the nodes where necessary
    imgWrapperNode.appendChild(imgNode);
    titleWrapperNode.appendChild(titleNode);
    wrapperNode.appendChild(imgWrapperNode);
    wrapperNode.appendChild(titleWrapperNode);
    instance[id].gallery.appendChild(wrapperNode);
  }
}

function deconstructGallery(id: number) {
  //Removes all children from the gallery
  for (let i = 0; i < instance[id].gallery.children.length; i++) {
    instance[id].gallery.removeChild(instance[id].gallery.children[i]);
    i--;
  }
  //Removes nonexistent elements
  for (let i = 0; i < instance[id].images.length; i++) {
    instance[id].images[i].element2 = undefined;
  }
}

/**
 * DEV TOOLS
 */
function printArray(arr: any[]) {
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Object) {
      str += objectToString(arr[i]) + "\n";
    } else {
      str += arr[i] + "\n";
    }
  }
  console.info(str);
  return str;
}

function objectToString(obj: any, level = 0) {
  let tab = "";
  for (let i = 0; i < level; i++) {
    tab += "\t";
  }
  let str = tab + "{\n";
  const keys = Object.keys(obj);
  for (let j = 0; j < keys.length; j++) {
    if (obj[keys[j]] instanceof Object) {
      str += tab + objectToString(obj[keys[j]], level + 1) + "\n";
    } else {
      str += tab + "\t" + keys[j] + ": " + obj[keys[j]] + "\n";
    }
  }
  return str + tab + "}";
}
function duplicateArray(arr: any[]) {
  return arr.slice();
}

/**
 * Adds any element into any array without creating duplicates
 * @param {Array} arr
 * @param {*}     element
 */
function add(arr: any[], element: any) {
  if (!contains(arr, element)) {
    arr[arr.length] = element;
  }
}

/**
 * Removes all elements from an array equal to the element specified
 * @param {Array} arr
 * @param {*}     element
 */
function remove(arr: any[], element: any) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == element) {
      //Shifts all future elements into the other's spot
      for (let j = i; j < arr.length - 1; j++) {
        arr[j] = arr[j + 1];
      }
      //Resets the length to ensure no undefined elements
      arr.length = arr.length - 1;
    }
  }
}

/**
 * Returns whether or not an element is in an array
 * @param {Array} arr
 * @param {*}     element
 */
function contains(arr: any[], element: any) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == element) {
      return true;
    }
  }
}

/**
 * Goes through a comma delimited string and turns it into an array
 * @param {String} str
 */
function parseArray(str: string) {
  const result = [];
  if (str != "") {
    let index = 0;
    //Removes all of the spaces from the string
    for (let i = 0; i < str.length; i++) {
      if (str[i] == " ") {
        str = str.substring(0, i) + str.substring(i + 1, str.length);
      }
    }
    //Adds all but the last element into the array
    for (let i = 0; i < str.length; i++) {
      if (str[i] == ",") {
        result[result.length] = str.substring(index, i);
        index = ++i;
      }
    }
    //Adds the final element into the array
    result[result.length] = str.substring(index, str.length);
  }
  return result;
}

/**
 * Parses a given string for its boolean value
 * @param {String} str
 * @return The boolean value
 */
function parseBool(str: string) {
  //Makes sure it can efficiently analyze all combinations of lowercase and uppercase letters
  str = str.toLowerCase();
  //Finds any usual boolean indicator and returns true
  if (str == "y" || str == "yes" || str == "true" || str == "t") {
    return true;
  }
  //Otherwise returns false
  return false;
}

/**
 * Parses a given string for its datetime value
 * @param {String} str
 * @return The datetime value
 */
function parseDate(str: string) {
  let strCopy = str;
  let index = strCopy.indexOf("/");
  const month = strCopy.substring(0, index);
  strCopy = strCopy.substring(index + 1);
  index = strCopy.indexOf("/");
  const day = strCopy.substring(0, index);
  strCopy = strCopy.substring(index + 1);
  index = strCopy.indexOf("/");
  const year = strCopy;
  const date = new Date(parseInt(year), parseInt(month), parseInt(day));
  return date.getTime();
}

/**
 * Parses a given string for its size, disregarding any character not a number or 'x'
 * @param {String} str
 */
function parseSize(str: string) {
  //Whitelisted characters
  const desiredCharacters = "1234567890x";
  //Nondestructive editing
  let strCopy = str;
  //Eliminates all characters after the first blacklisted character
  for (let i = 0; i < strCopy.length; i++) {
    if (!desiredCharacters.includes(strCopy[i])) {
      strCopy = strCopy.substring(0, i);
      i = strCopy.length;
    }
  }
  //Returns only the first section of the initial string
  return strCopy;
}

//Outside code for locking and unlocking scroll

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e: any) {
  //Original Code preventing interventions on touch commands
  if (e.cancelable) {
    e.preventDefault();
  } else {
    enableScroll();
  }
}

function preventDefaultForScrollKeys(e: any) {
  if ((keys as any)[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// call this to Disable
function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  (window as any).removeEventListener(wheelEvent, preventDefault, wheelOpt);
  (window as any).removeEventListener("touchmove", preventDefault, wheelOpt);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

function getElementsByClassName(className: string) {
  return document.getElementsByClassName(
    className
  ) as HTMLCollectionOf<HTMLElement>;
}
