import { captureException, init } from '@sentry/node';

if (process.env.NEXT_PUBLIC_SENTRY_API_KEY) {
	init({
		dsn: process.env.NEXT_PUBLIC_SENTRY_API_KEY,
	});
}

/**
 * Send an error to Sentry, or if sentry is not set up, just log it.
 *
 * @param error - Error to log
 */
function error(error: Error): void {
	console.error(error.message);

	if (process.env.NEXT_PUBLIC_SENTRY_API_KEY) {
		captureException(error);
	}
}

export const logger = {
	error,
};
