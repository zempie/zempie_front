<template>
    <li class="tap-list" v-if="feed">
        <dl class="tapl-title">
            <dt>
                <dl>
                    <dt>
                        <UserAvatar :user="feed.user" :tag="'span'"></UserAvatar>
                    </dt>

                    <dd v-if="feed.user && feed.user.name">
                        <h2>{{ feed.user && feed.user.name }} uploaded a {{ feed.post_type }} post</h2>
                        <p><i class="uis uis-clock" style="color:#c1c1c1;"></i> {{ dateFormat(feed.createdAt) }}</p>

                    </dd>
                    <dd v-else>
                        <h2>{{ $t('feed.noUser.post') }}</h2>
                        <p><i class="uis uis-clock" style="color:#c1c1c1;"></i> {{ dateFormat(feed.createdAt) }}</p>

                    </dd>
                </dl>
            </dt>
            <dd v-if="feed.user && feed.user.name">
                <dropdown-menu :overlay="false" class="tapl-more-dropdown"
                               :isOpen="isOpenReportModal" @closed="isOpenReportModal= false;"
                >
                    <a class="btn-circle-none pt6" slot="trigger" @click=" isOpenReportModal= !isOpenReportModal"><i
                        class="uil uil-ellipsis-h font25"></i></a>
                    <div slot="body" class="more-list fixed">
                        <template v-if="user && (user.id === (feed.user && feed.user.id))">
                            <a @click="openEdit">{{ $t('feed.edit') }}</a>
                            <a @click="deletePost">{{ $t('feed.delete') }}</a>

                        </template>
                        <template v-else>
                            <router-link :to="`/${$i18n.locale}/channel/${feed.user&&feed.user.channel_id}/timeline`">
                                {{ $t('visit.userChannel') }}
                            </router-link>
                            <a v-if="user" @click="report">{{ $t('post.report') }}</a>
                            <a v-if="user" @click="userReportModalOpen">{{ $t('post.report') }}유저 신고하기</a>
                        </template>
                    </div>
                </dropdown-menu>
            </dd>
        </dl>

        <div>
            <div class="tapl-content" v-html="feed.content" @click="contentClicked" ref="contentDiv"></div>
            <!-- 더보기 -->
            <div v-if="isOverflow" class='gradient'></div>
        </div>

        <div v-if="isOverflow" class="more-container">
            <span><hr class="dot-line"/></span><a @click="moreView">
            {{ $t('moreView') }} </a><span><hr class="dot-line"/></span>
        </div>

        <div v-if="!isOverflow && isMoreView" class="more-container">
            <span><hr class="dot-line"/></span><a @click="closeView">{{ $t('closeView') }} </a><span><hr
            class="dot-line"/></span>
        </div>
        <!-- /더보기 -->

        <template v-if="attachedFile && feed.post_type === 'SNS'">

            <template v-if="attachedFile.length === 1 && attachedFile[0].type === 'image'">
                <img style="height: 88%;
                             margin: 0 auto;
                             display: flex;" :src="attachedFile[0].url"
                     class="feed-img mt-3"/>
            </template>
            <template v-else>
                <div v-for="file in attachedFile">
                    <div class="video" v-if="file.type === 'video'">
                        <video
                            width="100%"
                            height="240"
                            controls
                            :src="file.url"
                        ></video>
                    </div>

                    <div class="audio" v-if="file.type === 'sound'">

                        <audio controls :src="file.url"></audio>
                        <p>{{ file.name }}</p>
                    </div>
                </div>
                <swiper class="swiper" :options="swiperOption" style="height: 350px;"
                        v-if="attachedFile.length > 0 && attachedFile[0].type === 'image'">
                    <template v-for="file in attachedFile">
                        <swiper-slide>
                            <img style="height: 88%;
                             margin: 0 auto;
                             display: flex;" v-if="file.type === 'image'" :src="file.url"
                                 class="feed-img mt-3"/>
                        </swiper-slide>

                    </template>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </template>
        </template>


        <ul class="tapl-option">
            <li>
                <ul>
                    <LikeBtn :feed="feed"></LikeBtn>
                    <li @click="openComments"><i class="uil uil-comment-alt-dots comment-icon"
                                                 style="font-size:22px;"></i>&nbsp; {{ commentCnt }}
                    </li>
                    <!--                    <li><i class="uil uil-eye" style="font-size:22px;"></i>&nbsp;680</li>-->
                    <li><a @click="copyUrl"><i class="uil uil-share-alt" style="font-size:20px;"></i></a></li>
                </ul>
            </li>
            <!--            <li><router-link to="#"><i class="uil uil-bookmark" style="font-size:24px; color:#ff6e17;"></i></router-link></li>-->
        </ul>

        <div v-show="isOpenedComments"  :class="['tapl-comment', isOpenedComments ? 'open' : 'close']"  :key="Date.now()">
            <ul @scroll="scrollCheck">

                <li v-for="comment in comments" :key="comment.id">
                    <Comment :comment="comment" :editContent="comment.content" :postId="feed.id"
                             @editDone="editDone"/>
                </li>
            </ul>
            <CommentInput
                :postId="feed.id"
                @sendComment="editDone"
                @updateComment="updateDone"/>
        </div>




    </li>

</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

import Post from "@/components/timeline/_post.vue";
import TiptapSns from "@/components/timeline/_tiptapSns.vue";
import {dateFormat} from "@/script/moment";
import {AxiosError, AxiosResponse} from "axios";
import LikeBtn from "@/components/timeline/_likeBtn.vue";
import UserAvatar from "@/components/user/_userAvatar.vue";

import {mapGetters} from "vuex";
import {scrollDone} from "@/script/scrollManager";
import {execCommandCopy} from "@/script/util";
import Toast from "@/script/message";
import CommentInput from "@/components/comment/_commentInput.vue";
import Comment from "@/components/timeline/Comment.vue";
import {Swiper, SwiperSlide} from "vue-awesome-swiper";

@Component({
    components: {
        Post,
        TiptapSns,
        LikeBtn,
        UserAvatar,
        CommentInput,
        Swiper,
        SwiperSlide,
        Comment
    },
    computed: {...mapGetters(["user"])},
})
export default class Feed extends Vue {
    @Prop() feed!: any;

    toast = new Toast();
    isOpenedComments: boolean = false;
    likeList: any = [];

    attachedFile: any = '';
    hashtags: any = '';

    originImg: string = "";

    limit: number = 5;
    offset: number = 0;
    sort: string = '';

    isAddData: boolean = false;
    comments: any = [];
    user!: any;
    isOpenReportModal = false;

    isOverflow: boolean | null = null;
    isMoreView: boolean | null = null;
    currScroll: number = 0;

    commentCnt: number = 0;

    swiperOption = {
        pagination: {
            el: '.swiper-pagination'
        }
    }

    mounted() {
        this.attachedFile = Array.isArray(this.feed.attatchment_files) ? this.feed.attatchment_files : JSON.parse(this.feed.attatchment_files)
        this.hashtags = this.feed.hashtags;
        this.checkOverflow()
        this.commentCnt = this.feed?.comment_cnt;
        // this.likeListFetch();
    }

    scrollCheck(e) {
        console.log(e.tartget)
        if (scrollDone(e.target)) {

            this.offset += this.limit;
            this.commentFetch();
        }
    }

    dateFormat(date: number) {
        return dateFormat(date);
    }


    openComments() {

        this.commentInit();
        this.isOpenedComments = !this.isOpenedComments;

        if (this.isOpenedComments && this.feed.comment_cnt > 0) {
            this.comments = []
            this.commentFetch()
        }

    }

    likeListFetch() {
        const obj = {
            post_id: this.feed.id,
            limit: this.limit,
            offset: this.offset
        }
        this.$api.likeList(obj)
            .then((res: AxiosResponse) => {
                this.likeList = res;
            })
            .catch((err: AxiosError) => {

            })


    }


    copyUrl() {
        execCommandCopy(`${this.$store.getters.communityUrl}feed/${this.feed.id}`)
        this.toast.clear();
        this.toast.successToast(`${this.$t('copied.clipboard')}`)
    }


    //post
    contentClicked(e: any) {
        // if (e.target.matches("img")) {
        //     this.originImg = e.target.src;
        //     // this.$modal.show('originImgModal')
        //     this.$emit('originImg', this.originImg)
        // }
        // else if (e.target.matches(".hashtag")) {
        //     this.$router.push(
        //         `/search?hashtag=${e.target.attributes["data-id"].nodeValue}`
        //     );
        // }
        // else if (e.target.matches(".mention")) {
        //     this.$router.push(
        //         `/channel/${e.target.attributes["channel-id"].nodeValue}/timeline`
        //     );
        // }
        // else {
        this.$router.push(`/${this.$i18n.locale}/feed/${this.feed.id}`);
        // }
    }

    moveHashtag(hashtag: string) {
        this.$router.push(`/${this.$i18n.locale}/search?hashtag=${hashtag}`)
    }

    commentFetch() {
        const obj = {
            limit: this.limit,
            offset: this.offset,
            sort: this.sort
        }
        this.$api.comments(this.feed.id, obj)
            .then((res: any) => {
                if (this.isAddData) {
                    if (res.result.length > 0) {
                        this.comments = [...this.comments, ...res.result]
                    }
                    else {
                        // console.log('no data')
                    }
                }
                else {
                    this.comments = res.result;
                    this.isAddData = true
                }
            })
            .catch((err: AxiosError) => {

            })
            .finally(() => {

            })
    }


    openEdit() {
        this.$modal.show('modalPost')
        this.$store.commit('feed', this.feed)
    }

    pinPost() {
        console.log("pinned");
    }

    closeModal() {
        this.$modal.hide('noUser')

    }

    deletePost() {
        this.$emit('deleteFeed', this.feed.id)
        this.$modal.show('deleteModal')

    }

    report() {
        this.$emit('reportPost', this.feed.id)
        this.isOpenReportModal = !this.isOpenReportModal
        this.$modal.show('modalReport')
    }

    /**
     * 더보기
     * */
    checkOverflow() {
        const ref = this.$refs.contentDiv;

        if ((ref as any).clientHeight >= 450) {
            this.isOverflow = true;
        }
    }

    moreView() {
        const ref = this.$refs.contentDiv;
        (ref as any).style.maxHeight = '100%';
        this.isOverflow = false;
        this.isMoreView = true;
        this.currScroll = document.documentElement.scrollTop;

    }

    closeView() {
        const ref = this.$refs.contentDiv;
        (ref as any).style.maxHeight = '500px';
        this.isOverflow = true;
        this.isMoreView = false;
        window.scrollTo(0, this.currScroll);
    }

    /**
     * 댓글
     * */
    commentInit() {
        this.comments = [];
        this.limit = 5;
        this.offset = 0;
        this.sort = '';
    }

    deleteComment(commentId: string) {
        this.commentCnt--;
        this.commentInit();
        this.$api.deleteComment(this.feed.id, commentId)
            .then((res: AxiosResponse) => {
                this.commentFetch()
            })
            .catch((err: AxiosError) => {

            })
    }

    editDone(comment:any) {
        this.commentCnt++;
        this.comments = [comment, ...this.comments]

        // this.commentInit();
        // this.commentFetch()
    }

    updateDone() {
        // this.commentInit();
        // this.commentFetch()
    }

    /**
     * 유저 신고
     */

    userReportModalOpen() {
        this.$emit('reportUser', this.feed.user.id)
        // this.isOpenReportModal = !this.isOpenReportModal
        this.$modal.show('modalUserReport')
    }

    userReport(){
        console.log("?")
    }
}
</script>

}

<style lang="scss" scoped>

// transition

.component-fade-enter-active,
.component-fade-leave-active {
    transition: opacity 0.5s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
    opacity: 0;
}

// /transition

// 더보기
.gradient {
    background: linear-gradient(to top, #fff, #ededed00);
    height: 50px;
    width: 100%;
    position: relative;
    bottom: 50px;
}

.more-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 20px 0 20px;

    span, a {
        flex: 1;
    }

    a {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .dot-line {
        border-top: 1px dashed;
    }
}

// /더보기

.tapl-content {
    word-break: break-all;

}

pre {
    overflow: auto;
    background: #0D0D0D;
    color: #fff;
    font-family: JetBrainsMono, monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
}

pre code {
    color: inherit;
    padding: 0;
    background: none;
    font-size: .8rem;
}

.tapl-comment > ul {
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
}

.like-icon:hover, .comment-icon:hover {
    cursor: pointer;
}

.feed-img {
    max-width: 100%;
}

.content-grid {
    transform: translate(199.5px, 0px);
    transition: transform 0.4s ease-in-out 0s;
}

.icon-thumbs-up.active,
.icon-comment.active {
    fill: #4ff461;
    opacity: 1;
}

.thumbs-up.active,
.post-option-text.active {
    color: #fff;
}

.reaction {
    top: 5px;
}

#copied {
    z-index: 999999;
}

.checkbox-wrap input[type="checkbox"]:checked + .checkbox-box .icon-check,
.checkbox-wrap input[type="radio"]:checked + .checkbox-box .icon-check {
    fill: #ffffff;
}

.checkbox-wrap .checkbox-box .icon-check {
    fill: transparent;
    transition: fill 0.2s ease-in-out;
}

.content-actions {
    height: 92px;
    flex-direction: column;

    .meta-line {
        margin-right: 10px;
        width: 100%;
        margin-top: 16px;
    }
}

.post-icon-wrap {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.icon-pinned {
    fill: #616a82;
}

.icon-pinned.active {
    fill: #f39800;
    opacity: 1;
}

.orgin-img-modal {
    .modal-dialog {
        max-width: 100% !important;
    }
}

.feed-img {
    padding: 20px 20px 0 20px;
}

.video {
    width: 100%;
    padding: 20px 20px 0 20px;
}

.audio {
    margin: 20px 20px 0 20px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    background: #f5f5f5;
    flex-direction: column;

    audio {
        width: 100%;
    }

    p {
        width: 100%;
        height: 30px;
        padding-left: 20px;
    }
}

.swiper-button-next,
.swiper-button-prev {
    --swiper-navigation-color: #999;
    --swiper-navigation-size: 20px;

    &:hover {
        --swiper-navigation-color: #FF6216;
    }
}

.swiper-wrapper div {
    width: 100%;
}

.tapl-content {
    overflow: hidden;
    min-height: 100px;
    max-height: 500px;
}

.btn-default {
    border-radius: 10px !important;
    display: block !important;
    margin: 0 auto !important;
}
.tapl-comment.close{
    animation: fade-out 1s;
    animation-fill-mode: forwards;
}
.tapl-comment.open{
    animation: fade-in 0.5s;
    animation-fill-mode: forwards;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fade-out {
    from {
        opacity: 1;

    }
    to {
        opacity: 0;
    }
}
</style>