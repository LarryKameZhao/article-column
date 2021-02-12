<template>
  <div class="file-upload">
    <button class="btn btn-primary" @click.prevent="triggerUpload">
      <span v-if="fileStatus === 'ready'">点击上传</span>
      <span v-else-if="fileStatus === 'success'">上传成功</span>
      <span v-if="fileStatus === 'loading'">正在上传</span>
    </button>
    <input
      type="file"
      class="file-input d-none"
      @change="handleFileChange"
      ref="fileInput"
    />
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, PropType, ref } from 'vue';
type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
type CheckFunction = (file: File) => boolean;
export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>,
    },
  },
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const fileStatus = ref<UploadStatus>('ready');
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput?.value?.click();
      }
    };
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement;

      if (currentTarget.files) {
        const files = Array.from(currentTarget.files);
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0]);
          if (!result) {
            return;
          }
        }
        fileStatus.value = 'loading';

        const formDta = new FormData();
        console.log(files);
        formDta.append('file', files[0]);
        formDta.append('icode', '21FDC709F2A7D980');
        console.log(formDta.get('file'));
        axios
          .post(props.action, formDta, {
            headers: {
              'Content-Type': 'multipart/formData',
            },
          })
          .then(resp => {
            fileStatus.value = 'success';
            context.emit('file-uploaded', resp.data);
          })
          .catch(error => {
            fileStatus.value = 'error';
            context.emit('file-uploaded-error', { error });
          })
          .finally(() => {
            if (fileInput.value) {
              fileInput.value.value = '';
            }
          });
      }
    };
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      handleFileChange,
    };
  },
});
</script>

<style scoped></style>
