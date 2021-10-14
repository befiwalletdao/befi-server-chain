const Convert = require('./convert_eth');
const Web3 = require('web3');

class TEMP extends Convert {
    constructor() {
        super('MATIC',
            'BLOCK_MATIC',
            new Web3(new Web3.providers.HttpProvider(CONFIG.provider.matic.host))
        );
    }

    async getContractABI(address) {

        let abi = await REDIS.BEEPAY.getAsync(CONFIG.redisKeys.CONTRACT_ABI + address.toLowerCase())
        if (abi) return JSON.parse(abi)
        try {
            let ango = new Ango({host: CONFIG.scans.maticApi})
            let result = await ango.get('/api', {
                module: "contract",
                action: "getabi",
                address: address,
                apikey: CONFIG.scans.maticApiKey
            })
            // console.log(`result`, result)
            if (result && result.message !== 'NOTOK' && result.result) {

                REDIS.BEEPAY.set(CONFIG.redisKeys.CONTRACT_ABI + address.toLowerCase(), result.result)
                if ((typeof result.result) == 'string') return JSON.parse(result.result)
                return result.result
            }
        } catch (e) {
            console.log(e);
        }
        return await super.getContractABI(address);
    }

}

module.exports = TEMP
