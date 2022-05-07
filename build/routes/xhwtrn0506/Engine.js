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
const Comment_1 = __importDefault(require("../../database/models/Comment"));
const Engine = {
    podium: null,
    postCommentForTodo: function (tenant, doer, todo, content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (content.trim().length === 0)
                return;
            let emails = [todo.wfstarter];
            let people = [Tools.getEmailPrefix(todo.wfstarter)];
            let doerCN = yield Cache.getUserName(tenant, doer);
            [people, emails] = yield Engine.setPeopleFromContent(tenant, doer, content, people, emails);
            let frontendUrl = Tools.getFrontEndUrl();
            let msg = {
                tenant: todo.tenant,
                doer: doer,
                doerCN: doerCN,
                subject: (todo.rehearsal ? "MTC Comment Rehearsal: " : "MTC Comment: ") + `from ${doerCN}`,
                mail_body: `Hello [receiverCN],<br/><br/>Comment for you: 
    <br/>
    <br/>
    ${content}
    <br/>
    <br/>
        From: ${doerCN}<br/>
        Click to see it on task: <a href="${frontendUrl}/work/@${todo.todoid}?anchor=ANCHOR">${todo.title}</a> <br/>
        Process: <a href="${frontendUrl}/workflow/@${todo.wfid}">${todo.wftitle}</a><br/>
        <br/><a href="${frontendUrl}/comment">View all comments left for you </a><br/><br/><br/> Metatocome`,
            };
            let context = { wfid: todo.wfid, workid: todo.workid, todoid: todo.todoid };
            let ret = yield Engine.__postComment(tenant, doer, todo.doer, "TODO", //被评论的对象是一个TODO
            todo.todoid, //被评论对象的ID
            content, context, people, emails, todo.rehearsal, msg);
            ret.todoTitle = todo.title;
            ret.todoDoer = todo.doer;
            ret.todoDoerCN = yield Cache.getUserName(tenant, todo.doer);
            return ret;
        });
    },
    postCommentForComment: function (tenant, doer, cmtid, content, threadid) {
        return __awaiter(this, void 0, void 0, function* () {
            let cmt = yield Comment_1.default.findOne({ tenant: tenant, _id: cmtid });
            let theTodo = yield Todo.findOne({ tenant: tenant, todoid: cmt.context.todoid }).lean();
            let people = cmt.people;
            people.push(Tools.getEmailPrefix(cmt.who));
            let emails = people.map((uid) => Tools.makeEmailSameDomain(uid, doer));
            let doerCN = yield Cache.getUserName(tenant, doer);
            let frontendUrl = Tools.getFrontEndUrl();
            [people, emails] = yield Engine.setPeopleFromContent(tenant, doer, content, people, emails);
            let msg = {
                tenant: tenant,
                doer: doer,
                doerCN: doerCN,
                subject: (cmt.rehearsal ? "MTC Comment Rehearsal: " : "MTC Comment: ") + `from ${doerCN}`,
                mail_body: `Hello [receiverCN],<br/><br/>Comment for you: <br/>${content}<br/> From: ${doerCN}<br/> 
        Click to see it on task: <a href="${frontendUrl}/work/@${cmt.context.todoid}?anchor=ANCHOR">${theTodo ? theTodo.title : "The Task"} </a> <br/>
        Process: <a href="${frontendUrl}/workflow/@${cmt.context.wfid}">${theTodo ? theTodo.wftitle : "The Workflow"}</a><br/>
    <br/><br/> Metatocome`,
            };
            return yield Engine.__postComment(tenant, doer, cmt.who, "COMMENT", cmtid, //被该条评论 所评论的评论的ID
            content, cmt.context, //继承上一个comment的业务上下文
            people, emails, cmt.rehearsal, msg, threadid);
        });
    },
    __postComment: function (tenant, doer, toWhom, objtype, objid, content, context, thePeople, emails, rehearsal, emailMsg = null, threadid = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //找里面的 @somebody， regexp是@后面跟着的连续非空字符
                let comment = new Comment_1.default({
                    tenant: tenant,
                    rehearsal: rehearsal,
                    who: doer,
                    towhom: toWhom,
                    objtype: objtype,
                    objid: objid,
                    people: thePeople,
                    content: content,
                    context: context,
                    threadid: threadid ? threadid : "",
                });
                comment = yield comment.save();
                //对TODO的comment是thread级Comment，需要将其threadid设置为其自身的_id
                if (comment.objtype === "TODO") {
                    comment.threadid = comment._id;
                    comment = yield comment.save();
                }
                else if (threadid) {
                    //对Comment的Comment需要将其thread  Comment的 updatedAt进行更新
                    //以便其排到前面
                    let threadComment = yield Comment_1.default.findOneAndUpdate({ tenant: tenant, _id: comment.threadid }, { updatedAt: new Date(0) }, { new: true });
                }
                //TODO: send TIMEOUT seconds later, then check if still exists, if not, don't send email
                if (emailMsg) {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        let theComment = yield Comment_1.default.findOne({ tenant: tenant, _id: comment._id });
                        if (theComment) {
                            for (let i = 0; i < emails.length; i++) {
                                if (emails[i] === doer) {
                                    console.log("Bypass: comment's author email to him/herself");
                                    continue;
                                }
                                let receiverCN = yield Cache.getUserName(tenant, emails[i]);
                                if (receiverCN === "USER_NOT_FOUND")
                                    continue;
                                let subject = emailMsg.subject.replace("[receiverCN]", receiverCN);
                                let body = emailMsg.mail_body.replace("[receiverCN]", receiverCN);
                                //ANCHOR, use to scroll to attached comment by comment id.
                                body = body.replace("ANCHOR", "tcmt_" + comment._id.toString());
                                Engine.sendTenantMail(tenant, //not rehearsal
                                rehearsal ? doer : emails[i], subject, body, "COMMENT_MAIL").then((res) => {
                                    console.log("Mailer send email to ", rehearsal ? doer + "(" + emails[i] + ")" : emails[i], "subject:", subject);
                                });
                            }
                        }
                        else {
                            console.log("Don't send comment email, since HAS been deleted");
                        }
                    }), (Const.DEL_NEW_COMMENT_TIMEOUT + 5) * 1000);
                    //}, 1000);
                }
                comment = JSON.parse(JSON.stringify(comment));
                comment.whoCN = yield Cache.getUserName(tenant, comment.who);
                comment.towhomCN = yield Cache.getUserName(tenant, toWhom);
                comment.splitted = splitComment(comment.content);
                let tmpret = yield Engine.splitMarked(tenant, comment);
                comment.mdcontent = tmpret.mdcontent;
                comment.mdcontent2 = tmpret.mdcontent2;
                let people = [];
                let emails = [];
                [people, emails] = yield Engine.setPeopleFromContent(tenant, comment.who, //Email domain reference user
                comment.content, people, emails);
                comment.people = people;
                comment.transition = true;
                comment.children = [];
                comment.upnum = 0;
                comment.downnum = 0;
                return comment;
            }
            catch (err) {
                console.error(err);
            }
        });
    },
};
exports.default = Engine;
//# sourceMappingURL=Engine.js.map