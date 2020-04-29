import http from '../utils/http/http'
import errorMiddleware from '../utils/http/error'

http.use(errorMiddleware)

export const getRepos = (name: string) => {
	return http.get(`https://api.github.com/users/${name}/repos`, { cacheOptions: { cache: true } })
}