/*

Name

*/


function getForgetPasswordPayload(email){
    return {
        method:"company.forgot_password",
        params:{
            email:email
        }
    }
}

