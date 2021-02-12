import axios from 'axios';
import { Commit, createStore } from 'vuex';
import { ColumnProps, PostProps } from './testData';
export { ColumnProps, PostProps, ImageProps } from './testData';
export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalDataInterface {
  error: GlobalErrorProps;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
  loading: boolean;
  token: string;
}
const getAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
) => {
  const { data } = await axios.get(url);
  commit(mutationName, data);
  return data;
};
const postAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  payload: any,
) => {
  const { data } = await axios.post(url, payload);
  commit(mutationName, data);
  return data;
};
const store = createStore<GlobalDataInterface>({
  state: {
    error: { status: false },
    columns: [],
    posts: [],
    user: {
      isLogin: false,
    },
    loading: false,
    token: localStorage.getItem('token') || '',
  },
  mutations: {
    createPost(state, newPost) {
      state.posts.push(newPost);
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list;
    },
    setLoading: (state, status) => {
      state.loading = status;
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e;
    },
    login(state, rawData) {
      const { token } = rawData.data;
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data };
    },
  },
  getters: {
    biggerColumnsLen(state) {
      return state.columns.filter(c => parseInt(c._id) > 2)?.length;
    },
    getColumnById: state => (id: number) => {
      return state.columns.find(c => parseInt(c._id) === id);
    },
    getPostsByCid: state => (cid: number) => {
      return state.posts.filter(post => post.columnId === cid.toString());
    },
  },
  actions: {
    fetchColumns(context) {
      return getAndCommit('/columns', 'fetchColumns', context.commit);
    },
    fetchColumn({ commit }, cid) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit);
    },
    async fetchPosts({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit);
    },
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload);
    },
    fetchCurrentUser({ commit }) {
      return getAndCommit(`/user/current`, 'fetchCurrentUser', commit);
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser');
      });
    },
  },
});

export default store;
