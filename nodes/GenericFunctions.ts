import { URL } from 'url';
import { Request, sign } from 'aws4';
import { parseString as parseXml } from 'xml2js';

import {
	ICredentialDataDecryptedObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	ITriggerFunctions,
	IWebhookFunctions,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

function getEndpointForService(service: string, credentials: ICredentialDataDecryptedObject): string {
	let endpoint;
	if (service === 'lambda' && credentials.lambdaEndpoint) {
		endpoint = credentials.lambdaEndpoint;
	} else if (service === 'sns' && credentials.snsEndpoint) {
		endpoint = credentials.snsEndpoint;
	} else if (service === 'sqs' && credentials.sqsEndpoint) {
		endpoint = credentials.sqsEndpoint;
	} else {
		endpoint = `https://${service}.${credentials.region}.amazonaws.com`;
	}
	return (endpoint as string).replace('{region}', credentials.region as string);
}

export async function awsApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions | ITriggerFunctions, service: string, method: string, path: string, body?: string, headers?: object): Promise<any> { // tslint:disable-line:no-any
	const credentials = await this.getCredentials('aws');
	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	// Concatenate path and instantiate URL object so it parses correctly query strings
	const endpoint = new URL(getEndpointForService(service, credentials) + path);

	// Sign AWS API request with the user credentials
	const signOpts = { headers: headers || {}, host: endpoint.host, method, path, body } as Request;
	sign(signOpts, { accessKeyId: `${credentials.accessKeyId}`.trim(), secretAccessKey: `${credentials.secretAccessKey}`.trim() });


	const options: IRequestOptions = {
		headers: signOpts.headers,
		method: signOpts.method as IHttpRequestMethods,
		uri: endpoint.href,
		body: signOpts.body,
	};

	try {
		return await this.helpers.request!(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error, { parseXml: true });
	}
}

export async function awsApiRequestREST(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | ITriggerFunctions, service: string, method: string, path: string, body?: string, headers?: object): Promise<any> { // tslint:disable-line:no-any
	const response = await awsApiRequest.call(this, service, method, path, body, headers);
	try {
		return JSON.parse(response);
	} catch (error) {
		return response;
	}
}

export async function awsApiRequestSOAP(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions | ITriggerFunctions, service: string, method: string, path: string, body?: string, headers?: object): Promise<any> { // tslint:disable-line:no-any
	const response = await awsApiRequest.call(this, service, method, path, body, headers);
	try {
		return await new Promise((resolve, reject) => {
			parseXml(response, { explicitArray: false }, (err, data) => {
				if (err) {
					return reject(err);
				}
				resolve(data);
			});
		});
	} catch (error) {
		return response;
	}
}
