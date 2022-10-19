import "jquery"
import 'jquery-ui/ui/widget'
import 'jquery-ui/ui/widgets/mouse'
import '../../tools/jquery.ui.touch.punch'
import 'jquery-ui/ui/widgets/sortable'
import '@accursoft/jquery-caret'

Array.prototype.swap = function (x, y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}

String.prototype.customSplice = function (index, absIndex, string) {
  return this.slice(0, index) + string + this.slice(index + Math.abs(absIndex));
};

String.prototype.replaceString = function (index, string) {
  if (index > 0) return this.substring(0, index) + string + this.substr(index);

  return string + this;
};