import redis from 'redis';
import {
	RateLimiterRedis,
	RateLimiterMemory,
	IRateLimiterStoreOptions,
	IRateLimiterOptions,
} from 'rate-limiter-flexible';
import camelcase from 'camelcase';
import { RedisNotFoundException } from '../exceptions';
import env from '../env';

// options for the rate limiter are set below. Opts can be found
// at https://github.com/animir/node-rate-limiter-flexible/wiki/Options

let rateLimiterConfig = new RateLimiterMemory(getRateLimiterConfig());
// need to pick redis or memory
if (env.RATE_LIMIT_TYPE === 'redis') {
	rateLimiterConfig = new RateLimiterRedis(getRateLimiterRedisConfig());
}

export default rateLimiterConfig;

function getRateLimiterConfig(): IRateLimiterOptions {
	const config: any = {};
	config.keyPrefix = 'rlflx';
	for (const [key, value] of Object.entries(env)) {
		if (key === 'CONSUMED_POINTS_LIMIT') {
			config.points = value;
			continue;
		}
		if (key === 'CONSUMED_RESET_DURATION') {
			config.duration = value;
			continue;
		}
	}

	return config;
}

function getRateLimiterRedisConfig(): IRateLimiterStoreOptions {
	const redisConfig: any = {};
	const redisClient = redis.createClient({
		enable_offline_queue: false,
		host: env.SREDIS_HOST,
		port: env.SREDIS_PORT,
		password: env.SREDIS_PASSWORD,
	});

	if (!redisClient) {
		throw new RedisNotFoundException('Redis client does not exist');
	}

	redisConfig.keyPrefix = 'rlflx';
	redisConfig.storeClient = redisClient;

	for (const [key, value] of Object.entries(env)) {
		if (key.startsWith('REDIS')) {
			// amended as we want the second and third words
			const configKey = camelcase(
				key.split('_').filter((_, index) => [0, 0].includes(index) === false)
			);
			redisConfig[configKey] = value;
		}
	}

	return redisConfig;
}
