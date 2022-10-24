<template>
  <NuxtLayout name="studio">
    <div class="content-studio" style="min-height: calc(100vh - 200px)">
      <div class="studio-banner bg03">
        <h2>{{ $t('projectList.banner.text') }}</h2>
        <p>{{ $t('projectList.banner.info') }}</p>
      </div>

      <div class="studio-all-game">
        <dl>
          <dt>
            <div class="input-search-default">
              <p><i class="uil uil-search"></i></p>
              <div>
                <input
                  type="text"
                  name=""
                  title="keywords"
                  :placeholder="$t('needSearchInput')"
                  @input="searchProject"
                  v-model="searchKeyword"
                />
              </div>
            </div>
          </dt>
          <dd>
            <NuxtLink
              id="gameUploadBtn"
              :to="$localePath('/project/upload')"
              class="btn-default ml20"
              ><i class="uil uil-plus"></i>{{ $t('gameUpload') }}</NuxtLink
            >
          </dd>
        </dl>

        <ul class="ag-title">
          <li>{{ $t('game.thumbnail') }}</li>
          <li class="game-title">
            {{ $t('game.title') }}
            <i
              v-if="isTitleSortAsc"
              class="uil uil-angle-up"
              style="font-size: 20px; cursor: pointer"
              @click="sortAscList('name'), (isTitleSortAsc = !isTitleSortAsc)"
            ></i>
            <i
              v-else
              class="uil uil-angle-down"
              style="font-size: 20px; cursor: pointer"
              @click="sortDescList('name'), (isTitleSortAsc = !isTitleSortAsc)"
            ></i>
          </li>
          <li>
            {{ $t('game.uploadDate') }}
            <i
              v-if="isDateSortAsc"
              class="uil uil-angle-up"
              style="font-size: 20px; cursor: pointer"
              @click="
                sortAscList('created_at'), (isDateSortAsc = !isDateSortAsc)
              "
            ></i>
            <i
              v-else
              class="uil uil-angle-down"
              style="font-size: 20px; cursor: pointer"
              @click="
                sortDescList('created_at'), (isDateSortAsc = !isDateSortAsc)
              "
            ></i>
          </li>
          <li>
            {{ $t('game.status') }}
            <i
              v-if="isStageSortAsc"
              class="uil uil-angle-up"
              style="font-size: 20px; cursor: pointer"
              @click="sortAscList('stage'), (isStageSortAsc = !isStageSortAsc)"
            ></i>
            <i
              v-else
              class="uil uil-angle-down"
              style="font-size: 20px; cursor: pointer"
              @click="sortDescList('stage'), (isStageSortAsc = !isStageSortAsc)"
            ></i>
          </li>
          <li>
            {{ $t('game.playCnt') }}
            <i
              v-if="isPlayCountSortAsc"
              class="uil uil-angle-up"
              style="font-size: 20px; cursor: pointer"
              @click="
                sortAscListByGame('count_start'),
                  (isPlayCountSortAsc = !isPlayCountSortAsc)
              "
            ></i>
            <i
              v-else
              class="uil uil-angle-down"
              style="font-size: 20px; cursor: pointer"
              @click="
                sortDescListByGame('count_start'),
                  (isPlayCountSortAsc = !isPlayCountSortAsc)
              "
            ></i>
          </li>
          <li>
            {{ $t('game.likeCnt') }}
            <i
              v-if="isLikeCountSortAsc"
              class="uil uil-angle-up"
              style="font-size: 20px; cursor: pointer"
              @click="
                sortAscListByGame('count_heart'),
                  (isLikeCountSortAsc = !isLikeCountSortAsc)
              "
            ></i>
            <i
              v-else
              class="uil uil-angle-down"
              style="font-size: 20px; cursor: pointer"
              @click="
                sortDescListByGame('count_heart'),
                  (isLikeCountSortAsc = !isLikeCountSortAsc)
              "
            ></i>
          </li>
        </ul>

        <div v-if="isPending">
          <ul>
            <ClipLoader
              :color="'#ff6e17'"
              :size="'30px'"
              style="
                margin: 0 auto;
                border-radius: 10px;
                height: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            />
          </ul>
        </div>
        <template v-else-if="projects.length">
          <div>
            <ul
              v-for="project in projects"
              :key="project.id"
              @click="goToProjectPage(project.id)"
            >
              <li>
                <span> {{ $t('game.thumbnail') }}: </span>

                <p
                  :style="`background: url(${
                    project.picture_webp ||
                    project.picture ||
                    project.picture2 ||
                    '/images/default.png'
                  }?t=${Date.now()}) center center / cover no-repeat; background-size: cover;`"
                ></p>
              </li>
              <li>
                <span> {{ $t('game.title') }}: </span> &nbsp;&nbsp;{{
                  project.name
                }}
              </li>

              <li>
                <span> {{ $t('game.uploadDate') }}: </span> &nbsp;&nbsp;
                {{ dayjs(project.created_at).format('YYYY-MM-DD') }}
              </li>
              <li>
                <span> {{ $t('game.status') }}: </span> &nbsp;&nbsp;
                {{ eGameStage[project.stage] }}
              </li>
              <li>
                <span> {{ $t('game.playCnt') }}: </span> &nbsp;&nbsp;{{
                  project.game?.count_start
                }}
              </li>
              <li>
                <span> {{ $t('game.likeCnt') }}:</span> &nbsp;&nbsp;{{
                  project.game?.count_heart
                }}
              </li>
            </ul>
          </div>

          <div class="studio-pagination">
            <dl>
              <dd>{{ currPage }}-{{ totalPage }} of {{ totalCount }}</dd>
              <dd>
                <span
                  @click="firstPage()"
                  :class="[currPage === 1 && 'disabled', 'prev-btn']"
                >
                  <i class="uil uil-angle-double-left"></i>
                </span>
                <span
                  @click="prevPage()"
                  :class="[currPage === 1 && 'disabled', 'prev-btn']"
                  ><i class="uil uil-angle-left"></i></span
                >&nbsp;&nbsp;
                <span
                  @click="nextPage()"
                  :class="[currPage === totalPage && 'disabled', 'next-btn']"
                >
                  <i class="uil uil-angle-right"></i
                ></span>
                <span
                  @click="lastPage()"
                  :class="[currPage === totalPage && 'disabled', 'next-btn']"
                >
                  <i class="uil uil-angle-double-right"></i>
                </span>
              </dd>
            </dl>
          </div>
        </template>

        <div v-else>
          <ul>
            <li style="width: 100%">{{ $t('no.game') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import _ from 'lodash'
import dayjs from 'dayjs'
import { IProject, eGameStage } from '~~/types'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()
const $router = useRouter()
const { $localePath } = useNuxtApp()

definePageMeta({
  middleware: 'auth',
})
useHead({
  title: `${t('seo.project.list.title')} | Zempie Studio`,
  link: [
    {
      rel: 'alternate',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
      hreflang: locale,
    },
    {
      rel: 'canonical',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
    },
  ],
  meta: [
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.fullPath}`,
    },
    {
      property: 'og:site_name',
      content: 'Zempie',
    },
    {
      name: 'og:type',
      content: 'website',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
    {
      name: 'description',
      content: `${t('seo.project.list.desc')}`,
    },
    {
      property: 'og:title',
      content: `${t('seo.project.list.title')}`,
    },
    {
      property: 'og:description',
      content: `${t('seo.project.list.description')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})

const projects = ref([])
const isPending = ref(true)

const searchKeyword = ref('')

const isTitleSortAsc = ref(true)
const isDateSortAsc = ref(true)
const isStageSortAsc = ref(true)
const isPlayCountSortAsc = ref(true)
const isLikeCountSortAsc = ref(true)

const PAGE_SIZE = 10
const currPage = ref(1)
const totalCount = ref(0)
const originProjects = ref()
const totalPage = computed(() => Math.ceil(totalCount.value / PAGE_SIZE))

onMounted(async () => {
  fetch()

  isPending.value = false
})

async function fetch() {
  const { data, pending } = await useCustomFetch<{ result: IProject[] }>(
    '/studio/project',
    getStudioFetchOptions('get', true)
  )

  if (data.value) {
    originProjects.value = _.cloneDeep(data.value.result)
    totalCount.value = data.value.result.length
    projects.value = data.value.result
    pagingByClient()
  }
}

const searchProject = _.debounce(() => {
  const { result } = data.value as any

  if (searchKeyword.value.length) {
    const project = result.filter((project: IProject) => {
      return project.name?.includes(searchKeyword.value)
    })
    projects.value = project
    totalCount.value = project.length
  } else {
    projects.value = (data.value as any).result
    pagingByClient()
  }
}, 300)

function nextPage() {
  currPage.value += 1
  pagingByClient()
}
function prevPage() {
  currPage.value -= 1
  pagingByClient()
}

function firstPage() {
  currPage.value = 1
  pagingByClient()
}

function lastPage() {
  currPage.value = totalPage.value
  pagingByClient()
}
function pagingByClient() {
  document.documentElement.scrollTop = 0

  const start = (currPage.value - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE - 1

  projects.value = originProjects.value.slice(start, end)
}

function goToProjectPage(id: number) {
  setProjectInfo(id)
  useProject().setStepTwoOnEdit()
  $router.push($localePath(`/project/${id}`))
}

function setProjectInfo(id: number) {
  const project = projects.value.find((project: IProject) => project.id === id)
  useProject().setProjectInfo(project)
}

function sortAscList(key: string) {
  projects.value.sort((a, b) => {
    return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
  })
}

function sortDescList(key: string) {
  projects.value.sort((a, b) => {
    return a[key] > b[key] ? -1 : a[key] < b[key] ? 1 : 0
  })
}

function sortAscListByGame(key: string) {
  projects.value.sort((a, b) => {
    return a.game[key] < b.game[key] ? -1 : a.game[key] > b.game[key] ? 1 : 0
  })
}

function sortDescListByGame(key: string) {
  projects.value.sort((a, b) => {
    return a.game[key] > b.game[key] ? -1 : a.game[key] < b.game[key] ? 1 : 0
  })
}
</script>

<style scoped lang="scss">
//pagination
.next-btn {
  cursor: pointer;
}
.prev-btn.disabled,
.next-btn.disabled {
  pointer-events: none;
  opacity: 0.5;
}

//transition으로 인한 css 수정
.studio-all-game {
  width: 1200px;
  margin: 30px auto;
  background-color: #fff;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
  border-radius: 10px;

  div {
    ul {
      &:hover {
        background-color: #f9f9f9;
        cursor: pointer;
      }
      li {
        &:nth-child(5),
        &:nth-child(6) {
          width: 10%;
        }
        p {
          width: 70px;
          height: 70px;
          border-radius: 5px;
          margin: auto;
        }
      }
    }
  }

  dl {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 30px 30px;
  }

  ul {
    display: flex;
    width: 100%;
    align-items: center;
    text-align: center;
    border-bottom: 1px solid #f1f1f1;
    transition: all 0.4s ease-in-out;

    li {
      padding: 25px 0px;
      font-weight: 500;
      font-size: 16px;
      line-height: 16px;
      color: #333;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      &:nth-child(1) {
        width: 15%;
      }

      &:nth-child(2) {
        width: 35%;
        text-align: left;
      }

      &:nth-child(3) {
        width: 15%;
      }

      &:nth-child(4) {
        width: 15%;
      }

      span {
        display: none;
      }
    }

    &.ag-title {
      background-color: #f9f9f9;
      padding: 0px;

      li {
        font-weight: 500;
        font-size: 14px;
      }
    }
  }
}

@media all and (max-width: 479px) {
  .studio-all-game {
    width: 90%;
    margin: 20px auto;
    padding: 0 15px;
  }

  .studio-all-game > dl {
    flex-wrap: wrap;
    padding: 20px;
  }

  .studio-all-game > dl dt {
    width: 100%;
  }

  .studio-all-game > dl dd {
    width: 100%;
    margin-top: 10px;
  }

  .studio-all-game > dl dd a {
    width: 100%;
  }

  .studio-all-game > ul.ag-title {
    display: none;
  }

  .studio-all-game > div > ul {
    display: block;
    margin-top: 10px;
    padding: 15px 30px;
    border: 2px solid #f1f1f1;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.05);
  }

  .studio-all-game > div > ul > li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 5px 0px;
    font-size: 13px;
  }

  .studio-all-game > div > ul > li {
    width: 100% !important;
  }

  .studio-all-game > div > ul > li > p {
    margin: 0 0 0 15px;
  }

  .studio-all-game > div > ul > li > span {
    display: block;
    font-size: 14px;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .studio-all-game {
    width: 470px;
    margin: 20px auto;
    padding: 0 20px;

    .ag-title {
      font-size: 12px;
    }
  }

  .studio-all-game > dl {
    flex-wrap: wrap;
    padding: 20px;
  }

  .studio-all-game > dl dt {
    width: 100%;
  }

  .studio-all-game > dl dd {
    width: 100%;
    margin-top: 10px;
  }

  .studio-all-game > dl dd a {
    width: 100%;
  }

  .studio-all-game > ul.ag-title {
    display: none;
  }

  .studio-all-game > div > ul {
    display: block;
    margin-top: 15px;
    padding: 15px 30px;
    border: 2px solid #f1f1f1;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.05);
  }

  .studio-all-game > div > ul > li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 0px;
    font-size: 14px;
  }

  .studio-all-game > div > ul > li {
    width: 100% !important;
  }

  .studio-all-game > div > ul > li > p {
    margin: 0 0 0 15px;
  }

  .studio-all-game > div > ul > li > span {
    display: block;
    font-size: 15px;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .studio-all-game {
    width: 750px;

    .ag-title {
      li {
        font-size: 12px !important;
      }
    }
  }

  .studio-all-game > div > ul > li {
    padding: 20px 0px;
    font-size: 15px;
  }

  .studio-all-game > div > ul > li > p {
    width: 60px;
    height: 60px;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .studio-all-game {
    width: 970px;
  }
}

@media all and (min-width: 1200px) {
}
</style>
