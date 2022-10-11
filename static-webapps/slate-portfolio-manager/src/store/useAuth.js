import { redirectToLogin } from './client';
import defineRestStore from './defineRestStore';

export default defineRestStore({
  id: 'auth',
  baseURL: '/login?include=Person',
  getters: {
    user() {
      const data = this.get();
      return data && data.data.Person;
    },
    token() {
      const data = this.get();
      return data && data.data.Handle;
    },
  },
  actions: {
    async required() {
      await this.fetch();
      const { user } = this;
      if (!user) {
        redirectToLogin();
      }
    },
  },
});
