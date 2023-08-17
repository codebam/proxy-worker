import handleProxy from './proxy';

export default {
	fetch: (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => handleProxy.fetch(request, env, ctx),
};
