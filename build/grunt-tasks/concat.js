/**
 * JS Concatenation Task
 * (just banner other stuff is configured by usemin)
 * ===============================
 */
module.exports = {
    options: {
        stripBanners: true,
            banner: '<%= meta.banner %>'
    },

    vendors: {
        options: {
            stripBanners: false,
                banner: '<%= meta.vendorBanner %>'
        },
        files: []
    }
};
