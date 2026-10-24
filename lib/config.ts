import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

type ConfigType = {
    refis: number,
    ano: number
}

export async function getConfig() {
    const config = await redis.get('fidaf-config');
    const defaultConfig = { ano: 2025, refis: 0 }
    return {
        ...defaultConfig,
        ...JSON.parse(String(config))
    } as ConfigType
}

export async function setConfig(input: ConfigType) {
    const config = JSON.stringify(input)

    await redis.set('fidaf-config', config)
}