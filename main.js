'use strict'

/*
var dataTasks = [
  {id: 1, text: "1+2", value: 3},
  {id: 2, text: "2*2", value: 4},
];
*/
var dataTasks = [];


var generator = new Generator();
var exp;

var task_level = 4;
var tasks_in_page = 20;

for (var i = 0; i < tasks_in_page; i++) {
  exp = generator.generate(generator._getRandomNumber(4,3));
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
    return {answer: null};
  },

  handleChange : function(event) {
    this.setState({answer: event.target.value});
  },
  isValid() {
    return this.props.value === parseInt(this.state.answer, 10);
  },
  render: function() {
    return <div className='task'><span >{this.props.text} = </span> <input type="text" onChange={this.handleChange}  value={this.state.answer}/> <span className='hide'>({this.props.value})</span></div>;
  }
});


var App = React.createClass({
  getInitialState: function() {
    return {
      messageClass: 'hide',
      messageText: ''
    };
  },
  checkTasks: function() {
    var taskComponent = this.refs.tasks;
    var tasks = this.refs.tasks.refs;
    var errors = 0;
    for (var taskName in tasks) {
      if (!tasks[taskName].isValid()) errors++
    }

    if(errors > 0) {
      this.setState({
        messageClass: 'error',
        messageText: "У тебя есть ошибки: " + errors + " неправильных примеров"
      })
    } else {
      this.setState({
        messageClass: 'ok',
        messageText: 'Все правильно !'
      })
    }

  },
  render: function() {
    return (
      <div>
        <div className="header"> Реши примеры: </div>
        <div><Tasks ref='tasks' tasks={dataTasks}/></div>
        <div> <button onClick={this.checkTasks}>Проверить</button> </div>
        <div className={this.state.messageClass}>{this.state.messageText}</div>
      </div>
      )
  }
});

ReactDOM.render(
    <App/>,
    document.getElementById('app')
    );
