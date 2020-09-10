var Auth = {
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    }
}

exports.getAuth = function(){
    return Auth
}

exports.setAuth = function(value){
    Auth = value
}