import rewire from "rewire"
import {getCoinsPriceDiff, updateCoinsList} from "../controller"
import {expect} from "chai"
// const controller = rewire('../controller.js')

describe("Controller inner functions testing", function() {
    describe("Url Builder", function() {
      it("converts the basic colors", async function() {
        // let regular =  await controller.urlBuilder('BTC,ETH,DOGE', moment('01/01/2020'))
       
        // var redHex   = converter.rgbToHex(255, 0, 0);
        // var greenHex = converter.rgbToHex(0, 255, 0);
        // var blueHex  = converter.rgbToHex(0, 0, 255);
        
        expect(regular).to.have.lengthOf(4)


        // expect(regular).to.equal("ff0000");
        // expect(greenHex).to.equal("00ff00");
        // expect(blueHex).to.equal("0000ff");
      });
    });
  
    describe("Hex to RGB conversion", function() {
      it("converts the basic colors", function() {
        var red   = converter.hexToRgb("ff0000");
        var green = converter.hexToRgb("00ff00");
        var blue  = converter.hexToRgb("0000ff");
  
        expect(red).to.deep.equal([255, 0, 0]);
        expect(green).to.deep.equal([0, 255, 0]);
        expect(blue).to.deep.equal([0, 0, 255]);
      });
    });
  });
  