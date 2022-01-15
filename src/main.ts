import express, {Request} from 'express';
import {ReqQuery} from './types';
import generate from './service/qrCodeService';

const app = express();

type qrCodeRequest = Request<never, never, never, ReqQuery>

function queryStringsToText(query: ReqQuery): string {

	return `BCD
${query.version || ''}
${query.encoding || ''}
${query.identifier || ''},
${query.bic || ''}
${query.paymentReceiver || ''}
${query.iban || ''}
${query.amount || ''}
${query.purpose || ''}
${query.reference || ''}
${query.purposeOfUse || ''}
${query.additionalInformation || ''}
`;

}

app.get('/', async (req: qrCodeRequest, res) => {
	try {
		const qrCodeBuffer = generate({
			text: queryStringsToText(req.query),
			base64Image: req.query.base64Image,
			opt: {
				errorCorrectionLevel: 'H',
				margin: 2

			},
			ratio: 2
		}).then((buffer: any) => {
			res.setHeader('Content-type', 'image/png');
			res.send(buffer);
		});
	} catch (err) {
		console.error('Failed to return content', err);
	}
});

app.listen(3000, () => {
	console.log(`server started at http://localhost:3000`);
});
