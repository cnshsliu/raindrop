"use strict";
const config = {
  validate: async function (token, request, h) {
    console.log("Wishhouse strategy - validate ", token);
    let credentials: any = {};
    let result = {isValid: false, credentials: credentials};
    let user_id = "";

    //在此处调用中台， using token
    let user = { _id: "chengaoyang", username: "陈高阳" };
    if (user) {
      result = {
        isValid: true,
        credentials: {
          _id: user._id,
          username: user.username,
          origToken: token,
        },
      };
      user_id = user._id;
      console.log("Refreshed credentials from database successfully");
    } else {
      result = { isValid: false, credentials: {} };
      console.log("Refreshed credentials from database failed, user not found");
    }

    /** 这段用于判断是否在黑名单里，即便验证通过
    if (result.isValid) {
      //does redis have the token
      //示例直接返回不在黑名单中
      let inblack = false;
      //oops - it's been blacklisted - sorry
      if (inblack) {
        console.log(`invalid: authorizaiton token inblack, user ${user_id} logged out?`);
        result = {
          isValid: false,
          credentials: {},
        };
      }
    }
    return result;
  },

  isValidToken: (token) => token && token.indexOf("yuanwangwu") >= 0,

  errorFunc: ({ errorType, message, scheme }) => ({
    errorType,
    message,
    scheme,
    attributes: { error: "Invalid token", invalid_token: true },
  }),
};
const WishhouseAuthStrategy = {
  register: function (server, options) {
    server.auth.strategy("wh", "custom-auth", config);
  },

  pkg: {
    name: "wishhouse-strategy",
    version: "1.0.0",
  },
};

export default WishhouseAuthStrategy;
