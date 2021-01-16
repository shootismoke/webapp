import { captureException, init } from '@sentry/node';

if (process.env.BACKEND_SENTRY_DSN) {
	init({
		dsn: process.env.BACKEND_SENTRY_DSN,
	});
}

/**
 * Send an error to Sentry, or if sentry is not set up, just log it.
 *
 * @param error - Error to log
 */
function error(error: Error): void {
	console.error(error.message);

	if (process.env.BACKEND_SENTRY_DSN) {
		captureException(error);
	}
}

export const logger = {
	error,
};
