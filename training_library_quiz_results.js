layer.memo.edit.training_library_quiz_results = function(opt_args) {
  layer.memo.apply(this, arguments);

  var args = opt_args || {};

  if (args.edit) {
    this.edit_mode_ = args.edit;
  }

  this.popout = args.popout || false;
};
$.inherits(layer.memo.edit.training_library_quiz_results, layer.memo.edit);

layer.memo.edit.training_library_quiz_results.prototype.decorate_contents = function(parent) {
  var self = this;
  var user_responses = window.user_responses;
  var memo = this.get(this.get_table(), this.get_id());
  var container = $.createElement('div').style({'max-width': 858, 'width': '100%', 'margin': 'auto auto 0px', 'padding-bottom': 20});
  var paper = new component.paper.plain();

  function count_incorrect_answers() {
    var incorrect_answers = 0;
    if (memo && memo.attributes.questions) {
      memo.attributes.questions.forEach(question => {
        var correct_option = question.correct_answer;
        var user_response = user_responses.find(response => response.question === question.question);
        if (user_response && user_response.selected_option != correct_option) {
          incorrect_answers++;
        }
      });
    }
    return incorrect_answers;
  }

  var incorrect_answers = count_incorrect_answers();

  var image = $.createElement('img');
  paper.get_contents().appendChild(image);

  var text = $.createElement('div').innerText(
    incorrect_answers === 0
      ? "Congratulations! You have passed the test and this section has been marked as complete.\n\n"
      : "Here are the questions you answered incorrectly. Please review and try again.\n\n"
  );
  paper.get_contents().appendChild(text);

  paper.set_title('Quiz Results');
  paper.render(container);
  parent.appendChild(container);

  function display_questions() {
    if (memo && memo.attributes.questions) {
      memo.attributes.questions.forEach(question => {
        var title = question.question;
        var options = question.options.map(option => option.text);
        var correct_option = question.correct_answer;

        // Check if the user got this question wrong
        var user_response = user_responses.find(response => response.question === title);
        if (user_response && user_response.selected_option != correct_option) {
          var header = $.createElement('h4').style({'padding-bottom': 10}).innerText(title);
          paper.get_contents().appendChild(header);

          var selected_option = $.createElement('p').style({'color': '#ff0000', 'padding-left': 20}).innerText("Your selection: " + options[user_response.selected_option - 1]);
          paper.get_contents().appendChild(selected_option);

          var explanation = $.createElement('p').style({'color': '#ffb300', 'padding-left': 20}).innerText(question.explanation);
          paper.get_contents().appendChild(explanation);
        }
      });
    } else {
      console.error('Quiz has been formatted incorrectly. See other JSON attributes.');
    }
  }

  display_questions();

  var button_div = $.createElement('div').style({'height': 36, 'padding-top': 8});
  var button_container = $.createElement('div').style({'float': 'right'});

  button_container.appendChild(this.get_button(
    'Continue',
    {}
  )).addEventListener('click', function() {
    for (var i = 0; i < 3; i++) {
      self.render_previous(true);
    }
  });

  button_div.appendChild(button_container);
  paper.get_contents().appendChild(button_div);
};
