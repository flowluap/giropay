import Jimp from 'jimp';
import QRCode, {QRCodeOptions, QRCodeToBufferOptions, QRCodeRenderersOptions} from 'qrcode';

function resizeSquared(img: Jimp, _w: number, _h: number): Jimp {
	let w;
	let h;

	if (_h > _w) {
		w = Jimp.AUTO;
		h = _h;
	} else {
		w = _w;
		h = Jimp.AUTO;
	}
	return img.resize(w, h);
}

async function getResizedLogo(base64Image: string, w: number, h: number): Promise<Jimp> {
	const logoFullImg = await Jimp.read(Buffer.from(base64Image.replace(/^data:image\/png;base64,/, ''), 'base64'));
	return resizeSquared(await logoFullImg.clone(), w, h);
}

async function createQRCode(data: string, opt: QRCodeToBufferOptions): Promise<Jimp> {
	const qrBuffer = await QRCode.toBuffer(data, opt);
	return Jimp.read(qrBuffer);
}

export default async function generate({text, base64Image, opt, ratio = 2}: {
	text: string,
	base64Image: string,
	opt: QRCodeOptions | QRCodeRenderersOptions,
	ratio?: number

}): Promise<Buffer> {
	opt = {errorCorrectionLevel: 'medium', ...opt};

	const img = await createQRCode(text, opt);
	const logo = await getResizedLogo(
		base64Image,
		Math.floor(img.bitmap.width / ratio),
		Math.floor(img.bitmap.height / ratio),
	);

	const x = Math.floor((img.bitmap.width - logo.bitmap.width) / 2);
	const y = Math.floor((img.bitmap.height - logo.bitmap.height) / 2);

	const qrImg = img.composite(logo, x, y);

	return qrImg.getBufferAsync(Jimp.MIME_PNG);
}
