<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <uploader action="/upload"/>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          type="text"
          tag="textarea"
          rows="10"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">创建</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue';
import Uploader from '../components/Uploader.vue'
import ValidateForm from '../components/ValidateForm.vue';
import { PostProps, GlobalDataInterface } from '../store';
export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup() {
    const titleVal = ref('');
    const router = useRouter();
    const store = useStore<GlobalDataInterface>();
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' },
    ];
    const contentVal = ref('');
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' },
    ];
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column } = store.state.user;
        if (column) {
          const newPost: PostProps = {
            id: new Date().getTime(),
            title: titleVal.value,
            content: contentVal.value,
            columnId: column,
            createdAt: new Date().toLocaleDateString(),
          };
          store.commit('createPost', newPost);
          router.push({ name: 'column', params: { id: column } });
        }
      }
    };
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit,

    };
  },
});
</script>
