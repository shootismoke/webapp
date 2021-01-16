import type { NextApiRequest, NextApiResponse } from 'next';

export const allowedOrigins = [
	'http://localhost:3000',
	'https://shootismoke.app',
	/\.vercel\.app$/,
	/\.now\.sh$/,
];

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware<T>(
	req: NextApiRequest,
	res: NextApiResponse,
	fn: (
		req: NextApiRequest,
		res: NextApiResponse,
		t: (result: T) => void
	) => void
): Promise<T> {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}
