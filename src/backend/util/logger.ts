import { captureException, init } from '@sentry/node';

import { IS_SENTRY_SET_UP } from './constants';

/**
 * Set up Sentry, if available.
 */
export function sentrySetup(): void {
	if (process.env.BACKEND_SENTRY_DSN) {
		init({
			dsn: process.env.BACKEND_SENTRY_DSN,
		});
	}
}

/**
 * Send an error to Sentry, or if sentry is not set up, just log it.
 *
 * @param error - Error to log
 */
function error(error: Error): void {
	console.error(error.message);

	if (IS_SENTRY_SET_UP) {
		captureException(error);
	}
}

export const logger = {
	error,
};
