/**
 * @ignore
 */

/**
 * Create an Error for a provider
 *
 * @param provider - The id of the provider
 * @param msg - The content of the error message
 */
export function providerError(provider: string, msg: string): Error {
	return new Error(`[${provider}] ${msg}`);
}
