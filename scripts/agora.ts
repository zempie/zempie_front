// import { colorLog } from "../composables/useDev";


// let options =
// {
//   // Pass your App ID here.
//   appId: 'bd0247bd76ec4e14b3e12e88b329baf9',
//   // Set the channel name.
//   channel: 'zempie',
//   // Pass your temp token here.
//   token: '007eJxTYLjVH8rSeaW/uWd3fdHkSS7vckyl/8TNiNq8p9/Rq6HN/4ACQ1KKgZGJeVKKuVlqskmqoUmScaqhUaqFRZKxkWVSYprly5enUhoCGRnebPjBxMgAgSA+G0NVam5BZioDAwAmUyOV',
//   // Set the user ID.
//   uid: 0,
//   role: '',
// };

// let channelParameters: any =
// {
//   // A variable to hold a local audio track.
//   localAudioTrack: null,
//   // A variable to hold a local video track.
//   localVideoTrack: null,
//   // A variable to hold a remote audio track.
//   remoteAudioTrack: null,
//   // A variable to hold a remote video track.
//   remoteVideoTrack: null,
//   // A variable to hold the remote user id.s
//   remoteUid: null,
//   screenTrack: null,
// };
// export default function () {
//   const { $AgoraRTC } = useNuxtApp()

//   // Create an instance of the Agora Engine
//   const agoraEngine = $AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });
//   const agoraLiveEngine = $AgoraRTC.createClient({ mode: "live", codec: "vp9" });
//   console.log('agoraEngine : ', agoraEngine)

//   const showMessage = (text) => {
//     console.log("message : ", text)
//   }
//   const AgoraSdk = {


//     async startBasicCall() {

//       // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
//       agoraEngine.on("user-published", async (user, mediaType) => {

//         console.log('user : ', user)
//         // Subscribe to the remote user when the SDK triggers the "user-published" event.
//         await agoraEngine.subscribe(user, mediaType);
//         console.log("subscribe success");

//         // Subscribe and play the remote audio track.
//         if (mediaType == "audio") {
//           channelParameters.remoteUid = user.uid;
//           // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
//           channelParameters.remoteAudioTrack = user.audioTrack;
//           // Play the remote audio track. 
//           channelParameters.remoteAudioTrack.play();

//           // showMessage("Remote user connected: " + user.uid);
//         }

//         if (mediaType == "video") {
//           // Retrieve the remote video track.
//           channelParameters.remoteVideoTrack = user.videoTrack;
//           // Retrieve the remote audio track.
//           channelParameters.remoteAudioTrack = user.audioTrack;
//           // Save the remote user id for reuse.
//           channelParameters.remoteUid = user.uid.toString();
//           // Specify the ID of the DIV container. You can use the uid of the remote user.
//           channelParameters.remoteUid = user.uid.toString();
//           // Append the remote container to the page body.
//           // Play the remote video track.
//         }

//         // Listen for the "user-unpublished" event.
//         agoraEngine.on("user-unpublished", user => {
//           console.log(user.uid + "has left the channel");
//           // showMessage("Remote user has left the channel");
//         });
//       });



//       // Listen to the Leave button click event.

//     },

//     async leaveVoiceChannel() {
//       // Destroy the local audio track.
//       channelParameters.localAudioTrack.close();

//       // Leave the channel
//       await agoraEngine.leave();
//       console.log("You left the channel");
//       // Refresh the page for reuse
//     },
//     async leaveVideoChannel() {
//       console.log('channelParameters', channelParameters)
//       // Destroy the local audio track.
//       channelParameters.localVideoTrack.close();
//       channelParameters.localAudioTrack.close();


//       // Leave the channel
//       await agoraEngine.leave();
//       console.log("You left the channel");
//       // Refresh the page for reuse
//     },

//     async joinChannel({ uid }) {
//       await agoraEngine.join(options.appId, options.channel, options.token, uid);
//       console.log("Joined channel: ", options.channel);
//       // Create a local audio track from the microphone audio.
//       channelParameters.localAudioTrack = await $AgoraRTC.createMicrophoneAudioTrack();
//       // Publish the local audio track in the channel.
//       await agoraEngine.publish(channelParameters.localAudioTrack);
//       console.log("Publish success!");


//     },

//     async startLive(container, uid) {
//       options.role = 'host';
//       // Call the method to set the role as Host.
//       await agoraLiveEngine.setClientRole(options.role);
//       if (channelParameters.localVideoTrack != null) {
//         // Publish the local audio and video track in the channel.
//         await agoraLiveEngine.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack]);
//         // Stop playing the remote video.
//         channelParameters.remoteVideoTrack.stop();
//         // Start playing the local video.
//         channelParameters.localVideoTrack.play(container);
//       }

//       // await agoraLiveEngine.join(options.appId, options.channel, options.token, uid);
//       // // Create a local audio track from the audio sampled by a microphone.
//       // channelParameters.localAudioTrack = await $AgoraRTC.createMicrophoneAudioTrack();
//       // // Create a local video track from the video captured by a camera.
//       // channelParameters.localVideoTrack = await $AgoraRTC.createCameraVideoTrack();
//       // // Append the local video container to the page body.

//       // await agoraLiveEngine.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack]);
//       // // Play the local video track.
//       // channelParameters.localVideoTrack.play(container);

//     },

//     async joinVideoChannel({ uid }) {
//       // Create a local video track from the video captured by a camera.
//       channelParameters.localVideoTrack = await $AgoraRTC.createCameraVideoTrack();

//       await agoraEngine.join(options.appId, options.channel, options.token, uid);
//       showMessage("Joined channel: " + options.channel);
//       // Create a local audio track from the microphone audio.
//       channelParameters.localAudioTrack = await $AgoraRTC.createCameraVideoTrack();
//       // Publish the local audio track in the channel.
//       await agoraEngine.publish(channelParameters.localAudioTrack);
//       colorLog("Publish success!", 'pink')
//     },
//     async shareScreen(user) {


//       // await agoraEngine.unpublish(user, channelParameters.localVideoTrack);
//       channelParameters.localVideoTrack = await $AgoraRTC.createCameraVideoTrack();

//       channelParameters.screenTrack = await $AgoraRTC.createScreenVideoTrack();
//       console.log(channelParameters.localVideoTrack, channelParameters, channelParameters.screenTrack)
//       // Replace the screen track with the local video track.
//       await channelParameters.localVideoTrack.replaceTrack(channelParameters.screenTrack, true);
//     }



//   }
//   return AgoraSdk

// }