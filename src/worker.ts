export interface Env {
	telegram_secret: string;
}

const new_message = (token: string, text: string) =>
	new URL(`https://api.telegram.org/bot${token}/sendMessage?` + new URLSearchParams({ chat_id: '@seanweblogschannel', text }));

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		let proxy_url = '';
		switch (new URL(request.url).host) {
			case 'proxy.codebam.workers.dev':
				return new Response('proxy worker - https://github.com/codebam/proxy-worker');
			case 'seanbehan.ca':
				proxy_url = 'https://seanbehan-ca.pages.dev';
			case 'www.seanbehan.ca':
				proxy_url = 'https://seanbehan-ca.pages.dev';
			default:
				proxy_url = 'https://seanbehan-ca.pages.dev';
				console.log(new URL(request.url).host);
		}
		let res = await fetch(proxy_url + new URL(request.url).pathname, request);

		const ip = request.headers.get('x-real-ip');
		const url = request.url;
		const referer = request.headers.get('Referer');
		const timezone = request.cf?.timezone;
		const country = request.cf?.country;
		const latitude = request.cf?.latitude;
		const longitude = request.cf?.longitude;
		const postal_code = request.cf?.postalCode;
		const organization = request.cf?.asOrganization;

		fetch(
			new_message(
				env.telegram_secret,
				JSON.stringify(
					{
						ip,
						url,
						referer,
						timezone,
						country,
						latitude,
						longitude,
						postal_code,
						organization,
					},
					null,
					2
				)
			)
		);
		return res;
	},
};
