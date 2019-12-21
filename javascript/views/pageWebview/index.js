!function (window, document) {
  const commentList = document.querySelector(".comment-list");
  const commentInput = document.querySelector(".comment-wrapper input[type=text]");
  const commentButton = document.querySelector(".comment-wrapper button");

  class JSBridge {

    constructor () {
      this.schema = 'sundial-dreams';
      this.iframe = this.createIFrameElement();
      this.id = 0;
    }

    createIFrameElement () {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      return iframe;
    }

    call (params = {}, callback) {
      params = Object.keys(params).reduce((acc, curKey) => acc + `${ curKey }=${ params[curKey] }&`, '');
      const name = `__callback__${ this.id++ }`;
      const src = `${ this.schema }://JSBridge?${ params }callback=${ name }`;
      window[name] = function (value) {
        delete window[name];
        typeof callback === 'function' && callback(value);
      };
      this.iframe.src = src;
    }
  }


  function createCommentFragment (text) {
    return `
        <div class="comment-item">
            <button class="avatar color-${Math.round(Math.random() * 4) + 1}"></button>
            <span class="comment-content">
                ${text}
            </span>
        </div>
    `;
  }


  /**
   * @return {string}
   */
  function DisplayCommentCard (display) {
    commentList.style.opacity = +display;
    return "JavaScriptFunction";
  }

  /**
   * just add comment
   * @return {string}
   */
  function AddComment (text) {
    commentList.innerHTML += createCommentFragment(text);
    return "JavaScriptFunction";
  }

  window.AddComment = AddComment;
  window.DisplayCommentCard = DisplayCommentCard;

  const jsBridge = new JSBridge();
  commentButton.addEventListener("click", function (e) {
    jsBridge.call({ comment: commentInput.value }, value => {
      commentInput.value = "";
      AddComment(value);
    });
  }, false);

}(window, document);
