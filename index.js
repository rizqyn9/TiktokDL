const TikTokScraper = require('tiktok-scraper');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({data:[]}).write()

const options = {
    // Number of posts to scrape: {int default: 20}
    number: 10,
    
    // Set session: {string[] default: ['']}
    // Authenticated session cookie value is required to scrape user/trending/music/hashtag feed
    // You can put here any number of sessions, each request will select random session from the list
    sessionList: ['sid_tt=2064d02919a42cada8c2107323155e9a;'],

    // Set proxy {string[] | string default: ''}
    // http proxy: 127.0.0.1:8080
    // socks proxy: socks5://127.0.0.1:8080
    // You can pass proxies as an array and scraper will randomly select a proxy from the array to execute the requests
    proxy: '',

    // Set to {true} to search by user id: {boolean default: false}
    by_user_id: false,

    // How many post should be downloaded asynchronously. Only if {download:true}: {int default: 5}
    asyncDownload: 5,

    // How many post should be scraped asynchronously: {int default: 3}
    // Current option will be applied only with current types: music and hashtag
    // With other types it is always 1 because every request response to the TikTok API is providing the "maxCursor" value
    // that is required to send the next request
    asyncScraping: 3,

    // File path where all files will be saved: {string default: 'CURRENT_DIR'}
    filepath: `../`,

    // Custom file name for the output files: {string default: ''}
    fileName: `examples`,

    // Output with information can be saved to a CSV or JSON files: {string default: 'na'}
    // 'csv' to save in csv
    // 'json' to save in json
    // 'all' to save in json and csv
    // 'na' to skip this step
    filetype: `json`,

    // Set custom headers: user-agent, cookie and etc
    // NOTE: When you parse video feed or single video metadata then in return you will receive {headers} object
    // that was used to extract the information and in order to access and download video through received {videoUrl} value you need to use same headers
    headers: {
        'user-agent': "BLAH",
        referer: 'https://www.tiktok.com/',
        cookie: `tt_webid_v2=6908421225842034177`,
    },
    
    // Download video without the watermark: {boolean default: false}
    // Set to true to download without the watermark
    // This option will affect the execution speed
    noWaterMark: true,
    
    // Create link to HD video: {boolean default: false}
    // This option will only work if {noWaterMark} is set to {true}
    hdVideo: false,

    // verifyFp is used to verify the request and avoid captcha
    // When you are using proxy then there are high chances that the request will be 
    // blocked with captcha
    // You can set your own verifyFp value or default(hardcoded) will be used
    verifyFp: ''
};


(async () => {
    try {
        const user = await TikTokScraper.getUserProfileInfo('andiva.ns', options);
        // console.log(user);
        var total = user.stats.videoCount
        console.log(total);
        try {
            const posts = await TikTokScraper.user('andiva.ns', { 
                number: total, 
                sessionList: ['sid_tt=2064d02919a42cada8c2107323155e9a;'] 
            });
            // console.log(posts);
            arr = posts.collector.map((el)=>{
                // console.log(el,`\n\n\n===========`);
                let result = el.webVideoUrl;
                db.get('data').push(result).write()
                console.log(`${result}\n`);
            })
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
})();

// (async () => {
//     try {
//         const posts = await TikTokScraper.user('andiva.ns', { 
//             number: total, 
//             sessionList: ['sid_tt=2064d02919a42cada8c2107323155e9a;'] 
//         });
//         // console.log(posts);
//         arr = posts.collector.map((el)=>{
//             // console.log(el,`\n\n\n===========`);
//             let result = el.webVideoUrl;
//             db.get('data').push(result).write()
//             console.log(`${result}\n`);
//         })
//     } catch (error) {
//         console.log(error);
//     }
// })();








// (async () => {
//     try {
//         const posts = await TikTokScraper.user(`6790990212690904066`, { 
//             number: 10, 
//             by_user_id: true,
//             sessionList: ['sid_tt=58ba9e34431774703d3c34e60d584475;'] 
//         });
//         arr = posts.collector.map((el)=>{
//             // console.log(el,`\n\n\n===========`);
//             let result = el.webVideoUrl;
//             console.log(`${result}\n`);
//         })


//     } catch (error) {
//         console.log(error);
//     }
// })();

