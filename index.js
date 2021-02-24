const wec = require('./website-evidence-collector')

/**
 * @Summary WEC runner function
 *
 * @param {Object} opts Options to run WEC with
 *
 * @param {number} opts.max Maximum number of extra links for browsing
 * @default opts.max 0
 *
 * @param {number} opts.sleep Time to sleep after every page load in ms
 * @default opts.sleep 3000
 *
 * @param {string[]} opts.firstParty_uri First-party URIs for links and pages
 *
 * @param {string[]} opts.browseLink Adds URI to list of links for browsing
 *
 * @param {string} opts.setCookie Cookie string or file to read cookies from
 *
 * @param {boolean} opts.headless Hides the browser window
 * @default opts.headless true
 *
 * @param {boolean} opts.dnt Send Do-Not-Track Header
 * @default opts.dnt false
 *
 * @param {boolean} opts.dntJs Set navigator.doNotTrack JS property, implies `opts.dnt`
 * @default opts.dntJs false
 *
 * @param {string} opts.output Output folder
 * @default opts.output null
 *
 * @param {boolean} opts.overwrite Overwrite potentially existing output folder without warning
 * @default opts.overwrite false
 *
 * @param {string} opts.title Title of the collection for display in output
 *
 * @param {string} opts.taskDescription Plain text of JSON for inclusion in output files
 * @default opts.taskDescription null
 *
 * @param {string[]} opts.browserOptions Arguments passed over to the browser (Chromium)
 * @default opts.browserOptions []
 *
 * @param {string} opts.browserProfile Directory containing a custom browser profile
 *
 * @param {boolean} opts.testssl Invoke testssl.sh and integrage its output
 *
 * @param {string} opts.testsslExecutable location of testssl.sh
 *
 * @param {string} testsslFile include [JSON FILE] from testssl.sh in output
 *
 * @param {string} lang change browser language (2-character ISO contry code)
 * @default lang 'en'
 *
 * @param {number} pageTimeout Page load timeout in ms (0 to disable)
 * @default pageTimeout 0
 *
 * @returns Promise resolving to WEC's output object. If any exception is thrown during WEC
 *          execution, it will reject with that exception's error message
 */

const WEC = function(opts) {
    /**
     * The defaults I'm overwriting here are entirely driven by the idea for WEC to be run from code
     * in the background, hence all output to stdout is suppressed.
     * Output can still be set if so required.
     */
    this.argv = Object.assign({
        max: 0,
        sleep: 3000,
        firstPartyUri: [],
        headless: true,
        dnt: false,
        dntJs: false,
        output: null,
        overwrite: false,
        taskDescription: null,
        browserOptions: [],
        lang: 'en',
        pageTimeout: 0,
        browseURLs: []
    }, opts, {
        quiet: true,
        yaml: false,
        json: false,
        html: false,
    });
}

WEC.prototype = {
    /**
     *
     * @param {string[]} browseURLs URLs to browse
     */
    run: async function(browseURLs=[]){
        if (browseURLs) {
            this.argv._ = browseURLs
        } else if (this.argv.browseURLs && this.argv.browseURLs !== []){
            this.argv._ = this.argv.browseURLs
        } else {
            throw new Error("No browse URL was provided")
        }

        return new Promise((resolve, reject) => {
            try {
                const output = wec(this.argv);
                resolve(output);
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = WEC