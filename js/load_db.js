function LoadFile(url){
    let json = fetch(url).then(data=>data.json())
        json.then(data=> db = data).then(function(data){
            for(const key in db){
                localStorage.setItem(`${key}`,JSON.stringify(db[key]))
            }
        })
}
    function LoadDB(){
        if(!window.localStorage.getItem("IsDBLoaded")){
            LoadFile("../data/user.json")
            LoadFile("../data/order.json")
            LoadFile("../data/product.json")
            // LoadFile("../data/user.json")
            localStorage.setItem("IsDBLoaded",true)    
        }

        //     if(!window.localStorage.getItem("IsDBLoaded")){
        //         let json = fetch("../data/db.json").then(data=>data.json())
        //         json.then(data=> db = data).then(function(data){
        //             for(const key in db){
        //                 localStorage.setItem(`${key}`,JSON.stringify(db[key]))
        //             }
        //             localStorage.setItem("IsDBLoaded",true)    
        //         })
        // }
}
LoadDB()