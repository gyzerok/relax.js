'use strict';

var ENTER_KEY_CODE = 13;

var InputText = React.createClass({

    getInitialState() {
        return {
            value: this.props.value || ''
        }
    },

    render() {
        return (
            <input
                id={this.props.id}
                type="text"
                value={this.state.value}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                autoFocus="true"
            />
        )
    },

    onChange(e) {
        this.setState({ value: e.target.value });
    },

    onKeyDown(e) {
        if (e.keyCode === ENTER_KEY_CODE) {
            this.props.onSave(this.state.value);
            this.setState({ value: '' });
        }
    }
});

module.exports = InputText;