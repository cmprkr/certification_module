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

training_library_quiz.js:

 
layer.memo.edit.training_library_quiz = function(opt_args) {
  layer.memo.apply(this, arguments);

  var args = opt_args || {};

  if (args.edit) {
    this.edit_mode_ = args.edit;
  }

  this.popout = args.popout || false;
};
$.inherits(layer.memo.edit.training_library_quiz, layer.memo.edit);

layer.memo.edit.training_library_quiz.prototype.decorate_contents = function(parent) {
  var self = this;
  this.vesta = {};

  var container = $.createElement('div').style({'max-width': 858, 'width': '100%', 'margin': 'auto auto 0px', 'padding-bottom': 20});
  var paper = new component.paper.plain();
  var row = this.get(this.get_table(),this.get_id());

  var text = $.createElement('div').innerText(
    "Please check that you have answered each question to the best of your ability. Upon clicking 'Submit,' you will be able to view which questions you answered correctly or incorrectly.\n\nOnce you reach 100% mastery, you will be taken to a confirmation page and this serction will be marked as completed.\n\n"
  );

  paper.get_contents().appendChild(text);

  const render_kakelpapper = function(title, options, header, explanation) {
    const input = new component.input.kakelpapper({
      label: 0,
      name: title,
      icon: "circle outline",
      wrap: true,
      columns: 1,
      options: options.map((option, index) => ({
        code: index + 1,
        primary: option,
        disabled: 0,
        color: style.color("light blue")
      })),
      validate: 0
    });
  
    input.set_type('radio');
    input.render(container);
  
    self.vesta[title] = {
      options: options,
      header: header,
      explanation: explanation,
      input: input
    };
  }

  var memo = this.get(this.get_table(), this.get_id());

  function display_questions() {
    if (memo && memo.attributes.questions) {
      memo.attributes.questions.forEach(question => {
        var title = question.question;
        var options = question.options.map(option => option.text);
  
        while (options.length < 4) {
          options.push('');
        }

        var header = $.createElement('h4').style({'padding-bottom': 10}).innerText(title);
        container.appendChild(header);

        var explanation = $.createElement('p').style({'color': '#ffb300', 'display': 'none'}).innerText(question.explanation);
        container.appendChild(explanation);
  
        render_kakelpapper(title, options, header, explanation);
        
        var footer = $.createElement('h4').style({'height': 28});
        container.appendChild(footer);

      });
    } else {
      console.error('Quiz has been formatted incorrectly. See other JSON attributes.');
    }
  }
  
  display_questions();

  paper.set_title(memo.name + ' Quiz');
  paper.render(container);
  parent.appendChild(container);

  var button_div = $.createElement('div').style({'height': 36, 'padding-top': 8});
  var button_container = $.createElement('div').style({'float': 'right'});

  button_container.appendChild(this.get_button(
    'Submit',
    {}
  )).addEventListener('click', function() {
    
    let score = 0;
    let total_questions = memo.attributes.questions.length;

    Object.keys(self.vesta).forEach(title => {
      const input = self.vesta[title].input;
      const selected_option = input.get_value();
      const question_data = memo.attributes.questions.find(q => q.question === title);
      const correct_option = question_data.correct_answer;
      const options = input.get_options();

      if (selected_option == correct_option) {
        score++;
        got_correct = true;
      } else {
        got_correct = false;
      }

      input.set_options(options);
      input.render(container);
    });

    let user_responses = [];

    Object.keys(self.vesta).forEach(title => {
      const input = self.vesta[title].input;
      const selected_option = input.get_value();
      user_responses.push({ question: title, selected_option: selected_option });
    });

    window.user_responses = user_responses;

    if (score == total_questions) {
      
      // REMOVE FOLLOWING COMMENTS BEFORE PUSHING
      // mark section as complete
      /*
      api(
        'user_memo',
        'create',
        {
          'user_id': moxee.user.user_id,
          'memo_id': memo.memo_id,
        }, function(response) {
          $.extend(dictionary.user_memo, {[response.user_memo_id]: response});
        }
      );
      */
      
    }

    // open results layer
    new layer.memo.edit.training_library_quiz_results({ 
      'memo_id': row.memo_id,
      'edit': false,
      'pdf': row.training_library_type_terminology_id === '13362',
      'training_library_id': row.training_library_id,
    }).render()

  });

  button_div.appendChild(button_container);
  paper.get_contents().appendChild(button_div);

};
