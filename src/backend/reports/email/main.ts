import { findUsersForReport } from '../cron';

async function main(): Promise<void> {
	// Fetch all users to whom we should send an email report.
	const users = await findUsersForReport('email');

	console.log(users);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
