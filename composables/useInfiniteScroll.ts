import { type Ref, ref, onMounted, onBeforeUnmount } from 'vue'

interface UseInfiniteScrollOptions<T> {
  threshold?: number
  initialPage?: number
  initialData?: T[]
}

type FetchFn<T> = (page: number) => Promise<T[]>

export function useInfiniteScroll<T>(
  fetchFn: FetchFn<T>,
  options: UseInfiniteScrollOptions<T> = {}
) {
  const {
    threshold = 300,
    initialPage = 1,
    initialData = []
  } = options

  const items = ref<T[]>(initialData)
  const page = ref(initialPage)
  const loading = ref(false)
  const reachedEnd = ref(false)
  const showBackToTop = ref(false)

  const loadMore = async () => {
    if (loading.value || reachedEnd.value) return
    loading.value = true

    try {
      const result = await fetchFn(page.value)
      if (result.length) {
        (items as Ref<T[]>).value.push(...result)
        page.value++
      } else {
        reachedEnd.value = true
      }
    } catch (err) {
      console.error('Infinite scroll error:', err)
    } finally {
      loading.value = false
    }
  }

  const handleScroll = () => {
    const scrollTop = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    if (scrollTop + windowHeight >= documentHeight - threshold) {
      loadMore()
    }

    showBackToTop.value = scrollTop > 500
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    items,
    loading,
    showBackToTop,
    scrollToTop,
    loadMore,
  }
}
