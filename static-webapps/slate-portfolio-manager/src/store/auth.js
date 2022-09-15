import client from './client'
import defineRestStore from './defineRestStore'

const redirectToLogin = () => {
  const next = encodeURIComponent(window.location.href)
  window.location = 'http://localhost:2190/login?return=' + next
}

export const useAuth = defineRestStore({
  name: 'auth',
  baseUrl: '/login?include=Person',
  getters: {
    user() {
      return this.get()?.Person
    },
    token() {
      return this.get()?.Handle
    },
  },
  actions: {
    async required() {
      try {
        await this.fetch()
      } catch (error) {
        if (error.response?.status === 401) {
          redirectToLogin()
        }
        throw error
      }
      const { user } = this
      if (!user) {
        redirectToLogin()
      }
    }
  }
})