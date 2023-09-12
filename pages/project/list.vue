<template>
  <NuxtLayout name="studio">
    <div class="content-studio">
      <div class="studio-banner bg03">
        <h2>{{ $t('projectList.banner.text') }}</h2>
        <p>{{ $t('projectList.banner.info') }}</p>
      </div>

      <div class="mogera-info">
        <p><span class="mogera-color">Mogera(모게라)</span>{{ $t('mogera.info1') }}</p>
        <p>{{ $t('mogera.info2') }} <span @click="moveMogera" class="mogera-color pointer underline">{{ $t('mogera.cta')
        }} ></span></p>
      </div>

      <div class="studio-all-game">
        <dl>
          <dt>
            <div class="input-search-default">
              <p class="flex items-center"><i>
                  <IconSearch />
                </i></p>
              <div>
                <input type="text" name="" title="keywords" :placeholder="$t('needSearchInput')" @input="searchProject"
                  v-model="searchKeyword" />
              </div>
            </div>
          </dt>
          <dd>
            <NuxtLink id="gameUploadBtn" :to="$localePath('/project/upload')" class="btn-default ml20"><i
                class="uil uil-plus"></i>{{ $t('gameUpload') }}</NuxtLink>
          </dd>
        </dl>

        <ul class="ag-title">
          <li>{{ $t('game.thumbnail') }}</li>
          <li class="game-title  row items-center">
            {{ $t('game.title') }}

            <i v-if="isTitleSortAsc" style="font-size: 20px; cursor: pointer"
              @click="sortAscList('name'), (isTitleSortAsc = !isTitleSortAsc)">
              <IconAngleUp />
            </i>
            <i v-else style="font-size: 20px; cursor: pointer"
              @click="sortDescList('name'), (isTitleSortAsc = !isTitleSortAsc)">
              <IconAngleDown />
            </i>
          </li>
          <li class="row items-center content-center">
            {{ $t('game.uploadDate') }}
            <i v-if="isDateSortAsc" style="font-size: 20px; cursor: pointer" @click="
              sortAscList('created_at'), (isDateSortAsc = !isDateSortAsc)
              ">
              <IconAngleUp />
            </i>
            <i v-else style="font-size: 20px; cursor: pointer" @click="
              sortDescList('created_at'), (isDateSortAsc = !isDateSortAsc)
              ">
              <IconAngleDown />
            </i>
          </li>
          <li class="row items-center content-center">
            {{ $t('game.status') }}
            <i v-if="isStageSortAsc" style="font-size: 20px; cursor: pointer"
              @click="sortAscList('stage'), (isStageSortAsc = !isStageSortAsc)">
              <IconAngleUp />
            </i>
            <i v-else style="font-size: 20px; cursor: pointer"
              @click="sortDescList('stage'), (isStageSortAsc = !isStageSortAsc)">
              <IconAngleDown />
            </i>
          </li>
          <li class="row items-center content-center">
            {{ $t('game.playCnt') }}
            <i v-if="isPlayCountSortAsc" style="font-size: 20px; cursor: pointer" @click="
              sortAscListByGame('count_start'),
              (isPlayCountSortAsc = !isPlayCountSortAsc)
              ">
              <IconAngleUp />
            </i>
            <i v-else style="font-size: 20px; cursor: pointer" @click="
              sortDescListByGame('count_start'),
              (isPlayCountSortAsc = !isPlayCountSortAsc)
              ">
              <IconAngleDown />
            </i>
          </li>
          <li class="row items-center content-center">
            {{ $t('game.likeCnt') }}
            <i v-if="isLikeCountSortAsc" style="font-size: 20px; cursor: pointer" @click="
              sortAscListByGame('count_heart'),
              (isLikeCountSortAsc = !isLikeCountSortAsc)
              ">
              <IconAngleUp />
            </i>
            <i v-else style="font-size: 20px; cursor: pointer" @click="
              sortDescListByGame('count_heart'),
              (isLikeCountSortAsc = !isLikeCountSortAsc)
              ">
              <IconAngleDown />
            </i>
          </li>
        </ul>

        <div v-if="isPending">
          <ul>
            <ClipLoader :color="'#ff6e17'" :size="'30px'" style="
                        margin: 0 auto;
                        border-radius: 10px;
                        height: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      " />
          </ul>
        </div>
        <template v-else-if="projects.length">
          <div>
            <ul v-for="project in projects" :key="project.id" @click="goToProjectPage(project.id)">
              <li>
                <span> {{ $t('game.thumbnail') }}: </span>

                <p :style="`background: url(${project.picture_webp ||
                  project.picture ||
                  project.picture2 ||
                  '/images/default.png'
                  }?t=${Date.now()}) center center / cover no-repeat; background-size: cover;`"></p>
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
              <dd class="flex items-center">
                <span @click="firstPage()" :class="[currPage === 1 && 'disabled', 'prev-btn']">
                  <i>
                    <IconAngleDoubleLeft />
                  </i>
                </span>
                <span @click="prevPage()" :class="[currPage === 1 && 'disabled', 'prev-btn']">
                  <i>
                    <IconAngleLeft />
                  </i></span>&nbsp;&nbsp;
                <span @click="nextPage()" :class="[currPage === totalPage && 'disabled', 'next-btn']">
                  <i>
                    <IconAngleRight />
                  </i></span>
                <span @click="lastPage()" :class="[currPage === totalPage && 'disabled', 'next-btn']">
                  <i>
                    <IconAngleDoubleRight />
                  </i>
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
import { IProject, eGameStage, eGameType } from '~~/types'
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared'
import { onBeforeRouteLeave } from 'vue-router';

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()
const $router = useRouter()
const { $localePath } = useNuxtApp()

definePageMeta({
  middleware: 'auth',
  layout: 'header-only',
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
const fUser = computed(() => useUser().user.value.fUser)

shared.createHeadMeta(t('seo.project.list.title'), t('seo.project.list.desc'))


onMounted(async () => {
  useRouterLeave()
  fetch()
  isPending.value = false
})

async function fetch() {
  const { data, pending } = await useCustomAsyncFetch<{ result: IProject[] }>(
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

  if (searchKeyword.value.length) {
    const project = projects.value.filter((project: IProject) => {
      return project.name?.includes(searchKeyword.value)
    })
    projects.value = project
    totalCount.value = project.length
  } else {
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


async function moveMogera() {
  const { data } = await useCustomAsyncFetch<{ result: { token: string } }>("/create/token", getZempieFetchOptions("post", true))

  if (data.value) {
    const { result } = data.value
    if (result) {
      window.open(`${config.MOGERA_URL}?key=${result.token}`, "_blank");
    }

  }
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
  useProject().setStepThreeOnEdit()
  $router.push($localePath(`/project/${id}`))
}

function setProjectInfo(id: number) {
  const project = projects.value.find((project: IProject) => project.id === id)
  useProject().setProjectInfo(project)
}

function sortAscList(key: string) {
  originProjects.value.sort((a, b) => {
    return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
  })
  pagingByClient()

}

function sortDescList(key: string) {
  originProjects.value.sort((a, b) => {
    return a[key] > b[key] ? -1 : a[key] < b[key] ? 1 : 0
  })
  pagingByClient()

}

function sortAscListByGame(key: string) {
  originProjects.value.sort((a, b) => {
    return a.game[key] < b.game[key] ? -1 : a.game[key] > b.game[key] ? 1 : 0
  })
  pagingByClient()

}

function sortDescListByGame(key: string) {
  originProjects.value.sort((a, b) => {
    return a.game[key] > b.game[key] ? -1 : a.game[key] < b.game[key] ? 1 : 0
  })
  pagingByClient()
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

.mogera-color {
  color: #b43df9;
}

.mogera-info {
  width: 1200px;
  background-color: #fff;
  margin: 30px auto;
  border-radius: 10px;
  border-left: 10px solid #b43df9;
  padding: 20px 10px;

  p {
    padding-left: 30px;
  }

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
        font-size: 16px;
      }
    }
  }
}

@media all and (max-width: 479px) {
  .mogera-info {
    width: 90%;
  }

  .studio-all-game {
    width: 90%;
    margin: 20px auto;
    padding: 0 15px;

    dl {
      flex-wrap: wrap;
      padding: 20px;

      dt {
        width: 100%;
      }

      dd {
        width: 100%;
        margin-top: 10px;

        .btn-default {
          margin-left: 0px !important;
        }
      }
    }
  }


  .studio-all-game>dl dd a {
    width: 100%;
  }

  .studio-all-game>ul.ag-title {
    display: none;
  }

  .studio-all-game>div>ul {
    display: block;
    margin-top: 10px;
    padding: 15px 30px;
    border: 2px solid #f1f1f1;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.05);
  }

  .studio-all-game>div>ul>li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 5px 0px;
    font-size: 13px;
  }

  .studio-all-game>div>ul>li {
    width: 100% !important;
  }

  .studio-all-game>div>ul>li>p {
    margin: 0 0 0 15px;
  }

  .studio-all-game>div>ul>li>span {
    display: block;
    font-size: 14px;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {

  .mogera-info {
    width: 470px;
  }

  .studio-all-game {
    width: 470px;
    margin: 20px auto;
    padding: 0 20px;

    dl {
      flex-wrap: wrap;
      padding: 20px;

      dt {
        width: 100%;
      }

      dd {
        width: 100%;
        margin-top: 10px;

        .btn-default {
          margin-left: 0px !important;
        }
      }
    }

    .ag-title {
      font-size: 12px;
    }
  }


  .studio-all-game>dl dd a {
    width: 100%;
  }

  .studio-all-game>ul.ag-title {
    display: none;
  }

  .studio-all-game>div>ul {
    display: block;
    margin-top: 15px;
    padding: 15px 30px;
    border: 2px solid #f1f1f1;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.05);
  }

  .studio-all-game>div>ul>li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 0px;
    font-size: 14px;
  }

  .studio-all-game>div>ul>li {
    width: 100% !important;
  }

  .studio-all-game>div>ul>li>p {
    margin: 0 0 0 15px;
  }

  .studio-all-game>div>ul>li>span {
    display: block;
    font-size: 15px;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .mogera-info {
    width: 750px;
  }

  .studio-all-game {
    width: 750px;

    .ag-title {
      li {
        font-size: 12px !important;
      }
    }
  }

  .studio-all-game>div>ul>li {
    padding: 20px 0px;
    font-size: 15px;
  }

  .studio-all-game>div>ul>li>p {
    width: 60px;
    height: 60px;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {

  .studio-all-game,
  .mogera-info {
    width: 970px;
  }
}

@media all and (min-width: 1200px) {}
</style>
