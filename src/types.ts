enum version {
	'001' = '001',
	'002' = '002'
}

enum encoding {
	'ISO 8859-1' = 'ISO 8859-1',
	'ISO 8859-2' = 'ISO 8859-2',
	'ISO 8859-4' = 'ISO 8859-4',
	'ISO 8859-5' = 'ISO 8859-5',
	'ISO 8859-7' = 'ISO 8859-7',
	'ISO 8859-10' = 'ISO 8859-10',
	'ISO 8859-15' = 'ISO 8859-15',
	//'UTF-8', 'UTF-8'
}

enum identifier {
	'SCT' = 'SCT'
}

export type ReqQuery = {
	base64Image: string,
	version: version,
	encoding: encoding,
	identifier: identifier,
	bic: string,
	paymentReceiver?: string,
	iban: string,
	amount?: string,
	purpose?: string,
	reference?: string,
	purposeOfUse?: string,
	additionalInformation?: string
}
