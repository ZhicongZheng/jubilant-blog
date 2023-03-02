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
      <div class="user-switch">
        <div>
          <n-switch v-model:value="allowNotify" style="margin-left: 1rem" size="small" />
          <span style="margin-left: 1rem; font-size: 12px">接受邮件通知</span>
        </div>
        <div>
          <n-switch v-model:value="rememberMe" style="margin-left: 1rem" size="small" />
          <span style="margin-left: 1rem; font-size: 12px">记住我的信息</span>
        </div>
      </div>
    </div>
    <div v-if="showUserInfo" class="comment-user-info">
      <div class="user-name-email">
        <n-input
          v-model:value="userName"
          style="width: 45%"
          placeholder="请输入昵称(必填，公开)"
          maxlength="50"
          aria-required="true"
        />
        <n-input
          v-model:value="userEmail"
          style="width: 45%"
          placeholder="请输入邮箱(用来通知您评论的回复，非必填，非公开)"
          aria-required="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, toRefs } from "vue"
import emojiList from "@/utils/emoji"
import { api } from "@/request/service"
import { CommentCommand } from "@/request/generator"
import useStore from "@/store"
import isEmail from "@/utils/Regex"

const { user } = useStore()
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
  showUserInfo: {
    type: Boolean,
    default: true
  },
  typeId: {
    type: Number
  }
})

const data = reactive({
  userName: user.userName,
  userEmail: user.userEmail,
  allowNotify: user.allowNotify,
  rememberMe: user.rememberMe,
  sendActive: false,
  show: props.show,
  commentContent: "",
  showUserInfo: props.showUserInfo,
  commentReply: {
    replyTo: undefined,
    replyUser: undefined,
    resourceId: props.typeId,
    typ: props.commentType,
    content: ""
  } as CommentCommand
})
const { userName, userEmail, allowNotify, rememberMe, sendActive, show, showUserInfo, commentContent, commentReply } =
  toRefs(data)
const placeholderText = computed(() =>
  commentReply.value.replyUser ? `回复 @${commentReply.value.replyUser}：` : "发一条友善的评论"
)
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

  if (showUserInfo.value && userName.value.length <= 0) {
    window.$message?.error("昵称不能为空")
    return
  }

  if (allowNotify.value && !isEmail(userEmail.value)) {
    window.$message?.error("邮箱格式不正确")
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
    userName: userName.value,
    userEmail: userEmail.value,
    replyTo: commentReply.value.replyTo,
    replyUser: commentReply.value.replyUser,
    resourceId: commentReply.value.resourceId,
    allowNotify: allowNotify.value
  }).then(() => {
    sendActive.value = false
    commentContent.value = ""
    window.$message?.success("评论成功")
    if (rememberMe.value) {
      user.SetUserInfo({
        userName: userName.value,
        userEmail: userEmail.value,
        allowNotify: allowNotify.value,
        rememberMe: rememberMe.value
      })
      showUserInfo.value = false
    } else {
      user.CLearUserInfo()
    }
    // 重新加载评论列表
    emit("reload")
  })
}
const setReply = (flag: boolean) => {
  show.value = flag
}

const setShowUserInfo = (flag: boolean) => {
  showUserInfo.value = flag
}
defineExpose({ commentReply, userName, userEmail, allowNotify, rememberMe, setReply, setShowUserInfo })
</script>

<style lang="scss" scoped>
.comment-user-info {
  display: flex;
  flex-direction: column;
}
.user-name-email {
  display: flex;
  justify-content: space-between;
  margin-left: 0.5rem;
}
.user-switch {
  display: flex;
  font-size: 1rem;
  margin-left: 0.5rem;
  justify-content: space-between;
}
</style>
