import axios from 'axios';
import { Commit, createStore } from 'vuex';
import { ColumnProps, PostProps } from './testData';
export { ColumnProps, PostProps } from './testData';

interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}

export interface GlobalDataInterface {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const getAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
) => {
  const data = await axios.get(url);
  commit(mutationName, data);
};
const store = createStore<GlobalDataInterface>({
  state: {
    columns: [],
    posts: [],
    user: {
      isLogin: false,
    },
  },
  mutations: {
    login(state) {
      state.user = {
        ...state.user,
        isLogin: true,
        name: 'viking',
        columnId: 1,
      };
    },
    createPost(state, newPost) {
      state.posts.push(newPost);
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list;
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
      return state.posts.filter(post => post.columnId === cid);
    },
  },
  actions: {
    fetchColumns(context) {
      getAndCommit('/columns', 'fetchColumns', context.commit);
    },
    fetchColumn({ commit }, cid) {
      getAndCommit(`/columns/${cid}`, 'fetchColumn', commit);
    },
    async fetchPosts({ commit }, cid) {
      getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit);
    },
  },
});

export default store;
