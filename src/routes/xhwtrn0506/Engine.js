const Engine = {
  podium: null,
};

Engine.postCommentForTodo = async function (tenant, doer, todo, content) {
  if (content.trim().length === 0) return;
  let emails = [todo.wfstarter];
  let people = [Tools.getEmailPrefix(todo.wfstarter)];
  let doerCN = await Cache.getUserName(tenant, doer);
  [people, emails] = await Engine.setPeopleFromContent(tenant, doer, content, people, emails);
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
  let ret = await Engine.__postComment(
    tenant,
    doer,
    todo.doer,
    "TODO", //被评论的对象是一个TODO
    todo.todoid, //被评论对象的ID
    content,
    context,
    people,
    emails,
    todo.rehearsal,
    msg
  );
  ret.todoTitle = todo.title;
  ret.todoDoer = todo.doer;
  ret.todoDoerCN = await Cache.getUserName(tenant, todo.doer);
  return ret;
};
Engine.postCommentForComment = async function (tenant, doer, cmtid, content, threadid) {
  let cmt = await Comment.findOne({ tenant: tenant, _id: cmtid });

  let theTodo = await Todo.findOne({ tenant: tenant, todoid: cmt.context.todoid }).lean();
  let people = cmt.people;
  people.push(Tools.getEmailPrefix(cmt.who));
  let emails = people.map((uid) => Tools.makeEmailSameDomain(uid, doer));
  let doerCN = await Cache.getUserName(tenant, doer);
  let frontendUrl = Tools.getFrontEndUrl();
  [people, emails] = await Engine.setPeopleFromContent(tenant, doer, content, people, emails);
  let msg = {
    tenant: tenant,
    doer: doer,
    doerCN: doerCN,
    subject: (cmt.rehearsal ? "MTC Comment Rehearsal: " : "MTC Comment: ") + `from ${doerCN}`,
    mail_body: `Hello [receiverCN],<br/><br/>Comment for you: <br/>${content}<br/> From: ${doerCN}<br/> 
        Click to see it on task: <a href="${frontendUrl}/work/@${
      cmt.context.todoid
    }?anchor=ANCHOR">${theTodo ? theTodo.title : "The Task"} </a> <br/>
        Process: <a href="${frontendUrl}/workflow/@${cmt.context.wfid}">${
      theTodo ? theTodo.wftitle : "The Workflow"
    }</a><br/>
    <br/><br/> Metatocome`,
  };
  return await Engine.__postComment(
    tenant,
    doer,
    cmt.who,
    "COMMENT",
    cmtid, //被该条评论 所评论的评论的ID
    content,
    cmt.context, //继承上一个comment的业务上下文
    people,
    emails,
    cmt.rehearsal,
    msg,
    threadid
  );
};
Engine.__postComment = async function (
  tenant,
  doer,
  toWhom,
  objtype,
  objid,
  content,
  context,
  thePeople,
  emails,
  rehearsal,
  emailMsg = null,
  threadid = null
) {
  try {
    //找里面的 @somebody， regexp是@后面跟着的连续非空字符
    let comment = new Comment({
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
    comment = await comment.save();
    //对TODO的comment是thread级Comment，需要将其threadid设置为其自身的_id
    if (comment.objtype === "TODO") {
      comment.threadid = comment._id;
      comment = await comment.save();
    } else if (threadid) {
      //对Comment的Comment需要将其thread  Comment的 updatedAt进行更新
      //以便其排到前面
      let threadComment = await Comment.findOneAndUpdate(
        { tenant: tenant, _id: comment.threadid },
        { updatedAt: new Date(0) },
        { new: true }
      );
    }
    //TODO: send TIMEOUT seconds later, then check if still exists, if not, don't send email
    if (emailMsg) {
      setTimeout(async () => {
        let theComment = await Comment.findOne({ tenant: tenant, _id: comment._id });
        if (theComment) {
          for (let i = 0; i < emails.length; i++) {
            if (emails[i] === doer) {
              console.log("Bypass: comment's author email to him/herself");
              continue;
            }
            let receiverCN = await Cache.getUserName(tenant, emails[i]);
            if (receiverCN === "USER_NOT_FOUND") continue;
            let subject = emailMsg.subject.replace("[receiverCN]", receiverCN);
            let body = emailMsg.mail_body.replace("[receiverCN]", receiverCN);
            //ANCHOR, use to scroll to attached comment by comment id.
            body = body.replace("ANCHOR", "tcmt_" + comment._id.toString());

            Engine.sendTenantMail(
              tenant, //not rehearsal
              rehearsal ? doer : emails[i],
              subject,
              body,
              "COMMENT_MAIL"
            ).then((res) => {
              console.log(
                "Mailer send email to ",
                rehearsal ? doer + "(" + emails[i] + ")" : emails[i],
                "subject:",
                subject
              );
            });
          }
        } else {
          console.log("Don't send comment email, since HAS been deleted");
        }
      }, (Const.DEL_NEW_COMMENT_TIMEOUT + 5) * 1000);
      //}, 1000);
    }
    comment = JSON.parse(JSON.stringify(comment));
    comment.whoCN = await Cache.getUserName(tenant, comment.who);
    comment.towhomCN = await Cache.getUserName(tenant, toWhom);
    comment.splitted = splitComment(comment.content);
    let tmpret = await Engine.splitMarked(tenant, comment);
    comment.mdcontent = tmpret.mdcontent;
    comment.mdcontent2 = tmpret.mdcontent2;
    let people = [];
    let emails = [];
    [people, emails] = await Engine.setPeopleFromContent(
      tenant,
      comment.who, //Email domain reference user
      comment.content,
      people,
      emails
    );
    comment.people = people;
    comment.transition = true;
    comment.children = [];
    comment.upnum = 0;
    comment.downnum = 0;
    return comment;
  } catch (err) {
    console.error(err);
  }
};
