
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
        LoadFile("../data/orderItem.json")
        LoadFile("../data/cartItem.json")
        LoadFile("../data/category.json")

        localStorage.setItem("IsDBLoaded",true)    
    }
}

LoadDB();
