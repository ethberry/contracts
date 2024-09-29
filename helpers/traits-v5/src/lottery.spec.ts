import { boolArrayToByte32, byte32ToBoolArray } from "./lottery";

describe("Bitwise operations", function () {
  describe("boolArrayToByte32", function () {
    it("should encode boolean array into byte32", function () {
      const boolArray = Array(36).fill(false);
      boolArray[10] = true;
      boolArray[20] = true;
      const result = boolArrayToByte32(boolArray);
      expect(result).toEqual("0x0000000000000000000000000000000000000000000000000000000000100400");
    });
  });

  describe("byte32ToBoolArray", function () {
    it("should decode byte32 into boolean array", function () {
      const byte32 = "0x0000000000000000000000000000000000000000000000000000000000100400";
      const result = byte32ToBoolArray(byte32);
      expect(result[10]).toEqual(true);
      expect(result[20]).toEqual(true);
    });
  });
});
