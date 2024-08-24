// scriptUtils.ts
import { Buffer } from 'buffer';

const covenantPksCount = [
    "0249766ccd9e3cd94343e2040474a77fb37cdfd30530d05f9f1e96ae1e2102c86e",
    "0276d1ae01f8fb6bf30108731c884cddcf57ef6eef2d9d9559e130894e0e40c62c",
    "0217921cf156ccb4e73d428f996ed11b245313e37e27c978ac4d2cc21eca4672e4",
    "02113c3a32a9d320b72190a04a020a0db3976ef36972673258e9a38a364f3dc3b0",
    "0379a71ffd71c503ef2e2f91bccfc8fcda7946f4653cef0d9f3dde20795ef3b9f0",
    "023bb93dfc8b61887d771f3630e9a63e97cbafcfcc78556a474df83a31a0ef899c",
    "03d21faf78c6751a0d38e6bd8028b907ff07e9a869a43fc837d6b3f8dff6119a36",
    "0340afaf47c4ffa56de86410d8e47baa2bb6f04b604f4ea24323737ddc3fe092df",
    "03f5199efae3f28bb82476163a7e458c7ad445d9bffb0682d10d3bdb2cb41f8e8e"
];

export function parseDataEmbedScript(script) {
    let offset = 0;

    const magicBytes = script.slice(offset, offset + 4);
    offset += 4;

    const stakerPk = script.slice(offset, offset + 33);
    offset += 33;

    const finalityProviderPk = script.slice(offset, offset + 33);
    offset += 33;

    const covenantPks = [];
    for (let i = 0; i < covenantPksCount.length; i++) {
        const pk = script.slice(offset, offset + 33);
        covenantPks.push(pk);
        offset += 33;
    }

    const covenantThreshold = script.readUInt8(offset);
    offset += 1;

    const stakingDuration = script.readUInt32LE(offset);
    offset += 4;

    const minUnbondingTime = script.readUInt32LE(offset);
    offset += 4;

    return {
        magicBytes,
        stakerPk,
        finalityProviderPk,
        covenantPks,
        covenantThreshold,
        stakingDuration,
        minUnbondingTime,
    };
}
