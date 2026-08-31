import axios from 'axios';
import debug from 'debug';

const l = debug('shootismoke:dataproviders');

export function fetchAndDecode<T, E = Error>(
	url: string,
	options: {
		formatError?: (error: E) => Error;
	} = {}
): Promise<T> {
	l(`Fetching URL ${url}`);
	return axios
		.get<T>(url)
		.then(({ data }) => data)
		.catch((error: E) => {
			throw options.formatError ? options.formatError(error) : error;
		});
}
