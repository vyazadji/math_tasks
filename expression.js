var Expression = (function(superClass) {
  var  hasProp = {}.hasOwnProperty;
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  extend(_Expression, superClass);

  function _Expression(a, b, operation) {
    this.a = a;
    this.b = b;
    this.operation = operation;
  }

  _Expression.prototype.getValue = function() {
    switch (this.operation) {
      case Operation.ADDITION:
        return this.a.getValue() + this.b.getValue();
      case Operation.SUBTRACTION:
        return this.a.getValue() - this.b.getValue();
      case Operation.MULTIPLICATION:
        return this.a.getValue() * this.b.getValue();
      case Operation.DIVISION:
        return this.a.getValue() / this.b.getValue();
    }
  };

  _Expression.prototype.print = function(operations) {
    var out;
    out = this.a.print({
      rightOperation: this.operation
    }) + " " + this.operation + " " + this.b.print({
      leftOperation: this.operation
    });
    if (this._useBrackets(operations)) {
      out = "(" + out + ")";
    }
    return out;
  };

  _Expression.prototype._useBrackets = function(operations) {
    var useBrackets;
    useBrackets = false;
    if (!operations) {
      return useBrackets;
    }
    if (operations.leftOperation) {
      return this._checkLeftOperation(operations.leftOperation);
    }
    if (operations.rightOperation) {
      return this._checkRightOperation(operations.rightOperation);
    }
    return useBrackets;
  };

  _Expression.prototype._checkLeftOperation = function(leftOperation) {
    var useBrackets;
    useBrackets = false;
    if (leftOperation !== Operation.ADDITION) {
      useBrackets = true;
    }
    if (leftOperation === Operation.MULTIPLICATION && this.operation === Operation.MULTIPLICATION) {
      useBrackets = false;
    }
    return useBrackets;
  };

  _Expression.prototype._checkRightOperation = function(rightOperation) {
    var useBrackets;
    useBrackets = false;
    if (rightOperation === Operation.MULTIPLICATION || rightOperation === Operation.DIVISION) {
      useBrackets = true;
    }
    return useBrackets;
  };

  return _Expression;

})(NumberExp);
