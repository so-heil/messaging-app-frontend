module.exports = {
    purge: ["./pages/**/*.tsx", "./src/**/*.tsx"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                indigo: {
                    light: "#476894",
                    DEFAULT: "#5c6ac4",
                    dark: "#202e78",
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        outline: false,
    },
};
