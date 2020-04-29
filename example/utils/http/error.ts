export default async function cacheMiddleware(ctx: any, next: any) {
	await next()
	console.info('error mid')
	const { error } = ctx.res
	console.log(error)
}