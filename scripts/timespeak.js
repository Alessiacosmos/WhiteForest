
 'use strict'

var marked_cursor = require("marked")

function get_Allspeaks(speaksData){
    let speaks_jsonarr = [];
    for (let i = 0; i < speaksData.length; i++) {
        const item = speaksData[i]; 
        if (item.type==="code"&&item.lang === 'markdown'){
            var item_text = item.text.split(/\n/);
            // console.log("item_text: ", item_text);
            // date
            var item_date = item_text[0].split("date:")[1].replace(/^\s+|\s+$/g,"")
            // content内容
            var item_content = ""
            for (let ci=1; ci<item_text.length; ci++){
                var content_i = item_text[ci];
                content_i = content_i.replace("content:", "").replace(/^\s+|\s+$/g,"")
                if (ci === item_text.length-1){
                    item_content += content_i;
                } else {
                    item_content += content_i+"\n";
                }
                
            }
            // pack date and content to json
            var item_date_d = new Date(item_date);
            //console.log(marked_cursor.lexer(item_content))
            var speak = {"date": item_date_d, "date_str": item_date, "content": marked_cursor.parser(marked_cursor.lexer(item_content))};
            speaks_jsonarr.push(speak);
            
        }
    }
    // console.log("speaks: ", speaks_json);

    //sort
    speaks_jsonarr.sort(function (a, b) {
        return a.date.toISOString().localeCompare(b.date.toISOString() );
    });
    speaks_jsonarr.reverse();

    return speaks_jsonarr // {"speaks_all": speaks_jsonarr, "speaks_dates": speaks_dates, "speaks_contents": speaks_contents}
}

hexo.extend.generator.register("timespeak", function(locals) {
    for(let i = 0; i < locals.pages.data.length; i++) {
        // 通过locals获得本地json文件，然后读取该文件内容，转变成json格式的变量
        let pageInfo = locals.pages.data[i];
        //console.log("timespeack-js: ", i, pageInfo);
        if(pageInfo.source == "timespeak/index.md") { //"timeline/timeline.json"
            var timelineData = marked_cursor.lexer(pageInfo._content) 
            //console.log("timelineData: ", timelineData) 
            break;
        }
    }

    var timelines_data = get_Allspeaks(timelineData);

    
    return {
        path: "timespeak/index.html",
        data: {posts: timelines_data},
        layout: "timespeak"
    }
})

