<template>
  <div class="content">
    <!-- 비주얼영역 - 메뉴 -->
    <div class="visual-menu mb30">
      <h1>
        Messaging
      </h1>

    </div>
    <!-- 비주얼영역 - 메뉴 끝 -->


    <!-- DM 리스트 -->
    <div class="dm-list">
      <div class="dl-title">
        <div>
          <h2>Messaging</h2>
        </div>
        <p>
          <router-link to="#"><i class="uil uil-comment-alt"></i> <span>5</span><em>전부읽음</em></router-link>
          <router-link to="#"><i class="uil uil-setting"></i> <em>세팅</em></router-link>
        </p>
      </div>

      <dl class="dl-content">
        <dd>
          <div>
            <div class="input-search-default">
              <p><i class="uil uil-search"></i>
              </p>
              <div><input type="text" name="" title="keywords" placeholder="검색어를 입력하세요." /></div>
            </div>
          </div>
          <ul class="msg-list">
            <!-- <el-scrollbar tag="ul" wrap-class="msg-list" height="650px"> -->
            <li class="active">
              <dl>
                <dd>
                  <UserAvatar tag="p" />

                </dd>
                <dt>
                  <h3>쿵쿵딱 게임세상</h3>
                  <p>폼생폼사 창작게임 고수 모임에 가입해주셔서 감사합니다.</p>
                </dt>
                <dd>
                  <h4><i class="uis uis-clock" style="color:#c1c1c1;"></i> 10시간전</h4>
                  <span>1</span>
                </dd>
              </dl>
            </li>
            <li v-for="i in 4">
              <dl>
                <dd>
                  <p>TW</p>
                </dd>
                <dt>
                  <h3>쿵쿵딱 게임세상</h3>
                  <p>폼생폼사 창작게임 고수 모임에 가입해주셔서 감사합니다.</p>
                </dt>
                <dd>
                  <h4><i class="uis uis-clock" style="color:#c1c1c1;"></i> 10시간전</h4>
                  <span>12</span>
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dd>
                  <!-- <p
                    :style="{ 'background': 'url(' + require('../../assets/images/card_profile_img07.png') + ') center no-repeat', 'background-size': 'cover' }">
                  </p> -->
                </dd>
                <dt>
                  <h3>쿵쿵딱 게임세상</h3>
                  <p>폼생폼사 창작게임 고수 모임에 가입해주셔서 감사합니다.</p>
                </dt>
                <dd>
                  <h4><i class="uis uis-clock" style="color:#c1c1c1;"></i> 10시간전</h4>
                  <span>1</span>
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dd>
                  <!-- <p
                    :style="{ 'background': 'url(' + require('../../assets/images/card_profile_img07.png') + ') center no-repeat', 'background-size': 'cover' }">
                  </p> -->
                </dd>
                <dt>
                  <h3>쿵쿵딱 게임세상</h3>
                  <p>폼생폼사 창작게임 고수 모임에 가입해주셔서 감사합니다.</p>
                </dt>
                <dd>
                  <h4><i class="uis uis-clock" style="color:#c1c1c1;"></i> 10시간전</h4>
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dd>
                  <!-- <p
                    :style="{ 'background': 'url(' + require('../../assets/images/card_profile_img07.png') + ') center no-repeat', 'background-size': 'cover' }">
                  </p> -->
                </dd>
                <dt>
                  <h3>쿵쿵딱 게임세상</h3>
                  <p>폼생폼사 창작게임 고수 모임에 가입해주셔서 감사합니다.</p>
                </dt>
                <dd>
                  <h4><i class="uis uis-clock" style="color:#c1c1c1;"></i> 10시간전</h4>
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dd>
                  <!-- <p
                    :style="{ 'background': 'url(' + require('../../assets/images/card_profile_img07.png') + ') center no-repeat', 'background-size': 'cover' }">
                  </p> -->
                </dd>
                <dt>
                  <h3>쿵쿵딱 게임세상</h3>
                  <p>폼생폼사 창작게임 고수 모임에 가입해주셔서 감사합니다.</p>
                </dt>
                <dd>
                  <h4><i class="uis uis-clock" style="color:#c1c1c1;"></i> 10시간전</h4>
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dd>
                  <!-- <p
                    :style="{ 'background': 'url(' + require('../../assets/images/card_profile_img07.png') + ') center no-repeat', 'background-size': 'cover' }">
                  </p> -->
                </dd>
                <dt>
                  <h3>쿵쿵딱 게임세상</h3>
                  <p>폼생폼사 창작게임 고수 모임에 가입해주셔서 감사합니다.</p>
                </dt>
                <dd>
                  <h4><i class="uis uis-clock" style="color:#c1c1c1;"></i> 10시간전</h4>
                </dd>
              </dl>
            </li>
            <!-- </el-scrollbar> -->
          </ul>
        </dd>

        <dt>
          <dl>
            <dd>
              <!-- <p
                :style="{ 'background': 'url(' + require('../../assets/images/card_profile_img07.png') + ') center no-repeat', 'background-size': 'cover' }">
              </p> -->
            </dd>
            <dt>
              <div>
                <h2>Followers</h2>
                <p>@Zempieeeee</p>
              </div>
              <p>Online</p>
            </dt>
            <dd><router-link to="#"><i class="uil uil-ellipsis-h font25"></i></router-link></dd>
          </dl>

          <!-- 대화내용 있을 때 -->
          <div class="dlc-chat-content">
            <div class="receiver-chat">
              <h4>2:30 PM</h4>
              <ul>
                <li><span>전송한 메세지 내용 표시. 전송한 메세지가 width 길이보다 길 경우</span></li>
              </ul>
            </div>
            <div class="sender-chat">
              <h4>2:30 PM</h4>
              <ul>
                <li><span>안녕</span></li>
                <li><span>어떻게 지내고 있어? 나는 잘 지내고 있어. 날씨가 많이 춥지?😎</span></li>
              </ul>
            </div>
            <dl>
              <dd></dd>
              <dt>2021년11월09일</dt>
              <dd></dd>
            </dl>
            <div class="receiver-chat">
              <h4>2:30 PM</h4>
              <ul>
                <li><span>전송한 메세지 내용 표시. 전송한 메세지가 width 길이보다 길 경우</span></li>
              </ul>
            </div>
            <div class="sender-chat">
              <h4>2:30 PM</h4>
              <ul>
                <li><span>안녕</span></li>
                <li><span>어떻게 지내고 있어? 나는 잘 지내고 있어. 날씨가 많이 춥지?😎</span></li>
                <li><span>어떻게 지내고 있어?</span></li>
                <li><span>밥 먹었어?</span></li>
              </ul>
            </div>
          </div>

          <!-- 대화내용 없을 때 -->
          <!-- <div class="dlc-chat-emptied">
        <p><i class="uil uil-comment-alt-dots" style="font-size:40px; color:#fff;"></i></p>
        <h2>아무 메세지도 선택하지 않으셨습니다.</h2>
        <h3>메세지를 선택하거나, 새로운 메세지를 작성하세요.</h3>
        <div><router-link to="#"  class="btn-default" style="width:100%;">새 메세지</router-link></div>
      </div> -->
          <!-- 대화내용 없을 때 끝 -->

          <div class="dlc-send-message">
            <div>
              <input type="text" name="" title="" placeholder="댓글달기" />
              <router-link to="#"><i class="uil uil-scenery font25 mr5"></i></router-link>
              <router-link to="#"><i class="uil uil-camera font28"></i></router-link>
            </div>
            <p><a to="#"><img src="/images/send_icon.png" alt="" title="" /></a></p>
          </div>
        </dt>
      </dl>
    </div>
    <!-- DM 리스트 끝 -->


  </div>
</template>
<script setup lang='ts'>
import { ElScrollbar } from 'element-plus'



</script>
<style scoped lang='scss'>
.visual-menu {
  background: url('/images/dm_banner.jpeg') center no-repeat;
  background-size: cover;
  width: 1200px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    font-weight: 600;
    font-size: 30px;
    line-height: 30px;
    color: #fff;

  }


}

.dl-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 30px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  overflow: hidden;

  :deep(.msg-list) {


    ul {
      height: 650px;
      // padding: 10px 25px;

      li {
        margin: 10px 0px;
        padding: 20px 13px 20px 20px;
        background-color: #fff;
        border: 1px solid #f1f1f1;
        border-radius: 10px;
        transition: all 0.4s ease-in-out;
        cursor: pointer;

        &:hover {
          background-color: #f1f1f1;
        }

        &.active {
          background-color: #f1f1f1;

        }

        dl {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;

          dd {
            text-align: right;

            p {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              text-align: center;
              font-weight: 500;
              font-size: 16px;
              line-height: 50px;
              color: #ff6e17;
              background: rgba(249, 115, 22, 0.15);
              border: 2px solid #fff;
              box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.06);
            }


            h4 {
              margin-bottom: 5px;
              font-size: 16px;
            }

            span {
              padding: 3px 8.5px;
              color: #fff;
              border-radius: 30px;
              background-color: #ff6e17;
            }
          }

          dt {
            width: 60%;

            h3 {
              width: 100%;
              font-weight: 500;
              font-size: 16px;
              line-height: 16px;
              color: #333;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            p {
              width: 100%;
              margin-top: 5px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
    }
  }

  .dlc-send-message {
    div {
      justify-content: space-between;
    }

  }
}
</style>
