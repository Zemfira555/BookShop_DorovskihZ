import "./css/style.css";
import "./css/fonts.css";

import BookFetcher from "./js/gBooksAPI.js";
import Slider from "./js/slider.js";

const apiKey = 'AIzaSyB-vbVev6We9_c4mfA1i70iGPsYlag8Hok';
const bookFetcher = new BookFetcher(apiKey);

const slider = new Slider('.banner__wrapper', '.bullit', 5000);