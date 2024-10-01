layer.memo.edit.training_library = function(opt_args) {
  layer.memo.apply(this, arguments);

  var args = opt_args || {};

  if (args.edit) {
    this.edit_mode_ = args.edit;
  }

  this.popout = args.popout || false;
};
$.inherits(layer.memo.edit.training_library, layer.memo.edit);

layer.memo.edit.training_library.prototype.decorate_contents = function(parent) {
  /*
  var self = this;

  var memo = dictionary.memo[this.get_id()]; // this.get('memo', this.get_id());

  var user = moxee.user; // this.get('user', moxee.user.user_id);
  // var user_memo = this.get('user_memo', {'user_id': user.user_id, 'memo_id': memo.memo_id});
  var user_memo = null;
  var user_memos = dictionary.user_memo;
  for (var user_memo_id in user_memos) {
    var current_user_memo = user_memos[user_memo_id];
    if (current_user_memo.user_id === user.user_id && current_user_memo.memo_id === memo.memo_id) {
      user_memo = current_user_memo;
      break;
    }
  }

  if (!user_memo) {
    api(
      'user_memo',
      'create',
      {
        'user_id': moxee.user.user_id,
        'memo_id': memo.memo_id,
      }, function(response) {
        $.extend(dictionary.user_memo, {[response.user_memo_id]: response});
        self.render();
      }
    );
  } else {
    layer.memo.edit.prototype.decorate_contents.call(this, parent);
  }*/
  layer.memo.edit.prototype.decorate_contents.call(this, parent);

  var self = this;

  var memo = dictionary.memo[this.get_id()]; // this.get('memo', this.get_id());

  var user = moxee.user; // this.get('user', moxee.user.user_id);
  // var user_memo = this.get('user_memo', {'user_id': user.user_id, 'memo_id': memo.memo_id});
  var user_memo = null;
  var user_memos = dictionary.user_memo;
  for (var user_memo_id in user_memos) {
    var current_user_memo = user_memos[user_memo_id];
    if (current_user_memo.user_id === user.user_id && current_user_memo.memo_id === memo.memo_id) {
      user_memo = current_user_memo;
      break;
    }
  }

  if (!user_memo) {
    var container = $.createElement('div').style({'max-width': 858, 'width': '100%', 'margin': 'auto auto 0px', 'padding-bottom': 20});
    var paper = new component.paper.plain();

    paper.set_title('Understood and ready!');

    var text = $.createElement('div').innerText(
      'I\'ve understood this section fully--feeling ready and confident!'
    );

    paper.get_contents().appendChild(text);

    var button_div = $.createElement('div').style({'height': 36, 'padding-top': 8});
    var button_container = $.createElement('div').style({'float': 'right'});

    button_container.appendChild(this.get_button(
      'Confirm',
      {}
    ))
      .addEventListener('click', function() {
        api(
          'user_memo',
          'create',
          {
            'user_id': moxee.user.user_id,
            'memo_id': memo.memo_id,
          }, function(response) {
            $.extend(dictionary.user_memo, {[response.user_memo_id]: response});
            self.render();
          }
        );
      });

    button_div.appendChild(button_container);
    paper.get_contents().appendChild(button_div);

    paper.render(container);

    parent.appendChild(container);
  }
};
