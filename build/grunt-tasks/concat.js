/**
 * JS Concatenation Task
 * (just banner other stuff is configured by usemin)
 * ===============================
 */
/*jshint node:true, camelcase:false */
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
