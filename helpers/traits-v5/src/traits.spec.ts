import { decodeNumber, decodeTraits, encodeNumbers, encodeTraits } from ".";

const data = {
  strength: 1,
  dexterity: 2,
  constitution: 18,
  intelligence: 128,
  wisdom: 256,
  charisma: 1024,
};

// 0x010000000200000012000000800000010000000400
const dna = 1461501638011467653471668687260973553737594307584n;

describe("Traits", function () {
  describe("encodeNumbers", function () {
    it("should encode numbers", function () {
      const result = encodeNumbers(Object.values(data));
      expect(result).toEqual(dna);
    });
  });

  describe("decodeNumber", function () {
    it("should decode numbers", function () {
      const result = decodeNumber(dna);
      expect(result).toEqual([0, 0, 1, 2, 18, 128, 256, 1024]);
    });
  });

  describe("encodeTraits", function () {
    it("should encode traits", function () {
      const result = encodeTraits(data);
      expect(result).toEqual(dna);
    });
  });

  describe("decodeTraits", function () {
    it("should decode traits", function () {
      const result = decodeTraits(dna);
      expect(result).toMatchObject(data);
    });
  });
});
