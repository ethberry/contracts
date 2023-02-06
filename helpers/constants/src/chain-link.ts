export const chainLinkAddr = {
  hardhat: {
    chainLinkVRFCoordinator: "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952",
    chainLinkToken: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    chainLinkFee: 2,
    chainLinkKeyHash: "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445",
  },
  mainnet: {
    chainLinkVRFCoordinator: "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952",
    chainLinkToken: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    chainLinkFee: 2,
    chainLinkKeyHash: "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445",
  },
  mumbai: {
    chainLinkVRFCoordinator: "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255",
    chainLinkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    chainLinkFee: 0.0001,
    chainLinkKeyHash: "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4",
  },
  binancetest: {
    chainLinkVRFCoordinator: "0xa555fC018435bef5A13C6c6870a9d4C11DEC329C",
    chainLinkToken: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
    chainLinkFee: 0.1,
    chainLinkKeyHash: "0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186",
  },
  polygon: {
    chainLinkVRFCoordinator: "0x3d2341ADb2D31f1c5530cDC622016af293177AE0",
    chainLinkToken: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
    chainLinkFee: 0.0001,
    chainLinkKeyHash: "0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da",
  },
} as Record<string, any>;
