var estraverse = require('estraverse');
var Scope = require('./scope');


exports.analyze = function(ast) {
  var topScope, scope;

  if (ast.type !== 'Program') {
    // Create a top level scope.
    topScope = scope = new Scope();
  }

  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (exports.isScopeRequired(node)) {
        scope = scope ? scope.createChild(node) : new Scope(node);
        if (!topScope) {
          topScope = scope;
        }
      }

      switch (node.type) {
      case 'AssignmentExpression':
        scope.assign(node);
        scope.reference(node.left);
        scope.reference(node.right);
        break;

      case 'ArrayExpression':
        node.elements.forEach(scope.reference.bind(scope));
        break;

      case 'BlockStatement':
        break;

      case 'BinaryExpression':
        scope.reference(node.left);
        scope.reference(node.right);
        break;

      case 'BreakStatement':
        break;

      case 'CallExpression':
        scope.reference(node.callee);
        node.arguments.forEach(scope.reference.bind(scope));
        break;

      case 'CatchClause':
        break;

      case 'ConditionalExpression':
        scope.reference(node.test);
        scope.reference(node.consequent);
        scope.reference(node.alternate);
        break;

      case 'ContinueStatement':
        break;

      case 'DirectiveStatement':
        break;

      case 'DoWhileStatement':
        scope.reference(node.test);
        break;

      case 'DebuggerStatement':
        break;

      case 'EmptyStatement':
        break;

      case 'ExpressionStatement':
        scope.reference(node.expression);
        break;

      case 'ForStatement':
        scope.reference(node.init);
        scope.reference(node.test);
        scope.reference(node.update);
        break;

      case 'ForInStatement':
        scope.reference(node.left);
        scope.reference(node.right);
        break;

      case 'FunctionDeclaration':
        scope.parent.declare(node.id, node);
        node.params.forEach(function(param) {
          scope.declare(param)
        });
        break;

      case 'FunctionExpression':
        node.params.forEach(function(param) {
          scope.declare(param)
        });
        break;

      case 'Identifier':
        break;

      case 'IfStatement':
        scope.reference(node.test);
        break;

      case 'Literal':
        break;

      case 'LabeledStatement':
        break;

      case 'LogicalExpression':
        scope.reference(node.left);
        scope.reference(node.right);
        break;

      case 'MemberExpression':
        break;

      case 'NewExpression':
        scope.reference(node.callee);
        node.arguments.forEach(scope.reference.bind(scope));
        break;

      case 'ObjectExpression':
        break;

      case 'Program':
        break;

      case 'Property':
        scope.reference(node.value);
        break;

      case 'ReturnStatement':
        scope.reference(node.argument);
        break;

      case 'SequenceExpression':
        node.expressions.forEach(scope.reference.bind(scope));
        break;

      case 'SwitchStatement':
        scope.reference(node.discriminant);
        break;

      case 'SwitchCase':
        scope.reference(node.test);
        break;

      case 'ThisExpression':
        break;

      case 'ThrowStatement':
        scope.reference(node.argument);
        break;

      case 'TryStatement':
        break;

      case 'UnaryExpression':
        scope.reference(node.argument);
        break;

      case 'UpdateExpression':
        scope.reference(node.argument);
        break;

      case 'VariableDeclaration':
        break;

      case 'VariableDeclarator':
        scope.declare(node.id, node.init ? node : null);
        scope.reference(node.init);
        break;

      case 'WhileStatement':
        scope.reference(node.test);
        break;

      case 'WithStatement':
        scope.reference(node.object);
        break;
      }
    },
    leave: function(node, parent) {
      if (exports.isScopeRequired(node)) {
        scope = scope.parent;
      }
    }
  });

  return topScope;
};


exports.isScopeRequired = function(node) {
  switch (node.type) {
  case 'FunctionExpression':
  case 'FunctionDeclaration':
  case 'Program':
    return true;
  }
  return false;
};