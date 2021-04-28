import React, { PureComponent } from "react";
import { VscSearch } from "react-icons/vsc";
import countriesObject from "@public/countries.json";
import classNames from "classnames";
import { Country } from "src/common/interfaces/Country";

interface Props {
    onClose: () => void;
    onCountrySelect: (country: Country) => void;
}
interface State {
    isFocused: boolean;
    query: string;
    filteredCountries?: typeof countriesObject;
}

class CountryPicker extends PureComponent<Props, State> {
    private countries: Country[];

    public constructor(props: Props) {
        super(props);
        this.countries = countriesObject;
        this.state = {
            isFocused: false,
            query: "",
        };
    }

    public render(): JSX.Element {
        const countries = this.state.filteredCountries ?? this.countries;

        return (
            <div
                className="bg-white absolute w-80"
                style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                }}
            >
                <header className="bg-gray-800 flex items-center justify-between p-4">
                    <h3 className="text-sm text-white font-semibold ">
                        Country
                    </h3>
                    <a
                        className="text-xs text-gray-300 hover:text-white font-semibold cursor-pointer"
                        onClick={() => this.props.onClose()}
                    >
                        Close
                    </a>
                </header>
                <div className="pb-2">
                    <div
                        className={classNames(
                            "flex items-center p-2 m-3 border border-gray-200 rounded transition delay-75",
                            {
                                "bg-gray-200": !this.state.isFocused,
                            },
                        )}
                    >
                        <VscSearch className="text-gray-400" />
                        <input
                            type="text"
                            value={this.state.query}
                            onChange={this.searchCountries}
                            onFocus={() => this.setState({ isFocused: true })}
                            onBlur={() => this.setState({ isFocused: false })}
                            className="bg-transparent w-full text-xs px-2 font-medium"
                            placeholder="Search"
                        />
                    </div>
                    <div className="overflow-y-auto h-80">
                        {countries.map(this.renderCountry)}
                    </div>
                </div>
            </div>
        );
    }

    private renderCountry = (country: Country): JSX.Element => (
        <div
            className="hover:bg-gray-100 flex items-center justify-between px-6 py-2 cursor-pointer"
            onClick={() => this.selectCountry(country)}
            key={`country-${country.name}-${country.dialCode}`}
        >
            <p className="text-xs font-normal">{country.name}</p>
            <span className="text-xs font-medium text-gray-600">
                {country.dialCode}
            </span>
        </div>
    );

    private searchCountries = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        const filteredCountries = this.countries.filter((country) =>
            country.name.toLowerCase().includes(query.toLowerCase()),
        );
        this.setState({ query, filteredCountries });
    };

    private selectCountry = (country: Country) => {
        this.props.onCountrySelect(country);
    };
}

export default CountryPicker;
