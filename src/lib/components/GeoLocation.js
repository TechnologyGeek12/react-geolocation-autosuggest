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

let selectedItemValue = {};
let isDisable = false;
const styles = theme => ({
    root: {
        // height: 250,
        flexGrow: 1,
        // width:300
    },
    container: {
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing.unit * 2,
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
});

function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.description, query);
    const parts = parse(suggestion.description, matches);

    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts.map((part, index) =>
                    part.highlight ? (
                        <span key={String(index)} style={{ fontWeight: 500 }}>
                            {part.text}
                        </span>
                    ) : (
                            <strong key={String(index)} style={{ fontWeight: 300 }}>
                                {part.text}
                            </strong>
                        ),
                )}
            </div>
        </MenuItem>
    );
}

function getSuggestionValue(suggestion) {
    selectedItemValue = suggestion;
    return suggestion.description;
}

class GeoLocation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            searchText: this.props.preSelectedValue || '',
            single: this.props.preSelectedValue || '',
            popper: '',
            suggestions: [],
            componentForm: {},
            preSelectedValue: this.props.preSelectedValue
        };

        const google = window.google;
        if (google) {
            this.geocoder = new google.maps.Geocoder();

            // Documentation for AutocompleteService
            // https://developers.google.com/maps/documentation/javascript/places-autocomplete#place_autocomplete_service
            this.service = new google.maps.places.AutocompleteService(null);
        }
        else {
            isDisable = true;
        }
        // binding for functions
        this.updateInput = this.updateInput.bind(this);
        this.populateData = this.populateData.bind(this);
        this.getCurrentDataState = this.getCurrentDataState.bind(this);
        this.getLatLgn = this.getLatLgn.bind(this);
        // this.onClose = this.onClose.bind(this);
    }

    componentWillMount() {
        this.props.preSelectedValue && this.updateInput(this.props.preSelectedValue);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.preSelectedValue && this.props.preSelectedValue !== nextProps.preSelectedValue) {
            this.setState({ preSelectedValue: nextProps.preSelectedValue }, () => this.updateInput(nextProps.preSelectedValue));
        }
    }

    renderInputComponent = (inputProps) => {
        const { classes, inputRef = () => { }, ref, ...other } = inputProps;

        return (
            <TextField
                fullWidth
                underlinefocusstyle={styles.underlineStyle}
                label={isDisable ? 'Add Google Api key in your index.html file to activate this field' : this.props.addressLabelText}
                InputProps={{
                    inputRef: node => {
                        ref(node);
                        inputRef(node);
                    },
                    classes: {
                        // input: classes.input,
                        // focused: classes.focused,
                    },
                }}
                {...other}
            />
        );
    }

    getSuggestions = (value) => {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
        return inputLength === 0
            ? []
            : this.state.suggestions.filter(suggestion => {
                const keep =
                    count < 5 && suggestion.description.slice(0, inputLength).toLowerCase() === inputValue;

                if (keep) {
                    count += 1;
                }

                return keep;
            });
    }

    getCurrentDataState() {
        return this.state.data;
    }

    getLatLgn(locationID, cb) {
        this.geocoder.geocode({ placeId: locationID }, (results, status) => {
            cb(results, status);
        });
    }

    updateInput(searchText) {
        if (searchText && searchText.trim().length > 0) {
            this.setState({
                searchText,
            },
                () => {
                    const outerScope = this;
                    this.service.getPlacePredictions({
                        input: this.state.searchText,
                        // componentRestrictions: { country: 'us' },
                        // componentRestrictions:{ country: ["us","au"] },
                        types: this.props.types,
                    },
                        (predictions, fd) => {

                            if (predictions) {
                                outerScope.populateData(predictions);
                            }
                        }
                    );
                });
        } else {
            this.setState({
                searchText: ''
            })
        }
    }

    populateData(array) {
        if (this.state.preSelectedValue) {
            selectedItemValue = array.length && array[0];
            selectedItemValue && this.onItemSelection();
        }
        else {
            this.setState({ data: array });
        }
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    handleChange = name => (event, { newValue }) => {
        let componentForm = {
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
        this.setState({
            [name]: newValue,
            componentForm: componentForm,
            preSelectedValue: ''
        });
        this.updateInput(newValue);
        this.props.onChange && this.props.onChange(newValue);
    };

    onItemSelection = (e) => {
        let item = selectedItemValue;
        let componentForm = {
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
        this.getLatLgn(item.place_id, (place) => {
            for (let i = 0; i < place[0].address_components.length; i++) {
                let addressType = place[0].address_components[i].types[0];
                if (componentForm[addressType]) {
                    let val = place[0].address_components[i][componentForm[addressType]];
                    componentForm[addressType] = val;
                }
                if (addressType === "country") {
                    let val = place[0].address_components[i];
                    componentForm['countryFullDetail'] = val;
                }
                if (addressType === "administrative_area_level_1") {
                    let val = place[0].address_components[i];
                    componentForm['stateFullDetail'] = val;
                }
                if (addressType === "locality") {
                    let val = place[0].address_components[i];
                    componentForm['cityFullDetail'] = val;
                }
            }
            if (!componentForm['postal_code'] || componentForm['postal_code'] === 'long_name') { componentForm['postal_code'] = '00000' }
            // get lat and get lng
            componentForm['lat'] = place[0].geometry.location.lat();
            componentForm['lng'] = place[0].geometry.location.lng();
            componentForm.description = item.description;
            // this.props.getFullAddress(componentForm);
        });
        setTimeout(() => {
            this.setState({ componentForm: componentForm }, () => this.onSelect(componentForm));
        }, 300)
    }

    setFieldValue = (name, e) => {
        let componentForm = this.state.componentForm;
        componentForm[name] = e.target.value;
        this.setState({ componentForm: componentForm });
    }

    updateOnSelectData = () => {
        this.onSelect(this.state.componentForm);
    }

    onSelect = (data) => {
        this.props.onSelect && this.props.onSelect(data);
    }

    render() {
        const { classes } = this.props;
        const autosuggestProps = {
            renderInputComponent: this.renderInputComponent,
            suggestions: this.state.data,
            onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
            onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
            onSuggestionSelected: this.onItemSelection,
            focusInputOnSuggestionClick: false,
            getSuggestionValue,
            renderSuggestion,
        };
        let count = 0;
        // if (!this.props.fixedWidthFields) {
        if (this.props.isCountryVisible)
            count++;
        if (this.props.isStateVisible)
            count++;
        if (this.props.isCityVisible)
            count++;
        if (this.props.isPinCodeVisible)
            count++;
        if (this.props.showAllFields)
            count = 4;
        // }
        return (
            <div>
                <div className={classes.root} key={this.props.key}>
                    <Autosuggest
                        {...autosuggestProps}
                        inputProps={{
                            classes,
                            // placeholder: 'Search here...',
                            value: this.state.single,
                            onChange: this.handleChange('single'),
                            disabled: isDisable
                        }}
                        theme={{
                            container: classes.container,
                            suggestionsContainerOpen: classes.suggestionsContainerOpen,
                            suggestionsList: classes.suggestionsList,
                            suggestion: classes.suggestion,
                        }}
                        renderSuggestionsContainer={options => (
                            <Paper {...options.containerProps} square>
                                {options.children}
                            </Paper>
                        )}
                    />
                    {this.props.errorText && <span style={{ color: 'red' }}>{this.props.errorText}</span>}
                </div>
                {this.props.displayInline && <div className={classes.displayInlineBlock}>
                    {(this.props.isCountryVisible || this.props.showAllFields) && <TextField
                        label={this.props.countryLabelText}
                        value={this.state.componentForm.country && this.state.componentForm.country !== 'long_name' ? this.state.componentForm.country : ''}
                        onChange={(e) => this.setFieldValue('country', e)}
                        style={{ width: `${count === 1 ? 100 : 100 / count - 1}%` }}
                        disabled={(this.props.isCountryDisabled || this.props.isAllDisabled || !this.state.searchText) ? true : false}
                        onBlur={this.updateOnSelectData}
                    />}

                    {(this.props.isStateVisible || this.props.showAllFields) && <TextField
                        label={this.props.stateLabelText}
                        value={this.state.componentForm.administrative_area_level_1 && this.state.componentForm.administrative_area_level_1 !== 'long_name' ? this.state.componentForm.administrative_area_level_1 : ''}
                        onChange={(e) => this.setFieldValue('administrative_area_level_1', e)}
                        style={{ width: `${count === 1 ? 100 : 100 / count - 1}%` }}
                        disabled={(this.props.isStateDisabled || this.props.isAllDisabled || !this.state.searchText) ? true : false}
                        onBlur={this.updateOnSelectData}
                    />}
                    {(this.props.isCityVisible || this.props.showAllFields) && <TextField
                        label={this.props.cityLabelText}
                        value={this.state.componentForm.locality && this.state.componentForm.locality !== 'long_name' ? this.state.componentForm.locality : ''}
                        onChange={(e) => this.setFieldValue('locality', e)}
                        style={{ width: `${count === 1 ? 100 : 100 / count - 1}%` }}
                        disabled={(this.props.isCityDisabled || this.props.isAllDisabled || !this.state.searchText) ? true : false}
                        onBlur={this.updateOnSelectData}
                    />}
                    {(this.props.isPinCodeVisible || this.props.showAllFields) && <TextField
                        label={this.props.pincodeLabelText}
                        value={this.state.componentForm.postal_code && this.state.componentForm.postal_code !== '00000' && this.state.componentForm.postal_code !== 'long_name' ? this.state.componentForm.postal_code : ''}
                        onChange={(e) => this.setFieldValue('postal_code', e)}
                        style={{ width: `${count === 1 ? 100 : 100 / count - 1}%` }}
                        disabled={(this.props.isPinCodeDisabled || this.props.isAllDisabled || !this.state.searchText) ? true : false}
                        onBlur={this.updateOnSelectData}
                    />}
                </div>}
                {!this.props.displayInline && <div className={classes.displaySeprateBlock}>
                    {(this.props.isCountryVisible || this.props.showAllFields) && <TextField
                        label={this.props.countryLabelText}
                        value={this.state.componentForm.country && this.state.componentForm.country !== 'long_name' ? this.state.componentForm.country : ''}
                        onChange={(e) => this.setFieldValue('country', e)}
                        style={{ width: '100%', marginTop: 10 }}
                        disabled={(this.props.isCountryDisabled || this.props.isAllDisabled || !this.state.searchText) ? true : false}
                        onBlur={this.updateOnSelectData}
                    />}

                    {(this.props.isStateVisible || this.props.showAllFields) && <TextField
                        label={this.props.stateLabelText}
                        value={this.state.componentForm.administrative_area_level_1 && this.state.componentForm.administrative_area_level_1 !== 'long_name' ? this.state.componentForm.administrative_area_level_1 : ''}
                        onChange={(e) => this.setFieldValue('administrative_area_level_1', e)}
                        style={{ width: '100%', marginTop: 10 }}
                        disabled={(this.props.isStateDisabled || this.props.isAllDisabled || !this.state.searchText) ? true : false}
                        onBlur={this.updateOnSelectData}
                    />}
                    {(this.props.isCityVisible || this.props.showAllFields) && <TextField
                        label={this.props.cityLabelText}
                        value={this.state.componentForm.locality && this.state.componentForm.locality !== 'long_name' ? this.state.componentForm.locality : ''}
                        onChange={(e) => this.setFieldValue('locality', e)}
                        style={{ width: '100%', marginTop: 10 }}
                        disabled={(this.props.isCityDisabled || this.props.isAllDisabled || !this.state.searchText) ? true : false}
                        onBlur={this.updateOnSelectData}
                    />}
                    {(this.props.isPinCodeVisible || this.props.showAllFields) && <TextField
                        label={this.props.pincodeLabelText}
                        value={this.state.componentForm.postal_code && this.state.componentForm.postal_code !== '00000' && this.state.componentForm.postal_code !== 'long_name' ? this.state.componentForm.postal_code : ''}
                        onChange={(e) => this.setFieldValue('postal_code', e)}
                        style={{ width: '100%', marginTop: 10 }}
                        disabled={(this.props.isPinCodeDisabled || this.props.isAllDisabled || !this.state.searchText) ? true : false}
                        onBlur={this.updateOnSelectData}
                    />}
                </div>}
            </div>
        );
    }
}

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
}

export default withStyles(styles)(GeoLocation);