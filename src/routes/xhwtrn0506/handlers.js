const { Engine } = require("./Engine");

/**
 * # general/handlers.js
 *
 * Simple display of status and the environment we're running in
 *
 */
("use strict");

/**
 * ## Declaration
 *
 */
var internals = {};

/*
 * 
  curl -X POST -H "Content-Type: application/json" -H "" -d '{"hello": "world", "keys":{"key1":"value1","key2":2}}' http://localhost:5008/echo
 */
internals.EchoPost = async function (req, h) {
  return h.response(req.payload);
};

internals.CommentAddForBiz = async function (req, h) {
  try {
    let tenant = req.auth.credentials.tenant._id;
    let myEmail = req.auth.credentials.email;
    if (req.payload.objtype === "TODO") {
      let todo = await Todo.findOne({ tenant: tenant, todoid: req.payload.objid });
      if (todo) {
        let thisComment = await Engine.postCommentForTodo(
          tenant,
          myEmail,
          todo,
          req.payload.content
        );
        let comments = await Engine.getComments(
          tenant,
          "TODO",
          req.payload.objid,
          Const.COMMENT_LOAD_NUMBER
        );
        return h.response({ comments, thisComment });
      }
    }

    return h.response(null);
  } catch (err) {
    console.error(err);
    return h.response(replyHelper.constructErrorResponse(err)).code(500);
  }
};

internals.CommentReplyForComment = async function (req, h) {
  try {
    let tenant = req.auth.credentials.tenant._id;
    let myEmail = req.auth.credentials.email;
    let thisComment = await Engine.postCommentForComment(
      tenant,
      myEmail,
      req.payload.cmtid, //被该条评论所评论的评论ID
      req.payload.content,
      req.payload.threadid
    );
    let comments = await Engine.getComments(
      tenant,
      "COMMENT",
      req.payload.cmtid,
      Const.COMMENT_LOAD_NUMBER
    );

    return h.response({ comments, thisComment });
  } catch (err) {
    console.error(err);
    return h.response(replyHelper.constructErrorResponse(err)).code(500);
  }
};

internals.CommentThumb = async function (req, h) {
  try {
    let tenant = req.auth.credentials.tenant._id;
    let myEmail = req.auth.credentials.email;
    let upOrDown = req.payload.thumb;
    let cmtid = req.payload.cmtid;
    //找到当前comment
    await Thumb.deleteMany({ tennant: tenant, cmtid: cmtid, who: myEmail });
    let tmp = new Thumb({ tenant: tenant, cmtid: cmtid, who: myEmail, upordown: upOrDown });
    tmp = await tmp.save();
    let upnum = await Thumb.countDocuments({ tenant: tenant, cmtid: cmtid, upordown: "UP" });
    let downnum = await Thumb.countDocuments({ tenant: tenant, cmtid: cmtid, upordown: "DOWN" });
    return h.response({ upnum, downnum });
  } catch (err) {
    console.error(err);
    return h.response(replyHelper.constructErrorResponse(err)).code(500);
  }
};

internals.CommentDelete = async function (req, h) {
  try {
    let deleteFollowing = async (tenant, objid) => {
      let filter = { tenant: tenant, objid: objid };
      let cmts = await Comment.find(filter, { _id: 1 });
      for (let i = 0; i < cmts.length; i++) {
        await deleteFollowing(tenant, cmts[i]._id);
      }
      await Comment.deleteOne(filter);
    };
    let tenant = req.auth.credentials.tenant._id;
    let commentid = req.payload.commentid;
    let filter = { tenant: tenant, _id: commentid };
    //Find the comment to be deleted.
    let cmt = await Comment.findOne(filter);
    //Find the objtype and objid of it's parent
    let objtype = cmt.objtype;
    let objid = cmt.objid;

    //Delete childrens recursively.
    await deleteFollowing(tenant, cmt._id);
    //Delete this one
    await Comment.deleteOne(filter);

    return h.response({ thisComment: cmt });
  } catch (err) {
    console.error(err);
    return h.response(replyHelper.constructErrorResponse(err)).code(500);
  }
};

internals.CommentThumb = async function (req, h) {
  try {
    let tenant = req.auth.credentials.tenant._id;
    let myEmail = req.auth.credentials.email;
    let upOrDown = req.payload.thumb;
    let cmtid = req.payload.cmtid;
    //找到当前comment
    await Thumb.deleteMany({ tennant: tenant, cmtid: cmtid, who: myEmail });
    let tmp = new Thumb({ tenant: tenant, cmtid: cmtid, who: myEmail, upordown: upOrDown });
    tmp = await tmp.save();
    let upnum = await Thumb.countDocuments({ tenant: tenant, cmtid: cmtid, upordown: "UP" });
    let downnum = await Thumb.countDocuments({ tenant: tenant, cmtid: cmtid, upordown: "DOWN" });
    return h.response({ upnum, downnum });
  } catch (err) {
    console.error(err);
    return h.response(replyHelper.constructErrorResponse(err)).code(500);
  }
};

module.exports = internals;
