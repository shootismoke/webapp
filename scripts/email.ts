import { main } from '../src/backend/reports/email/main';

// This script sends email reports to all users.
main()
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
