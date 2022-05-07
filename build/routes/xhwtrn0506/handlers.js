"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Engine_1 = __importDefault(require("./Engine"));
const Const_1 = __importDefault(require("../../lib/Const"));
const Comment_1 = __importDefault(require("../../database/models/Comment"));
const Thumb_1 = __importDefault(require("../../database/models/Thumb"));
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
const internals = {
    /*
     *
      ccurl -X POST -H "Content-Type: application/json" -H "" -d '{"hello": "world", "keys":{"key1":"value1","key2":2}}' http://localhost:5008/echo
     curl -X POST -H "Content-Type: application/json" -d '{"userid": "lucas", "objtype":"WList", "objid": "comment-1234", "content": "My Comment"}' http://localhost:5008/comment/addforbiz
     */
    EchoPost: function (req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            return h.response(req.payload);
        });
    },
    CommentAddForBiz: function (req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userid = req.payload.userid;
                let thisComment = new Comment_1.default({
                    who: userid,
                    towhom: "zhangsan",
                    objtype: "WList",
                    objid: req.payload.objid,
                    people: [],
                    content: req.payload.comment,
                    context: {},
                    threadid: "",
                });
                thisComment = yield thisComment.save();
                return h.response(req.payload);
            }
            catch (err) {
                console.error(err);
                return h.response("Error");
            }
        });
    },
    CommentReplyForComment: function (req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tenant = req.auth.credentials.tenant._id;
                let myEmail = req.auth.credentials.email;
                let thisComment = yield Engine_1.default.postCommentForComment(tenant, myEmail, req.payload.cmtid, //被该条评论所评论的评论ID
                req.payload.content, req.payload.threadid);
                let comments = yield Engine_1.default.getComments(tenant, "COMMENT", req.payload.cmtid, Const_1.default.COMMENT_LOAD_NUMBER);
                return h.response({ comments, thisComment });
            }
            catch (err) {
                console.error(err);
                return h.response(err.message);
            }
        });
    },
    CommentDelete: function (req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deleteFollowing = (tenant, objid) => __awaiter(this, void 0, void 0, function* () {
                    let filter = { tenant: tenant, objid: objid };
                    let cmts = yield Comment_1.default.find(filter, { _id: 1 });
                    for (let i = 0; i < cmts.length; i++) {
                        yield deleteFollowing(tenant, cmts[i]._id);
                    }
                    yield Comment_1.default.deleteOne(filter);
                });
                let tenant = req.auth.credentials.tenant._id;
                let commentid = req.payload.commentid;
                let filter = { tenant: tenant, _id: commentid };
                //Find the comment to be deleted.
                let cmt = yield Comment_1.default.findOne(filter);
                //Find the objtype and objid of it's parent
                let objtype = cmt.objtype;
                let objid = cmt.objid;
                //Delete childrens recursively.
                yield deleteFollowing(tenant, cmt._id);
                //Delete this one
                yield Comment_1.default.deleteOne(filter);
                return h.response({ thisComment: cmt });
            }
            catch (err) {
                console.error(err);
                return h.responsee(err.message);
            }
        });
    },
    CommentThumb: function (req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tenant = req.auth.credentials.tenant._id;
                let myEmail = req.auth.credentials.email;
                let upOrDown = req.payload.thumb;
                let cmtid = req.payload.cmtid;
                //找到当前comment
                yield Thumb_1.default.deleteMany({ tennant: tenant, cmtid: cmtid, who: myEmail });
                let tmp = new Thumb_1.default({ tenant: tenant, cmtid: cmtid, who: myEmail, upordown: upOrDown });
                tmp = yield tmp.save();
                let upnum = yield Thumb_1.default.countDocuments({ tenant: tenant, cmtid: cmtid, upordown: "UP" });
                let downnum = yield Thumb_1.default.countDocuments({ tenant: tenant, cmtid: cmtid, upordown: "DOWN" });
                return h.response({ upnum, downnum });
            }
            catch (err) {
                console.error(err);
                return h.response(err.message);
            }
        });
    },
};
exports.default = internals;
//# sourceMappingURL=handlers.js.map