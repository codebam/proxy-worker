export interface Env {
	telegram_secret: string;
}

const new_message = (token: string, text: string) =>
	new URL(`https://api.telegram.org/bot${token}/sendMessage?` + new URLSearchParams({ chat_id: '@seanweblogschannel', text }));

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		let url = '';
		switch (new URL(request.url).host) {
			case 'seanbehan.ca':
				url = 'https://seanbehan-ca.pages.dev';
			case 'www.seanbehan.ca':
				url = 'https://seanbehan-ca.pages.dev';
			default:
				console.log(new URL(request.url).host);
		}
		let res = await fetch(url + new URL(request.url).pathname, request);
		await fetch(
			new_message(
				env.telegram_secret,
				JSON.stringify(
					{
						ip: request.headers.get('x-real-ip'),
						url: request.url,
						referrer: request.headers.get('Referer'),
						timezone: request.cf?.timezone,
						country: request.cf?.country,
						latitude: request.cf?.latitude,
						longitude: request.cf?.longitude,
						postal_code: request.cf?.postalCode,
					},
					null,
					2
				)
			)
		);
		return res;
	},
};
