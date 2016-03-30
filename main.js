'use strict'
var Task = React.createClass({
render: function() {
            return <div>1 + 2 = 3</div>;
          }
});

var CheckButton = React.createClass({
render: function() {
            return <button>Проверить</button>;
          }
});

var App = React.createClass({
render: function() {
          return (
              <div>
                  <div className="header"> Реши примеры: </div>
                  <div><Task /></div>
                  <div> <CheckButton /> </div>
              </div>
            )
            }
});

ReactDOM.render(
      <App/>,
        document.getElementById('app')
    );
