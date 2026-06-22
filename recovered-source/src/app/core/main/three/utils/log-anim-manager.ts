import { cloneDeep } from "lodash-es";
import { AbstractThreeManager } from "./abstract-three-manager";
import * as THREE from "three";
import { TweenMax, Expo, Cubic } from "gsap";
import gsap from "gsap/all";
const d2r = THREE.MathUtils.degToRad;
export class LogAnimManager extends AbstractThreeManager {
  currentState = 0;

  bgColorTarget;
  check = -1;
  states: any[] = [
    {
      // sunLight: { h: 0.53, s: 0.8, l: 0.8 },
      sunLight: { h: 1, s: 0, l: 0 },
      // skyController: {
      //   azimuth: 0.1913,
      //   inclination: 0.279,
      //   luminance: 1.1192,
      //   mieCoefficient: 0.02,
      //   mieDirectionalG: 0.463,
      //   rayleigh: 4,
      //   sunStrength: 1,
      //   totalRayleighX: 100,
      //   totalRayleighY: 58.1373,
      //   totalRayleighZ: 36.4327,
      //   turbidity: 10.6,
      // },
      lightning: 0,
      dark: 0,
      skyController: { turbidity: 1, rayleigh: 4, mieCoefficient: 0.038, mieDirectionalG: 0.463, luminance: 1.1543, inclination: 0.95, azimuth: 0.7927, totalRayleighX: 100, totalRayleighY: 30.5276, totalRayleighZ: 39.884, stars: 0, sunStrength: 1 },
      // skyController: { turbidity: 1, rayleigh: 0.449, mieCoefficient: 0.039, mieDirectionalG: 0.805, luminance: 0.821, inclination: 0.45270000000000005, azimuth: 0.2614, totalRayleighX: 32.0918, totalRayleighY: 15.596300000000001, totalRayleighZ: 25.1463, stars: 0, sunStrength: 1 },
      // skyController: { stars: 0, azimuth: 0.7927, inclination: 0.95, luminance: 1.154288846259249, mieCoefficient: 0.038, mieDirectionalG: 0.463, rayleigh: 4, sunStrength: 1, totalRayleighX: 100, totalRayleighY: 30.5276, totalRayleighZ: 39.884, turbidity: 1, },
      volumeController: { thunder: 0, bgm: 0, night: 0, wind: 0.7, forest: 0.5, electric: 0, chimes: 0 },
      cameraPos: { x: -513, z: 586 },
      rotationDistort: { x: 0, y: d2r(50), z: 0 },
      floatingHeightDif: 350,
      // ambientLight: { h: 0.53, s: 0.8, l: 0.1 },
      // sunLight: { h: 0.53, s: 0.8, l: 0.8 },
      effectController: { focalLength: 0.1, focus: 0.1, far: 1200, cloudOpacity: 1 },
    },

    // {
    //   cameraPos: { x: 100.6576510019527, z: -808.93422826653045 },
    //   rotationDistort: { x: d2r(-10), y: d2r(-47), z: d2r(0) },
    // },
    // {
    //   cameraPos: { x: 100.6576510019527, z: -808.93422826653045 },
    //   rotationDistort: { x: d2r(-10), y: d2r(90), z: d2r(0) },
    // },

    // section 1
    {
      duration: 1.5,

      // natgeo dark
      //aperture: 2
      // azimuth: 0.7927
      // inclination: 0.95
      // luminance: 1.1543
      // mieCoefficient: 0.07200000000000001
      // mieDirectionalG: 0.41100000000000003
      // rayleigh: 0.23900000000000002
      // sunStrength: 1
      // totalRayleighX: 1
      // totalRayleighY: 1
      // totalRayleighZ: 1
      // turbidity: 20

      //esti kek
      // skyController: {
      //   aperture: 2,
      //   azimuth: 0.8490000000000001,
      //   inclination: 0.5333,
      //   luminance: 0.9964373801041381,
      //   mieCoefficient: 0.049,
      //   mieDirectionalG: 0.998,
      //   rayleigh: 0.9410000000000001,
      //   sunStrength: 1,
      //   totalRayleighX: 1.7054,
      //   totalRayleighY: 5.178100000000001,
      //   totalRayleighZ: 100,
      //   turbidity: 16.1,

      // }

      // narancs keke
      // skyController: {
      //   aperture: 2,
      //   azimuth: 0.8402000000000001,
      //   inclination: 0.621,
      //   luminance: 1.1543,
      //   mieCoefficient: 0.063,
      //   mieDirectionalG: 0.779,
      //   rayleigh: 1.397,
      //   sunStrength: 1,
      //   totalRayleighX: 85.9192,
      //   totalRayleighY: 23.41,
      //   totalRayleighZ: 75.501,
      //   turbidity: 15,
      // },
      // skyController: {
      //   azimuth: 0.7927,
      //   inclination: 0.5684,
      //   luminance: 1.1543,
      //   mieCoefficient: 0.056,
      //   mieDirectionalG: 0.463,
      //   rayleigh: 1.817,
      //   sunStrength: 1,
      //   totalRayleighX: 1,
      //   totalRayleighY: 19.069100000000002,
      //   totalRayleighZ: 98.9419,
      //   turbidity: 14.100000000000001,
      // },

      // effectController: { focalLength: 0.12, focus: 0.3 },

      // skyController: { turbidity: 20, rayleigh: 0.41400000000000003, mieCoefficient: 0.003, mieDirectionalG: 0.8310000000000001, luminance: 0.7334, inclination: 1.5051, azimuth: 0.12990000000000002, totalRayleighX: 46.8509, totalRayleighY: 12.1236, totalRayleighZ: 15.5963, sunStrength: 1 },

      cameraPos: { x: -400.6576510019527, y: 462.2077804194029, z: -750.93422826653045 },
      rotationDistort: { x: d2r(-28), y: d2r(100), z: d2r(10) },
      floatingHeightDif: 700,
      effectController: { focalLength: 0.1, focus: 0.1 },
    },

    // {
    //   // cameraPos: { x: -800.6576510019527, y: 462.2077804194029, z: -750.93422826653045 },
    //   // floatingHeightDif: 170,
    //   // effectController: { focalLength: 0.1775, focus: 0.25 },
    //   // cameraPos: { x: -800, z: -600 },
    //   // rotationDistort: { x: 0, y: d2r(60), z: 0 },
    //   // floatingHeightDif: 250,
    //   // skyController: {
    //   //   azimuth: 0.48350000000000004,
    //   //   inclination: 0.4894,
    //   //   luminance: 1.0897238282393278,
    //   //   mieCoefficient: 0.005,
    //   //   mieDirectionalG: 0.72,
    //   //   rayleigh: 0.005,
    //   //   sunStrength: 1,
    //   //   totalRayleighX: 53.205200000000005,
    //   //   totalRayleighY: 18.482100000000003,
    //   //   totalRayleighZ: 11.537500000000001,
    //   //   turbidity: 6.2,
    //   // },
    // },
    {
      volumeController: { thunder: 0, bgm: 0, night: 0, wind: 0.4, forest: 0.7, electric: 0, chimes: 0 },
      duration: 1,
      cameraPos: { x: -600, y: 462, z: -751 },
      rotationDistort: { x: d2r(-5), y: d2r(110), z: d2r(0) },
      floatingHeightDif: 320,
      effectController: { focalLength: 1, focus: 0.15 },
    },
    {
      volumeController: { thunder: 0, bgm: 0, night: 0, wind: 0.4, forest: 0.7, electric: 0, chimes: 0.3 },
      duration: 7,
      cameraPos: { x: -800, y: 462, z: -700 },
      rotationDistort: { x: d2r(-5), y: d2r(110), z: d2r(0) },
      floatingHeightDif: 170,
      effectController: { focalLength: 0.17, focus: 0.15, far: 1200 },
    },
    // {
    //   duration: 1,
    //   cameraPos: { x: -800, y: 462, z: -700 },
    //   rotationDistort: { x: d2r(-5), y: d2r(110), z: d2r(0) },
    //   floatingHeightDif: 170,
    //   effectController: { focalLength: 0.17, focus: 0.15 },
    // },
    //cat
    // {
    //   duration: 0.5,
    //   cameraPos: { x: -800.6576510019527, y: 462.2077804194029, z: -700 },
    //   rotationDistort: { x: d2r(-5), y: d2r(110), z: d2r(0) },
    //   floatingHeightDif: 150,
    //   effectController: { focalLength: 0.12, focus: 0.171 },
    // },

    {
      duration: 0.5,
      cameraPos: { x: -850, y: 462, z: -650 },
      rotationDistort: { x: d2r(-21.5), y: d2r(84), z: d2r(0) },
      floatingHeightDif: 210,
      effectController: { focalLength: 0.1, focus: 0.1 },
      //kek barack
      // skyController: {
      //   azimuth: 0.7927,
      //   inclination: 0.5684,
      //   luminance: 1.1543,
      //   mieCoefficient: 0.056,
      //   mieDirectionalG: 0.463,
      //   rayleigh: 1.817,
      //   sunStrength: 1,
      //   totalRayleighX: 1,
      //   totalRayleighY: 19.069100000000002,
      //   totalRayleighZ: 98.9419,
      //   turbidity: 14.100000000000001,
      // },
      // skyController: {
      //   azimuth: 0.7927,
      //   inclination: 0.5684,
      //   luminance: 1.1543,
      //   mieCoefficient: 0.056,
      //   mieDirectionalG: 0.463,
      //   rayleigh: 1.817,
      //   sunStrength: 1,
      //   totalRayleighX: 1,
      //   totalRayleighY: 19.069100000000002,
      //   totalRayleighZ: 98.9419,
      //   turbidity: 14.100000000000001,
      // },
    },
    // CAT
    {
      lightning: 0,

      // skyController: { turbidity: 20, rayleigh: 0.41400000000000003, mieCoefficient: 0.003, mieDirectionalG: 0.8310000000000001, luminance: 0.7334, inclination: 1.5051, azimuth: 0.12990000000000002, totalRayleighX: 46.8509, totalRayleighY: 12.1236, totalRayleighZ: 15.5963, sunStrength: 1 },
      volumeController: { thunder: 0, bgm: 0, night: 0, wind: 0.4, forest: 0.7, electric: 0, chimes: 0.3 },
      duration: 4.7,
      // cameraPos: { x: -850, y: 462, z: -650 },

      // rotationDistort: { x: d2r(-13), y: d2r(85), z: d2r(0) },
      // floatingHeightDif: 120,

      cameraPos: { x: -850, y: 462, z: -650 },
      floatingHeightDif: 220,
      rotationDistort: { x: d2r(-26), y: d2r(84), z: d2r(0) },

      effectController: { focalLength: 0.1, focus: 0.1, far: 1200, fogDensity: 0.002 },
      // skyController: {
      //   azimuth: 0.7927,
      //   inclination: 0.95,
      //   luminance: 1.154288846259249,
      //   mieCoefficient: 0.038,
      //   mieDirectionalG: 0.463,
      //   rayleigh: 4,
      //   sunStrength: 1,
      //   totalRayleighX: 100,
      //   totalRayleighY: 30.5276,
      //   totalRayleighZ: 39.884,
      //   turbidity: 1,
      // },
    },
    // After CAT
    // {
    //   // scrollEase: Cubic.easeInOut,
    //   duration: 2,
    //   cameraPos: { x: -1850, y: 462, z: -650 },
    //   rotationDistort: { x: d2r(-5), y: d2r(110), z: d2r(0) },
    //   floatingHeightDif: 320,
    //   // effectController: { focalLength: 0.8, focus: 1, far: 1200, fogDensity: 0.002 },
    //   effectController: { focalLength: 0.8, focus: 0.4, far: 1200, fogDensity: 0.002 },
    // },
    // {
    //   duration: 8,
    //   cameraPos: { x: -4500, y: 462, z: 1950 },
    //   rotationDistort: { x: d2r(-40), y: d2r(140), z: d2r(10) },
    //   floatingHeightDif: 1500,
    //   effectController: { focalLength: 0.3, focus: 0.6, far: 3000, fogDensity: 0.001 },

    //   skyController: {
    //     azimuth: 0.7964,
    //     inclination: 0.5508000000000001,
    //     luminance: 1.0665935872841874,
    //     mieCoefficient: 0.055,
    //     mieDirectionalG: 0.463,
    //     rayleigh: 1.6420000000000001,
    //     sunStrength: 1,
    //     totalRayleighX: 1,
    //     totalRayleighY: 30.355400000000003,
    //     totalRayleighZ: 39.9055,
    //     turbidity: 10,
    //   },
    // },

    //torony
    {
      volumeController: { thunder: 0, bgm: 0, night: 0, wind: 0.6, forest: 0.4, electric: 0, chimes: 0 },
      // scrollEase: Cubic.easeInOut,
      duration: 7,
      cameraPos: { x: -1450, y: 462, z: -650 },
      rotationDistort: { x: d2r(0), y: d2r(-5), z: d2r(0) },
      floatingHeightDif: 320,
      effectController: { focalLength: 0.3, focus: 0.6, far: 2000, fogDensity: 0.001 },
      // skyController: {
      //   azimuth: 0.7964,
      //   inclination: 0.5508000000000001,
      //   luminance: 1.0665935872841874,
      //   mieCoefficient: 0.055,
      //   mieDirectionalG: 0.463,
      //   rayleigh: 1.6420000000000001,
      //   sunStrength: 1,
      //   totalRayleighX: 1,
      //   totalRayleighY: 30.355400000000003,
      //   totalRayleighZ: 39.9055,
      //   turbidity: 10,
      // },
      skyController: {
        azimuth: 0.7927,
        inclination: 0.95,
        luminance: 1.154288846259249,
        mieCoefficient: 0.038,
        mieDirectionalG: 0.463,
        rayleigh: 4,
        sunStrength: 1,
        totalRayleighX: 100,
        totalRayleighY: 30.5276,
        totalRayleighZ: 39.884,
        turbidity: 1,
      },
    },
    // torony fel
    {
      lightning: 0,
      volumeController: { thunder: 0, bgm: 0, night: 0, wind: 0.6, forest: 0.4, electric: 0.4, chimes: 0 },
      // scrollEase: Cubic.easeInOut,
      duration: 5.9,
      cameraPos: { x: -1523, y: 462, z: -1226 },
      rotationDistort: { x: d2r(60), y: d2r(-28), z: d2r(0) },
      floatingHeightDif: 200,
      effectController: { focalLength: 0.5, focus: 0.5, far: 1200, fogDensity: 0.001 },
      skyController: {
        stars: 0,
        azimuth: 0.7927,
        inclination: 0.95,
        luminance: 1.154288846259249,
        mieCoefficient: 0.038,
        mieDirectionalG: 0.463,
        rayleigh: 4,
        sunStrength: 1,
        totalRayleighX: 100,
        totalRayleighY: 30.5276,
        totalRayleighZ: 39.884,
        turbidity: 1,
      },
      dark: 0,
    },

    //DARK
    {
      dark: 1,
      // volumeController: { electric: 0 },
      sunLight: { h: 1, s: 0, l: 0 },

      lightning: 1,
      duration: 0.01,
      effectEase: Expo.easeInOut,
      // effectController: { glitch: 0.0, wind: 0.05 },
      skyEase: Expo.easeInOut,
      rotationDistort: { x: d2r(40), y: d2r(-30), z: d2r(0) },
      floatingHeightDif: 100,
      skyController: { stars: 1, turbidity: 20, rayleigh: 4, mieCoefficient: 0.1, mieDirectionalG: 1, luminance: 1.154288846259249, inclination: 1.47, azimuth: 0.8490000000000001, totalRayleighX: 100, totalRayleighY: 20.805400000000002, totalRayleighZ: 38.1691, sunStrength: 1 },
      // skyController: {
      //   azimuth: 0,
      //   inclination: 1,
      //   luminance: 0.13702384214853386,
      //   mieCoefficient: 0.008,
      //   mieDirectionalG: 1,
      //   rayleigh: 0,
      //   sunStrength: 1,
      //   totalRayleighX: 1,
      //   totalRayleighY: 85.051,
      //   totalRayleighZ: 52.9282,
      //   turbidity: 1,
      // },
      cameraPos: { x: 400, y: 462, z: -2700 },
      effectController: { focalLength: 0.03, focus: 1, far: 1200, fogDensity: 0.002, cloudOpacity: 0.7 },
      volumeController: { thunder: 0, bgm: 0, night: 0, wind: 0.6, forest: 0.4, electric: 0.4, chimes: 0 },
    },

    {
      duration: 3,

      volumeController: { thunder: 1, bgm: 0, night: 0.0, wind: 0.8, forest: 0, electric: 0, chimes: 0 },
    },
    // {
    //   // delay: 9,
    //   // rotationDistort: { x: d2r(-40), y: d2r(-30), z: d2r(10) },

    //   // cameraPos: { x: 1683, y: 662, z: 0 },

    //   // cameraPos: {
    //   //   x: 2283,
    //   //   z: 0,
    //   // },

    //   duration: 9,
    //   effectEase: Expo.easeInOut,
    //   // effectController: { focalLength: 0.03, focus: 1, far: 1200, fogDensity: 0.002, cloudOpacity: 0.2 },
    // },
    //dev
    {
      // volumeController: { bgm: 0.05 },

      // delay: 9,
      // cameraPos: { x: 1683, y: 662, z: 0 },
      floatingHeightDif: 150,
      // cameraPos: { x: 600, y: 462, z: -2900 },
      duration: 8,
      effectEase: Expo.easeInOut,
      // effectController: { focalLength: 0.03, focus: 1, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },
      // skyController: {
      //   azimuth: 0.7927,
      //   inclination: 0.95,
      //   luminance: 1.154288846259249,
      //   mieCoefficient: 0.038,
      //   mieDirectionalG: 0.463,
      //   rayleigh: 4,
      //   sunStrength: 1,
      //   totalRayleighX: 100,
      //   totalRayleighY: 30.5276,
      //   totalRayleighZ: 39.884,
      //   turbidity: 1,
      // },
      volumeController: { thunder: 1, bgm: 0, night: 0.0, wind: 0.8, forest: 0, electric: 0, chimes: 0 },
    },
    //before sunup
    {
      dark: 1,
      lightning: 1,

      rotationDistort: { x: d2r(-20), y: d2r(-30), z: d2r(0) },
      floatingHeightDif: 200,
      skyController: { stars: 1, turbidity: 20, rayleigh: 4, mieCoefficient: 0.1, mieDirectionalG: 1, luminance: 1.154288846259249, inclination: 1.47, azimuth: 0.8490000000000001, totalRayleighX: 100, totalRayleighY: 20.805400000000002, totalRayleighZ: 38.1691, sunStrength: 1 },
      // skyController: {
      //   azimuth: 0.9,
      //   inclination: 0.78,
      //   luminance: 1.17,
      //   mieCoefficient: 0.038,
      //   mieDirectionalG: 0.463,
      //   rayleigh: 4,
      //   sunStrength: 1,
      //   totalRayleighX: 100,
      //   totalRayleighY: 30.5276,
      //   totalRayleighZ: 39.884,
      //   turbidity: 1,
      // },
      // cameraPos: { x: 481, y: 462, z: -1254 },

      duration: 17,
      effectEase: Expo.easeInOut,
      effectController: { focalLength: 0.03, focus: 1, far: 1200, fogDensity: 0.002, cloudOpacity: 0.7 },
      volumeController: { thunder: 1, bgm: 0, night: 0.0, wind: 0.8, forest: 0, electric: 0, chimes: 0 },
    },
    // {
    //   duration: 5,
    //   // skyController: { stars: 0.4 },
    //   effectController: { focalLength: 0.03, focus: 1, far: 1200, fogDensity: 0.002, cloudOpacity: 0.7 },
    // },

    {
      sunLight: { h: 1, s: 0, l: 0 },

      lightning: 0,
      skyController: { stars: 0, turbidity: 18.7599, rayleigh: 1.2974, mieCoefficient: 0.0954, mieDirectionalG: 0.8893, luminance: 1.0606, inclination: 1.4732, azimuth: 0.8182, totalRayleighX: 99.0007, totalRayleighY: 20.9661, totalRayleighZ: 38.8118, sunStrength: 1 },
      duration: 13,
      cameraPos: { x: 850, y: 462, z: -4703 },
      rotationDistort: { x: d2r(30), y: d2r(-20), z: d2r(0) },
      // skyController: {
      //   azimuth: 0.6736000000000001,
      //   inclination: 1.4174,
      //   luminance: 1.1367497944642369,
      //   mieCoefficient: 0.025,
      //   mieDirectionalG: 0.937,
      //   rayleigh: 1.256,
      //   sunStrength: 1,
      //   totalRayleighX: 64.2146,
      //   totalRayleighY: 14.728100000000001,
      //   totalRayleighZ: 43.3782,
      //   turbidity: 6,
      // },
      effectEase: Expo.easeIn,

      effectController: { focalLength: 0.03, focus: 1, far: 1200, fogDensity: 0.002, cloudOpacity: 0.7 },
      volumeController: { thunder: 0.5, bgm: 0.15, night: 0, wind: 0.7, forest: 0.5, electric: 0, chimes: 0 },
    },
    {
      sunLight: { h: 0.07, s: 0.6, l: 0.4 },

      volumeController: { thunder: 0, bgm: 0.3, night: 0, wind: 0.7, forest: 0.5, electric: 0, chimes: 0 },
      dark: 0,

      effectController: { focalLength: 0.3, focus: 0.3, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },
      duration: 18,
      cameraPos: { x: 1700, y: 462, z: -7000 },
      floatingHeightDif: 250,
      rotationDistort: { x: d2r(-5), y: d2r(-20), z: d2r(0) },
      // skyController: { turbidity: 13.3, rayleigh: 0.204, mieCoefficient: 0.075, mieDirectionalG: 0.402, luminance: 0.6481, inclination: 1.4875, azimuth: 0.6824, totalRayleighX: 94.601, totalRayleighY: 21.6736, totalRayleighZ: 41.6418, stars: 0, sunStrength: 1 }, // skyController: {
      // skyController: { turbidity: 9.5, rayleigh: 0.41400000000000003, mieCoefficient: 0.01, mieDirectionalG: 0.75, luminance: 0.4878048780487805, inclination: 1.4875, azimuth: 0.7525000000000001, totalRayleighX: 92.86460000000001, totalRayleighY: 21.6736, totalRayleighZ: 59.005500000000005, stars: 0, sunStrength: 1 },
      skyController: { turbidity: 20, rayleigh: 0.41400000000000003, mieCoefficient: 0.01, mieDirectionalG: 0.75, luminance: 0.4878, inclination: 1.4875, azimuth: 0.7525, totalRayleighX: 92.8646, totalRayleighY: 21.6736, totalRayleighZ: 59.0055, stars: 0, sunStrength: 1 },

      //   azimuth: 0.6736,
      //   inclination: 1.3472000000000002,
      //   luminance: 0.6105782406138668,
      //   mieCoefficient: 0.1,
      //   mieDirectionalG: 0.84,
      //   rayleigh: 4,
      //   sunStrength: 1,
      //   totalRayleighX: 45.9827,
      //   totalRayleighY: 19.9372,
      //   totalRayleighZ: 74.6328,
      //   turbidity: 4.1000000000000005,
      // },
    },
  ];

  stateOverrides = [
    {
      sunLight: { h: 0.1, s: 0.43, l: 0.2 },

      // "skyController":{"turbidity":12.600000000000001,"rayleigh":0.274,"mieCoefficient":0.01,"mieDirectionalG":0.6910000000000001,"luminance":1.154288846259249,"inclination":1.4525000000000001,"azimuth":0.7927,"totalRayleighX":100,"totalRayleighY":15.596300000000001,"totalRayleighZ":19.9372,"stars":0,"sunStrength":1},
      floatingHeightDif: 250,
      volumeController: { thunder: 0, bgm: 0.3, night: 0, wind: 0.7, forest: 0.3, electric: 0, chimes: 0 },
      dark: 0,
      lightning: 0,
      skyController: { stars: 0, azimuth: 0.7927, inclination: 0.95, luminance: 1.154288846259249, mieCoefficient: 0.038, mieDirectionalG: 0.463, rayleigh: 4, sunStrength: 1, totalRayleighX: 100, totalRayleighY: 30.5276, totalRayleighZ: 39.884, turbidity: 1 },
      rotationDistort: { x: d2r(-10), y: d2r(-80), z: d2r(0) },
      effectController: { focalLength: 0.2, focus: 0.2, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },
      // cameraPos: { x: 1700, y: 462, z: -7000 },
    },
    {
      sunLight: { h: 0.1, s: 0.43, l: 0.2 },

      floatingHeightDif: 200,
      volumeController: { thunder: 0, bgm: 0.3, night: 0, wind: 0.5, forest: 0.3, electric: 0, chimes: 0 },
      dark: 1,
      lightning: 0,
      skyController: { stars: 0, turbidity: 14.8, rayleigh: 0.064, mieCoefficient: 0.043, mieDirectionalG: 0.665, luminance: 1.1192107426692244, inclination: 1.2244000000000002, azimuth: 0.5158, totalRayleighX: 48.5873, totalRayleighY: 19.9372, totalRayleighZ: 54.6646, sunStrength: 1 },
      rotationDistort: { x: d2r(-5), y: d2r(-80), z: d2r(0) },
      effectController: { focalLength: 0.2, focus: 0.2, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },

      // floatingHeightDif: 180,
    },
    {
      sunLight: { h: 0.01, s: 0.8, l: 0.6 },
      // "skyController":{"turbidity":4.800000000000001,"rayleigh":0.379,"mieCoefficient":0.027,"mieDirectionalG":0.963,"luminance":0.8912030693340641,"inclination":0.9789,"azimuth":0.5158,"totalRayleighX":32.96,"totalRayleighY":14.728100000000001,"totalRayleighZ":85.9192,"stars":0,"sunStrength":1},
      floatingHeightDif: 200,
      // cameraPos: { x: 0, y: 462, z: 0 },
      volumeController: { thunder: 0, bgm: 0.3, night: 0.5, wind: 0.2, forest: 0, electric: 0, chimes: 0 },
      dark: 1,
      lightning: 0,
      // skyController: { stars: 0, turbidity: 13.8, rayleigh: 0.309, mieCoefficient: 0.011, mieDirectionalG: 0.9450000000000001, luminance: 0.3299534118936695, inclination: 0.45270000000000005, azimuth: 0.49820000000000003, totalRayleighX: 40.7736, totalRayleighY: 10.3872, totalRayleighZ: 19.069100000000002, sunStrength: 1 },
      skyController: { turbidity: 13.8, rayleigh: 0.309, mieCoefficient: 0.002, mieDirectionalG: 0.84, luminance: 0.8385859139490272, inclination: 0.4176, azimuth: 0.4982, totalRayleighX: 40.7736, totalRayleighY: 10.3872, totalRayleighZ: 19.0691, stars: 0, sunStrength: 1 },
      rotationDistort: { x: d2r(-5), y: d2r(-80), z: d2r(0) },
      effectController: { focalLength: 0.2, focus: 0.2, far: 1200, fogDensity: 0.002, cloudOpacity: 0.5 },
    },
    {
      sunLight: { h: 0.1, s: 0.43, l: 0 },

      //starry
      floatingHeightDif: 150,
      lightning: 0,
      volumeController: { thunder: 0, bgm: 0.3, night: 0.7, wind: 0, forest: 0, electric: 0, chimes: 0 },
      dark: 1,
      // skyController: { turbidity: 20, rayleigh: 1.958, mieCoefficient: 0.1, mieDirectionalG: 0.375, luminance: 1.1192107426692244, inclination: 0.5053, azimuth: 0.6999000000000001, totalRayleighX: 1, totalRayleighY: 1, totalRayleighZ: 1, stars: 1, sunStrength: 1 },
      skyController: { turbidity: 15, rayleigh: 1.081, mieCoefficient: 0.1, mieDirectionalG: 0.612, luminance: 1.1192, inclination: 0.5053, azimuth: 0.6999, totalRayleighX: 13.860000000000001, totalRayleighY: 1.7054, totalRayleighZ: 1, stars: 1, sunStrength: 1 },

      rotationDistort: { x: d2r(10), y: d2r(-150), z: d2r(0) },
      effectController: { focalLength: 0.3, focus: 1, far: 1200, fogDensity: 0.002, cloudOpacity: 0.5 },
    },
    {
      sunLight: { h: 0.1, s: 0.43, l: 0 },

      // rainy day
      floatingHeightDif: 200,
      lightning: 1,
      volumeController: { thunder: 0.7, bgm: 0.3, night: 0, wind: 0.3, forest: 0, electric: 0, chimes: 0 },
      dark: 0,
      skyController: { stars: 0, azimuth: 0.7927, inclination: 0.95, luminance: 1.154288846259249, mieCoefficient: 0.038, mieDirectionalG: 0.463, rayleigh: 4, sunStrength: 1, totalRayleighX: 100, totalRayleighY: 30.5276, totalRayleighZ: 39.884, turbidity: 1 },
      rotationDistort: { x: d2r(-5), y: d2r(-80), z: d2r(0) },
      effectController: { focalLength: 0.2, focus: 0.2, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },
    },
    {
      sunLight: { h: 0.02, s: 0.8, l: 0.4 },

      // velvet
      floatingHeightDif: 200,
      volumeController: { thunder: 0, bgm: 0.3, night: 0, wind: 0.5, forest: 0.3, electric: 0, chimes: 0 },
      dark: 1,
      lightning: 0,
      skyController: { turbidity: 1, rayleigh: 0.274, mieCoefficient: 0.039, mieDirectionalG: 0.805, luminance: 0.821, inclination: 0.6106, azimuth: 0.5158, totalRayleighX: 54.6646, totalRayleighY: 18.2009, totalRayleighZ: 20.8054, stars: 0, sunStrength: 1 },
      // skyController: { stars: 0, turbidity: 1, rayleigh: 0.274, mieCoefficient: 0.049, mieDirectionalG: 0.665, luminance: 0.8210468621540148, inclination: 0.6106, azimuth: 0.5158, totalRayleighX: 54.6646, totalRayleighY: 18.2009, totalRayleighZ: 20.805400000000002, sunStrength: 1 },
      rotationDistort: { x: d2r(-5), y: d2r(-90), z: d2r(0) },
      effectController: { focalLength: 0.2, focus: 0.2, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },
    },
    {
      sunLight: { h: 0, s: 0.43, l: 0.2 },
      // cotton candy
      floatingHeightDif: 250,
      volumeController: { thunder: 0, bgm: 0.3, night: 0, wind: 0.5, forest: 0.3, electric: 0, chimes: 0 },
      lightning: 0,
      dark: 1,
      skyController: { stars: 1, turbidity: 20, rayleigh: 0.485, mieCoefficient: 0.003, mieDirectionalG: 0.682, luminance: 0.7333516031789531, inclination: 1.3297, azimuth: 0.5245, totalRayleighX: 2.5736000000000003, totalRayleighY: 12.1236, totalRayleighZ: 15.596300000000001, sunStrength: 1 },
      rotationDistort: { x: d2r(-5), y: d2r(-90), z: d2r(0) },
      effectController: { focalLength: 1, focus: 0.8, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },
    },
    {
      sunLight: { h: 0.58, s: 0.43, l: 0.2 },
      // cold
      floatingHeightDif: 250,
      lightning: 0,
      volumeController: { thunder: 0, bgm: 0.3, night: 0, wind: 1, forest: 0, electric: 0, chimes: 0 },
      dark: 1,
      skyController: { stars: 1, turbidity: 17.6, rayleigh: 1.256, mieCoefficient: 0.029, mieDirectionalG: 0.77, luminance: 1.1192107426692244, inclination: 0.5229, azimuth: 0.6385000000000001, totalRayleighX: 87.6555, totalRayleighY: 4.3099, totalRayleighZ: 1, sunStrength: 1 },
      rotationDistort: { x: d2r(5), y: d2r(-130), z: d2r(0) },
      effectController: { focalLength: 1, focus: 0.85, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },
    },
    {
      sunLight: { h: 0.1, s: 0.43, l: 0.1 },
      floatingHeightDif: 250,
      lightning: 0,
      volumeController: { thunder: 0, bgm: 0.3, night: 0, wind: 0.3, forest: 0.5, electric: 0, chimes: 0 },
      dark: 0,
      skyController: { stars: 0, turbidity: 1, rayleigh: 0.099, mieCoefficient: 0.1, mieDirectionalG: 0.779, luminance: 1.0490545354891752, inclination: 0.8035, azimuth: 0.6035, totalRayleighX: 66.8191, totalRayleighY: 19.9372, totalRayleighZ: 81.57820000000001, sunStrength: 1 },
      rotationDistort: { x: d2r(10), y: d2r(-90), z: d2r(0) },
      effectController: { focalLength: 1, focus: 0.3, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },
    },
    {
      sunLight: { h: 0.1, s: 0.43, l: 0.1 },
      floatingHeightDif: 250,
      lightning: 0,
      volumeController: { thunder: 0, bgm: 0.3, night: 0, wind: 0.3, forest: 0.5, electric: 0, chimes: 0 },
      dark: 0,
      skyController: { turbidity: 4.800000000000001, rayleigh: 0.379, mieCoefficient: 0.027, mieDirectionalG: 0.963, luminance: 0.8912030693340641, inclination: 0.9789, azimuth: 0.5158, totalRayleighX: 32.96, totalRayleighY: 14.728100000000001, totalRayleighZ: 85.9192, stars: 0, sunStrength: 1 },
      rotationDistort: { x: d2r(10), y: d2r(-90), z: d2r(0) },
      effectController: { focalLength: 1, focus: 0.3, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },
    },
    {
      sunLight: { h: 0.58, s: 0.43, l: 0 },
      floatingHeightDif: 250,
      lightning: 1,
      volumeController: { thunder: 0.5, bgm: 0.3, night: 0, wind: 1.5, forest: 0, electric: 0, chimes: 0 },
      dark: 1,
      // skyController: { turbidity: 20, rayleigh: 3.894, mieCoefficient: 0.014, mieDirectionalG: 0.965, luminance: 1.1780447842708903, inclination: 1.3703, azimuth: 0.8665, totalRayleighX: 91.322, totalRayleighY: 20.3837, totalRayleighZ: 54.987700000000004, stars: 1, sunStrength: 1 },
      skyController: { turbidity: 15.600000000000001, rayleigh: 0.34400000000000003, mieCoefficient: 0.085, mieDirectionalG: 0.981, luminance: 1.17, inclination: 1.0315, azimuth: 0.8665, totalRayleighX: 71.16, totalRayleighY: 17.3327, totalRayleighZ: 45.9827, stars: 1, sunStrength: 1 },

      rotationDistort: { x: d2r(0), y: d2r(30), z: d2r(0) },
      effectController: { focalLength: 0.1, focus: 0.35, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },
    },
    {
      sunLight: { h: 0.1, s: 0.43, l: 0.1 },
      floatingHeightDif: 250,
      lightning: 0,
      volumeController: { thunder: 0, bgm: 0.3, night: 0, wind: 0.5, forest: 0.3, electric: 0, chimes: 0 },
      dark: 0,
      skyController: { turbidity: 4.3, rayleigh: 1.782, mieCoefficient: 0.027, mieDirectionalG: 0.8310000000000001, luminance: 0.8912, inclination: 0.9789, azimuth: 0.5158, totalRayleighX: 42.510000000000005, totalRayleighY: 14.7281, totalRayleighZ: 78.97370000000001, stars: 0, sunStrength: 1 },
      rotationDistort: { x: d2r(10), y: d2r(-90), z: d2r(0) },
      effectController: { focalLength: 1, focus: 0.3, far: 1200, fogDensity: 0.002, cloudOpacity: 1 },
    },
  ];

  // currentSound: BehaviorSubject<number> = new BehaviorSubject(0);

  create() {
    this.setState(0, true, 0);
  }

  nextState() {
    this.currentState++;
    if (this.currentState > this.states.length - 1) {
      this.currentState = 0;
    }
    this.setState(this.currentState);
  }

  setState(id: number, shouldFire: boolean = true, overrideDur = -1, overrideState = null) {
    const hasOd = overrideDur >= 0 ? true : false;
    const goals: any = {};

    if (shouldFire && !overrideState) {
      this.currentState = id;
    }

    let state = this.states[id];
    if (!overrideState) {
      state = this.states[id];
    } else {
      state = overrideState;
    }

    // if (state.sound !== undefined) {
    //   this.currentSound.next(state.sound);
    // } else {
    //   this.currentSound.next(-1);
    // }

    if (state.skyController) {
      const goal = cloneDeep(state.skyController);
      goal.onUpdate = this.triggerSkyChange.bind(this);
      goal.ease = Expo.easeInOut;
      goals.skyController = { target: this.ts.skyController, goal: goal };
      if (shouldFire) {
        TweenMax.to(this.ts.skyController, hasOd ? overrideDur : 1, goal);
      }
    }
    if (state.dark !== undefined) {
      const goal = {
        dark: state.dark,
        onUpdate: () => {
          this.ts.darkChange.next(this.ts.dark);
        },
      };
      if (shouldFire) {
        TweenMax.to(this.ts, hasOd ? overrideDur : 1, goal);
      }
      goals.dark = {
        target: this.ts,
        goal: goal,
      };
    }
    if (state.lightning !== undefined) {
      const goal = {
        lightning: state.lightning,
        onUpdate: () => {
          this.ts.lightningChange.next(this.ts.lightning);
        },
      };
      if (shouldFire) {
        TweenMax.to(this.ts, hasOd ? overrideDur : 1, goal);
      }
      goals.lightning = {
        target: this.ts,
        goal: goal,
      };
    }
    if (state.volumeController) {
      const goal = cloneDeep(state.volumeController);
      goal.onUpdate = () => {
        this.ts.volumeChange.next();
      };
      //  this.triggerEffectChange.bind(this);
      // goal.ease = Expo.easeInOut;
      goals.volumeController = { target: this.ts.volumeController, goal: goal };
      if (shouldFire) {
        TweenMax.to(this.ts.volumeController, hasOd ? overrideDur : 1, goal);
      }
    }
    if (state.effectController) {
      const goal = cloneDeep(state.effectController);
      goal.onUpdate = this.triggerEffectChange.bind(this);
      goal.ease = Expo.easeInOut;
      goals.effectController = { target: this.ts.effectController, goal: goal };
      if (shouldFire) {
        TweenMax.to(this.ts.effectController, hasOd ? overrideDur : 1, goal);
      }
    }
    if (state.cameraController) {
      const goal = cloneDeep(state.cameraController);
      goal.onUpdate = this.triggerCameraChange.bind(this);
      goal.ease = Expo.easeInOut;
      goals.cameraController = { target: this.ts.cameraController, goal: goal };
      if (shouldFire) {
        TweenMax.to(this.ts.cameraController, hasOd ? overrideDur : 1, goal);
      }
    }
    if (state.cameraPos) {
      const goal = cloneDeep(state.cameraPos);
      goal.onUpdate = this.triggerCamposChange.bind(this);
      goal.onComplete = this.triggerCamposComplete.bind(this);
      goal.ease = Cubic.easeInOut;
      goals.cameraPos = { target: this.ts.controlObj.position, goal: goal };
      if (shouldFire) {
        TweenMax.to(this.ts.controlObj.position, hasOd ? overrideDur : 1, goal);
      }
    }

    if (state.cameraRot) {
      const goal = cloneDeep(state.cameraRot);
      goal.ease = Cubic.easeInOut;
      const targetOrientation = new THREE.Quaternion().setFromEuler(new THREE.Euler((state.cameraRot.x / 180) * Math.PI, (state.cameraRot.y / 180) * Math.PI, (state.cameraRot.z / 180) * Math.PI)).normalize();

      goals.cameraRot = { target: this.ts.controlObj.quaternion, goal: { x: targetOrientation.x, y: targetOrientation.y, z: targetOrientation.z, w: targetOrientation.w } };

      if (shouldFire) {
        TweenMax.to(this.ts.controlObj.quaternion, hasOd ? overrideDur : 1, goal);
      }
    }

    if (state.rotationDistort) {
      const goal = cloneDeep(state.rotationDistort);
      if (shouldFire) {
        TweenMax.to(this.ts.rotationDistort, hasOd ? overrideDur : 1, goal);
      }
      goals.rotationDistort = { target: this.ts.rotationDistort, goal: goal };
    }

    if (state.floatingHeightDif !== undefined) {
      const goal = { floatingHeightDif: state.floatingHeightDif };
      if (shouldFire) {
        TweenMax.to(this.ts, hasOd ? overrideDur : 1, goal);
      }
      goals.floatingHeightDif = { target: this.ts, goal: goal };
    }

    if (state.ambientLight) {
      const startColor = { h: 0, s: 0, l: 0 };
      this.ts.pass.light.color.getHSL(startColor);
      const func = function (e: LogAnimManager, target) {
        e.ts.pass.light.color.setHSL(target.h, target.s, target.l);
      };
      const goal = cloneDeep(state.ambientLight);
      goal.onUpdate = func;
      goal.ease = Cubic.easeInOut;

      goal.onUpdateParams = [this, startColor];
      if (shouldFire) {
        TweenMax.to(startColor, hasOd ? overrideDur : 1, goal);
      }
      goals.ambientLight = { target: startColor, goal: goal };
    }

    if (state.sunLight) {
      const startColor = { h: 0, s: 0, l: 0 };
      this.ts.lensflare.light.color.getHSL(startColor);
      const func = function (e: LogAnimManager, target) {
        e.ts.lensflare.light.color.setHSL(target.h, target.s, target.l);
        // console.log(e.ts.lensflare.light.color.getHexString());
      };
      const goal = cloneDeep(state.sunLight);
      goal.onUpdate = func;
      goal.ease = Cubic.easeInOut;
      goal.onUpdateParams = [this, startColor];
      if (shouldFire) {
        TweenMax.to(startColor, hasOd ? overrideDur : 1, goal);
      }
      goals.sunLight = { target: startColor, goal: goal };
    }

    if (state.bgColor) {
      goals.bgColor = { target: this.bgColorTarget, goal: { fill: state.bgColor } };
    }
    // goals.check = { target: this, goal: { check: id } };
    return goals;
  }

  triggerEffectChange() {
    this.ts.onEffectsUpdate.next();
  }
  triggerSkyChange() {
    this.ts.onSkyUpdate.next();
  }
  triggerCameraChange() {
    this.ts.onCameraUpdate.next();
  }
  triggerCamposChange() {
    this.ts.onCameraUpdate.next();
  }
  triggerCamposComplete(e) {
    this.ts.onCameraUpdate.next();
    this.ts.cameraIsAnimating = false;
  }

  startLighting() {
    this.stopLighting();
    this.ts.lightningRunning = true;
    this.ts.lightningTimeout = setTimeout(() => {
      this.startLighting();
      if (this.ts.isSoundOn.value) {
        this.lightning();
      }
    }, 2000 + ((1 - (this.ts.lightning - 0.5) * 2) * 6000 + 2000) * Math.random());
  }
  stopLighting() {
    this.ts.lightningRunning = false;
    this.ts.lightningHappening = false;
    if (this.ts.lightningTween) this.ts.lightningTween.kill();
    clearTimeout(this.ts.lightningTimeout2);
    clearTimeout(this.ts.lightningTimeout);
  }

  async lightning() {
    const origLum = this.ts.skyController.luminance;
    const lnum = Math.floor(5 + Math.random() * 8);

    this.ts.lightningHappening = true;
    for (let i = 0; i < lnum; i++) {
      if (!this.ts.lightningRunning) {
        if (this.ts.lightningTween) this.ts.lightningTween.kill();
        clearTimeout(this.ts.lightningTimeout2);
        this.ts.luminanceOverride = origLum;
        this.ts.onSkyUpdate.next();
        return;
      }
      if (i % 2 === 0) {
        this.ts.luminanceOverride = 0.01;
        this.ts.onSkyUpdate.next();
      }

      const dur = -150 + 300 * Math.random();
      if (this.ts.lightningTween) this.ts.lightningTween.kill();
      if (i % 2 !== 0) {
        this.ts.lightningTween = TweenMax.to(this.ts, dur / 1000, {
          luminanceOverride: origLum,
          onUpdate: () => {
            this.ts.onSkyUpdate.next();
          },
        });
      }

      await new Promise((resolve) => {
        this.ts.lightningTimeout2 = setTimeout(resolve, dur);
      });
    }
    if (this.ts.lightningTween) this.ts.lightningTween.kill();
    this.ts.luminanceOverride = origLum;
    this.ts.lightningHappening = false;

    this.ts.onSkyUpdate.next();
  }

  onRender(clock: { elapsedTime: number; delta: number }) {}

  createTimeline() {
    // const uniqueprops = ["check"];
    const uniqueprops = [];

    this.states.forEach((state) => {
      Object.keys(state).forEach((key) => {
        if (uniqueprops.indexOf(key) < 0) {
          uniqueprops.push(key);
        }
      });
    });

    const timelines: any = {};
    const goalsForStates: any = [];
    this.states.forEach((state, index) => {
      const goals = this.setState(index, false);
      goalsForStates.push(goals);
    });

    this.states.forEach((state, index) => {
      if (index === 0) {
        return;
      }
      uniqueprops.forEach((key) => {
        if (["delay", "duration"].indexOf(key) < 0) {
          const el = goalsForStates[index][key];

          if (!timelines[key]) {
            timelines[key] = gsap.timeline();
          }
          if (el) {
            el.goal.ease = state.scrollEase ? state.scrollEase : "none";
            el.goal.duration = state.duration !== undefined ? state.duration : 1;
            el.goal.delay = state.delay !== undefined ? state.delay : 0;
            el.goal.onStart = () => {
              // console.log("started", key, index);
            };
            timelines[key].to(el.target, el.goal);
            if (key === "check") {
              // console.log(el);
            }
          } else {
            // const hasPrevGoal = goalsForStates[index - 1]?.[key];
            const hasPrevGoal = this.findClosestPrev(goalsForStates, key, index);

            const hasNextGoal = this.findClosestNext(goalsForStates, key, index);

            if (hasNextGoal.found && hasPrevGoal.found) {
              const num = hasPrevGoal.stepsNeeded + hasNextGoal.stepsNeeded;
              const fixnext = (1 - hasNextGoal.stepsNeeded / num) * 0.5;
              const fixprev = (1 - hasPrevGoal.stepsNeeded / num) * 0.5;
              const lerp = 0.5 - fixprev + fixnext;
              const lerpedGoal = this.lerpObjects(hasPrevGoal.found.goal, hasNextGoal.found.goal, lerp);
              // if (key === "skyController") {
              //   console.log("____________________", index);
              //   console.log(lerp);
              //   console.log("prev", hasPrevGoal.found.goal, "next", hasNextGoal.found.goal);
              //   console.log(lerpedGoal);
              // }
              lerpedGoal.ease = state.scrollEase ? state.scrollEase : "none";
              lerpedGoal.delay = state.delay !== undefined ? state.delay : 0;
              lerpedGoal.duration = state.duration !== undefined ? state.duration : 1;
              // lerpedGoal.onStart = () => {
              //   console.log("started", key, index);
              // };
              timelines[key].to(hasPrevGoal.found.target, lerpedGoal);
            } else {
              const goal: any = {};
              goal.duration = state.duration !== undefined ? state.duration : 1;
              timelines[key].to({}, goal);
            }
          }
        }
      });
    });
    return timelines;
  }

  findClosestPrev(goalsForStates, key, index, stepsNeeded = 1) {
    // if (key === "skyController") {
    //   console.log("finding", index);
    // }
    let ind = index - 1;
    let found = goalsForStates[ind]?.[key];

    if (!found && ind > 0) {
      return this.findClosestPrev(goalsForStates, key, ind, stepsNeeded + 1);
    }
    return { key, found, stepsNeeded };
  }
  findClosestNext(goalsForStates, key, index, stepsNeeded = 1) {
    let ind = index + 1;
    let found = goalsForStates[ind]?.[key];

    if (!found && ind < goalsForStates.length) {
      return this.findClosestNext(goalsForStates, key, ind, stepsNeeded + 1);
    }
    return { key, found, stepsNeeded };
  }

  lerpObjects(obj1, obj2, lerp = 0.5, skip: string[] = ["onUpdateParams", "onUpdate", "ease", "_gsap"]) {
    // console.log("lerp", obj1);
    const lerped: any = {};
    Object.keys(obj1).forEach((key) => {
      if (skip.indexOf(key) < 0) {
        if (obj1[key] !== undefined && obj2[key] !== undefined && typeof obj1[key] == "number" && typeof obj2[key] == "number") {
          lerped[key] = THREE.MathUtils.lerp(obj1[key], obj2[key], lerp);
        } else if (obj1[key] !== undefined && obj2[key] !== undefined && typeof obj1[key] === "object" && typeof obj2[key] === "object") {
          lerped[key] = this.lerpObjects(obj1[key], obj2[key], lerp);
        } else {
          lerped[key] = obj1[key];
        }
      }
    });
    return lerped;
  }

  onSkyUpdate() {}
}
