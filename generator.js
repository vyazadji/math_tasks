function Generator(max1, min1) {
  this.config = {
    MAX: 100,
    MIN: 1,
    MAX_DIVIDEND: 60,
    MAX_DIVIDER: 6,
    MAX_MULTIPLIER: 10
  };

  this.max = max1 != null ? max1 : this.config.MAX;
  this.min = min1 != null ? min1 : this.config.MIN;
}



Generator.prototype.generate = function(level) {
  var atoms, exp, exp2;
  if (level > 2) {
    atoms = this._getAtoms(level);
    exp = this.generate(atoms[0]);
    if (atoms[1] > 0) {
      exp2 = this.generate(atoms[1]);
      exp = this.createExpression(exp, exp2);
    }
  } else {
    exp = this._buildExpresions(level);
  }
  return exp;
};

Generator.prototype._buildExpresions = function(level) {
  var exp;
  exp = this.createNumber();
  while (level > 1) {
    exp = this.createExpression(exp);
    level--;
  }
  return exp;
};

Generator.prototype._getAtoms = function(level) {
  var random;
  random = this._getRandomNumber(level - 1, 0);
  return [level - random, random];
};

Generator.prototype.createNumber = function(n) {
  if (n == null) {
    n = this._getRandomNumber();
  }
  return new NumberExp(n);
};

Generator.prototype.createExpression = function(a, b, operation) {
  var exp;
  if (operation == null) {
    operation = this._getRandomOperation();
  }

  if (a == null) {
    a = this.createNumber();
  }

  if (b == null) {
    b = this.createNumber();
  }
  exp = new Expression(a, b, operation);
  return this.correctExpresssionIfNeed(exp);
};

Generator.prototype.correctExpresssionIfNeed = function(exp) {
  var correctValueA, correctValueB, newExp, valueAabs, valueBabs;

  /*
  if (this.isInt(exp.getValue())) {
    return exp;
  }
  */


  valueAabs = Math.abs(exp.a.getValue());
  valueBabs = Math.abs(exp.b.getValue());

  if (exp.operation === Operation.DIVISION) {

    if (valueBabs === 0 && !this.isNumber(exp.b)) {
      newExp = this._changeOperationWithouDivision(exp);
      return newExp;
    }

    if (valueBabs > this.config.MAX_DIVIDER ) {
      if (this.isNumber(exp.b)) {
        exp.b = this.createNumber(this._getRandomNumber(this.config.MAX_DIVIDER));
        valueBabs = Math.abs(exp.b.getValue());
      } else {
        newExp = this._changeOperationWithouDivision(exp);
        return newExp;
      }
    }

    if (valueAabs > this.config.MAX_DIVIDEND) {
      if (this.isNumber(exp.a)) {
        correctValueA = this._correctNumberAForDivision(valueBabs);
        exp.a = this.createNumber(correctValueA);
        valueAabs = Math.abs(exp.a.getValue());
      } else {
        newExp = this._changeOperationWithouDivision(exp);
        return newExp;
      }
    }


    if (!this.isInt(exp.getValue())) {
      if (this.isNumber(exp.a)) {
        correctValueA = this._correctNumberAForDivision(valueBabs);
        exp.a = this.createNumber(correctValueA);
        valueAabs = Math.abs(exp.a.getValue());
      } else if (this.isNumber(exp.b)){
        correctValueB = this._correctNumberBForDivision(valueAabs);
        exp.b = this.createNumber(correctValueB);
        valueBabs = Math.abs(exp.b.getValue());
      } else {
        newExp = this._changeOperationWithouDivision(exp);
        return newExp;
      }
    }


    /*
    if (this.isNumber(exp.a) && valueBabs < (this.max / 2)) {
      correctValueA = this._correctNumberAForDivision(valueBabs);
      exp.a = this.createNumber(correctValueA);
      return exp;
    }

    if (this.isNumber(exp.b) && !this.isNumber(exp.a)) {
      correctValueB = this._correctNumberBForDivision(valueAabs);
      exp.b = this.createNumber(correctValueB);
      return exp;
    }
    */

  }

  if (exp.getValue() < 0 && exp.operation === Operation.SUBTRACTION) {
    if (this.isNumber(exp.a)) {
      exp.a = this.createNumber(this._getRandomNumber(this.max + 1, valueBabs));
      valueAabs = Math.abs(exp.a.getValue());
    } else if (this.isNumber(exp.b)) {
      exp.b = this.createNumber(this._getRandomNumber(valueAabs, this.min));
      valueBabs = Math.abs(exp.b.getValue());
    }

    if (exp.getValue() < 0) {
      exp.operation = Operation.ADDITION;
    }

  }

  if (exp.operation === Operation.MULTIPLICATION) {
    if (valueAabs > this.config.MAX_MULTIPLIER) {
      if (this.isNumber(exp.a)) {
        exp.a = this.createNumber(this._getRandomNumber(this.config.MAX_MULTIPLIER));
        valueAabs = Math.abs(exp.a.getValue());
      }
    }
    if (valueBabs > this.config.MAX_MULTIPLIER) {
      if (this.isNumber(exp.b)) {
        exp.b = this.createNumber(this._getRandomNumber(this.config.MAX_MULTIPLIER));
        valueBabs = Math.abs(exp.b.getValue());
      }
    }

    if (valueAabs > this.config.MAX_DIVIDER && valueBabs > this.config.MAX_DIVIDER) {
      if (this.isNumber(exp.a)) {
        exp.a = this.createNumber(this._getRandomNumber(this.config.MAX_DIVIDER));
        valueAabs = Math.abs(exp.a.getValue());
      } else if (this.isNumber(exp.b)) {
        exp.b = this.createNumber(this._getRandomNumber(this.config.MAX_DIVIDER));
        valueBabs = Math.abs(exp.b.getValue());
      } /*else {
        newExp = this._changeOperationWithouDivisionAndMultiplication(exp);
        return newExp;
      }
      */
    }

    if (exp.getValue() > this.config.MAX_DIVIDEND) {
      exp.operation = Operation.ADDITION;
    }
  }

  return exp;
  //return this._changeOperationWithouDivision(exp);
};

Generator.prototype._correctNumberAForDivision = function(valueB) {
  var maxMultiplier, randomMultiplier;
  //maxMultiplier = parseInt(this.max / valueB);
  maxMultiplier = parseInt(this.config.MAX_MULTIPLIER);
  randomMultiplier = this._getRandomNumber(maxMultiplier);
  return valueB * randomMultiplier;
};

Generator.prototype._correctNumberBForDivision = function(valueA) {
  var divider, maxDivider;
  //maxDivider = parseInt(valueA / 2);
  maxDivider = this.config.MAX_DIVIDER
  if (maxDivider > this.max) {
    maxDivider = this.max;
  }
  divider = this._getRandomNumber(maxDivider);
  if (divider < 1) {
    divider = 1;
  }
  while (valueA % divider !== 0) {
    divider--;
  }
  return divider;
};

Generator.prototype._changeOperationWithouDivision = function(exp) {
  var newOperation;
  newOperation = this._getRandomOperationNoDivision();
  exp.operation = newOperation;
  //return exp;
  return this.correctExpresssionIfNeed(exp);
};

Generator.prototype._changeOperationWithouDivisionAndMultiplication = function(exp) {
  var newOperation;
  newOperation = this._getRandomOperationNoDivisionAndMultiplication();
  exp.operation = newOperation;
  return this.correctExpresssionIfNeed(exp);
};

Generator.prototype.isNumber = function(exp) {
  return exp.constructor.name === NumberExp.name;
};

Generator.prototype.isInt = function(n) {
  return n % 1 === 0;
};

Generator.prototype._getRandomNumber = function(max, min) {
  if (max == null) {
    max = this.max;
  }
  if (min == null) {
    min = this.min;
  }
  max++;
  return Math.floor(Math.random() * (max - min) + min);
};

Generator.prototype._getRandomOperationNoDivision = function() {
  return this._getRandomOperation(Object.keys(Operation).length - 1); //TODO I don't like this approach
};

Generator.prototype._getRandomOperationNoDivisionAndMultiplication = function() {
  return this._getRandomOperation(Object.keys(Operation).length - 2); //TODO I don't like this approach
};

Generator.prototype._getRandomOperation = function(n) {
  if (n == null) {
    n = Object.keys(Operation).length;
  }
  switch (this._getRandomNumber(n)) {
    case 1:
      return Operation.ADDITION;
    case 2:
      return Operation.SUBTRACTION;
    case 3:
      return Operation.MULTIPLICATION;
    case 4:
      return Operation.DIVISION;
  }
};

