exports.codeClient = (type, code) => {
    code_list = {
        'success':{
            0:{
                "success": true,
                "reason":{
                    "code": 0,
                    "msg": "Credentials validated. Logging In!",
                    "show": true
                }
            },
            1:{
                "success": true,
                "reason":{
                    "code": 1,
                    "msg": "You already logged in! Redirecting to panel!",
                    "show": true
                }
            }
        },
        'failed':{
            0:{
                "success": false,
                "reason":{
                    "code": 0,
                    "msg": "Credentials are not true!",
                    "show": true
                }
            },
            1:{
                "success": false,
                "reason":{
                    "code": 1,
                    "msg": "Session is expired! Please login again.",
                    "show": true
                }
            },
            2:{
                "success": false,
                "reason":{
                    "code": 2,
                    "msg": "There are missing credentials!",
                    "show": true
                }
            },
            3:{
                "success": false,
                "reason":{
                    "code": 3,
                    "msg": "No session found!",
                    "show": false
                }
            }
        }

        }

        x = code_list[type][code];
    return x;
}