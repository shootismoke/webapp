import { main } from '../src/backend/reports/email/main';

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
