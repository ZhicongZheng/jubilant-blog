<template>
  <div class="reply-box" v-if="show">
    <div class="box-normal">
      <div class="reply-box-warp">
        <textarea
          class="reply-box-textarea"
          v-model="commentContent"
          :style="sendActive ? lineStyle : ''"
          @input.prevent="inputActive"
          :placeholder="placeholderText"
        />
      </div>
      <div class="reply-box-send" :class="sendActive ? 'send-active' : ''" @click="handleAdd">评论</div>
    </div>
    <div class="box-expand">
      <Emoji @add-emoji="handleEmoji" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, toRefs } from "vue"
import emojiList from "@/utils/emoji"
import { api } from "@/request/service"
import { CommentCommand } from "@/request/generator"
const lineStyle = {
  lineHeight: "normal",
  borderColor: "#ed6ea0",
  backgroundColor: "var(--grey-0)"
}
const emit = defineEmits(["reload"])
const props = defineProps({
  commentType: {
    type: Number
  },
  show: {
    type: Boolean,
    default: true
  },
  typeId: {
    type: Number
  }
})
const data = reactive({
  nickname: "",
  sendActive: false,
  show: props.show,
  commentContent: "",

  commentReply: {
    replyTo: undefined,
    replyUser: undefined,
    resourceId: props.typeId,
    typ: props.commentType,
    content: ""
  } as CommentCommand
})
const { nickname, sendActive, show, commentContent, commentReply } = toRefs(data)
const placeholderText = computed(() => (nickname.value ? `回复 @${nickname.value}：` : "发一条友善的评论"))
const inputActive = () => {
  if (commentContent.value.length == 0) {
    sendActive.value = false
  } else {
    sendActive.value = true
  }
}
const handleEmoji = (key: string) => {
  commentContent.value += key
  sendActive.value = true
}
const handleAdd = () => {
  if (commentContent.value.trim() == "") {
    window.$message?.error("评论不能为空")
    return
  }
  // 解析表情
  commentReply.value.content = commentContent.value.replace(/\[.+?\]/g, (str) => {
    return (
      "<img src= '" + emojiList[str] + "' width='21' height='21' style='margin: 0 1px;vertical-align: text-bottom'/>"
    )
  })

  api.CommentApi.addComment({
    typ: commentReply.value.typ,
    content: commentReply.value.content,
    userName: nickname.value,
    userEmail: "",
    replyTo: commentReply.value.replyTo,
    replyUser: commentReply.value.replyUser,
    resourceId: commentReply.value.resourceId,
    allowNotify: false
  }).then(() => {
    sendActive.value = false
    commentContent.value = ""
    window.$message?.success("评论成功")
    // 重新加载评论列表
    emit("reload")
  })
}
const setReply = (flag: boolean) => {
  show.value = flag
}
defineExpose({ commentReply, nickname, setReply })
</script>

<style scoped></style>
