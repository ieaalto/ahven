'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactTweetEmbed = require('react-tweet-embed');

var _reactTweetEmbed2 = _interopRequireDefault(_reactTweetEmbed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = require('jquery');

var ContentContainer = function (_React$Component) {
    _inherits(ContentContainer, _React$Component);

    function ContentContainer() {
        _classCallCheck(this, ContentContainer);

        return _possibleConstructorReturn(this, (ContentContainer.__proto__ || Object.getPrototypeOf(ContentContainer)).apply(this, arguments));
    }

    _createClass(ContentContainer, [{
        key: 'render',
        value: function render() {
            var listElements = this.props.elements.map(function (element) {
                var content = element.type == 'tweet' ? _react2.default.createElement(_reactTweetEmbed2.default, { id: element.id }) : element.content;
                var className = element.sentiment === 1 ? 'positive' : 'negative';

                return _react2.default.createElement(
                    'li',
                    { className: className },
                    element.political && _react2.default.createElement(
                        'span',
                        { className: 'topic-label' },
                        'Politics'
                    ),
                    _react2.default.createElement(
                        'div',
                        null,
                        content
                    )
                );
            });

            return _react2.default.createElement(
                'ul',
                { className: 'content-container' },
                listElements
            );
        }
    }]);

    return ContentContainer;
}(_react2.default.Component);

var Form = function (_React$Component2) {
    _inherits(Form, _React$Component2);

    function Form(props) {
        _classCallCheck(this, Form);

        var _this2 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

        _this2.state = {
            "value": ""
        };
        _this2.handleChange = _this2.handleChange.bind(_this2);
        _this2.handleSubmit = _this2.handleSubmit.bind(_this2);
        return _this2;
    }

    _createClass(Form, [{
        key: 'handleChange',
        value: function handleChange(event) {
            this.setState({ 'value': event.target.value });
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(event) {
            event.preventDefault();
            this.props.onSubmit({
                type: this.type,
                content: this.state.value
            });
        }
    }]);

    return Form;
}(_react2.default.Component);

var TextForm = function (_Form) {
    _inherits(TextForm, _Form);

    function TextForm(props) {
        _classCallCheck(this, TextForm);

        var _this3 = _possibleConstructorReturn(this, (TextForm.__proto__ || Object.getPrototypeOf(TextForm)).call(this, props));

        _this3.type = 'text';
        return _this3;
    }

    _createClass(TextForm, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'action' },
                _react2.default.createElement(
                    'h4',
                    null,
                    'Type something to classify:'
                ),
                _react2.default.createElement(
                    'form',
                    { onSubmit: this.handleSubmit, className: 'form' },
                    _react2.default.createElement('textarea', { value: this.state.value, onChange: this.handleChange, rows: '2', className: 'form-control' }),
                    _react2.default.createElement('input', { type: 'submit', value: 'Classify', className: 'btn btn-primary' })
                )
            );
        }
    }]);

    return TextForm;
}(Form);

var TwitterQueryForm = function (_Form2) {
    _inherits(TwitterQueryForm, _Form2);

    function TwitterQueryForm(props) {
        _classCallCheck(this, TwitterQueryForm);

        var _this4 = _possibleConstructorReturn(this, (TwitterQueryForm.__proto__ || Object.getPrototypeOf(TwitterQueryForm)).call(this, props));

        _this4.type = 'twitter';
        return _this4;
    }

    _createClass(TwitterQueryForm, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'action' },
                _react2.default.createElement(
                    'h4',
                    null,
                    '...or search tweets to be classified:'
                ),
                _react2.default.createElement(
                    'form',
                    { onSubmit: this.handleSubmit, className: 'form' },
                    _react2.default.createElement('input', { type: 'text', value: this.state.value, onChange: this.handleChange, className: 'form-control' }),
                    _react2.default.createElement('input', { type: 'submit', value: 'Search', className: 'btn btn-primary' })
                )
            );
        }
    }]);

    return TwitterQueryForm;
}(Form);

var Actions = function (_React$Component3) {
    _inherits(Actions, _React$Component3);

    function Actions() {
        _classCallCheck(this, Actions);

        return _possibleConstructorReturn(this, (Actions.__proto__ || Object.getPrototypeOf(Actions)).apply(this, arguments));
    }

    _createClass(Actions, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'actions' },
                _react2.default.createElement(TextForm, { onSubmit: this.props.onSubmit }),
                _react2.default.createElement(TwitterQueryForm, { onSubmit: this.props.onSubmit })
            );
        }
    }]);

    return Actions;
}(_react2.default.Component);

var App = function (_React$Component4) {
    _inherits(App, _React$Component4);

    function App(props) {
        _classCallCheck(this, App);

        var _this6 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this6.state = {
            classified_content: []
        };

        _this6.getClassifications = _this6.getClassifications.bind(_this6);
        return _this6;
    }

    _createClass(App, [{
        key: 'getClassifications',
        value: function getClassifications(data) {
            var _this7 = this;

            $.ajax({
                url: '/classify/',
                type: 'POST',
                data: data,
                dataType: 'json',
                complete: function complete(response, status) {
                    if (status == 'success') {
                        _this7.setState({ classified_content: [] });
                        console.log(response.responseText);
                        _this7.setState({ classified_content: JSON.parse(response.responseText) });
                    }
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'container' },
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-lg-4' },
                        _react2.default.createElement(Actions, { onSubmit: this.getClassifications })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'col-lg-8' },
                        _react2.default.createElement(ContentContainer, { elements: this.state.classified_content })
                    )
                )
            );
        }
    }]);

    return App;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('root'));
