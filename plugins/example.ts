const EX = {

  // '/auth/login': {
  //     post: {
  //       req: {
  //         body: {
  //           "email": "abcd@gmail.com",
  //           "password": "aa12345678",
  //         }
  //       },
  //       res: {
  //         "code": 0,
  //         "message": "success",
  //         "data": null
  //       },
  //       err: {
  //         "code": 401,
  //         "message": "wrong password"
  //       }
  //     }
  //   },
  //   '/user': {
  //       get: {
  //         res: {
  //           data: {
  //             id:1,
  //             access_token: 'xxxxxxxxxxxxxxxxxxxx',
  //             nickname:'fw_user01',
  //             email:'fw01@fw.com',
  //             uid:'23jdaksjh2321jndabn2',
  //             profile_img:'data:image/jpeg;base64,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',
  //             point:100,
  //           },
  //         },
  //         err: {
  //           message: 'need to join',
  //         },
  //       },
  //     },
  //     '/user/2': {
  //       get: {
  //         res: {
  //           data: {
  //             id:2,
  //             access_token: 'yyyyyyyyyyyyyyyyyyy',
  //             nickname:'fw_user02',
  //             email:'fw02@fw.com',
  //             uid:'dfdu233jnda14234n',
  //             point:100,
  //           },
  //         },
  //         err: {
  //           message: 'need to join',
  //         },
  //       },
  //     },
  //   '/sign-up':{
  //     post: {
  //       req: {
  //         body: {
  //           "email": "abcd@gmail.com",
  //           "password": "aa12345678",
  //           "nick": "test"
  //         }
  //       },
  //       res: {
  //         "code": 0,
  //         "message": "success",
  //         "data": {
  //           id:1,
  //           access_token: 'xxxxxxxxxxxxxxxxxxxx',
  //           nickname:'fw_user01',
  //           email:'fw01@fw.com',
  //           uid:'23jdaksjh2321jndabn2',
  //           point:100,
  //         }
  //       },
  //       err: {
  //         "code": 409,
  //         "message": "duplicate nick : test"
  //       }
  //     }
  //   },
  //   '/user/list': {
  //     get: {
  //       res: {
  //         data: {
  //           total:5,
  //           list: [
  //             {
  //               id:1,
  //               access_token: 'xxxxxxxxxxxxxxxxxxxx',
  //               nickname:'fw_user01',
  //               email:'fw01@fw.com',
  //               uid:'a3jdaksjh2321jndabn2',
  //               point:100,
  //             },
  //             {
  //               id:2,
  //               access_token: 'yyyyyyyyyyyyyyyyyyy',
  //               nickname:'fw_user02',
  //               email:'fw02@fw.com',
  //               uid:'bfdu233jnda14234n',
  //               point:100,
  //             },
  //             {
  //               id: 3,
  //               access_token: 'zzzzzzzzzzzzzzzzzzz',
  //               nickname: 'fw_user03',
  //               email:'fw03@fw.com',
  //               uid: 'csda9sdasd9asd2ds',
  //               point: 101000,
  //             },
  //             {
  //               id: 4,
  //               access_token: 'aaaaaaaaaaaaaaaaaaaaa',
  //               nickname: 'fw_user04',
  //               email:'fw04@fw.com',
  //               uid: 'ddsad0ahghkjkhjhgbgjbh2',
  //               point: 74000,
  //             },
  //             {
  //               id: 5,
  //               access_token: 'bbbbbbbbbbbbbbbbbbb',
  //               nickname: 'fw_user05',
  //               email:'fw05@fw.com',
  //               uid: 'eda98asd8798798fdbn',
  //               point: 46000,
  //             },
  //           ]
  //         }
  //       }
  //     }
  //   }

}

export default EX;