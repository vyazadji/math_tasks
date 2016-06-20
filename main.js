'use strict'

/*
var dataTasks = [
  {id: 1, text: "1+2", value: 3},
];
*/
var dataTasks = [];


var generator = new Generator();
var exp;

var task_level = 4;
var tasks_in_page = 40;

for (var i = 0; i < tasks_in_page; i++) {
  exp = generator.generate(generator._getRandomNumber(4,2));
  dataTasks.push({
    id: i,
    text: exp.print(),
    value: exp.getValue()
  });
}


var Tasks = React.createClass({

  render: function() {
    var taskNodes = this.props.tasks.map(function (task) {
      return (
        <Task ref={'task-'+task.id} key={task.id} text={task.text} value={task.value}></Task>
        )
    })

    return (
      <div>
      {taskNodes}
      </div>
      )
  }
});

var Task = React.createClass({
  getInitialState: function() {
    return {
      answer: null,
      isError: false
    };
  },

  handleChange : function(event) {
    this.setState({answer: event.target.value});
  },
  isValid() {
    return this.props.value === parseInt(this.state.answer, 10);
  },
  render: function() {
    var css_class = this.state.isError ? 'error_border' : '';
    return <div className="task"><span >{this.props.text} = </span> <input type="text" className={css_class} onChange={this.handleChange}  value={this.state.answer}/> <span className='hide'>({this.props.value})</span></div>;
  }
});


var App = React.createClass({
  getInitialState: function() {
    return {
      messageClass: 'hide',
      messageText: '',
      results: []
    };
  },
  checkTasks: function() {
    var taskComponent = this.refs.tasks;
    var tasks = this.refs.tasks.refs;
    var errors = 0;
    for (var taskName in tasks) {
      var task = tasks[taskName];
      if (!task.isValid()) {
        errors++
        task.setState({"isError": true})
      } else {
        task.setState({"isError": false})
      }
    }

    var attempt = this.state.results.length + 1;

    var strResult = `Попытка ${attempt}:`;
    var result = {};
    if(errors > 0) {
      result = {
        messageClass: 'error',
        messageText: strResult + "У тебя есть ошибки: " + errors + " неправильных примеров"
      }
    } else {
      result = {
        messageClass: 'ok',
        messageText: strResult + "Ура !. Все правильно !"
      };
    }


    this.setState({"results": this.state.results.concat([result])})

  },
  render: function() {
    console.log(this.state.results)
      debugger;
    var results = this.state.results.map(function (result) {
      return <div className={result.messageClass}>{result.messageText}</div>
    })
    return (
      <div>
        <div className="header"> Реши примеры: </div>
        <div><Tasks ref='tasks' tasks={dataTasks}/></div>
        <div> <button onClick={this.checkTasks}>Проверить</button> </div>
        <div>
          {results}
        </div>
      </div>
      )
  }
});

ReactDOM.render(
    <App/>,
    document.getElementById('app')
    );
