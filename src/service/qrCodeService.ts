import Jimp from 'jimp';
import QRCode, {QRCodeOptions, QRCodeRenderersOptions, QRCodeToBufferOptions} from 'qrcode';

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
	const logoImage = await Jimp.read(Buffer.from(base64Image.replace(/^data:image\/png;base64,/, ''), 'base64'));
	return resizeSquared(await logoImage.clone(), w, h);
}

async function getLogoBackground(resizedLogo: Jimp, scaleFactor: number): Promise<Jimp> {
	return resizedLogo.clone().brightness(1).scale(scaleFactor);
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

	const bgScaleFactor = 1.14;

	const img = await createQRCode(text, opt);
	const logo = await getResizedLogo(
		base64Image,
		Math.floor(img.bitmap.width / ratio),
		Math.floor(img.bitmap.height / ratio),
	);

	const logoBg = await getLogoBackground(logo, bgScaleFactor);

	const xBg = Math.floor((img.bitmap.width - logoBg.bitmap.width) / 2);
	const yBg = Math.floor((img.bitmap.height - logoBg.bitmap.height) / 2);

	const xLogo = Math.floor((logoBg.bitmap.width - logo.bitmap.width) / 2);
	const yLogo = Math.floor((logoBg.bitmap.height - logo.bitmap.height) / 2);

	const qrImg = img.composite(logoBg.composite(logo, xLogo, yLogo), xBg, yBg);

	return qrImg.getBufferAsync(Jimp.MIME_PNG);
}
