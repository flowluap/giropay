# Giropay
![alt text](./docs/images/qr_giropay.png)
![alt text](./docs/images/qr_flowluap.png)

## Installation
```
pnpm i
pnpm dev
```
## Run via Docker-Container
```
docker run -p 3000:3000 flowluap/giropay:latest
```

## Build your own image
```
docker build -t imagename .
docker run -p 3000:3000 imagename
```

## Usage

### HTML
```html
<img src="http://localhost:3000?
version=001&
encoding=1&
identifier=SCT&
bic=COBADEFFXXX&
paymentReceiver=Alice&
iban=DE4782579257424572&
amount=EUR1&
purpose&
reference&
purposeOfUse=Testpayment&
additionalInformation=Info
base64image=data:image/png;base64," width="300px" height="300px"/>
```
### sevDesk
```html
<img src="http://localhost:3000?
version=001&
encoding=1&
identifier=SCT&
bic={{data.client.bank_bic}}&
paymentReceiver={{data.client.ceo_name}}&
iban={{data.client.bank_iban}}&
amount=EUR{{#data.object.is_final_invoice}}{{data.object.partial_calc_gross}}{{/data.object.is_final_invoice}}{{^data.object.is_final_invoice}}{{data.object.total}}{{/data.object.is_final_invoice}}&
purpose&
reference&
purposeOfUse={data.object.invoice_number}}&
additionalInformation&
base64image=data:image/png;base64,{{data.logo}}" width="300px" height="300px"/>
```

