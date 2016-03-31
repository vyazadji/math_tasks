var Operation = {
  ADDITION: "+",
  SUBTRACTION: "-",
  MULTIPLICATION: "*",
  DIVISION: "/"
};


function NumberExp(number) {
  this.number = number;
}

NumberExp.prototype.getValue = function() {
  return this.number;
};

NumberExp.prototype.print = function() {
  return this.number.toString();
};
