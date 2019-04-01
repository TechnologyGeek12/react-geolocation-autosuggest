var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

var selectedItemValue = {};
var isDisable = false;
var styles = function styles(theme) {
    return {
        root: {
            // height: 250,
            flexGrow: 1
            // width:300
        },
        container: {
            position: 'relative'
        },
        suggestionsContainerOpen: {
            position: 'absolute',
            zIndex: 1,
            marginTop: theme.spacing.unit,
            left: 0,
            right: 0
        },
        suggestion: {
            display: 'block'
        },
        suggestionsList: {
            margin: 0,
            padding: 0,
            listStyleType: 'none'
        },
        divider: {
            height: theme.spacing.unit * 2
        },
        displayInlineBlock: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 10
        },
        displaySeprateBlock: {
            width: '100%'
        },
        input: {
            borderBottom: '1px solid #2196f3'
        },
        focused: {
            borderBottom: '1px solid #2196f3',
            color: '#2196f3'
        },
        floatingLabelFocusStyle: {
            focused: {
                color: "#00ff00"
            }
        }
    };
};

function renderSuggestion(suggestion, _ref) {
    var query = _ref.query,
        isHighlighted = _ref.isHighlighted;

    var matches = match(suggestion.description, query);
    var parts = parse(suggestion.description, matches);

    return React.createElement(
        MenuItem,
        { selected: isHighlighted, component: 'div' },
        React.createElement(
            'div',
            null,
            parts.map(function (part, index) {
                return part.highlight ? React.createElement(
                    'span',
                    { key: String(index), style: { fontWeight: 500 } },
                    part.text
                ) : React.createElement(
                    'strong',
                    { key: String(index), style: { fontWeight: 300 } },
                    part.text
                );
            })
        )
    );
}

function getSuggestionValue(suggestion) {
    selectedItemValue = suggestion;
    return suggestion.description;
}

var GeoLocation = function (_Component) {
    _inherits(GeoLocation, _Component);

    function GeoLocation(props) {
        _classCallCheck(this, GeoLocation);

        var _this = _possibleConstructorReturn(this, (GeoLocation.__proto__ || Object.getPrototypeOf(GeoLocation)).call(this, props));

        _this.renderInputComponent = function (inputProps) {
            var classes = inputProps.classes,
                _inputProps$inputRef = inputProps.inputRef,
                _inputRef = _inputProps$inputRef === undefined ? function () {} : _inputProps$inputRef,
                ref = inputProps.ref,
                other = _objectWithoutProperties(inputProps, ['classes', 'inputRef', 'ref']);

            return React.createElement(TextField, Object.assign({
                fullWidth: true,
                underlinefocusstyle: styles.underlineStyle,
                label: isDisable ? 'Add Google Api key in your index.html file to activate this field' : _this.props.addressLabelText,
                InputProps: {
                    inputRef: function inputRef(node) {
                        ref(node);
                        _inputRef(node);
                    },
                    classes: {
                        // input: classes.input,
                        // focused: classes.focused,
                    }
                }
            }, other));
        };

        _this.getSuggestions = function (value) {
            var inputValue = deburr(value.trim()).toLowerCase();
            var inputLength = inputValue.length;
            var count = 0;
            return inputLength === 0 ? [] : _this.state.suggestions.filter(function (suggestion) {
                var keep = count < 5 && suggestion.description.slice(0, inputLength).toLowerCase() === inputValue;

                if (keep) {
                    count += 1;
                }

                return keep;
            });
        };

        _this.handleSuggestionsFetchRequested = function (_ref2) {
            var value = _ref2.value;

            _this.setState({
                suggestions: _this.getSuggestions(value)
            });
        };

        _this.handleSuggestionsClearRequested = function () {
            _this.setState({
                suggestions: []
            });
        };

        _this.handleChange = function (name) {
            return function (event, _ref3) {
                var _this$setState;

                var newValue = _ref3.newValue;

                var componentForm = {
                    street_number: 'long_name',
                    route: 'long_name',
                    locality: 'long_name',
                    administrative_area_level_1: 'long_name',
                    country: 'long_name',
                    postal_code: 'long_name',
                    lat: '0.0',
                    lng: '0.0',
                    description: '',
                    countryFullDetail: '',
                    stateFullDetail: '',
                    cityFullDetail: ''
                };
                _this.setState((_this$setState = {}, _defineProperty(_this$setState, name, newValue), _defineProperty(_this$setState, 'componentForm', componentForm), _defineProperty(_this$setState, 'preSelectedValue', ''), _this$setState));
                _this.updateInput(newValue);
                _this.props.onChange && _this.props.onChange(newValue);
            };
        };

        _this.onItemSelection = function (e) {
            var item = selectedItemValue;
            var componentForm = {
                street_number: 'long_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'long_name',
                country: 'long_name',
                postal_code: 'long_name',
                lat: '0.0',
                lng: '0.0',
                description: '',
                countryFullDetail: '',
                stateFullDetail: '',
                cityFullDetail: ''
            };
            _this.getLatLgn(item.place_id, function (place) {
                for (var i = 0; i < place[0].address_components.length; i++) {
                    var addressType = place[0].address_components[i].types[0];
                    if (componentForm[addressType]) {
                        var val = place[0].address_components[i][componentForm[addressType]];
                        componentForm[addressType] = val;
                    }
                    if (addressType === "country") {
                        var _val = place[0].address_components[i];
                        componentForm['countryFullDetail'] = _val;
                    }
                    if (addressType === "administrative_area_level_1") {
                        var _val2 = place[0].address_components[i];
                        componentForm['stateFullDetail'] = _val2;
                    }
                    if (addressType === "locality") {
                        var _val3 = place[0].address_components[i];
                        componentForm['cityFullDetail'] = _val3;
                    }
                }
                if (!componentForm['postal_code'] || componentForm['postal_code'] === 'long_name') {
                    componentForm['postal_code'] = '00000';
                }
                // get lat and get lng
                componentForm['lat'] = place[0].geometry.location.lat();
                componentForm['lng'] = place[0].geometry.location.lng();
                componentForm.description = item.description;
                // this.props.getFullAddress(componentForm);
            });
            setTimeout(function () {
                _this.setState({ componentForm: componentForm }, function () {
                    return _this.onSelect(componentForm);
                });
            }, 300);
        };

        _this.setFieldValue = function (name, e) {
            var componentForm = _this.state.componentForm;
            componentForm[name] = e.target.value;
            _this.setState({ componentForm: componentForm });
        };

        _this.updateOnSelectData = function () {
            _this.onSelect(_this.state.componentForm);
        };

        _this.onSelect = function (data) {
            _this.props.onSelect && _this.props.onSelect(data);
        };

        _this.state = {
            data: [],
            searchText: _this.props.preSelectedValue || '',
            single: _this.props.preSelectedValue || '',
            popper: '',
            suggestions: [],
            componentForm: {},
            preSelectedValue: _this.props.preSelectedValue
        };

        var google = window.google;
        if (google) {
            _this.geocoder = new google.maps.Geocoder();

            // Documentation for AutocompleteService
            // https://developers.google.com/maps/documentation/javascript/places-autocomplete#place_autocomplete_service
            _this.service = new google.maps.places.AutocompleteService(null);
        } else {
            isDisable = true;
        }
        // binding for functions
        _this.updateInput = _this.updateInput.bind(_this);
        _this.populateData = _this.populateData.bind(_this);
        _this.getCurrentDataState = _this.getCurrentDataState.bind(_this);
        _this.getLatLgn = _this.getLatLgn.bind(_this);
        // this.onClose = this.onClose.bind(this);
        return _this;
    }

    _createClass(GeoLocation, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.preSelectedValue && this.updateInput(this.props.preSelectedValue);
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps) {
            var _this2 = this;

            if (nextProps.preSelectedValue && this.props.preSelectedValue !== nextProps.preSelectedValue) {
                this.setState({ preSelectedValue: nextProps.preSelectedValue, single: nextProps.preSelectedValue, searchText: nextProps.preSelectedValue }, function () {
                    return _this2.updateInput(nextProps.preSelectedValue);
                });
            }
        }
    }, {
        key: 'getCurrentDataState',
        value: function getCurrentDataState() {
            return this.state.data;
        }
    }, {
        key: 'getLatLgn',
        value: function getLatLgn(locationID, cb) {
            this.geocoder.geocode({ placeId: locationID }, function (results, status) {
                cb(results, status);
            });
        }
    }, {
        key: 'updateInput',
        value: function updateInput(searchText) {
            var _this3 = this;

            if (searchText && searchText.trim().length > 0) {
                this.setState({
                    searchText: searchText
                }, function () {
                    var outerScope = _this3;
                    _this3.service.getPlacePredictions({
                        input: _this3.state.searchText,
                        // componentRestrictions: { country: 'us' },
                        // componentRestrictions:{ country: ["us","au"] },
                        types: _this3.props.types
                    }, function (predictions, fd) {

                        if (predictions) {
                            outerScope.populateData(predictions);
                        }
                    });
                });
            } else {
                this.setState({
                    searchText: ''
                });
            }
        }
    }, {
        key: 'populateData',
        value: function populateData(array) {
            if (this.state.preSelectedValue) {
                selectedItemValue = array.length && array[0];
                selectedItemValue && this.onItemSelection();
            } else {
                this.setState({ data: array });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var classes = this.props.classes;

            var autosuggestProps = {
                renderInputComponent: this.renderInputComponent,
                suggestions: this.state.data,
                onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
                onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
                onSuggestionSelected: this.onItemSelection,
                focusInputOnSuggestionClick: false,
                getSuggestionValue: getSuggestionValue,
                renderSuggestion: renderSuggestion
            };
            var count = 0;
            // if (!this.props.fixedWidthFields) {
            if (this.props.isCountryVisible) count++;
            if (this.props.isStateVisible) count++;
            if (this.props.isCityVisible) count++;
            if (this.props.isPinCodeVisible) count++;
            if (this.props.showAllFields) count = 4;
            // }
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: classes.root, key: this.props.key },
                    React.createElement(Autosuggest, Object.assign({}, autosuggestProps, {
                        inputProps: {
                            classes: classes,
                            // placeholder: 'Search here...',
                            value: this.state.single,
                            onChange: this.handleChange('single'),
                            disabled: isDisable
                        },
                        theme: {
                            container: classes.container,
                            suggestionsContainerOpen: classes.suggestionsContainerOpen,
                            suggestionsList: classes.suggestionsList,
                            suggestion: classes.suggestion
                        },
                        renderSuggestionsContainer: function renderSuggestionsContainer(options) {
                            return React.createElement(
                                Paper,
                                Object.assign({}, options.containerProps, { square: true }),
                                options.children
                            );
                        }
                    })),
                    this.props.errorText && React.createElement(
                        'span',
                        { style: { color: 'red' } },
                        this.props.errorText
                    )
                ),
                this.props.displayInline && React.createElement(
                    'div',
                    { className: classes.displayInlineBlock },
                    (this.props.isCountryVisible || this.props.showAllFields) && React.createElement(TextField, {
                        label: this.props.countryLabelText,
                        value: this.state.componentForm.country && this.state.componentForm.country !== 'long_name' ? this.state.componentForm.country : '',
                        onChange: function onChange(e) {
                            return _this4.setFieldValue('country', e);
                        },
                        style: { width: (count === 1 ? 100 : 100 / count - 1) + '%' },
                        disabled: this.props.isCountryDisabled || this.props.isAllDisabled || !this.state.searchText ? true : false,
                        onBlur: this.updateOnSelectData
                    }),
                    (this.props.isStateVisible || this.props.showAllFields) && React.createElement(TextField, {
                        label: this.props.stateLabelText,
                        value: this.state.componentForm.administrative_area_level_1 && this.state.componentForm.administrative_area_level_1 !== 'long_name' ? this.state.componentForm.administrative_area_level_1 : '',
                        onChange: function onChange(e) {
                            return _this4.setFieldValue('administrative_area_level_1', e);
                        },
                        style: { width: (count === 1 ? 100 : 100 / count - 1) + '%' },
                        disabled: this.props.isStateDisabled || this.props.isAllDisabled || !this.state.searchText ? true : false,
                        onBlur: this.updateOnSelectData
                    }),
                    (this.props.isCityVisible || this.props.showAllFields) && React.createElement(TextField, {
                        label: this.props.cityLabelText,
                        value: this.state.componentForm.locality && this.state.componentForm.locality !== 'long_name' ? this.state.componentForm.locality : '',
                        onChange: function onChange(e) {
                            return _this4.setFieldValue('locality', e);
                        },
                        style: { width: (count === 1 ? 100 : 100 / count - 1) + '%' },
                        disabled: this.props.isCityDisabled || this.props.isAllDisabled || !this.state.searchText ? true : false,
                        onBlur: this.updateOnSelectData
                    }),
                    (this.props.isPinCodeVisible || this.props.showAllFields) && React.createElement(TextField, {
                        label: this.props.pincodeLabelText,
                        value: this.state.componentForm.postal_code && this.state.componentForm.postal_code !== '00000' && this.state.componentForm.postal_code !== 'long_name' ? this.state.componentForm.postal_code : '',
                        onChange: function onChange(e) {
                            return _this4.setFieldValue('postal_code', e);
                        },
                        style: { width: (count === 1 ? 100 : 100 / count - 1) + '%' },
                        disabled: this.props.isPinCodeDisabled || this.props.isAllDisabled || !this.state.searchText ? true : false,
                        onBlur: this.updateOnSelectData
                    })
                ),
                !this.props.displayInline && React.createElement(
                    'div',
                    { className: classes.displaySeprateBlock },
                    (this.props.isCountryVisible || this.props.showAllFields) && React.createElement(TextField, {
                        label: this.props.countryLabelText,
                        value: this.state.componentForm.country && this.state.componentForm.country !== 'long_name' ? this.state.componentForm.country : '',
                        onChange: function onChange(e) {
                            return _this4.setFieldValue('country', e);
                        },
                        style: { width: '100%', marginTop: 10 },
                        disabled: this.props.isCountryDisabled || this.props.isAllDisabled || !this.state.searchText ? true : false,
                        onBlur: this.updateOnSelectData
                    }),
                    (this.props.isStateVisible || this.props.showAllFields) && React.createElement(TextField, {
                        label: this.props.stateLabelText,
                        value: this.state.componentForm.administrative_area_level_1 && this.state.componentForm.administrative_area_level_1 !== 'long_name' ? this.state.componentForm.administrative_area_level_1 : '',
                        onChange: function onChange(e) {
                            return _this4.setFieldValue('administrative_area_level_1', e);
                        },
                        style: { width: '100%', marginTop: 10 },
                        disabled: this.props.isStateDisabled || this.props.isAllDisabled || !this.state.searchText ? true : false,
                        onBlur: this.updateOnSelectData
                    }),
                    (this.props.isCityVisible || this.props.showAllFields) && React.createElement(TextField, {
                        label: this.props.cityLabelText,
                        value: this.state.componentForm.locality && this.state.componentForm.locality !== 'long_name' ? this.state.componentForm.locality : '',
                        onChange: function onChange(e) {
                            return _this4.setFieldValue('locality', e);
                        },
                        style: { width: '100%', marginTop: 10 },
                        disabled: this.props.isCityDisabled || this.props.isAllDisabled || !this.state.searchText ? true : false,
                        onBlur: this.updateOnSelectData
                    }),
                    (this.props.isPinCodeVisible || this.props.showAllFields) && React.createElement(TextField, {
                        label: this.props.pincodeLabelText,
                        value: this.state.componentForm.postal_code && this.state.componentForm.postal_code !== '00000' && this.state.componentForm.postal_code !== 'long_name' ? this.state.componentForm.postal_code : '',
                        onChange: function onChange(e) {
                            return _this4.setFieldValue('postal_code', e);
                        },
                        style: { width: '100%', marginTop: 10 },
                        disabled: this.props.isPinCodeDisabled || this.props.isAllDisabled || !this.state.searchText ? true : false,
                        onBlur: this.updateOnSelectData
                    })
                )
            );
        }
    }]);

    return GeoLocation;
}(Component);

GeoLocation.propTypes = {
    classes: PropTypes.object.isRequired
};

GeoLocation.defaultProps = {
    showAllFields: true,
    isAllDisabled: false,
    isCountryVisible: false,
    isStateVisible: false,
    isCityVisible: false,
    isPinCodeVisible: false,
    isCountryDisabled: false,
    isStateDisabled: false,
    isCityDisabled: false,
    isPinCodeDisabled: false,
    displayInline: true,
    addressLabelText: 'Search Address...',
    errorText: '',
    countryLabelText: 'Country',
    stateLabelText: 'State',
    cityLabelText: 'City',
    pincodeLabelText: 'Pin code',
    key: 'autosuggestAddressSearch',
    preSelectedValue: ''
    // fixedWidthFields: true
};

export default withStyles(styles)(GeoLocation);