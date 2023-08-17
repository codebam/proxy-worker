export interface Env {
	telegram_secret: string;
}

const new_message = (token: string, text: string) =>
	new URL(`https://api.telegram.org/bot${token}/sendMessage?` + new URLSearchParams({ chat_id: '@seanweblogschannel', text }));

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		let res = await fetch('https://seanbehan-ca.pages.dev' + new URL(request.url).pathname, request);
		await fetch(
			new_message(env.telegram_secret, JSON.stringify({ ip: request.headers.get('x-real-ip'), url: request.url, cf: request.cf }, null, 2))
		);
		return res;
	},
};
