import router from "@/router"
import NProgress from "nprogress"

NProgress.configure({
  easing: "ease",
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})
router.afterEach(() => {
  NProgress.done()
})
