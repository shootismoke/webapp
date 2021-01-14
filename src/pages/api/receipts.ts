import { NowRequest, NowResponse } from '@vercel/node';
import { Expo, ExpoPushReceiptId } from 'expo-server-sdk';

import { handleReceipts } from '../../backend/expoReport';
import { PushTicket } from '../../backend/models';
import { IPushTicket } from '../../backend/types';
import { connectToDatabase, logger, sentrySetup } from '../../backend/util';

sentrySetup();

/**
 * Handle push notifications receipts.
 */
export default async function receipts(
	req: NowRequest,
	res: NowResponse
): Promise<void> {
	try {
		switch (req.method) {
			case 'POST': {
				await connectToDatabase();

				const tickets = await PushTicket.find({
					receiptId: { $exists: true },
				});
				// Mapping of receiptId->userId
				const receiptsMapping = tickets.reduce((acc, ticket) => {
					acc[ticket.receiptId as ExpoPushReceiptId] = ticket.userId;

					return acc;
				}, {} as Record<ExpoPushReceiptId, string>);

				// Handle the receiptIds
				const receiptIds: ExpoPushReceiptId[] = tickets.map(
					(ticket) => ticket.receiptId as ExpoPushReceiptId
				);
				const okReceiptIds: ExpoPushReceiptId[] = []; // Store the ids that are good
				const errorReceipts: IPushTicket[] = []; // Store the receipts that are bad
				await handleReceipts(
					new Expo(),
					receiptIds,
					(receiptId) => {
						okReceiptIds.push(receiptId);
					},
					(receiptId, receipt) => {
						errorReceipts.push({
							...receipt,
							receiptId,
							userId: receiptsMapping[receiptId],
						});
					}
				);

				await PushTicket.deleteMany({
					receiptId: {
						$in: okReceiptIds,
					},
				});

				res.send({
					details: `Cleaned ${okReceiptIds.length} push tickets`,
				});

				break;
			}
			default: {
				res.status(405).json({
					error: `Unknown request method: ${
						req.method || 'undefined'
					}`,
				});
			}
		}
	} catch (error) {
		logger.error(error);
		res.status(500).send({ error: (error as Error).message });
	}
}
