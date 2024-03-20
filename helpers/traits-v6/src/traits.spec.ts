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

describe("Traits", () => {
  describe("encodeNumbers", () => {
    it("should encode numbers", () => {
      const result = encodeNumbers(Object.values(data));
      expect(result).toEqual(dna);
    });
  });

  describe("decodeNumber", () => {
    it("should decode numbers", () => {
      const result = decodeNumber(dna);
      expect(result).toEqual([0, 0, 1, 2, 18, 128, 256, 1024]);
    });
  });

  describe("encodeTraits", () => {
    it("should encode traits", () => {
      const result = encodeTraits(data);
      expect(result).toEqual(dna);
    });
  });

  describe("decodeTraits", () => {
    it("should decode traits", () => {
      const result = decodeTraits(dna);
      expect(result).toMatchObject(data);
    });
  });
});
