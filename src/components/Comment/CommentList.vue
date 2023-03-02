<template>
  <div class="reply-warp">
    <div class="reply-title">
      <svg-icon icon-class="comment" size="1.4rem" style="margin-right: 5px" />
      评论
    </div>
    <ReplyBox
      @reload="reloadComments"
      :comment-type="commentType"
      :show-user-info="showUserinfo"
      :type-id="resourceId"
    />
    <div v-if="count > 0 && reFresh">
      <div class="reply-item" v-for="(comment, index) of comments" :key="comment.id">
        <div class="content-warp">
          <div class="user-info">
            <div class="user-name">{{ comment.userName }}:</div>
          </div>
          <div class="reply-content" v-html="comment.content" />
          <div class="reply-info">
            <span class="reply-time">{{ formatDateTime(comment.createAt) }}</span>
            <span class="reply-btn" @click="handleReply(index, comment)">回复</span>
          </div>
          <div class="sub-reply-item" v-for="reply of comment.reply" :key="reply.id">
            <div class="sub-user-info">
              <div class="sub-user-name">{{ reply.userName }}:</div>
            </div>
            <span class="reply-content">
              <template v-if="reply.userName !== reply.replyUser"
                >回复 <span style="color: #008ac5">@{{ reply.replyUser }}</span> :</template
              >
              <span v-html="reply.content" />
            </span>
            <div class="reply-info">
              <span class="reply-time">{{ formatDateTime(reply.createAt) }}</span>
              <span class="reply-btn" @click="handleReply(index, reply)">回复</span>
            </div>
          </div>
          <div ref="readMoreRef" class="view-more" v-show="comment.replyCount > 3">
            <span>共{{ comment.replyCount }}条回复, </span>
            <span class="view-more-btn" @click="readMoreComment(index, comment)">点击查看</span>
          </div>
          <Paging
            ref="pageRef"
            :total="comment.replyCount"
            :index="index"
            :commentId="comment.id"
            @get-current-page="getCurrentPage"
          />
          <ReplyBox
            ref="replyRef"
            class="mt-4"
            :show="false"
            :show-user-info="showUserinfo"
            :comment-type="commentType"
            :type-id="resourceId"
            @reload="reloadReplies(index)"
          />
          <div class="bottom-line" />
        </div>
      </div>
      <div class="loading-warp" v-if="count > comments.length">
        <n-button class="btn" color="#e9546b" @click="fetchCommentList"> 加载更多...</n-button>
      </div>
    </div>
    <div v-else style="padding: 1.25rem; text-align: center">来发评论吧~</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, toRefs, onMounted, watch, nextTick } from "vue"
import { useRoute } from "vue-router"
import { formatDateTime } from "@/utils/date"
import { api } from "@/request/service"
import { CommentDto } from "@/request/generator"
import useStore from "@/store"

const { user } = useStore()
const route = useRoute()
const replyRef = ref<any>([])
const pageRef = ref<any>([])
const readMoreRef = ref<any>([])
const props = defineProps({
  commentType: {
    type: Number
  }
})
const emit = defineEmits(["getCommentCount"])
const resourceId = computed(() => (Number(route.params.id) ? Number(route.params.id) : undefined))
const showUserinfo = computed(() => user.userName.length == 0)
const data = reactive({
  count: 0,
  reFresh: true,
  queryParams: {
    current: 1,
    size: 5,
    resourceId: resourceId.value,
    commentType: props.commentType
  },
  comments: [] as CommentDto[]
})
const { count, reFresh, queryParams, comments } = toRefs(data)
// 刷新评论列表
watch(
  comments,
  () => {
    reFresh.value = false
    nextTick(() => {
      reFresh.value = true
    })
  },
  { deep: false }
)
// 查看更多评论
const readMoreComment = (index: number, comment: CommentDto) => {
  api.CommentApi.listReplyByPage(comment.id, 1, 5).then((res) => {
    comment.reply = res.data.data!
    // 回复大于5条展示分页
    if (res.data.totalCount > 5) {
      pageRef.value[index].setPaging(true)
    }
    // 隐藏查看更多
    readMoreRef.value[index].style.display = "none"
  })
}
// 查看当前页的回复评论
const getCurrentPage = (current: number, index: number, commentId: number) => {
  api.CommentApi.listReplyByPage(commentId, current, 5).then((res) => {
    comments.value[index].reply = res.data.data!
  })
}
const handleReply = (index: number, target: CommentDto) => {
  replyRef.value.forEach((reply: any) => reply.setReply(false))
  const currentReply = replyRef.value[index]
  currentReply.commentReply.replyTo = target.id
  currentReply.commentReply.replyUser = target.userName
  currentReply.commentReply.resourceId = target.resourceId
  currentReply.commentReply.typ = target.typ
  currentReply.setReply(true)
  currentReply.setShowUserInfo(showUserinfo.value)
}
const fetchCommentList = () => {
  api.CommentApi.listCommentByPage(
    queryParams.value.resourceId!,
    queryParams.value.current,
    queryParams.value.size
  ).then((res) => {
    if (queryParams.value.current == 1) {
      comments.value = res.data.data!
    } else {
      comments.value.push(...res.data.data!)
    }
    queryParams.value.current++
    count.value = res.data.totalCount
    emit("getCommentCount", count.value)
  })
}
// 重新加载评论列表
const reloadComments = () => {
  queryParams.value.current = 1
  fetchCommentList()
}
// 重新加载回复评论
const reloadReplies = (index: number) => {
  api.CommentApi.listReplyByPage(comments.value[index].id, pageRef.value[index].crrent, 5).then((res) => {
    comments.value[index].reply = res.data.data!
    comments.value[index].replyCount++
    // 隐藏回复框
    replyRef.value[index].setReply(false)
    // 回复大于5条展示分页
    if (comments.value[index].replyCount > 5) {
      pageRef.value[index].setPaging(true)
    }
    // 隐藏查看更多
    readMoreRef.value[index].style.display = "none"
  })
}
onMounted(() => {
  fetchCommentList()
})
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";

.reply-title {
  display: flex;
  align-items: center;
  margin: 22px 0;
  padding-left: 10px;
  font-size: 20px;
  font-weight: 600;
  line-height: 40px;
}

.sub-reply-avatar {
  position: absolute;
  left: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

.reply-item {
  display: flex;
  padding-top: 1rem;

  .content-warp {
    flex: auto;
    margin-left: 0.6rem;
  }

  .bottom-line {
    border-bottom: 1px solid var(--grey-3);
    margin-top: 0.5rem;
  }
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  .user-name {
    font-size: 0.875rem;
    font-weight: 500;
    margin-right: 0.3125rem;
  }
}

.sub-reply-item {
  position: relative;
  padding: 8px 0 8px 33px;
  font-size: 15px;
  line-height: 24px;

  .sub-user-info {
    display: inline-flex;
    align-items: center;
    margin-right: 9px;
    line-height: 24px;
  }

  .sub-user-name {
    font-size: 13px;
    line-height: 24px;
  }
}

.reply-info {
  display: flex;
  align-items: center;
  margin-top: 0.125rem;
  font-size: 0.8125rem;
  color: #9499a0;

  .reply-time {
    margin-right: 15px;
    padding-top: 2px;
  }

  .reply-like {
    display: flex;
    align-items: center;
    margin-right: 17px;
    cursor: pointer;

    &:hover .like {
      color: var(--color-pink);
    }
  }

  .reply-btn {
    cursor: pointer;

    &:hover {
      color: var(--color-pink);
    }
  }
}

.reply-content {
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  font-size: 0.9375rem;
  line-height: 1.5;
  vertical-align: baseline;
}

.view-more {
  font-size: 13px;
  color: #9499a0;

  .view-more-btn {
    cursor: pointer;

    &:hover {
      color: var(--color-pink);
    }
  }
}
</style>
